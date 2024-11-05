import { FaRegUser } from "react-icons/fa";
import { BsBuildingsFill } from "react-icons/bs";
import { SiManageiq } from "react-icons/si";
import { HiMiniUsers } from "react-icons/hi2";

// aside 
import { FaWindows } from "react-icons/fa6";
import { FaHandsHelping } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi"
import { PiWebhooksLogoBold } from "react-icons/pi";
import { BsBuildingFillGear } from "react-icons/bs";
import { GrIntegration } from "react-icons/gr";
export const admin_dashboard_page = [
    {
        path: '/admin/user/dashboard',
        icon: <FaRegUser />,
        title: 'Users'
    },
    {
        path: '/admin/company/dashboard',
        icon: <BsBuildingsFill />,
        title: 'Companies'
    },
    {
        path: '/admin/facility/dashboard',
        icon: <SiManageiq />,
        title: 'Facilities'
    },
    {
        path: '/admin/caregiver/dashboard',
        icon: <HiMiniUsers />,
        title: 'Caregivers'
    },
    {
        path: '/admin/agency/dashboard',
        icon: <HiMiniUsers />,
        title: 'Agencies'
    },
    {
        path: '/admin/role/dashboard',
        icon: <HiMiniUsers />,
        title: 'Roles'
    },
    {
        icon: <PiWebhooksLogoBold />,
        path: '/admin/agencywebhook/dashboard',
        title: "Webhook"
    },
    {
        icon: <BsBuildingFillGear />,
        path: '/admin/facilitywebhook/dashboard',
        title: "Agency DB Id"
    },
    {
        icon: <BsBuildingFillGear />,
        path: '/admin/integration-facility-mapping',
        title: "Facility Mapping"
    },
]

export const admin_dashboard_aside = [
    // {
    //     icon: <FaWindows />,
    //     path: '/admin',
    //     title: 'Dashboard'
    // },
    {
        icon: <FiUserPlus />,
        path: '/admin/create-User',
        title: "Create User"
    },
    {
        icon: <BsBuildingsFill />,
        path: '/admin/create-company',
        title: "Create Company"
    },
    {
        icon: <SiManageiq />,
        path: '/admin/create-facility',
        title: "Create Facility"
    },
    {
        icon: <HiMiniUsers />,
        path: '/admin/create-caregiver',
        title: "Create Caregiver"
    },
    {
        icon: <FaHandsHelping />,
        path: '/admin/create-agency',
        title: "Create Agency"
    },
    {
        icon: <MdCategory />,
        path: '/admin/create-role',
        title: "Create Role"
    },
    {
        icon: <PiWebhooksLogoBold />,
        path: '/admin/create-agencywebhook',
        title: "Create Agency Webhook"
    },
    {
        icon: <BsBuildingFillGear />,
        path: '/admin/create-facilitywebhook',
        title: "Create Facility-Agency Mapping"
    },
    {
        icon: <GrIntegration />,
        path: '/admin/integration-facility-mapping/create',
        title: "Facility Mapping"
    },
]