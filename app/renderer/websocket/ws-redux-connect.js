import store from "../store/store"

import { setWebsocketStatus } from "../actions/connectionActions"

import { handleMessage } from "./ws-message-handler"

export const WebsocketOpen = _ => {
    console.log("Websocket opened")
    store.dispatch(setWebsocketStatus(true))
}

export const WebsocketMessage = handleMessage

export const WebsocketError = err => {
    console.log("Websocket error:", err)
}

export const WebsocketClose = _ => {
    //console.log("Websocket server closed")
    store.dispatch(setWebsocketStatus(false))
}