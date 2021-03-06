import { authReq } from "../customAxios"
import { privateDecrypt } from "crypto"
import { decrypt } from "../util/crypto"

export const LOAD_CHANNELS = "LOAD_CHANNELS"
export const ADD_CHANNEL = "ADD_CHANNEL"
export const DELETE_CHANNEL = "DELETE_CHANNEL"
export const SET_ACTIVE = "SET_ACTIVE"
export const ADD_MESSAGE = "ADD_MESSAGE"
export const SET_LOAD_CHANNELS = "SET_LOAD_CHANNELS"
export const ADD_TYPER = "ADD_TYPER"
export const REMOVE_TYPER = "REMOVE_TYPER"
export const ADD_USER = "ADD_USER"

export const CLEAR_DATA = "CLEAR_DATA"

export const loadChannels = user => dispatch => {
    dispatch({
        type: SET_LOAD_CHANNELS,
        isLoading: true
    })

    authReq(user.token).get("https://securechat-go.herokuapp.com/channels/mine")
        .then(data => {
            let channels = data.data.results

            channels = channels.map((channel, index) => decyptChannel(user, channel, index))

            dispatch({
                type: LOAD_CHANNELS,
                channels,
                isLoading: false
            })
        })
}

export const addChannel = (user, channel) => dispatch => {
    const newChannel = decyptChannel(user, channel, -2)

    dispatch({
        type: ADD_CHANNEL,
        channel: newChannel
    })
}

export const deleteChannel = channelID => dispatch => {
    dispatch({
        type: DELETE_CHANNEL,
        id: channelID
    })
}

export const setActive = (channelIndex) => dispatch => {
    dispatch({
        type: SET_ACTIVE,
        channelIndex,
    })
}

export const addMessage = (message) => dispatch => {
    dispatch({
        type: ADD_MESSAGE,
        message
    })
}

export const addTyper = typer => dispatch => {
    dispatch({
        type: ADD_TYPER,
        typer
    })
}

export const removeTyper = typer => dispatch => {
    dispatch({
        type: REMOVE_TYPER,
        typer
    })
}

export const addUser = (channelID, newUsers) => dispatch => {
    dispatch({
        type: ADD_USER,
        channel: channelID,
        newUsers: newUsers
    })
}

export const clearData = _ => dispatch => {
    dispatch({
        type: CLEAR_DATA
    })
}

export function decyptChannel(user, channel, index) {
    const myKey = channel.PrivateKeys[user._id]

    const ChannelKey = privateDecrypt(user.privateKey, Buffer.from(myKey, "base64"))

    let decryptedMessages = []

    if(channel.Messages) {
        decryptedMessages = channel.Messages.map(message => {
            return { ...message, Encrypted: decrypt(message.Encrypted, ChannelKey) }
        })
    }
    
    return {
        _id: channel._id,
        Name: channel.Name,
        privateKeys: channel.PrivateKeys,
        AESKey: ChannelKey.toString("utf8"),
        index,
        messages: decryptedMessages,
        typers: {}
    }
}