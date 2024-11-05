// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { get_all_patient, get_group, get_patient, get_patient_contact } from "../redux/slice/patients";
// import Cookies from "js-cookie";
// import { Spinner } from "react-bootstrap";
// import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon, Tab } from "@mui/material";
// import { TabContext, TabList, TabPanel } from "@mui/lab";
// import Button from '@mui/material/Button';

// import Modal from 'react-bootstrap/Modal';
// import InfiniteScroll from 'react-infinite-scroll-component';



// import { MultiSelect } from "react-multi-select-component";
// import { create_groups, get_all_chats } from "../redux/slice/chatgroups";
// import { create_message, get_messages } from "../redux/slice/message_slice";
// import { useLocation } from "react-router-dom";
// const actions = [
//   { icon: <i className="fa-regular fa-pen-to-square"></i>, name: 'Copy' },
//   { icon: <i className="fa-regular fa-pen-to-square"></i>, name: 'Save' },
//   { icon: <i className="fa-regular fa-pen-to-square"></i>, name: 'Print' },
//   { icon: <i className="fa-regular fa-pen-to-square"></i>, name: 'Share' },
// ];

// // const ChatPage = () => {
// //   const [data, setdata] = useState([])
// //   const [patient_id, setpatient_id] = useState("")
// //   const location = useLocation()
// //   const querysearch = new URLSearchParams(location.search)
// //   const [patient_contact_id, setpatient_contact_id] = useState("")
// //   const [modalShow, setModalShow] = React.useState(false);
// //   const [selected, setSelected] = useState([]);
// //   const [text, settext] = useState("")
// //   const [allmessages, setallmessages] = useState([]
// //   )
// //   const [patient_contact_options, setpatient_contact_options] = useState([])
// //   const [tabs, settabs] = useState("patient")
// //   const { patient, patient_contact, loading, chatgroup, all_patients_contact } = useSelector(state => state.patient)

// //   const { loading: all_chat_loading, all_chats, data_length } = useSelector(state => state.groups)
// //   const { message ,msg_length} = useSelector(state => state.message)
// //   const [open, setOpen] = React.useState(false);
// //   const handleOpen = () => setOpen(true);
// //   const handleClose = () => setOpen(false);
// //   const [value, setValue] = useState("1");
// //   const dispatch = useDispatch()
// //   const token = Cookies.get("token")
// //   const [page, setPage] = useState(1)
// //   const [group_id, setgroup_id] = useState("")
// //   const chat_container = useRef()


// //   // const handleScroll = () => {
// //   //   const scrollTop = document.documentElement.scrollTop;
// //   //   const scrollHeight = document.documentElement.scrollHeight;
// //   //   const clientHeight = document.documentElement.clientHeight;

// //   //   if (scrollTop + clientHeight >= scrollHeight - 200 && !loading) {
// //   //     setPage((prevPage) => prevPage + 1);
// //   //   }
// //   // };

// //   // useEffect(() => {
// //   //   window.addEventListener('scroll', handleScroll);
// //   //   return () => window.removeEventListener('scroll', handleScroll);
// //   // }, [handleScroll]);
// //   useEffect(() => {
// //     if (message) {
// //       setallmessages((pre)=>[...pre,...message])
// //     }
// //   }, [message])

// //   const create_messages = (e) => {
// //     e.preventDefault()
// //     let obj = {
// //       id: 1,
// //       name: 'Nihal fasadffdsa',
// //       time: '12:00 AM',
// //       messages: text,
// //       Type: "outbound"
// //     }

// //     dispatch(create_message({ token, Type: "outbound", Method: patient_contact_id ? "single" : "mass", Patient_contact: patient_contact_id, messages: text, group_id: group_id, chatType: group_id ? "group" : "onebyone" }))
// //     setallmessages((prv) => [...prv, obj])
// //     settext("")

// //   }


// //   const fetch_chat = () => {
// //     // let page=data_length ? Math.ceil(data_length/10)+1 :1
// //     if (querysearch.get("query") === "mass") {
// //       dispatch(get_all_patient({ token, page: page, limit: 5 }))
// //     }
// //     if (querysearch.get("query") === "group") {
// //       dispatch(get_group({ token, page, limit: 2 }))
// //     }
// //     if (querysearch.get("query") === "single_patient_contact") {
// //       dispatch(get_patient_contact({ token, page, limit: 2, patient_id: querysearch.get("patient_id") }))
// //     }
// //     if (querysearch.get("query") === "chatbox") {
// //       dispatch(get_all_chats({ token, limit: 6, page: page, type: "all" }))
// //     }
// //   }
// //   useEffect(() => {
// //     fetch_chat()
// //   }, [querysearch.get("query")])

// //   const handleChange = (event, newValue) => {
// //     let val
// //     if (newValue === "2" && !chatgroup) {
// //       // dispatch(get_group({ token }))
// //     }
// //     if (newValue === "3" && !all_patients_contact) {
// //       // dispatch(get_all_patient({ token, page: "", limit: "" }))
// //     }
// //     if (newValue === "3") {
// //       val = "individual"
// //       settabs("mass")
// //     }
// //     if (newValue === "2") {
// //       val = "group"
// //       settabs("")
// //     }
// //     if (newValue === "1" && !patient_contact) {

// //       settabs("")
// //     }
// //     if (newValue === "1") {
// //       val = "all"
// //     }

// //     dispatch(get_all_chats({ token, limit: 6, page: 1, type: val }))
// //     setValue(newValue);
// //   };

// //   useEffect(() => {
// //     // if (patient) {
// //     //   setdata(patient)
// //     // }
// //     // if (patient_contact) {
// //     //   setdata(patient_contact)
// //     //   let arr = patient_contact.map((it) => {
// //     //     console.log({ label: it.first_name, value: it._id })
// //     //     return { label: it.first_name, value: it._id }
// //     //   })
// //     //   setpatient_contact_options(arr)
// //     // }
// //     if(all_chats){
// //       setdata((prv)=>[...prv,...all_chats])
// //     }
// //   }, [patient_contact, patient,all_chats])

// //   useEffect(() => {
// //     if (all_patients_contact) {
// //       let arr = all_patients_contact.map((it) => {
// //         console.log({ label: it.first_name, value: it._id })
// //         return { label: it.first_name, value: it._id }
// //       })
// //       setpatient_contact_options(arr)
// //     }
// //   }, [all_patients_contact])

// //   // useEffect(() => {

// //   //   dispatch(get_all_chats({ token, limit: "", page: "", type: "all" }))
// //   // }, [])

// //   useEffect(() => {
// //     if (group_id || patient_contact_id) {
// //       dispatch(get_messages({ token, Patient_contact: patient_contact_id, group_id: group_id, chatType: group_id ? "group" : "onebyone",page,limit:8 }))
// //     }
// //   }, [group_id, patient_contact_id,page])


// //   const changepage=()=>{
// //     setPage((page)=>page+1)
// //   }
// //   console.log(patient_contact)
// //   return (
// //     <div className="app">
// //       <div className="header">
// //         <div className="logo">
// //           {/* <svg viewBox="0 0 513 513" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
// //     <path d="M256.025.05C117.67-2.678 3.184 107.038.025 245.383a240.703 240.703 0 0085.333 182.613v73.387c0 5.891 4.776 10.667 10.667 10.667a10.67 10.67 0 005.653-1.621l59.456-37.141a264.142 264.142 0 0094.891 17.429c138.355 2.728 252.841-106.988 256-245.333C508.866 107.038 394.38-2.678 256.025.05z" />
// //     <path d="M330.518 131.099l-213.825 130.08c-7.387 4.494-5.74 15.711 2.656 17.97l72.009 19.374a9.88 9.88 0 007.703-1.094l32.882-20.003-10.113 37.136a9.88 9.88 0 001.083 7.704l38.561 63.826c4.488 7.427 15.726 5.936 18.003-2.425l65.764-241.49c2.337-8.582-7.092-15.72-14.723-11.078zM266.44 356.177l-24.415-40.411 15.544-57.074c2.336-8.581-7.093-15.719-14.723-11.078l-50.536 30.744-45.592-12.266L319.616 160.91 266.44 356.177z" fill="#fff" /></svg> */}
// //         </div>
// //         <div className="user-settings">
// //           <div className="dark-light">
// //             <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
// //               <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
// //           </div>
// //           <div className="settings">
// //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
// //               <circle cx="12" cy="12" r="3" />
// //               <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
// //           </div>
// //           <img className="user-profile account-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
// //         </div>
// //       </div>
// //       <div className="wrapper">
// //         <div className="conversation-area" >
// //           {querysearch.get("query") === "chatbox" ?
// //             <Box sx={{ width: "100%", typography: "body1" }}>
// //               <TabContext value={value}>
// //                 <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
// //                   <TabList
// //                     onChange={handleChange}
// //                     aria-label="lab API tabs example"
// //                   >
// //                     <Tab label="All" value="1" />
// //                     <Tab label=" Groups" value="2" />
// //                     <Tab label="Individual Group" value="3" />
// //                   </TabList>
// //                 </Box>
// //                 <TabPanel value="1">

// //                   {
// //                     // all_chat_loading ? <div style={{ width: "100px", margin: "auto" }}>
// //                     //   <Spinner animation="grow" />
// //                     // </div> :
// //                     //   !all_chats?.length ? <div style={{ width: "100px", margin: "auto" }}>No Contacts</div> :




// //                     // <InfiniteScroll
// //                     // dataLength={data_length} //This is important field to render the next data
// //                     // next={changepage}
// //                     // hasMore={true}
// //                     // loader={<h4>Loading...</h4>}
// //                     // >
// //                       data && data.map((it) => {
// //                         return (
// //                           <div className="msg" onClick={() => {
// //                             // dispatch(get_messages({token,Patient_contact:it.first_name?it._id:"",group_id:it.groupName ?it._id:"",chatType:"onebyone"}))
// //                             console.log("group", it.groupName ? it._id : "")
// //                             console.log("personal", it.first_name ? it._id : "")
// //                             setgroup_id(it.groupName ? it._id : "")
// //                             setpatient_contact_id(it.first_name ? it._id : "")
// //                           }}>

// //                             <div className="msg-detail">
// //                               <div className="msg-username">{it.first_name ? it.first_name : it.groupName}</div>
// //                               <div className="msg-content">
// //                                 <span className="msg-message">{it.message}</span>
// //                                 <span className="msg-date">{it.time}</span>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         )
// //                       })
                      
// //                     // </InfiniteScroll>
// //                   }
// //                 </TabPanel>
// //                 <TabPanel value="2">
// //                   {
// //                     all_chat_loading ? <div style={{ width: "100px", margin: "auto" }}>
// //                       <Spinner animation="grow" />
// //                     </div> :
// //                       !data?.length ? <div style={{ width: "100px", margin: "auto" }}>No Groups</div> :
// //                       data && all_chats.map((it) => {
// //                           return (
// //                             <div className="msg" onClick={() => {
// //                               setgroup_id(it._id)

// //                             }}>

// //                               <div className="msg-detail">
// //                                 <div className="msg-username">{it.groupName}</div>

// //                               </div>
// //                             </div>
// //                           )
// //                         })}
// //                 </TabPanel>

// //                 <TabPanel value="3">
// //                   {
// //                     all_chat_loading ? <div style={{ width: "100px", margin: "auto" }}>
// //                       <Spinner animation="grow" />
// //                     </div> :

// //                       !all_chats?.length ? <div style={{ width: "100px", margin: "auto" }}>No Contacts</div> :
// //                         all_chats && all_chats.map((it) => {
// //                           return (
// //                             <div className="msg" onClick={() => {
// //                               setgroup_id(it._id)

// //                             }}>

// //                               <div className="msg-detail">
// //                                 <div className="msg-username">{it.groupName}</div>
// //                               </div>
// //                             </div>
// //                           )
// //                         })}
// //                 </TabPanel>
// //               </TabContext>
// //             </Box>
// //             :
// //             loading ? <div style={{ width: "100px", margin: "auto" }}>
// //               <Spinner animation="grow" />
// //             </div> :
// //               querysearch.get("query") === "mass" ?
// //                 !all_patients_contact?.length ? <div style={{ width: "100px", margin: "auto" }}>No Contacts</div> :
// //                   all_patients_contact && all_patients_contact.map((it) => {
// //                     return (
// //                       <div className="msg" onClick={() => {
// //                         setgroup_id("")
// //                         setpatient_contact_id(it._id)
// //                         dispatch(get_messages({ token, Patient_contact: it._id, group_id, chatType: "onebyone" }))
// //                       }}>

// //                         <div className="msg-detail">
// //                           <div className="msg-username">{it.first_name}</div>

// //                         </div>
// //                       </div>
// //                     )
// //                   })
// //                 : querysearch.get("query") === "group" ? !chatgroup?.length ? <div style={{ width: "100px", margin: "auto" }}>No Groups</div> :
// //                   chatgroup && chatgroup.map((it) => {
// //                     return (
// //                       <div className="msg" onClick={() => {
// //                         setgroup_id(it._id)
// //                         setpatient_id("")
// //                       }}>

// //                         <div className="msg-detail">
// //                           <div className="msg-username">{it.groupName}</div>

// //                         </div>
// //                       </div>
// //                     )
// //                   }) :
// //                   querysearch.get("query") === "single_patient_contact" ?
// //                     !patient_contact?.length ? <div style={{ width: "100px", margin: "auto" }}>No Contactsadsada</div> :
// //                       patient_contact && patient_contact.map((it) => {
// //                         return (
// //                           <div className="msg" onClick={() => {
// //                             if (!patient_contact) {
// //                               settabs("patient_contact")
// //                               setpatient_id(it?._id)

// //                               dispatch(get_patient_contact({ token, patient_id: it?._id }))
// //                             }
// //                             setgroup_id("")
// //                             if (patient_contact) {
// //                               setpatient_contact_id(it._id)
// //                               dispatch(get_messages({ token, Patient_contact: it._id, group_id, chatType: "onebyone" }))
// //                             }

// //                           }}>

// //                             <div className="msg-detail">
// //                               <div className="msg-username">{it.first_name}</div>

// //                             </div>
// //                           </div>
// //                         )
// //                       }) : ""
// //           }

// //           {
// //             tabs === "patient_contact" || tabs == "mass" ?

// //               <div className="add" onClick={(e) => {
// //                 setModalShow(true)
// //               }}>

// //               </div> : ""
// //           }

// //           <div className="overlay"></div>
// //         </div>
// //         <div className="chat-area" ref={chat_container} onScroll={(e)=>{
// //          const scrollTop = chat_container.current.scrollTop;
// //          const scrollHeight = chat_container.current.scrollHeight;
// //          const clientHeight = chat_container.current.clientHeight;
     
// //          if (scrollTop + clientHeight >= scrollHeight - 200 && msg_length!==allmessages.length) {
// //            setPage((prevPage) => prevPage + 1);
// //          }
// //             console.log("scroll",scrollHeight,scrollTop + clientHeight)
// //             // setPage((pre)=>pre+1)
// //           }}>
// //           <div className="chat-area-header">
// //             {/* <div className="chat-area-title">CodePen Group</div> */}
// //             <div className="chat-area-group">
// //               {/* <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" /> */}
// //               {/* <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt=""/> */}
// //               {/* <img className="chat-area-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png" alt="" /> */}
// //               {/* <span>+4</span> */}
// //             </div>
// //           </div>
// //           <div className="chat-area-main" >

// //             {allmessages && allmessages.map((it) => {
// //               return (
// //                 <div className={`chat-msg ${it.Type == "outbound" ? "owner" : ""}`}>
// //                   <div className="chat-msg-profile">
// //                     {/* <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" /> */}
// //                     <div className="chat-msg-date">Message seen 1.22pm</div>
// //                   </div>
// //                   <div className="chat-msg-content">
// //                     <div className="chat-msg-text">{it.messages}</div>

// //                   </div>
// //                 </div>
// //               )
// //             })}


// //             {/* <div className="chat-msg owner">
// //      <div className="chat-msg-profile">
// //       <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
// //       <div className="chat-msg-date">Message seen 1.22pm</div>
// //      </div>
// //      <div className="chat-msg-content">
// //       <div className="chat-msg-text">Sit amet risus nullam eget felis eget. Dolor sed viverra ipsum😂😂😂</div>
// //       <div className="chat-msg-text">Cras mollis nec arcu malesuada tincidunt.</div>
// //      </div>
// //     </div> */}
// //             {/* <div className="chat-msg">
// //      <div className="chat-msg-profile">
// //       <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt=""/>
// //       <div className="chat-msg-date">Message seen 2.45pm</div>
// //      </div>
// //      <div className="chat-msg-content">
// //       <div className="chat-msg-text">Aenean tristique maximus tortor non tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae😊</div>
// //       <div className="chat-msg-text">Ut faucibus pulvinar elementum integer enim neque volutpat.</div>
// //      </div>
// //     </div> */}
// //             {/* <div className="chat-msg owner">
// //      <div className="chat-msg-profile">
// //       <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
// //       <div className="chat-msg-date">Message seen 2.50pm</div>
// //      </div>
// //      <div className="chat-msg-content">
// //       <div className="chat-msg-text">posuere eget augue sodales, aliquet posuere eros.</div>
// //       <div className="chat-msg-text">Cras mollis nec arcu malesuada tincidunt.</div>
// //      </div>
// //     </div> */}
// //             {/* <div className="chat-msg">
// //      <div className="chat-msg-profile">
// //       <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%2812%29.png" alt="" />
// //       <div className="chat-msg-date">Message seen 3.16pm</div>
// //      </div>
// //      <div className="chat-msg-content">
// //       <div className="chat-msg-text">Egestas tellus rutrum tellus pellentesque</div>
// //      </div>
// //     </div> */}
// //             {/* <div className="chat-msg">
// //      <div className="chat-msg-profile">
// //       <img className="chat-msg-img account-profile" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png" alt="" />
// //       <div className="chat-msg-date">Message seen 3.16pm</div>
// //      </div>
// //      <div className="chat-msg-content">
// //       <div className="chat-msg-text">Consectetur adipiscing elit pellentesque habitant morbi tristique senectus et.</div>
// //      </div>
// //     </div> */}
// //             {/* <div className="chat-msg owner">
// //      <div className="chat-msg-profile">
// //       <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png" alt="" />
// //       <div className="chat-msg-date">Message seen 2.50pm</div>
// //      </div>
// //      <div className="chat-msg-content">
// //       <div className="chat-msg-text">Tincidunt arcu non sodales😂</div>
// //      </div>
// //     </div> */}
// //             {/* <div className="chat-msg">
// //      <div className="chat-msg-profile">
// //       <img className="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%282%29.png" alt=""/>
// //       <div className="chat-msg-date">Message seen 3.16pm</div>
// //      </div>
// //      <div className="chat-msg-content">
// //       <div className="chat-msg-text">Consectetur adipiscing elit pellentesque habitant morbi tristique senectus et🥰</div>
// //      </div>
// //     </div> */}
// //           </div>
// //           <div className="chat-area-footer">
// //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-video">
// //               <path d="M23 7l-7 5 7 5V7z" />
// //               <rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
// //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-image">
// //               <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
// //               <circle cx="8.5" cy="8.5" r="1.5" />
// //               <path d="M21 15l-5-5L5 21" /></svg>
// //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-plus-circle">
// //               <circle cx="12" cy="12" r="10" />
// //               <path d="M12 8v8M8 12h8" /></svg>
// //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-paperclip">
// //               <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" /></svg>
// //             <form onSubmit={create_messages} className="d-flex" action="">
// //               <input onChange={(e) => {
// //                 settext(e?.target?.value)
// //               }} type="text" placeholder="Type something here..." />
// //               <button className="bg-light" style={{ color: "bl" }} variant="contained" color="primary" >
// //                 submit
// //               </button>
// //             </form>
// //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-smile">
// //               <circle cx="12" cy="12" r="10" />
// //               <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>
// //             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-thumbs-up">
// //               <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
// //           </div>
// //         </div>
// //         {/* <div className="detail-area">
// //    <div className="detail-area-header">
// //     <div className="msg-profile group">
// //      <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" className="css-i6dzq1">
// //       <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
// //       <path d="M22 8.5l-10 7-10-7" />
// //       <path d="M2 15.5l10-7 10 7M12 2v6.5" /></svg>
// //     </div>
// //     <div className="detail-title">CodePen Group</div>
// //     <div className="detail-subtitle">Created by Aysenur, 1 May 2020</div>
// //     <div className="detail-buttons">
// //      <button className="detail-button">
// //       <svg viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" className="feather feather-phone">
// //        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
// //       </svg>
// //       Call Group
// //      </button>
// //      <button className="detail-button">
// //       <svg viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="currentColor" stroke-width="0" stroke-linecap="round" stroke-linejoin="round" className="feather feather-video">
// //        <path d="M23 7l-7 5 7 5V7z" />
// //        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
// //       Video Chat
// //      </button>
// //     </div>
// //    </div>
// //    <div className="detail-changes">
// //     <input type="text" placeholder="Search in Conversation"/>
// //     <div className="detail-change">
// //      Change Color
// //      <div className="colors">
// //       <div className="color blue selected" data-color="blue"></div>
// //       <div className="color purple" data-color="purple"></div>
// //       <div className="color green" data-color="green"></div>
// //       <div className="color orange" data-color="orange"></div>
// //      </div>
// //     </div>
// //     <div className="detail-change">
// //      Change Emoji
// //      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-thumbs-up">
// //       <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
// //     </div>
// //    </div>
// //    <div className="detail-photos">
// //     <div className="detail-photo-title">
// //      <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-image">
// //       <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
// //       <circle cx="8.5" cy="8.5" r="1.5" />
// //       <path d="M21 15l-5-5L5 21" /></svg>
// //      Shared photos
// //     </div>
// //     <div className="detail-photo-grid">
// //      <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80" />
// //      <img src="https://images.unsplash.com/photo-1516085216930-c93a002a8b01?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
// //      <img src="https://images.unsplash.com/photo-1458819714733-e5ab3d536722?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=933&q=80" />
// //      <img src="https://images.unsplash.com/photo-1520013817300-1f4c1cb245ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2287&q=80" />
// //      <img src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2247&q=80" />
// //      <img src="https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80" />
// //      <img src="https://images.unsplash.com/photo-1560393464-5c69a73c5770?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1301&q=80" />
// //      <img src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2249&q=80" />
// //      <img src="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2309&q=80" />

// //      <img src="https://images.unsplash.com/photo-1473170611423-22489201d919?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80" />
// //      <img src="https://images.unsplash.com/photo-1579613832111-ac7dfcc7723f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
// //      <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2189&q=80" />
// //     </div>
// //     <div className="view-more">View More</div>
// //    </div>
// //    <a href="https://twitter.com/AysnrTrkk" className="follow-me" target="_blank">
// //     <span className="follow-text">
// //      <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" className="css-i6dzq1">
// //       <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
// //      </svg>
// //      Follow me on Twitter
// //     </span>
// //     <span className="developer">
// //      <img src="https://pbs.twimg.com/profile_images/1253782473953157124/x56UURmt_400x400.jpg" />
// //      Aysenur Turk — @AysnrTrkk
// //     </span>
// //    </a>
// //   </div> */}



// //         <Modal
// //           show={modalShow}
// //           onHide={() => setModalShow(false)}
// //           size="lg"
// //           aria-labelledby="contained-modal-title-vcenter"
// //           centered
// //           backdrop={"static"}
// //         >
// //           <Modal.Header closeButton>
// //             <Modal.Title id="contained-modal-title-vcenter">
// //               Create Your Group
// //             </Modal.Title>
// //           </Modal.Header>
// //           <Modal.Body>

// //             <MultiSelect
// //               options={patient_contact_options}
// //               value={selected}
// //               onChange={setSelected}
// //               labelledBy="Select"
// //             />
// //             <div>

// //               <Button variant="contained" color="primary" onClick={() => {
// //                 console.log(selected)
// //                 let members = selected.map((it) => it.value)
// //                 console.log(members)
// //                 dispatch(create_groups({ token, members, group_type: "mass", patient_id }))
// //               }}>
// //                 submit
// //               </Button>
// //             </div>
// //           </Modal.Body>
// //           <Modal.Footer>
// //           </Modal.Footer>
// //         </Modal>
// //       </div>
// //     </div>

// //   );
// // };

// // export default ChatPage;



