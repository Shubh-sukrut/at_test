import {  createSlice } from "@reduxjs/toolkit";

const socket = createSlice({
    name: "socket",
    initialState: {
        socket:null
    },
    reducers:{
        socket_connected:(state,action)=>{
            state.socket=action.payload
        },
    },
})

export const socketAction=socket.actions
const socketSlice = socket.reducer
export default socketSlice