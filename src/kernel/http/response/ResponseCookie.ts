import { CookieOptions } from "express";

export interface ResponseCookie {
    name : string;
    value : string;
    options : CookieOptions;
}