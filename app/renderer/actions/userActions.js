export const SET_USER = "SET_USER"
export const LOAD_USER = "LOAD_USER"
export const LOGOUT = "LOGOUT"

export const setUser = (user, privateKey, token, password) => dispatch => {
    dispatch({
        type: SET_USER,
        user,
        privateKey,
        token,
        password
    })
}

export const loadUser = (userFromStorage) => dispatch => {
    dispatch({
        type: LOAD_USER,
        user: userFromStorage
    })
}

export const logout = _ => dispatch => {
    dispatch({
        type: LOGOUT
    })
}