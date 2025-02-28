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
  useFetchLeadByIdQuery,
  usePostLeadMutation,
  useUpdateLeadMutation,
} from "../../store/services/leads";
import { RiArrowDownSLine } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import CommonTextarea from "../ui/CommonTextarea";
import CustomPhoneInput from "../ui/CustomPhoneInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { addLeadSchema } from "../../utils/schemas";
import { contactVia, genderOptions, languages, priorities } from "../../utils/constants";

interface AddLeadModalProps {
  open: boolean;
  selectedLeadId: string | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView?: boolean;
  setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
  nationalities?: ListOptionProps[];
  sources?: ListOptionProps[];
  channels?: ListOptionProps[];
}




const AddLeadModal = ({
  open,
  setOpen,
  selectedLeadId,
  refetch,
  isView,
  setIsView,
  nationalities,
  sources,
  channels
}: AddLeadModalProps) => {
  const [createlead, { isLoading }] = usePostLeadMutation();
  const [updatelead, { isLoading: updateLoading }] = useUpdateLeadMutation();

  const {
    data: fetchedLeadDetails,
  } = useFetchLeadByIdQuery(selectedLeadId, {
    skip: !selectedLeadId || !open,
    refetchOnMountOrArgChange: true,
  });

  const leadDetails: LeadsData | undefined = selectedLeadId ? fetchedLeadDetails : undefined;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(addLeadSchema),
    mode: "all",
  });
  const resetState = () => {
    reset({
      client_name: "",
      client_phone: "",
      nationality: { id: 0, name: "", list: [] },
      priority: { id: 0, name: "", list: [] },
      client_email: "",
      source: { id: 0, name: "", list: [] },
      channel: { id: 0, name: "", list: [] },
      language: { id: 0, name: "", list: [] },
      contact: { id: 0, name: "", list: [] },
      notes: "",
      service_interest: { id: 0, name: "", list: [] },
      preferred_channel: { id: 0, name: "", list: [] },
    });
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new URLSearchParams();
      formData.append("source_id", data.source.id);
      formData.append("channel_id", data.channel.id);
      formData.append("client_name", data.client_name);
      formData.append("phone", data.client_phone);
      formData.append("email", data.client_email);
      formData.append("nationality", data.nationality.id);
      formData.append("language", data.language.id);
      formData.append("priority", data.priority.id);
      formData.append("contact_via", data.contact.id);
      formData.append("description", data.notes);
      let response;
      if (selectedLeadId) {
        formData.append("lead_id", selectedLeadId);
        response = await updatelead(formData);
      } else {
        response = await createlead(formData);
      }


      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Failed to ${selectedLeadId ? "update" : "create"} lead`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Lead ${selectedLeadId ? "updated" : "created"} successfully`}
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
    if (leadDetails) {
      setValue("client_name", leadDetails.client_name);
      setValue("client_phone", leadDetails.phone);
      setValue("client_email", leadDetails.email);
      setValue("notes", leadDetails.description);

      const selectedSource = sources?.find((source: any) => source.name === leadDetails.source);
      const selectedChannel = channels?.find((channel: any) => channel.name === leadDetails.channel);
      const selectedNationality = nationalities?.find((nationality: any) => nationality.id == leadDetails.nationality);
      const selectedLanguage = languages?.find((source: any) => source.id === leadDetails.language);
      const selectedPriority = priorities?.find((source: any) => source.id === leadDetails.priority);
      const selectedContact = contactVia?.find((source: any) => source.id === leadDetails.contact_via);
      setValue("source", selectedSource);
      setValue("channel", selectedChannel);
      setValue("nationality", selectedNationality);
      setValue("language", selectedLanguage);
      setValue("priority", selectedPriority);
      setValue("contact", selectedContact);

    }
  }, [leadDetails, sources, channels, nationalities, open]);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);
  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-4xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {selectedLeadId ? `${isView ? 'View' : 'Update'} Lead` : "Add Lead"}
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
            <CustomInput
              name="client_name"
              label="Name"
              register={register}
              errorMsg={errors?.client_name?.message}
              placeholder="Enter name"
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
              name="service_interest"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={priorities}
                  value={field.value}
                  onChange={field.onChange}
                  label="Service Interest"
                  placeholder="Select Service"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                  errorMsg={errors?.service_interest?.message}
                  isRequired={true}
                />
              )}
            />
            <Controller
              name="emirate"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={priorities}
                  value={field.value}
                  onChange={field.onChange}
                  label="Emirate"
                  placeholder="Select Emirate"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                  errorMsg={errors?.emirate?.message}
                  isRequired={true}
                />
              )}
            />
            <Controller
              name="preferred_channel"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={priorities}
                  value={field.value}
                  onChange={field.onChange}
                  label="Preferred Communication Channel"
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
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={genderOptions}
                  value={field.value}
                  onChange={field.onChange}
                  label="Gender"
                  placeholder="Select Gender"
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
              name="language"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={languages}
                  value={field.value}
                  onChange={field.onChange}
                  label="Preferred Language"
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
              name="nationality"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={nationalities}
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
                  options={channels}
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
            <Controller
              name="lead_type"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={priorities}
                  value={field.value}
                  onChange={field.onChange}
                  label="Lead Type"
                  placeholder="Company"
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
            {/* <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={priorities}
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
                  options={contactVia}
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
            /> */}
            <label
              htmlFor="high-priority"
              className="flex cursor-pointer items-center gap-2 text-sm rounded-lg"
            >
              <input
                id="high-priority"
                type="checkbox"
                className="peer hidden"
              />
              <span className="size-5 rounded-[5px] border border-[#9FA2AA] bg-white peer-checked:border-blue-500 peer-checked:bg-blue-500"></span>
              High Priority
            </label>
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
                name={selectedLeadId ? "Update" : "Save"}
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