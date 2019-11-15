import { handleMessage } from "./ws-message-handler"

export const WebsocketOpen = _ => {
    console.log("WebSocket opened")
}

export const WebsocketMessage = handleMessage

export const WebsocketError = err => {
    console.error("Websocket error:", err)
}

export const WebsocketClose = _ => {
    // eslint-disable-next-line no-undef
    console.log("Websocket closed")
}