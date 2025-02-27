import { useEffect, useState } from "react";
import { cn } from "../utils/helpers";
import LeadsIcon from "../assets/icons/sidebar/leads.svg";
import tableView from "../assets/icons/tableView.svg";
import gridView from "../assets/icons/gridView.svg";
import Plus from "../assets/icons/plus.svg";
import {
  useDeleteLeadMutation,
  useFetchLeadChannelsQuery,
  useFetchLeadSourcesQuery,
  useFetchLeadsQuery,
  useFetchUsersQuery,
} from "../store/services/leads";
import FilterDropDown from "../components/leadsNew/FilterDropDown";
import ServerPaginatedTable from "../components/ui/ServerPaginatedTable";
import { leadsHeaders } from "../utils/constants";
import { FiEdit } from "react-icons/fi";
import { IoEyeOutline, IoPersonAddOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useFetchNationalityQuery } from "../store/services/booking";
import React from "react";
import Combobox from "../components/ui/Combobox";
import { FaChevronDown } from "react-icons/fa";
import { HiMagnifyingGlass } from "react-icons/hi2";
import LeadCard from "../components/leadsNew/LeadCard";
import DateRangePickerComponent from "../components/ui/DateRangeSelector";
import NewLeadsSvg from "../assets/icons/newLeadsSvg.svg";
import InprogressSvg from "../assets/icons/inprogress.svg";
import BookedSvg from "../assets/icons/booked.svg";
import ConvertedSvg from "../assets/icons/converted.svg";
import FollowupSvg from "../assets/icons/followup.svg";
import NotconvertedSvg from "../assets/icons/notConverted.svg";
import AddLeadModal from "../components/leads/AddLeadModal";
import LeadAssignModal from "../components/leads/LeadAssignModal";
import LeadDeleteModal from "../components/leads/LeadDeleteModal";
import { toast } from "sonner";
import CustomToast from "../components/ui/CustomToast";
import Actions from "../components/leadsNew/Actions";

const LeadsNew = () => {
  const [dataView, setDataView] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 1,
    name: "10",
  });
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [openLeadAssignModal, setOpenLeadAssignModal] = useState(false);
  const [openLeadDeleteModal, setOpenLeadDeleteModal] = useState(false);
  const [openAddLeadModal, setOpenAddLeadModal] = useState(false);
  const [isView, setIsView] = useState(false);
  const [search, setSearch] = useState("");
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

  const [date, setDate] = useState([
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [filters, setFilters] = useState<{
    source: ListOptionProps;
    channel: ListOptionProps;
    nationality: ListOptionProps;
    stage: ListOptionProps;
    agent: ListOptionProps;
  }>({
    source: { id: "", name: "" },
    channel: { id: "", name: "" },
    nationality: { id: "", name: "" },
    stage: { id: "", name: "" },
    agent: { id: "", name: "" },
  });
  const navigate = useNavigate();

  const { data: leads, refetch: refetchLeads } = useFetchLeadsQuery({
    start_date: dayjs(date[0].startDate).format("YYYY-MM-DD"),
    end_date: dayjs(date[0].endDate).format("YYYY-MM-DD"),
    limit: Number(limit?.name),
    offset: page,
    source: filters.source.id,
    channel: filters.channel.id,
    nationality: filters.nationality.id,
    stage: filters.stage.id,
    agent: filters.agent.id,
    search: search,
  });
  const { data: nationalities } = useFetchNationalityQuery({});
  const [deleteLead, { isLoading: isDeleting }] = useDeleteLeadMutation();
  const { data: users } = useFetchUsersQuery({})

  const leadsData = [
    {
      name: "Total Leads",
      number: leads?.total_records,
      color: "#9878EC",
    },
    {
      name: "In-Progress",
      number: "15",
      color: "#FD7E14",
    },
    {
      name: "Booked",
      number: "05",
      color: "#2BA3F2",
    },
    {
      name: "Converted",
      number: "03",
      color: "#25D366",
    },
    {
      name: "Follow-Ups",
      number: "12",
      color: "#FFC108",
    },
    {
      name: "Not Converted",
      number: "18",
      color: "#F52A3C",
    },
    {
      name: "Junk Leads",
      number: "05",
      color: "#6C757D",
    },
  ];

  const leadsFilter = [
    {
      name: "Source",
      filters: sources,
    },
    {
      name: "Channel",
      filters: channels,
    },
    {
      name: "Status",
      filters: [
        { id: 1, name: "Website Form" },
        { id: 2, name: "Google Ads" },
        { id: 3, name: "Facebook Ads" },
        { id: 4, name: "Insragram Ads" },
      ],
    },
    {
      name: "Assigned Agent",
      filters: users,
    },
    {
      name: "Nationality",
      filters: nationalities,
    },
    {
      name: "Gender",
      filters: [
        { id: 1, name: "Male" },
        { id: 2, name: "Female" },
      ],
    },
    {
      name: "Pref. Language",
      filters: [
        { id: 1, name: "Website Form" },
        { id: 2, name: "Google Ads" },
        { id: 3, name: "Facebook Ads" },
        { id: 4, name: "Insragram Ads" },
      ],
    },
    {
      name: "Service Interest",
      filters: [
        { id: 1, name: "Low" },
        { id: 2, name: "Medium" },
        { id: 3, name: "High" },
      ],
    },
    {
      name: "Lead Type",
      filters: [
        { id: 1, name: "New" },
        { id: 2, name: "Old" },
      ],
    },
    {
      name: "Priority",
      filters: [
        { id: 1, name: "Low" },
        { id: 2, name: "Medium" },
        { id: 3, name: "High" },
      ],
    },
  ];

  const handleAssignModal = (
    e: React.MouseEvent<SVGAElement>,
    row: { lead_id: string }
  ) => {
    e.stopPropagation();
    setSelectedLead(row?.lead_id);
    setOpenLeadAssignModal(true);
  };

  const handleDeleteModal = (
    e: React.MouseEvent<SVGAElement>,
    row: { lead_id: string }
  ) => {
    e.stopPropagation();
    setSelectedLead(row?.lead_id);
    setOpenLeadDeleteModal(true);
  };

  const handleViewDetail = (
    e: React.MouseEvent<SVGAElement>,
    row: { lead_id: string }
  ) => {
    e.stopPropagation();
    navigate(`/lead/${row?.lead_id}`);
  };

  const handleAddModal = () => {
    setSelectedLead(null)
    setIsView(false)
    setOpenAddLeadModal(true)
  };

  const handleEdit = (row: any, e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    setSelectedLead(row?.lead_id);
    setOpenAddLeadModal(true);
    setIsView(false);
  };

  const handleView = (row: any) => {
    setSelectedLead(row?.lead_id);
    setOpenAddLeadModal(true);
    setIsView(true);
  };

  const renderCustomColumn = (key: string, value: any, row: any) => {
    if (key === "client_name") {
      return (
        <span className="flex flex-col whitespace-nowrap text-xs">
          {value}
          <span className="text-xs text-grey300">{row?.phone}</span>
        </span>
      );
    } else if (key === "agent") {
      return (
        <span className="whitespace-nowrap text-xs">
          {row?.firstname ? row?.firstname + " " + row?.lastname : "-"}
        </span>
      );
    } else if (key === "received_at") {
      return (
        <span className="whitespace-nowrap text-xs">
          {dayjs(value).format("hh:mm A")}
        </span>
      );
    } else if (key === "assigned_at") {
      return (
        <span className="whitespace-nowrap text-xs">
          {value ? dayjs(value).format("hh:mm A") : "-"}
        </span>
      );
    } else if (key === "nationality") {
      return (
        <span className="whitespace-nowrap text-xs">
          {nationalities?.find((item: any) => item?.id == value)?.name}
        </span>
      );
    } else if (key === "last_followup") {
      return (
        <span className="whitespace-nowrap text-xs">
          {dayjs(value).format("hh:mm A")}
        </span>
      );
    } else if (key === "priority") {
      return (
        <span
          className={`block rounded-md px-2 py-1 text-center text-xs text-white ${value === "High" ? "bg-red100" : value === "Medium" ? "bg-[#FFA63E]" : "bg-green100"}`}
        >
          {value}
        </span>
      );
    } else if (key === "source") {
      return (
        <span
          className={`-ml-2 flex items-center gap-1 whitespace-nowrap text-xs ${value === "Google" && "text-blue100"}`}
        >
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

  const renderActions = (row: any, rowIndex?: number) => (
    <div className="mr-2 flex justify-end gap-2">
      <IoEyeOutline
        onClick={(e: React.MouseEvent<SVGAElement>) => handleViewDetail(e, row)}
        className={cn(
          "col-span-1 h-6 w-6 cursor-pointer rounded-md bg-grey150 p-1 text-grey300",
          {
            "bg-white": rowIndex && rowIndex % 2 === 0,
          }
        )}
      />
      <FiEdit
        onClick={(e: React.MouseEvent<SVGAElement>) => handleEdit(row, e)}
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-green100 p-1 text-white"
      />
      <RiDeleteBin6Line
        onClick={(e: React.MouseEvent<SVGAElement>) =>
          handleDeleteModal(e, row)
        }
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-red-500 p-1 text-white"
      />
      <IoPersonAddOutline
        onClick={(e: React.MouseEvent<SVGAElement>) =>
          handleAssignModal(e, row)
        }
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

  useEffect(() => {
    setFilters({
      source: { id: "", name: "" },
      channel: { id: "", name: "" },
      nationality: { id: "", name: "" },
      stage: { id: "", name: "" },
      agent: { id: "", name: "" },
    })
  }, [])

  return (
    <>
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
      <section className="flex h-full flex-col">
        <div className="mb-3 flex flex-wrap items-center justify-center gap-4 2xl:gap-6 gap-y-6 rounded-2xl border border-[#E3E3E3] bg-white px-2 py-3">
          {leadsData?.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border-r border-[#E3E3E3] pr-4 2xl:pr-6 last:border-r-0"
            >
              <div
                style={{ backgroundColor: item.color }}
                className={cn(
                  `flex items-center justify-center rounded-full p-3 2xl:p-4`
                )}
              >
                <img
                  src={LeadsIcon}
                  alt="leads"
                  className="size-5 2xl:size-6"
                />
              </div>
              <div>
                <p className="text-lg font-semibold text-black 2xl:text-2xl">
                  {item?.number}
                </p>
                <p className="text-xs 2xl:text-sm">
                  {item?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex h-[calc(100vh-165px)] w-full gap-3 2xl:h-[calc(100vh-175px)]">
          <div className="w-[20%] overflow-y-auto rounded-[18px] border border-[#E3E3E3] bg-white px-3 py-6">
            <p className="mb-2 text-center font-medium 2xl:text-xl">
              Lead Filters
            </p>
            <div>
              {leadsFilter?.map((item: any) => (
                <FilterDropDown leadFilter={item} />
              ))}
            </div>
          </div>
          {/* table */}
          <div className="relative flex w-[80%] flex-col rounded-[18px] border border-[#E3E3E3] bg-white px-3 py-2">
            <div className="mb-1.5 flex items-center justify-between gap-10">
              <div
                className={`relative h-fit w-full max-w-[40%] rounded-xl bg-grey150 px-3.5 text-gray-500`}
              >
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by Client Name/ Mobile No."
                  className="w-full bg-transparent py-3 pl-5 text-xs placeholder:text-gray-500"
                />
                <HiMagnifyingGlass className="absolute left-2 top-1/2 size-5 -translate-y-1/2" />
              </div>
              <div className="flex items-center gap-2">
                <div
                  onClick={() => setDataView("table")}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-xl px-3 py-3",
                    [dataView === "table" ? "bg-[#2BA3F2]" : "bg-[#F3F5F9]"]
                  )}
                >
                  <img
                    src={tableView}
                    alt="table"
                    className={cn("size-4 min-w-4", {
                      invert: dataView === "table",
                    })}
                  />
                </div>
                <div
                  onClick={() => setDataView("grid")}
                  className={cn(
                    "flex cursor-pointer items-center justify-center rounded-xl px-2 py-2",
                    [dataView === "grid" ? "bg-[#2BA3F2]" : "bg-[#F3F5F9]"]
                  )}
                >
                  <img
                    src={gridView}
                    alt="grid"
                    className={cn("size-6 min-w-6", {
                      invert: dataView !== "grid",
                    })}
                  />
                </div>
                <DateRangePickerComponent range={date} setRange={setDate} />
                <div onClick={handleAddModal} className="flex cursor-pointer items-center gap-4 rounded-xl bg-[#F3F5F9] px-3 py-3 text-sm 2xl:py-2.5 2xl:text-base">
                  <p className="text-nowrap">Create Lead</p>
                  <div className="size-4">
                    <img src={Plus} alt="add lead" className="size-full" />
                  </div>
                </div>
                <Actions />
              </div>
            </div>
            {dataView === "table" ? (
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto">
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
                    showPagination={false}
                  />
                </div>
                <div className="flex w-full items-center justify-between p-2.5">
                  {leads?.leads && (
                    <>
                      <div className="flex w-full flex-1 items-center justify-start gap-3">
                        {(() => {
                          const maxVisibleButtons = 5;
                          const startPage = Math.max(
                            1,
                            leads?.total_pages -
                            Math.floor(maxVisibleButtons / 2)
                          );
                          const endPage = Math.min(
                            leads?.total_pages,
                            startPage + maxVisibleButtons - 1
                          );

                          const adjustedStartPage = Math.max(
                            1,
                            endPage - maxVisibleButtons + 1
                          );

                          const pageNumbers = [
                            ...Array(endPage - adjustedStartPage + 1).keys(),
                          ].map((n) => adjustedStartPage + n);

                          return (
                            <>
                              {adjustedStartPage > 1 && (
                                <>
                                  <div
                                    onClick={() => setPage?.(1)}
                                    className={cn(
                                      "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                                      {
                                        "bg-primary text-white":
                                          leads?.total_pages === 1,
                                      }
                                    )}
                                  >
                                    1
                                  </div>
                                  <div className="flex size-[31px] items-center justify-center text-xs">
                                    ...
                                  </div>
                                </>
                              )}
                              {pageNumbers.map((pageNumber) => (
                                <div
                                  key={pageNumber}
                                  onClick={() => setPage?.(pageNumber - 1)}
                                  className={cn(
                                    "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                                    {
                                      "bg-primary text-white":
                                        page === pageNumber - 1,
                                    }
                                  )}
                                >
                                  {pageNumber}
                                </div>
                              ))}
                              {endPage < leads?.total_pages && (
                                <>
                                  <div className="flex size-[31px] items-center justify-center text-xs">
                                    ...
                                  </div>
                                  <div
                                    onClick={() =>
                                      setPage?.(leads?.total_pages)
                                    }
                                    className={cn(
                                      "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                                      {
                                        "bg-primary text-white":
                                          page === leads?.total_pages,
                                      }
                                    )}
                                  >
                                    {leads?.total_pages}
                                  </div>
                                </>
                              )}
                            </>
                          );
                        })()}
                      </div>
                      {leads?.total_pages > 0 && (
                        <p className="mr-2.5 text-xs font-semibold">
                          Showing {page ? page + 1 : 1} of&nbsp;
                          {leads?.total_pages}
                          &nbsp;Pages
                        </p>
                      )}
                    </>
                  )}
                  <Combobox
                    options={[
                      {
                        id: 1,
                        name: "5",
                      },
                      {
                        id: 2,
                        name: "10",
                      },
                      {
                        id: 3,
                        name: "15",
                      },
                      {
                        id: 4,
                        name: "20",
                      },
                    ]}
                    value={limit || { id: 1, name: "5" }}
                    placeholder="Limit"
                    setValue={setLimit}
                    searchInputPlaceholder="Search..."
                    searchInputClassName="p-1.5 text-xs"
                    icon={<FaChevronDown className="size-3" />}
                    defaultSelectedIconClassName="size-2.5 text-secondary"
                    toggleClassName="w-full border px-3 py-1.5 rounded-lg text-xs bg-white"
                    listClassName="w-full bottom-8 max-h-52 border rounded-lg z-10 bg-white"
                    listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto">
                <div className="flex w-fit items-center ml-2">
                  <div className="relative w-[250px] flex items-center gap-2 text-nowrap text-lg font-semibold text-white">
                    <img
                      src={NewLeadsSvg}
                      alt="new leads"
                    />
                    <p className="text-white absolute top-1/2 left-5 -translate-y-1/2">
                      New Leads
                    </p>
                  </div>
                  <div className="relative w-[250px] flex items-center gap-2 text-nowrap text-lg font-semibold text-white">
                    <img
                      src={InprogressSvg}
                      alt="new leads"
                    />
                    <p className="text-white absolute top-1/2 left-8 -translate-y-1/2">
                      In Progress
                    </p>
                  </div>
                  <div className="relative w-[250px] flex items-center gap-2 text-nowrap text-lg font-semibold text-white">
                    <img
                      src={BookedSvg}
                      alt="new leads"
                    />
                    <p className="text-white absolute top-1/2 left-8 -translate-y-1/2">
                      Booked
                    </p>
                  </div>
                  <div className="relative w-[250px] flex items-center gap-2 text-nowrap text-lg font-semibold text-white">
                    <img
                      src={ConvertedSvg}
                      alt="new leads"
                    />
                    <p className="text-white absolute top-1/2 left-8 -translate-y-1/2">
                      Converted
                    </p>
                  </div>
                  <div className="relative w-[250px] flex items-center gap-2 text-nowrap text-lg font-semibold text-white">
                    <img
                      src={FollowupSvg}
                      alt="new leads"
                    />
                    <p className="text-white absolute top-1/2 left-8 -translate-y-1/2">
                      Follow-up
                    </p>
                  </div>
                  <div className="relative w-[250px] flex items-center gap-2 text-nowrap text-lg font-semibold text-white">
                    <img
                      src={NotconvertedSvg}
                      alt="new leads"
                    />
                    <p className="text-white absolute top-1/2 left-8 -translate-y-1/2">
                      Not Converted
                    </p>
                  </div>
                </div>
                {/* temp */}
                <div className="flex gap-2 py-2">
                  <div className="basis-[250px] space-y-3 border-r border-dashed border-[#E3E3E3] pr-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <LeadCard key={idx} />
                    ))}
                  </div>
                  <div className="basis-[250px] space-y-3 border-r border-dashed border-[#E3E3E3] pr-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <LeadCard key={idx} />
                    ))}
                  </div>
                  <div className="basis-[250px] space-y-3 border-r border-dashed border-[#E3E3E3] pr-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <LeadCard key={idx} />
                    ))}
                  </div>
                  <div className="basis-[250px] space-y-3 border-r border-dashed border-[#E3E3E3] pr-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <LeadCard key={idx} />
                    ))}
                  </div>
                  <div className="basis-[250px] space-y-3 border-r border-dashed border-[#E3E3E3] pr-2">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <LeadCard key={idx} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default LeadsNew;
