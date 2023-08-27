import { ResourceType, TransformMapboxUrl, UrlObject } from "./models";
import webpSupported from "./webp-supported";

const API_URL = "https://api.mapbox.com";
const urlRegex = /^(\w+):\/\/([^/?]*)(\/[^?]+)?\??(.+)?/;

export const transformMapboxUrl: TransformMapboxUrl = (url, resourceType) => {
  if (url.indexOf("/styles/") > -1 && url.indexOf("/sprite") === -1) {
    return { url: normalizeStyleURL(url) };
  }

  if (url.indexOf("/sprites/") > -1) {
    return { url: normalizeSpriteURL(url) };
  }

  if (url.indexOf("/fonts/") > -1) {
    return { url: normalizeGlyphsURL(url) };
  }

  if (url.indexOf("/v4/") > -1) {
    if (url.lastIndexOf("tiles") > -1) {
      return { url: normalizeTileURL(url) };
    }

    return { url: normalizeSourceURL(url) };
  }

  if (resourceType === ResourceType.Source) {
    return { url: normalizeSourceURL(url) };
  }

  return { url };
};

export const isMapboxURL = (url: string) => {
  return url.indexOf("mapbox:") === 0 || url.indexOf("tiles") > -1;
};

const parseUrl = (url: string): UrlObject => {
  const parts = url.match(urlRegex);

  if (!parts) {
    throw new Error("Unable to parse URL object");
  }

  return {
    protocol: parts[1],
    authority: parts[2],
    path: parts[3] || "/",
    params: parts[4] ? parts[4].split("&") : [],
  };
};

const formatUrl = (obj: UrlObject, tiles: boolean = false): string => {
  const params = obj.params.length ? `?${obj.params.join("&")}` : "";

  return `/maps/proxy?${tiles ? "tiles&" : ""}resourceUrl=${obj.protocol}://${
    obj.authority
  }${obj.path}${params}`;
};

const makeApiUrl = (urlObject: UrlObject, tiles?: boolean): string => {
  const apiUrlObject = parseUrl(API_URL);
  urlObject.protocol = apiUrlObject.protocol;
  urlObject.authority = apiUrlObject.authority;

  if (urlObject.protocol === "http") {
    const i = urlObject.params.indexOf("secure");
    if (i >= 0) urlObject.params.splice(i, 1);
  }

  if (apiUrlObject.path !== "/") {
    urlObject.path = `${apiUrlObject.path}${urlObject.path}`;
  }

  return formatUrl(urlObject, tiles);
};

const normalizeStyleURL = (url: string): string => {
  const urlObject = parseUrl(url);
  urlObject.path = `/styles/v1${urlObject.path}`;

  return makeApiUrl(urlObject);
};

const normalizeGlyphsURL = (url: string): string => {
  const urlObject = parseUrl(url);
  urlObject.path = `/fonts/v1${urlObject.path}`;

  return makeApiUrl(urlObject);
};

const normalizeSourceURL = (url: string): string => {
  const urlObject = parseUrl(url);
  urlObject.path = `/v4/${urlObject.authority}.json`;
  // TileJSON requests need a secure flag appended to their URLs so
  // that the server knows to send SSL-ified resource references.
  urlObject.params.push("secure");
  return makeApiUrl(urlObject);
};

const normalizeSpriteURL = (url: string): string => {
  const urlObject = parseUrl(url);
  const path = urlObject.path.split("@");
  // const pathNext = path[0].split("@");
  // urlObject.path = `/styles/v1${pathNext[0]}/sprite@${pathNext[1]}.${path[1]}`;
  // mapbox://sprites/mapbox/streets-v12@2x.json

  urlObject.path = `/styles/v1${path[0]}/sprite@${path[1]}`;

  return makeApiUrl(urlObject);
};

const imageExtensionRegex = /(\.(png|jpg)\d*)(?=$)/g;
const tileURLAPIPrefixRegex = /^.?\/v4\//g;
const normalizeTileURL = (
  tileURL: string,
  tileSize?: number | null
): string => {
  const urlObject = parseUrl(tileURL);

  // The v4 mapbox tile API supports 512x512 image tiles only when @2x
  // is appended to the tile URL. If `tileSize: 512` is specified for
  // a Mapbox raster source force the @2x suffix even if a non hidpi device.
  const suffix = devicePixelRatio >= 2 || tileSize === 512 ? "@2x" : "";
  const extension = webpSupported.supported ? ".webp" : "$1";
  urlObject.path = urlObject.path.replace(
    imageExtensionRegex,
    `${suffix}${extension}`
  );
  urlObject.path = urlObject.path.replace(tileURLAPIPrefixRegex, "/");
  urlObject.path = `/v4${urlObject.path}`;

  return makeApiUrl(urlObject, true);
};
