import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';



import { Divider, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';


const ChatBody = () => {
    
    return (
        <>
            {/* <div className='cont'>
          
          <div>
            <p>Your Apps</p>
          </div>
          <div>
            <p>here are your registerd apps</p>
          </div>

<div>
    <button>
        Texting     
    </button>
</div>
<div>
    <button>
       agency tracking
    </button>
</div>

<div>
    <button>
       You have not subscribed to agency trancking app yet. please contact adminstrator
    </button>
</div>


            </div> */}

            <div>
                <div>
                    <p>Patient</p>
                    <p>Mass or Selected Patient Chat</p>
                </div>
                <div>
                    <div>chat box</div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </>

    )
}

export default ChatBody;
