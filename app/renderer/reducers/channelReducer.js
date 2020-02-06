/* eslint-disable prefer-const */
import { 
    LOAD_CHANNELS, 
    ADD_CHANNEL, 
    DELETE_CHANNEL, 
    SET_ACTIVE, 
    ADD_MESSAGE, 
    SET_LOAD_CHANNELS,
    ADD_TYPER,
    REMOVE_TYPER,
    ADD_USER,
    CLEAR_DATA,
} from "../actions/channelActions"

import { decrypt } from "../util/crypto"
import { stat } from "fs"

const initialState = {
    channels: [],
    activeChannel: -1,
    LOADING_CHANNELS: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LOAD_CHANNELS: 
            return { ...state, channels: action.channels, LOADING_CHANNELS: false }
        case ADD_CHANNEL: {
            const newChannel = {
                ...action.channel,
                index: state.channels.length
            }

            const newChannelsArr = [...state.channels, newChannel]

            return { ...state, channels: newChannelsArr }
        }
        case DELETE_CHANNEL: 
            return {}
        case SET_ACTIVE:
            return { ...state, activeChannel: action.channelIndex }
        case ADD_MESSAGE: {
            const newChannels = [...state.channels]

            for(let i in newChannels) {
                if(newChannels[i]._id === action.message.ChannelID) {
                    action.message.Encrypted = decrypt(action.message.Encrypted, newChannels[i].AESKey)
                    newChannels[i].messages.push(action.message)
                }
            }

            return { ...state, channels: newChannels }
        }
        case SET_LOAD_CHANNELS:
            return { ...state, LOADING_CHANNELS: action.isLoading }
        case ADD_TYPER: {
            const newChannels = [...state.channels]

            for(let i in newChannels) {
                if(newChannels[i]._id === action.typer.ChannelID) {
                    newChannels[i].typers[action.typer.WhoTypingUsername] = action.typer
                }
            }

            return { ...state, channels: newChannels }
        }
        case REMOVE_TYPER: {
            const newChannels = [...state.channels]

            for(let i in newChannels) {
                if(newChannels[i]._id === action.typer.ChannelID) {
                    delete newChannels[i].typers[action.typer.WhoTypingUsername]
                }
            }

            return { ...state, channels: newChannels }
        }
        case ADD_USER: {
            const channelID = action.channel
            const newUsers = action.newUsers
            const newUsersArr = Object.keys(newUsers)

            const newChannels = [...state.channels]

            for(let i in newChannels) {
                if(newChannels[i]._id === channelID) {
                    console.log("found")
                    for(let j in newUsersArr) {
                        const newUserData = newUsersArr[j]

                        console.log(newUserData)

                        newChannels[i].privateKeys[newUserData] = newUsers[newUserData]
                    }
                } 
            }

            return { ...state, channels: newChannels }
        }
        case CLEAR_DATA:
            return initialState
        default: 
            return state
    }
}