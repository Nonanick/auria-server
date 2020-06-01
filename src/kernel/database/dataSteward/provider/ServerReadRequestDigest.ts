import { DataStewardReadResponse } from "aurialib2";
import { ServerReadRequest } from "./ServerReadRequest.js";

export type ServerReadRequestDigest = (request : ServerReadRequest) => Promise<DataStewardReadResponse>;