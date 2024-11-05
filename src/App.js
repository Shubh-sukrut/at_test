import logo from "./logo.svg";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import "./App.css";
import Login from "./pages/Login";
// import Navbar from "./pages/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { get_facility, get_single_user } from "./redux/slice/login";
import Private_route from "./Private_route";
// import ChatPage from "./pages/ChatPage";
// import ChatBody from "./pages/ChatBody";
// import Main_board from "./pages/Main_board";
// import Members_section from "./pages/Members_section";
// import Sidebar from "./pages/Sidebar";
// import ContactTexting from "./pages/ContactTexting";
import MassTexting from "./pages/MassTexting";
import EnterPage from "./pages/EnterPage";

// import { io } from "socket.io-client"
import { baseurl } from "./apis";
// import { socketAction } from "./redux/slice/socket_slice";
// import { fetch_new_message } from "./redux/slice/message_slice";
// import MsgRequest from "./pages/MsgRequest";
// import Inbox from "./pages/Inbox";
import AllPatients from "./pages/AllPatients";
import NoAuthPuch from "./pages/NoAuthPuch";
import Shift from "./pages/shift";
import Admin from "./pages/adminpage/Admin"
import CreateUser from "./pages/adminpage/CreateUser";
import CreateCompany from "./pages/adminpage/CreateCompany";
import CreateFacility from "./pages/adminpage/CreateFacility";
import Members_section from "./pages/Members_section";
import CreateCaregiver from "./pages/adminpage/CreateCaregiver";
import Userdashboard from "./pages/adminpage/Userdashboard";
import Companydashboard from "./pages/adminpage/Companydashboard";
import Facilitydashboard from "./pages/adminpage/Facilitydashboard";
import Caregiverdashboard from "./pages/adminpage/Caregiverdashboard";
import CreateAgency from "./pages/adminpage/CreateAgency";
import Agencydashboard from "./pages/adminpage/Agencydashboard";
import Roledashboard from "./pages/adminpage/Role";
import CreateRole from "./pages/adminpage/CreateRoles";
import CreateAgencyWebhook from "./pages/adminpage/CreateAgencyWebhook";
import AgencyWebhookdashboard from "./pages/adminpage/AgenncyWebhookDashboard";
import ShiftDashboard from "./pages/shift";
import CreateFacilityWebhook from "./pages/adminpage/CreateFacilityWebhook";
import FacilityWebhookdashboard from "./pages/adminpage/FacilityWebhookDashboard";
import CreateIntegrationFacilityMapping from "./pages/adminpage/IntegrationFacilityMapping/create";
import IntegrationFacilityMappingDashboard from "./pages/adminpage/IntegrationFacilityMapping/dashboard";
import SystemIntegration from "./pages/adminpage/system-integration";
import PartialKioskPunches from "./pages/partial-kiosk-punches";
import SendOtp from "./pages/SendOtp";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import Registeruser from "./pages/Registeruser";
import Mass from "./pages/Mass";
import BroadCastHistory from "./pages/BroadCastHistory";
import CreateTwilioCreds from "./pages/adminpage/CreateTwilioCreds";
import TwilioCreds from "./pages/adminpage/TwilioCreds";
import SingleBroadcast from "./pages/SingleBroadcast";

function App() {
  // const dispatch = useDispatch()
  // const { socket } = useSelector(state => state.socket)

  // const token = Cookies.get("token")
  // useEffect(() => {
  //   if (token) {
  //     dispatch(fetch_new_message({ token }))
  //     dispatch(socketAction.socket_connected(io(baseurl)))
  //   }

  // }, [token])

  // useEffect(() => {
  //   if (socket) {
  //     socket.on("msg-send", (data) => {
  //       dispatch(fetch_new_message({ token }))
  //     })
  //   }

  //   return () => {
  //     socket && socket.off("msg-send", (data) => {
  //       dispatch(fetch_new_message({ token }))
  //     })
  //   }
  // }, [socket])

  return (
    <div className="App">
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registeruser/>} />
          <Route path="/forget-password" element={<SendOtp />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path="/contact" element={<Private_route role="all" componant={<ContactTexting />} />} /> */}
          <Route path="/broadcast-history" element={<Private_route role="all" componant={<BroadCastHistory />} />} />
          <Route path="/broadcast/:broadcast_id" element={<Private_route role="all" componant={<SingleBroadcast />} />} />
          <Route path="/mass" element={<Private_route role="all" componant={<Mass />} />} />
          <Route path="/landing-page" element={<Private_route role="all" componant={<EnterPage />} />} />
          {/* <Route path="/message-request" element={<Private_route role="all" componant={<MsgRequest />} />} /> */}
          {/* <Route path="/inbox" element={<Private_route role="all" componant={<Inbox />} />} /> */}
          <Route path="/all-patient" element={<Private_route role="all" componant={<AllPatients />} />} />

          <Route path="/dashboard" element={<Private_route role="all" componant={<ShiftDashboard />} />} />
          <Route path="/partial-kiosk-punches" element={<Private_route role="all" componant={<PartialKioskPunches />} />} />
          {/* <Route path="/shift" element={<Private_route role="all" componant={<Punches />} />} /> */}
          {/* <Route path="/punches" element={<Private_route role="all" componant={<Dashboard />} />} /> */}

          <Route path="/admin" element={<Private_route role="admin" componant={<Admin />} />} />
          <Route path="/admin/twiliocreds" element={<Private_route role="admin" componant={<TwilioCreds />} />} />
          
          <Route path="/admin/create-user" element={<Private_route role="admin" componant={<CreateUser />} />} />
          <Route path="/admin/user/dashboard" element={<Private_route role="admin" componant={<Userdashboard />} />} />

          <Route path="/admin/create-company" element={<Private_route role="admin" componant={<CreateCompany />} />} />
          <Route path="/admin/create-twilio" element={<Private_route role="admin" componant={<CreateTwilioCreds />} />} />
          <Route path="/admin/company/dashboard" element={<Private_route role="admin" componant={<Companydashboard />} />} />

          <Route path="/admin/create-facility" element={<Private_route role="admin" componant={<CreateFacility />} />} />
          <Route path="/admin/facility/dashboard" element={<Private_route role="admin" componant={<Facilitydashboard />} />} />

          <Route path="/admin/create-caregiver" element={<Private_route role="admin" componant={<CreateCaregiver />} />} />
          <Route path="/admin/caregiver/dashboard" element={<Private_route role="admin" componant={<Caregiverdashboard />} />} />

          <Route path="/admin/create-Agency" element={<Private_route role="admin" componant={<CreateAgency />} />} />
          <Route path="/admin/Agency/dashboard" element={<Private_route role="admin" componant={<Agencydashboard />} />} />

          <Route path="/admin/create-role" element={<Private_route role="admin" componant={<CreateRole />} />} />
          <Route path="/admin/role/dashboard" element={<Private_route role="admin" componant={<Roledashboard />} />} />

          <Route path="/admin/create-agencywebhook" element={<Private_route role="admin" componant={<CreateAgencyWebhook />} />} />
          <Route path="/admin/agencywebhook/dashboard" element={<Private_route role="admin" componant={<AgencyWebhookdashboard />} />} />

          <Route path="/admin/create-facilitywebhook" element={<Private_route role="admin" componant={<CreateFacilityWebhook />} />} />
          <Route path="/admin/facilitywebhook/dashboard" element={<Private_route role="admin" componant={<FacilityWebhookdashboard />} />} />

          <Route path="/non-kiosk-punch/:facilityId/" element={<NoAuthPuch />} />

          {/* Integration Facility Mapping */}
          <Route path="/admin/integration-facility-mapping/create" element={<Private_route role="admin" componant={<CreateIntegrationFacilityMapping />} />} />
          <Route path="/admin/integration-facility-mapping" element={<Private_route role="admin" componant={<IntegrationFacilityMappingDashboard />} />} />
          <Route path="/admin/system-integration" element={<Private_route role="admin" componant={<SystemIntegration />} />} />
        </Routes>
      </BrowserRouter>
      {/* <Login /> */}
    </div>
  );
}

export default App;
