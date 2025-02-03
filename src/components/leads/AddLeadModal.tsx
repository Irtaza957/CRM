import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import Modal from "../ui/Modal";
import CustomInput from "../ui/CustomInput";
import CustomButton from "../ui/CustomButton";
import Combobox from "../ui/Combobox";
import { toast } from "sonner";
import CustomToast from "../ui/CustomToast";
import {
  usePostCouponMutation,
  useUpdateCouponMutation,
} from "../../store/services/coupons";
import { RiArrowDownSLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FiEdit } from "react-icons/fi";
import { sources } from "../../utils/constants";
import CommonTextarea from "../ui/CommonTextarea";
import CustomPhoneInput from "../ui/CustomPhoneInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { addLeadSchema } from "../../utils/schemas";

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
  selectedLead,
  refetch,
  isView,
  setIsView
}: AddLeadModalProps) => {
  const { user } = useSelector((state: RootState) => state.global);
  const [createCoupon, { isLoading }] = usePostCouponMutation();
  const [updateCoupon, { isLoading: updateLoading }] =
    useUpdateCouponMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addLeadSchema),
    mode: "all",
  });
  const resetState = () => {
    reset({
      client_name: '',
      client_phone: '',
      nationality: { id: 0, name: "", list: [] },
      priority: { id: 0, name: "", list: [] },
      client_email: '',
      source: { id: 0, name: "", list: [] },
      channel: { id: 0, name: "", list: [] },
      language: { id: 0, name: "", list: [] },
      contact: { id: 0, name: "", list: [] },
      notes: '',
    });
  }

  const handleClose = () => {
    setOpen(false);
    resetState()
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new URLSearchParams();
      formData.append("client_name", data.client_name);
      formData.append("client_phone", data.client_phone);
      formData.append("nationality", data.nationality.id);
      formData.append("priority", data.priority.id);
      formData.append("client_email", data.client_email);
      formData.append("source", data.source.id);
      formData.append("channel", data.channel.id);
      formData.append("language", data.language.id);
      formData.append("contact", data.contact.id);
      formData.append("notes", data.notes);
      formData.append("user_id", String(user?.id));

      let response;
      if (selectedLead?.id) {
        formData.append("lead_id", selectedLead.id);
        response = await updateCoupon(formData);
      } else {
        response = await createCoupon(formData);
      }

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Failed to ${selectedLead?.id ? "update" : "create"} lead`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Lead ${selectedLead?.id ? "updated" : "created"} successfully`}
          />
        ));
        refetch();
        handleClose();
      }
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
      resetState()
    }
  }, [open])

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-4xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {selectedLead?.id ? "Update Lead" : "Add Lead"}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {isView && (
              <FiEdit
                onClick={() => setIsView?.(false)}
                className="h-6 w-6 cursor-pointer text-white"
              />
            )}
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div className="h-full max-h-[80vh] w-full overflow-y-scroll p-5">
          <div className="grid grid-cols-3 gap-4">
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={sources}
                  value={field.value}
                  onChange={field.onChange}
                  label="Source"
                  placeholder="Select Source"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                />
              )}
            />
            <Controller
              name="channel"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={sources}
                  value={field.value}
                  onChange={field.onChange}
                  label="Channel"
                  placeholder="Select Channel"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                />
              )}
            />
            <CustomInput
              name="client_name"
              label="Name"
              register={register}
              errorMsg={errors?.client_name?.message}
              placeholder="Enter coupon name"
              disabled={isView}
              isRequired={true}
            />
            <CustomPhoneInput
              name="client_phone"
              label="Phone Number"
              register={register}
              errorMsg={errors?.client_phone?.message}
              isDisabled={isView || false}
              isRequired={true}
            />
            <CustomInput
              name="client_email"
              label="Email"
              register={register}
              errorMsg={errors?.client_email?.message}
              placeholder="Enter email"
              disabled={isView}
              type="email"
              isRequired={true}
            />
            <Controller
              name="nationality"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={sources}
                  value={field.value}
                  onChange={field.onChange}
                  label="Nationality"
                  placeholder="Select Nationality"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                  errorMsg={errors?.nationality?.message}
                />
              )}
            />
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={sources}
                  value={field.value}
                  onChange={field.onChange}
                  label="Language"
                  placeholder="Select Language"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                />
              )}
            />
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={sources}
                  value={field.value}
                  onChange={field.onChange}
                  label="Priority"
                  placeholder="Select Priority"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                  errorMsg={errors?.priority?.message}
                  isRequired={true}
                />
              )}
            />
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={sources}
                  value={field.value}
                  onChange={field.onChange}
                  label="Contact Via"
                  placeholder="Select"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                />
              )}
            />
          </div>
          <CommonTextarea
            name="notes"
            register={register}
            errors={errors}
            disabled={isView}
            placeholder=""
            title="Note"
            rows={6}
          />

          <div className="mt-8 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            {!isView && (
              <CustomButton
                name={selectedLead?.id ? "Update" : "Save"}
                handleClick={handleSubmit(onSubmit)}
                loading={isLoading || updateLoading}
                disabled={isLoading || updateLoading}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddLeadModal;
