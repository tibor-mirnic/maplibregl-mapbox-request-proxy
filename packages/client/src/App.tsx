import Map, { Marker } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { transformRequest } from "./transformer";

const latitude = 41.27930156094704;
const longitude = -72.59843080618522;

export const App = () => {
  return (
    <Map
      initialViewState={{
        latitude,
        longitude,
        zoom: 16,
      }}
      reuseMaps
      style={{ position: "absolute", inset: 0 }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      transformRequest={transformRequest}
    >
      <Marker
        longitude={longitude}
        latitude={latitude}
        color="red"
        anchor="bottom"
      />
    </Map>
  );
};
