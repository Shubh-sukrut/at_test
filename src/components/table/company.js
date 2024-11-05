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
import { get_company } from "../../redux/slice/createcompany";
import TableSection from "./table";
import EnhancedTable from "./EnhancedTable";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'name', label: 'Name', isSort: true },
    { id: 'address', label: 'Address', isSort: true },
    { id: 'city', label: 'City', isSort: true },
    { id: 'state', label: 'State', isSort: true },
    { id: 'zip', label: 'Zip', align: 'center', isSort: true },
    { id: 'action', label: 'Action', align: 'center', isSort: false },
];

export default function CompanyTable({ }) {
    const [updateModel, setUpdateModel] = useState(false);
    const [FormData, setFormData] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const company = useSelector(state => state.company)
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false) // for update and delete action
    const [isSkeleton, setIsSkeleton] = useState(true) // for fetching data
    const [page, setPage] = useState(0)
    useEffect(() => {
        if (!company?.status && !company?.loading) {
            dispatch(get_company({ token }))
        }
        if (company?.status) {
            setIsSkeleton(false)
        }
    }, [company?.status]);

    useEffect(() => {
        const dataRows = company?.company_data?.map((it, key) => {
            return {
                id: company?.company_data?.length - key,
                name: it?.name,
                address: it?.address,
                city: it?.city,
                state: it?.state,
                zip: it?.zip,
                isAutumnTrack: it?.isAutumnTrack,
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
    }, [company])

    const handleSwitchChange = (event) => {
        const isChecked = event.target.checked;
        setFormData({ ...FormData, isAutumnTrack: isChecked }); // Directly update formData's isAutumnTrack
    };


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

    const handleUpdate = async () => {
        try {
            setLoading(true)
            const updata = await axios.put(
                apis.UPDATE_COMPANY,
                {
                    id: FormData._id,
                    name: FormData?.name,
                    address: FormData?.address,
                    city: FormData?.city,
                    state: FormData?.state,
                    zip: FormData?.zip,
                    isAutumnTrack: FormData?.isAutumnTrack,
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setUpdateModel(false);
            toast.success("Company Successfully updated..", {
                position: "top-right",
            });
            setTimeout(() => {
                dispatch(get_company({ token }))
                setLoading(false)
            }, 2000)
        } catch (error) {
            toast.error("Company update failed..", {
                position: "top-right",
            });
        } finally {
            setLoading(false)
        }
    };

    // drop Company 
    async function handalDrop(data) {
        try {
            const res = await axios.delete(
                `${apis.DROP_COMPANY}/${data?._id}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            toast.success("Company Successfully deleted..", {
                position: "top-right",
            });
            setTimeout(() => {
                dispatch(get_company({ token }))
            }, 2000)
        } catch (error) {
            toast.error("operation failed", {
                position: "top-right",
            });
            console.log(error)
        }
    }
    const filteredRows = [...rows]
        .filter(row => {
            const searchFields = [row.name, row.address, row.city, row.state, row.zip];
            return searchFields.some(field => field?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
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
            <EnhancedTable status={company?.status} columns={columns} rows={filteredRows} page={page} setPage={setPage} />
            <Modal
                size="lg"
                show={updateModel}
                onHide={() => setUpdateModel(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Company
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-sm-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Name"
                                value={FormData?.name}
                                onChange={hadalChangeModal}
                                name="name"
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="col-sm-4 text-center">
                            <TextField
                                id="outlined-required"
                                label=" Address"
                                defaultValue={FormData?.address}
                                onChange={hadalChangeModal}
                                name="address"
                                sx={{ width: "100%" }}
                            />
                        </div>

                        <div className="col-sm-4 text-center">
                            <TextField
                                id="outlined-required"
                                label=" City"
                                defaultValue={FormData?.city}
                                onChange={hadalChangeModal}
                                name="city"
                                sx={{ width: "100%" }}
                            />
                        </div>
                    </div>
                    <div className="row mt-4 d-flex">
                        <div className=" col-sm-4 text-center">
                            <TextField
                                id="outlined-required"
                                label=" State"
                                defaultValue={FormData?.state}
                                onChange={hadalChangeModal}
                                name="state"
                                sx={{ width: "100%" }}
                            />
                        </div>
                        <div className="col-sm-4 text-center">
                            <TextField
                                id="outlined-required"
                                label="Zip"
                                defaultValue={FormData?.zip}
                                onChange={hadalChangeModal}
                                name="zip"
                                sx={{ width: "100%" }}
                            />
                        </div>

                        <div className=" border  rounded-2 d-flex justify-content-between align-items-center" style={{
                            width: "32%",
                        }} >
                            Is Autumn Track
                            <div className="form-check form-switch d-flex justify-content-center">
                                <input
                                    style={{ cursor: 'pointer' }}
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    onChange={handleSwitchChange}
                                    id="flexSwitchCheckDefault"
                                    checked={FormData.isAutumnTrack}
                                />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="text-center container">
                        {
                            loading ? <Button variant="success" type="button">Loading...</Button> : <Button variant="success" onClick={handleUpdate}>Update Company</Button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}