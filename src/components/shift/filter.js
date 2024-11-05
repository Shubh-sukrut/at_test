import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css';
import React, { useEffect, useState } from 'react'
import { CiFilter } from "react-icons/ci";
import { MdCalendarMonth } from "react-icons/md";
import { PiArrowClockwiseBold } from "react-icons/pi";
import Dropdown from "react-bootstrap/Dropdown";
import moment from "moment-timezone";
import { DateRange } from "react-date-range";
import { Autocomplete, Chip, Skeleton, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { get_agency } from '../../redux/slice/agency';
import Cookies from 'js-cookie';
import { get_shift } from '../../redux/slice/caregiver_with_shift';
import ExportJSON from './export';
import AuthPunch from './punch/';
import { uniqueArrayOfObject } from '../../helper/object';
import { get_facility } from '../../redux/slice/facility';
import { get_all_caregivers } from '../../redux/slice/caregivers';
import { get_all_csv_shifts } from '../../redux/slice/exportcsvdata/exportshifts';

const positionList = [
    {
        _id: 'CNA',
        value: 'CNA'
    },
    {
        _id: 'LPN',
        value: 'LPN'
    },
    {
        _id: 'RN',
        value: 'RN'
    },
];


const filterData = (data) => {
    return data?.map((it) => {
        return {
            _id: it._id,
            value: it?.name
        }
    })
}
const caregiverfilter = (data) => {
    return data?.map((it) => {
        return {
            _id: it._id,
            value: `${it?.lastName} ${it?.firstName}`
        }
    })
}
const ShiftFilter = ({ isSkeleton, setIsSkeleton, setPage, page, limit }) => {
    const agency = useSelector((state) => state.agency);
    const shift = useSelector((state) => state.shift);
    const profile = useSelector((state) => state.profile);
    const facility = useSelector(state => state.facility)
    const all_caregivers = useSelector(state => state.all_caregivers);
    const all_csv_shifts = useSelector(state => state.all_csv_shifts);
    const dispatch = useDispatch()
    const token = Cookies.get('token');
    const listInit = {
        _id: '',
        value: ''
    }

    const [agencyList, setAgencyList] = useState([listInit])
    const [facilityList, setFacilityList] = useState([])

    const [employee, setEmployee] = useState([listInit])
    // filter agency 
    function sortArrayByValue(array) {
        array?.sort((a, b) => {
            const valueA = a.value.toLowerCase();
            const valueB = b.value.toLowerCase();
            if (valueA < valueB) return -1;
            if (valueA > valueB) return 1;
            return 0;
        });
        return array;
    }
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
        if (agency?.status && profile?.status && positionList?.length && shift.status) {
            setIsSkeleton(false)
        }
    }, [agencyList, facilityList, positionList, employee, shift])
    // shift 
    useEffect(() => {
        if (!all_caregivers.status && !all_caregivers.loading) {
            dispatch(get_all_caregivers({ token }))
        }
        if (all_caregivers?.status) {
            const list = caregiverfilter(all_caregivers?.data)

            setEmployee(sortArrayByValue(list));
        }

    }, [all_caregivers.status])

    useEffect(() => {
        const list = filterData(agency.agency)
        setAgencyList(sortArrayByValue(list))
        if (!agency.status && !agency?.loading) {
            dispatch(get_agency({ token, user: profile?.data?._id }))
        }
    }, [agency.status])

    const formInit = {
        emp_search: listInit,
        startdate: '',
        enddate: '',
        position: listInit,
        facility: listInit,
        agency: listInit
    }
    const [searchFilter, setSearchFilter] = useState('')

    // date handal 
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
    });


    const handalFilter = (searchFilter, page) => {
        return {
            token,
            user: profile?.data?._id,
            position: searchFilter?.position?._id ? searchFilter?.position?._id : '',
            startdate: searchFilter?.startdate ? searchFilter?.startdate : '',
            enddate: searchFilter?.enddate ? searchFilter?.enddate : '',
            agency_id: searchFilter?.agency?._id ? searchFilter?.agency?._id : '',
            // facility: searchFilter?.facility?._id ? searchFilter?.facility?._id : 'all',
            facility: searchFilter?.facility?._id ? searchFilter?.facility?._id : '',
            search: searchFilter?.emp_search?._id ? searchFilter?.emp_search?._id : '',
            page: page,
            limit: limit
        }
    }
    useEffect(() => {
        if (profile?.status) {
            const filter = handalFilter(searchFilter, 0)
            setPage(0)
            dispatch(get_shift(filter))
            dispatch(get_all_csv_shifts(filter))
        }
    }, [searchFilter, profile, limit])
    useEffect(() => {
        if (profile?.status && shift?.status) {
            const filter = handalFilter(searchFilter, page)
            setPage(page)
            dispatch(get_shift(filter))
        }
    }, [page])
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

    //  Searching
    const handalSearch = (name, value) => {
        setSearchFilter({
            ...searchFilter,
            [name]: value
        })
    }

    const handalSearchById = (name, value) => {
        setSearchFilter({
            ...searchFilter,
            [name]: value
        })
    }

    // clear filter
    const handalClearFilter = () => {
        setSearchFilter('')
    }

    
    return (
        <div className="">
            <div className="d-flex align-items-center justify-content-between flex-wrap">
                <div className="filter-left">
                    {isSkeleton ? <div className="py-2"><Skeleton variant="rounded" width={140} height={30} /></div> : <h4>Clock Shift</h4>}
                    <div className="d-flex align-items-center mb-3">
                        {isSkeleton ? <Skeleton variant="rounded" width={220} height={26} /> : <div>Here is a list of all shift</div>}
                    </div>
                </div>
                <div className="d-flex">
                    {/* clear filter  */}
                    <div className="date-pos">
                        {
                            isSkeleton ? <div className="px-2">
                                <Skeleton variant="rounded" width={100} height={36} />
                            </div> : <>
                                <div className="date-fltr" onClick={handalClearFilter}>
                                    <span>
                                        <i className='px-1' style={{ color: "#4C7153" }}><PiArrowClockwiseBold /></i>
                                        clear filter
                                    </span>
                                </div>
                            </>
                        }
                    </div>
                    {/* export data  */}
                    <div className="date-pos">
                        {
                            isSkeleton  ? <div className="px-2">
                                <Skeleton variant="rounded" width={100} height={36} />
                            </div> : <>
                                <ExportJSON data={all_csv_shifts?.csvdata?.data} />
                            </>
                        }
                    </div>
                    {/* add punch  */}
                    {
                        profile?.data?.roles[0]?.name !== 'agency_user' && <>
                            <div className="date-pos">
                                {
                                    isSkeleton ? <div className="px-2">
                                        <Skeleton variant="rounded" width={100} height={36} />
                                    </div> : <>
                                        <AuthPunch filter={searchFilter} />
                                    </>
                                }
                            </div>
                        </>
                    }

                </div>
            </div>
            <div className="filter-right d-flex align-items-center justify-content-center flex-wrap">
                <div className=''>
                    {
                        isSkeleton ? <Skeleton variant="rounded" width={100} height={36} /> : <>
                            <CiFilter size={23} />
                            <span className="filter-icon-span">Filter by:</span>
                        </>
                    }
                </div>
                {/* employee search  */}
                <div className="px-2">
                    {!isSkeleton ?
                        <Autocomplete
                            id="size-small-filled"
                            size="small"
                            options={employee}
                            sx={{ width: 260 }}
                            value={searchFilter ? searchFilter?.emp_search : { id: '', value: '' }}
                            defaultValue={searchFilter ? searchFilter?.emp_search : { id: '', value: '' }}
                            selectOnFocus
                            onChange={(_, value) => handalSearchById('emp_search', value)}
                            getOptionLabel={(option) => option.value}
                            renderInput={(params, id) => <TextField {...params} label="Search Employee" />}
                            renderOption={(props, option) => <li {...props} style={{ cursor: 'pointer' }} key={option._id} className="py-1 ps-3 menu-drop-item"> {option.value} </li>}
                        /> : <Skeleton variant="rounded" width={210} height={36} />}
                </div>

                {/* Agency section  */}
                <div className="px-2">
                    {
                        !isSkeleton ? <Autocomplete
                            id="size-small-filled"
                            size="small"
                            options={agencyList}
                            sx={{ width: 220 }}
                            value={searchFilter ? searchFilter?.agency : { id: '', value: '' }}
                            getOptionLabel={(option) => option.value}
                            onChange={(_, value) => handalSearchById('agency', value)}
                            renderInput={(params) => <TextField {...params} label="Agency" placeholder="Agency" />}
                            renderOption={(props, option) => <li {...props} style={{ cursor: 'pointer' }} key={option._id} className="py-1 ps-3 menu-drop-item">{option.value} </li>}
                        /> : <Skeleton variant="rounded" width={210} height={36} />
                    }

                </div>

                {/* Facility section  */}
                {profile?.data?.roles[0]?.name !== 'agency_user' && <div className="px-2">
                    {
                        !isSkeleton ? <Autocomplete
                            id="size-small-filled"
                            size="small"
                            options={facilityList?.length ? facilityList : [listInit]}
                            sx={{ width: 220 }}
                            value={searchFilter ? searchFilter?.facility : { id: '', value: '' }}
                            getOptionLabel={(option) => option.value}
                            onChange={(_, value) => handalSearchById('facility', value)}
                            renderOption={(props, option) => <li {...props} style={{ cursor: 'pointer' }} key={option._id} className="py-1 ps-3 menu-drop-item"> {option.value} </li>}
                            renderInput={(params) => <TextField {...params} label="Facility" placeholder="Facility" />}
                        /> : <Skeleton variant="rounded" width={210} height={36} />
                    }
                </div>}

                {/* Position section  */}
                <div className="px-2">
                    {!isSkeleton ? <Autocomplete
                        id="size-small-filled"
                        size="small"
                        options={positionList}
                        sx={{ width: 120 }}
                        value={searchFilter ? searchFilter?.position : { id: '', value: '' }}
                        getOptionLabel={(option) => option.value}
                        onChange={(_, value) => handalSearchById('position', value)}
                        renderTags={(value, getTagProps) => value.map((option, index) => <Chip label={option.value} size="small" {...getTagProps({ index })} />)}
                        renderInput={(params) => <TextField {...params} label="Position" placeholder="Position" />}
                    /> : <Skeleton variant="rounded" width={120} height={36} />}
                </div>



                {/* date section  */}
                <div className="date-pos">
                    {!isSkeleton ? <>
                        <div className="date-fltr">
                            <span>
                                <MdCalendarMonth />
                                {searchFilter?.startdate && searchFilter?.enddate ? (
                                    <span className="date-icon-span">
                                        {searchFilter?.startdate} / {searchFilter?.enddate}
                                    </span>
                                ) : (
                                    <span className="date-icon-span">Date</span>
                                )}
                            </span>
                        </div>
                        <div className="col-xl-3  col-lg-4 col-md-4 col-sm-6 mt-2 mt-sm-0">
                            <Dropdown className="dash-main-filter">
                                <Dropdown.Toggle style={{ height: "100%", width: "183%", }} ></Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <DateRange ranges={[selectionRange]} onChange={handleDate} />
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </> : <Skeleton variant="rounded" width={100} height={36} />}
                </div>

            </div>
        </div >
    )
}

export default ShiftFilter
