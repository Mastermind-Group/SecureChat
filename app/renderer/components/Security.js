import React, { useState } from "react"

import { connect } from "react-redux"
import { withTheme, useTheme } from "@material-ui/core"

import { remote } from "electron"
import storage from "electron-json-storage"
import fs from "fs"
import path from "path"

import { FaCheck, FaTimes } from "react-icons/fa"
import { Divider, Button, CircularProgress } from "@material-ui/core"

const getRootDir = () => path.parse(process.cwd()).root

const Security = props => {
    const theme = useTheme()
    const contrastText = theme.palette.getContrastText(theme.palette.background.default)

    const [isSuccess, setSuccess] = useState(false)
    const [exporting, setExporting] = useState(false)
    const [err, setError] = useState("")

    const handleExport = _ => {
        setSuccess(false)
        setExporting(true)
        setError("")

        storage.get("protectedKeys", (err, keys) => {
            if(err) {
                setSuccess(false)
                setExporting(false)
                setError("Failed to export: Could not open protectedKeys file")
                return console.error(err)
            }

            const myKey = keys[props.user._id]

            const objToWrite = {
                _id: props.user._id,
                username: props.user.username,
                protectedKey: myKey
            }

            remote.dialog.showSaveDialog({
                title: "Export Private Key",
                defaultPath: path.resolve(getRootDir(), props.user.username + "-key.json"),
                buttonLabel: "Export",
                filters: [
                    { name: "JSON", extensions: ["json"] }
                ]
            }, filename => {
                if(!filename) {
                    setSuccess(false)
                    setExporting(false)
                    setError("Failed to export: Filename was empty")
                    return console.error("Error exporting file")
                }

                fs.writeFile(filename, JSON.stringify(objToWrite), err => {
                    if(err) {
                        setSuccess(false)
                        setExporting(false)
                        setError("Failed to export: Could not save file. Make sure you have valid permissions")
                        return console.error(err)
                    }

                    setExporting(false)
                    setSuccess(true)
                })
            })
        })
    }

    return (
        <div style = {{ flex: "1 1 auto", display: "flex", flexDirection: "column", overflowY: "auto" }}>
            <div style = {divStyle}>
                <h2 style = {titleStyle(contrastText)}>Private Key</h2>
                <Button variant = "contained" color = "primary" onClick = {handleExport}>
                    Export 
                    { exporting && <CircularProgress size = {17} style = {{ color: theme.palette.getContrastText(theme.palette.primary.main) }} /> }
                    { isSuccess && <FaCheck color = "green" size = {17} /> }
                    { err && <FaTimes color = "red" size = {17} /> }
                </Button>

                { err && <p style = {{ color: "red", fontSize: 21 }}>{err}</p> }
            </div>

            <Divider />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, {})(withTheme(Security))

const divStyle = {
    margin: "15px 0", 
    padding: 15
}

const titleStyle = (contrast) => ({
    color: contrast
})