import { SERVER_STATUS, WEBSOCKET_STATUS } from "../actions/connectionActions"

const initialState = {
    serverConnected: false,
    websocketConnected: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SERVER_STATUS: 
            return { ...state, serverConnected: action.status }
        case WEBSOCKET_STATUS:
            return { ...state, websocketConnected: action.status }
        default: 
            return state
    }
}