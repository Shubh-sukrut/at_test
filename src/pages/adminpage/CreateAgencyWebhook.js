import React, { useEffect, useState } from "react";
import Navbar2 from "../NavBar2";
import Adminaside from "../../components/asides/Adminaside";
import SelectSingle from "../../components/input/Select";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { apis } from "../../apis";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import { TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { get_agency } from "../../redux/slice/agency";
import { get_agencywebhook } from "../../redux/slice/webhook";
import AdminHeader from "../../components/comman/admin_header";
const CreateAgencyWebhook = () => {
  // state for form data store
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const agency = useSelector((state) => state?.agency);
  const formInit = {
    agency: [],
    dev_url: "",
    prod_url: "",
    functionName: "",
    token: "",
  };
  const [formData, setformData] = useState(formInit);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState('')
  const [error, setError] = useState(formInit)
  const [errToast, setErrToast] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    if (!agency?.status && !agency?.loading) {
      dispatch(get_agency({ token }));
    }
  }, [agency?.status]);

  // Handle form input chage
  const handalChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Regular expression for URL validation
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
    try {

      let isError = false;
      let errorList = {}
      Object.keys(formData).map((it) => {
        if (formData[it] == '') {
          errorList[it] = `${it.split('_').join(' ')} is required!`
          setErrToast(true)
          isError = true
        }
      })
      setError(errorList)
      if (isError) {
        return
      }

      // Check if the changed field is either dev_url or prod_url and validate the URL
      if (!urlPattern.test(formData.dev_url)) {
        setResError(`Invalid DEV URL`)
        return
      }
      if (!urlPattern.test(formData.prod_url)) {
        setResError(`Invalid PROD URL`);
        return
      }
      const response = await axios.post(apis.CREATE_AGENCYWEBHOOK, formData, {
        headers: { token },
      });
      setSuccessToast(true);
      setformData(formInit);
      setError(formInit)
      dispatch(get_agencywebhook({ token }));
      setTimeout(() => {
        navigate("/admin/agencywebhook/dashboard");
      }, 4000);
    } catch (error) {
      setLoading(false);
      if (error?.response?.data?.message) {
        setResError(error?.response?.data?.message)
      } else {
        setResError(error?.message)
      }
    } finally {
      setLoading(false);
    }
  };



  const toastVal = {
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    autoClose: 3000,
  }

  useEffect(() => {
    if (successToast) {
      toast.success("Agency Webhook Created Successfully", toastVal);
      setSuccessToast(false)
    }
  }, [successToast]);

  useEffect(() => {
    if (errToast) {
      Object.values(error).map(it => {
        toast.error(it, toastVal);
      })
      setErrToast(false)
    }
  }, [errToast]);

  useEffect(() => {
    if (resError !== '') {
      toast.error(resError, toastVal);
      setResError('')
    }
  }, [resError]);

  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-nav">
          <Navbar2 />
        </div>

        {/* dashboard  */}
        <div className="admin-container ">
          {/* aside  */}
          <div className="aside text-center align-item-center">
            <Adminaside />
          </div>
          <AdminHeader backTitle="Dashboad" backPath="/admin" action_path="/admin/agencywebhook/dashboard" action="All Agency Webhook" />
          <div className="create-user boder m-auto" style={{ width: "40%" }}>
            <form action="" onSubmit={loading ? () => { } : handleSubmit}>
              <h1 className="py-3 text-center">Create Agency Webhook</h1>
              <div className="container">
                <div className="row">
                  <div className="col col-6 mb-3">
                    <SelectSingle
                      data={agency?.agency}
                      value={
                        typeof formData?.agency == "string"
                          ? formData?.agency
                          : formData?.agency?._id
                      }
                      name="agency"
                      label="Agency"
                      handleChange={handalChange}
                    />
                  </div>

                  <div className="col col-6 mb-3">
                    <TextField
                      id="outlined-required"
                      fullWidth
                      label="Function Name"
                      value={formData?.functionName}
                      name="functionName"
                      onChange={handalChange}
                    />
                  </div>

                  <div className="col col-6 mb-3">
                    <TextField
                      id="outlined-required"
                      fullWidth
                      label="Dev URL"
                      value={formData?.dev_url}
                      name="dev_url"
                      onChange={handalChange}
                    />
                  </div>
                  <div className="col col-6 mb-3">
                    <TextField
                      id="outlined-required"
                      fullWidth
                      label="Prod URL"
                      value={formData?.prod_url}
                      name="prod_url"
                      onChange={handalChange}
                    />
                  </div>

                  <div className="col col-12 mb-3">
                    <TextField
                      id="outlined-required"
                      fullWidth
                      label="Token"
                      value={formData?.token}
                      name="token"
                      onChange={handalChange}
                    />
                  </div>
                </div>
                <div className="d-flex justify-content-center">
                  <button type={loading ? "button" : "submit"} className="btn btn-success">{loading ? 'Loading...' : ' Create Agency Webhook'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAgencyWebhook;
