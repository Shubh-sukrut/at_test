import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { apis } from "../../apis";
import { Skeleton, TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import { get_agency } from "../../redux/slice/agency";
import { IoCloseSharp } from "react-icons/io5";
import { Bounce, toast } from "react-toastify";
import TableSection from "./table";
import EnhancedTable from "./EnhancedTable";
const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'key', label: 'Id', align: 'center', isSort: true },
    { id: 'name', label: 'Name', isSort: true },
    { id: 'contactEmail', label: 'Contact Email', isSort: true },
    { id: 'action', label: 'Action', align: 'center', isSort: false },
];

export default function AgencyTable({ }) {
    const [updateModel, setUpdateModel] = useState(false);
    const [FormData, setFormData] = useState({});
    const [emailList, setEmailList] = useState({})
    const agency = useSelector((state) => state?.agency);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false) // for update and delete action
    const [isSkeleton, setIsSkeleton] = useState(true) // for fetching data\
    const [page, setPage] = React.useState(0);
    useEffect(() => {
        if (!agency?.status) {
            dispatch(get_agency({ token }));
        } else {
            const dataRows = agency?.agency?.map((it, key) => {
                return {
                    id: agency?.agency?.length - key,
                    key: it?.Id,
                    name: it?.name,
                    contactEmail: <div>
                        {it?.contactEmail?.map((f) => (
                            <div>{f},</div>
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
            setIsSkeleton(false)
            setRows(dataRows?.reverse())
        }
    }, [agency])

    const handalChange = ({ target }) => {
        const { name, value } = target;
        setFormData({
            ...FormData,
            [name]: value,
        });
    };

    // handal email 
    const handalEmal = ({ target }) => {
        const { name, value } = target;
        setEmailList({
            ...emailList,
            [name]: value,
        });
    }

    // handal remove email 
    const handallRemoveEmail = (email) => {
        // Create a copy of emailList object
        let updatedEmailList = { ...emailList };
        // Remove the emailToRemove from the copied object
        delete updatedEmailList[email];
        // Set the state to the updated emailList
        setEmailList(updatedEmailList);
    }

    function handleModel(item) {
        const emails = {}
        item.contactEmail.map((email, key) => {
            emails[`email ${key}`] = email
        })
        setFormData(item);
        setEmailList(emails)
        setUpdateModel(true);
    };

    // Handal Add New Email
    function HandalAddNewEmail() {
        setEmailList({
            ...emailList,
            [`email ${Object.keys(emailList)?.length}`]: ''
        })
    }

    const handleUpdate = async () => {
        setLoading(true)
        try {
            const updata = await axios.put(
                apis.UPDATE_AGENCY,
                {
                    id: FormData._id,
                    name: FormData?.name,
                    contactEmail: Object.values(emailList),
                    Id : FormData?.Id
                },
                {
                    headers: {
                        token: token,
                    },
                }
            );
            setUpdateModel(false);
            toast.success("Agency Updated Successfully", {
                position: "top-right",
            });
            setFormData({})
            setLoading(false) //
            setTimeout(() => {
                dispatch(get_agency({ token }));
            }, 3000)
        } catch (error) {
            setLoading(false)
            toast.error(error, {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };


    // drop Agency 
    async function handalDrop(data) {
        try {
            const res = await axios.delete(`${apis.DROP_AGENCY}/${data?._id}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            toast.success("Agency Deleted Successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            });
            dispatch(get_agency({ token }));
        } catch (error) {
            console.log(error)
        }
    }
    const filteredRows = [...rows]
        .filter(row => {
            const searchFields = [row.key, row.lastName, row.name, row.contactEmail];
            return searchFields.some(field => field?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
        }).map((row, index) => ({
            ...row,
            id: index + 1,
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
                        }
                        }
                    />
                </div>
            }
            <EnhancedTable status={agency?.status} columns={columns} rows={filteredRows} isSkeleton={isSkeleton} page={page} setPage={setPage} />
            <Modal
                // size="lg"
                show={updateModel}
                onHide={() => setUpdateModel(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Agency
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-12 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                fullWidth
                                label="Name"
                                value={FormData?.name}
                                defaultValue={FormData?.name}
                                name="name"
                                onChange={handalChange}
                            />
                        </div>

                        <div className="col-md-12 mb-4 text-center">
                            <TextField
                                id="outlined-required"
                                fullWidth
                                label="ID"
                                value={FormData?.Id}
                                defaultValue={FormData?.Id}
                                onChange={handalChange}
                                name="Id"
                            />
                        </div>
                    </div>
                    <p>Contact Email</p>
                    <div className="row align-items-center">
                        {
                            Object.keys(emailList)?.map((value, keys) => {
                                return (
                                    <>
                                        <div className="col-md-10 mb-4 text-center" key={keys}>
                                            <TextField
                                                id="outlined-required"
                                                fullWidth
                                                label={`Email ${keys + 1}`}
                                                value={emailList[value]}
                                                name={value}
                                                onChange={handalEmal}
                                            />
                                        </div>
                                        <div className="col-md-2 mb-4 text-center">
                                            <button className="btn" onClick={() => handallRemoveEmail(value)}>
                                                <IoCloseSharp />
                                            </button>
                                        </div>
                                    </>
                                )
                            })
                        }
                        <div className="col-md-10 mb-4">
                            <button className="btn btn-success" onClick={HandalAddNewEmail}>Add New Email</button>
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="text-center container">
                        {
                            loading ? <Button variant="success">Loading...</Button> : <Button variant="success" onClick={handleUpdate}>Update Agency</Button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}