import Modal from "../../ui/Modal";
import { cn } from "../../../utils/helpers"
import dayjs from "dayjs";

interface BookingLogsModalProps {
  logsData?: BookingLogs[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const BookingLogsModal = ({ logsData, open, setOpen }: BookingLogsModalProps) => {
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-full max-w-xl "
      title="Booking Logs"
    >
      <div className="w-full items-center justify-center rounded-lg bg-white max-h-[350px] overflow-auto">
        <div className="grid w-full grid-cols-4 px-2.5 pb-2.5">
          <p className="w-full text-left font-semibold text-primary">Agent</p>
          <p className="w-full text-left font-semibold text-primary">
            Updated At
          </p>
          <p className="w-full text-left font-semibold text-primary">
            Status
          </p>
          <p className="w-full text-left font-semibold text-primary">
            Comments
          </p>
        </div>
        {logsData?.map((log, idx) => (
          <div
            key={idx}
            className={cn("grid w-full grid-cols-4 p-2.5", {
              "bg-gray-100": idx % 2 === 0,
            })}
          >
            <p className="w-full overflow-hidden truncate text-left text-sm font-semibold text-[#656565] pr-2">
              {log?.name}
            </p>
            <p className="w-full overflow-hidden truncate text-left text-sm font-semibold text-[#656565]">
              {dayjs(log.created_at).format("DD MMM YYYY")}
            </p>
            <div className="flex w-full items-center justify-start">
              <span className="rounded-full bg-[#009AE2] px-2 py-px text-left text-sm font-semibold text-white">
                {log?.status}
              </span>
            </div>
            <p className="w-full overflow-hidden truncate text-left text-sm font-semibold text-[#656565]">
              {log?.comments}
            </p>
          </div>
        ))}
        {/* <div className="flex  w-full flex-col items-center justify-center overflow-auto p-5">

        </div> */}
      </div>
    </Modal>
  );
};

export default BookingLogsModal;
