import React, { useEffect, useState } from "react";
import NavBar2 from "../NavBar2";
import Adminaside from "../../components/asides/Adminaside";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { get_company } from "../../redux/slice/createcompany";
import { get_facility } from "../../redux/slice/facility";
import { get_user } from "../../redux/slice/user";
import { NavLink } from "react-router-dom";
import { get_employee } from "../../redux/slice/employee";
import "react-toastify/dist/ReactToastify.css";
import { admin_dashboard_page } from "../../static-data/admin_dashboard";
import { get_agency } from "../../redux/slice/agency";
import { get_roles } from "../../redux/slice/roles";
import { get_agencywebhook } from "../../redux/slice/webhook";
import { Skeleton } from "@mui/material";
import { get_profile } from "../../redux/slice/profile";
import { get_facilitywebhook } from "../../redux/slice/facility_webhook";
import { get_Integration_Facility_Mapping } from "../../redux/slice/Integration-Facility-Mapping";
import { MdOutlineImportExport } from "react-icons/md";
import { BsFillCreditCard2FrontFill } from "react-icons/bs";

const Admin = () => {
  const token = Cookies.get("token");
  const company = useSelector((state) => state.company);
  const facility = useSelector((state) => state.facility);
  const employees = useSelector((state) => state.employees);

  const users = useSelector((state) => state.user);
  const agencywebhook = useSelector((state) => state.agencywebhook);
  const facilitywebhook = useSelector((state) => state?.facilityWebHook);
  const profile = useSelector((state) => state?.profile);
  const agency = useSelector((state) => state?.agency);
  const roles = useSelector((state) => state?.roles);
  const dispatch = useDispatch();
  const Integration_Facility_Mapping = useSelector(state => state.Integration_Facility_Mapping)
  const [totalData, setTotalData] = useState([])

  useEffect(() => {
    if (company?.status && facility?.status && employees?.status && users?.status && agency?.status && roles?.status && agencywebhook?.status && facilitywebhook?.status) {
      setTotalData([
        {
          title: 'Users',
          total: users?.user_data?.length ? users?.user_data?.length : 0
        },
        {
          title: 'Companies',
          total: company?.company_data?.length ? company?.company_data?.length : 0
        },
        {
          title: 'Facilities',
          total: facility?.facility_data?.length ? facility?.facility_data?.length : 0
        },
        {
          title: 'Caregivers',
          total: employees?.employee_data?.length ? employees?.employee_data?.length : 0
        },
        {
          title: 'Agencies',
          total: agency?.agency?.length ? agency?.agency?.length : 0
        },
        {
          title: 'Roles',
          total: roles?.roles?.length ? roles?.roles?.length : 0
        },
        {
          title: 'Webhook',
          total: agencywebhook?.agencywebhook?.length ? agencywebhook?.agencywebhook?.length : 0
        },
        {
          title: 'Agency DB Id',
          total: facilitywebhook?.facilitywebhook?.length ? facilitywebhook?.facilitywebhook?.length : 0
        },
        {
          title: 'Facility Mapping',
          total: Integration_Facility_Mapping?.data?.length ? Integration_Facility_Mapping?.data?.length : 0
        },
      ])
    }

    // if (!profile?.status) {
    //   dispatch(get_profile({ token }))
    // }

    if (!company?.status && !company.loading) {
      dispatch(get_company({ token }));
    }

    if (!facility?.status && !facility?.loading) {
      dispatch(get_facility({ token }));
    }

    if (!users?.status && !users?.loading) {
      dispatch(get_user({ token }));
    }

    if (!employees?.status && !employees?.loading && profile?.status) {
      dispatch(get_employee({ token, user: profile?.data?._id }));
    }

    if (!agency?.status && !agency?.loading) {
      dispatch(get_agency({ token }));
    }

    if (!roles?.status && !roles?.loading) {
      dispatch(get_roles({ token }));
    }

    if (!agencywebhook?.status && !agencywebhook?.loading) {
      dispatch(get_agencywebhook({ token }))
    }
    if (!facilitywebhook?.status && !facilitywebhook?.loading) {
      dispatch(get_facilitywebhook({ token }));
    }
    if (!Integration_Facility_Mapping?.status && !Integration_Facility_Mapping?.loading) {
      dispatch(get_Integration_Facility_Mapping({ token }));
    }
  }, [token, profile, company, facility, users, employees, agency, roles, agencywebhook, facilitywebhook, Integration_Facility_Mapping])

  return (
    <>
      <div className="admin-dashboard">
        <div className="admin-nav">
          <NavBar2 />
        </div>
        <div className="admin-container ">
          <div className="aside text-center align-item-center">
            <Adminaside />
          </div>
          {!company?.status || !facility?.status || !employees?.status || !users?.status || !agency?.status || !roles?.status || !agencywebhook?.status || !facilitywebhook?.status ? (
            <>
              <div className="d-flex flex-wrap justify-content-evenly p-4">
                {admin_dashboard_page?.map((it, keys) => {
                  return (
                    <div className="py-3" key={keys}>
                      <div className="admin-card d-flex align-items-center rounded" style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', overflow: 'hidden', width: '300px', background: '#fff', height: '120px' }}>
                        <div style={{ width: '100px', height: '100%' }} className="d-flex d-flex align-items-center justify-content-center">
                          <Skeleton animation="wave" variant="rounded" width={80} height={80} />
                        </div>
                        <div style={{ width: '200px', height: '100%' }} className="d-flex d-flex  justify-content-center flex-column">
                          <div className="py-1">
                            <Skeleton animation="wave" variant="rounded" width={150} height={18} />
                          </div>
                          <div className="py-1">
                            <Skeleton animation="wave" variant="rounded" width={120} height={18} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="admin-inner p-4">
              <>
                <Row className="justify-content-evenly admin-card-box">
                  {
                    admin_dashboard_page?.map((it, keys) => {
                      return (
                        <Col className="py-2" xl={3} lg={3} md={4} sm={6} xm={12}>
                          <NavLink to={it?.path} style={{ color: "Black", textDecoration: "None" }} >
                            <div style={{ cursor: "pointer" }} className="admin-card" >
                              <div className="d-flex ">
                                <div className="py-4 d-flex align-items-center justify-content-center admin-icon">
                                  {it?.icon}
                                </div>
                                <div className="d-flex flex-column align-items-center justify-content-center py-3">
                                  <h3 className="text-center">{it?.title}</h3>
                                  <h4 className="text-center"> {totalData?.map(tt => {
                                    if (tt.title == it?.title) {
                                      return (
                                        tt.total
                                      )
                                    }
                                  })}</h4>
                                </div>
                              </div>
                            </div>
                          </NavLink>
                        </Col>
                      )
                    })
                  }
                  <Col className="py-2" xl={3} lg={3} md={4} sm={6} xm={12}>
                    <NavLink to={'/admin/system-integration'} style={{ color: "Black", textDecoration: "None" }} >
                      <div style={{ cursor: "pointer" }} className="admin-card" >
                        <div className="d-flex ">
                          <div className="py-4 d-flex align-items-center justify-content-center admin-icon">
                            <MdOutlineImportExport />
                          </div>
                          <div className="d-flex flex-column align-items-center justify-content-center py-3">
                            <h3 className="text-center">System Integration</h3>
                          </div>
                        </div>
                      </div>
                    </NavLink>
                    
                  </Col>
                  <Col className="py-2" xl={3} lg={3} md={4} sm={6} xm={12}>
                    <NavLink to={'/admin/twiliocreds'} style={{ color: "Black", textDecoration: "None" }} >
                      <div style={{ cursor: "pointer" }} className="admin-card" >
                        <div className="d-flex ">
                          <div className="py-4 d-flex align-items-center justify-content-center admin-icon">
                          <BsFillCreditCard2FrontFill />

                          </div>
                          <div className="d-flex flex-column align-items-center justify-content-center py-3">
                            <h3 className="text-center">TwilioCreds</h3>  
                          </div>
                        </div>
                      </div>
                    </NavLink>
                    
                  </Col>
                </Row>
              </>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Admin;
