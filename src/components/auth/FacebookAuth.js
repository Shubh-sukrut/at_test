// FacebookLoginButton.js
import React from 'react';
import axios from 'axios';
import facebook from "../../asset/facebook.jpg";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { get_profile } from '../../redux/slice/profile';
import useFacebookSDK from '../../helper/useFacebookSDK';
import { apis } from '../../apis';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const FacebookAuth = () => {
  useFacebookSDK();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFBLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        handleResponse(response.authResponse);
      } else {
        console.log('User cancelled login or did not fully authorize.');
      }
    }, { scope: 'email' });
  };

  const handleResponse = async (authResponse) => {
    const { accessToken, userID } = authResponse;
    try {
      const res = await axios.post(apis.FACEBOOK_LOGIN, { accessToken, userID });
      if (res.data?.token && res.data?.status) {
        const token = res.data.token;
        dispatch(get_profile({ token }))?.then((profileRes) => {
          Cookies.set("token", token);
          navigate("/landing-page");
        });
      } else {
        toast.error("Something went wrong", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <span onClick={handleFBLogin} className="facebook-button">
      <div>
        <img src={facebook} alt="Facebook login" />
      </div>
    </span>
  );
};

export default FacebookAuth;
