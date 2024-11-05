// import React, { useEffect, useState } from 'react'
// import "../assets/chatroom.css"
// import ChatBody from './ChatBody'
// import UserDashboard from './UserDashboard'
// import axios from "axios";
// // import Lottie from '../loader/Lottie'
// // import { io } from "socket.io-client";
// import BaseUrl from '../BaseUrl'
// import Cookies from 'js-cookie'
// import { useDispatch } from 'react-redux'
// import { chatActions } from '../redux/slices/ChatSlice'
// const ChatRoom = () => {
//     const [ data, setData ] = useState();
//     const userData = JSON.parse( Cookies.get( 'emt' ) );
//     const [ loader, setloader ] = useState( true );
//     const dispatch = useDispatch();
//     const socket = io( BaseUrl );
//     useEffect( () => {
//         if ( socket ) {
//             socket.emit( 'joinuser', { id: userData._id } )
//         }
//     }, [] )
//     useEffect( () => {
//         if ( socket ) {
//             socket.on( "recive-msg", ( msg ) => {
//                 dispatch( chatActions.pushMessage( {
//                     it: msg.data,
//                     me: false,
//                 } ) );
//             } )
//         }
//     }, [ socket ] )
//     return (
//         <div className='chatroom' >
//             {/* <SideBar />
//             <UserDashboard /> */}
//             <div className='chatroom-wrapper pl-1'>
//                 <ChatBody />
//             </div>

//         </div>

//     )
// }

// export default ChatRoom;


// // <div className='chatroom' >
// //     <SideBar />
// //     <UserDashboard />
// //     <div className='chatroom-wrapper pl-1'>
// //         <ChatBody data={ data } />
// //     </div>
// // </div>