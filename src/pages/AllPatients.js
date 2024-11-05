import React, { useEffect, useRef, useState } from "react";
// import search from "../asset/search.png";
import settings from "../asset/settings.png";
import Ellipse from "../asset/Ellipse 105.png";
import Ellipse112 from "../asset/Ellipse 112.png";
import moreveritcal from "../asset/more-vertical.png";
import Rectangle from "../asset/Rectangle 1510.png";
import paperclip from "../asset/paperclip.png";
import Send_btn from "../asset/send_btn.png";
import Ellipse108 from "../asset/Ellipse 108.png";
import Ellipse113 from "../asset/Ellipse 113.png";

import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { get_patient, get_patient_contact } from "../redux/slice/patients";
import Cookies from "js-cookie";
import Spinner from "react-bootstrap/Spinner";

import moment from "moment";
import { stringAvatar } from "../helper/getAvatar";
import { Avatar, Pagination } from "@mui/material";
import useDebounce from "../helper/useDebounce";

function AllPatients() {
  const { patient_contact_count, patient, totalPatientCounts, patient_contact, loading } = useSelector((state) => state.patient);
  const [show_conatact, setshow_conatact] = useState();
  const { new_msg_count } = useSelector((state) => state.message);
  const [single_patient, setsingle_patient] = useState({});
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });



  const handlePageChange = (event, value) => {
    setPagination((prevState) => ({ ...prevState, page: value }));
    // dispatch(get_patient({ token, debouncedSearch, ...pagination }));
  };

  const fetc_contact = (patient_id) => {
    dispatch(
      get_patient_contact({ token, page: 1, limit: 2, patient_id: patient_id })
    );
  };

  const activeClasses = (et) => {
    let active = document.querySelector(".actives");
    if (active) {
      active.classList.remove("actives");
    }
    et.classList.add("actives");
  };

  // useEffect(() => {
  //   if (!patient) {
  //     dispatch(get_patient({ token, search }));
  //   }
  // }, [token]);

  useEffect(() => {
    if (debouncedSearch.length > 2 || debouncedSearch === '') {
      dispatch(get_patient({ token, search: debouncedSearch, ...pagination }));
    }
  }, [debouncedSearch, pagination, token]);

  return (
    <>
      <div className="contact_main_div">
        <Sidebar />
        <div className="head-div">
          <div className="head_header">
            <h2>Contact Texting</h2>

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
          <div className="ext-cls" >
            <div className="patient_contact" style={{ flex: 'none', position: "relative", minWidth: "600px" }}>
              <div className="patients" >
                <div className="patient_hd">
                  <div>
                    <span>
                      <h4>All Patients</h4>
                    </span>
                    {new_msg_count > 0 ? (
                      <div className="new">{new_msg_count} New</div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="settings">
                    <img src={settings} alt="" />
                  </div>
                </div>
                <div className="contact_search">
           
                    <input
                      type="text"
                      name=""
                      placeholder="Search..."
                      id=""
                      style={{ width:"100%" }}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        if (e.target.value.length > 2 && pagination.page != 1) {
                          handlePageChange(e, 1)
                        }
                      }}
                    />
                  
                </div>
              </div>
              <div className="all-patient">
                {loading === "patient" ? (
                  <div
                    style={{
                      height: "30vh",
                      width: "600px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
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
                          fetc_contact(it._id);
                          setshow_conatact(true);
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
                          let et = document.getElementById(it._id);
                          activeClasses(et);
                        }}
                      >
                        <div className="img_div">
                          {/* <img src={Ellipse} alt="" /> */}
                          <Avatar {...stringAvatar(`${it.first_name.charAt(0).toUpperCase()}${it.first_name.slice(1)} ${it.last_name.charAt(0).toUpperCase()}${it.last_name.slice(1)}`)} />
                        </div>
                        <div className="name-sections">
                          <p>{`${it.first_name.charAt(0).toUpperCase()}${it.first_name.slice(1)} ${it.last_name.charAt(0).toUpperCase()}${it.last_name.slice(1)}`}</p>
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
                  count={Math.ceil(totalPatientCounts / pagination.limit)}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="success"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    paddingTop: 1,
                    backgroundColor: "#ebf6f4",
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end"
                  }}
                />
              }
            </div>
            {/* for contact of selected patient */}
            {show_conatact ? (
              <div className="contact-box">
                {
                  loading === "patient_contact" ? (

                    <div
                      style={{
                        // paddingLeft: "21px",
                        // paddingTop: "192px",
                        height: "60vh",
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Spinner animation="border" variant="primary" />
                    </div>
                  ) : (
                    <>
                      <div className="cont-box flex-column">
                        <div className="lg-contact">
                          {/* <img src={Ellipse112} alt="" /> */}
                          <Avatar {...stringAvatar(single_patient?.name, 75, 75)} />
                        </div>

                        <div className="cont-box-info">
                          <p className="cont-box-name">{single_patient?.name}</p>
                          <p className="cont-box-mail">{single_patient?.email}</p>
                        </div>
                        <div className="tot-cont">
                          <p>{patient_contact_count} Contacts</p>
                        </div>
                      </div>
                      <div className="heading-cont">
                        <h3>Contact</h3>

                        <p>See all</p>
                      </div>
                      <div className="cont-list">
                        {patient_contact &&
                          patient_contact.map((it) => {
                            return (
                              <div
                                id={it._id}
                                className="conts"
                                onClick={(e) => {
                                  // setpastient_contact_id(it._id);
                                  // setshow_msg_box(true);
                                  // if (patient_contact_id !== it._id) {
                                  //     setallmessages([]);
                                  //     setPage(1);
                                  //     setlimit(15);
                                  //     setallmsg_length(0);
                                  //     setonetime_scroll(0);
                                  // }
                                  // settab(it._id);
                                  // setsingle_patient_contact({
                                  //     name: `${it.first_name
                                  //         .charAt(0)
                                  //         .toUpperCase()}${it.first_name.slice(
                                  //             1
                                  //         )?.trim()} ${it.last_name
                                  //             .charAt(0)
                                  //             .toUpperCase()}${it.last_name.slice(1)?.trim()}`,
                                  // });
                                  // let et = document.getElementById(it._id);
                                  // active_contactClasses(et);
                                }}
                              >
                                <div style={{
                                  display:"flex",
                                  justifyContent:"flex-start",
                                  alignItems:"center",
                                  gap:"5px"
                                }} >
                                <Avatar {...stringAvatar(`${it.first_name
                                  .charAt(0)
                                  .toUpperCase()}${it?.first_name?.slice(0)?.trim()} ${it?.last_name
                                    .charAt(0)
                                    .toUpperCase()}${it.last_name?.slice(0)?.trim()}`)} />
                                <span>{`${it.first_name
                                  .charAt(0)
                                  .toUpperCase()}${it.first_name.slice(
                                    1
                                  )} ${it.last_name
                                    .charAt(0)
                                    .toUpperCase()}${it.last_name.slice(1)}`}</span>
                                </div>
                                <span>send text</span>
                              </div>
                            );
                          })}
                      </div>{" "}
                    </>
                  )}
              </div>
            ) : (
              <div className="contact-box"
                style={{
                  display: 'flex',
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "24px"
                }}
              >
                Please select a patient
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AllPatients;
