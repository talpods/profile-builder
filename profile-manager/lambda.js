import serverlessExpress from "@vendia/serverless-express";
import app from "./index.js";

export const handler = serverlessExpress({ app });
