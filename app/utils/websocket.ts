import type { TPostedPlayerAnswer } from '../../types/player';
import type { TPostedPower } from '../../types/game';

export enum actionTypeEnum {
    JOIN = 'join',
    CLOSE = 'close',
    MESSAGE = 'message',
    ANSWER = 'answer',
    START_GAME = 'startgame',
    POWER_USED = 'powerUsed',
    PLAYER_READY = 'playerReady'
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
    constructor(type,room,message = '{}') {
        this.type = type;
        this.room = room;
        this.message = message;
    }

    toString() {
        const message = JSON.parse(this.message);
        return JSON.stringify({ type: this.type, room: this.room, ...message })
    }
}

export class Room {
    room: string
    send: any
    

    constructor(send: any, room: string) {
        this.send = send
        this.room = room
    }

    join() {
        this.send(getGameEventMessage(actionTypeEnum.JOIN, this.room, undefined))
    }

    startGame() {
        this.send(getGameEventMessage(actionTypeEnum.START_GAME, this.room, undefined ))
    }

    sendAnswer(player: any, answer: TPostedPlayerAnswer) {
        this.send(getGameEventMessage(actionTypeEnum.ANSWER, this.room,{ player: player, answer: answer }))
    }

    sendPlayerReady(playerId: string) {
        this.send(getGameEventMessage(actionTypeEnum.PLAYER_READY, this.room, { player: playerId }))
    }

    usePower(power: TPostedPower) {
        this.send(getGameEventMessage(actionTypeEnum.POWER_USED, this.room, { power: power }))
    }
}

export const getGameEventMessage = <T extends Record<string, V>, V>(type: actionTypeEnum, room: string, message: T | undefined) => {
    return JSON.stringify({ type: type, room: room, ...(message ? message : {}) })
}