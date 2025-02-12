import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

import Combobox from "../components/ui/Combobox";
import { leadsHeaders } from "../utils/constants";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoAdd, IoEyeOutline, IoPersonAddOutline } from "react-icons/io5";
import { cn } from "../utils/helpers";
import CustomButton from "../components/ui/CustomButton";
import LeadsIcon from "../assets/icons/sidebar/leads.svg";
import LeadsIconBlack from "../assets/icons/sidebar/leads-black.svg";
import { IoIosArrowDown } from "react-icons/io";
import { GoDownload } from "react-icons/go";
import AddLeadModal from "../components/leads/AddLeadModal";
import { useNavigate } from "react-router-dom";
import LeadAssignModal from "../components/leads/LeadAssignModal";
import LeadDeleteModal from "../components/leads/LeadDeleteModal";
import { useDeleteLeadMutation, useFetchLeadChannelsQuery, useFetchLeadSourcesQuery, useFetchLeadsQuery, useFetchLeadStagesQuery, useFetchUsersQuery } from "../store/services/leads";
import dayjs from "dayjs";
import { toast } from "sonner";
import CustomToast from "../components/ui/CustomToast";
import { useFetchNationalityQuery } from "../store/services/booking";
import ServerPaginatedTable from "../components/ui/ServerPaginatedTable";
import DateRangePickerComponent from "../components/ui/DateRangeSelector";
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
  const [isView, setIsView] = useState(false)
  const [openAddLeadModal, setOpenAddLeadModal] = useState(false)
  const [openLeadAssignModal, setOpenLeadAssignModal] = useState(false)
  const [openLeadDeleteModal, setOpenLeadDeleteModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 1,
    name: "5",
  });
  const [date, setDate] = useState([
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const navigate = useNavigate();
  const [filters, setFilters] = useState<{
    source: ListOptionProps,
    channel: ListOptionProps,
    nationality: ListOptionProps,
    stage: ListOptionProps,
    agent: ListOptionProps
  }>({
    source: { id: '', name: '' },
    channel: { id: '', name: '' },
    nationality: { id: '', name: '' },
    stage: { id: '', name: '' },
    agent: { id: '', name: '' }
  })

  const { data: nationalities } = useFetchNationalityQuery({});

  const { data: stagesData } = useFetchLeadStagesQuery({})

  const { data: users } = useFetchUsersQuery({})

  const { data: sources } = useFetchLeadSourcesQuery(
    {},
    {
      skip: !open,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: channels } = useFetchLeadChannelsQuery({}, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: leads,
    refetch: refetchLeads
  } = useFetchLeadsQuery({
    start_date: dayjs(date[0].startDate).format("YYYY-MM-DD"),
    end_date: dayjs(date[0].endDate).format("YYYY-MM-DD"),
    limit: Number(limit?.name),
    offset: page,
    source: filters.source.id,
    channel: filters.channel.id,
    nationality: filters.nationality.id,
    stage: filters.stage.id,
    agent: filters.agent.id,
    search: search
  });

  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();

  const handleAddModal = () => {
    setSelectedLead(null)
    setIsView(false)
    setOpenAddLeadModal(true)
  };


  const handleEdit = (row: any, e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation()
    setSelectedLead(row?.lead_id)
    setOpenAddLeadModal(true)
    setIsView(false)
  };

  const handleView = (row: any) => {
    setSelectedLead(row?.lead_id)
    setOpenAddLeadModal(true)
    setIsView(true)
  };


  const renderCustomColumn = (key: string, value: any, row: any) => {
    if (key === "client_name") {
      return (
        <span className="flex flex-col text-xs whitespace-nowrap">
          {value}
          <span className="text-grey300 text-xs">
            {row?.phone}
          </span>
        </span>
      );
    }
    else if (key === "agent") {
      return (
        <span className="text-xs whitespace-nowrap">
          {row?.firstname ? row?.firstname + ' ' + row?.lastname : '-'}
        </span>
      );
    }
    else if (key === "received_at") {
      return (
        <span className="text-xs whitespace-nowrap">
          {dayjs(value).format("hh:mm A")}
        </span>
      );
    }
    else if (key === "assigned_at") {
      return (
        <span className="text-xs whitespace-nowrap">
          {value ? dayjs(value).format("hh:mm A") : '-'}
        </span>
      );
    }
    else if (key === "nationality") {
      return (
        <span className="text-xs whitespace-nowrap">
          {nationalities?.find((item: any) => item?.id == value)?.name}
        </span>
      );
    }
    else if (key === "last_followup") {
      return (
        <span className="text-xs whitespace-nowrap">
          {dayjs(value).format("hh:mm A")}
        </span>
      );
    }
    else if (key === "priority") {
      return (
        <span className={`px-2 py-1 block text-center rounded-md text-white text-xs ${value === "High" ? "bg-red100" : value === "Medium" ? "bg-[#FFA63E]" : "bg-green100"}`}>
          {value}
        </span>
      );
    }
    else if (key === "source") {
      return (
        <span className={`flex -ml-2 items-center gap-1 whitespace-nowrap text-xs ${value === "Google" && "text-blue100"}`}>
          {/* <img
            src={value === "Google" ? GoogleColored : WhatsappColored}
            alt="icon"
            className={cn("size-[16px] p-0.5 rounded-md", {
              "bg-grey150": value === "Google"
            })}
          /> */}
          {value}
        </span>
      );
    }
    return null;
  };

  const handleAssignModal = (e: React.MouseEvent<SVGAElement>, row: { lead_id: string }) => {
    e.stopPropagation()
    setSelectedLead(row?.lead_id)
    setOpenLeadAssignModal(true)
  }


  const handleDeleteModal = (e: React.MouseEvent<SVGAElement>, row: { lead_id: string }) => {
    e.stopPropagation()
    setSelectedLead(row?.lead_id)
    setOpenLeadDeleteModal(true)
  }


  const handleViewDetail = (e: React.MouseEvent<SVGAElement>, row: { lead_id: string }) => {
    e.stopPropagation()
    navigate(`/lead/${row?.lead_id}`)
  }

  const renderActions = (row: any, rowIndex?: number) => (


    <div className="flex gap-2 justify-end mr-2">

      <IoEyeOutline
        onClick={(e: React.MouseEvent<SVGAElement>) => handleViewDetail(e, row)}
        className={cn("col-span-1 h-6 w-6 cursor-pointer rounded-md bg-grey150 p-1 text-grey300", {
          "bg-white": rowIndex && rowIndex % 2 === 0
        })}
      />
      <FiEdit
        onClick={(e: React.MouseEvent<SVGAElement>) => handleEdit(row, e)}
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-green100 p-1 text-white"
      />
      <RiDeleteBin6Line
        onClick={(e: React.MouseEvent<SVGAElement>) => handleDeleteModal(e, row)}
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-red-500 p-1 text-white"
      />
      <IoPersonAddOutline

        onClick={(e: React.MouseEvent<SVGAElement>) => handleAssignModal(e, row)}
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-[#009AE2] p-1 text-white"
      />
    </div>
  );

  const handleDeleteLead = async () => {
    try {
      const response = await deleteLead(selectedLead)
      if (response?.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Couldn't delete lead. Please try again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Lead deleted successfully!"
          />
        ));
        refetchLeads()
        setOpenLeadDeleteModal(false)
      }
    } catch (error) {
      console.log(error)
    }

  }

  const handleFilter = (name: string, value: ListOptionProps) => {
    if (name === 'source') {
      setFilters({ ...filters, source: value })
    }
    else if (name === 'channel') {
      setFilters({ ...filters, channel: value })
    }
    else if (name === 'nationality') {
      setFilters({ ...filters, nationality: value })
    }
    else if (name === 'stage') {
      setFilters({ ...filters, stage: value })
    }
    else if (name === 'agent') {
      setFilters({ ...filters, agent: value })
    }
  }


  return (
    <>
      <div className="gap-2 xl:gap-3 mb-2 grid grid-cols-4">
        {leadsData?.map((item, index) => (
          <div key={index} className="flex  items-center gap-4 bg-white rounded-2xl px-3 xl:px-4 py-3 border border-[#E3E3E3]">
            <div className={cn(
              `rounded-full p-2 xl:p-4 flex items-center justify-center`,
              {
                "bg-[#FFE59E]": index === 0,
                "bg-[#50C878]": index === 1,
                "bg-[#C8DEFF]": index === 2,
                "bg-[#FF9898]": index === 3
              }


            )}>
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
          <div className={`bg-white px-2 py-2 gap-2 rounded-[14px] grid grid-cols-9 2xl:grid-cols-12 w-full mb-2`}>
            <div className={`2xl:col-span-3 relative flex h-full w-full items-center justify-center gap-2.5 rounded-lg bg-grey150 px-3.5 text-gray-500`}>
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
              value={filters.source}
              options={sources}
              handleSelect={(item) => handleFilter('source', item)}
              placeholder="All Source"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-3 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <Combobox
              value={filters.channel}
              options={channels}
              handleSelect={(item) => handleFilter('channel', item)}
              placeholder="All Channel"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-3 rounded-[10px] text-xs text-grey200 bg-grey150`}

              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <Combobox
              value={filters.nationality}
              options={nationalities?.map((item: any) => ({ id: item?.name, name: item?.name })) || []}
              handleSelect={(item) => handleFilter('nationality', item)}
              placeholder="Country"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-3 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <Combobox
              value={filters.stage}
              options={stagesData}
              handleSelect={(item) => handleFilter('stage', item)}
              placeholder="All Stages"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-3 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            <Combobox
              value={filters.agent}
              options={users}
              handleSelect={(item) => handleFilter('agent', item)}
              placeholder="All Agents"
              mainClassName="w-full"
              toggleClassName={`w-full px-3 py-3 rounded-[10px] text-xs text-grey200 bg-grey150`}
              listClassName="w-full top-10 max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<div><IoIosArrowDown className="size-5 fill-grey200" /></div>}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              isRemoveAllow={true}
            />
            {/* <CustomButton
              name="Import"
              handleClick={() => { }}
              style="bg-grey150 text-sm text-grey200 h-full px-3 rounded-[10px]"
              icon={<div><GoDownload className="w-5 h-5 text-grey250 font-bold" /></div>}
            /> */}

            <div className="w-full 2xl:col-span-2">
              <DateRangePickerComponent range={date} setRange={setDate} />
            </div>
            <div className="flex gap-2 justify-end w-full col-span-2">
              <CustomButton
                name="Import"
                handleClick={() => { }}
                style="bg-primary w-full text-sm font-semibold text-white h-full px-3 rounded-[10px] w-[80%] 2xl:w-auto"
                icon={<div><GoDownload className="w-6 h-6 text-[#FFFFFF]" /></div>}
              />
              <CustomButton
                name="Create"
                handleClick={handleAddModal}
                style="bg-primary w-full text-sm font-semibold text-white h-full px-3 rounded-[10px] w-[80%] 2xl:w-auto"
                icon={<div><IoAdd className="w-6 h-6 text-[#FFFFFF]" /></div>}
              />
            </div>
          </div>
          <AddLeadModal
            selectedLeadId={selectedLead}
            open={openAddLeadModal}
            setOpen={setOpenAddLeadModal}
            refetch={refetchLeads}
            isView={isView}
            setIsView={setIsView}
            nationalities={nationalities}
            sources={sources}
            channels={channels}
          />
          <LeadAssignModal
            selectedLead={null}

            open={openLeadAssignModal}
            setOpen={setOpenLeadAssignModal}
            refetch={refetchLeads}
            selectedLeadId={selectedLead}
          />
          <LeadDeleteModal
            open={openLeadDeleteModal}
            setOpen={setOpenLeadDeleteModal}
            handleConfirm={handleDeleteLead}
            loadingButton={isDeleting}
          />

          <div className="w-full xl:h-[calc(100vh-315px)]">
            <ServerPaginatedTable
              headers={leadsHeaders}
              rows={leads?.leads || []}
              renderActions={renderActions}
              handleRowClick={(row) => handleView(row)}
              renderCustomColumn={renderCustomColumn}
              totalPages={leads?.total_pages}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
            />
          </div>
        </div>


      </div>
    </>
  );
};

export default LeadsList;
