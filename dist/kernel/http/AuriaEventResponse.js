"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
class AuriaEventResponse extends events_1.EventEmitter {
    constructor(response, user) {
        super();
        this.user = user;
        this.response = response;
        this.response.getRawResponse().status(200).set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    }
    getUser() {
        return this.user;
    }
    closeConnection() {
        this.response.getRawResponse().emit('close');
    }
    sendData(event, data, id) {
        let parsed = JSON.stringify(data);
        let pieces = parsed.replace("\n\n", "\n \n").split("\n");
        let piecesFixed = pieces.map((val) => { return "data: " + val; });
        let str = piecesFixed.join("\n");
        this.response.getRawResponse().write((id == null ? "" : "id: " + id + "\n") +
            "event: " + event + "\n"
            + str
            + "\n\n");
    }
}
exports.AuriaEventResponse = AuriaEventResponse;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXVyaWFFdmVudFJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2tlcm5lbC9odHRwL0F1cmlhRXZlbnRSZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUFzQztBQUd0QyxNQUFhLGtCQUFtQixTQUFRLHFCQUFZO0lBVWhELFlBQVksUUFBdUIsRUFBRSxJQUFnQjtRQUNqRCxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBRXpCLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUMzQyxjQUFjLEVBQUUsbUJBQW1CO1lBQ25DLGVBQWUsRUFBRSxVQUFVO1lBQzNCLFlBQVksRUFBRSxZQUFZO1NBQzdCLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFTSxPQUFPO1FBQ1YsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxlQUFlO1FBQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVNLFFBQVEsQ0FBQyxLQUFhLEVBQUUsSUFBUyxFQUFFLEVBQVc7UUFFakQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsQyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekQsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLEdBQUcsT0FBTyxRQUFRLEdBQUcsR0FBRyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakUsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQUssQ0FDaEMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ3RDLFNBQVMsR0FBRyxLQUFLLEdBQUcsSUFBSTtjQUN0QixHQUFHO2NBQ0gsTUFBTSxDQUNYLENBQUM7SUFDTixDQUFDO0NBRUo7QUEvQ0QsZ0RBK0NDIn0=