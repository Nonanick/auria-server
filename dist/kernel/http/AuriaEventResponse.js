import { EventEmitter } from "events";
export class AuriaEventResponse extends EventEmitter {
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
