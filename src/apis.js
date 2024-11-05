
export function getBaseUrl() {
    const environment = process.env.REACT_APP_ENVIRONMENT || "local";
    try {
        switch (environment) {
            case 'production':
                return process.env.REACT_APP_PRODUCTION_API_URL;
            case 'staging':
                return process.env.REACT_APP_STAGING_API_URL;
            case 'local':
                return process.env.REACT_APP_LOCAL_API_URL || "http://127.0.0.1:4000/";
            default:
                throw new Error(`Invalid environment: ${environment}`);
        }
    }
    catch (err) {
        console.log(err)
    }
}
export const baseurl = getBaseUrl()

export const apis = {
    GET_TIMEZONE: 'http://worldtimeapi.org/api/timezone/',
    // Auth
    LOGIN_API: `${baseurl}api/user/login`,
    SIGNUP_API: `${baseurl}api/user/signup`,
    RESET_PASS_API: `${baseurl}api/user/reset-password`,
    UPDATE_PASS_API: `${baseurl}api/user/update-password`,
    VERIFY_OTP_API: `${baseurl}api/user/verify-otp`,
    MICROSOFT_LOGIN: `${baseurl}api/user/microsoft-login`,
    GOOGLE_LOGIN: `${baseurl}api/user/google-login`,
    FACEBOOK_LOGIN: `${baseurl}api/user/facebook-login`,
    GET_SINGLE_USER: `${baseurl}api/user/get-single-user`,
    ENABLED_MAIL_REPORT: `${baseurl}api/user/enabled_mail_report`,


    // Caregiver
    GET_CAREGIVER: `${baseurl}api/caregiver/fetch-all`,
    GET_EMPLOYEE: `${baseurl}api/caregiver/employee`,
    UPDATE_EMPLOYEE: `${baseurl}api/caregiver/update`,
    DROP_EMPLOYEE: `${baseurl}api/caregiver/delete`,
    GET_ALL_CAREGIVERS: `${baseurl}api/caregiver/`, //

    // Punch
    GET_PUNCHS: `${baseurl}api/punch/fetch-all`,
    CREATE_PUNCHS: `${baseurl}api/caregiver/punch`,
    GET_SINGLE_PUNCHS: `${baseurl}api/punch/single-fetch`,
    UPDATE_PUNCHS: `${baseurl}api/punch/update`,

    // Shift
    GET_SHIFT: `${baseurl}api/shift/fetch-all`,
    GET_SHIFTS: `${baseurl}api/shift/shifts`,
    GET_SINGLE_SHIFT: `${baseurl}api/shift/single-fetch`,
    DROP_SHIFT: `${baseurl}api/shift/shift`,
    GET_CSV_SHIFTS: `${baseurl}api/shift/csv-data-export`,

    //agency
    GET_AGENCY: `${baseurl}api/agency/fetch-all`,
    CREATE_AGENCY: `${baseurl}api/agency/create`,
    UPDATE_AGENCY: `${baseurl}api/agency/update`,
    DROP_AGENCY: `${baseurl}api/agency/delete`,

    // Get all Patients
    GET_PATIENTS_WITH_CONTACTS: `${baseurl}api/patient/fetch_all_patients_with_contacts`,
    GET_PATIENTS: `${baseurl}api/patient/fetch-all`,
    GET_PATIENTS_CONTACT: `${baseurl}api/patient/patient_contact/fetch/`,
    GET_ALL_PATIENTS_CONTACT: `${baseurl}api/patient/patient_contact/fetch-all/`,
    GET_ALL_GROUPS: `${baseurl}api/message/group-fetch-all`,
    CREATE_GROUPS: `${baseurl}api/message/group-create`,
    CREATE_MESSAGES: `${baseurl}api/message/create`,
    GET_MESSAGES: `${baseurl}api/message/fetch`,
    GET_BROADCASTS: `${baseurl}api/message/getbroadcasts`,
    CREATE_BROADCAST: `${baseurl}api/message/create-broadcast/`,


    GET_ALL_CHATS: `${baseurl}api/message/get-all-chats`,
    GET_ALL_UNKNOWN_CONTACT: `${baseurl}api/patient/get-unknown-contact`,
    FETCH_NEW_MESSAGES: `${baseurl}api/message/fetch-new-messages`,
    READ_MSG: `${baseurl}api/message/msg-read`,

    // Facilities
    GET_FACILITY: `${baseurl}api/facility/fetch-all`,
    FACILITY_CREATE: `${baseurl}api/facility/create`,
    FACILITY_UPDATE: `${baseurl}api/facility/update`,
    FACILITY_DROP: `${baseurl}api/facility/delete`,

    // No Auth Punch
    CREATE_CAREGIVER: `${baseurl}api/non/kiosk/create/caregiver`,
    GET_NON_KIOSK: `${baseurl}api/non/kiosk/get/caregiver`,
    ADD_NO_AUTH_PUNCH: `${baseurl}api/non/kiosk/create/punch`,

    // Admin 
    CREATE_USER: `${baseurl}api/user/signup`,
    CREATE_FACILITY: `${baseurl}api/facility/create`,
    GET_USER: `${baseurl}api/user/get-all-user`,
    UPDATE_USER: `${baseurl}api/user/update-user`,
    DROP_USER: `${baseurl}api/user/drop`,


    // company 
    CREATE_COMPANY: `${baseurl}api/company/create`,
    GET_COMPANY: `${baseurl}api/company/fetch-all`,
    GET_SINGLE_COMPANY: `${baseurl}api/company/single-fetch/:id`,
    UPDATE_COMPANY: `${baseurl}api/company/update`,
    DROP_COMPANY: `${baseurl}api/company/delete`,

    // roles 
    GET_ROLES: `${baseurl}api/role/fetch-all`,
    GET_ROLE: `${baseurl}api/role/single-fetch`,
    CREATE_ROLE: `${baseurl}api/role/create`,
    DROP_ROLE: `${baseurl}api/role/delete`,
    UPDATE_ROLE: `${baseurl}api/role/update`,

    // permissions  
    GET_PERMISSION_SET: `${baseurl}api/permission/permission-set-fetch-all`,

    // AgencyWebhook
    GET_AGENCYWEBHOOK: `${baseurl}api/webhook/fetch-all`,
    CREATE_AGENCYWEBHOOK: `${baseurl}api/webhook/create`,
    UPDATE_AGENCYWEBHOOK: `${baseurl}api/webhook/update`,
    DELETE_AGENCYWEBHOOK: `${baseurl}api/webhook/delete`,

    // FacilityWebhook
    GET_FACILITYWEBHOOK: `${baseurl}api/facility-webhook/fetch-all`,
    CREATE_FACILITYWEBHOOK: `${baseurl}api/facility-webhook/create`,
    UPDATE_FACILITYWEBHOOK: `${baseurl}api/facility-webhook/update`,
    DELETE_FACILITYWEBHOOK: `${baseurl}api/facility-webhook/delete`,

    // portal 
    PORTAL_ACCESS: `${baseurl}api/portal/portal_access`,
    SUBSCRIPTABLE_TEXT: `${baseurl}api/portal/is_subscriptable_text`,

    // Integration-facility-mapping
    INTEGRATION_FACILITY_MAPPING: `${baseurl}api/Integration-facility-mapping`,
    SYSTEM_INTEGRATION: `${baseurl}api/Shift/exports`,

    //Twilio 
    TWILIO: `${baseurl}api/twilio`,
    GET_TWILIO: `${baseurl}api/twilio`,
    UPDATE_TWILIO: `${baseurl}api/twilio`,
    PARTIAL_KIOSK_PUNCHES: `${baseurl}api/Punch/kiosk/failed/punches`
}