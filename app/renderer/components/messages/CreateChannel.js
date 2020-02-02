import React, { useState, useEffect, useRef } from "react"

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
    Select,
    MenuItem,
    List,
    ListItem,
    InputLabel,
    FormControl,
    makeStyles,
} from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab/"

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}))

const CreateChannel = props => {
    const theme = useTheme()
    const classes = useStyles()

    const [formOpen, setOpen] = useState(false)
    const [channelName, setName] = useState("")
    const [formLoading, setLoading] = useState(false)
    const [searchUser, setUser] = useState("")
    const [foundUsers, setFound] = useState([])
    const [newUsers, setUsers] = useState([])

    const [searchLoading, setSearchLoading] = useState(false)

    const[errorText, setErrorText] = useState("")

    const handleClickOpen = _ => {
        setOpen(true)
        setName("")
    }

    const handleClose = _ => {
        setOpen(false)
    }

    const createChannel = _ => {
        if(channelName === "") {
            setErrorText("You must give the channel a name")
            return
        }

        if(newUsers.length === 0) {
            setErrorText("You must add at least 1 user to this channel")
            return
        }

        setErrorText("")
        setLoading(true)

        const secureString = randomBytes(64).toString("hex")

        const privateKeys = {}

        newUsers.forEach(user => {
            const encryptedKey = publicEncrypt(user.publicKey, Buffer.from(secureString, "utf-8")).toString("base64")

            privateKeys[user._id] = encryptedKey
        })

        const encrypted = publicEncrypt(props.user.publicKey, Buffer.from(secureString, "utf-8")).toString("base64")

        privateKeys[props.user._id] = encrypted

        const channelObj = {
            name: channelName,
            privateKeys
        }

        authReq(props.user.token).post("https://servicetechlink.com/channel/create", JSON.stringify(channelObj))
            .then(_data => {
                setLoading(false)
                setOpen(false)
            })
            .catch(err => {
                console.error(err)
                setErrorText("An unknown error occured")
                setLoading(false)
            })
    }

    const handleRemoveUser = userIndex => {
        setUsers(newUsers.filter((_user, index) => index !== userIndex))
    }

    const handleAddUser = user => {
        setUsers([...newUsers, user])
        setFound([])
        setUser("")
    }

    useEffect(_ => {
        if(searchUser !== "") {
            setSearchLoading(true)
            axios.get("https://servicetechlink.com/like/users/" + searchUser)
            .then(data => {
                const set = new Set()

                for(let user of newUsers) 
                    set.add(user.username)

                setFound(data.data.results.filter(user => user.username !== props.user.username && !set.has(user.username)))
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
                        onChange={event => setName(event.target.value)}
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
                            onChange={event => setUser(event.target.value)}
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
                    <h3 style = {{ margin: "10px 0px 0px 0px" }}>{newUsers.length} user{newUsers.length === 1 ? "" :"s"}:</h3>
                    <List>
                        {
                            newUsers.reverse().slice(0, 50).map((user, index) => 
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
                    <Button onClick={handleClose} color="primary">
                        Cancel
                        </Button>
                    {
                        formLoading ? <CircularProgress size={17} /> :
                            <Button onClick={createChannel} variant="contained" color="primary">
                                Create
                            </Button>
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