// GoogleAuth.js
import React from 'react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { apis } from '../../apis';
import axios from 'axios';
import { get_profile } from '../../redux/slice/profile';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import google from "../../asset/google.png"
import { toast } from 'react-toastify';
import Cookies  from 'js-cookie';

const clientId = "318975803592-tvrlkn3p9pqrkq2b9bmghvdcnaskcgq2.apps.googleusercontent.com";

const GoogleAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login = useGoogleLogin({
        onSuccess: (response) => {
            // Send the token to the backend to verify and create a session
            axios.post(`${apis.GOOGLE_LOGIN}`, { access_token: response.access_token })
                .then((response) => {
                    if (response.data?.token && response.data?.status) {
                        dispatch(get_profile({ token: response.data?.token }))?.then((res) => {
                            Cookies.set("token", response.data.token);
                            navigate("/landing-page");
                        })
                    } else {
                        toast.error(response?.data?.msg, {
                            position: "top-right",
                        });
                    }
                })
                .catch((error) => {
                    console.error('Google login Error:', error);
                });
        },
        onError: () => {
            console.log('Login Failed');
        },
    });

    return (
        
            <span
                onClick={() => login()}
                className="google-button">
                <div>
                    <img src={google} alt="" />
                </div>

            </span>
   
    );
};

export default GoogleAuth;
// onClick={() => login()}