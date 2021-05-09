import React, { useState, useEffect } from "react"

import { connect } from "react-redux"
import { withTheme, useTheme } from "@material-ui/core"

import axios, { authReq } from "../../customAxios"
import { publicEncrypt, randomBytes } from "crypto"

import { FiPlus, FiMinusCircle } from "react-icons/fi"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Divider,
    TextField,
    DialogActions,
    Button,
    CircularProgress,
    List,
    ListItem,
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab/"

const CreateChannel = props => {
    const theme = useTheme()

    const [formOpen, setOpen] = useState(false)

    const [channelName, setChannelName] = useState("")
    const [searchUser, setSearchUser] = useState("")

    const [foundUsers, setFoundUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    
    const [searchLoading, setSearchLoading] = useState(false)
    const [requestLoading, setRequestLoading] = useState(false)

    const[errorText, setErrorText] = useState("")

    const handleClickOpen = _ => {
        setOpen(true)
        setChannelName("")
    }

    const handleClose = _ => {
        setOpen(false)
    }

    const createChannel = _ => {
        if(channelName === "") {
            setErrorText("You must give the channel a name")
            return
        }

        if(selectedUsers.length === 0) {
            setErrorText("You must add at least 1 user to this channel")
            return
        }

        setErrorText("")
        setRequestLoading(true)

        const secureString = randomBytes(64).toString("hex")

        const privateKeys = {}

        selectedUsers.forEach(user => {
            const encryptedKey = publicEncrypt(user.publicKey, Buffer.from(secureString, "utf-8")).toString("base64")

            privateKeys[user._id] = encryptedKey
        })

        const encrypted = publicEncrypt(props.user.publicKey, Buffer.from(secureString, "utf-8")).toString("base64")

        privateKeys[props.user._id] = encrypted

        const channelObj = {
            name: channelName,
            privateKeys
        }

        authReq(props.user.token).post("https://securechat-go.herokuapp.com/channel/create", JSON.stringify(channelObj))
            .then(_data => {
                setRequestLoading(false)
                setOpen(false)
            })
            .catch(err => {
                console.error(err)
                setErrorText("An unknown error occured")
                setRequestLoading(false)
            })
    }

    const handleRemoveUser = userIndex => {
        setSelectedUsers(selectedUsers.filter((_user, index) => index !== userIndex))
    }

    const handleAddUser = user => {
        setSelectedUsers([...selectedUsers, user])
        setFoundUsers([])
        setSearchUser("")
    }

    useEffect(_ => {
        if(searchUser !== "") {
            setSearchLoading(true)
            axios.get("https://securechat-go.herokuapp.com/like/users/" + searchUser)
            .then(data => {
                const set = new Set()

                for(let user of selectedUsers) 
                    set.add(user.username)

                setFoundUsers(data.data.results.filter(user => user.username !== props.user.username && !set.has(user.username)))
                setSearchLoading(false)
            })
            .catch(_err => { })
        }
    }, [searchUser])

    return (
        <>
            <Divider />
            <Button style={{ display: "flex", alignItems: "center", width: "100%", marginTop: 5 }} onClick={handleClickOpen} color="primary" variant="contained"><FiPlus color={theme.palette.primary.contrastText} size={23} />Channel</Button>
            <Dialog
                open={formOpen}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Create Channel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a channel and add unlimited users
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Channel Name"
                        type="text"
                        fullWidth
                        value={channelName}
                        onChange={event => setChannelName(event.target.value)}
                    />
                    <Autocomplete
                        style = {{ margin: "10px 0px" }}
                        id="username"
                        label="Username"
                        type="text"
                        variant="outlined"
                        getOptionSelected={(option, value) => option.username === value.username}
                        onChange={event => {
                            const text = event.target.textContent
                            const user = foundUsers.find(user => user.username === text)

                            if(user) 
                                handleAddUser(user)
                        }}
                        getOptionLabel = {option => option.username || ""}
                        options = {foundUsers}
                        renderInput={params => (
                            <TextField
                            {...params}
                            label="Username"
                            fullWidth
                            variant="outlined"
                            onChange={event => setSearchUser(event.target.value)}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                <React.Fragment>
                                    {searchLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                                ),
                            }}
                            />
                        )}
                    />
                    <h3 style = {{ margin: "10px 0px 0px 0px" }}>{selectedUsers.length} user{selectedUsers.length === 1 ? "" :"s"}:</h3>
                    <List>
                        {
                            selectedUsers.reverse().slice(0, 50).map((user, index) => 
                                <ListItem key={user._id}>
                                    {user.username}
                                    <FiMinusCircle color="red" onClick={_ => handleRemoveUser(index)} style={{ cursor: "pointer", margin: "0px 5px" }} />
                                </ListItem>
                            )
                        }
                    </List>
                    <h3 style = {{ color: "red" }}>{errorText}</h3>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    {
                        requestLoading ? 
                        <CircularProgress size={17} /> :
                        <Button onClick={createChannel} variant="contained" color="primary">Create</Button>
                    }
                </DialogActions>
            </Dialog>
        </>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, {})(withTheme(CreateChannel))