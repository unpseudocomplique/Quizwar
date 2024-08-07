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
    join: (peer, data: { room: string }) => {
        peer.subscribe(data.room);
        peer.publish(data.room, "Another user joined");
    },
    message: (peer, data: { room: string, message: string }) => {
        peer.publish(data.room, data.message)
    },
    close: (peer, data: { room: string }) => {
        peer.publish(data.room, "Another user left");
        peer.unsubscribe(data.room)
    }
}