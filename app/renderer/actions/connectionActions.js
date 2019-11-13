export const SERVER_STATUS = "SERVER_STATUS"
export const WEBSOCKET_STATUS = "WEBSOCKET_STATUS"

export const setServerStatus = status => dispatch => {
    dispatch({
        type: SERVER_STATUS,
        status
    })
}

export const setWebsocketStatus = status => dispatch => {
    dispatch({
        type: WEBSOCKET_STATUS,
        status
    })
}
