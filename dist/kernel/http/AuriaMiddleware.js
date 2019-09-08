"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuriaMiddleware {
    constructor(req, res, next) {
        this.req = req;
        this.expressReq = req.getRawRequest();
        this.res = res;
        this.expressRes = res.getRawResponse();
        this.nextHandler = next;
    }
}
exports.AuriaMiddleware = AuriaMiddleware;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFNaWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9odHRwL0F1cmlhTWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLE1BQXNCLGVBQWU7SUFVakMsWUFBWSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsSUFBdUI7UUFFeEUsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV0QyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXZDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7Q0FJSjtBQXZCRCwwQ0F1QkMifQ==