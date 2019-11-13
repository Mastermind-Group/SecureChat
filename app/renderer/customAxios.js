import axios from "axios"

axios.defaults.adapter = require('axios/lib/adapters/http');

const customAdapter = require('axios/lib/adapters/http');

export const adapter = _ => axios.create({
    //adapter: customAdapter
})

export const authReq = () => axios.create({ 
    headers: {
        'Content-Type': "application/json",
        'Authorization': localStorage.getItem("token")
    } 
})