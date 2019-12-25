"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListenerRequestFactory {
    static make(request, listener) {
        let listRequest = Object.assign({
            getTranslations: (lang) => {
                return {}; //request.getSystem().getTranslator().getTranslations(lang)!;
            },
            getListener: () => listener,
            getListenerName: () => listener.name,
        }, request);
        return listRequest;
    }
}
exports.ListenerRequestFactory = ListenerRequestFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdGVuZXJSZXF1ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2tlcm5lbC9odHRwL3JlcXVlc3QvTGlzdGVuZXJSZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBYUEsTUFBYSxzQkFBc0I7SUFFeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFzQixFQUFFLFFBQXdCO1FBRS9ELElBQUksV0FBVyxHQUFvQixNQUFNLENBQUMsTUFBTSxDQUM1QztZQUNJLGVBQWUsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFO2dCQUM5QixPQUFPLEVBQUUsQ0FBQyxDQUFBLDZEQUE2RDtZQUMzRSxDQUFDO1lBQ0QsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVE7WUFDM0IsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJO1NBQ3ZDLEVBQ0QsT0FBTyxDQUFDLENBQUM7UUFFYixPQUFPLFdBQVcsQ0FBQztJQUV2QixDQUFDO0NBQ0o7QUFqQkQsd0RBaUJDIn0=