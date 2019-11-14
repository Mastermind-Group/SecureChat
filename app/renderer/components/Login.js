import React, { useState, useEffect } from "react"

import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { withTheme, useTheme } from "@material-ui/core"

import { setUser } from "../actions/userActions"

import axios from "axios"

import {
    TextField,
    Button,
    LinearProgress,
    CircularProgress
} from "@material-ui/core"

let interval = null

const Login = props => {
    const theme = useTheme()

    const [form, setForm] = useState({ username: "", password: "" })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [percentage, setPercentage] = useState(0)

    useEffect(_ => {
        if (props.user && props.user.token && props.user.token.length > 10) {
            props.history.push("/messages")
        }

        return _ => {
            clearInterval(interval)
            interval = null
        }
    }, [])

    const handleChange = event => {
        const { name, value } = event.target
        setForm({ ...form, [name]: value.replace(" ", "") })
    }

    const resetValues = _ => {
        setPercentage(0)
    }

    const validForm = _ => {
        if (form.username === "") {
            setError("Username can't be blank")
            return false
        }

        if (form.password === "") {
            setError("Password can't be blank")
            return false
        }

        return true
    }

    const initLoadingInterval = _ => {
        const startTime = new Date().getTime()
        let endTime = new Date()

        endTime.setSeconds(endTime.getSeconds() + 7)

        endTime = endTime.getTime()

        interval = setInterval(_ => {
            const newTime = new Date().getTime() - startTime

            const percentage = newTime * 100 / (endTime - startTime)

            setPercentage(percentage)
        }, 20)
    }

    const sendLogin = _ => {
        axios.post("https://servicetechlink.com/login", JSON.stringify(form), {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(data => {
                clearInterval(interval)
                props.setUser(data.data.user, data.data.token, form.password)
                props.history.push("/messages")
            })
            .catch(err => {
                setLoading(false)
                clearInterval(interval)
                if (err.response) {
                    setError(err.response.data.message)
                }
                else if ((err + "").includes("ECONNREFUSED")) {
                    setError("You dont have an internet connection or the server is down")
                }
            })
    }

    const handleSubmit = event => {
        event.preventDefault()

        resetValues()

        if (!validForm()) {
            return
        }

        initLoadingInterval()

        setLoading(true)
        setError("")

        sendLogin()
    }

    const _renderProgress = _ => {
        if (loading) {
            return (
                <LinearProgress
                    variant="determinate"
                    value={Math.min(parseInt(percentage), 100)}
                    style={{ marginTop: 5 }}
                />
            )
        }
    }

    return (
        <div style={{ ...mainContainerStyle, backgroundColor: theme.palette.background.default }}>
            <h2 style={{ color: theme.palette.text.primary }}>Login</h2>
            <form style={formStyle} onSubmit={handleSubmit}>
                <TextField type="text" name="username" value={form.username} onChange={handleChange} label="Username" />
                <TextField style={{ marginTop: 25, marginBottom: 40 }} type="password" name="password" value={form.password} onChange={handleChange} label="Password" />

                <Button variant="contained" color="primary" type="submit" style={{ height: 36 }} disabled={loading} >
                    {loading ? <CircularProgress size={17} /> : "Log in"}
                </Button>

                {_renderProgress()}

                {loading && <h5 style={{ color: theme.palette.text.primary }}>Note: Login can take a while</h5>}

                <span style={{ color: "red" }}>{error}</span>

                <h5 style={{ color: theme.palette.text.primary }}>Dont have an account? <Button style={{ fontSize: 12 }} variant="text" color="primary" onClick={_ => props.history.push("/register")}>Sign up!</Button></h5>
            </form>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, { setUser })(withRouter(withTheme(Login)))

const mainContainerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: 450,
    backgroundColor: "white"
}

const formStyle = {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    maxWidth: 550
}

