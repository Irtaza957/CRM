import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import Combobox from "../../ui/Combobox";
import { RiArrowDownSLine } from "react-icons/ri";
import CustomButton from "../../ui/CustomButton";
import {
  useAddFamilyMutation,
  useUpdateFamilyMutation,
} from "../../../store/services/booking";
import { useForm } from "react-hook-form";
import CustomDatePicker from "../../ui/CustomDatePicker";
import dayjs from "dayjs";
import { IoCalendarOutline } from "react-icons/io5";
import CustomToast from "../../ui/CustomToast";
import { toast } from "sonner";

interface AddAddressModalProps {
  open: boolean;
  customerId?: string;
  userId?: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getFamily: (agr0: string) => void;
  editableFamilyMember?: any;
}

const options = [
  { id: 1, name: "Male" },
  { id: 2, name: "Female" },
  { id: 3, name: "Other" },
];

const AddFamilyMemberModal = ({
  open,
  customerId,
  userId,
  setOpen,
  getFamily,
  editableFamilyMember,
}: AddAddressModalProps) => {
  const [date, setDate] = useState<string | Date>(dayjs().toDate());
  const [gender, setGender] = useState<ListOptionProps | null>(null);
  const [relationship, setRelationship] = useState<ListOptionProps | null>(
    null
  );

  const { register, setValue, reset, handleSubmit, watch } = useForm();
  const isAllergy = watch("allergies");
  const isMedication = watch("medications");
  const isMedicalCondition = watch("medicalConditions");

  const [addFamily, { isLoading }] = useAddFamilyMutation();
  const [updateFamily] = useUpdateFamilyMutation();

  const handleSelectGender = (value: ListOptionProps) => {
    setGender(value);
  };

  const handleSelectRelationship = (value: ListOptionProps) => {
    setRelationship(value);
  };

  const resetState = () => {
    reset({
      allergiesDesc: "",
      date_of_birth: "",
      last_name: "",
      first_name: "",
      relation: "",
      gender: "",
      medicalConditionDesc: "",
      medicalConditions: "",
      medicationsDesc: "",
      medications: "",
      allergies: "",
    });
    setDate(dayjs().toDate());
    setGender(null);
    setRelationship(null);
  };

  const handleSave = async (data: any) => {
    try {
      if (customerId && userId) {
        const urlencoded = new URLSearchParams();
        urlencoded.append("user_id", String(userId));
        urlencoded.append("customer_id", customerId);
        urlencoded.append("relationship", relationship?.name || "");
        urlencoded.append("firstname", data?.first_name);
        urlencoded.append("lastname", data?.last_name);
        urlencoded.append("date_of_birth", data?.date_of_birth);
        urlencoded.append("gender", gender?.name || "");
        urlencoded.append("is_allergy", data?.allergies === "yes" ? "1" : "0");
        urlencoded.append("allergy_description", data?.allergiesDesc);
        urlencoded.append(
          "is_medication",
          data?.medications === "yes" ? "1" : "0"
        );
        urlencoded.append("medication_description", data?.medicationsDesc);
        urlencoded.append(
          "is_medical_condition",
          data?.medicalConditions === "yes" ? "1" : "0"
        );
        urlencoded.append(
          "medical_condition_description",
          data?.medicalConditionDesc
        );
        let response;
        if (editableFamilyMember?.family_member_id) {
          urlencoded.append(
            "family_member_id",
            editableFamilyMember?.family_member_id
          );
          response = await updateFamily(urlencoded);
        } else {
          response = await addFamily(urlencoded);
        }
        if (response?.error) {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="error"
              title="Error"
              message="Something Went Wrong!"
            />
          ));
        } else {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="success"
              title="Success"
              message={`Successfully ${editableFamilyMember?.family_member_id ? "Updated" : "Added"} Family Member!`}
            />
          ));
          getFamily(customerId);
          closeModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDate = (newDate: string | Date) => {
    setDate(newDate);
    setValue("date_of_birth", newDate);
  };

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (editableFamilyMember && editableFamilyMember?.family_member_id) {
      // Ensure values are properly mapped
      setValue("first_name", editableFamilyMember.firstname || "");
      setValue("last_name", editableFamilyMember.lastname || "");
      setValue("relation", editableFamilyMember.relationship || "");

      // Set date if available
      setDate(
        editableFamilyMember.date_of_birth
          ? editableFamilyMember.date_of_birth
          : dayjs().toDate()
      );

      // Find the gender option matching the editable member's gender
      setGender(
        options.find((option) => option.name === editableFamilyMember.gender) ||
          null
      );

      setRelationship(
        options.find(
          (option) => option.name === editableFamilyMember.relationship
        ) || null
      );

      // Radio buttons - convert to "yes"/"no" for the UI if needed
      setValue(
        "allergies",
        editableFamilyMember.is_allergy === "1" ? "yes" : "no"
      );
      setValue("allergiesDesc", editableFamilyMember.allergy_description || "");

      setValue(
        "medications",
        editableFamilyMember.is_medication === "1" ? "yes" : "no"
      );
      setValue(
        "medicationsDesc",
        editableFamilyMember.medication_description || ""
      );
      ``;
      setValue(
        "medicalConditions",
        editableFamilyMember.is_medical_condition === "1" ? "yes" : "no"
      );
      setValue(
        "medicalConditionDesc",
        editableFamilyMember.medical_condition_description || ""
      );
    }
  }, [editableFamilyMember, reset, setValue]);

  useEffect(() => {
    if (isAllergy === "no") {
      setValue("allergiesDesc", "");
    } else {
      setValue("allergiesDesc", editableFamilyMember?.allergy_description);
    }
    if (isMedication === "no") {
      setValue("medicationsDesc", "");
    } else {
      setValue("medicationsDesc", editableFamilyMember?.medication_description);
    }
    if (isMedicalCondition === "no") {
      setValue("medicalConditionDesc", "");
    } else {
      setValue(
        "medicalConditionDesc",
        editableFamilyMember?.medical_condition_description
      );
    }
  }, [isAllergy, isMedicalCondition, isMedication]);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="max-h-[80%] w-[60%] max-w-[80%]"
      title={
        editableFamilyMember?.family_member_id
          ? "Edit Family Member"
          : "Add Family Member"
      }
    >
      <div className="h-auto max-h-[450px] w-full overflow-y-scroll px-6 py-7">
        <p className="text-left text-[18px] font-bold text-primary">
          Personal Details
        </p>
        <div className="mt-4 w-full">
          <div className="flex w-full items-center justify-center gap-5">
            <CustomInput
              name="first_name"
              placeholder="First Name"
              label="First Name"
              register={register}
            />
            <CustomInput
              name="last_name"
              placeholder="Last Name"
              label="Last Name"
              register={register}
            />
            <div className="flex w-full flex-col">
              <p className="mb-0.5 w-full text-left text-xs font-medium text-grey100">
                DOB
              </p>
              <div className="flex h-10 w-full rounded-[6px] bg-[#F5F6FA] px-2.5">
                <CustomDatePicker
                  date={date}
                  setDate={(newDate) => handleDate(newDate)}
                  toggleButton={
                    <div className="flex h-10 w-full items-center justify-between gap-4 text-gray-500">
                      {dayjs(date).format("DD MMM YYYY")}
                      <IoCalendarOutline />
                    </div>
                  }
                />
              </div>
            </div>
          </div>
          <div className="my-4 flex w-[66%] items-center justify-center gap-5">
            <Combobox
              value={relationship}
              options={options}
              handleSelect={handleSelectRelationship}
              label="Relationship"
              placeholder="Relationship"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
            />
            <Combobox
              value={gender}
              options={options}
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
          </div>
          <hr className="border-b" />
          <p className="pt-3 text-left text-[18px] font-bold text-primary">
            Medical Details
          </p>
          {/* start */}
          <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
            <p className="w-[40%] text-left text-[14px] font-semibold text-[#656565]">
              Allergies:
            </p>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                {...register("allergies")}
                className="custom-radio"
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                {...register("allergies")}
                className="custom-radio"
              />
              <span>No</span>
            </label>

            <CustomInput
              name="allergiesDesc"
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
              <input
                type="radio"
                value="yes"
                {...register("medications")}
                className="custom-radio"
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                {...register("medications")}
                className="custom-radio"
              />
              <span>No</span>
            </label>

            <CustomInput
              name="medicationsDesc"
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
                {...register("medicalConditions")}
                className="custom-radio"
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                {...register("medicalConditions")}
                className="custom-radio"
              />
              <span>No</span>
            </label>

            {/* Text Input to Specify Allergies */}
            <CustomInput
              name="medicalConditionDesc"
              label=""
              placeholder="Please Specify"
              register={register}
              disabled={!isMedicalCondition || isMedicalCondition === "no"}
            />
          </div>
          {/* end */}
          <div className="mt-7 flex w-full justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={closeModal}
              style="bg-danger"
            />
            <CustomButton
              name={editableFamilyMember?.family_member_id ? "Update" : "Save"}
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

export default AddFamilyMemberModal;
