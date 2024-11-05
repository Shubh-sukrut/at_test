import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import axios from "axios";
import { apis } from "../../apis";
import { Skeleton, TextField } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import Cookies from "js-cookie";
import { IoCloseSharp } from "react-icons/io5";
import { Bounce, toast } from "react-toastify";
import TableSection from "./table";
import EnhancedTable from "./EnhancedTable";
import SelectSingle from "../../components/input/Select"
import { get_Integration_Facility_Mapping } from "../../redux/slice/Integration-Facility-Mapping";
import { get_facility } from "../../redux/slice/facility";
const columns = [
    { id: 'id', label: 'Sr No', isSort: true },
    { id: 'facility_name', label: 'Integration Facility Name', isSort: true },
    { id: 'facility_id', label: 'Striv Facility Name', isSort: true },
    { id: 'systemName', label: 'System Name', isSort: true },
    { id: 'action', label: 'Action', align: 'center', isSort: false },
];

export default function Integration_Facility_Mapping_Table({ }) {
    const [updateModel, setUpdateModel] = useState(false);
    const [FormData, setFormData] = useState({});
    const [emailList, setEmailList] = useState({})
    const facility = useSelector((state) => state?.facility);
    const Integration_Facility_Mapping = useSelector(state => state.Integration_Facility_Mapping)
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const token = Cookies.get("token");
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false) // for update and delete action
    const [isSkeleton, setIsSkeleton] = useState(true) // for fetching data\
    const [page, setPage] = React.useState(0);
    useEffect(() => {
        if (!facility?.status && !facility?.loading) {
            dispatch(get_facility({ token }));
        }
    }, [facility?.status]);
    useEffect(() => {
        if (!Integration_Facility_Mapping?.status) {
            dispatch(get_Integration_Facility_Mapping({ token }));
        } else {
            const dataRows = Integration_Facility_Mapping?.data?.map((it, key) => {
                return {
                    id: Integration_Facility_Mapping?.data?.length - key,
                    facility_name: it?.facility_name,
                    facility_id: it?.facility_id.name,
                    systemName: it?.systemName,
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
    }, [Integration_Facility_Mapping])

    const handalChange = ({ target }) => {
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
        setLoading(true)
        try {
            const updata = await axios.put(
                apis.INTEGRATION_FACILITY_MAPPING,
                {
                    id: FormData._id,
                    facility_name: FormData?.facility_name,
                    facility_id: FormData?.facility_id,
                    systemName: FormData?.systemName,
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
            setLoading(false)
            dispatch(get_Integration_Facility_Mapping({ token }));
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
            const res = await axios.delete(`${apis.INTEGRATION_FACILITY_MAPPING}/${data?._id}`,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            toast.success("Integration Facility Mapping Deleted Successfully", {
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
            dispatch(get_Integration_Facility_Mapping({ token }));
        } catch (error) {
            console.log(error)
        }
    }
    const filteredRows = [...rows]
        .filter(row => {
            const { facility_name, facility_id, systemName } = row
            const searchFields = [facility_name, facility_id, systemName];
            return searchFields.some(field => field?.toString()?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
        })?.map((row, index) => ({
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
            <EnhancedTable status={Integration_Facility_Mapping?.status} columns={columns} rows={filteredRows} isSkeleton={isSkeleton} page={page} setPage={setPage} />
            <Modal
                // size="lg"
                show={updateModel}
                onHide={() => setUpdateModel(false)}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Update Integration Facility Mapping
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col col-12 mb-3">
                            <TextField
                                id="outlined-required"
                                fullWidth
                                label="Facility Name"
                                value={FormData?.facility_name}
                                name="facility_name"
                                onChange={handalChange}
                            />
                        </div>
                        <div className="col col-12 mb-3">
                            <SelectSingle
                                data={facility?.facility_data}
                                value={
                                    typeof FormData?.facility_id == "string"
                                        ? FormData?.facility_id
                                        : FormData?.facility?._id
                                }
                                name="facility_id"
                                label="Facility"
                                handleChange={handalChange}
                            />
                        </div>
                        <div className="col col-12 mb-3">
                            <TextField
                                id="outlined-required"
                                fullWidth
                                label="SystemName"
                                value={FormData?.systemName}
                                name="systemName"
                                onChange={handalChange}
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="text-center container">
                        {
                            loading ? <Button variant="success">Loading...</Button> : <Button variant="success" onClick={handleUpdate}>Update</Button>
                        }
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}