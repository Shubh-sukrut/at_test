// import React, { useEffect, useRef, useState } from "react";
// // import search from "../asset/search.png";
// import settings from "../asset/settings.png";
// import Ellipse from "../asset/Ellipse 105.png";
// import Ellipse112 from "../asset/Ellipse 112.png";
// import moreveritcal from "../asset/more-vertical.png";
// // import Rectangle from "../asset/Rectangle 1510.png";
// import paperclip from "../asset/paperclip.png";
// // import Send_btn from "../asset/send_btn.png";
// import Ellipse108 from "../asset/Ellipse 108.png";
// import Ellipse113 from "../asset/Ellipse 113.png";

// import Sidebar from "./Sidebar";
// import { useDispatch, useSelector } from "react-redux";
// import { get_patient, get_patient_contact } from "../redux/slice/patients";
// import Cookies from "js-cookie";
// import Spinner from "react-bootstrap/Spinner";
// import {
//     create_message,
//     fetch_new_message,
//     get_messages,
//     messgeAction,
//     read_messages,
// } from "../redux/slice/message_slice";
// import moment from "moment";
// import axios from "axios";
// import { apis } from "../apis";
// // import { remove_duplicate_msg } from "../utils/Helper";
// import Pagination from '@mui/material/Pagination';
// import useDebounce from "../helper/useDebounce";
// import { Avatar } from "@mui/material";
// import { stringAvatar } from "../helper/getAvatar";


// const ContactTexting = () => {
//     const { socket } = useSelector((state) => state.socket);
//     const {
//         patient_contact_count,
//         patient,
//         totalPatientCounts,
//         patient_contact,
//         loading,
//         chatgroup,
//         all_patients_contact,
//     } = useSelector((state) => state.patient);
//     const [show_conatact, setshow_conatact] = useState();
//     const [show_msg_box, setshow_msg_box] = useState();
//     const [allmessages, setallmessages] = useState([]);
//     const [arrivel_msg, setarrivel_msg] = useState([]);
//     const scroolbotom = useRef();
//     const {
//         get_msg_status,
//         status,
//         message,
//         msg_length,
//         msg_loading,
//         new_msg_count,
//     } = useSelector((state) => state.message);
//     const [allmsg_length, setallmsg_length] = useState(0);
//     const [patient_contact_id, setpastient_contact_id] = useState("");
//     const [single_patient, setsingle_patient] = useState({});
//     const [single_patient_contact, setsingle_patient_contact] = useState({});
//     const [text, settext] = useState("");
//     const [onetime_scroll, setonetime_scroll] = useState("");
//     const [page, setPage] = useState(1);
//     const [limit, setlimit] = useState(15);
//     const dispatch = useDispatch();
//     const token = Cookies.get("token");
//     const [create, setcreate] = useState(false);
//     const [search, setsearch] = useState("");

//     const [searchQuery, setSearchQuery] = useState('');
//     const debouncedSearch = useDebounce(searchQuery, 500);

//     const [socket_hit, setsocket_hit] = useState(false);
//     const [tab, settab] = useState();
//     const [pagination, setPagination] = useState({
//         page: 1,
//         limit: 10,
//     });

//     const handlePageChange = (event, value) => {
//         setPagination((prevState) => ({ ...prevState, page: value }));
//         // dispatch(get_patient({ token, debouncedSearch, ...pagination }));
//     };


//     function mergeMessagesByDate(messages) {
//         const mergedMessages = {};

//         messages.forEach((dayData) => {
//             const { _id, messages } = dayData;
//             const { year, month, day } = _id;
//             const key = `${year}-${month}-${day}`;

//             if (!mergedMessages[key]) {
//                 mergedMessages[key] = {
//                     _id: { year, month, day },
//                     messages: [],
//                 };
//             }

//             mergedMessages[key].messages =
//                 mergedMessages[key].messages.concat(messages);
//         });

//         return Object.values(mergedMessages);
//     }

//     const msg_create = async () => {
//         try {
//             let headers = {
//                 token: token,
//             };
//             let payload = {
//                 token,
//                 Type: "outbound",
//                 Method: "single",
//                 Patient_contact: [patient_contact_id],
//                 messages: text,
//                 chatType: "onebyone",
//             };
//             const { data } = await axios.post(`${apis.CREATE_MESSAGES}`, payload, {
//                 headers,
//             });
//             if (data.status === true) {
//                 let msg = {
//                     _id: {
//                         year: moment().year(),
//                         month: moment().month() + 1,
//                         day: moment().date(),
//                     },
//                     messages: [data.data],
//                 };

//                 const mergedData = mergeMessagesByDate([...allmessages, msg]);
//                 setallmessages(mergedData);
//                 setonetime_scroll(0);
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     const activeClasses = (et) => {
//         let active = document.querySelector(".actives");
//         if (active) {
//             active.classList.remove("actives");
//         }
//         et.classList.add("actives");
//     };

//     const active_contactClasses = (et) => {
//         let active = document.querySelector(".cont-active-cls");
//         if (active) {
//             active.classList.remove("cont-active-cls");
//         }
//         et.classList.add("cont-active-cls");
//     };

//     const handleScroll = (e) => {
//         let ele = document.getElementById("msg-scrol");
//         const scrollTop = ele.scrollTop;
//         // const scrollHeight = ele.scrollHeight;
//         // const clientHeight = ele.clientHeight;
//         let a = 0;
//         let len = allmessages.map((it) => {
//             a += it?.messages?.length;
//         });

//         if (scrollTop < 1200 && allmsg_length < msg_length) {
//             if (limit < msg_length) {
//                 setlimit(limit + 15);
//             }
//             // if(Math.ceil(msg_length/10)>page){
//             //     console.log(Math.ceil(msg_length/10)>page,Math.ceil(msg_length/10),page)
//             //     setPage(page + 1);
//             // }
//         }
//     };

//     const create_messages = (e) => {
//         e.preventDefault();

//         setcreate(true);
//         msg_create();
//         settext("");
//     };

//     useEffect(() => {
//         if (socket) {
//             socket.on("msg-send", (data) => {
//                 const id = document.getElementById(data.sender_id);
//                 // console.log(id?.classList[1])
//                 if (id?.classList[1] === "cont-active-cls") {
//                     // setsocket_hit(true)
//                     setarrivel_msg(data.msg);
//                     // console.log("match id",allmessages,data,[remove_duplicate_msg([...allmessages,...data.msg])])
//                     dispatch(read_messages({ token, contact_id: data.sender_id }));
//                     // setallmessages([remove_duplicate_msg([...allmessages,...data.msg])])
//                     // fetc_message(data.sender_id)
//                 }
//                 // dispatch(fetch_new_message({token}))
//             });
//         }
//         return () => {
//             socket &&
//                 socket.off("msg-send", (data) => {
//                     // fetc_message(data.sender_id)
//                 });
//         };
//     }, [socket]);

//     useEffect(() => {
//         if (status == true) {
//             // dispatch(fetch_new_message({ token }))
//             dispatch(messgeAction.status_blank());
//         }
//     }, [status]);

//     useEffect(() => {
//         if (!patient) {
//             dispatch(get_patient({ token, search: debouncedSearch, ...pagination }));
//         }
//         if (get_msg_status === true) {
//             dispatch(messgeAction.status_blank());
//         }
//     }, [token, get_msg_status, dispatch, debouncedSearch, pagination]);

//     useEffect(() => {
//         if (debouncedSearch.length > 2 || debouncedSearch === '') {
//             dispatch(get_patient({ token, search: debouncedSearch, ...pagination }));
//         }
//     }, [debouncedSearch, pagination, dispatch, token]);



//     const fetc_contact = (patient_id) => {
//         dispatch(
//             get_patient_contact({ token, page: 1, limit: 2, patient_id: patient_id })
//         );
//     };

//     const fetc_message = (Patient_contact) => {
//         // console.log("Patient_contact", Patient_contact)
//         dispatch(
//             get_messages({
//                 token,
//                 limit: limit,
//                 Patient_contact,
//                 chatType: "onebyone",
//             })
//         );
//     };
//     useEffect(() => {
//         if (patient_contact_id) {
//             // console.log(patient_contact_id)
//             fetc_message(patient_contact_id);
//         }
//     }, [patient_contact_id, limit]);

//     useEffect(() => {
//         if (tab) {
//             // console.log(patient_contact_id)
//             dispatch(fetch_new_message({ token }));
//         }
//     }, [tab]);

//     useEffect(() => {
//         if (message) {
//             if (create == true) {
//                 // setallmessages(message)
//                 message.map((it) => {
//                     setallmsg_length((pr) => it?.messages?.length + pr);
//                 });
//             }
//             if (message?.length) {
//                 // console.log("soket_hit false")

//                 message.map((it) => {
//                     setallmsg_length((pr) => it?.messages?.length + pr);
//                 });

//                 setallmessages(message);

//                 // dispatch(messgeAction.status_blank())
//             }
//         }
//     }, [message]);

//     useEffect(() => {
//         if (onetime_scroll !== 1 && allmessages.length) {
//             scroolbotom.current?.scrollTo(0, scroolbotom.current?.scrollHeight);
//             setonetime_scroll(1);
//         }
//     }, [allmessages]);

//     useEffect(() => {
//         if (arrivel_msg.length) {
//             const newarr = allmessages.filter((it) => {
//                 if (
//                     arrivel_msg[0]?._id?.day !== it?._id?.day &&
//                     arrivel_msg[0]?._id?.year === it?._id?.year
//                 ) {
//                     return true;
//                 }
//             });
//             // console.log(remove_duplicate_msg([...arrivel_msg,...allmessages]),arrivel_msg,allmessages)
//             setonetime_scroll(0);
//             setallmessages([...newarr, ...arrivel_msg]);
//         }
//     }, [arrivel_msg]);

//     return (
//         <>
//             <div className="contact_main_div">
//                 <Sidebar />
//                 <div className="head-div">
//                     <div className="head_header">
//                         <h2>Contact Texting</h2>

//                         <div className="admin-section">
//                             {/* <p>
//                                 <i className="fa-regular fa-bell"></i>
//                             </p>
//                             <div>
//                                 <img src={Ellipse113} alt="" />
//                             </div> */}
//                             <span>Admin</span>
//                         </div>
//                     </div>
//                     <div className="ext-cls">
//                         <div className="patient_contact" 
//                         style={{
//                             position:"relative",
//                             maxWidth: "370px"
//                         }}
//                         >
//                             <div className="patients">
//                                 <div className="patient_hd">
//                                     <div>
//                                         <span>
//                                             <h4>All Patients</h4>
//                                         </span>
//                                         {new_msg_count > 0 ? (
//                                             <div className="new">{new_msg_count} New</div>
//                                         ) : (
//                                             ""
//                                         )}
//                                     </div>
//                                     <div className="settings">
//                                         <img src={settings} alt="" />
//                                     </div>
//                                 </div>
//                                 <div className="contact_search">
//                                     <span>
//                                         {/* <img src={search} alt="" /> */}
//                                         <input
//                                             type="text"
//                                             name=""
//                                             placeholder="Search..."
//                                             id=""
//                                             // onChange={(e) => {
//                                             //     dispatch(
//                                             //         get_patient({ token, search: e.target.value })
//                                             //     );
//                                             // }}
//                                             onChange={(e) => {
//                                                 setSearchQuery(e.target.value)
//                                                 if(e.target.value.length > 2 && pagination.page != 1){
//                                                     handlePageChange(e,1)
//                                                 }
//                                             }}
//                                         />
//                                     </span>
//                                 </div>
//                             </div>
//                             <div className="all-patient" >
//                                 {loading === "patient" ? (
//                                     <div
//                                         style={{
//                                             paddingLeft: "21px",
//                                             paddingTop: "192px",
//                                             width: "100px",
//                                             margin: "auto",
//                                         }}
//                                     >
//                                         <Spinner animation="border" variant="primary" />
//                                     </div>
//                                 ) : (
//                                     patient &&
//                                     patient.map((it) => {
//                                         return (
//                                             <div
//                                                 id={it._id}
//                                                 className="chat"
//                                                 onClick={() => {
//                                                     fetc_contact(it._id);
//                                                     setshow_conatact(true);
//                                                     setsingle_patient({
//                                                         name: `${it.first_name
//                                                             .charAt(0)
//                                                             .toUpperCase()}${it.first_name.slice(
//                                                                 1
//                                                             )?.trim()} ${it.last_name
//                                                                 .charAt(0)
//                                                                 .toUpperCase()}${it.last_name.slice(1)?.trim()}`,
//                                                         email: it.email,
//                                                     });
//                                                     let et = document.getElementById(it._id);
//                                                     activeClasses(et);
//                                                 }}
//                                             >
//                                                 <div className="img_div" >
//                                                     { /* <img src={Ellipse} alt="" /> */}
//                                                     <Avatar {...stringAvatar(`${it.first_name
//                                                         .charAt(0)
//                                                         .toUpperCase()}${it.first_name.slice(
//                                                             1
//                                                         )} ${it.last_name
//                                                             .charAt(0)
//                                                             .toUpperCase()}${it.last_name.slice(1)}`)} />
//                                                 </div>
//                                                 <div className="name-sections">
//                                                     <p>{`${it.first_name
//                                                         .charAt(0)
//                                                         .toUpperCase()}${it.first_name.slice(
//                                                             1
//                                                         )} ${it.last_name
//                                                             .charAt(0)
//                                                             .toUpperCase()}${it.last_name.slice(1)}`}</p>
//                                                     <p className="msgd"></p>
//                                                 </div>
//                                                 {/* <div className="date">
//                                                     <p></p>
//                                                 </div> */}
//                                             </div>
//                                         );
//                                     })
//                                 )}
                                
//                             </div>
//                             {/* Pagination Component */}
//                             {totalPatientCounts &&
//                                 <Pagination
//                                     count={Math.ceil(totalPatientCounts / pagination.limit)} // Adjust `totalPatients` accordingly
//                                     page={pagination.page}
//                                     onChange={handlePageChange}
//                                     color="success"
//                                     sx={{
//                                         position:"absolute",
//                                         bottom:0,
//                                         right:0,
//                                         paddingTop:1,
//                                         backgroundColor:"#ebf6f4"
//                                     }}
//                                 />}
//                         </div>
//                         {show_conatact ? (
//                             <div className="contact-box">
//                                 {
//                                 loading === "patient_contact" ? (
                               
//                                     <div
//                                         style={{
//                                             // paddingLeft: "21px",
//                                             // paddingTop: "192px",
//                                             height:"60vh",
//                                             width: "100%",
//                                             display:"flex",
//                                             justifyContent:"center",
//                                             alignItems:"center"
//                                         }}
//                                     >
//                                         <Spinner animation="border" variant="primary" />
//                                     </div>
//                                 ) : (
//                                     <>
//                                         <div className="cont-box flex-column">
//                                             <div className="lg-contact">
//                                                 {/* <img src={Ellipse112} alt="" /> */}
//                                                 <Avatar {...stringAvatar(single_patient?.name , 75 ,75)} />
//                                             </div>

//                                             <div className="cont-box-info">
//                                                 <p className="cont-box-name">{single_patient?.name}</p>
//                                                 <p className="cont-box-mail">{single_patient?.email}</p>
//                                             </div>
//                                             <div className="tot-cont">
//                                                 <p>{patient_contact_count} Contacts</p>
//                                             </div>
//                                         </div>
//                                         <div className="heading-cont">
//                                             <h3>Contact</h3>

//                                             <p>See all</p>
//                                         </div>
//                                         <div className="cont-list">
//                                             {patient_contact &&
//                                                 patient_contact.map((it) => {
//                                                     return (
//                                                         <div
//                                                             id={it._id}
//                                                             className="conts"
//                                                             onClick={(e) => {
//                                                                 setpastient_contact_id(it._id);
//                                                                 setshow_msg_box(true);
//                                                                 if (patient_contact_id !== it._id) {
//                                                                     setallmessages([]);
//                                                                     setPage(1);
//                                                                     setlimit(15);
//                                                                     setallmsg_length(0);
//                                                                     setonetime_scroll(0);
//                                                                 }
//                                                                 settab(it._id);
//                                                                 setsingle_patient_contact({
//                                                                     name: `${it.first_name
//                                                                         .charAt(0)
//                                                                         .toUpperCase()}${it.first_name.slice(
//                                                                             1
//                                                                         )?.trim()} ${it.last_name
//                                                                             .charAt(0)
//                                                                             .toUpperCase()}${it.last_name.slice(1)?.trim()}`,
//                                                                 });
//                                                                 let et = document.getElementById(it._id);
//                                                                 active_contactClasses(et);
//                                                             }}
//                                                         >
//                                                              <Avatar {...stringAvatar(`${it.first_name
//                                                                 .charAt(0)
//                                                                 .toUpperCase()}${it?.first_name?.slice(0)?.trim()} ${it?.last_name
//                                                                     .charAt(0)
//                                                                     .toUpperCase()}${it.last_name?.slice(0)?.trim()}`)} />
//                                                             <p>{`${it.first_name
//                                                                 .charAt(0)
//                                                                 .toUpperCase()}${it.first_name.slice(
//                                                                     1
//                                                                 )} ${it.last_name
//                                                                     .charAt(0)
//                                                                     .toUpperCase()}${it.last_name.slice(1)}`}</p>
//                                                             <span>send text</span>
//                                                         </div>
//                                                     );
//                                                 })}
//                                         </div>{" "}
//                                     </>
//                                 )}
//                             </div>
//                         ) : (
//                             <div className="contact-box"></div>
//                         )}

//                         {show_msg_box ? (
//                             <div className="chatbot">
//                                 <div className="chat-info">
//                                     <div className="img-name-div">
//                                         <div>
//                                             {/* <img src={Ellipse112} alt="" /> */}
//                                             <Avatar {...stringAvatar(single_patient_contact.name)} />
//                                         </div>
//                                         <p>{single_patient_contact.name}</p>
//                                     </div>

//                                     <div>
//                                         <img src={moreveritcal} alt="" />
//                                     </div>
//                                 </div>

//                                 <div
//                                     id="msg-scrol"
//                                     ref={scroolbotom}
//                                     className="msg-section"
//                                     onScroll={(e) => {
//                                         handleScroll(e);
//                                     }}
//                                 >
//                                     {!allmessages.length && msg_loading === "get_msg" ? (
//                                         <div
//                                             style={{
//                                                 paddingLeft: "21px",
//                                                 paddingTop: "192px",
//                                                 width: "100px",
//                                                 margin: "auto",
//                                             }}
//                                         >
//                                             <Spinner animation="border" variant="primary" />
//                                         </div>
//                                     ) : (
//                                         <>
//                                             {allmessages &&
//                                                 allmessages.map((it) => {
//                                                     let date = moment(it?.createdAt).format("YYYY-MM-DD");
//                                                     let msg = it?.messages;
//                                                     return (
//                                                         <>
//                                                             {allmessages.length &&
//                                                                 msg_loading === "get_msg" ? (
//                                                                 <div
//                                                                     style={{
//                                                                         paddingLeft: "21px",
//                                                                         width: "100px",
//                                                                         margin: "auto",
//                                                                     }}
//                                                                 >
//                                                                     <Spinner
//                                                                         animation="border"
//                                                                         variant="primary"
//                                                                     />
//                                                                 </div>
//                                                             ) : (
//                                                                 ""
//                                                             )}

//                                                             <div className="date-heading">
//                                                                 <div className="brder"></div>
//                                                                 <p>
//                                                                     {moment(
//                                                                         `${it?._id?.year}-${it?._id?.month}-${it?._id?.day}`
//                                                                     ).format("MMMM DD")}
//                                                                 </p>{" "}
//                                                                 <div className="brd235er"></div>
//                                                             </div>

//                                                             {it?.messages?.map((val) => {
//                                                                 return val.Type === "inbound" ? (
//                                                                     <div
//                                                                         className="msg-container"
//                                                                         style={{
//                                                                             justifyContent: "flex-start",
//                                                                             columnGap: "12px",
//                                                                         }}
//                                                                     >
//                                                                         <div className="msg-lg">
//                                                                             <img src={Ellipse112} alt="" />
//                                                                         </div>
//                                                                         <div>
//                                                                             <div className="msgs">
//                                                                                 {val.messages.includes("<ttlbrk/>") ? (
//                                                                                     <>
//                                                                                         <b>
//                                                                                             {
//                                                                                                 val.messages.split(
//                                                                                                     "<ttlbrk/>"
//                                                                                                 )[0]
//                                                                                             }
//                                                                                         </b>
//                                                                                         <p>
//                                                                                             {
//                                                                                                 val.messages.split(
//                                                                                                     "<ttlbrk/>"
//                                                                                                 )[1]
//                                                                                             }
//                                                                                         </p>
//                                                                                     </>
//                                                                                 ) : (
//                                                                                     <p>{val.messages}</p>
//                                                                                 )}
//                                                                             </div>
//                                                                             <p id="msg-date">
//                                                                                 {moment(val?.createdAt).format(
//                                                                                     "hh:mma"
//                                                                                 )}
//                                                                             </p>
//                                                                         </div>
//                                                                     </div>
//                                                                 ) : (
//                                                                     <div className="msg-container">
//                                                                         <div>
//                                                                             <div className="inbound">
//                                                                                 {val.messages.includes("<ttlbrk/>") ? (
//                                                                                     <>
//                                                                                         <b>
//                                                                                             {
//                                                                                                 val.messages.split(
//                                                                                                     "<ttlbrk/>"
//                                                                                                 )[0]
//                                                                                             }
//                                                                                         </b>
//                                                                                         <p>
//                                                                                             {
//                                                                                                 val.messages.split(
//                                                                                                     "<ttlbrk/>"
//                                                                                                 )[1]
//                                                                                             }
//                                                                                         </p>
//                                                                                     </>
//                                                                                 ) : (
//                                                                                     <p>{val.messages}</p>
//                                                                                 )}
//                                                                             </div>
//                                                                             <p id="msg-date" className="inbound-date">
//                                                                                 {moment(val?.createdAt).format(
//                                                                                     "hh:mma"
//                                                                                 )}
//                                                                             </p>
//                                                                         </div>
//                                                                         <div className="">
//                                                                             <img
//                                                                                 src={Ellipse108}
//                                                                                 alt=""
//                                                                                 style={{ maxWidth: "none" }}
//                                                                             />
//                                                                         </div>
//                                                                     </div>
//                                                                 );
//                                                             })}
//                                                         </>
//                                                     );
//                                                 })}
//                                         </>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <div className="msg-creation">
//                                         <form
//                                             className="msg-creation-form"
//                                             action=""
//                                             onSubmit={create_messages}
//                                         >
//                                             <input
//                                                 type="text"
//                                                 placeholder="Write a Message"
//                                                 value={text}
//                                                 onChange={(e) => {
//                                                     settext(e.target.value);
//                                                 }}
//                                                 name=""
//                                                 id=""
//                                             />
//                                             <img src={paperclip} alt="" />
//                                             <p>
//                                                 <i className="fa-regular fa-face-smile mb-0"></i>
//                                             </p>
//                                             <button type="submit">
//                                                 <i className="fa-regular fa-paper-plane"></i>
//                                             </button>
//                                         </form>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (<>
//                             <div className='chatbot'>
//                                 <div className='chat-info'></div>
//                                 <div id='msg-scrol' ref={scroolbotom} className='msg-section'></div>
//                                 <div >
//                                     <div className='msg-creation'>

//                                     </div>
//                                 </div>
//                             </div>
//                         </>)}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default ContactTexting;
