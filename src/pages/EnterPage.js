import React, { useState } from 'react'
import logo from "../asset/Logo.png";
import agency_tracking from "../asset/agency_tracking.png";
import communication from "../asset/communication.png";
import usermanagment from "../asset/usermanagment.png";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';
import { Button, Modal } from 'react-bootstrap';
const EnterPage = () => {
  const profile = useSelector(state => state.profile)
  const [modal, setmodal] = useState(false);
  const navigate = useNavigate();
  const navigate_agency_tracking = () => {
    if (profile?.data?.portal_access) {
      navigate("/dashboard");
    } else {
      setmodal(true);
    }
  };

  const navigate_user_managment = () => {
    if (profile?.data?.portal_access) {
      navigate("/admin/user/dashboard");
    } else {
      setmodal(true);
    }
  };

  const handalLogout = () => {
    Cookies.remove("token")
    window.location.reload()
    setTimeout(() => {
      navigate("/")
    }, 1000)
  };
  const token = Cookies.get("token");
  const navigate_text = () => {
    if (profile?.data?.is_subscriptable_text) {
      navigate("/broadcast-history");
    } else {
      setmodal(true);
    }
  };
  return (
    <>
      {profile?.status ? (
        <>
          <div className="enter_head">
            <div>
              <img src={logo} alt="logo" />
            </div>
            <div className="sub-head-div">
              {profile?.data?.portal_access && <div className="sub-div">
                <div>
                  <img src={agency_tracking} alt="agency_tracking" />
                </div>
                <div style={{ width: "100%" }}>
                  <p>Agency Tracking</p>
                  <span>to get started</span>
                </div>
                <div>
                  <button className="agency-btn" onClick={navigate_agency_tracking} >
                    Enter Here <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>}

              {profile?.data?.is_subscriptable_text && <div className="comuni-sub-div">
                <div>
                  <img src={communication} alt="agency_tracking" />
                </div>
                <div style={{ width: "100%" }}>
                  <p>Patient Communications</p>
                  <span>to get started</span>
                </div>
                <div>
                  <button onClick={navigate_text} className="communi-btn" >
                    Enter Here <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>}

              {profile?.data?.roles[0]?.name === "admin" &&
                <div className="user-sub-div">
                  <div>
                    <img src={usermanagment} alt="usermanagment" />
                  </div>
                  <div style={{ width: "100%" }}>
                    <p>User Management</p>
                    <span>to get started</span>
                  </div>
                  <div>
                    <button className="agency-btn" onClick={navigate_user_managment} >
                      Enter Here <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      <Modal
        centered
        show={modal}
        onHide={() => { setmodal(false); }}
        aria-labelledby="contained-modal-title-vcenter"
        backdrop={true}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <p className="text-center">
            You haven't subscribed to this service yet, please contact to administrator.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={(e) => setmodal(false)}>Cancel</Button>
          <Button variant="success" onClick={handalLogout}>Logout</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default EnterPage