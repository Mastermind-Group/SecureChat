import { OPEN_WEBSOCKET, SEND_DATA, CLOSE_WEBSOCKET } from "../actions/socketActions"

const initialState = {
    websocket: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case OPEN_WEBSOCKET: 
            return { ...state, websocket: action.websocket }
        case SEND_DATA:
            if(state.websocket && state.websocket.send) {
                state.websocket.send(action.data, (err) => {
                    console.error(err)
                })
            }
            
            return state
        case CLOSE_WEBSOCKET:
            if(state.websocket && state.websocket.close) {
                state.websocket.close()
            }
            
            return { ...state, websocket: null }
        default: 
            return state
    }
}