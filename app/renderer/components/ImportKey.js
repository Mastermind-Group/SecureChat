import React, { useState, useRef } from "react"

import { connect } from "react-redux"
import { setUser } from "../actions/userActions"
import { withRouter } from "react-router-dom"
import { withTheme, useTheme } from "@material-ui/core"

import fs from "fs"
import storage from "electron-json-storage"
import { decrypt } from "../util/crypto"

import {
    FaUsb,
    FaNetworkWired,
    FaCheck,
    FaTimes
} from "react-icons/fa"
import {
    Card,
    CardActionArea,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button,
} from "@material-ui/core"

const ImportKey = props => {
    const theme = useTheme()

    const [fileOpen, setFileOpen] = useState(false)

    const handleProceed = importedData => {
        storage.get("protectedKeys", (err, keys) => {
            if(err) {
                return console.error(err)
            }

            if(keys[importedData._id]) {
                return console.error("The protected key already exists for this account")
            }

            storage.set("protectedKeys", { ...keys, [importedData._id]: importedData.protectedKey }, err => {
                if(err) {
                    return console.error(err)
                }

                props.setUser(props.user, importedData.privateKey, props.user.token, props.user.password)
                props.history.push("/messages")
            })
        })
    }

    return (
        <div style={{ height: "100%", display: "flex", width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: theme.palette.background.default, flexDirection: "column" }}>
            <h2 style={{ color: theme.palette.getContrastText(theme.palette.background.default) }}>Import key from...</h2>
            <div style={{ display: "flex" }}>
                <Card style={cardStyle(theme.palette.primary.main)} onClick={_ => setFileOpen(true)}>
                    <CardActionArea>
                        <CardContent style={{ textAlign: "center" }}>
                            <FaUsb color={theme.palette.primary.main} size={35} />
                            <p>File</p>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card style={cardStyle(theme.palette.primary.main)}>
                    <CardActionArea disabled>
                        <CardContent style={{ textAlign: "center" }}>
                            <FaNetworkWired color={theme.palette.primary.main} size={35} />
                            <p>Network</p>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </div>
            <FileImport
                title="Choose a file to import"
                color={theme.palette.getContrastText(theme.palette.background.paper)}
                user = {props.user}
                open={fileOpen}
                onProceed={handleProceed}
                onCancel={_ => setFileOpen(false)}
            />
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { setUser })(withTheme(withRouter(ImportKey)))

const cardStyle = main => ({
    border: "1px solid " + main,
    margin: "0 15px",
    width: 200,
})

const FileImport = props => {
    const fileRef = useRef(null)

    const [fileName, setFileName] = useState("")
    const [importedData, setImportedData] = useState({})

    const [valid, setValid] = useState(false)
    const [err, setError] = useState("")

    const handleFileChange = _ => {
        setImportedData({})
        setValid(false)
        setError("")

        setFileName(fileRef.current.files[0].name)

        fs.readFile(fileRef.current.files[0].path, (err, data) => {
            if(err) {
                console.error(err)
                return
            }

            try {
                const importedData = JSON.parse(data.toString("utf8"))

                if(!importedData) {
                    setError("No data in this file")
                    return
                }
                else if(!importedData.username) {
                    setError("No username in this file")
                    return
                }
                else if(!importedData.username) {
                    setError("No id in this file")
                    return
                }
                else if(!importedData.protectedKey) {
                    setError("No key in this file")
                    return
                }
                else if(importedData.username !== props.user.username) {
                    setError("This file was not meant for this account")
                    return
                }
                else if(importedData._id !== props.user._id) {
                    setError("The id doesnt match this account")
                    return
                }
                else {
                    try {
                        const privateKey = decrypt(importedData.protectedKey, props.user.password)
                        setImportedData({ ...importedData, privateKey })
                        setValid(true)
                    }
                    catch(e) {
                        setError("Failed to decrypt privatekey. Are you sure this file was meant for this account?")
                    }
                }
            }
            catch(e) {
                setError("File is invalid")
            }
        })
    }

    return (
        <Dialog open={props.open}>
            <DialogTitle style={{ fontWeight: "800 !important" }}>{props.title}</DialogTitle>

            <DialogContent>
                <DialogContentText>To export a key, log on to your computer that has access to your account. Go to settings, Security, Export, select export key by file</DialogContentText>
                <DialogContentText>Please select the file that was exported from your other computer</DialogContentText>

                <div style = {{ display: "flex", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        component="label"
                        color = "primary"
                    >
                        Import File
                        <input
                            type="file"
                            accept=".json,application/json"
                            style={{ display: "none" }}
                            ref = {fileRef}
                            onChange = {handleFileChange}
                        />
                    </Button>
                    <p style = {{ margin: "0 15px" }}>{fileName}</p>
                </div>

                { importedData && importedData.username && <p>{importedData.username}</p> }

                { err && <p style = {{ color: "red", fontSize: 21 }}>{err}</p> }
                
                <div style={{ display: "flex", justifyContent: "flex-end", padding: 10 }}>
                    <Button style={{ color: props.color, borderColor: "red" }} variant="outlined" onClick={props.onCancel}><FaTimes color="red" /> Cancel</Button>
                    <h1 style={{ width: 15 }}></h1>
                    <Button color="primary" variant="contained" onClick={_ => props.onProceed(importedData)} disabled = {!valid}><FaCheck color="white" style={{ margin: "0 5px" }} /> Proceed</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}