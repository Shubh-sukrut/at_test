import Integration_Facility_Mapping_Slice from "./slice/Integration-Facility-Mapping";
import agencySlice from "./slice/agency";
import caregiverSlice from "./slice/caregivers/index";
import employeesSlice from "./slice/caregiver";
import shiftSlice from "./slice/caregiver_with_shift";
import groupsSlice from "./slice/chatgroups";
import company from "./slice/createcompany";
import employee from "./slice/employee";
import facilities from "./slice/facility";
import facilitywebhookSlice from "./slice/facility_webhook";
import loginreducer from "./slice/login";
import messageSlice from "./slice/message_slice";
import noAuthInfoSlice from "./slice/noAuthPunch";
import partial_kiosk_punches_slice from "./slice/partial-kiosk-punches";
import patientSlice from "./slice/patients";
import permissionsSetSlice from "./slice/permissionSet";
import profileSlice from "./slice/profile";
import rolesSlice from "./slice/roles";
import socketSlice from "./slice/socket_slice";
import user from "./slice/user";
import agencywebhookSlice from "./slice/webhook";
import csvSlice from "./slice/exportcsvdata/exportshifts";
import registraionreducer from "./slice/registration";
import sendotpreducer from "./slice/sendotp";
import verifyotpreducer from "./slice/verifyforgtpasswordotp";
import resetpasswordreducer from "./slice/resetpasswordslice";
import twilio from './slice/createtwilio'

const { configureStore } = require("@reduxjs/toolkit");

const store = configureStore({
  reducer: {
    login: loginreducer,
    registraion: registraionreducer,
    sendotp: sendotpreducer,
    verifyotp: verifyotpreducer,
    resetpassword: resetpasswordreducer,
    profile: profileSlice,
    employee: employeesSlice,
    agency: agencySlice,
    patient: patientSlice,
    groups: groupsSlice,
    message: messageSlice,
    socket: socketSlice,
    shift: shiftSlice,
    employees: employee,
    facility: facilities,
    company: company,
    user: user,
    roles: rolesSlice,
    permissionsSet: permissionsSetSlice,
    agencywebhook: agencywebhookSlice,
    facilityWebHook: facilitywebhookSlice,
    noAuthInfo: noAuthInfoSlice,
    Integration_Facility_Mapping: Integration_Facility_Mapping_Slice,
    partial_kiosk_punches: partial_kiosk_punches_slice,
    all_caregivers: caregiverSlice,
    all_csv_shifts: csvSlice,
    twilio: twilio
  },
});

export default store;
