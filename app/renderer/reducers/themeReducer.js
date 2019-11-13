import { GET_THEMES, CHANGE_THEME } from "../actions/themeActions"

import { createMuiTheme } from "@material-ui/core/styles"

import storage from "electron-json-storage"

const defaultTheme = createMuiTheme()

const initialState = {
    currentTheme: defaultTheme
}

let timeout = null

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_THEMES: 
            return { ...state, currentTheme: action.theme }
        case CHANGE_THEME:
            const newTheme = createMuiTheme(action.theme)

            clearTimeout(timeout)

            timeout = setTimeout(_ => {
                storage.set("theme", newTheme, (err) => {
                    console.log(err)
                })
            }, 1000)

            return { ...state, currentTheme: newTheme }
        default: 
            return state;
    }
}