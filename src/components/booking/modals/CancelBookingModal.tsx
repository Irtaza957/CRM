import Modal from "../../ui/Modal";
import {
  useCancelBookingMutation,
  useFetchCancellationReasonsQuery,
} from "../../../store/services/booking";
import Combobox from "../../ui/Combobox";
import { RootState } from "../../../store";
import CustomToast from "../../ui/CustomToast";
import CustomInput from "../../ui/CustomInput";

import { toast } from "sonner";
import { useState } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
import { TiArrowSortedDown } from "react-icons/ti";

const CancelBookingModal = ({ id, open, setOpen }: ModalProps) => {
  const [other, setOther] = useState<string | number | null>("");
  const { data: reasons } = useFetchCancellationReasonsQuery({});
  const { user } = useSelector((state: RootState) => state.global);
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();
  const [reason, setReason] = useState<ListOptionProps | null>(null);

  const handleCancel = async () => {
    const urlencoded = new URLSearchParams();
    if (reason?.name === "Other") {
      urlencoded.append("reason", other as string);
    } else {
      urlencoded.append("reason", reason!.name);
    }
    urlencoded.append("booking_id", `${id}`);
    urlencoded.append("user_id", `${user?.id}`);

    try {
      const data = await cancelBooking({
        booking: urlencoded,
        token: user?.token,
      });

      if (data.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="error"
            message="Couldn't Cancel Booking. Please Try Again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="success"
            message="Cancelled Booking Successfully!"
          />
        ));
        setOpen(false);
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="error"
          message="Couldn't Cancel Booking. Please Try Again!"
        />
      ));
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-full max-w-md"
    >
      <div className="flex w-full flex-col items-center justify-center rounded-lg bg-gray-100">
        <div className="flex w-full items-center justify-between rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Cancel Booking</h1>
          <IoClose
            onClick={() => setOpen(false)}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCancel();
          }}
          className="flex w-full flex-col items-center justify-center space-y-2.5 rounded-b-lg bg-white p-2.5"
        >
          <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
            <label
              htmlFor="Reason for Cancelling"
              className="w-full text-left text-xs text-gray-500"
            >
              Reason for Cancelling
            </label>
            {reasons && (
              <Combobox
                value={reason}
                options={reasons!}
                placeholder="Reason"
                setValue={setReason}
                mainClassName="w-full"
                searchInputPlaceholder="Search..."
                searchInputClassName="p-1.5 text-xs"
                defaultSelectedIconClassName="size-4"
                icon={<TiArrowSortedDown className="size-5" />}
                toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
                listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              />
            )}
          </div>
          {reason?.name === "Other" && (
            <CustomInput
              type="text"
              value={other}
              setter={setOther}
              placeholder="Enter Reason"
              label="Please Describe your Reason"
            />
          )}
          <div className="grid w-full grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setOpen(false)}
              className="col-span-1 w-full rounded-lg bg-gray-200 py-3 text-black"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="col-span-1 w-full rounded-lg bg-red-500 py-3 text-white"
            >
              {isLoading ? (
                <div className="flex w-full items-center justify-center space-x-3">
                  <LuLoader2 className="h-5 w-5 animate-spin" />
                  <span>Please Wait...</span>
                </div>
              ) : (
                "Cancel Order"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CancelBookingModal;
