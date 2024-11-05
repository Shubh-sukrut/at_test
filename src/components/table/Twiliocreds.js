import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { apis } from "../../apis";
import { Skeleton, TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import TableSection from "./table";
import EnhancedTable from "./EnhancedTable";
import { get_twilio } from "../../redux/slice/createtwilio";
const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'name', label: 'Name', isSort: true },
    { id: 'client_sid', label: 'Client sid', isSort: true },
    { id: 'client_auth_token', label: 'Client Auth Token', isSort: true },
    { id: 'client_from_num', label: 'Client From Num', isSort: true },
    { id: 'description', label: 'Description', align: 'center', isSort: true },
    { id: 'action', label: 'Action', align: 'center', isSort: false },
];

export default function TwilioTable({ }) {
    const [updateModel, setUpdateModel] = useState(false);
    const [FormData, setFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const twilio = useSelector(state => state.twilio)
    // const twilio = useSelector(state => state)
    console.log(twilio)
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false) // for update and delete action
    const [isSkeleton, setIsSkeleton] = useState(true) // for fetching data
    const [page, setPage] = useState(0)
    useEffect(() => {
        if (!twilio?.status && !twilio?.loading) {
            dispatch(get_twilio({ token }))
        }
        if (twilio?.status) {
            setIsSkeleton(false)
        }
    }, [twilio?.status]);

    useEffect(() => {
        const dataRows = twilio?.twilio_data?.map((it, key) => {
            return {
                id: twilio?.twilio_data?.length - key,
                name: it?.name,
                client_sid: it?.client_sid,
                client_auth_token: it?.client_auth_token,
                client_from_num: it?.client_from_num,
                description: it?.description,
                action: (
                    <>
                        <button className="btn" onClick={() => handleModel(it)}>
                            <TbEdit />
                        </button>
                        {/* <button className="btn" onClick={() => handalDrop(it)}>
                            <RiDeleteBin6Line />
                        </button> */}
                    </>
                ),
            }
        })
        setRows(dataRows?.reverse())
    }, [twilio])

    const hadalChangeModal = ({ target }) => {
        const { name, value } = target;
        setFormData({
            ...FormData,
            [name]: value,
        });
    };

    function handleModel(item) {
        setFormData(item);
        setUpdateModel(true);
    };

    const filteredRows = [...rows]
        .filter(row => {
            const searchFields = [row.name, row.client_sid, row.client_auth_token, row.client_from_num, row.description];
            return searchFields.some(field => field?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
        })
        .map((row, index) => ({
            ...row,
            id: index + 1, // Start the ID from 1
        }));


    const handleUpdate = async () => {
        try {
            setLoading(true)
            const updata = await axios.put(
                apis.UPDATE_TWILIO,
                {
                    id: FormData._id,
                    name: FormData?.name,
                    client_sid: FormData?.client_sid,
                    client_auth_token: FormData?.client_auth_token,
                    client_from_num: FormData?.client_from_num,
                    description: FormData?.description,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setUpdateModel(false);
            toast.success("twilio Successfully updated..", {
                position: "top-right",
            });
            setTimeout(() => {
                dispatch(get_twilio({ token }))
                setLoading(false)
            }, 2000)
        } catch (error) {
            toast.error("twilio update failed..", {
                position: "top-right",
            });
        } finally {
            setLoading(false)
        }
    };


    return (
        <>
            {/* Search Input */}
            {
                isSkeleton ? <div className="d-flex justify-content-end">
                    <Skeleton animation="wave" height={60} width={200} />
                </div> : <div className="container text-end mb-2">
                    <TextField
                        label="Search"
                        type="search"
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => {
                            setPage(0)
                            setSearchQuery(e.target.value)
                        }}
                    />
                </div>
            }
            <EnhancedTable status={twilio?.status} columns={columns} rows={filteredRows} page={page} setPage={setPage} />
            <Modal
                show={updateModel}
                onHide={() => setUpdateModel(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update twilio
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row ">
                        <div className="col-sm-6 text-center ">
                            <TextField
                                id="outlined-required"
                                label="Name"
                                value={FormData?.name}
                                onChange={hadalChangeModal}
                                name="name"
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="col-sm-6 text-center">
                            <TextField
                                id="outlined-required"
                                label=" Client Sid"
                                defaultValue={FormData?.client_sid}
                                onChange={hadalChangeModal}
                                name="client_sid"
                                sx={{ width: "100%" }}
                            />
                        </div>

                    </div>
                    <div className="row mt-4">
                        <div className="col-sm-6 text-center">
                            <TextField
                                id="outlined-required"
                                label=" Client Auth Token"
                                defaultValue={FormData?.client_auth_token}
                                onChange={hadalChangeModal}
                                name="client_auth_token"
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="col-sm-6 text-center">
                            <TextField
                                id="outlined-required"
                                label=" Client From Num"
                                defaultValue={FormData?.client_from_num}
                                onChange={hadalChangeModal}
                                name="client_from_num"
                                sx={{ width: "100%" }}
                            />
                        </div>
                       
                    </div>
                    <div className="col-sm-12 text-center mt-4">
                            <TextField
                                id="outlined-required"
                                label="Description"
                                defaultValue={FormData?.description}
                                onChange={hadalChangeModal}
                                name="description"
                                sx={{ width: "100%" }}
                            />
                        </div>
                       
                </Modal.Body>
                <Modal.Footer>
                    <div className="text-center container">
                        {
                            loading ? <Button variant="success" type="button">Loading...</Button> : <Button variant="success" onClick={handleUpdate}>Update Creds</Button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}