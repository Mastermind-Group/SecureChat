import React, { useState, useEffect } from "react"

import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { withTheme, useTheme, makeStyles, styled } from "@material-ui/core"

import { setUser } from "../actions/userActions"

import axios from "axios"
import storage from "electron-json-storage"
import { decrypt } from "../util/crypto"

import {
    TextField,
    Button,
    LinearProgress,
    CircularProgress
} from "@material-ui/core"

let interval = null

const useStyles = makeStyles({
    container: ({ theme }) => ({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: 450,

        backgroundColor: theme.palette.background.default,
    }),
    form: {
        display: "flex",
        flexDirection: "column",
        width: "80%",
        maxWidth: 550,
    },
    input: {
        margin: "10px 0"
    },
    primaryText: ({ theme }) => ({
        color: theme.palette.text.primary
    })
})

const Login = props => {
    const theme = useTheme()
    const styles = useStyles({ theme })

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
        axios.post("https://securechat-go.herokuapp.com/login", JSON.stringify(form), {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(handleSuccess)
            .catch(handleError)
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

    const handleSuccess = data => {
        clearInterval(interval)

        storage.get("protectedKeys", (err, keys) => {
            if (err) return console.error(err)

            const myKey = keys[data.data.user._id]

            if (!myKey) {
                props.setUser(data.data.user, "IMPORT", data.data.token, form.password)
                props.history.push("/importKey")
            }
            else {
                const privateKey = decrypt(myKey, form.password)

                props.setUser(data.data.user, privateKey, data.data.token, form.password)
                props.history.push("/messages")
            }
        })
    }

    const handleError = err => {
        setLoading(false)
        clearInterval(interval)
        console.log(err)
        if (err.response) {
            setError(err.response.data.message)
        }
        else if ((err + "").includes("ECONNREFUSED")) {
            setError("You dont have an internet connection or the server is down")
        }
    }

    const _renderProgress = _ => {
        return loading && <LinearProgress variant="determinate" value={Math.min(parseInt(percentage), 100)} style={{ marginTop: 5 }} />
    }

    const _renderLoadingText = _ => {
        return loading && <h5 style={{ color: theme.palette.text.primary }}>Note: Login can take a while</h5>
    }

    const _renderError = _ => {
        return error && <span style={{ color: "red" }}>{error}</span>
    }

    return (
        <div className = {styles.container}>
            <h1 className = {styles.primaryText}>Login</h1>

            <form className = {styles.form} onSubmit={handleSubmit}>
                <TextField className={styles.input} type="text" name="username" value={form.username} onChange={handleChange} label="Username" />
                <TextField className={styles.input} type="password" name="password" value={form.password} onChange={handleChange} label="Password" />

                <LoginButton variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={17} /> : "Log in"}
                </LoginButton>

                {_renderProgress()}
                {_renderLoadingText()}
                {_renderError()}

                <h5 className={styles.primaryText}>
                    Dont have an account?
                    <RegisterLink variant="text" color="primary" onClick={_ => props.history.push("/register")}>
                        Sign up!
                    </RegisterLink>
                </h5>
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

const LoginButton = styled(Button)({
    height: 36, 
    marginTop: 30
})

const RegisterLink = styled(Button)({
    fontSize: 12
})