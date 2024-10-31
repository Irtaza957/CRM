import Modal from "../../ui/Modal";
import { cn } from "../../../utils/helpers";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { useFetchBookingHistoryMutation } from "../../../store/services/booking";

interface BookingHistoryModalProps{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  customerId?: string
}

const BookingHistoryModal = ({ customerId, open, setOpen }: BookingHistoryModalProps ) => {
  const [fetchBookingHistory, {data: historyData}] = useFetchBookingHistoryMutation();

  const getHistory=async()=>{
    if(customerId){
      await fetchBookingHistory(customerId)
    }
  }
  useEffect(()=>{
    getHistory()
  },[customerId])
  return (
    <Modal 
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="h-[90%] w-full max-w-[60%]"
    >
        <div className="w-full h-full items-center justify-center overflow-hidden rounded-lg">
        <div className="flex w-full items-center justify-between overflow-hidden rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Booking History</h1>
          <IoClose
            onClick={() => setOpen(false)}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <div className="grid w-full grid-cols-3 px-5 pt-5">
          <div className="col-span-1 flex w-full flex-1 items-center justify-start gap-3.5">
            <img
              alt="profile"
              className="size-14 rounded-full"
              src="https://ui.shadcn.com/avatars/04.png"
            />
            <div className="flex flex-col items-center justify-center space-y-1">
              <span className="w-full text-left text-xs font-bold text-[#656565]">
                Sandeep Dev
              </span>
              <span className="w-full text-left text-xs text-[#656565]">
                055 755 9446
              </span>
              <span className="w-full text-left text-xs text-[#656565]">
                sandeep@gmail.com
              </span>
            </div>
          </div>
          <div className="col-span-2 flex w-full flex-col items-center justify-between">
            <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5">
              <span className="text-xs font-semibold text-primary">
                Allergies:
              </span>
              <span className="rounded-full bg-red-200 px-2 text-xs text-red-500">
                Penicillin
              </span>
              <span className="rounded-full bg-red-200 px-2 text-xs text-red-500">
                Aspirin
              </span>
            </div>
            <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5">
              <span className="text-xs font-semibold text-primary">
                Medications:
              </span>
              <span className="text-xs text-[#656565]">
                Lipitor 40mg, Concor 5mg, Panadol
              </span>
            </div>
            <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5">
              <span className="text-xs font-semibold text-primary">
                Medical Conditions:
              </span>
              <span className="text-xs text-[#656565]">
                Hypertension, Diabetes
              </span>
            </div>
          </div>
        </div>
        <div className="grid w-full grid-cols-9 gap-5 p-5">
          <p className="w-full text-left text-xs font-semibold text-primary">
            Ref. #
          </p>
          <p className="w-full text-left text-xs font-semibold text-primary">
            Category
          </p>
          <p className="w-full text-left text-xs font-semibold text-primary">
            Customer
          </p>
          <p className="w-full text-left text-xs font-semibold text-primary">
            Schedule
          </p>
          <p className="w-full text-left text-xs font-semibold text-primary">
            Amount
          </p>
          <p className="w-full text-left text-xs font-semibold text-primary">
            Team
          </p>
          <p className="w-full text-left text-xs font-semibold text-primary">
            Status
          </p>
          <p className="w-full text-right text-xs font-semibold text-primary">
            Created By
          </p>
        </div>
        <div className="flex max-h-[600px] w-full flex-col items-start justify-start overflow-auto">
          {historyData?.data?.map((history: HistoryType, idx: number)=>(
            <div
            key={idx}
            className={cn(
              "grid w-full grid-cols-9 gap-5 p-5 text-xs text-[#656565]",
              {
                "bg-gray-100": idx % 2 === 0,
              }
            )}
          >
            <p className="w-full text-left text-xs">{history?.booking_id}</p>
            <div className="flex w-full items-start justify-center">
              <span className="flex-1 text-left text-xs">DOC</span>
              <div className="size-4 rounded-full bg-[#009AE2]"></div>
            </div>
            <p className="w-full text-left text-xs">{history?.customer}</p>
            <div className="flex w-full flex-col items-start justify-start">
              <span className="w-full overflow-hidden truncate text-left">
                {history?.schedule_date}
              </span>
              <span className="w-full overflow-hidden truncate text-left">
                {history?.schedule_slot}
              </span>
            </div>
            <p className="w-full text-left text-xs">AED {history?.total}</p>
            <div className="flex w-full flex-col items-center justify-center">
              <span className="w-full overflow-hidden truncate text-left">
                Ahmed Ali
              </span>
              <span className="w-full overflow-hidden truncate text-left">
                Sandeep Dev
              </span>
              <span className="w-full overflow-hidden truncate text-left">
                Ali Muhammad
              </span>
            </div>
            <div className="flex w-full items-start justify-start">
              <span className="rounded-full bg-[#31B86A] px-2 py-px text-white">
                {history?.booking_status}
              </span>
            </div>
            <p className="w-full text-right text-xs">{history?.created_by}</p>
          </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default BookingHistoryModal;
