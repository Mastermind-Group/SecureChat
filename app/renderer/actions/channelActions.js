import axios from "axios"

import NodeRSA from "node-rsa"

import { decrypt } from "../util/crypto"

export const LOAD_CHANNELS = "LOAD_CHANNELS"
export const ADD_CHANNEL = "ADD_CHANNEL"
export const DELETE_CHANNEL = "DELETE_CHANNEL"

export const SET_ACTIVE = "SET_ACTIVE"

export const ADD_MESSAGE = "ADD_MESSAGE"

export const SET_LOAD_CHANNELS = ""

export const loadChannels = (user) => dispatch => {
    dispatch({
        type: SET_LOAD_CHANNELS,
        isLoading: true
    })

    axios.get("https://servicetechlink.com/channels/mine", {
        headers: {
            'Accept': "application/json",
            'Authorization': user.token
        }
    })
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

export function decyptChannel(user, channel, index) {
    const myKey = channel.PrivateKeys[user._id]

    const RSAKey = new NodeRSA(user.privateKey, "pkcs8-private-pem")

    const ChannelKey = RSAKey.decrypt(myKey, "utf8")

    let decryptedMessages = []

    if(channel.Messages) {
        decryptedMessages = channel.Messages.map(message => {
            return { ...message, Encrypted: decrypt(message.Encrypted, ChannelKey) }
        })
    }

    return {
        _id: channel._id,
        Name: channel.Name,
        privateKeys: channel.privateKeys,
        AESKey: ChannelKey,
        index,
        messages: decryptedMessages
    }
}