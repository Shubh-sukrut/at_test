import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";
import { apis } from "../../apis";

export const registraionuser= createAsyncThunk('registraionuser',async(userinfo)=>{
    const register=await axios.post(apis.SIGNUP_API,userinfo)
    console.log('registeruser',register.data)
    return register.data
})

const registraionslice=createSlice({
    name:'registraion',
    initialState:{
        loading:false,
        error:false,
        data:[]
    },
    extraReducers:(builder)=>{
        builder.addCase(registraionuser.pending,(state)=>{
            state.loading=true;
            state.error=false;
        })
        .addCase(registraionuser.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=false;
            state.data=action?.payload

        })
        .addCase(registraionuser.rejected,(state,action)=>{
            state.loading=false;
            state.error=true;
        })
    }
    
})

export const registraion_action = registraionslice.actions
const  registraionreducer = registraionslice.reducer
export default registraionreducer