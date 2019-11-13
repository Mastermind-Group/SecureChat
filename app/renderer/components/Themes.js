import React, { useState } from "react"

import { connect } from "react-redux"
import { changeTheme } from "../actions/themeActions"

import { Switch } from "@material-ui/core"

import { ChromePicker, } from "react-color"

const Theme = props => {
    const [darkMode, setDark] = useState(props.theme.currentTheme.palette.type)

    const handlePrimaryChange = ({ hex }) => {
        props.changeTheme({
            palette: {
                ...props.theme.currentTheme.palette,
                primary: {
                    main: hex
                }
            }
        })
    }

    const handleSecondaryChange = ({ hex }) => {
        props.changeTheme({
            palette: {
                ...props.theme.currentTheme.palette,
                secondary: {
                    main: hex
                }
            }
        })
    }

    const changeDarkMode = _ => {
        console.log(props.theme.currentTheme.palette)
        props.changeTheme({
            palette: {
                primary: props.theme.currentTheme.palette.primary,
                secondary: props.theme.currentTheme.palette.secondary,
                type: props.theme.currentTheme.palette.type === "light" ? "dark" : "light"
            }
        })
    }

    return (
        <>

            <ChromePicker
                color={props.theme.currentTheme.palette.primary.main}
                onChangeComplete={handlePrimaryChange}
            />

            <ChromePicker
                color={props.theme.currentTheme.palette.secondary.main}
                onChangeComplete={handleSecondaryChange}
            />

            <Switch value = {props.theme.currentTheme.palette.type !== "dark"} onChange = {changeDarkMode} />
        </>
    )
}

const mapStateToProps = state => {
    return {
        theme: state.theme
    }
}

export default connect(mapStateToProps, { changeTheme })(Theme)