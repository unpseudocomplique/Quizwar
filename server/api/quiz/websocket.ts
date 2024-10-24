export default defineWebSocketHandler({
    open(peer) {
    },
    close(peer, event) {
        console.log('close WS', peer);
    },
    error(peer, error) {
        console.log('error on WS', peer, error)
    },
    message(peer, message) {
        const data = JSON.parse(message.text())
        events[data.type]?.(peer, data)

    }
})

const events = {
    join: (peer, data: { type: 'join', room: string, player: { id: string, username: string, email: string } }) => {
        peer.subscribe(data.room);
        peer.publish(data.room, { type: 'join', room: data.room, player: data.player });
    },
    answer: (peer, data: { type: 'answer', room: string, player: { id: string, username: string } }) => {
        peer.publish(data.room, data)
    },
    startgame: (peer, data: { room: string, type: 'startgame' }) => {
        peer.publish(data.room, data)
    },
    powerUsed: (peer, data: { room: string, type: 'powerUsed', player: { id: string, username: string }, power: { power: string, questionId: string, gameId: string, originPlayerId: string } }) => {
        peer.publish(data.room, data)
    },
    close: (peer, data: { room: string, playerId: string }) => {
        peer.publish(data.room, { playerId: data.playerId });
        peer.unsubscribe(data.room)
    },
    playerReady: (peer, data: { room: string, type: 'playerReady', player: string }) => {
        peer.publish(data.room, data);
    },
}