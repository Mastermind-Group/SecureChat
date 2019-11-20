import React, { useState, useEffect } from "react"

import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { withTheme, useTheme, styled, makeStyles } from "@material-ui/core"

import { setUser } from "../actions/userActions"

import axios from "axios"
import utilCrypto from "../util/crypto"
import { generateKeyPair } from "crypto"
import storage from "electron-json-storage"

import ConfirmComp from "./ConfirmComp"

import {
    TextField,
    Button,
    CircularProgress,
    LinearProgress
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

const Register = props => {
    const theme = useTheme()
    const styles = useStyles({ theme })

    const [generatingKeys, setGenerating] = useState(false)
    const [isOpen, setOpen] = useState(false)
    const [form, setForm] = useState({ username: "", password: "", confirm: "" })
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [keys, setKeys] = useState({ publicKey: "", privateKey: "" })

    const [percentage, setPercentage] = useState(0)

    useEffect(_ => {
        setKeys({ publicKey: "", privateKey: "" })

        return _ => {
            clearInterval(interval)
            interval = null
        }
    }, [])

    const handleChange = event => {
        const { name, value } = event.target
        setForm({ ...form, [name]: value.replace(" ", "") })
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

        if (form.confirm !== form.password) {
            setError("Passwords dont match")
            return false
        }

        return true
    }

    const handleClick = event => {
        event.preventDefault()

        setError("")

        if (!validForm()) {
            return
        }

        setOpen(true)
    }

    const handleProceed = _ => {
        setOpen(false)
        handleSubmit()
    }

    const handleCancel = _ => {
        setOpen(false)
    }

    const handleGenKeys = _ => {
        generateKeyPair("rsa", {
            modulusLength: 4096,
            publicKeyEncoding: {
                type: "spki",
                format: "pem"
            },
            privateKeyEncoding: {
                type: "pkcs8",
                format: "pem",
            }
        }, (_err, publicKey, privateKey) => {
            setKeys({
                publicKey: publicKey,
                privateKey: privateKey
            })

            const protectedKey = utilCrypto.encrypt(privateKey, form.password)

            setGenerating(false)

            handleSignup(publicKey, privateKey, protectedKey)
        })
    }

    const handleSubmit = _ => {
        setStatus("Generating RSA keypair locally...")
        setGenerating(true)

        if (keys.publicKey === "") {
            handleGenKeys()
        } else {
            const protectedKey = utilCrypto.encrypt(keys.privateKey, form.password)

            setGenerating(false)

            handleSignup(keys.publicKey, keys.privateKey, protectedKey)
        }
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

    const sendSignup = (publicKey, privateKey, protectedKey) => {
        axios.post("https://servicetechlink.com/register", JSON.stringify({
            username: form.username,
            password: form.password,
            publicKey,
        }), {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(data => handleSuccess(data, privateKey, protectedKey))
            .catch(handleError)
    }

    const handleSignup = (publicKey, privateKey, protectedKey) => {
        setLoading(true)
        setError("")
        setStatus("")

        initLoadingInterval()

        sendSignup(publicKey, privateKey, protectedKey)
    }

    const handleSuccess = (data, privateKey, protectedKey) => {
        clearInterval(interval)
        props.setUser(data.data.user, privateKey, data.data.token, form.password)

        storage.get("protectedKeys", (err, keys) => {
            if (err) {
                console.error(err)
            }

            storage.set("protectedKeys", { ...keys, [data.data.user._id]: protectedKey }, err => {
                if (err) console.error(err)
            })
        })

        props.history.push("/messages")
    }

    const handleError = err => {
        setLoading(false)
        clearInterval(interval)
        setOpen(false)
        if (err.response) {
            setError(err.response.data.message)
        }
        else if ((err + "").includes("ECONNREFUSED")) {
            setError("You dont have an internet connection or the server is down")
        }
    }

    const _renderGeneratingBar = _ => {
        return generatingKeys && <LinearProgress color="primary" />
    }

    const _renderProgress = _ => {
        return loading && <LinearProgress variant="determinate" value={Math.min(parseInt(percentage), 100)} style={{ marginTop: 5 }} />
    }

    const _renderStatusText = _ => {
        return status && !loading && <h5 className={styles.primaryText}>{status}</h5>
    }

    const _renderSubmittingText = _ => {
        return loading && <h5 className={styles.primaryText}>Note: Registering and login can take a long time</h5>
    }

    const _renderErrorText = _ => {
        return <span style={{ color: "red" }}>{error}</span>
    }

    return (
        <>
            <ConfirmComp
                title="Warning!"
                text={["You may want to store your password in a password manager or write it down, there is no way to reset your password.",
                    "Registering may take a long time on slower computers, and the program may become unresponsive for a while"]}
                open={isOpen}
                onCancel={handleCancel}
                onProceed={handleProceed}
            />
            <div className={styles.container}>
                <h1 className={styles.primaryText}>Register</h1>
                <form className={styles.form} onSubmit={handleClick}>
                    <TextField className={styles.input} type="text" name="username" value={form.username} onChange={handleChange} label="Username" />
                    <TextField className={styles.input} type="password" name="password" value={form.password} onChange={handleChange} label="Password" />
                    <TextField className={styles.input} type="password" name="confirm" value={form.confirm} onChange={handleChange} label="Confirm Password" />

                    <RegisterButton variant="contained" color="primary" type="submit" disabled={loading || generatingKeys}>
                        {loading ? <CircularProgress size={17} /> : "Sign up"}
                    </RegisterButton>

                    {_renderGeneratingBar()}
                    {_renderProgress()}
                    {_renderStatusText()}
                    {_renderSubmittingText()}
                    {_renderErrorText()}

                    <h5 className={styles.primaryText}>
                        Already have an account?
                        <LoginLink variant="text" color="primary" onClick={_ => props.history.push("/login")}>
                            Log in!
                        </LoginLink>
                    </h5>
                </form>
            </div>
        </>
    )
}

const mapStateToProps = _state => {
    return {

    }
}

export default connect(mapStateToProps, { setUser })(withRouter(withTheme(Register)))

const RegisterButton = styled(Button)({
    height: 36,
    marginTop: 30
})

const LoginLink = styled(Button)({
    fontSize: 12
})