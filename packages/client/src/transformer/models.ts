export type UrlObject = {
  protocol: string;
  authority: string;
  path: string;
  params: Array<string>;
};

export enum ResourceType {
  Glyphs = "Glyphs",
  Image = "Image",
  Source = "Source",
  SpriteImage = "SpriteImage",
  SpriteJSON = "SpriteJSON",
  Style = "Style",
  Tile = "Tile",
  Unknown = "Unknown",
}

export type TransformMapboxUrl = (
  url: string,
  resourceType?: ResourceType
) => {
  url: string;
};
