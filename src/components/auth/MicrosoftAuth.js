// src/components/MicrosoftAuth/MicrosoftAuth.js
import React from 'react';
import { useMsal } from "@azure/msal-react";
import axios from 'axios';
import { loginRequest } from "../../msalConfig";
import microsoft from "../../asset/microsoft.png";
import { apis } from '../../apis';
import { get_profile } from '../../redux/slice/profile';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const MicrosoftAuth = () => {
    const { instance } = useMsal();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {

        try {
            const loginResponse = await instance.loginPopup(loginRequest);
            const token = loginResponse.idToken;
            
            const response = await axios.post(`${apis.MICROSOFT_LOGIN}`, { token });
            
            if (response.data?.token && response.data?.status) {
                dispatch(get_profile({ token: response.data?.token }))?.then((res) => {
                  Cookies.set("token", response.data.token);
                  navigate("/landing-page");
                })
              } else {
                toast.error("Something went wrong", {
                  position: "top-right",
                });
              }
        } catch (e) {
            console.error("Login error:", e);
        }
    };

    return (
        <span
            className="microsoft-button"
            onClick={handleLogin}
        >
            <div>
                <img src={microsoft} alt="" />
            </div>
        </span>
    );
};

export default MicrosoftAuth;
