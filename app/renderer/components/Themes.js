import React from "react"

import { connect } from "react-redux"

import { changeTheme } from "../actions/themeActions"

import { Switch, Divider } from "@material-ui/core"
import { ChromePicker } from "react-color"

const Theme = props => {
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
        props.changeTheme({
            palette: {
                primary: props.theme.currentTheme.palette.primary,
                secondary: props.theme.currentTheme.palette.secondary,
                type: props.theme.currentTheme.palette.type === "light" ? "dark" : "light"
            }
        })
    }

    const contrastText = props.theme.currentTheme.palette.getContrastText(props.theme.currentTheme.palette.background.default)

    return (
        <div style = {{ flex: "1 1 auto", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <div style = {divStyle}>
                <h3 style = {titleStyle(contrastText)}>Primary Color</h3>
                <ChromePicker
                    color={props.theme.currentTheme.palette.primary.main}
                    onChangeComplete={handlePrimaryChange}
                />
            </div>

            <Divider />

            <div style = {divStyle}>
                <h3 style = {titleStyle(contrastText)}>Secondary Color</h3>
                <ChromePicker
                    color={props.theme.currentTheme.palette.secondary.main}
                    onChangeComplete={handleSecondaryChange}
                />
            </div>

            <Divider />

            <div style = {divStyle}>
                <h3 style = {titleStyle(contrastText)}>Toggle Dark Mode</h3>
                <Switch value = {props.theme.currentTheme.palette.type !== "dark"} onChange = {changeDarkMode} />
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        theme: state.theme
    }
}

export default connect(mapStateToProps, { changeTheme })(Theme)

const divStyle = {
    padding: 15
}

const titleStyle = (contrast) => ({
    color: contrast
})