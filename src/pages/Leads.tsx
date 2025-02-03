import { useMemo, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

import Combobox from "../components/ui/Combobox";
import { useFetchCompaniesQuery } from "../store/services/company";
import { useFetchServicesQuery } from "../store/services/service";
import { useFetchAllCategoriesQuery } from "../store/services/categories";
import { useFetchBusinessesQuery } from "../store/services/service";
import { useFetchBranchesQuery } from "../store/services/filters";
import Table from "../components/ui/Table";
import { leadsHeaders } from "../utils/constants";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoAdd, IoEyeOutline, IoPersonAddOutline } from "react-icons/io5";
import { cn } from "../utils/helpers";
import WhatsappColored from "../assets/icons/whatsapp-colored.svg";
import GoogleColored from "../assets/icons/colored-google.svg";
import CustomButton from "../components/ui/CustomButton";
import LeadsIcon from "../assets/icons/sidebar/leads.svg";
import LeadsIconBlack from "../assets/icons/sidebar/leads-black.svg";
import { IoIosArrowDown } from "react-icons/io";
import { GoDownload } from "react-icons/go";
import AddLeadModal from "../components/leads/AddLeadModal";
import { useNavigate } from "react-router-dom";
import LeadAssignModal from "../components/leads/LeadAssignModal";
import LeadDeleteModal from "../components/leads/LeadDeleteModal";
import CustomDatePicker from "../components/ui/CustomDatePicker";
import { MdOutlineCalendarMonth } from "react-icons/md";
import dayjs from "dayjs";

const dummyData = [
  {
    ref: "54621",
    client_name: "Tareq Ibrahim",
    email: "myemail@example.com",
    country: "Pakistan",
    source: "Google",
    priority: "High",
    agent: "Gamal Mustafa",
    stage: "Assigned",
    recieved_at: "12:15 PM",
    assigned_at: "01:15 PM",
    followup: "12:15 PM",
  },
  {
    ref: "54621",
    client_name: "Tareq Ibrahim",
    email: "myemail@example.com",
    country: "Pakistan",
    source: "WhatsApp",
    priority: "Medium",
    agent: "Gamal Mustafa",
    stage: "Assigned",
    recieved_at: "12:15 PM",
    assigned_at: "01:15 PM",
    followup: "12:15 PM",
  },
  {
    ref: "54621",
    client_name: "Tareq Ibrahim",
    email: "myemail@example.com",
    country: "Pakistan",
    source: "Google",
    priority: "High",
    agent: "Gamal Mustafa",
    stage: "Assigned",
    recieved_at: "12:15 PM",
    assigned_at: "01:15 PM",
    followup: "12:15 PM",
  },
  {
    ref: "54621",
    client_name: "Tareq Ibrahim",
    email: "myemail@example.com",
    country: "Pakistan",
    source: "WhatsApp",
    priority: "Medium",
    agent: "Gamal Mustafa",
    stage: "Assigned",
    recieved_at: "12:15 PM",
    assigned_at: "01:15 PM",
    followup: "12:15 PM",
  },
  {
    ref: "54621",
    client_name: "Tareq Ibrahim",
    email: "myemail@example.com",
    country: "Pakistan",
    source: "Google",
    priority: "High",
    agent: "Gamal Mustafa",
    stage: "Assigned",
    recieved_at: "12:15 PM",
    assigned_at: "01:15 PM",
    followup: "12:15 PM",
  },
  {
    ref: "54621",
    client_name: "Tareq Ibrahim",
    email: "myemail@example.com",
    country: "Pakistan",
    source: "WhatsApp",
    priority: "Medium",
    agent: "Gamal Mustafa",
    stage: "Assigned",
    recieved_at: "12:15 PM",
    assigned_at: "01:15 PM",
    followup: "12:15 PM",
  }
]

const leadsData = [
  {
    name: 'Total Leads',
    number: '45',
    color: '#FFE59E'
  },
  {
    name: 'Active Leads',
    number: '23',
    color: '#50C878'
  },
  {
    name: 'Converted Leads',
    number: '07',
    color: '#C8DEFF'
  },
  {
    name: 'Unsuccessful Leads',
    number: '30',
    color: '#FF9898'
  },
]
const LeadsList = () => {
  const [search, setSearch] = useState("");
  const filterArray:FilterType[]=[]
  const [isView, setIsView] = useState(false)
  const [openAddLeadModal, setOpenAddLeadModal] = useState(false)
  const [openLeadAssignModal, setOpenLeadAssignModal] = useState(false)
  const [openLeadDeleteModal, setOpenLeadDeleteModal] = useState(false)
  const [date, setDate] = useState<string | Date>(new Date())

  const navigate = useNavigate();

  const lastFilter = filterArray[filterArray.length - 1]?.name;

  const shouldFetchBusinesses = filterArray.length === 0;
  const shouldFetchCompanies = lastFilter === "business";
  const shouldFetchBranches = lastFilter === "company";
  const shouldFetchCategories = lastFilter === "branch";
  const shouldFetchServices = lastFilter === "category";

  const businessQueryParams = shouldFetchBusinesses ? filterArray : null;
  const companyQueryParams = shouldFetchCompanies ? filterArray : null;
  const branchQueryParams = shouldFetchBranches ? filterArray : null;
  const categoryQueryParams = shouldFetchCategories ? filterArray : null;
  const serviceQueryParams = shouldFetchServices ? filterArray : null;

  const {
    data: servicesData,
  } = useFetchServicesQuery(serviceQueryParams, {
    skip: !shouldFetchServices,
    refetchOnMountOrArgChange: true
  });

  const { data: branches } = useFetchBranchesQuery(
    branchQueryParams,
    {
      skip: !shouldFetchBranches,
      refetchOnMountOrArgChange: true
    }
  );
  const {
    data: categoriesData
  } = useFetchAllCategoriesQuery(categoryQueryParams, {
    skip: !shouldFetchCategories,
    refetchOnMountOrArgChange: true
  });

  const { data: companiesData } =
    useFetchCompaniesQuery(companyQueryParams, {
      skip: !shouldFetchCompanies,
      refetchOnMountOrArgChange: true
    });
  const {
    data: businessData,
  } = useFetchBusinessesQuery(businessQueryParams, {
    skip: !shouldFetchBusinesses,
    refetchOnMountOrArgChange: true
  });

  const handleAddModal = () => {
    setIsView(false)
    setOpenAddLeadModal(true)
  };

  const handleEdit = (row: any, isView?: boolean) => {
    console.log(row)
    setOpenAddLeadModal(true)
    if (isView) {
      setIsView(true)
    }
  };

  const renderCustomColumn = (key: string, value: any) => {
    if (key === "priority") {
      return (
        <span className={`px-2 py-1 block text-center rounded-md text-white text-xs ${value === "High" ? "bg-red100" : value === "Medium" ? "bg-[#FFA63E]" : "bg-green100"}`}>
          {value}
        </span>
      );
    }
    else if (key === "source") {
      return (
        <span className={`flex -ml-2 items-center gap-1 text-xs ${value === "Google" && "text-blue100"}`}>
          <img
            src={value === "Google" ? GoogleColored : WhatsappColored}
            alt="icon"
            className={cn("size-[16px] p-0.5 rounded-md", {
              "bg-grey150": value === "Google"
            })}
          />{value}
        </span>
      );
    }
    return null;
  };

  const filteredData = useMemo(() => {
    return dummyData
    // const lowercasedSearch = search.toLowerCase();
    // const lastItem = filterArray[filterArray.length - 1]?.name;

    // if (filterArray?.length === 0) {
    //   return businessData?.filter(
    //     (business) =>
    //       business.name.toLowerCase().includes(lowercasedSearch) ||
    //       business.code.toLowerCase().includes(lowercasedSearch)
    //   );
    // }
    // switch (lastItem) {
    //   case "business":
    //     return companiesData?.filter(item => item.name.toLowerCase().includes(lowercasedSearch));
    //   case "company":
    //     return branches?.filter(item => item.name.toLowerCase().includes(lowercasedSearch));
    //   case "branch":
    //     return categoriesData?.filter(item => item.category_name.toLowerCase().includes(lowercasedSearch));
    //   case "category":
    //     return servicesData?.filter(item => item.service_name.toLowerCase().includes(lowercasedSearch));
    //   default:
    //     return [];
    // }
  }, [
    search,
    servicesData,
    categoriesData,
    companiesData,
    businessData,
    branches,
  ]);

  const handleAssignModal = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation()
    setOpenLeadAssignModal(true)
  }

  const handleDeleteModal = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation()
    setOpenLeadDeleteModal(true)
  }

  const handleViewDetail = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation()
    navigate(`/lead/details`)
  }
  const renderActions = (row: any, rowIndex?: number) => (


    <div className="flex gap-2 justify-end mr-2">

      <IoEyeOutline
        onClick={handleViewDetail}
        className={cn("col-span-1 h-6 w-6 cursor-pointer rounded-md bg-grey150 p-1 text-[#9FA2AA]", {
          "bg-white": rowIndex && rowIndex % 2 === 0
        })}
      />
      <FiEdit
        onClick={()=>handleEdit(row)}
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-green100 p-1 text-white"
      />
      <RiDeleteBin6Line
        onClick={handleDeleteModal}
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-red-500 p-1 text-white"
      />
      <IoPersonAddOutline

        onClick={handleAssignModal}
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-[#009AE2] p-1 text-white"
      />
    </div>
  );

  const handleSetDate = (date: string | Date) => {
    setDate(date)
  }
  return (
    <>
      <div className="gap-2 xl:gap-3 mb-2 grid grid-cols-4">

        {leadsData?.map((item, index) => (
          <div key={index} className="flex  items-center gap-4 bg-white rounded-2xl px-3 xl:px-4 py-3 border border-[#E3E3E3]">
            <div className={`bg-[${item.color}] rounded-full p-2 xl:p-4 flex items-center justify-center`}>
              <img src={index % 2 === 0 ? LeadsIconBlack : LeadsIcon} alt="leads" className="size-8 xl:size-10" />
            </div>
            <div>
              <p className="font-bold text-xl xl:text-2xl text-black">{item?.number}</p>
              <p className="text-xs xl:text-sm">{item?.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex w-full gap-3 min-h-screen">
        <div className="flex h-full w-full flex-col items-start justify-start">
          <div className={`bg-white px-3 py-2 gap-2 2xl:gap-4 rounded-[14px] grid grid-cols-6 xl:grid-cols-5 2xl:grid-cols-12 w-full mb-2`}>
            <div className={`col-span-2 2xl:col-span-3 relative flex h-full w-full items-center justify-center gap-2.5 rounded-lg bg-grey150 px-3.5 text-gray-500`}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Client Name / Mobile No."
                className="w-full text-xs placeholder:text-gray-500 placeholder:text-[10px] placeholder:italic rounded-lg bg-grey150 px-6"
              />
              <HiMagnifyingGlass className="size-5 absolute left-3" />
            </div>
            <Combobox
              value={null}
              options={[{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }]}
              handleSelect={() => { }}
              placeholder="All Source"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-2 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <Combobox
              value={null}
              options={[{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }]}
              handleSelect={() => { }}
              placeholder="All Channel"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-2 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <Combobox
              value={null}
              options={[{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }]}
              handleSelect={() => { }}
              placeholder="Country"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-2 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <Combobox
              value={null}
              options={[{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }]}
              handleSelect={() => { }}
              placeholder="All Stages"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-2 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <Combobox
              value={null}
              options={[{ id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' }]}
              handleSelect={() => { }}
              placeholder="All Agents"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-2 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <CustomButton
              name="Import"
              handleClick={() => { }}
              style="bg-grey150 text-sm text-grey200 h-full px-3 rounded-[10px]"
              icon={<div><GoDownload className="w-6 h-6 text-grey250 font-bold" /></div>}
            />  
            
            <CustomDatePicker
              date={date}
              setDate={handleSetDate}
              toggleClassName="top-[44px]"
              toggleButton={
                <CustomButton
                  name={dayjs(date).format("DD MMM YYYY")}
                  handleClick={() => { }}
                  style="bg-grey150 text-sm text-grey200 h-full px-3 rounded-[10px] w-full"
                  icon={<div><MdOutlineCalendarMonth className="w-6 h-6 text-grey250 font-bold" /></div>}

                />

              }
            />
            <div className="2xl:col-span-2 2xl:flex 2xl:justify-end w-full">
              <CustomButton
                name="Create"
                handleClick={handleAddModal}
                style="bg-primary text-sm font-semibold text-white h-full px-3 rounded-[10px] xl:w-full 2xl:w-auto"
                icon={<div><IoAdd className="w-6 h-6 text-[#FFFFFF]" /></div>}
              />
            </div>
          </div>
          <AddLeadModal
            selectedLead={null}
            open={openAddLeadModal}
            setOpen={setOpenAddLeadModal}
            refetch={()=>{}}
            isView={isView}
            setIsView={setIsView}
          />
          <LeadAssignModal
            selectedLead={null}
            open={openLeadAssignModal}
            setOpen={setOpenLeadAssignModal}
            refetch={()=>{}}
            // isView={isView}
            // setIsView={setIsView}
          />
          <LeadDeleteModal
            open={openLeadDeleteModal}
            setOpen={setOpenLeadDeleteModal}
          />

          <div className="w-full xl:h-[calc(100vh-350px)]">
            <Table
              headers={leadsHeaders}
              rows={filteredData || []}
              renderActions={renderActions}
              handleRowClick={(row) => handleEdit(row, true)}
              renderCustomColumn={renderCustomColumn}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadsList;
