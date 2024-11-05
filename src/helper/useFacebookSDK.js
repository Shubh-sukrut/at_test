// FacebookSDK.js
import { useEffect } from 'react';

const loadFacebookSDK = () => {
  window.fbAsyncInit = function() {
    window.FB.init({
      appId: process.env.REACT_APP_FACEBOOK_APP_ID,
      cookie: true,
      xfbml: true,
      version: 'v12.0'
    });
  };

  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
};

const useFacebookSDK = () => {
  useEffect(() => {
    loadFacebookSDK();
  }, []);
};

export default useFacebookSDK;
