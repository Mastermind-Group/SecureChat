export const GET_THEMES = "GET_THEMES"
export const CHANGE_THEME = "CHANGE_THEME"

import { createMuiTheme } from "@material-ui/core"

import storage from "electron-json-storage"

export const getThemes = _ => dispatch => {
    storage.get("theme", (err, data) => {
        if(Object.entries(data).length === 0 && data.constructor === Object)
            dispatch({
                type: GET_THEMES,
                theme: createMuiTheme()
            })
        else 
            dispatch({
                type: GET_THEMES,
                theme: createMuiTheme(data)
            })
    })
}

export const changeTheme = theme => dispatch => {
    dispatch({
        type: CHANGE_THEME,
        theme
    })
}
