import React from "react"

import { withTheme, useTheme, makeStyles } from "@material-ui/core"

import { Card } from "@material-ui/core"

const useStyles = makeStyles({
    container: ({ props, theme }) => ({
        cursor: "pointer", 
        padding: 5,
        backgroundColor: props.isCurrent ? theme.palette.primary.main : "", 
    }),
    title: ({ props, theme }) => ({
        margin: "0 5px", 
        color: props.isCurrent ? 
                theme.palette.primary.contrastText : 
                theme.palette.text.primary
    }),
    subtitle: ({ props, theme }) => ({
        margin: "0 0px", 
        marginLeft: 10, 
        color: props.isCurrent ? 
                theme.palette.primary.contrastText : 
                theme.palette.text.primary
    })
})

const Channel = props => {
    const theme = useTheme()
    const styles = useStyles({ props, theme })

    let lastMessage = ""
    let sender = ""
    let time = null

    if (props.data.messages.length > 0) {
        lastMessage = JSON.parse(props.data.messages[props.data.messages.length - 1].Encrypted)

        sender = lastMessage.sender

        if(sender === props.myUsername) {
            sender = "You"
        }

        time = props.data.messages[props.data.messages.length - 1].Timestamp

        const message = cutChars(15, lastMessage.content)

        lastMessage = message.newString + (message.continued ? "..." : "")
    }

    const clickCard = _ => {
        props.setActive(props.data.index)
    }

    return (
        <Card className = {styles.container} onClick={clickCard}>
            <div style = {{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h4 className = {styles.title}>{props.data.Name}</h4>

                { time && <p>{formatMessageTime(time)}</p> }
            </div>
            {lastMessage !== "" && <p className = {styles.subtitle}>{sender}: {lastMessage}</p>}
        </Card>
    )
}

export default withTheme(Channel)

function cutChars(allowedAmount, string) {
    let newString = ""

    for (let i = 0; i < allowedAmount && i < string.length; i++) newString += string[i]

    return { newString, continued: string.length > allowedAmount }
}

function formatMessageTime(time) {
    const date = new Date(time)

    let minute = date.getMinutes()

    if(minute === 0) minute = "00"
    else if (minute <= 9) minute = "0" + minute

    const ampm = date.getHours() <= 11 ? "AM" : "PM"

    let hour = ampm === "AM" ? date.getHours() : date.getHours() - 12

    if(hour === 0) hour = "12"

    return hour + ":" + minute + " " + ampm
}