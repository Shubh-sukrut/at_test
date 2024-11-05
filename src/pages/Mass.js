import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Autocomplete, Box, Collapse, IconButton, Skeleton, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { get_facility } from '../redux/slice/login';
import { uniqueArrayOfObject } from '../helper/object';
import moment from "moment-timezone";
import Dropdown from "react-bootstrap/Dropdown";
import { MdCalendarMonth } from 'react-icons/md';
import { DateRange } from "react-date-range";
import Ellipse113 from "../asset/Ellipse 113.png"
import useDebounce from '../helper/useDebounce';
import { get_patient, get_patient_with_contacts } from '../redux/slice/patients';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { PiArrowClockwiseBold } from 'react-icons/pi';
import { create_brodcast_message } from '../redux/slice/message_slice';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TablePagination from '@mui/material/TablePagination';
import { toast, ToastContainer } from 'react-toastify';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { Button } from '@mui/material';
import { ToggleButtonGroup } from '@mui/material';
import { Select, MenuItem } from '@mui/material';
import { AiOutlineUserAdd } from "react-icons/ai";
import { AiOutlineUserDelete } from "react-icons/ai";







const columns = [
    1, 2, 3, 4, 5, 6
]

const filterData = (data) => {
    const vals = data ? data?.map((it) => {
        return {
            _id: it._id,
            value: it?.name
        }
    }) : []
    return [{ _id: "null", value: "* No Facility" }, ...vals];
}
// const caregiverfilter = (data) => {
//     return data?.map((it) => {
//         return {
//             _id: it._id,
//             value: `${it?.lastName} ${it?.firstName}`
//         }
//     })
// }




const familyRelations = [
    "Spouse/Partner",
    "Brother",
    "Sister",
    "Parent",
    "Child",
    "Sibling",
    "Guardian",
    "Grandparent",
    "Grandchild",
    "Aunt",
    "Uncle",
    "Niece",
    "Nephew",
    "Cousin",
    "Self"
];

const Mass = () => {

    const [selectedRelations, setSelectedRelations] = useState([]);
    // console.log("lllll", selectedRelations)
    const relationsOptions = familyRelations.map((relation, index) => ({
        _id: index,
        value: relation,
    }));






    const navigate = useNavigate();
    const [open, setOpen] = useState({});
    const handleRowClick = (rowId) => {
        if (!rowId) return;
        setOpen((prev) => ({ ...prev, [rowId]: !prev[rowId] }));
    };

    const {
        patientsWithContacts,
        loading,
        totalPatientsWithContacts
    } = useSelector((state) => state.patient);
    const {
        msg_loading,
    } = useSelector((state) => state.message);
    const [active, setActive] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDropdown, setIsDropdown] = useState(false);
    const [page, setPage] = useState(0);
    const [searchFilter, setSearchFilter] = useState('')
    const shift = useSelector((state) => state.shift);
    const profile = useSelector((state) => state.profile);
    const facility = useSelector(state => state.facility)
    const dispatch = useDispatch()
    const [broadcastMessage, setBroadcastmessage] = useState("");
    const token = Cookies.get('token');
    const [searchQuery, setSearchQuery] = useState('');
    const [contactName, setContactName] = useState('');
    const [phone, setPhone] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 500);
    const debouncedContactName = useDebounce(contactName, 500);
    const debouncedRelationship = useDebounce(selectedRelations, 500);
    const debouncedPhone = useDebounce(phone, 500);
    const listInit = {
        _id: '',
        value: ''
    }
    const [facilityList, setFacilityList] = useState([])





    // filter agency filter
    function sortArrayByValue(array) {
        array?.sort((a, b) => {
            const valueA = a.value?.toLowerCase();
            const valueB = b.value?.toLowerCase();
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });
        return array;
    }
    // console.log("handalFilterhandalFilter",searchFilter)

    useEffect(() => {
        if (!facility?.status && !facility?.loading) {
            dispatch(get_facility({ token }))
        }
        if (profile?.data?.roles[0]?.name == 'admin') {
            const list = filterData(facility?.facility_data)
            setFacilityList(sortArrayByValue(list))
        }
        else if (profile?.data?.roles[0]?.name == 'agency_user' && !facilityList?.length) {
            const facility = shift?.shift?.map(item => {
                return { ...item.facility_id }
            })
            const uuniqueList = uniqueArrayOfObject(facility, '_id')
            const list = filterData(uuniqueList)
            setFacilityList(sortArrayByValue(list))
        }
        else if (profile?.data?.roles[0]?.name == 'normal' && !facilityList?.length) {
            const list = filterData(profile?.data?.facility)
            setFacilityList(sortArrayByValue(list))
        }
        else {
            const list = filterData(facility?.facility_data);
            setFacilityList(sortArrayByValue(list))
        }
    }, [profile, facility])



    useEffect(() => {
        if (patientsWithContacts) {
            const initialOpenState = patientsWithContacts?.reduce((acc, row) => {
                acc[`${row?._id}`] = true;
                return acc;
            }, {});
            setOpen(initialOpenState);
        }
    }, [patientsWithContacts]);

    const handalFilter = (searchFilter, page) => {
        return {
            startdate: searchFilter?.startdate ? searchFilter?.startdate : '',
            enddate: searchFilter?.enddate ? searchFilter?.enddate : '',
            disStartdate: searchFilter?.disStartdate ? searchFilter?.disStartdate : '',
            disEnddate: searchFilter?.disEnddate ? searchFilter?.disEnddate : '',
            facility: searchFilter?.facility ? searchFilter?.facility : '',
            selectedRelations: searchFilter?.selectedRelations ? searchFilter?.selectedRelations : '',
            active: searchFilter?.active ? searchFilter?.active : '',
            page: page + 1,
            limit: 10
        }
    }


    useEffect(() => {
        if (debouncedSearch.length > 2 || debouncedSearch === '') {
            const filterization = handalFilter(searchFilter, page)
            // console.log("filterization", filterization)
            dispatch(get_patient_with_contacts({
                token, search: debouncedSearch, ...filterization,
                selectedRelations: selectedRelations, phone: debouncedPhone, contact_name: debouncedContactName, user: profile?.data, active: active
            }));
        }
    }, [debouncedSearch, page, token, searchFilter, debouncedRelationship, debouncedPhone, debouncedContactName])

    // date handle
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });
    // date handle
    const [dischargeRange, setDischargeRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });



    // handal Date 
    const handleDate = (ranges) => {
        const End = new Date(
            new Date(ranges.selection.endDate).getTime() + 86400000
        );
        const stdate = new Date(ranges.selection.startDate);
        const endate = new Date(End);
        setSelectionRange(ranges.selection);
        setSearchFilter({
            ...searchFilter,
            startdate: moment(stdate).format("YYYY-MM-DD"),
            enddate: moment(endate).format("YYYY-MM-DD")
        })
    };

    // handleDischargeDate
    const handleDischargeDate = (ranges) => {
        const End = new Date(
            new Date(ranges.selection.endDate).getTime() + 86400000
        );
        const stdate = new Date(ranges.selection.startDate);
        const endate = new Date(End);
        setDischargeRange(ranges.selection);
        setSearchFilter({
            ...searchFilter,
            disStartdate: moment(stdate).format("YYYY-MM-DD"),
            disEnddate: moment(endate).format("YYYY-MM-DD")
        })
    };

    const handleRelationChange = (_, value) => {
        const relationId = value[value.length - 1]?._id;
        const isSelected = selectedRelations.some((relation) => relation._id === relationId);

        if (isSelected) {
            const updatedRelations = selectedRelations.filter(relation => relation._id !== relationId);
            setSelectedRelations(updatedRelations);
        } else {
            setSelectedRelations(value);
        }
    };

    const handalSearchById = (name, value) => {
        setSearchFilter({
            ...searchFilter,
            [name]: value
        })
    }
    const handalSearchBydischargedate = (discharge_date, value) => {
        setSearchFilter({
            ...searchFilter,
            [discharge_date]: value
        })
    }

    const sendBroadcast = async () => {
        const ids = await patientsWithContacts?.map((patient) => {
            return patient?.contacts?.map((contact) => {
                if (contact?.phone !== "\u0000" && contact?.phone !== "") {
                    return ({ phone: contact?.phone ? contact?.phone : "", recipient: contact?._id, name: `${contact.first_name} ${contact.last_name}`, twilioId: patient?.facility?.twiliocredid ?? null, FacilityPhone: patient?.facility?.phone, facilityName: patient?.facility?.name })
                }
            })
        })
        // console.log("Contact IDs", ids.flat());
        const filteredIds = ids.flat().filter(Boolean);
        if (!filteredIds?.length || !broadcastMessage) {
            toast.error("Message and numbers are required", {
                position: "top-right",
            });
            return;
        }
        if (ids?.length > 0) {
            const res = await dispatch(create_brodcast_message({ token, Type: "outbound", Method: "mass", patient_contacts: filteredIds, message: broadcastMessage }))
            // console.log(res)
            setBroadcastmessage("");
            toast.success("Message sent successfully", {
                position: "top-right",
            });
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleToggle = (event) => {
        const newActiveState = event.target.checked;
        setActive(newActiveState);
        handalSearchBydischargedate(newActiveState); // Replace with your function
    };

    return (
        <>
            <div className="contact_main_div">
                <Sidebar />
                <div className="head-div">
                    <div className="head_header">
                        <h2 ><FaArrowLeft size={30} style={{
                            marginRight: "6px",
                            cursor: "pointer",
                        }} onClick={() => {
                            navigate(-1);
                        }} />  Mass Broadcast List</h2>
                        <div className="admin-section">
                            {/* <p><i className="fa-regular fa-bell"></i></p>
                            <div>
                                <img src={Ellipse113} alt="" />
                            </div> */}
                            {/* <div className="bdge-auth">
                                <p>{profile?.data?.first_name?.substring(0, 1).toUpperCase()}</p>
                            </div> */}
                            <span> {profile?.status ? profile?.data?.first_name + " " + profile?.data?.last_name : ""}</span>
                        </div>
                    </div>
                    <div className='filer_boxs '>
                        <div className='filer_box' style={{
                            padding: '6px',
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}>
                            <div style={{
                                width: "100%",
                                display: "flex",
                                padding: "0px 6px",
                                justifyContent: "space-between"
                            }} >
                                <p>Apply filters</p>

                                <div className="date-fltr" style={{
                                    cursor: "pointer"
                                }} onClick={() => {
                                    setSearchFilter('');
                                    setSearchQuery('');
                                    setSelectedRelations([]);
                                    setPhone('');
                                    setContactName('');
                                    setPage(0);
                                    setActive(false);

                                }}>
                                    <span>
                                        <i className='px-1' style={{ color: "#4C7153" }}><PiArrowClockwiseBold /></i>
                                        clear filter
                                    </span>
                                </div>
                            </div>
                            <div className="px-2 py-2 d-flex gap-3">
                                <TextField id="outlined-basic" label="Search patient name" variant="outlined" size="small" sx={{
                                    width: "50%"
                                }}
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                    }}
                                />
                                <Autocomplete
                                    multiple
                                    id="size-small-filled"
                                    size="small"
                                    options={facilityList?.length ? facilityList : [listInit]}
                                    sx={{ width: "50%" }}
                                    value={searchFilter?.facility || []}
                                    getOptionLabel={(option) => option?.value}
                                    onChange={(_, value) => handalSearchById('facility', value)}
                                    open={isDropdown}
                                    onOpen={() => setIsDropdown(true)}
                                    onClose={() => setIsDropdown(false)}
                                    renderOption={(props, option, { selected }) => (
                                        <li
                                            {...props}
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: selected ? '#345d3b' : 'transparent',
                                                color: selected ? 'white' : 'black',
                                            }}
                                            key={option._id}
                                            className="py-1 ps-3 menu-drop-item"
                                        >
                                            {option.value}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <Tooltip
                                            title={
                                                isDropdown ? "" : (
                                                    searchFilter?.facility?.length > 0
                                                        ? searchFilter.facility.map(facility => facility.value).join(', ')
                                                        : "No facility selected"
                                                )
                                            }
                                        >

                                            <TextField
                                                {...params}
                                                label="Facility"
                                                placeholder="Select Facilities"
                                                sx={{ maxWidth: "100%" }}
                                            />
                                        </Tooltip>
                                    )}
                                    renderTags={(value, getTagProps) => {
                                        if (value.length > 0) {
                                            return (
                                                <>
                                                    <Chip
                                                        sx={{
                                                            maxWidth: "80px",
                                                            width: "80px",
                                                        }}
                                                        key={value[0]._id}
                                                        label={value[0].value}
                                                        {...getTagProps({ index: 0 })}
                                                        onDelete={() => handalSearchById('facility', value.filter((_, i) => i !== 0))}
                                                    />{value.length > 1 ? "..." : ""}
                                                </>
                                            );
                                        }
                                        return null;
                                    }}
                                />

                            </div>

                            <div className='px-2 py-2 d-flex gap-3'>
                                <div className=' w-50'>
                                    <div className="Admission_date">
                                        <span className='d-flex justify-content-lg-start align-items-center gap-2'>
                                            <MdCalendarMonth />
                                            {searchFilter?.startdate && searchFilter?.enddate ? (
                                                <span className="date-icon-span">
                                                    {searchFilter?.startdate} / {searchFilter?.enddate}
                                                </span>
                                            ) : (
                                                <span className="date-icon-span fs-6">Admission Date</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="col-xl-3  col-lg-4 col-md-4 col-sm-6 mt-2 mt-sm-0">
                                        <Dropdown className="dash-main-filter">
                                            <Dropdown.Toggle style={{ height: "100%", width: "100%", }} ></Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <DateRange ranges={[selectionRange]} onChange={handleDate} />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>

                                <Autocomplete
                                    multiple
                                    id="family-relations"
                                    size="small"
                                    options={relationsOptions || [listInit]}
                                    sx={{ width: "50%" }}
                                    value={selectedRelations || []}
                                    getOptionLabel={(option) => option?.value}
                                    onChange={(_, value) => handleRelationChange(_, value)}
                                    open={isDropdownOpen}
                                    onOpen={() => setIsDropdownOpen(true)}
                                    onClose={() => setIsDropdownOpen(false)}
                                    renderOption={(props, option) => {
                                        const isSelected = selectedRelations.some(relation => relation._id === option._id);
                                        return (
                                            <li
                                                {...props}
                                                style={{
                                                    cursor: 'pointer',
                                                    backgroundColor: isSelected ? '#345d3b' : 'transparent',
                                                    color: isSelected ? 'white' : 'black',
                                                }}
                                                key={option._id}
                                                className="py-1 ps-3 menu-drop-item"
                                            >
                                                {option.value}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => (
                                        <Tooltip
                                            title={
                                                isDropdownOpen
                                                    ? ""
                                                    : selectedRelations.length > 0
                                                        ? selectedRelations.map(relation => relation.value).join(', ')
                                                        : "No relation selected"
                                            }
                                            arrow
                                        >
                                            <TextField
                                                {...params}
                                                label="Family Relations"
                                                placeholder="Select Relations"
                                                InputLabelProps={{ shrink: isDropdownOpen || selectedRelations.length > 0 }}
                                                sx={{ maxWidth: "100%" }}
                                            />
                                        </Tooltip>
                                    )}
                                    renderTags={(value, getTagProps) => {
                                        if (value.length > 0) {
                                            return (
                                                <>
                                                    <Chip
                                                        sx={{
                                                            maxWidth: "80px",
                                                            width: "80px",
                                                        }}
                                                        key={value[0]._id}
                                                        label={value[0].value}
                                                        {...getTagProps({ index: 0 })}
                                                        onDelete={() => handleRelationChange(null, value.filter((_, i) => i !== 0))}
                                                    />
                                                    {value.length > 1 ? "..." : ""}
                                                </>
                                            );
                                        }
                                        return null;
                                    }}
                                />







                                {/* <div className='w-100'>
                                    <div className="Admission_date">
                                        <span className='d-flex justify-content-lg-start align-items-center'>
                                            <MdCalendarMonth />
                                            {searchFilter?.disStartdate && searchFilter?.disEnddate ? (
                                                <span className="date-icon-span">
                                                    {searchFilter?.disStartdate} / {searchFilter?.disEnddate}
                                                </span>
                                            ) : (
                                                <span className="date-icon-span fs-6">Discharge Date</span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="col-xl-3  col-lg-4 col-md-4 col-sm-6 mt-2 mt-sm-0">
                                        <Dropdown className="dash-main-filter">
                                            <Dropdown.Toggle style={{ height: "100%", width: "100%", }} ></Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <DateRange ranges={[dischargeRange]} onChange={handleDischargeDate} />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div> */}
                            </div>
                            <div className='p-2 d-flex gap-3 align-content-center gap-4' style={{
                                width: "50%"
                            }} >

                                <Select
                                    value={active ? "Active" : "Inactive"}
                                    onChange={(event) => {
                                        const isActive = event.target.value === "Active";
                                        setActive(isActive);
                                        handalSearchBydischargedate(isActive);
                                    }}
                                    sx={{
                                        width: "100%",
                                        height: "40px",
                                        color: active ? 'black' : 'black',
                                        backgroundColor: active ? 'light' : 'white',
                                        '& .MuiSelect-icon': {
                                            color: active ? 'gray' : 'gray',
                                        },
                                    }}
                                >

                                    <MenuItem value="Active" sx={{}}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <AiOutlineUserDelete size={14} />
                                            <span>Inactive</span>
                                        </Box>
                                    </MenuItem>

                                    <MenuItem value="Inactive" sx={{ height: 36 }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <AiOutlineUserAdd size={14} />
                                            <span>Active</span>
                                        </Box>
                                    </MenuItem>
                                </Select>


                            </div>
                        </div>
                        <div className='filer_box'>
                            <p>Broadcast  Message</p>
                            <textarea rows={7} placeholder='Write your message here...' value={broadcastMessage} onChange={(e) => {
                                setBroadcastmessage(e.target.value)
                            }}
                                disabled={!(patientsWithContacts?.length > 0)}
                            >

                            </textarea>
                            <div className='filter_send' ><button
                                disabled={msg_loading || !(patientsWithContacts?.length > 0)}
                                onClick={sendBroadcast}
                                style={{
                                    backgroundColor: !(patientsWithContacts?.length > 0) ? "gray" : ""
                                }}>
                                Send</button></div>

                        </div>
                    </div>

                    <div className=' w-100  d-flex align-items-center '>
                        <p className='boradcast  '>Total patients included in the broadcast:  {!loading ? totalPatientsWithContacts || 0 : "..."} </p>






                    </div>



                    <div className='filter_table'>
                        <TableContainer component={Paper} sx={{ borderRadius: "15px" }}>
                            {!loading ? (
                                <>
                                    <Table sx={{ minWidth: 650 }}>
                                        {patientsWithContacts?.length > 0 ? (
                                            <>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="left" sx={{ fontWeight: 700 }}>Name</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }} align="left">Facility</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 700 }}>Admission Date</TableCell>
                                                        <TableCell className='' align="center" sx={{ fontWeight: 700 }}>Discharge Date</TableCell>
                                                        <TableCell />
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {patientsWithContacts?.map((row) => {
                                                        const patientName = `${row?.first_name} ${row?.last_name}`;
                                                        return (
                                                            <React.Fragment key={row._id}>
                                                                <TableRow>
                                                                    <TableCell align="left">{patientName}</TableCell>
                                                                    <TableCell align="left">{row?.facility?.name || "N/A"}</TableCell>
                                                                    <TableCell align="center">
                                                                        {row?.createdAt ? moment(row?.createdAt).utc().format('MM/DD/YYYY h:mm A') : "N/A"}
                                                                    </TableCell>
                                                                    <TableCell align="center">
                                                                        {row?.discharge_date ? moment(row?.discharge_date).utc().format('MM/DD/YYYY h:mm A') : "N/A"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {row?.contacts?.length > 0 &&
                                                                            <IconButton
                                                                                aria-label="expand row"
                                                                                size="small"
                                                                                onClick={() => {
                                                                                    handleRowClick(row?._id)
                                                                                }}>
                                                                                {open[row?._id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                                            </IconButton>}
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell style={{ padding: 0 }} colSpan={7}>
                                                                        {row?.contacts?.length > 0 &&
                                                                            <Collapse in={open[row._id]} timeout="auto" unmountOnExit>
                                                                                <Box margin={0}>
                                                                                    <Table size="small" aria-label="contacts" sx={{ backgroundColor: "#0000001a" }}>
                                                                                        <TableHead>
                                                                                            <TableRow >
                                                                                                <TableCell sx={{ fontWeight: 700, color: "gray" }} >Contact Name</TableCell>
                                                                                                <TableCell sx={{ fontWeight: 700, color: "gray" }} align="center">Phone</TableCell>
                                                                                                <TableCell sx={{ fontWeight: 700, color: "gray" }} align="center">Relationship</TableCell>
                                                                                                <TableCell sx={{ fontWeight: 700, color: "gray" }} align="center">Created At</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {row?.contacts?.map((contact) => (
                                                                                                <TableRow key={contact._id}>
                                                                                                    <TableCell >
                                                                                                        {contact.first_name} {contact.last_name}
                                                                                                    </TableCell>
                                                                                                    <TableCell align="center">
                                                                                                        {!contact?.phone || contact?.phone === "\u0000" ? "N/A" : contact?.phone}
                                                                                                    </TableCell>
                                                                                                    <TableCell align="center">{contact?.relationship || "N/A"}</TableCell>
                                                                                                    <TableCell align="center">
                                                                                                        {contact?.createdAt
                                                                                                            ? moment(contact?.createdAt).utc().format('DD/MM/YYYY h:mm A')
                                                                                                            : "N/A"}
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            ))}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                </Box>
                                                                            </Collapse>}
                                                                    </TableCell>
                                                                </TableRow>
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </TableBody>
                                            </>
                                        ) : (
                                            <TableBody
                                                sx={{
                                                    height: "30vh",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    fontWeight: 700,
                                                    fontSize: "24px"
                                                }}>
                                                No Data Found
                                            </TableBody>
                                        )}
                                    </Table>
                                    {(patientsWithContacts?.length < totalPatientsWithContacts) || (totalPatientsWithContacts > 10) && <TablePagination
                                        onPageChange={handleChangePage}
                                        rowsPerPageOptions={[10]}
                                        component="div"
                                        count={totalPatientsWithContacts}
                                        rowsPerPage={10}
                                        page={page}
                                    />}
                                </>
                            ) : (
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
                                </div>
                            )}
                        </TableContainer>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}
export default Mass