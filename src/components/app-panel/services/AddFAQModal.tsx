import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  useAddFAQMutation,
  useUpdateFAQMutation,
} from "../../../store/services/service";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import { FiEdit } from "react-icons/fi";

interface AddFAQModalProps {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFAQ?: FAQProps | null;
  serviceId?: string;
  refetch: () => void;
  isView: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FAQPayload {
  question: string;
  answer: string;
  user_id: number;
  service_id?: string;
  id?: string;
}

const AddFAQModal = ({
  isOpen,
  setOpen,
  selectedFAQ,
  serviceId,
  refetch,
  isView,
  setIsView
}: AddFAQModalProps) => {
  const { user } = useSelector((state: RootState) => state.global);
  const [addFAQ, { isLoading: isLoadingAdd }] = useAddFAQMutation();
  const [updateFAQ, { isLoading: isLoadingUpdate }] = useUpdateFAQMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FAQPayload>();

  const handleClose = () => {
    setOpen(false);
    resetState()
  };

  const resetState = () => {
    reset({
      question: "",
      answer: "",
    })
  }

  const handleFormSubmit = async (data: FAQPayload) => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("question", data.question);
    urlencoded.append("answer", data.answer);
    urlencoded.append("user_id", String(user?.id));

    if (selectedFAQ?.id) {
      urlencoded.append("faq_id", selectedFAQ.id);
    } else {
      urlencoded.append("service_id", serviceId || "");
    }

    try {
      const response = selectedFAQ
        ? await updateFAQ(urlencoded)
        : await addFAQ(urlencoded);

      if (response?.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Failed to submit FAQ."
          />
        ));
      } else {
        refetch()
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`FAQ ${selectedFAQ ? "updated" : "added"} successfully.`}
          />
        ));
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting FAQ:", error);
    }
  };

  useEffect(() => {
    if (selectedFAQ) {
      reset({
        question: selectedFAQ.question,
        answer: selectedFAQ.answer,
      });
    }
  }, [selectedFAQ, reset]);

  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen])

  return (
    <Modal open={isOpen} setOpen={setOpen} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {selectedFAQ ? `${isView ? 'View' : 'Edit'} FAQ` : "Add FAQ"}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {isView && (
              <FiEdit onClick={() => setIsView?.(false)} className="h-6 w-6 cursor-pointer text-white" />
            )}
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <CustomInput
              name="question"
              label="Question"
              register={register}
              errorMsg={errors?.question?.message}
              placeholder="Enter question"
              disabled={isView}
            />

            <div className="flex w-full flex-col space-y-1">
              <label className="text-xs font-medium text-grey100">Answer</label>
              <textarea
                {...register("answer")}
                rows={4}
                className="w-full rounded-lg bg-gray-100 p-3 text-xs text-grey100"
                placeholder="Enter answer"
                disabled={isView}
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
              {!isView && (
                <CustomButton
                  name={selectedFAQ ? "Update" : "Save"}
                  handleClick={() => { }}
                  loading={isLoadingAdd || isLoadingUpdate}
                  disabled={isLoadingAdd || isLoadingUpdate}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddFAQModal;
