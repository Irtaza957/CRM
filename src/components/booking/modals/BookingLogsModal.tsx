import Modal from "../../ui/Modal";
import { cn } from "../../../utils/helpers";

import { IoClose } from "react-icons/io5";

const BookingLogsModal = ({ open, setOpen }: ModalProps) => {
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-full max-w-lg"
    >
      <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white">
        <div className="flex w-full items-center justify-between rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Booking Logs</h1>
          <IoClose
            onClick={() => setOpen(false)}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <div className="flex max-h-[250px] w-full flex-col items-center justify-center overflow-auto p-5">
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
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className={cn("grid w-full grid-cols-4 p-2.5", {
                "bg-gray-100": idx % 2 === 0,
              })}
            >
              <p className="w-full overflow-hidden truncate text-left text-sm font-semibold text-[#656565]">
                Agent
              </p>
              <p className="w-full overflow-hidden truncate text-left text-sm font-semibold text-[#656565]">
                Updated At
              </p>
              <div className="flex w-full items-center justify-start">
                <span className="rounded-full bg-[#009AE2] px-2 py-px text-left text-sm font-semibold text-white">
                  Status
                </span>
              </div>
              <p className="w-full overflow-hidden truncate text-left text-sm font-semibold text-[#656565]">
                Comments
              </p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default BookingLogsModal;
