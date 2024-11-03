import React, { useEffect } from "react";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { useUpdateCustomerMutation } from "../../../store/services/booking";
import { useForm } from "react-hook-form";

interface AddMedicalDetailModalProps {
  open: boolean;
  selectedUser?: CustomerProps;
  setSelectedUser: React.Dispatch<React.SetStateAction<CustomerProps | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddMedicalDetailModal = ({
  open,
  selectedUser,
  setSelectedUser,
  setOpen,
}: AddMedicalDetailModalProps) => {
  const [updateCustomer, { isLoading }] = useUpdateCustomerMutation();

  const { register, reset, setValue, handleSubmit, watch } = useForm();

  const isAllergy = watch("is_allergy");
  const isMedication = watch("is_medication");
  const isMedicalCondition = watch("is_medical_condition");

  const handleSave = async (data: any) => {
    try {
      if (selectedUser?.customer_id) {
        const urlencoded = new URLSearchParams();
        urlencoded.append("user_id", selectedUser?.user_id || "");
        urlencoded.append("customer_id", selectedUser?.customer_id);
        urlencoded.append(
          "customer_source_id",
          selectedUser?.customer_source_id || ""
        );
        urlencoded.append("firstname", selectedUser?.firstname);
        urlencoded.append("lastname", selectedUser?.lastname);
        urlencoded.append("phone", selectedUser?.phone);
        urlencoded.append("email", selectedUser?.email);
        urlencoded.append("date_of_birth", selectedUser?.date_of_birth);
        urlencoded.append("gender", selectedUser?.gender);
        urlencoded.append("nationality", selectedUser?.nationality);
        urlencoded.append("is_allergy", data?.is_allergy === "yes" ? "1" : "0");
        if (data?.is_allergy === "yes") {
          urlencoded.append(
            "allergy_description",
            data?.allergy_description || ""
          );
        }
        urlencoded.append(
          "is_medication",
          data?.is_medication === "yes" ? "1" : "0"
        );
        if (data?.is_medication === "yes") {
          urlencoded.append(
            "medication_description",
            data?.medication_description || ""
          );
        }
        urlencoded.append(
          "is_medical_conition",
          data?.is_medical_condition === "yes" ? "1" : "0"
        );
        if (data?.is_medical_condition === "yes") {
          urlencoded.append(
            "medical_condition_description",
            data?.medical_condition_description || ""
          );
        }
        urlencoded.append("special_notes", "abc");
        await updateCustomer(urlencoded);
        setSelectedUser({
          ...selectedUser,
          is_allergy: data?.is_allergy === "yes" ? "1" : "0",
          allergy_description: data?.allergy_description,
          is_medication: data?.is_medication === "yes" ? "1" : "0",
          medication_description: data?.medication_description,
          is_medical_conition: data?.is_medical_condition === "yes" ? "1" : "0",
          medical_condition_description: data?.medical_condition_description,
        });
        reset({
          medical_condition_description: "",
          is_medical_condition: "",
          medication_description: "",
          allergy_description: "",
          is_medication: "",
          is_allergy: "",
        });
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (selectedUser?.customer_id) {
      setValue("is_allergy", selectedUser.is_allergy === "1" ? "yes" : "no");
      setValue("allergy_description", selectedUser.allergy_description);
      setValue(
        "is_medication",
        selectedUser.is_medication === "1" ? "yes" : "no"
      );
      setValue("medication_description", selectedUser.medication_description);
      setValue(
        "is_medical_condition",
        selectedUser.is_medical_conition === "1" ? "yes" : "no"
      );
      setValue(
        "medical_condition_description",
        selectedUser.medical_condition_description
      );
    }
  }, [selectedUser]);

  useEffect(() => {
    if (isAllergy === "no") {
      setValue("allergy_description", "");
    } else {
      setValue("allergy_description", selectedUser?.allergy_description);
    }
    if (isMedication === "no") {
      setValue("medication_description", "");
    } else {
      setValue("medication_description", selectedUser?.allergy_description);
    }
    if (isMedicalCondition === "no") {
      setValue("medical_condition_description", "");
    } else {
      setValue(
        "medical_condition_description",
        selectedUser?.allergy_description
      );
    }
  }, [isAllergy, isMedicalCondition, isMedication]);
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[60%] max-w-[80%]"
      title="Add Medical Detail"
    >
      <div className="w-full px-6 py-4">
        <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
          <p className="w-[40%] text-left text-[14px] font-semibold text-[#656565]">
            Allergies:
          </p>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="yes"
              {...register("is_allergy")}
              className="custom-radio"
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="no"
              {...register("is_allergy")}
              className="custom-radio"
            />
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
            <input
              type="radio"
              value="yes"
              {...register("is_medication")}
              className="custom-radio"
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="no"
              {...register("is_medication")}
              className="custom-radio"
            />
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
              className="custom-radio"
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="no"
              {...register("is_medical_condition")}
              className="custom-radio"
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
            name="Update"
            handleClick={handleSubmit(handleSave)}
            loading={isLoading}
            disabled={isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddMedicalDetailModal;
