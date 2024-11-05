import { createSlice } from "@reduxjs/toolkit";

const filterslice=createSlice({
    name:"filter",
    initialState:{
        startdate:"",
        enddate:"",
        agency_id:""
    },
    reducers:{
        changedate:(state,action)=>{
            state.enddate=action.payload.enddate,
            state.startdate=action.payload.startdate
        }

    }
})