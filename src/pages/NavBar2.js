import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clock2 from "../asset/Vector (1).png";
import Cookies from "js-cookie";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { get_profile } from "../redux/slice/profile";

const Navbar2 = () => {
  const profile = useSelector(state => state?.profile)

  const [token, settoken] = useState(Cookies.get("token"))
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()
  // useEffect(() => {
  //   if (!profile?.status) {
  //     dispatch(get_profile({ token }))
  //   }
  // }, [profile])

  function handalLogOut() {
    Cookies.remove("token")
    window.location.reload()
    settoken(Cookies.get("token") ? Cookies.get("token") : "")
    setTimeout(() => {
      navigate("/")
    }, 1000)
  }
  return (
    <>
      <div className="nav-main nav-main-2">
        <div className="nav-inner-2">
          <NavLink to="/dashboard" className="auth-nav-icon">
            <img src={clock2} />
            <span className="timetra-heading timetra-heading-2">
              <b>Time </b>Tracking
            </span>
          </NavLink>
          <div className="auth-profile-pop">
            <div className="auth-pro-group">
              <p className="auth-name-nav">
                {profile?.status ? profile?.data?.first_name + " " + profile?.data?.last_name : ""}
              </p>
              <p className="define-iam">{profile?.data?.roles[0]?.name?.split('_').join(' ')}</p>
            </div>
            <div className="bdge-auth">
              <p>{profile?.data?.first_name?.substring(0, 1).toUpperCase()}</p>
            </div>
            <div className="logout" onClick={() => setShow(true)}>
              <i className="fa-solid fa-right-from-bracket" style={{ cursor: "pointer" }} onClick={() => setShow(true)}></i>
            </div>
          </div>
        </div>
      </div>

      {/* logout modal  */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Body>
          <div style={{ fontSize: '28px', color: '#3a503e' }} className="fw-bold py-4 text-center">
            Are you sure you want to log out?
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn mx-1 btn-secondary" onClick={() => setShow(false)}> Cancel</button>
            <button className="btn mx-1 btn-success" onClick={handalLogOut}>Yes, Log Out</button>
          </div>
        </Modal.Body>
        {/* </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default Navbar2;
