import { RequestHandler } from "express";

export const helloRequestHandler: RequestHandler = async (req, res) => {
  res.send("Hello. This is EFT: wmi HTTP server.");
};
