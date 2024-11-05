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
import { get_facility } from "../../redux/slice/facility";
import MultipleSelect from "../input/MultipleSelect";
import { get_employee } from "../../redux/slice/employee";
import TableSection from "./table";
import EnhancedTable from "./EnhancedTable";

const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'firstName', label: 'First Name', isSort: true },
    { id: 'lastName', label: 'Last Name', isSort: true },
    { id: 'phone', label: 'Phone', isSort: false },
    { id: 'facility', label: 'Facility', align: 'center', isSort: true },
    { id: 'action', label: 'Action', align: 'center', isSort: false },
];

export default function CaregiverTable({ }) {
    const [updateModel, setUpdateModel] = useState(false);
    const [loading, setLoading] = useState(false) // for CURD Operation
    const [isSkeleton, setIsSkeleton] = useState(true) // for fetching data
    const [FormData, setFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const facility = useSelector(state => state.facility)
    const employees = useSelector((state) => state?.employees);
    const profile = useSelector(state => state.profile)
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const [rows, setRows] = useState([])
    const [page, setPage] = useState(0)
    useEffect(() => {
        if (!facility?.status) {
            dispatch(get_facility({ token }))
        }
        if (!employees.status) {
            dispatch(get_employee({ token, user: profile?.data?._id }));
        }
        if (employees?.status) {
            setIsSkeleton(false)
        }
    }, [facility?.status, employees.status, profile?.status]);
    useEffect(() => {
        const dataRows = employees?.employee_data?.map((it, key) => {
            return {
                id: employees?.employee_data?.length - key,
                firstName: it?.firstName,
                lastName: it?.lastName,
                phone: it?.phone,
                facility: <div>
                    {it?.facility?.map((f) => (
                        <div>{f.name},</div>
                    ))}
                </div>,
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
    }, [employees])

    const handalChange = ({ target }) => {
        const { name, value } = target;
        setFormData({
            ...FormData,
            [name]: value,
        });
    };
    const handleSelect = ({ name, value }) => {
        setFormData({
            ...FormData,
            [name]: value,
        });
    }

    function handleModel(item) {
        setFormData(item);
        setUpdateModel(true);
    };

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const updata = await axios.post(
                apis.UPDATE_EMPLOYEE,
                {
                    _id: FormData._id,
                    phone: FormData?.phone,
                    firstName: FormData?.firstName,
                    lastName: FormData?.lastName,
                    facility: FormData?.facility,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setUpdateModel(false);
            toast.success("Caregiver Successfully updated..", {
                position: "top-right",
            });
            setFormData({})
            setTimeout(() => {
                dispatch(get_employee({ token, user: profile?.data?._id }));
            }, 3000)
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message, {
                    position: "top-right",
                });
            } else {
                toast.error(error?.message, {
                    position: "top-right",
                });
            }
        }
        finally {
            setLoading(false)
        }
    };


    // drop Company 
    async function handalDrop(data) {
        try {
            const res = await axios.delete(`${apis.DROP_EMPLOYEE}/${data?._id}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            toast.success("Caregiver Successfully deleted..", {
                position: "top-right",
            });
            setTimeout(() => {
                dispatch(get_employee({ token, user: profile?.data?._id }));
            }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    const filteredRows = [...rows]
        .filter(row => {
            const searchFields = [row.firstName, row.lastName, row.phone, row.facility];
            return searchFields.some(field => field?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
        })
        .map((row, index) => ({
            ...row,
            id: index + 1, // Start the ID from 1
        }));

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
            <EnhancedTable status={employees?.status} columns={columns} rows={filteredRows} page={page} setPage={setPage} />
            <Modal
                size="lg"
                show={updateModel}
                onHide={() => setUpdateModel(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Caregiver
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                fullWidth
                                label="First Name"
                                value={FormData?.firstName}
                                name="firstName"
                                onChange={handalChange}
                            />
                        </div>

                        <div className="col-md-6 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                fullWidth
                                label="Last Name"
                                defaultValue={FormData?.lastName}
                                onChange={handalChange}
                                name="lastName"
                            />
                        </div>

                        <div className="col-md-6 mb-4 text-center">
                            <MultipleSelect data={facility?.facility_data} value={FormData?.facility} name="facility" label="Facility" handleChange={handleSelect} />
                        </div>

                        <div className="col-md-6 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                fullWidth
                                label="Phone"
                                defaultValue={FormData?.phone}
                                onChange={handalChange}
                                name="phone"
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="text-center container">
                        {
                            loading ? <Button variant="success" type="button">Loading...</Button> : <Button variant="success" onClick={handleUpdate}>Update Caregiver</Button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}