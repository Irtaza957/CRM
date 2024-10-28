import React from "react";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { useAddAddressMutation } from "../../../store/services/booking";
import { useForm } from "react-hook-form";

interface AddMedicalDetailModalProps {
  open: boolean;
  customerId?: string;
  userId?: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddMedicalDetailModal = ({
  open,
  customerId,
  userId,
  setOpen,
}: AddMedicalDetailModalProps) => {
  const [addAddress, { isLoading }] = useAddAddressMutation();
  //   const [fetchAddresses] = useFetchCustomerAddressesMutation();

  const { register, setValue, reset, handleSubmit } = useForm();

  const handleSave = async (data) => {
    try {
      if (customerId && userId) {
        const urlencoded = new URLSearchParams();
        urlencoded.append("user_id", String(userId));
        urlencoded.append("customer_id", customerId);
        await addAddress(urlencoded);
        reset();
        // await fetchAddresses(customerId);
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[60%] max-w-[80%]"
      title="Family Member"
    >
      <div className="w-full px-6 py-4">
        <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
          <p className="w-[40%] text-left text-[14px] font-semibold text-[#656565]">
            Allergies:
          </p>

          <label className="flex items-center gap-2">
            <input type="radio" value="yes" {...register("allergies")} />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" value="no" {...register("allergies")} />
            <span>No</span>
          </label>

          <CustomInput
            name="allergiesDetails"
            label=""
            placeholder="Please Specify"
            register={register}
          />
        </div>
        <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
          <p className="w-[40%] text-left text-[14px] font-semibold text-[#656565]">
            Medications:
          </p>

          <label className="flex items-center gap-2">
            <input type="radio" value="yes" {...register("medications")} />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" value="no" {...register("medications")} />
            <span>No</span>
          </label>

          <CustomInput
            name="medications"
            label=""
            placeholder="Please Specify"
            register={register}
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
              {...register("medicalConditions:")}
            />
            <span>Yes</span>
          </label>

          <label className="flex items-center gap-2">
            <input type="radio" value="no" {...register("medicalConditions")} />
            <span>No</span>
          </label>

          <CustomInput
            name="medicalConditions"
            label=""
            placeholder="Please Specify"
            register={register}
          />
        </div>

        <div className="mt-7 flex w-full justify-end gap-3">
          <CustomButton
            name="Cancel"
            handleClick={closeModal}
            style="bg-danger"
          />
          <CustomButton
            name="Save"
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
