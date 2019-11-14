import React from "react"

import { withTheme, useTheme } from "@material-ui/core"

import { Card } from "@material-ui/core"

const Channel = props => {
    const theme = useTheme()

    let lastMessage = ""
    let sender = ""

    if (props.data.messages.length > 0) {
        lastMessage = JSON.parse(props.data.messages[props.data.messages.length - 1].Encrypted)

        sender = lastMessage.sender

        const message = cutChars(15, lastMessage.content)

        lastMessage = message.newString + (message.continued ? "..." : "")
    }

    const clickCard = _ => {
        props.setActive(props.data.index)
    }

    const cardStyle = {
        cursor: "pointer", 
        backgroundColor: props.isCurrent ? theme.palette.primary.main : "", 
        padding: 15
    }

    const titleStyle = {
        margin: "0 5px", 
        color: props.isCurrent ? 
                theme.palette.primary.contrastText : 
                theme.palette.text.primary
    }

    const subtitleStyle = {
        margin: "0 5px", 
        marginLeft: 10, 
        color: props.isCurrent ? 
                theme.palette.primary.contrastText : 
                theme.palette.text.primary
    }

    return (
        <Card onClick={clickCard} style={cardStyle} >
            <h2 style={titleStyle}>{props.data.Name}</h2>
            {lastMessage !== "" && <p style={subtitleStyle}>{sender}: {lastMessage}</p>}
        </Card>
    )
}

export default withTheme(Channel)

function cutChars(allowedAmount, string) {
    let newString = ""

    for (let i = 0; i < allowedAmount && i < string.length; i++) newString += string[i]

    return { newString, continued: string.length > allowedAmount }
}