import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";
import { RiErrorWarningFill } from "react-icons/ri";

import Loader from "../ui/Loader";
import { RootState } from "../../store";
import Combobox from "../../components/ui/Combobox";
import Edit from "../../assets/icons/colored/edit.svg";
import { cn, groupAndCountItems } from "../../utils/helpers";
import ReAssign from "../../assets/icons/colored/re-assign.svg";
import { useFetchBookingsQuery } from "../../store/services/booking";
import SmallUpDownArrow from "../../assets/icons/small-updown-arrow.svg";
import PhoneColored from "../../assets/icons/colored/colored-phone-square.svg";
import ViewBookingModal from "../../components/booking/modals/ViewBookingModal";
import WhatsappColored from "../../assets/icons/colored/colored-whatsapp-square.svg";

const columns = [
  {
    id: 1,
    name: "#",
  },
  {
    id: 2,
    name: "Category",
  },
  {
    id: 3,
    name: "Source",
  },
  {
    id: 4,
    name: "Channel",
  },
  {
    id: 5,
    name: "Customer",
  },
  {
    id: 6,
    name: "Location",
  },
  {
    id: 7,
    name: "Schedule",
  },
  {
    id: 8,
    name: "Amount",
  },
  {
    id: 9,
    name: "Team",
  },
  {
    id: 10,
    name: "Booking Status",
  },
  {
    id: 11,
    name: "Payment Status",
  },
  {
    id: 12,
    name: "Created By",
  },
  {
    id: 13,
    name: "Actions",
  },
];

const Table = () => {
  const [id, setID] = useState("");
  const [page, setPage] = useState(1);
  const [update, setUpdate] = useState(false);
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 2,
    name: "10",
  });
  const { date } = useSelector((state: RootState) => state.global);
  const { data, isLoading } = useFetchBookingsQuery(
    dayjs(date).format("YYYY-MM-DD")
  );

  return (
    <>
      <ViewBookingModal id={id} open={update} setOpen={setUpdate} />
      <div className="mt-5 h-[calc(100vh-385px)] w-full lg:h-[calc(100vh-275px)] xl:h-[calc(100vh-220px)]">
        <div className="h-full w-full overflow-hidden rounded-t-lg border">
          <div className="no-scrollbar h-full overflow-y-scroll">
            <table className="relative w-full min-w-full">
              <thead className="sticky top-0 bg-primary text-left text-white shadow-md">
                <tr className="h-12">
                  {columns.map((column, idx) => (
                    <th key={idx} className="border-x px-3 text-xs font-medium">
                      <div className="flex w-full items-center justify-center gap-2.5">
                        <span className="flex-1 text-left font-bold">
                          {column.name}
                        </span>
                        <img src={SmallUpDownArrow} alt="small-updown-arrow" />
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
                  {data
                    ?.slice(
                      page * parseInt(limit!.name) - parseInt(limit!.name),
                      page * parseInt(limit!.name)
                    )
                    .map((booking, idx) => (
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
                          <span className="text-xs">{idx + 1}</span>
                        </td>
                        <td
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
                        </td>
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <p className="w-full text-xs">{booking.source}</p>
                        </td>
                        <td
                          className="px-3"
                          onClick={() => {
                            setID(booking.booking_id);
                            setUpdate(true);
                          }}
                        >
                          <p className="w-full text-xs text-primary">
                            {!booking.channel ? "N/A" : booking.channel}
                          </p>
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
                              {booking.customer}
                            </p>
                            <p className="w-full text-xs">
                              {booking.relationship}
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
                          <div className="flex flex-col items-center justify-center">
                            <p className="w-full overflow-hidden truncate text-xs">
                              {dayjs(booking.schedule_date).format(
                                "DD MMM YYYY"
                              )}
                            </p>
                            <p className="w-full text-xs">
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
                          <div className="flex flex-col items-center justify-center">
                            {booking.consultation_team.map((team, idx) => (
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
                                <span className="flex-1 overflow-hidden truncate">{team.name}</span>
                              </div>
                            ))}
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
                                  booking.payment_status === "Cancelled",
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
                            <p className="w-full text-xs overflow-hidden truncate">
                              {booking.created_by}
                            </p>
                            <p className="w-full text-xs overflow-hidden truncate">
                              {dayjs(booking.created_at).format(
                                "DD MMM YYYY - HH:mm A"
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="px-3">
                          <div className="flex gap-1 flex-wrap">
                            <img src={PhoneColored} alt="icon" className="size-[18px]" />
                            <img src={WhatsappColored} alt="icon" className="size-[18px]" />
                            <img src={ReAssign} alt="icon" className="size-[18px]" />
                            <img src={Edit} alt="icon" className="size-[18px]" />
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
      <div className="flex w-full items-center justify-between rounded-b-lg border-x border-b bg-white p-2.5">
        {data && (
          <>
            <div className="flex w-full flex-1 items-center justify-start gap-3">
              {(() => {
                const totalPages = Math.ceil(
                  data?.length / parseInt(limit!.name)
                );
                const maxVisibleButtons = 5;
                const startPage = Math.max(
                  1,
                  page - Math.floor(maxVisibleButtons / 2)
                );
                const endPage = Math.min(
                  totalPages,
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
                          onClick={() => setPage(1)}
                          className={cn(
                            "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                            {
                              "bg-primary text-white": page === 1,
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
                        onClick={() => setPage(pageNumber)}
                        className={cn(
                          "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                          {
                            "bg-primary text-white": page === pageNumber,
                          }
                        )}
                      >
                        {pageNumber}
                      </div>
                    ))}
                    {endPage < totalPages && (
                      <>
                        <div className="flex size-[31px] items-center justify-center text-xs">
                          ...
                        </div>
                        <div
                          onClick={() => setPage(totalPages)}
                          className={cn(
                            "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                            {
                              "bg-primary text-white": page === totalPages,
                            }
                          )}
                        >
                          {totalPages}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}
            </div>
            <p className="mr-2.5 text-xs font-semibold">
              Showing {page} of&nbsp;
              {Math.ceil(data?.length / parseInt(limit!.name))}
              &nbsp;Pages
            </p>
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
      </div>
    </>
  );
};

export default Table;
