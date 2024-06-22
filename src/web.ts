import express from "express";
import { WEB_PORT } from "./config";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export const startWebServer = () =>
  app.listen(WEB_PORT, () => {
    console.log(`Server is running on http://localhost:${WEB_PORT}`);
  });
