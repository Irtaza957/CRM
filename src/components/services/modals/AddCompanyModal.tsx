import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoClose, IoCalendarOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RiArrowDownSLine } from "react-icons/ri";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import Combobox from "../../ui/Combobox";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import { RootState } from "../../../store";
import { useFetchAreasQuery } from "../../../store/services/filters";
import {
  useFetchCompanyQuery,
  usePostCompanyMutation,
  useUpdateCompanyMutation,
} from "../../../store/services/company";
import { companyTypes, emirates } from "../../../utils/constants";
import CustomDatePicker from "../../ui/CustomDatePicker";
import dayjs from "dayjs";
import Upload from "../../../assets/icons/upload.svg";
import UploadCompanyDocumentsModal from "./UploadCompanyDocumentsModal";
import { FiEdit } from "react-icons/fi";

interface AddCompanyModalProps {
  open: boolean;
  selectedCompany: { id: string; business: string } | null;
  businesses?: BusinessProps[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
  isApp?: boolean;
}

const companySchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  license: z.string().min(1, "License is required"),
  industry: z.string().min(1, "Industry is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  working_hours: z.string().min(1, "Working hours are required"),
  area_id: z.string().optional(),
  address: z.string().min(1, "Address is required")
});

const AddCompanyModal = ({
  open,
  setOpen,
  selectedCompany,
  businesses,
  refetch,
  isView,
  setIsView,
  isApp
}: AddCompanyModalProps) => {
  const { user } = useSelector((state: RootState) => state.global);
  const [area, setArea] = useState<ListOptionProps | null>(null);
  const [emirate, setEmirate] = useState<ListOptionProps | null>(null);
  const { data: areas } = useFetchAreasQuery(emirate?.id, {
    skip: !emirate?.id,
  });
  const [createCompany, { isLoading }] = usePostCompanyMutation();
  const [updateCompany, { isLoading: updateLoading }] =
    useUpdateCompanyMutation();
  const [selectedBusiness, setSelectedBusiness] = useState<
    ListOptionProps | ListOptionProps[] | []
  >([]);
  const { data: companyData } = useFetchCompanyQuery(selectedCompany?.id, {
    skip: !selectedCompany?.id,
    refetchOnMountOrArgChange: true,
  });
  const [registeredDate, setRegisteredDate] = useState<string | Date>(
    new Date()
  );
  const [companyType, setCompanyType] = useState<ListOptionProps | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySchema),
  });

  const handleSelectArea = (value: ListOptionProps) => {
    setArea(value);
    setValue("area_id", String(value.id));
  };

  const handleSelectBusiness = (value: ListOptionProps) => {
    setSelectedBusiness(value);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    reset({
      code: "",
      name: "",
      license: "",
      industry: "",
      phone: "",
      email: "",
      working_hours: "",
      address: "",
      registered_date: "",
    });
    setArea(null);
    setEmirate(null);
    setSelectedBusiness([]);
    setCompanyType(null);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("user_id", String(user?.id));
      const businessString = (selectedBusiness as ListOptionProps[])
        ?.map((business) => business.id)
        .join(",");
      formData.append("business", businessString);
      formData.append("code", data.code);
      formData.append("name", data.name);
      formData.append("license", data.license);
      formData.append("industry", data.industry);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("working_hours", data.working_hours);
      formData.append("area_id", String(area?.id));
      formData.append("emirate_id", String(emirate?.id));
      formData.append("address", data.address);
      formData.append(
        "license_date",
        dayjs(registeredDate).format("YYYY-MM-DD")
      );
      formData.append("company_type", String(companyType?.name || ""));

      let response;
      if (selectedCompany?.id) {
        formData.append("id", selectedCompany?.id);
        response = await updateCompany(formData);
      } else {
        response = await createCompany(formData);
      }

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Failed to ${selectedCompany?.id ? "update" : "create"} company`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Company ${selectedCompany?.id ? "updated" : "created"} successfully`}
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
    if (selectedCompany?.id) {
      setValue("code", companyData?.code || "");
      setValue("name", companyData?.name);
      setValue("license", companyData?.license);
      setValue("industry", companyData?.industry);
      setValue("phone", companyData?.phone);
      setValue("email", companyData?.email);
      setValue("working_hours", companyData?.working_hours);
      setValue("address", companyData?.address);
      setValue("registered_date", companyData?.license_date);
      const selectedBusiness = businesses
        ?.filter((a) => companyData?.businesses?.some((b) => b.business_id === a.id))
        ?.map((item) => ({ id: item.id, name: item.name }));

      if (selectedBusiness?.length) {
        setSelectedBusiness(selectedBusiness);
      }
      setRegisteredDate(companyData?.license_date || '')
      const selectedCompanyType = companyTypes?.find(item => item.name === companyData?.company_type)
      setCompanyType(selectedCompanyType || null)
      if(companyData?.emirate_id){
        setEmirate(emirates?.find(item => item.id == Number(companyData?.emirate_id)) || null)
      }
    }
  }, [companyData, open]);

  useEffect(() => {
    if(areas?.length && companyData?.area_id){
    const selectedArea = areas?.find((a) => a.id == companyData?.area_id);
    if (selectedArea) {
      setArea({ id: selectedArea.area_id, name: selectedArea.name });
      setValue("area_id", String(selectedArea.area_id));
      }
    }
  }, [areas])

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-3xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {isView ? "View Company" : selectedCompany?.id ? "Update Company" : "Add Company"}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {(isView && !isApp) && (
              <FiEdit
                onClick={() => setIsView(false)}
                className="h-6 w-6 cursor-pointer text-white"
              />
            )}
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <div className="grid grid-cols-2 gap-5">
            <Combobox
              value={selectedBusiness}
              options={businesses || []}
              handleSelect={handleSelectBusiness}
              label="Business"
              placeholder="Select Business"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              errorMsg={errors?.business?.message}
              isMultiSelect={true}
              disabled={isView}
            />
            <CustomInput
              name="industry"
              label="Industry"
              register={register}
              errorMsg={errors?.industry?.message}
              placeholder="Enter industry"
              disabled={isView}
            />
            <Combobox
              value={emirate}
              options={emirates}
              handleSelect={(value: ListOptionProps) => setEmirate(value)}
              label="Registered Emirates"
              placeholder="Select Emirate"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              disabled={isView}
            />
            <Combobox
              value={area}
              options={
                areas?.map((area) => {
                  return { id: area.id || "", name: area.name || "" };
                }) || []
              }
              handleSelect={handleSelectArea}
              label="Area"
              placeholder="Select Area"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              errorMsg={errors?.area_id?.message}
              disabled={!emirate?.id || isView}
            />
            <CustomInput
              name="code"
              label="Company Code"
              register={register}
              errorMsg={errors?.code?.message}
              placeholder="Enter code"
              disabled={isView}
            />
            <CustomInput
              name="name"
              label="Company Name"
              register={register}
              errorMsg={errors?.name?.message}
              placeholder="Enter name"
              disabled={isView}
            />
            <Combobox
              options={companyTypes}
              value={companyType}
              handleSelect={(value: ListOptionProps) => setCompanyType(value)}
              label="Company Type"
              placeholder="Select Company Type"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              disabled={isView}
            />
            <CustomInput
              name="phone"
              label="Phone"
              register={register}
              errorMsg={errors?.phone?.message}
              placeholder="Enter phone"
              disabled={isView}
            />
            <CustomInput
              name="email"
              label="Email"
              register={register}
              errorMsg={errors?.email?.message}
              placeholder="Enter email"
              disabled={isView}
            />
            <CustomInput
              name="license"
              label="Trade License"
              register={register}
              errorMsg={errors?.license?.message}
              placeholder="Enter license"
              disabled={isView}
            />
            <div className="flex w-full flex-col">
              <label className="mb-1 w-full text-left text-xs font-medium text-grey100">
                Registered Date
              </label>
              <CustomDatePicker
                date={registeredDate}
                setDate={setRegisteredDate}
                toggleButton={
                  <div className="flex w-full items-center justify-between rounded-lg bg-gray-100 p-3 text-xs font-medium text-grey100">
                    <p className="whitespace-nowrap">
                      {dayjs(registeredDate).format("DD MMM YYYY")}
                    </p>
                    <div>
                      <IoCalendarOutline className="h-5 w-5 text-grey100" />
                    </div>
                  </div>
                }
                disabled={isView}
              />
            </div>
            <CustomInput
              name="working_hours"
              label="Working Hours"
              register={register}
              errorMsg={errors?.working_hours?.message}
              placeholder="09:00 - 17:00"
              disabled={isView}
            />
          </div>

          <div className="col-span-2 my-7 flex w-full flex-col items-center justify-center space-y-1">
            <label
              htmlFor="address"
              className="w-full text-left text-xs font-medium text-grey100"
            >
              Address
            </label>
            <textarea
              {...register("address")}
              rows={2}
              className="w-full rounded-lg bg-gray-100 p-3 text-xs text-grey100"
              placeholder="Enter address"
              disabled={isView}
            />
            {errors?.address?.message && (
              <p className="w-full text-left text-xs text-red-500">
                {errors?.address?.message as string}
              </p>
            )}
          </div>

          <div className="col-span-2 flex w-full flex-col items-start justify-start gap-2.5">
            <label className="w-full text-left text-xs font-medium text-grey100">
              Documents
            </label>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex w-full max-w-[100px] cursor-pointer flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed border-[#D9D9D9] bg-[#F5F6FA] py-5"
              disabled={isView}
            >
              <img src={Upload} alt="upload-icon" className="size-8" />
              <p className="text-center text-xs font-medium text-grey100">
                Upload Documents
              </p>
            </button>
          </div>

          <div className="col-span-2 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            {!isView && (
              <CustomButton
                name={selectedCompany?.id ? "Update" : "Save"}
                handleClick={handleSubmit(onSubmit)}
                loading={isLoading || updateLoading}
                disabled={isLoading || updateLoading}
              />
            )}
          </div>
        </div>
      </div>

      <UploadCompanyDocumentsModal
        open={showUploadModal}
        setOpen={setShowUploadModal}
      />
    </Modal>
  );
};

export default AddCompanyModal;
