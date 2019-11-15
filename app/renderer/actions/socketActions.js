export const OPEN_WEBSOCKET = "OPEN_WEBSOCKET"
export const CLOSE_WEBSOCKET = "CLOSE_WEBSOCKET"

import { WEBSOCKET_STATUS } from "./connectionActions"

import websocket from "ws"
import { 
    WebsocketOpen, 
    WebsocketMessage, 
    WebsocketError, 
    WebsocketClose 
} from "../websocket/ws-redux-connect"

export const openWebsocket = token => dispatch => {
    const client = new websocket("wss://servicetechlink.com/ws", {
        headers: {
            "Authorization": token
        }
    })

    client.onopen = _ => {
        WebsocketOpen()

        dispatch({
            type: WEBSOCKET_STATUS,
            status: true
        })
    }

    client.onmessage = message => {
        const parsed = JSON.parse(message.data)
        WebsocketMessage(parsed)
    }

    client.onerror = err => {
        WebsocketError(err)
    }

    client.onclose = _ => {
        WebsocketClose()
        
        dispatch({
            type: CLOSE_WEBSOCKET
        })
        dispatch({
            type: WEBSOCKET_STATUS,
            status: false
        })
    }

    dispatch({
        type: OPEN_WEBSOCKET,
        websocket: client
    })
}

export const closeWebsocket = _ => dispatch => {
    dispatch({
        type: CLOSE_WEBSOCKET
    })
}
