import { 
    LOAD_CHANNELS, 
    ADD_CHANNEL, 
    DELETE_CHANNEL, 
    SET_ACTIVE, 
    ADD_MESSAGE, 
    SET_LOAD_CHANNELS 
} from "../actions/channelActions"

import { decrypt } from "../util/crypto"

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
        default: 
            return state
    }
}