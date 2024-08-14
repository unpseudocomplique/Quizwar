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
        console.log('message on WS', message);

        const data = JSON.parse(message.text())

        events[data.type]?.(peer, data)

    }
})

const events = {
    join: (peer, data: { type: 'join', room: string }) => {
        peer.subscribe(data.room);
        peer.publish(data.room, { type: 'join', room: data.room });
    },
    answer: (peer, data: { type: 'answer', room: string, player: { id: string, username: string } }) => {
        peer.publish(data.room, data)
    },
    startgame: (peer, data: { room: string, type: 'startgame' }) => {
        peer.publish(data.room, data)
    },
    close: (peer, data: { room: string }) => {
        peer.publish(data.room, "Another user left");
        peer.unsubscribe(data.room)
    }
}