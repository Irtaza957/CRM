import Modal from "../../ui/Modal";
import { cn } from "../../../utils/helpers";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { useFetchBookingHistoryMutation } from "../../../store/services/booking";

interface BookingHistoryModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser?: CustomerProps | UserType | null
}

const BookingHistoryModal = ({ selectedUser, open, setOpen }: BookingHistoryModalProps) => {
  const [fetchBookingHistory, { data: historyData }] = useFetchBookingHistoryMutation();

  const getHistory = async () => {
    if (selectedUser?.customer_id) {
      await fetchBookingHistory(selectedUser?.customer_id)
    }
  }
  useEffect(() => {
    getHistory()
  }, [selectedUser])
  
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="h-[90%] w-full max-w-[70%]"
    >
      <div className="w-full h-full items-center justify-center overflow-hidden rounded-lg">
        <div className="flex w-full items-center justify-between overflow-hidden rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Booking History</h1>
          <IoClose
            onClick={() => setOpen(false)}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <div className="grid w-full grid-cols-3 px-5 pt-5 gap-52 xl:gap-24">
          <div className="col-span-1 flex w-full flex-1 items-center justify-start gap-3.5">
            <img
              alt="profile"
              className="size-14 rounded-full"
              src="https://ui.shadcn.com/avatars/04.png"
            />
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="w-full text-left text-xs font-bold text-[#656565]">
                {selectedUser?.firstname} {selectedUser?.lastname}
              </span>
              <span className="w-full text-left text-xs text-[#656565]">
                {selectedUser?.phone}
              </span>
              <span className="w-full text-left text-xs text-[#656565]">
                {selectedUser?.email}
              </span>
            </div>
          </div>
          <div className="col-span-2 flex w-full flex-col items-center justify-between">
            {selectedUser?.allergy_description &&
              <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5">
                <span className="text-xs font-semibold text-primary">
                  Allergies:
                </span>
                <span className="rounded-full bg-red-200 px-2 text-xs text-red-500">
                  {selectedUser?.allergy_description}
                </span>
              </div>}
            {selectedUser?.medication_description &&
              <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5">
                <span className="text-xs font-semibold text-primary">
                  Medications:
                </span>
                <span className="text-xs text-[#656565]">
                  {selectedUser?.medication_description}
                </span>
              </div>}
            {selectedUser?.medical_condition_description &&
              <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5">
                <span className="text-xs font-semibold text-primary">
                  Medical Conditions:
                </span>
                <span className="text-xs text-[#656565]">
                  {selectedUser?.medical_condition_description}
                </span>
              </div>}
          </div>
        </div>
        <div className="no-scrollbar h-full overflow-y-scroll mt-3 pb-40">
          <table className="relative w-full min-w-full">
            <thead className="sticky top-0  text-left text-white bg-white">
              <tr className="h-12 text-primary">
                <th className="px-5 text-xs font-medium">
                  <div className="flex w-full items-center justify-center gap-2.5">
                    <span className="flex-1 text-left font-bold whitespace-nowrap">
                      Ref. #
                    </span>
                  </div>
                </th>
                <th className="px-5 text-xs font-medium">
                  <div className="flex w-full items-center justify-center gap-2.5">
                    <span className="flex-1 text-left font-bold">
                      Category
                    </span>
                  </div>
                </th>
                <th className="px-5 text-xs font-medium">
                  <div className="flex w-full items-center justify-center gap-2.5">
                    <span className="flex-1 text-left font-bold">
                      Customer
                    </span>
                  </div>
                </th>
                <th className="px-5 text-xs font-medium">
                  <div className="flex w-full items-center justify-center gap-2.5">
                    <span className="flex-1 text-left font-bold">
                      Schedule
                    </span>
                  </div>
                </th>
                <th className="px-5 text-xs font-medium">
                  <div className="flex w-full items-center justify-center gap-2.5">
                    <span className="flex-1 text-left font-bold">
                      Amount
                    </span>
                  </div>
                </th>
                <th className="px-5 text-xs font-medium">
                  <div className="flex w-full items-center justify-center gap-2.5">
                    <span className="flex-1 text-left font-bold">
                      Team
                    </span>
                  </div>
                </th>
                <th className="px-5 text-xs font-medium">
                  <div className="flex w-full items-center justify-center gap-2.5">
                    <span className="flex-1 text-left font-bold">
                      Status
                    </span>
                  </div>
                </th>
                <th className="px-5 text-xs font-medium">
                  <div className="flex w-full items-center justify-center gap-2.5">
                    <span className="flex-1 text-left font-bold">
                      Created By
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
              <tbody>
              {historyData?.data?.length ? historyData?.data?.map((history: HistoryType, idx: number) => (
                <tr
                  key={idx}
                  className={cn(
                    "h-12 bg-white text-xs text-[#656565]",
                    {
                      "bg-[#F3F5F9]": idx % 2 === 0,
                    }
                  )}
                >
                  <td
                    className="px-5 pt-3 pb-1 text-center"
                  >
                    <span className="text-xs">{history?.reference}</span>
                  </td>
                  <td
                    className="px-5 pt-3 pb-1"
                  >
                    {history?.categories?.length ? history?.categories?.map((item, index) => (
                      <div key={index} className="flex w-full items-start justify-start mb-1">
                        {item?.code ? <span className="flex-1 text-left text-xs">{item?.code}</span> : " -"}
                        {item?.color_code && <div className={`size-4 rounded-full bg-[${item?.color_code}]`}></div>}
                      </div>
                    )) : 'N/A'}
                  </td>
                  <td
                    className="px-5 pt-3 pb-1 whitespace-nowrap"
                  >
                    {history?.customer}
                  </td>
                  <td
                    className="px-5 pt-3 pb-1"
                  >
                    <span className="w-full overflow-hidden truncate text-left">
                      {history?.schedule_date}
                    </span>
                    <span className="w-full overflow-hidden truncate text-left">
                      {history?.schedule_slot}
                    </span>
                  </td>
                  <td
                    className="px-5 pt-3 pb-1 whitespace-nowrap"
                  >
                    AED {history?.amount}
                  </td>
                  <td
                    className="px-5 pt-3 pb-1"
                  >
                    {history?.team && history?.team?.length
                      ? [...history?.team]
                        .sort((a, b) => Number(b.is_lead) - Number(a.is_lead))
                        .map((item, index) => (
                          <span key={index} className="text-left">
                            {item.name}
                          </span>
                        ))
                      : 'N/A'}
                  </td>
                  <td
                    className="px-5 pt-3 pb-1"
                  >
                    <span className={`rounded-full px-2 py-px text-white ${history?.status==='Pending' ? 'bg-orange-300' : history?.status==='Cancelled' ? 'bg-red-500' :'bg-[#31B86A]'}`}>
                    {history?.status}
                    </span>

                  </td>
                  <td
                    className="px-5 pt-3 pb-1 whitespace-nowrap"
                  >
                    {history?.created_by || 'N/A'}
                  </td>
                </tr>
              )) : <tr><td colSpan={8} className="h-12 text-center text-xs text-[#656565] bg-[#F3F5F9]">No data found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default BookingHistoryModal;
