import Cookies from 'js-cookie'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Hourglass } from 'react-loader-spinner'
import { Modal } from 'react-bootstrap'
import { get_profile } from './redux/slice/profile'
import { ToastContainer } from "react-toastify";
function Private_route({ componant, role }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const token = Cookies.get("token")
  const location = useLocation()
  const profile = useSelector(state => state.profile)
  const queryparams = new URLSearchParams(location.search)
  useEffect(() => {
    if (!token && !queryparams.get("token")) {
      navigate("/")
    }
    if (queryparams.get("token")) {
      Cookies.set("token", queryparams.get("token"))
      navigate("/landing-page")
    }
  }, [queryparams.get("token")])

  useEffect(() => {
    if (profile?.authError) {
      // Cookies.remove("token")
      navigate("/")
      window.location.reload()
    } else {
      if (!profile.status && !profile?.loading) {
        dispatch(get_profile({ token }))
      } else {
        if (profile?.data?.roles[0]?.length) {
          if (profile?.data?.roles[0]?.name != 'admin' && role == 'admin') {
            navigate("/dashboard")
          }
        }
      }
    }

  }, [profile, role])

  function handalLogOut() {
    Cookies.remove("token");
    window.location.reload();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }
  return !profile.status ? (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "#f7fcf7" }} >
      <Hourglass
        visible={true}
        height="100"
        width="100"
        ariaLabel="hourglass-loading"
        wrapperStyle={{}}
        wrapperClass=""
        colors={["#345d3b", "#345d3b"]}
      />
    </div>
  ) : (
    profile?.data?.roles?.length ? <>
      <ToastContainer />
      {componant}
    </> : <>
      <Modal show={true} centered>
        <Modal.Body>
          <div className="text-center py-3">
            You haven't assigned any Role yet, please contact to administrator.
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-secondary" onClick={handalLogOut}>
              logout
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Private_route
