import store from "../store/store"

import { addMessage, addChannel, addTyper, removeTyper } from "../actions/channelActions"

const timeouts = {}

export const handleMessage = message => {
    console.log(message)

    const isAway = !document.hasFocus()

    if(!message.MessageType || !message.MessageContent) {
        console.error("Invalid message received: message type or message content is not defined")
        return
    }

    if(typeof message.MessageType !== "string" || typeof message.MessageContent !== "object") {
        console.error("Invalid message received: message type is not a string or message content is not an object")
        return
    }

    switch(message.MessageType) {
        case "NEW_MESSAGE":
            store.dispatch(addMessage(message.MessageContent))

            if(isAway) {
                new Notification("SecureChat", {
                    body: "You received a new message",
                    icon: ""
                })
            }
            
            break
        case "NEW_CHANNEL":
            store.dispatch(addChannel(store.getState().user, message.MessageContent))

            if(isAway) {
                new Notification("SecureChat", {
                    body: "Someone started a new channel with you",
                    icon: ""
                })
            }

            break
        case "IS_TYPING": {
            const channel = message.MessageContent.ChannelID
            const person = message.MessageContent.WhoTypingID

            if(timeouts[channel] && timeouts[channel][person]) {
                clearTimeout(timeouts[channel][person])
            }

            store.dispatch(addTyper(message.MessageContent))

            timeouts[channel] = {
                ...timeouts[channel],
                [person]: setTimeout(_ => store.dispatch(removeTyper(message.MessageContent)), 3500)
            }
            
            break
        }
        default:
            console.error("NO_CASE")
    }
}