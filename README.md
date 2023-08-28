# maplibregl-mapbox-request-proxy

This repo provides an example on how to secure access token, required by `MapBox`, by proxying requests.

Most of the heavy lifting is done on the client side. Server has two purposes:

- Append the access token on each request
- Cleanup the access token from `MapBox Api` response (`tiles` urls)

Necessary utilities for request transformation are located in [mapbox](packages/client/src/transformer/mapbox.ts).

# Usage

```jsx
import { transformRequest } from "./transformer";

<Map
  mapStyle="mapbox://styles/mapbox/streets-v12"
  transformRequest={transformRequest}
/>;
```

# Install

Install packages with `npm ci`.

# Run

Run `npm run start` which will run `client` and `server` in parallel.

### Access Token

Token is loaded as an environment variable, either update [.env](packages/server/.env) or create `.env.local`.

# Acknowledgements

This example is based on the [maplibregl-mapbox-request-transformer](https://github.com/rowanwins/maplibregl-mapbox-request-transformer/tree/main) which is adopted from [maplibre-gl-js/mapbox](https://github.com/maplibre/maplibre-gl-js/blob/04ff47d53ec16e17b92475fe9028c1477f6df02f/src/util/mapbox.ts).
