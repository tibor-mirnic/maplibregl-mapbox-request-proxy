import fetch from "node-fetch";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: `.env.local`, override: true });

const accessToken = process.env.MAP_BOX_ACCESS_TOKEN;
const port = 3005;
const app = express();

const accessTokenRegex = /\?access_token=[^\\"]*/g;

app.get("/proxy", async (req, res) => {
  console.log(req.query);
  const { resourceUrl } = req.query as { resourceUrl: string };

  let hasParams = false;
  if (resourceUrl.lastIndexOf("?") > -1) {
    hasParams = true;
  }

  const apiUrl = `${resourceUrl}${
    hasParams ? "&" : "?"
  }access_token=${accessToken}`;

  const mapRes = await fetch(apiUrl);
  const contentTypeHeader = mapRes.headers.get("content-type");

  if (contentTypeHeader && contentTypeHeader.indexOf("application/json") > -1) {
    const dataRaw = await mapRes.text();
    const stripped = dataRaw.replace(accessTokenRegex, "");
    const strippedJson = JSON.parse(stripped);

    res.status(mapRes.status);
    res.send(strippedJson);
  } else {
    mapRes.body?.pipe(res);
  }
});

app.listen(port, () => {
  console.log(`Maps listening on port ${port}`);
});
