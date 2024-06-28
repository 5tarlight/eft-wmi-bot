import { RequestHandler } from "express";
import { helloRequestHandler } from "./helloRequestRoute";
import { verifyRequestHandler } from "./verifyRequestRoute";

export interface Route {
  method: "get" | "post" | "put" | "delete";
  url: string;
  handler: RequestHandler;
}

export const routes: Route[] = [
  {
    method: "get",
    url: "/",
    handler: helloRequestHandler,
  },
  {
    method: "post",
    url: "/verify",
    handler: verifyRequestHandler,
  },
];
