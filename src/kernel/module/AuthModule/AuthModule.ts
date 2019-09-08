import { Module } from "../Module";
import { System } from "../../System";

export class AuthModule extends Module {


    constructor(system : System) {
        super(system, "AuthModule");
    }

    public loadTranslations() {
        return {};
    }
    
}