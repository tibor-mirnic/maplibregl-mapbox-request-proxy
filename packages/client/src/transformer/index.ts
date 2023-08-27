import { RequestTransformFunction } from "maplibre-gl";
import { isMapboxURL, transformMapboxUrl } from "./mapbox";
import { ResourceType } from "./models";

export const transformRequest: RequestTransformFunction = (
  url: string,
  resourceType
) => {
  const resType = resourceType as unknown as ResourceType;
  if (isMapboxURL(url)) {
    return transformMapboxUrl(url, resType);
  }

  return { url };
};
