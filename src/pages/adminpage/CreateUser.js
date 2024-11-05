import React, { useEffect, useState } from "react";
import NavBar2 from "../NavBar2";
import { apis } from "../../apis";
import axios from "axios";
import Adminaside from "../../components/asides/Adminaside";
import { Bounce, toast } from "react-toastify";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { get_user } from "../../redux/slice/user";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import AdminHeader from '../../components/comman/admin_header';
import { Col, Row } from "react-bootstrap";
const CreateUserser = () => {
  const Navigate = useNavigate();
  // state for form data store
  const formInit = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  };
  const [formData, setFormData] = useState(formInit);
  const [error, setError] = useState(formData)
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState('')
  const [successToast, setSuccessToast] = useState(false);
  const [errToast, setErrToast] = useState(false);
  const dispatch = useDispatch()
  const token = Cookies.get("token");
  // Handle form input chage
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handel onSumit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let isError = false;
      let errorList = {}
      Object.keys(formData).map((it) => {
        if (formData[it] === '') {
          errorList[it] = ` ${it.split('_').join(' ')} is required!`
          setErrToast(true)
          isError = true
        }
        return it
      })
      setError(errorList)
      if (isError) {
        return
      }

      const isValidEmail = emailRegex.test(formData.email);
      if (!isValidEmail) {
        throw new Error("Please enter a valid email address")
      }
      await axios.post(apis.CREATE_USER, formData);
      setSuccessToast(true)
      setFormData(formInit);
      dispatch(get_user({ token }))
      setTimeout(() => {
        Navigate("/admin/user/dashboard");
      }, 5000);
    } catch (error) {
      if (error?.response?.data?.message) {
        setResError(error?.response?.data?.message)
      } else {
        setResError(error?.message)
      }
    }
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (successToast) {
      toast.success("User Created Successfully", {
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
    }
  }, [successToast]);

  useEffect(() => {
    if (errToast) {
      Object.values(error).map(it => {
        toast.error(it, {
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
        return it
      })

      setTimeout(() => {
        setErrToast(false)
      }, 1000)
    }
  }, [errToast, error]);

  useEffect(() => {
    if (resError !== '') {
      toast.error(resError, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  }, [resError]);

  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-nav">
          <NavBar2 />
        </div>
        {/* dashboard  */}
        <div className="admin-container ">
          {/* aside  */}
          <Adminaside />

          <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/user/dashboard" action="All User" />
          <div className="create-user">
            <form action="" onSubmit={handleSubmit}>
              <h1 className="text-center">Create User</h1>
              <div className="container">
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-3">
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label="First Name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      name="first_name"
                      color={formData.first_name ? "success" : ""}
                    // variant="standard"
                    />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-3">
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label="Last Name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      name="last_name"
                      color={formData.last_name ? "success" : ""}
                    // variant="standard"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xxl={12} xl={12} lg={12} md={12} sm={12} xs={12}>
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      name="email"
                      color={
                        formData.email ? "success" : ""
                      }
                    // variant="standard"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-3">
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      name="phone"
                      color={formData.phone ? "success" : ""}
                    // variant="standard"
                    />
                  </Col>
                  <Col xxl={6} xl={6} lg={6} md={6} sm={12} xs={12} className="py-3">
                    <TextField
                      fullWidth
                      id="outlined-required"
                      label="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      name="password"
                      color={formData.password ? "success" : ""}
                    // variant="standard"
                    />
                  </Col>
                </Row>
                <div className="mt-2 d-flex justify-content-center">
                  {
                    !loading ? <button type="submit" className="btn btn-success">Create User </button> : <button type="button" className="btn btn-success">Loading... </button>
                  }

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUserser;
