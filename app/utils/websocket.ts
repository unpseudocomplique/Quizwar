export enum actionTypeEnum {
    JOIN = 'join',
    CLOSE = 'close',
    MESSAGE = 'message'
}

export class WebSocketMessage {
    type: actionTypeEnum;
    room: string;
    message: any


    /**
     * Constructor of WebSocketMessage
     * @param {actionTypeEnum} type Type of action 
     * @param {string} room Room to do the action
     * @param {any} data Message to send in the room
     */
    constructor(type,room,message) {
        this.type = type;
        this.room = room;
        this.message = message;
    }

    toString() {
        return JSON.stringify({ type: this.type, room: this.room, message: this.message })
    }
}