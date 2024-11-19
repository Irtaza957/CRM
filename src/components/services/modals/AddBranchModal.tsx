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
import { emirates } from "../../../utils/constants";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface AddBranchModalProps {
  open: boolean;
  selectedBranch: BranchProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

const AddBranchModal = ({
  open,
  setOpen,
  selectedBranch,
  refetch
}: AddBranchModalProps) => {
  const [selectedCompany, setSelectedCompany] =
    useState<ListOptionProps | null>(null);
  const [area, setArea] = useState<ListOptionProps | null>(null);
  const [emirate, setEmirate] = useState<ListOptionProps | null>(null);

  const { user } = useSelector((state: RootState) => state.global);
  const { data: companiesData } = useFetchCompaniesQuery(null);
  const [createBranch, { isLoading }] = usePostBranchMutation();
  const [updateBranch, { isLoading: updateLoading }] =
    useUpdateBranchMutation();
  const { data: areas } = useFetchAreasQuery(emirate?.id || '', {
    skip: !emirate?.id,
    refetchOnMountOrArgChange: true
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
      formData.append("company_id", String(selectedCompany?.id || ''));
      formData.append("emirate_id", String(emirate?.id || ''));
      formData.append("user_id", String(user?.id));
      formData.append("code", data.code);
      formData.append("name", data.name);
      formData.append("license", data.license);
      formData.append("industry", data.industry);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("working_hours", data.working_hours);
      formData.append("area_id", String(area?.id));
      formData.append("address", data.address);


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
        refetch()
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
      setValue("industry", selectedBranch.industry);
      setValue("phone", selectedBranch.phone);
      setValue("email", selectedBranch.email);
      setValue("working_hours", selectedBranch.working_hours);
      setValue("address", selectedBranch.address);

      const selectedArea = areas?.find(area => area.id === selectedBranch.area_id);
      if(selectedArea){
        setArea({id: selectedArea.id || '', name: selectedArea.name || ''});
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
    if(!open){
      setArea(null);
      setEmirate(null);
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {selectedBranch?.branch_id ? "Update Branch" : "Add Branch"}
          </h1>
          <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
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
            />
            <CustomInput
              name="industry"
              label="Industry"
              register={register}
              errorMsg={errors?.industry?.message}
              placeholder="Enter industry"
            />
            <Combobox
              value={emirate}
              options={emirates}
              handleSelect={(value: ListOptionProps) => setEmirate(value)}
              label="Emirate"
              placeholder="Select Emirate"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              
            />
            <Combobox
              value={area}
              options={areas?.map(area => { return { id: area.id || '', name: area.name || ''} }) || []}
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
              disabled={!emirate?.id}
            />
            <CustomInput
              name="code"
              label="Code"
              register={register}
              errorMsg={errors?.code?.message}
              placeholder="Enter code"
            />
            <CustomInput
              name="name"
              label="Name"
              register={register}
              errorMsg={errors?.name?.message}
              placeholder="Enter name"
            />
                        <CustomInput
              name="phone"
              label="Phone"
              register={register}
              errorMsg={errors?.phone?.message}
              placeholder="Enter phone"
            />
            <CustomInput
              name="email"
              label="Email"
              register={register}
              errorMsg={errors?.email?.message}
              placeholder="Enter email"
            />
            <CustomInput
              name="license"
              label="License"
              register={register}
              errorMsg={errors?.license?.message}
              placeholder="Enter license"
            />

            <CustomInput
              name="working_hours"
              label="Working Hours"
              register={register}
              errorMsg={errors?.working_hours?.message}
              placeholder="09:00 - 17:00"
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
              className="w-full rounded-lg bg-gray-100 p-3 text-base text-xs text-grey100"
              placeholder="Enter address"
            />
            {errors?.address?.message && (
              <p className="w-full text-left text-xs text-red-500">
                {errors?.address?.message as string}
              </p>
            )}
          </div>

          <div className="col-span-2 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            <CustomButton
              name={selectedBranch?.branch_id ? "Update" : "Save"}
              handleClick={handleSubmit(onSubmit)}
              loading={isLoading || updateLoading}
              disabled={isLoading || updateLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddBranchModal;
