// import HR from "../assets/icons/sidebar/hr.svg";
// import EMR from "../assets/icons/sidebar/emr.svg";
// import Team from "../assets/icons/sidebar/team.svg";
// import Finance from "../assets/icons/sidebar/finance.svg";
// import Reports from "../assets/icons/sidebar/reports.svg";
// import Accounts from "../assets/icons/sidebar/accounts.svg";
// import Requests from "../assets/icons/sidebar/requests.svg";
import Bookings from "../assets/icons/sidebar/bookings.svg";
import AppPanel from "../assets/icons/sidebar/app_panel.svg";
// import Customers from "../assets/icons/sidebar/customers.svg";
// import Dashboard from "../assets/icons/sidebar/dashboard.svg";
// import Marketing from "../assets/icons/sidebar/marketing.svg";
import ServiceList from "../assets/icons/sidebar/service_list.svg";
// import WebsitePanel from "../assets/icons/sidebar/website_panel.svg";
// import CustomerRatings from "../assets/icons/sidebar/customer_ratings.svg";

export const emirates = [
  {
    id: 1,
    name: "Dubai",
  },
  {
    id: 2,
    name: "Abu Dhabi",
  },
  {
    id: 3,
    name: "Sharjah",
  },
  {
    id: 4,
    name: "Ajman",
  },
  {
    id: 5,
    name: "Umm Al Quwain",
  },
  {
    id: 6,
    name: "Ras Al Khaimah",
  },
  {
    id: 7,
    name: "Fujairah",
  },
  {
    id: 8,
    name: "Al Ain",
  },
];

export const bookingStatuses = [
  {
    id: 1,
    name: "All",
    color: "#858688",
  },
  {
    id: 2,
    name: "Assigned",
    color: "#009AE2",
  },
  {
    id: 3,
    name: "Confirmed",
    color: "#414EB2",
  },
  {
    id: 4,
    name: "Dispatched",
    color: "#7A85C8",
  },
  {
    id: 5,
    name: "Arrived",
    color: "#008146",
  },
  {
    id: 6,
    name: "Un Assigned",
    color: "#EB7C76",
  },
  {
    id: 7,
    name: "In Progress",
    color: "#F8C13F",
  },
  {
    id: 8,
    name: "Completed",
    color: "#0BB77C",
  },
  {
    id: 9,
    name: "Cancelled",
    color: "#DB0017",
  },
];

export const paymentStatuses = [
  {
    id: 1,
    name: "All",
    color: "#858688",
  },
  {
    id: 2,
    name: "Pending",
    color: "#FB8627",
  },
  {
    id: 3,
    name: "Completed",
    color: "#0BB77C",
  },
];

export const sources = [
  {
    id: 1,
    name: "Direct",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Website",
      },
      {
        id: 3,
        name: "Mobile App",
      },
      {
        id: 4,
        name: "WhatsApp (MCC)",
      },
      {
        id: 5,
        name: "WhatsApp (Toll Free)",
      },
      {
        id: 6,
        name: "WhatsApp (Other)",
      },
      {
        id: 7,
        name: "Phone Call (Toll Free)",
      },
      {
        id: 8,
        name: "Phone Call (MCC)",
      },
      {
        id: 9,
        name: "Phone Call (Other)",
      },
    ],
  },
  {
    id: 2,
    name: "Aggregator",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "JustLife",
      },
      {
        id: 3,
        name: "Rizek",
      },
      {
        id: 4,
        name: "Service Market",
      },
      {
        id: 5,
        name: "Metadoc",
      },
    ],
  },
];

export const emiratesAreas = [
  {
    id: 1,
    name: "Dubai",
    list: [
      { id: 1, name: "All" },
      { id: 2, name: "Al Qusais" },
      { id: 3, name: "Palm Jumeirah" },
      { id: 4, name: "Barsha" },
    ],
  },
  {
    id: 2,
    name: "Abu Dhabi",
    list: [
      { id: 1, name: "All" },
      { id: 2, name: "Khalifa City" },
      { id: 3, name: "Al Reem Island" },
      { id: 4, name: "Yas Island" },
    ],
  },
  {
    id: 3,
    name: "Sharjah",
    list: [
      { id: 1, name: "All" },
      { id: 2, name: "Al Majaz" },
      { id: 3, name: "Al Nahda" },
      { id: 4, name: "Al Qasimia" },
    ],
  },
  {
    id: 4,
    name: "Ajman",
    list: [
      { id: 1, name: "All" },
      { id: 2, name: "Al Nuaimiya" },
      { id: 3, name: "Al Rashidiya" },
      { id: 4, name: "Al Jurf" },
    ],
  },
  {
    id: 5,
    name: "Umm Al Quwain",
    list: [
      { id: 1, name: "All" },
      { id: 2, name: "Al Salama" },
      { id: 3, name: "Al Raas" },
      { id: 4, name: "Al Haditha" },
    ],
  },
  {
    id: 6,
    name: "Ras Al Khaimah",
    list: [
      { id: 1, name: "All" },
      { id: 2, name: "Al Nakheel" },
      { id: 3, name: "Al Rams" },
      { id: 4, name: "Al Dhait" },
    ],
  },
  {
    id: 7,
    name: "Fujairah",
    list: [
      { id: 1, name: "All" },
      { id: 2, name: "Al Faseel" },
      { id: 3, name: "Dibba" },
      { id: 4, name: "Al Hilal City" },
    ],
  },
  {
    id: 8,
    name: "Al Ain",
    list: [
      { id: 1, name: "All" },
      { id: 2, name: "Al Jimi" },
      { id: 3, name: "Al Mutarad" },
      { id: 4, name: "Al Ain Oasis" },
    ],
  },
];

export const providers = [
  {
    id: 1,
    name: "City Doctor",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dubai",
      },
      {
        id: 3,
        name: "Sharjah",
      },
      {
        id: 4,
        name: "Abu Dhabi",
      },
    ],
  },
  {
    id: 2,
    name: "Mediclinic",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dubai",
      },
      {
        id: 3,
        name: "Sharjah",
      },
      {
        id: 4,
        name: "Abu Dhabi",
      },
    ],
  },
  {
    id: 3,
    name: "Al Das Clinic",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dubai",
      },
      {
        id: 3,
        name: "Sharjah",
      },
      {
        id: 4,
        name: "Abu Dhabi",
      },
    ],
  },
  {
    id: 4,
    name: "Health Bay MC",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dubai",
      },
      {
        id: 3,
        name: "Sharjah",
      },
      {
        id: 4,
        name: "Abu Dhabi",
      },
    ],
  },
  {
    id: 5,
    name: "Clinica Joelle",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dubai",
      },
      {
        id: 3,
        name: "Sharjah",
      },
      {
        id: 4,
        name: "Abu Dhabi",
      },
    ],
  },
];

export const professionals = [
  {
    id: 1,
    name: "Doctors",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dr. Ahmed",
      },
      {
        id: 3,
        name: "Dr. Abdella",
      },
      {
        id: 4,
        name: "Dr. Ali",
      },
    ],
  },
  {
    id: 2,
    name: "Physio",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dr. Ahmed",
      },
      {
        id: 3,
        name: "Dr. Abdella",
      },
      {
        id: 4,
        name: "Dr. Ali",
      },
    ],
  },
  {
    id: 3,
    name: "Nurses",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dr. Ahmed",
      },
      {
        id: 3,
        name: "Dr. Abdella",
      },
      {
        id: 4,
        name: "Dr. Ali",
      },
    ],
  },
  {
    id: 4,
    name: "Drivers",
    list: [
      {
        id: 1,
        name: "All",
      },
      {
        id: 2,
        name: "Dr. Ahmed",
      },
      {
        id: 3,
        name: "Dr. Abdella",
      },
      {
        id: 4,
        name: "Dr. Ali",
      },
    ],
  },
];

export const sidebarItems = [
  // {
  //   id: 1,
  //   name: "Dashboard",
  //   icon: Dashboard,
  //   link: "/",
  // },
  // {
  //   id: 2,
  //   name: "Requests",
  //   icon: Requests,
  //   link: "/requests",
  // },
  {
    id: 3,
    name: "Bookings",
    icon: Bookings,
    link: "/bookings",
  },
  // {
  //   id: 4,
  //   name: "Customers",
  //   icon: Customers,
  //   link: "/customers",
  // },
  {
    id: 5,
    name: "Service List",
    icon: ServiceList,
    link: "/services",
  },
  // {
  //   id: 6,
  //   name: "Customer Ratings",
  //   icon: CustomerRatings,
  //   link: "/customer-ratings",
  // },
  // {
  //   id: 7,
  //   name: "Team Members",
  //   icon: Team,
  //   link: "/team-members",
  // },
  // {
  //   id: 8,
  //   name: "Reports",
  //   icon: Reports,
  //   link: "/reports",
  // },
  // {
  //   id: 9,
  //   name: "EMR",
  //   icon: EMR,
  //   link: "/emr",
  // },
  // {
  //   id: 10,
  //   name: "Human Resources",
  //   icon: HR,
  //   link: "/hr",
  // },
  // {
  //   id: 11,
  //   name: "Finance",
  //   icon: Finance,
  //   link: "/finance",
  // },
  // {
  //   id: 12,
  //   name: "Marketing",
  //   icon: Marketing,
  //   link: "/marketing",
  // },
  // {
  //   id: 13,
  //   name: "Accounts",
  //   icon: Accounts,
  //   link: "/accounts",
  // },
  {
    id: 14,
    name: "App Panel",
    icon: AppPanel,
    link: "#",
    subItems: [
      {
        id: 1,
        name: "Services List",
        icon: ServiceList,
        link: "/app/services",
      },
    ],
  },
  // {
  //   id: 15,
  //   name: "Website Panel",
  //   icon: WebsitePanel,
  //   link: "/website-panel",
  // },
];

export const options = [
  {
    id: 1,
    name: "Option 1",
  },
  {
    id: 2,
    name: "Option 2",
  },
  {
    id: 3,
    name: "Option 3",
  },
  {
    id: 4,
    name: "Option 4",
  },
  {
    id: 5,
    name: "Option 5",
  },
  {
    id: 6,
    name: "Option 6",
  },
  {
    id: 7,
    name: "Option 7",
  },
  {
    id: 8,
    name: "Option 8",
  },
  {
    id: 9,
    name: "Option 9",
  },
  {
    id: 10,
    name: "Option 10",
  },
];

export const timeSlots = [
  { id: "08:00-08:30", name: "08:00 - 08:30" },
  { id: "09:00-09:30", name: "09:00 - 09:30" },
  { id: "10:00-10:30", name: "10:00 - 10:30" },
  { id: "11:00-11:30", name: "11:00 - 11:30" },
  { id: "12:00-12:30", name: "12:00 - 12:30" },
  { id: "13:00-13:30", name: "13:00 - 13:30" },
  { id: "14:00-14:30", name: "14:00 - 14:30" },
  { id: "15:00-15:30", name: "15:00 - 15:30" },
];

export const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

export const genderOptions = [
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Other" },
];

export const relationshipOptions = [
  { id: "Father", name: "Father" },
  { id: "Mother", name: "Mother" },
  { id: "Brother", name: "Brother" },
  { id: "Daughter", name: "Daughter" },
  { id: "Sister", name: "Sister" },
  { id: "Wife", name: "Wife" },
  { id: "Husband", name: "Husband" },
  { id: "Son", name: "Son" },
];

export const serviceColumns = [
  {
    id: 2,
    name: "Service Code",
    key: "code",
  },
  {
    id: 3,
    name: "Category Name",
    key: "category_name",
  },
  {
    id: 5,
    name: "Service Name",
    key: "service_name",
  },
  {
    id: 6,
    name: "Provider Name",
    key: "providor",
  },
  {
    id: 9,
    name: "Selling Price",
    key: "price_with_vat",
  },
];

export const customerColumns = [
  {
    id: 2,
    name: "MRN",
    key: "mrn",
  },
  {
    id: 2,
    name: "Name",
    key: "full_name",
  },
  {
    id: 3,
    name: "Phone",
    key: "phone",
  },
  {
    id: 4,
    name: "Gender",
    key: "gender",
  },
  {
    id: 5,
    name: "Nationality",
    key: "nationality",
  },
  {
    id: 6,
    name: "Source",
    key: "source_name",
  },
  {
    id: 7,
    name: "Company",
    key: "company",
  },
  {
    id: 8,
    name: "Total",
    key: "total",
  },
  {
    id: 9,
    name: "Value",
    key: "value",
  },
];
export const categoriesColumns = [
  {
    id: 2,
    name: "Name",
    key: "category_name",
  },
  {
    id: 2,
    name: "Sub Category",
    key: "sub_category",
  },
  {
    id: 3,
    name: "Color",
    key: "color",
  },
  {
    id: 4,
    name: "Code",
    key: "code",
  },
  {
    id: 5,
    name: "Company Name",
    key: "company_name",
  },
  {
    id: 6,
    name: "Business",
    key: "business",
  },
  {
    id: 7,
    name: "Description",
    key: "description",
  },
];

export const businessColumns = [
  {
    id: 1,
    name: "Code",
    key: "code",
  },
  {
    id: 2,
    name: "Name",
    key: "name",
  },
  {
    id: 3,
    name: "Description",
    key: "description",
  },
  {
    id: 4,
    name: "Total Companies",
    key: "total_companies",
  },
];

export const companyColumns = [
  {
    id: 1,
    name: "Name",
    key: "name",
  },
  {
    id: 2,
    name: "Email",
    key: "email",
  },
  {
    id: 3,
    name: "Phone",
    key: "phone",
  },
  {
    id: 4,
    name: "Code",
    key: "code",
  },
  {
    id: 6,
    name: "Total Branches",
    key: "total_branches",
  },
];

export const branchColumns = [
  {
    id: 1,
    name: "Name",
    key: "name",
  },
  {
    id: 2,
    name: "Company",
    key: "company",
  },
];

export const companyTypes = [
  { id: "0", name: "Mainland" },
  { id: "1", name: "Freezone" },
];