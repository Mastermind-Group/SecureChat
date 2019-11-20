import { SET_USER, LOAD_USER, LOGOUT } from "../actions/userActions"

import storage from "electron-json-storage"

const initialState = {}

export default function(state = initialState, action) {
    switch(action.type) {
        case SET_USER: {
            const { user, password } = action

            const userState = {
                _id: user._id,
                username: user.username,
                password,
                publicKey: user.publicKey,
                privateKey: action.privateKey,
                protectedKey: user.protectedKey,
                token: action.token
            }

            storage.set("userData", userState)
            
            return userState
        }
        case LOAD_USER:
            return { ...action.user }
        case LOGOUT: 
            storage.set("userData", {})
            return {}
        default: 
            return state
    }
}