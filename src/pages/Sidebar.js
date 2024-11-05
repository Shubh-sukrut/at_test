import React, { useEffect } from 'react'
import clock2 from "../asset/Vector (1).png";
import patient_icon from "../asset/patient_icon.png";
import inbox_icon from "../asset/Inbox.png";
import mass_texting_icon from "../asset/Icon mass texting.png";
import contact_text_icon from "../asset/Contacts Teting.png";
import chat_icon from "../asset/Chat icon.png";
import logo from "../asset/Logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { patientAction } from '../redux/slice/patients';
import Cookies from 'js-cookie';
const Sidebar = () => {
    const location=useLocation()
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const { unknownmsg_count } = useSelector(state => state.message)
    const logout=()=>{
        Cookies.remove("token")
        navigate("/")
      }
    useEffect(()=>{
        if(location.pathname){
            active_contactClasses(location.pathname)
        }
    },[location.pathname,location])

    const active_contactClasses = (e) => {
        const et = document.getElementById(e)
        let active = document.querySelector(".side-active");
        if (active) {
            active.classList.remove("side-active");
        }
        et?.classList?.add("side-active");
    }

    
    const route_func=(route)=>{
        dispatch(patientAction.patient_state_blank())
        dispatch(patientAction.patient_contact_state_blank())
        navigate(route)
    }

    return (
        <>
            <div className="sidebar">
                <div className='side_lg'>
                    <div>
                        {/* <BiSolidTime size={40} color="white" /> */}
                        <img src={logo} />
                        
                    </div>
                </div>
                <nav>
                    <div className='nav-divs'>
                         <li id='chat' onClick={()=>{
                                route_func("/landing-page","4")
                            }}>
                                <div className='hid-div' 
                                ></div>
                            <div className='list'>
                                <div className='side_img'>
                                <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                </div>
                                <span>
                                    Agency Tracking
                                </span>
                            </div>

                        </li> 
                        <li id='/all-patient' onClick={()=>{
                            route_func("/all-patient","1")
                            }}>
                                <div className='hid-div' 
                                
                                ></div>
                            <div className='list' >
                                <div className='side_img'>

                                    {/* <img src={patient_icon} alt="" /> */}
                                    <i className="fa fa-users" aria-hidden="true"></i>
                                </div>
                                <span>

                                    All Patient</span>
                            </div>

                        </li>
                        <li id='/broadcast-history' onClick={()=>{
                                route_func("/broadcast-history","2")
                                
                            }}>
                                <div className='hid-div' 
                                
                                ></div>
                            <div className='list'>
                                <div className='side_img'>

                                <i className="fa-regular fa-message"></i>
                                </div>

                                <span>
                                    {/* Mass Texting */}
                                    Broadcast
                                </span>
                            </div>

                        </li>
                        {/* <li id='/contact' onClick={()=>{
                                route_func("/contact","3")
                                
                            }}>
                                <div className='hid-div' 
                                // style={{visibility:"hidden"}}
                                ></div>
                            <div className='list'>
                                <div className='side_img'>

                                    <img src={contact_text_icon} alt="" />
                                </div>

                                <span>

                                    Contact Texting
                                </span>
                            </div>

                        </li> */}
                        {/* <li id='chat' onClick={()=>{
                                route_func("/chat","4")
                                
                            }}>
                                <div className='hid-div' 
                                ></div>
                            <div className='list'>
                                <div className='side_img'>

                                    <i className="fa fa-comments" aria-hidden="true"></i>

                                </div>
                                <span>
                                    Chat
                                </span>
                            </div>

                        </li> */}
                        {/* <li id='/inbox' onClick={()=>{
                                route_func("/inbox")
                                
                            }}> 
                            <div className='hid-div' 
                                // style={{visibility:"hidden"}}
                                ></div>
                            <div className='list'>
                                <div className='side_img'>

                                    
                                    <i className="fa fa-inbox" aria-hidden="true"></i>

                                </div>

                                <span>

                                    Inbox
                                </span>
                            </div>


                        </li> */}


                        {/* <li id='/message-request' onClick={()=>{
                                route_func("/message-request")
                                
                            }}> 
                            <div className='hid-div' 
                                // style={{visibility:"hidden"}}
                                ></div>
                            <div className='list'>
                                <div className='side_img'>

                                <i className="fa-regular fa-comment-dots"></i>
                                </div>

                                <span>

                                 {unknownmsg_count>0 ? unknownmsg_count :""}   Message Request
                                </span>
                            </div>


                        </li> */}

                        <li id='inbox' onClick={()=>{
                                route_func("/inbox")
                                logout()
                            }}> 
                            <div className='hid-div' 
                                // style={{visibility:"hidden"}}
                                ></div>
                            <div className='list'>
                                <div className='side_img'>

                                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                </div>

                                <span>

                                    Logout
                                </span>
                            </div>


                        </li>
                    </div>
                </nav>
            </div>
        </>
    )
}

export default Sidebar