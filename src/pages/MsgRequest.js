// import React, { useEffect, useRef, useState } from "react";
// import search from "../asset/search.png";
// import settings from "../asset/settings.png";
// import Ellipse from "../asset/Ellipse 105.png";
// import Ellipse112 from "../asset/Ellipse 112.png";
// import moreveritcal from "../asset/more-vertical.png";
// import Rectangle from "../asset/Rectangle 1510.png";
// import paperclip from "../asset/paperclip.png";
// import Send_btn from "../asset/send_btn.png";
// import Ellipse108 from "../asset/Ellipse 108.png";
// import Ellipse113 from "../asset/Ellipse 113.png";
// import InfiniteScroll from "react-infinite-scroll-component";

// import Sidebar from "./Sidebar";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   get_patient,
//   get_patient_contact,
//   get_unknown_contact,
// } from "../redux/slice/patients";
// import Cookies from "js-cookie";
// import Spinner from "react-bootstrap/Spinner";
// import {
//   create_message,
//   fetch_new_message,
//   get_messages,
//   messgeAction,
//   read_messages,
// } from "../redux/slice/message_slice";
// import moment from "moment";
// import axios from "axios";
// import { apis } from "../apis";
// import { mergeMessagesByDate, remove_duplicate_msg } from "../utils/Helper";
// import { FaUser } from "react-icons/fa";
// import { stringToColor } from "../helper/getAvatar";

// const MsgRequest = () => {
//   const {
//     patient_contact_count,
//     patient,
//     patient_contact,
//     loading,
//     chatgroup,
//     all_patients_contact,
//     unknown_contact,
//   } = useSelector((state) => state.patient);
//   const [show_conatact, setshow_conatact] = useState();
//   const [arrivel_msg, setarrivel_msg] = useState([]);
//   const [show_msg_box, setshow_msg_box] = useState();
//   const [allmessages, setallmessages] = useState([]);
//   const [limit, setlimit] = useState(15);
//   const scroolbotom = useRef();
//   const { message, msg_length, status, get_msg_status, msg_loading } =
//     useSelector((state) => state.message);
//   const [allmsg_length, setallmsg_length] = useState(0);
//   const [patient_contact_id, setpastient_contact_id] = useState("");
//   const [single_patient, setsingle_patient] = useState({});
//   const [single_patient_contact, setsingle_patient_contact] = useState({});
//   const [text, settext] = useState("");
//   const [page, setPage] = useState(1);
//   const [tab, settab] = useState();

//   const dispatch = useDispatch();
//   const token = Cookies.get("token");
//   const [create, setcreate] = useState(false);
//   const [search, setsearch] = useState("");
//   const { socket } = useSelector((state) => state.socket);
//   const [socket_hit, setsocket_hit] = useState(false);
//   const [onetime_scroll, setonetime_scroll] = useState("");

//   const msg_create = async () => {
//     try {
//       let headers = {
//         token: token,
//       };
//       let payload = {
//         token,
//         Type: "outbound",
//         Method: "single",
//         Patient_contact: [patient_contact_id],
//         messages: text,
//         chatType: "onebyone",
//       };
//       const { data } = await axios.post(`${apis.CREATE_MESSAGES}`, payload, {
//         headers,
//       });
//       if (data.status === true) {
//         // fetc_message(patient_contact_id)
//         let msg = {
//           _id: {
//             year: moment().year(),
//             month: moment().month() + 1,
//             day: moment().date(),
//           },
//           messages: [data.data],
//         };

//         const mergedData = mergeMessagesByDate([...allmessages, msg]);

//         // const lastmsg = allmessages[allmessages.length - 1];

//         // if(lastmsg._id.year==moment().year() && lastmsg._id.month==moment().month()+1 && lastmsg._id.day==moment().date()){
//         //     lastmsg.messages.push(data.data)
//         // }
//         setallmessages(mergedData);
//         setonetime_scroll(0);
//       }
//     } catch (error) {
//     }
//   };

//   const activeClasses = (et) => {
//     // const et = e.target
//     let active = document.querySelector(".actives");
//     if (active) {
//       active.classList.remove("actives");
//     }
//     et.classList.add("actives");
//   };

//   const active_contactClasses = (et) => {
//     // const et = e.target
//     let active = document.querySelector(".cont-active-cls");
//     if (active) {
//       active.classList.remove("cont-active-cls");
//     }
//     et.classList.add("cont-active-cls");
//   };

//   const handleScroll = (e) => {
//     let ele = document.getElementById("msg-scrol");
//     const scrollTop = ele.scrollTop;
//     const scrollHeight = ele.scrollHeight;
//     const clientHeight = ele.clientHeight;
//     let a = 0;
//     let len = allmessages.map((it) => {
//       a += it?.messages?.length;
//     });
//     if (scrollTop < 1200 && allmsg_length < msg_length) {
//       if (limit < msg_length) {
//         setlimit(limit + 15);
//       }
//       // if(Math.ceil(msg_length/10)>page){
//       //     setPage(page + 1);
//       // }
//     }
//   };

//   const create_messages = (e) => {
//     e.preventDefault();

//     setcreate(true);

//     msg_create();
//     settext("");
//   };

//   useEffect(() => {
//     if (!unknown_contact) {
//       dispatch(get_unknown_contact({ token, search, limit: 100, page: 1 }));
//     }
//     if (patient_contact_id) {
//       fetc_message(patient_contact_id);
//     }
//   }, [token, patient_contact_id, limit]);
//   useEffect(() => {
//     if (get_msg_status) {
//       dispatch(messgeAction.status_blank());
//     }
//   }, [get_msg_status]);

//   const fetc_message = (Patient_contact) => {
//     dispatch(
//       get_messages({
//         token,
//         limit: limit,
//         Patient_contact,
//         chatType: "onebyone",
//       })
//     );
//   };

//   useEffect(() => {
//     if (message) {
//       if (create == true) {
//         setallmessages(message);
//         message.map((it) => {
//           setallmsg_length((pr) => it?.messages?.length + pr);
//         });
//       }
//       if (message?.length) {

//         message.map((it) => {
//           setallmsg_length((pr) => it?.messages?.length + pr);
//         });

//         setallmessages(message);

//         // dispatch(messgeAction.status_blank())
//       }
//     }
//   }, [message]);

//   useEffect(() => {
//     if (socket) {
//       socket.on("msg-send", (data) => {
//         const id = document.getElementById(data.sender_id);
//         if (id?.classList[1] === "actives") {
//           // setsocket_hit(true)
//           // fetc_message(data.sender_id)
//           dispatch(read_messages({ token, contact_id: data.sender_id }));
//           setarrivel_msg(data.msg);
//         }
//         // dispatch(fetch_new_message({token}))
//       });
//     }
//     return () => {
//       socket &&
//         socket.off("msg-send", (data) => {
//           const id = document.getElementById(data.sender_id);
//           if (id?.classList[1] === "actives") {
//             // setsocket_hit(true)
//             // fetc_message(data.sender_id)
//             dispatch(read_messages({ token, contact_id: data.sender_id }));
//             setarrivel_msg(data.msg);
//           }
//         });
//     };
//   }, [socket]);

//   useEffect(() => {
//     if (onetime_scroll !== 1 && allmessages.length) {
//       scroolbotom.current?.scrollTo(0, scroolbotom.current?.scrollHeight);
//       setonetime_scroll(1);
//     }
//   }, [allmessages]);

//   useEffect(() => {
//     if (arrivel_msg) {
//       const newarr = allmessages.filter((it) => {
//         if (
//           arrivel_msg[0]._id.day !== it._id.day &&
//           arrivel_msg[0]._id.year === it._id.year
//         ) {
//           return true;
//         }
//       });
//       setallmessages([...newarr, ...arrivel_msg]);
//       setonetime_scroll(0);
//     }
//   }, [arrivel_msg]);

//   useEffect(() => {
//     if (status == true) {
//       dispatch(messgeAction.status_blank());
//       // dispatch(fetch_new_message({ token }))
//     }
//   }, [status]);

//   useEffect(() => {
//     if (tab) {

//       dispatch(fetch_new_message({ token }));
//     }
//   }, [tab]);

//   return (
//     <>
//       <div className="contact_main_div">
//         <Sidebar />
//         <div className="head-div">
//           <div className="head_header">
//             <h2>Contact Texting</h2>

//             <div className="admin-section">
//               {/* <p>
//                 <i className="fa-regular fa-bell"></i>
//               </p>
//               <div>
//                 <img src={Ellipse113} alt="" />
//               </div> */}
//               <span>Admin</span>
//             </div>
//           </div>
//           <div className="ext-cls">
//             <div className="patient_contact" style={{ flex: "none" }}>
//               <div className="patients">
//                 <div className="patient_hd">
//                   <div>
//                     <span>
//                       <h4>All Message Request</h4>
//                     </span>
//                   </div>
//                   <div className="settings">
//                     <img src={settings} alt="" />
//                   </div>
//                 </div>
//                 <div className="contact_search">
//                   <span>
//                     <img src={search} alt="" />{" "}
//                     <input
//                       type="search"
//                       name=""
//                       placeholder="Search..."
//                       id=""
//                       onChange={(e) => {
//                         dispatch(
//                           get_patient({ token, search: e.target.value })
//                         );
//                       }}
//                     />
//                   </span>
//                 </div>
//               </div>
//               <div className="all-patient">
//                 {loading === "unknown" ? (
//                   <div
//                     style={{
//                       paddingLeft: "21px",
//                       paddingTop: "192px",
//                       width: "100px",
//                       margin: "auto",
//                     }}
//                   >
//                     <Spinner animation="border" variant="primary" />
//                   </div>
//                 ) : (
//                   unknown_contact &&
//                   unknown_contact.map((it) => {
//                     return (
//                       <div
//                         id={it._id}
//                         className="chat"
//                         onClick={() => {
//                           setshow_msg_box(true);
//                           if (patient_contact_id !== it._id) {
//                             setpastient_contact_id(it._id);
//                             setallmessages([]);
//                             setPage(1);
//                             setlimit(15);
//                             setallmsg_length(0);
//                             setonetime_scroll(0);
//                           }
//                           settab(it._id);
//                           setsingle_patient_contact({
//                             name: `${it?.phone}`,
//                           });

//                           let et = document.getElementById(it._id);
//                           activeClasses(et);
//                         }}
//                       >
//                         <div className="img_div">
//                           {/* <img src={Ellipse} alt="" /> */}
//                           <span style={{
//                             backgroundColor:stringToColor(`${it.phone}`),
//                             padding:"10px",
//                             borderRadius:"50%",
//                             display:"flex",
//                             justifyContent:"center",
//                             alignItems:"center"
//                           }} >
//                             <FaUser size={30} style={{
//                               color:"white"
//                             }} />
//                           </span>
//                         </div>
//                         <div className="name-sections">
//                           <p>{`${it.phone}`}</p>
//                           <p className="msgd"></p>
//                         </div>
//                         <div className="date">
//                           <p></p>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//             {show_msg_box ? (
//               <div className="chatbot">
//                 <div className="chat-info">
//                   <div className="img-name-div">
//                     <div>
//                       {/* <img src={Ellipse112} alt="" /> */}
//                       <span style={{
//                             backgroundColor:stringToColor(single_patient_contact?.name),
//                             padding:"10px",
//                             borderRadius:"50%",
//                             display:"flex",
//                             justifyContent:"center",
//                             alignItems:"center"
//                           }} >
//                             <FaUser size={30} style={{
//                               color:"white"
//                             }} />
//                           </span>
//                     </div>
//                     <p>{single_patient_contact.name}</p>
//                   </div>

//                   <div>
//                     <img src={moreveritcal} alt="" />
//                   </div>
//                 </div>

//                 <div
//                   id="msg-scrol"
//                   ref={scroolbotom}
//                   className="msg-section"
//                   onScroll={(e) => {
//                     handleScroll(e);
//                   }}
//                 >
//                   {!allmessages.length && msg_loading === "get_msg" ? (
//                     <div
//                       style={{
//                         paddingLeft: "21px",
//                         paddingTop: "192px",
//                         width: "100px",
//                         margin: "auto",
//                       }}
//                     >
//                       <Spinner animation="border" variant="primary" />
//                     </div>
//                   ) : (
//                     allmessages &&
//                     allmessages.map((it) => {
//                       return (
//                         <>
//                           {allmessages.length && msg_loading === "get_msg" ? (
//                             <div
//                               style={{
//                                 paddingLeft: "21px",
//                                 width: "100px",
//                                 margin: "auto",
//                               }}
//                             >
//                               <Spinner animation="border" variant="primary" />
//                             </div>
//                           ) : (
//                             ""
//                           )}

//                           <div className="date-heading">
//                             <div className="brder"></div>
//                             <p>
//                               {moment(
//                                 `${it?._id.year}-${it?._id.month}-${it?._id.day}`
//                               ).format("MMMM DD")}
//                             </p>{" "}
//                             <div className="brder"></div>
//                           </div>

//                           {it?.messages?.map((val) => {
//                             return val.Type === "inbound" ? (
//                               <div
//                                 className="msg-container"
//                                 style={{
//                                   justifyContent: "flex-start",
//                                   columnGap: "12px",
//                                 }}
//                               >
//                                 <div className="msg-lg">
//                                   <img src={Ellipse112} alt="" />
//                                 </div>
//                                 <div>
//                                   <div className="msgs">
//                                     <p>{val.messages}</p>
//                                   </div>
//                                   <p id="msg-date">
//                                     {moment(val?.createdAt).format("hh:mma")}
//                                   </p>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="msg-container">
//                                 <div>
//                                   <div className="inbound">
//                                     <p>{val.messages}</p>
//                                   </div>
//                                   <p id="msg-date" className="inbound-date">
//                                     {moment(val?.createdAt).format("hh:mma")}
//                                   </p>
//                                 </div>
//                                 <div className="msg-lg">
//                                   <img src={Ellipse108} alt="" />
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </>
//                       );
//                     })
//                   )}
//                 </div>

//                 <div>
//                   <div className="msg-creation">
//                     <form
//                       className="msg-creation-form"
//                       action=""
//                       onSubmit={create_messages}
//                     >
//                       <input
//                         type="text"
//                         placeholder="Write a Message"
//                         value={text}
//                         onChange={(e) => {
//                           settext(e.target.value);
//                         }}
//                         name=""
//                         id=""
//                       />
//                       <img src={paperclip} alt="" />
//                       <p>
//                         <i className="fa-regular fa-face-smile mb-0"></i>
//                       </p>
//                       <button type="submit">
//                         <i className="fa-regular fa-paper-plane"></i>
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             ) : (
//               <div className="chatbot">
//                 <div className="chat-info"></div>
//                 <div id="msg-scrol" className="msg-section"></div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default MsgRequest;
