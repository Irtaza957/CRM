import { useForm } from "react-hook-form";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { IoClose } from "react-icons/io5";
import { useCreateSectionMutation, useUpdateSectionMutation } from "../../../store/services/service";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import CommonTextarea from "../../ui/CommonTextarea";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServiceId: string;
  refetch: () => void;
  selectedSection?: SectionProps | null;
  isView: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddSectionModal = ({
  isOpen,
  onClose,
  selectedServiceId,
  refetch,
  selectedSection,
  isView,
  setIsView
}: AddSectionModalProps) => {
  const [createSection, { isLoading: isLoadingAdd }] = useCreateSectionMutation();
  const [updateSection, { isLoading: isLoadingUpdate }] = useUpdateSectionMutation();
  const { user } = useSelector((state: RootState) => state.global);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    reset();
    onClose();
  };

  const resetState = () => {
    reset({
      name: "",
      description: "",
    })
    handleClose()
  }

  const handleFormSubmit = async (data: any) => {
    try {
      if (!selectedServiceId) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Something Went Wrong!`}
          />
        ));
        return
      }
      const urlencoded = new URLSearchParams();
      urlencoded.append("name", data?.name);
      urlencoded.append("description", data?.description);
      urlencoded.append("rows", data?.rows);
      urlencoded.append("user_id", String(user?.id));
      let response
      if (selectedSection?.id) {
        urlencoded.append("section_id", selectedSection?.id)
        response = await updateSection(urlencoded)
      } else {
        urlencoded.append("service_id", selectedServiceId);
        response = await createSection(urlencoded)
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
        resetState()
        refetch()
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Successfully ${selectedSection?.id ? "Updated" : "Added"} Section!`}
          />
        ));
        handleClose()
      }
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    if (selectedSection) {
      setValue("name", selectedSection.name)
      setValue("rows", selectedSection?.rows)
      setValue("description", selectedSection.description)
    }
  }, [selectedSection])

  useEffect(() => {
    if (!isOpen) {
      resetState()
    }
  }, [isOpen])

  return (
    <Modal open={isOpen} setOpen={handleClose} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">{selectedSection?.id ? `${isView ? 'View' : 'Edit'}` : "Add"} Section</h1>
          <div className="flex items-center justify-center gap-2">
            {isView && (
              <FiEdit
                onClick={() => setIsView?.(false)}
                className="h-6 w-6 cursor-pointer text-white"
              />
            )}
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <div className="space-y-4">
              <CustomInput
                name="name"
                label="Name"
                register={register}
                errorMsg={errors?.name?.message}
                placeholder="Enter name..."
                disabled={isView}
              />
              <CommonTextarea
                name="description"
                register={register}
                errors={errors}
                disabled={isView}
                placeholder="Enter description..."
                title="Description"
                rows={6}
              />

            <div className="flex justify-end space-x-3 pt-8">
              <CustomButton
                name="Cancel"
                handleClick={handleClose}
                style="bg-danger"
              />
              {!isView && (
                <CustomButton
                  name={selectedSection?.id ? "Update" : "Save"}
                  handleClick={handleSubmit(handleFormSubmit)}
                  loading={isLoadingAdd || isLoadingUpdate}
                  disabled={isLoadingAdd || isLoadingUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddSectionModal;
