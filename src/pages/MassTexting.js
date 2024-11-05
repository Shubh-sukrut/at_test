import React, { useEffect, useState } from "react";
import search from "../asset/search.png";
import settings from "../asset/settings.png";
import Ellipse from "../asset/Ellipse 105.png";
import Ellipse112 from "../asset/Ellipse 112.png";
import moreveritcal from "../asset/more-vertical.png";
import Rectangle from "../asset/Rectangle 1510.png";
import paperclip from "../asset/paperclip.png";
import Send_btn from "../asset/send_btn.png";
import Ellipse108 from "../asset/Ellipse 108.png";
import Ellipse113 from "../asset/Ellipse 113.png";
import { MultiSelect } from "react-multi-select-component";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { get_patient, get_patient_contact } from "../redux/slice/patients";
import { Spinner } from "react-bootstrap";
import {
    create_message,
    fetch_new_message,
    messgeAction,
} from "../redux/slice/message_slice";
import { toast } from "react-toastify";
import useDebounce from "../helper/useDebounce";
import { Avatar, Pagination } from "@mui/material";
import { stringAvatar } from "../helper/getAvatar";

const MassTexting = () => {
    const token = Cookies.get("token");
    const [selected, setSelected] = useState([]);
    const [msg_send, setmsg_send] = useState({
        title: "",
        message: "",
    });
    const { status } = useSelector((state) => state.message);
    const dispatch = useDispatch();
    const {
        patient_contact_count,
        patient,
        patient_contact,
        loading,
        chatgroup,
        all_patients_contact,
        totalPatientCounts,
    } = useSelector((state) => state.patient);
    const { new_msg_count, msg_loading } = useSelector((state) => state.message);

    const [patient_contact_options, setpatient_contact_options] = useState([]);
    const [show_conatact, setshow_conatact] = useState();
    const [single_patient, setsingle_patient] = useState({});
    const [show_msg_box, setshow_msg_box] = useState();
    const [patient_contact_id, setpastient_contact_id] = useState([]);
    const [patient_id, setpastient_id] = useState("");

    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const debouncedSearch = useDebounce(searchQuery, 500);


    const [check, setcheck] = useState([]);
    const activeClasses = (et) => {
        // const et = e.target
        let active = document.querySelector(".actives");
        if (active) {
            active.classList.remove("actives");
        }
        et.classList.add("actives");
    };

    const handle_change = (e) => {
        setmsg_send({ ...msg_send, [e.target.name]: e.target.value });
    };

    const handle_change_mulitselect = (e) => {
        let ids = e.map((it) => it.value);
        const checkboxes = document.querySelectorAll(".check-box");
        checkboxes.forEach((checkbox) => {
            if (!ids.includes(checkbox.id)) {
                checkbox.checked = false;
            } else {
                checkbox.checked = true;
            }
        });

        setpastient_contact_id(ids);
        setSelected(e);
    };
    const msg_create = (e) => {
        e.preventDefault();
        if (msg_send.title === "") {
            toast.warning("Are you sure ? You want to move forward without title. ", {
                position: "top-right",
            });
            return;
        }
        if (msg_send.message === "") {
            toast.warning("Message is empty. ", {
                position: "top-right",
            });
            return;
        }
        let text = `${msg_send.title}<ttlbrk/>${msg_send.message}`;

        dispatch(
            create_message({
                token,
                Type: "outbound",
                Method: "single",
                Patient_contact: patient_contact_id,
                messages: text,
                chatType: "onebyone",
            })
        );
    };

    const handle_check = (e) => {
        if (e.target.checked) {
            setpastient_contact_id((pr) => [...pr, e.target.id]);
            const select_opt = patient_contact_options.filter((it) => {
                if (it.value === e.target.id) {
                    return true;
                }
            });
            setSelected((pr) => [...pr, ...select_opt]);
        } else {
            let ids = patient_contact_id.filter((it) => it !== e.target.id);
            setpastient_contact_id(ids);
            const select_opt = selected.filter((it) => {
                if (it.value !== e.target.id) {
                    return true;
                }
            });
            setSelected(select_opt);
        }
    };
    const select_all = (e) => {
        const checkboxes = document.querySelectorAll(".check-box");
        checkboxes.forEach((checkbox) => {
            checkbox.checked = e.target.checked;
        });
        if (e.target.checked) {
            let ids = patient_contact.map((it) => it._id);
            setpastient_contact_id(ids);
            const select_opt = patient_contact.map((it) => {
                return { value: it._id, label: `${it.first_name} ${it.last_name}` };
            });
            setpatient_contact_options(select_opt);
            setSelected(select_opt);
        } else {
            setpastient_contact_id([]);
            setSelected([]);
        }
        setshow_msg_box(true);
    };

    useEffect(() => {
        if (status === true) {
            toast.success("Message Send Successfully", {
                position: "top-right",
            });
            dispatch(messgeAction.status_blank());
            setmsg_send({
                title: "",
                message: "",
            });
        }
    }, [status]);

    const fetc_contact = () => {
        dispatch(
            get_patient_contact({ token, page: 1, limit: 2, patient_id: patient_id })
        );
    };
    useEffect(() => {
        // if (!patient && token) {
        //     dispatch(get_patient({ token , search : searchQuery , page , limit:20 }));
        // }

        if (patient_contact) {
            const select_opt = patient_contact.map((it) => {
                return { value: it._id, label: `${it.first_name} ${it.last_name}` };
            });
            setpatient_contact_options(select_opt);
        }
    }, [token, patient_contact]);

    useEffect(() => {
        if (debouncedSearch.length > 2 || debouncedSearch === '') {
            dispatch(get_patient({ token, search: debouncedSearch, page, limit: 20 }));
        }
    }, [debouncedSearch, page, token])


    useEffect(() => {
        if (patient_id) {
            fetc_contact();
        }
    }, [patient_id]);

    const [selectedOption, setSelectedOption] = useState("");

    const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };
    return (
        <>
            <div className="contact_main_div">
                <Sidebar />
                <div className="head-div">
                    <div className="head_header">
                        <h3 style={{ color: "#002C5D" }}>Mass Texting</h3>

                        <div className="admin-section">
                            {/* <p>
                                <i className="fa-regular fa-bell"></i>
                            </p>
                            <div>
                                <img src={Ellipse113} alt="" />
                            </div> */}
                            <span>Admin</span>
                        </div>
                    </div>
                    <div className="ext-cls">
                        <div className="patient_contact" style={{
                            position: "relative"
                        }} >
                            <div className="patients">
                                <div className="patient_hd">
                                    <div>
                                        <span>
                                            <p>Select Patient</p>
                                        </span>
                                        {/* <div className='new'>{new_msg_count} New</div> */}
                                    </div>
                                    {/* <div className='settings'>
                                        <img src={settings} alt="" />
                                    </div> */}
                                </div>
                                <div className="contact_search">
                                    <span>
                                        {/* <img src={search} alt="" /> */}
                                        <input
                                            type="text"
                                            name=""
                                            placeholder="Search..."
                                            // onChange={(e) => {
                                            //     dispatch(
                                            //         get_patient({ token, search: e.target.value })
                                            //     );
                                            // }}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value)
                                                if (e.target.value.length > 2) {
                                                    handlePageChange(e, 1)
                                                }
                                            }}
                                            id=""
                                        />
                                    </span>
                                </div>
                            </div>
                            <div className="all-patient">
                                {loading === "patient" ? (
                                    <div
                                        style={{
                                            paddingLeft: "21px",
                                            paddingTop: "192px",
                                            width: "100px",
                                            margin: "auto",
                                        }}
                                    >
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                ) : (
                                    patient &&
                                    patient.map((it) => {
                                        return (
                                            <div
                                                id={it._id}
                                                className="chat"
                                                onClick={() => {
                                                    setpastient_id(it._id);
                                                    setsingle_patient({
                                                        name: `${it.first_name
                                                            .charAt(0)
                                                            .toUpperCase()}${it.first_name.slice(
                                                                1
                                                            )?.trim()} ${it.last_name
                                                                .charAt(0)
                                                                .toUpperCase()}${it.last_name.slice(1)?.trim()}`,
                                                        email: it.email,
                                                    });
                                                    setshow_conatact(true);
                                                    let et = document.getElementById(it._id);
                                                    activeClasses(et);
                                                }}
                                            >
                                                <div className="img_div">
                                                    {/* <img src={Ellipse} alt="" /> */}
                                                    <Avatar {...stringAvatar(`${it.first_name
                                                        .charAt(0)
                                                        .toUpperCase()}${it.first_name.slice(
                                                            1
                                                        )?.trim()} ${it.last_name
                                                            .charAt(0)
                                                            .toUpperCase()}${it.last_name.slice(1)?.trim()}`)} />
                                                </div>
                                                <div className="name-sections">
                                                    <p>{`${it.first_name
                                                        .charAt(0)
                                                        .toUpperCase()}${it.first_name.slice(
                                                            1
                                                        )} ${it.last_name
                                                            .charAt(0)
                                                            .toUpperCase()}${it.last_name.slice(1)}`}</p>
                                                    <p className="msgd"></p>
                                                </div>
                                                <div className="date">
                                                    <p></p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            {totalPatientCounts &&
                                <Pagination
                                    count={Math.ceil(totalPatientCounts / 20)} // Adjust `totalPatients` accordingly
                                    page={page}
                                    onChange={handlePageChange}
                                    color="success"
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        paddingTop: 1,
                                        backgroundColor: "#ebf6f4"
                                    }}
                                />}
                        </div>

                        {show_conatact ? (
                            <div className="contact-box">
                                {loading === "patient_contact" ? (
                                    <div
                                        style={{
                                            paddingLeft: "21px",
                                            paddingTop: "192px",
                                            width: "100px",
                                            margin: "auto",
                                        }}
                                    >
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="cont-box1">
                                            <div className="lg-contact">
                                                {/* <img src={Ellipse112} alt="" /> */}
                                                <Avatar {...stringAvatar(single_patient?.name , 75 , 75)} />
                                            </div>

                                            <div className="cont-box-info">
                                                <p className="cont-box-name name1">
                                                    {single_patient?.name}
                                                </p>
                                            </div>
                                            <div className="tot-cont tot1">
                                                <p>{patient_contact_count} Contacts</p>
                                            </div>
                                        </div>
                                        <div className="heading-cont">
                                            <h3>Contacts</h3>
                                            <div className="select-dev">
                                                <p className="select-all">Select All</p>
                                                <div className="checks">
                                                    <input
                                                        type="checkbox"
                                                        onChange={select_all}
                                                        name=""
                                                        id=""
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cont-list">
                                            {patient_contact &&
                                                patient_contact?.map((it, i) => {
                                                    return (
                                                        <div
                                                            id={it._id}
                                                            className="chat"
                                                            onClick={() => {
                                                                setshow_msg_box(true);
                                                                // let et = document.getElementById(it._id)
                                                                // activeClasses(et)
                                                            }}
                                                        >
                                                            <div className="main">
                                                                <div className="img_div">
                                                                    {/* <img src={Ellipse} alt="" /> */}
                                                                    <Avatar {...stringAvatar(`${it.first_name.charAt(0).toUpperCase()}${it?.first_name?.slice(1)?.trim()} ${it.last_name.charAt(0).toUpperCase()}${it.last_name.slice(1)?.trim()}`)} />
                                                                </div>
                                                                <div className="name-sections">
                                                                    <p>{`${it.first_name.charAt(0).toUpperCase()}${it?.first_name?.slice(1)} ${it.last_name.charAt(0).toUpperCase()}${it.last_name.slice(1)}`}</p>
                                                                    {/* <p className="msgd">
                                                                        hello lorem ipsum text here
                                                                    </p> */}
                                                                </div>
                                                            </div>
                                                            <div className="checks">
                                                                <input
                                                                    className="check-box"
                                                                    onChange={(e) => {
                                                                        handle_check(e);
                                                                    }}
                                                                    type="checkbox"
                                                                    name=""
                                                                    id={it._id}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="contact-box"></div>
                            </>
                        )}

                        {show_msg_box ? (
                            <div className="msg-create">
                                <div>
                                    <form action="" onSubmit={msg_create}>
                                        <div className="inp-div">
                                            <label htmlFor="title">Message Title</label>
                                            <input
                                                value={msg_send.title}
                                                onChange={handle_change}
                                                className="inp1"
                                                type="text"
                                                name="title"
                                                id="title"
                                            />
                                        </div>
                                        <div className="inp-div">
                                            <label htmlFor="msg">Message</label>
                                            <textarea
                                                onChange={handle_change}
                                                value={msg_send.message}
                                                className="inp2"
                                                name="message"
                                                id="msg"
                                                cols="30"
                                                rows="10"
                                            ></textarea>
                                        </div>
                                        <div className="select-div">
                                            <label htmlFor="sendto">Send To</label>

                                            <MultiSelect
                                                options={patient_contact_options}
                                                value={selected}
                                                onChange={handle_change_mulitselect}
                                                labelledBy={
                                                    patient_contact_count === patient_contact_id.length
                                                        ? `All Contacts ${patient_contact_count}`
                                                        : "All Selected Contact"
                                                }
                                            />
                                        </div>
                                        <div className="immedate">
                                            <div className="inp-div new-prop">
                                                <label htmlFor="sendon">Send On</label>
                                                <button className="img-btn">Immediatly</button>
                                            </div>
                                            <div className="inp-div new-prop">
                                                <button className="imd-scd">Scheduled</button>
                                                {/* <input type="text" name="" id="title" /> */}
                                            </div>
                                        </div>
                                        <div className="msg-create-brds"></div>
                                        <div className="submit-div">
                                            <button className="dra-btn">Save as draft</button>
                                            <button className="sbt-btn" type="submit">
                                                {msg_loading === "create_msg" ? (
                                                    <Spinner animation="border" size="sm" />
                                                ) : (
                                                    "Submit"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="msg-create"></div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MassTexting;
