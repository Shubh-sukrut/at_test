import React, { useEffect, useState } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Sidebar from './Sidebar';
import { Skeleton, Tooltip } from '@mui/material';

import Ellipse113 from "../asset/Ellipse 113.png"
import { FaArrowRight } from "react-icons/fa";
import TablePagination from '@mui/material/TablePagination';
import { Link, useNavigate } from 'react-router-dom';
import { get_broadcasts, get_messages } from '../redux/slice/message_slice';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from "js-cookie";
import { get_facility } from '../redux/slice/login';
import moment from 'moment';

const columns = [
    1, 2, 3, 4
]

const BroadCastHistory = () => {
    const profile = useSelector((state) => state.profile);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = Cookies.get("token");
    const [page , setPage] = useState(0);
    const {
        msg_loading,
        broadcasts,
        total_broadcasts
    } = useSelector((state) => state.message);
    const facility = useSelector(state => state.facility)

    useEffect(() => {
        if (!facility?.status && !facility?.loading) {
            dispatch(get_facility({ token }))
        }
        dispatch(
            get_broadcasts({
                token,
                page: page+1,
                limit: 10,
                userId : profile?.data?._id
            })
        );
    }, [page])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };

    return (
        <>
            <div className="contact_main_div">
                <Sidebar />
                <div className="head-div">
                    <div className="head_header">
                        <Link to={`/mass`} style={{
                            textDecoration: "none",
                            color: "black",
                            fontWeight: "600"
                        }} className="bg-white rounded-4 py-3 d-flex justify-content-between align-items-center px-2 gap-4">
                            Create a New Broadcast
                            < FaArrowRight size={30} />
                        </Link>
                        <div className="admin-section">
                            {/* <p>
                                <i className="fa-regular fa-bell"></i>
                            </p>
                            <div>
                                <img src={Ellipse113} alt="" />
                            </div> */}
                              {/* <div className="bdge-auth">
                                <p>{profile?.data?.first_name?.substring(0, 1).toUpperCase()}</p>
                            </div> */}
                            <span> {profile?.status ? profile?.data?.first_name + " " + profile?.data?.last_name : ""}</span>
                        </div>
                    </div>
                    <div className='d-flex align-content-lg-start w-100 px-3  mt-5'>
                        <p className='fs-5 '> Broadcast History</p>
                    </div>
                    <div className='filter_table bg-white rounded-4 '>
                        <TableContainer sx={{ borderRadius: "15px" }}>
                            {msg_loading ?
                                <div>
                                    <div className="py-2 px-2">
                                        <Skeleton variant="rounded" height={36} />
                                    </div>
                                    <div className="d-flex justify-content-between  py-3 px-2">
                                        {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                    </div>
                                    <div className="d-flex justify-content-between  py-3 px-2">
                                        {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                    </div>
                                    <div className="d-flex justify-content-between  py-3 px-2">
                                        {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                    </div>
                                    <div className="d-flex justify-content-between  py-3 px-2">
                                        {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                    </div>
                                    <div className="d-flex justify-content-between  py-3 px-2">
                                        {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                    </div>
                                    <div className="d-flex justify-content-between  py-3 px-2">
                                        {columns?.map((it, key) => <Skeleton key={key} variant="rounded" height={26} width={120} />)}
                                    </div>
                                </div>
                                : (<>
                                    <Table sx={{ minWidth: 650 }}>
                                        <TableHead>
                                            <TableRow >
                                                <TableCell align="left" sx={{ fontWeight: 700 }}>Date</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }} align="left">Message</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700 }}># of Recipients</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700 }}>Submitted By</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {broadcasts?.map((msg, index) => {
                                                const recipient = msg?.recipients?.map((it)=>{
                                                    return it?.name
                                                })
                                                return (
                                                    <TableRow onClick={()=>{
                                                        navigate(`/broadcast/${msg?._id}`)
                                                    }} >
                                                        <TableCell align="left">{moment(msg?.createdAt).format("MM-DD-YYYY")}</TableCell>
                                                        <TableCell align="left">{msg?.message}</TableCell>
                                                        <TableCell align="center">
                                                            <Tooltip sx={{cursor:"pointer"}} title={recipient?.join(', ')} placement='right'>
                                                                <span style={{cursor:"pointer"}} >
                                                                    {msg?.recipients?.length || 0}
                                                                </span>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell align="center">{msg?.submitted_by?.first_name} {msg?.submitted_by?.last_name}</TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                  {total_broadcasts > broadcasts?.length && <TablePagination
                                        onPageChange={handleChangePage}
                                        rowsPerPageOptions={[10]}
                                        component="div"
                                        count={total_broadcasts}
                                        rowsPerPage={10}
                                        page={page}
                                    />}
                                </>
                                )}

                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BroadCastHistory