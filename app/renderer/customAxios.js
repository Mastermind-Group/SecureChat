import axios from "axios"

export const authReq = token => axios.create({ 
    headers: {
        "Content-Type": "application/json",
        "Authorization": token,
        "Accept": "application/json"
    } 
})

export default axios