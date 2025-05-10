import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";
import { RiErrorWarningFill } from "react-icons/ri";

import Loader from "../ui/Loader";
import Combobox from "../../components/ui/Combobox";
import Edit from "../../assets/icons/colored/edit.svg";
import { cn } from "../../utils/helpers";
import ReAssign from "../../assets/icons/colored/re-assign.svg";
import SmallUpDownArrow from "../../assets/icons/updown-arrow.svg";
import PhoneColored from "../../assets/icons/colored/colored-phone-square.svg";
import ViewBookingModal from "../../components/booking/modals/ViewBookingModal";
import WhatsappColored from "../../assets/icons/colored/colored-whatsapp-square.svg";
import NewBookingModal from "./modals/NewBookingModal";
import TeamMembersModal from "./modals/TeamMembersModal";

const columns = [
  { id: 1, name: "Ref. #", key: "booking_id" },
  { id: 3, name: "Customer", key: "customer" },
  { id: 5, name: "Source", key: "source" },
  { id: 7, name: "Schedule", key: "schedule_date" },
  { id: 6, name: "Location", key: "location" },
  { id: 8, name: "Amount", key: "total" },
  { id: 9, name: "Team", key: "team" },
  { id: 10, name: "Booking Status", key: "booking_status" },
  { id: 11, name: "Payment Status", key: "payment_status" },
  { id: 12, name: "Created By", key: "created_at" },
  { id: 13, name: "Actions", key: "actions" },
];

const Table = ({
  data,
  isLoading,
  page,
  setPageNum,
  refetch
}: {
  data: any;
  isLoading: boolean;
  page: number;
  setPageNum: (num: number) => void;
  refetch?: () => void;
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [id, setID] = useState("");
  const [update, setUpdate] = useState(false);
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 2,
    name: "10",
  });
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleEditBooking = (id: string) => {
    setOpen(true);
    setSelectedBooking(id);
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const [isAssignModal, setIsAssignModal]=useState(false)
  const [selectedUser, setSelectedUser]=useState<{id: string, team: Team[], status_id: string} | null>(null)

  const handleWhatsapp = (phone: string) => {
    window.open(`https://wa.me/?text=${phone}`, "_blank");
  };

  const handleAssign = (booking: any) => {
    setSelectedUser({id: booking.id, team: booking.team, status_id: booking.booking_status_id})
    setIsAssignModal(true)
  };

  const sortedData = useMemo(() => {
    if (!data?.bookings) return [];
    if (!sortConfig) return data?.bookings;

    const sorted = data?.bookings?.sort((a: any, b: any) => {
      const aValue =
        sortConfig.key === "booking_status"
          ? a[sortConfig.key]?.name
          : a[sortConfig.key];
      const bValue =
        sortConfig.key === "booking_status"
          ? b[sortConfig.key]?.name
          : b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  return (
    <>
      <ViewBookingModal id={id} open={update} setOpen={setUpdate} refetchBooking={refetch} />
      <TeamMembersModal refetch={refetch} members={selectedUser?.team} showMembers={["3","4","5","6",'7'].includes(selectedUser?.status_id || '')} bookingId={selectedUser?.id} open={isAssignModal} setOpen={setIsAssignModal} />
      <NewBookingModal
        selectedBooking={selectedBooking || ""}
        open={open}
        setOpen={setOpen}
      />
      <div className="mt-3 h-[calc(100vh-385px)] w-full lg:h-[calc(100vh-275px)] xl:h-[calc(100vh-245px)]">
        <div className="h-full w-full overflow-hidden rounded-t-lg border">
          <div className="no-scrollbar h-full overflow-y-scroll border-t-4 border-t-primary">
            <table className="relative w-full min-w-full">
              <thead className="sticky top-0 border border-b-[#D9D9D9] bg-grey text-left text-primary">
                <tr className="h-12">
                  {columns.map((column, idx) => (
                    <th
                      key={idx}
                      className="cursor-pointer border-x px-3 text-xs font-medium"
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex w-full items-center justify-center gap-2.5">
                        <span className="flex-1 whitespace-nowrap text-left font-bold">
                          {column.name}
                        </span>
                        {!["actions", "team"].includes(column.key) && (
                          <img
                            src={SmallUpDownArrow}
                            alt="small-updown-arrow"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {/* <Loader /> */}
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <tbody>
                  {sortedData
                    ?.slice(
                      page * parseInt(limit!.name) - parseInt(limit!.name),
                      page * parseInt(limit!.name)
                    )
                    .map((booking: any, idx: any) => (
                      <tr
                        key={idx}
                        title="Click to Edit"
                        className={cn(
                          "h-12 cursor-pointer bg-white text-gray-500",
                          {
                            "bg-[#F3F5F9]": idx % 2 !== 0,
                          }
                        )}
                      >
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <span className="text-xs">{booking.booking_id}</span>
                        </td>
                        {/* <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <div className="flex flex-col items-center justify-center">
                            {groupAndCountItems(
                              booking.categories.filter((cat) => cat.code)
                            ).map((cat, idx) => (
                              <div
                                key={idx}
                                className="flex w-full items-center gap-2 text-left text-xs"
                              >
                                <div
                                  style={{ backgroundColor: cat.color }}
                                  className="size-3 rounded-full"
                                />
                                {cat.code}&nbsp;x{cat.count}
                              </div>
                            ))}
                          </div>
                        </td> */}
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <div className="flex min-w-[100px] flex-col items-center justify-center">
                            <p className="w-full overflow-hidden truncate text-xs">
                              {booking.customer}
                            </p>
                            <p className="w-full text-xs">
                              {booking.relationship}
                            </p>
                          </div>
                        </td>
                        <td
                          className="px-3 text-xs"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <p className="w-full">{booking.source}</p>
                          {!booking.channel ? "N/A" : booking.channel}
                        </td>
                        {/* <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <p className="w-full text-xs text-primary">
                            {!booking.channel ? "N/A" : booking.channel}
                          </p>
                        </td> */}
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <p className="w-full overflow-hidden truncate text-xs">
                              {dayjs(booking.schedule_date).format("DD/MM/YY")}
                            </p>
                            <p className="w-full whitespace-nowrap text-xs">
                              {booking.schedule_slot}
                            </p>
                          </div>
                        </td>
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <span className="w-full overflow-hidden truncate text-left text-xs">
                            {booking.location}
                          </span>
                        </td>
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <span className="w-full overflow-hidden truncate text-xs">
                            AED {booking.total}
                          </span>
                        </td>
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <div className="flex flex-col items-center justify-center gap-0.5">
                            {booking.consultation_team?.length ? (
                              booking.consultation_team.map(
                                (team: any, idx: any) => (
                                  <div
                                    key={idx}
                                    className="flex w-full items-center gap-1 text-left text-xs"
                                  >
                                    {team.is_accepted ? (
                                      <FaCheckCircle className="text-green-500" />
                                    ) : team.rejected_at ? (
                                      <IoMdCloseCircle className="text-red-500" />
                                    ) : (
                                      <RiErrorWarningFill className="text-yellow-500" />
                                    )}
                                    &nbsp;
                                    <span className="flex-1 overflow-hidden truncate">
                                      {team.name}
                                    </span>
                                  </div>
                                )
                              )
                            ) : (
                              <p className="text-xs">N/A</p>
                            )}
                          </div>
                        </td>
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: booking.booking_status.color,
                            }}
                            className="rounded-full px-2 py-0.5 text-xs text-white"
                          >
                            {booking.booking_status.name}
                          </span>
                        </td>
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs text-white",
                              {
                                "bg-green-500":
                                  booking.payment_status === "Completed",
                                "bg-red-500":
                                  booking.payment_status === "Cancelled" ||
                                  booking.payment_status === "FAILED",
                                "bg-yellow-500":
                                  booking.payment_status === "Pending",
                              }
                            )}
                          >
                            {booking.payment_status}
                          </span>
                        </td>
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <p className="w-full overflow-hidden truncate text-xs">
                              {booking.created_by}
                            </p>
                            <p className="w-full overflow-hidden truncate text-xs">
                              {dayjs(booking.created_at).format("DD/MM/YY")}
                            </p>
                            <p className="w-full overflow-hidden truncate text-xs">
                              {dayjs(booking.created_at).format("HH:mm")}
                            </p>
                          </div>
                        </td>
                        <td className="px-3">
                          <div className="flex flex-wrap gap-1">
                            <img
                              src={PhoneColored}
                              alt="icon"
                              className="size-[18px]"
                            />
                            <img
                              src={WhatsappColored}
                              alt="icon"
                              className="size-[18px]"
                              onClick={() => handleWhatsapp(booking?.phone)}
                            />
                            {booking.booking_status_id !== '2' && (
                              <img
                                src={ReAssign}
                                alt="icon"
                                className="size-[18px]"
                                onClick={() =>
                                  handleAssign(booking)
                                }
                              />
                            )}
                            <img
                              src={Edit}
                              alt="icon"
                              className="size-[18px]"
                              onClick={() =>
                                handleEditBooking(booking?.booking_id)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex w-full items-center justify-between rounded-b-lg border-x border-b bg-white p-2.5",
          data?.total_pages > 1 ? "" : "h-12"
        )}
      >
        {data?.total_pages > 1 && (
          <div className="flex w-full flex-1 items-center justify-start gap-3">
            {[...Array(4)].map((_, index) => {
              const pagee = index + 1;
              return (
                <button
                  key={pagee}
                  onClick={() => setPageNum(pagee)}
                  className={cn(
                    "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black",
                    {
                      "bg-primary text-white": page === pagee,
                    }
                  )}
                >
                  {pagee}
                </button>
              );
            })}
          </div>
        )}
        {data?.total_pages > 1 && (
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
            value={limit}
            placeholder="Limit"
            setValue={setLimit}
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            icon={<TiArrowSortedDown className="size-3" />}
            defaultSelectedIconClassName="size-2.5 text-secondary"
            toggleClassName="w-full border px-3 py-1.5 rounded-lg text-xs bg-white"
            listClassName="w-full bottom-8 max-h-52 border rounded-lg z-10 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          />
        )}
      </div>
    </>
  );
};

export default Table;
