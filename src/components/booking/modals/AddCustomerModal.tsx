import React, { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import Combobox from "../../ui/Combobox";
import { RiArrowDownSLine } from "react-icons/ri";
import CustomButton from "../../ui/CustomButton";
import { useForm } from "react-hook-form";
import CustomDatePicker from "../../ui/CustomDatePicker";
import { IoCalendarOutline } from "react-icons/io5";
import dayjs from "dayjs";
import {
  useAddCustomerMutation,
  useFetchNationalityQuery,
  useUpdateCustomerMutation,
} from "../../../store/services/booking";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import { useFetchSourcesQuery } from "../../../store/services/filters";

interface AddCustomerModalProps {
  open: boolean;
  customerId?: string;
  userId?: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editMode?: boolean;
  userData?: any;
}

const genderOptions = [
  { id: "Male", name: "Male" },
  { id: "Female", name: "Female" },
];

const AddCustomerModal = ({
  open,
  userId,
  customerId,
  setOpen,
  editMode,
  userData,
}: AddCustomerModalProps) => {
  const [gender, setGender] = useState<ListOptionProps | null>(null);
  const [source, setSource] = useState<ListOptionProps | null>(null);
  const [nationality, setNationality] = useState<ListOptionProps | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | string>(new Date());
  const { register, setValue, reset, handleSubmit, watch } = useForm();

  const [addCustomer, { isLoading }] = useAddCustomerMutation();
  const [updateCustomer] = useUpdateCustomerMutation();
  const { data: sources } = useFetchSourcesQuery({}, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  })
  const { data: nationalities } = useFetchNationalityQuery({}, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    console.log(editMode, userData, 'userDatauserData')
    if (editMode && userData) {
      setValue("firstname", userData.firstname);
      setValue("lastname", userData.lastname);
      setValue("phone", userData.phone);
      setValue("email", userData.email);
      setValue("date_of_birth", dayjs(userData.date_of_birth).toDate());
      setValue("is_allergy", userData.is_allergy === "1" ? "yes" : "no");
      setValue("allergy_description", userData.allergy_description);
      setValue("is_medication", userData.is_medication === "1" ? "yes" : "no");
      setValue("medication_description", userData.medication_description);
      setValue(
        "is_medical_condition",
        userData.is_medical_conition === "1" ? "yes" : "no"
      );
      setValue(
        "medical_condition_description",
        userData.medical_condition_description
      );
      setDateOfBirth(dayjs(userData.date_of_birth).toDate());

      // Setting source and gender based on userData values
      const matchedSource = sources?.find(
        (opt) => opt.id === parseInt(userData.customer_source_id)
      );
      setSource(matchedSource || null);
      setValue("customer_source_id", matchedSource ? matchedSource.id : "");

      const matchedGender = genderOptions.find(
        (opt) => opt.id === userData.gender
      );
      setGender(matchedGender || null);
      setValue("gender", matchedGender ? matchedGender.id : "");
      setValue("nationality", userData?.nationality || "");

      setNationality({
        id: userData.nationality_id,
        name: userData.nationality,
      });
    }
  }, [editMode, userData, setValue]);

  const handleSelectGender = (value: ListOptionProps) => {
    setGender(value);
    setValue("gender", value.id);
  };

  const handleSelectSource = (value: ListOptionProps) => {
    setSource(value);
    setValue("customer_source_id", value.id);
  };

  const handleSelectNationality = (value: ListOptionProps) => {
    setNationality(value);
    setValue("nationality", value.id);
  };

  const handleSave = async (data: any) => {
    try {
      if (userId) {
        const urlencoded = new URLSearchParams();
        urlencoded.append("user_id", String(userId));
        urlencoded.append("customer_source_id", data?.customer_source_id);
        urlencoded.append("firstname", data?.firstname);
        urlencoded.append("lastname", data?.lastname);
        urlencoded.append("phone", data?.phone);
        urlencoded.append("email", data?.email);
        urlencoded.append(
          "date_of_birth",
          dayjs(dateOfBirth).format("YYYY-MM-DD")
        );
        urlencoded.append("gender", data?.gender);
        urlencoded.append("nationality", data?.nationality);
        urlencoded.append("is_allergy", data?.is_allergy === "yes" ? "1" : "0");
          urlencoded.append(
            "allergy_description",
            data?.allergy_description || ""
          );
        urlencoded.append(
          "is_medication",
          data?.is_medication === "yes" ? "1" : "0"
        );
          urlencoded.append(
            "medication_description",
            data?.medication_description || ""
          );
        urlencoded.append(
          "is_medical_conition",
          data?.is_medical_condition === "yes" ? "1" : "0"
        );
          urlencoded.append(
            "medical_condition_description",
            data?.medical_condition_description || ""
          );
        urlencoded.append("special_notes", "abc");

        let response
        if (editMode) {
          if (customerId) {
            urlencoded.append("customer_id", customerId);
            response = await updateCustomer(urlencoded);
          }
        } else {
          response = await addCustomer(urlencoded);
        }
        if (response?.error) {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="error"
              title="Error"
              message={`Something Went Wrong!`}
            />
          ));
        } else {
          setNationality(null);
          setDateOfBirth(new Date());
          setSource(null);
          setGender(null);
          reset({
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            medical_condition_description: "",
            is_medical_condition: "",
            medication_description: "",
            allergy_description: "",
            is_medication: "",
            is_allergy: "",
            nationality: "",
            gender: "",
            date_of_birth: "",
          });
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="success"
              title="Success"
              message={`Successfully ${editMode ? 'Updated' : 'Added'} Customer!`}
            />
          ));
          closeModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  const isAllergy = watch("is_allergy");
  const isMedication = watch("is_medication");
  const isMedicalCondition = watch("is_medical_condition");
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[70%] max-w-[80%]"
      title={editMode ? "Edit Client" : "New Customer"}
    >
      <div className="w-full px-6 py-7">
        <p className="text-left text-[18px] font-bold text-primary">
          Personal Details
        </p>
        <div className="mt-4 w-full">
          <div className="flex w-full items-center justify-center gap-5">
            <CustomInput
              name="firstname"
              placeholder="First Name"
              label="First Name"
              register={register}
            />
            <CustomInput
              name="lastname"
              placeholder="Last Name"
              label="Last Name"
              register={register}
            />
            <div className="flex w-full items-center justify-center gap-2">
              <div className="w-full">
                <label className="mb-0.5 w-full text-left text-xs font-medium text-grey100">
                  Select Date
                </label>
                <CustomDatePicker
                  date={dateOfBirth}
                  setDate={setDateOfBirth}
                  toggleClassName="-right-20"
                  toggleButton={
                    <div className="flex w-full items-center justify-between rounded-lg bg-gray-100 p-3 text-xs font-medium">
                      <p className="whitespace-nowrap">
                        {dayjs(dateOfBirth).format("DD MMM YYYY")}
                      </p>
                      <div>
                        <IoCalendarOutline className="h-5 w-5 text-grey100" />
                      </div>
                    </div>
                  }
                />
              </div>
              <Combobox
                value={source}
                options={sources}
                handleSelect={handleSelectSource}
                label="Source"
                placeholder="Select Source"
                mainClassName="w-full mt-1"
                toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                isSearch={false}
              />
            </div>
          </div>
          <div className="my-4 flex w-full items-center justify-center gap-5">
            <CustomInput
              name="phone"
              label="Mobile No."
              placeholder="Mobile No."
              register={register}
            />
            <CustomInput
              name="email"
              label="Email"
              placeholder="Email"
              type="text"
              register={register}
            />
            <div className="flex w-full items-center justify-center gap-2">
              <Combobox
                value={gender}
                options={genderOptions}
                handleSelect={handleSelectGender}
                label="Gender"
                placeholder="Gender"
                mainClassName="w-full"
                toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                isSearch={false}
              />
              <Combobox
                value={nationality}
                options={nationalities}
                handleSelect={handleSelectNationality}
                label="Nationality"
                placeholder="Nationality"
                mainClassName="w-full"
                toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                isSearch={false}
              />
            </div>
          </div>
        </div>

        <p className="pt-3 text-left text-[18px] font-bold text-primary">
          Medical Details
        </p>

        <div className="w-full px-6 py-4">
          <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
            <p className="w-[40%] text-left text-[14px] font-semibold text-[#656565]">
              Allergies:
            </p>

            <label className="flex items-center gap-2">
              <input type="radio" value="yes" {...register("is_allergy")} />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" value="no" {...register("is_allergy")} />
              <span>No</span>
            </label>

            <CustomInput
              name="allergy_description"
              label=""
              placeholder="Please Specify"
              register={register}
              disabled={!isAllergy || isAllergy === "no"}
            />
          </div>
          <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
            <p className="w-[40%] text-left text-[14px] font-semibold text-[#656565]">
              Medications:
            </p>

            <label className="flex items-center gap-2">
              <input type="radio" value="yes" {...register("is_medication")} />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input type="radio" value="no" {...register("is_medication")} />
              <span>No</span>
            </label>

            <CustomInput
              name="medication_description"
              label=""
              placeholder="Please Specify"
              register={register}
              disabled={!isMedication || isMedication === "no"}
            />
          </div>
          <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
            <p className="w-[40%] text-left text-[14px] font-semibold text-[#656565]">
              Medical Conditions:
            </p>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                {...register("is_medical_condition")}
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                {...register("is_medical_condition")}
              />
              <span>No</span>
            </label>
            <CustomInput
              name="medical_condition_description"
              label=""
              placeholder="Please Specify"
              register={register}
              disabled={!isMedicalCondition || isMedicalCondition === "no"}
            />
          </div>

          <div className="mt-7 flex w-full justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={closeModal}
              style="bg-danger"
            />
            <CustomButton
              name={editMode ? "Update" : "Save"}
              handleClick={handleSubmit(handleSave)}
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddCustomerModal;
