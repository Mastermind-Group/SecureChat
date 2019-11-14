import React, { useState } from "react"

import { connect } from "react-redux"

import { FiPlus, FiMinusCircle } from 'react-icons/fi'

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
    withTheme,
    useTheme
} from "@material-ui/core"

import axios, { authReq } from "../customAxios"

import { publicEncrypt, randomBytes } from "crypto"

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const CreateChannel = props => {
    const theme = useTheme()
    const classes = useStyles()

    const [formOpen, setOpen] = useState(false)
    const [channelName, setName] = useState("")
    const [formLoading, setLoading] = useState(false)
    const [searchUser, setUser] = useState("")
    const [selectedUser, setSelected] = useState({})
    const [foundUsers, setFound] = useState([])
    const [newUsers, setUsers] = useState([])

    const handleClickOpen = _ => {
        setOpen(true)
        setName("")
    }

    const handleClose = _ => {
        setOpen(false)
    }

    const createChannel = _ => {
        setLoading(true)

        let secureString = randomBytes(64).toString("hex")

        let privateKeys = {}

        newUsers.forEach(user => {
            let encryptedKey = publicEncrypt(user.publicKey, Buffer.from(secureString, "utf-8")).toString("base64")

            privateKeys[user._id] = encryptedKey
        })

        let encrypted = publicEncrypt(props.user.publicKey, Buffer.from(secureString, "utf-8")).toString("base64")

        privateKeys[props.user._id] = encrypted

        let channelObj = {
            name: channelName,
            privateKeys
        }

        authReq(props.user.token).post("https://servicetechlink.com/channel/create", JSON.stringify(channelObj))
            .then(data => {
                setLoading(false)
                setOpen(false)
            })
    }

    const handleSearch = searchString => {
        axios.get("https://servicetechlink.com/like/users/" + searchString)
            .then(data => {
                setFound(data.data.results)
            })
            .catch(err => { })
    }

    const handleRemoveUser = userIndex => {
        setUsers(newUsers.filter((user, index) => index !== userIndex))
    }

    const handleAddUser = user => {
        setUsers([...newUsers, user])
        setSelected({})
        setFound([])
        setUser("")
    }

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
                    <div style={{ display: "flex", alignItems: "center", margin: "10px 0" }}>
                        <TextField
                            margin="dense"
                            id="username"
                            label="Username"
                            type="text"
                            variant="outlined"
                            value={searchUser}
                            onChange={event => {
                                setUser(event.target.value)
                                handleSearch(event.target.value)
                            }}
                        />
                        <FormControl className={classes.formControl}>
                            <InputLabel id="user-select-label">Select User</InputLabel>
                            <Select
                                labelId="user-select-label"
                                id="user-select"
                                onChange={event => {
                                    handleAddUser(event.target.value)
                                }}
                                value={selectedUser}
                            >
                                {foundUsers.map(e => <MenuItem key={e._id} value={e}>{e.username}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>
                    <List>
                        {newUsers.map((user, index) => <ListItem key={user._id}>{user.username}<FiMinusCircle color="red" onClick={_ => handleRemoveUser(index)} style={{ cursor: "pointer" }} /></ListItem>)}
                    </List>
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