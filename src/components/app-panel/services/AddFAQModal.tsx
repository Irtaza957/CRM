import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface AddFAQModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFAQ?: FAQProps | null;
  serviceId?: string;
  onSubmit: (data: FAQPayload) => void;
}

interface FAQPayload {
  question: string;
  answer: string;
  user_id: number;
  service_id?: string;
  faq_id?: string;
}

const AddFAQModal = ({
  isOpen,
  setOpen,
  selectedFAQ,
  serviceId,
  onSubmit,
}: AddFAQModalProps) => {
  const { user } = useSelector((state: RootState) => state.global);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FAQPayload>();

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleFormSubmit = async (data: FAQPayload) => {
    const payload = {
      ...data,
      user_id: user?.id || 0,
      ...(selectedFAQ?.faq_id
        ? { faq_id: selectedFAQ.faq_id }
        : { service_id: serviceId }),
    };
    onSubmit(payload);
  };

  useEffect(() => {
    if (selectedFAQ) {
      reset({
        question: selectedFAQ.question,
        answer: selectedFAQ.answer,
      });
    }
  }, [selectedFAQ, reset]);

  return (
    <Modal open={isOpen} setOpen={setOpen} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {selectedFAQ ? "Edit FAQ" : "Add FAQ"}
          </h1>
          <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <CustomInput
              name="question"
              label="Question"
              register={register}
              errorMsg={errors?.question?.message}
              placeholder="Enter question"
            />

            <div className="flex w-full flex-col space-y-1">
              <label className="text-xs font-medium text-grey100">Answer</label>
              <textarea
                {...register("answer")}
                rows={4}
                className="w-full rounded-lg bg-gray-100 p-3 text-xs text-grey100"
                placeholder="Enter answer"
              />
              {errors?.answer?.message && (
                <p className="text-xs text-red-500">
                  {errors?.answer?.message as string}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-5">
              <CustomButton
                name="Cancel"
                handleClick={handleClose}
                style="bg-danger"
              />
              <CustomButton
                name={selectedFAQ ? "Update" : "Save"}
                handleClick={()=>{}}
              />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddFAQModal;
