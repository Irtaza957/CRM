import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import Modal from "../ui/Modal";
import CustomButton from "../ui/CustomButton";
import Combobox from "../ui/Combobox";
import { toast } from "sonner";
import CustomToast from "../ui/CustomToast";
import { RiArrowDownSLine } from "react-icons/ri";
import { sources } from "../../utils/constants";
import CommonTextarea from "../ui/CommonTextarea";

interface AddLeadModalProps {
  open: boolean;
  selectedLead: LeadProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView?: boolean;
  setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddLeadModal = ({
  open,
  setOpen,
  isView,
}: AddLeadModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const resetState = () => {
    reset({
      total_redeems: "",
      name: "",
      code: "",
    });
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new URLSearchParams();
      formData.append("name", data.name);
      // formData.append("code", data.code);
      // formData.append("expiry_date", dayjs(expiryDate).format("YYYY-MM-DD"));
      // formData.append("total_redeems", data.total_redeems);
      // formData.append("discount_type", String(discountType?.id));
      // formData.append("discount_value", data.discount_value);
      // formData.append("user_id", String(user?.id));
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Error"
          message="Something went wrong"
        />
      ));
    }
  };

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Move</h1>
          <div className="flex items-center justify-center gap-2">
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>
        <div className="h-full max-h-[80vh] w-full overflow-y-scroll p-5">
          <Combobox
            options={sources}
            value={null}
            handleSelect={() => {}}
            label="Lead Stage"
            placeholder="Select Lead Stage"
            mainClassName="w-full"
            toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
            listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
            icon={<RiArrowDownSLine className="size-5 text-grey100" />}
            isSearch={false}
            disabled={isView}
          />
          <CommonTextarea
            name="description"
            register={register}
            errors={errors}
            disabled={isView}
            placeholder=""
            title="Reason"
            rows={5}
          />

          <div className="mt-6 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            <CustomButton name="Move" handleClick={handleSubmit(onSubmit)} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddLeadModal;
