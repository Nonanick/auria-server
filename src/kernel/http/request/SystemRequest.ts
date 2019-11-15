import { Request } from 'express-serve-static-core';
import { System } from '../../System';

export interface SystemRequest extends Request {

    getSystem: () => System;

    getSystemName: () => String;


}