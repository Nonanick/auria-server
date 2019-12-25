"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerRequestFactory {
    static promote(request) {
        let bodyData = Object.assign({}, request.body, request.query);
        let serverReq = Object.assign({
            //
            getRequiredParam: (...param) => {
                let properAns = {};
                param.forEach((p) => {
                    if (bodyData[p] != null) {
                        if (param.length == 1) {
                            properAns = bodyData[p];
                        }
                        else {
                            properAns[p] = bodyData[p];
                        }
                    }
                    else {
                        console.error("[AuriaRequest] Failed to proccess request, parameter '" + p + "' was not provided!");
                        throw new Error("Wrong request, a required parameter was not provided!");
                    }
                });
                return properAns;
            },
            //
            getParam: (name) => {
                if (bodyData[name] == null) {
                    return "";
                }
                else {
                    return bodyData[name];
                }
            },
            //
            hasParam: (name) => {
                return bodyData[name] !== undefined;
            },
            //
            getIp: () => {
                return request.ip;
            },
            //
            getUserAgent: () => {
                return request.headers['user-agent'];
            },
            //
            getCookie: (name) => {
                if (request.cookies != null) {
                    return request.cookies[name] == null ? "" : request.cookies[name];
                }
                else
                    return "";
            }
        }, request);
        return serverReq;
    }
}
exports.ServerRequestFactory = ServerRequestFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyUmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9rZXJuZWwvaHR0cC9yZXF1ZXN0L1NlcnZlclJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFhQSxNQUFhLG9CQUFvQjtJQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWdCO1FBQ2xDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTlELElBQUksU0FBUyxHQUFrQixNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3pDLEVBQUU7WUFDRixnQkFBZ0IsRUFBRSxDQUFDLEdBQUcsS0FBZSxFQUFFLEVBQUU7Z0JBQ3JDLElBQUksU0FBUyxHQUF5QyxFQUFFLENBQUM7Z0JBRXpELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFTLEVBQUUsRUFBRTtvQkFDeEIsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO3dCQUNyQixJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFOzRCQUNuQixTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMzQjs2QkFBTTs0QkFDRixTQUFpQixDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDdkM7cUJBQ0o7eUJBQU07d0JBQ0gsT0FBTyxDQUFDLEtBQUssQ0FBQyx3REFBd0QsR0FBRyxDQUFDLEdBQUcscUJBQXFCLENBQUMsQ0FBQzt3QkFDcEcsTUFBTSxJQUFJLEtBQUssQ0FBQyx1REFBdUQsQ0FBQyxDQUFDO3FCQUM1RTtnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxPQUFPLFNBQVMsQ0FBQztZQUNyQixDQUFDO1lBRUQsRUFBRTtZQUNGLFFBQVEsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFO2dCQUN2QixJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7b0JBQ3hCLE9BQU8sRUFBRSxDQUFDO2lCQUNiO3FCQUFNO29CQUNILE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN6QjtZQUNMLENBQUM7WUFFRCxFQUFFO1lBQ0YsUUFBUSxFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUU7Z0JBQ3ZCLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLFNBQVMsQ0FBQztZQUN4QyxDQUFDO1lBRUQsRUFBRTtZQUNGLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ1IsT0FBTyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ3RCLENBQUM7WUFFRCxFQUFFO1lBQ0YsWUFBWSxFQUFFLEdBQUcsRUFBRTtnQkFDZixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFXLENBQUM7WUFDbkQsQ0FBQztZQUVELEVBQUU7WUFDRixTQUFTLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRTtnQkFDeEIsSUFBSSxPQUFPLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRTtvQkFDekIsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNyRTs7b0JBRUcsT0FBTyxFQUFFLENBQUM7WUFDbEIsQ0FBQztTQUNKLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFWixPQUFPLFNBQVMsQ0FBQztJQUNyQixDQUFDO0NBQ0o7QUE3REQsb0RBNkRDIn0=