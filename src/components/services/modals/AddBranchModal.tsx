import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { TiArrowSortedDown } from "react-icons/ti";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import Combobox from "../../ui/Combobox";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import {
  useFetchCompaniesQuery,
  usePostBranchMutation,
  useUpdateBranchMutation,
} from "../../../store/services/company";
import { RiArrowDownSLine } from "react-icons/ri";
import { useFetchAreasQuery } from "../../../store/services/filters";
import { companyTypes, emirates } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Upload from "../../../assets/icons/upload.svg";
import UploadCompanyDocumentsModal from "./UploadCompanyDocumentsModal";

interface AddBranchModalProps {
  open: boolean;
  selectedBranch: BranchProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
  isApp?: boolean;
}

import dayjs from "dayjs";
import { IoCalendarOutline } from "react-icons/io5";
import CustomDatePicker from "../../ui/CustomDatePicker";
import { FiEdit } from "react-icons/fi";

const AddBranchModal = ({
  open,
  setOpen,
  selectedBranch,
  refetch,
  isView,
  setIsView,
  isApp
}: AddBranchModalProps) => {
  const [selectedCompany, setSelectedCompany] =
    useState<ListOptionProps | null>(null);
  const [area, setArea] = useState<ListOptionProps | null>(null);
  const [emirate, setEmirate] = useState<ListOptionProps | null>(null);
  const [registeredDate, setRegisteredDate] = useState<Date | string>(dayjs().toDate());
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [companyType, setCompanyType] = useState<ListOptionProps | null>(null);

  const { user } = useSelector((state: RootState) => state.global);
  const { data: companiesData } = useFetchCompaniesQuery(null);
  const [createBranch, { isLoading }] = usePostBranchMutation();
  const [updateBranch, { isLoading: updateLoading }] =
    useUpdateBranchMutation();
  const { data: areas } = useFetchAreasQuery(emirate?.id || "", {
    skip: !emirate?.id,
    refetchOnMountOrArgChange: true,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleSelectCompany = (value: ListOptionProps) => {
    setSelectedCompany(value);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedCompany(null);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("company_id", String(selectedCompany?.id || ""));
      formData.append("emirate_id", String(emirate?.id || ""));
      formData.append("user_id", String(user?.id));
      formData.append("code", data.code);
      formData.append("name", data.name);
      formData.append("license", data.license);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("working_hours", data.working_hours);
      formData.append("area_id", String(area?.id));
      formData.append("address", data.address);
      formData.append("company_type", String(companyType?.name || ""));
      formData.append(
        "license_date",
        dayjs(registeredDate).format("YYYY-MM-DD")
      );

      let response;
      if (selectedBranch?.branch_id) {
        formData.append("id", selectedBranch?.branch_id);
        response = await updateBranch(formData);
      } else {
        response = await createBranch(formData);
      }

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Failed to ${selectedBranch?.branch_id ? "update" : "create"} branch`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Branch ${selectedBranch?.branch_id ? "updated" : "created"} successfully`}
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
    if (selectedBranch?.branch_id && companiesData) {
      setValue("name", selectedBranch.name);
      setValue("code", selectedBranch.code);
      setValue("license", selectedBranch.license);
      setValue("phone", selectedBranch.phone);
      setValue("email", selectedBranch.email);
      setValue("working_hours", selectedBranch.working_hours);
      setValue("address", selectedBranch.address);
      if (selectedBranch.registered_date) {
        setRegisteredDate(dayjs(selectedBranch.registered_date).toDate());
      }

      const selectedEmirate = emirates.find(
        (emirate) => emirate.id === Number(selectedBranch?.emirate_id)
      );
      if (selectedEmirate) {
        setEmirate({
          id: selectedEmirate.id || "",
          name: selectedEmirate.name || "",
        });
      }

      const company = companiesData?.find(
        (c) => c.id === selectedBranch.company_id
      );
      if (company) {
        setSelectedCompany({
          id: company.id,
          name: company.name,
        });
      }
    }
  }, [selectedBranch, companiesData]);

  useEffect(() => {
    if (areas && selectedBranch?.area_id) {
      const selectedArea = areas?.find(
        (area) => area.id == selectedBranch?.area_id
      );
      if (selectedArea) {
        setArea({ id: selectedArea.id || "", name: selectedArea.name || "" });
      }
    }
  }, [areas, selectedBranch]);

  useEffect(() => {
    if (!open) {
      setArea(null);
      setEmirate(null);
      setRegisteredDate(dayjs().toDate());
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {selectedBranch?.branch_id ? "Update Branch" : "Add Branch"}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {(isView && !isApp) && (
              <FiEdit onClick={() => setIsView(false)} className="h-6 w-6 cursor-pointer text-white" />
            )}
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <div className="grid grid-cols-2 gap-5">
            <Combobox
              value={selectedCompany}
              options={
                companiesData?.map((item) => ({
                  id: item.id,
                  name: item.name,
                })) || []
              }
              handleSelect={handleSelectCompany}
              label="Company"
              placeholder="Select Company"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[72px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<TiArrowSortedDown className="size-5" />}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
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
            <Combobox
              value={emirate}
              options={emirates}
              handleSelect={(value: ListOptionProps) => setEmirate(value)}
              label="Registered Emirate"
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
              handleSelect={(value: ListOptionProps) => setArea(value)}
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
              label="Branch Code"
              register={register}
              errorMsg={errors?.code?.message}
              placeholder="Enter code"
              disabled={isView}
            />
            <CustomInput
              name="name"
              label="Branch Name"
              register={register}
              errorMsg={errors?.name?.message}
              placeholder="Enter name"
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
              type="button"
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
                name={selectedBranch?.branch_id ? "Update" : "Save"}
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

export default AddBranchModal;
