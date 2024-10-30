import React, { useState } from "react";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import Combobox from "../../ui/Combobox";
import { RiArrowDownSLine } from "react-icons/ri";
import CustomButton from "../../ui/CustomButton";
import { useAddFamilyMutation } from "../../../store/services/booking";
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
  getFamily: (agr0: string)=>void
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
  getFamily
}: AddAddressModalProps) => {
  const [date, setDate] = useState<string | Date>(dayjs().toDate());
  const [gender, setGender] = useState<ListOptionProps | null>(null);

  const [addFamily, { isLoading }] = useAddFamilyMutation();

  const { register, setValue, reset, handleSubmit } = useForm();



  const handleSelectGender = (value: ListOptionProps) => {
    setGender(value);
    setValue('gender', value.name)
  };

  const handleSave = async (data: any) => {
    try {
      if (customerId && userId) {
        const urlencoded = new URLSearchParams();
        urlencoded.append("user_id", String(userId));
        urlencoded.append("customer_id", customerId);
        urlencoded.append("relationship", data?.relation);
        urlencoded.append("firstname", data?.first_name);
        urlencoded.append("lastname", data?.last_name);
        urlencoded.append("date_of_birth", data?.date_of_birth);
        urlencoded.append("gender", data?.gender);
        urlencoded.append("is_allergy", data?.allergies);
        urlencoded.append("allergy_description", data?.allergiesDesc);
        urlencoded.append("is_medication", data?.medicalConditions);
        urlencoded.append("medication_description", data?.medicalConditionDesc);
        urlencoded.append("is_medical_condition", data?.medications);
        urlencoded.append("medical_condition_description", data?.medicationsDesc);
        console.log(urlencoded, 'urlencodedurlencoded')
        await addFamily(urlencoded);
        reset({
          first_name: '',
          last_name: '',
          relation: '',
          date_of_birth: '',
          gender: '',
          allergies: '',
          allergiesDesc: '',
          medications: '',
          medicationsDesc: '',
          medicalConditions: '',
          medicalConditionDesc: ''
        });
        setDate(dayjs().toDate());
        setGender(null);
        getFamily(customerId);
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Successfully Added Family Member!"
          />
        ));
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDate=(newDate: string | Date)=>{
    setDate(newDate)
    setValue('date_of_birth', newDate)
  }

  const closeModal = () => {
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[60%] max-w-[80%] max-h-[80%]"
      title="Family Member"
    >
      <div className="w-full px-6 py-7">
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
              <p className="w-full text-left text-xs text-grey100 font-medium mb-0.5">DOB</p>
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
            <CustomInput
              name="relation"
              label="Relationship"
              placeholder="Select Relationship"
              register={register}
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
            <p className="text-left text-[14px] font-semibold text-[#656565] w-[40%]">
              Allergies:
            </p>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                {...register("allergies")}
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                {...register("allergies")}
              />
              <span>No</span>
            </label>

            <CustomInput
              name="allergiesDesc"
              label=""
              placeholder="Please Specify"
              register={register}
            />
          </div>
          <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
            <p className="text-left text-[14px] font-semibold text-[#656565] w-[40%]">
            Medications:
            </p>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="yes"
                {...register("medications")}
              />
              <span>Yes</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="no"
                {...register("medications")}
              />
              <span>No</span>
            </label>

            <CustomInput
              name="medicationsDesc"
              label=""
              placeholder="Please Specify"
              register={register}
            />
          </div>
          <div className="my-4 flex w-full flex-row items-center justify-start gap-5">
            <p className="text-left text-[14px] font-semibold text-[#656565] w-[40%]">
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
              <input
                type="radio"
                value="no"
                {...register("medicalConditions")}
              />
              <span>No</span>
            </label>

            {/* Text Input to Specify Allergies */}
            <CustomInput
              name="medicalConditionDesc"
              label=""
              placeholder="Please Specify"
              register={register}
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
              name="Save"
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
