import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { IoClose } from "react-icons/io5";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    service_id: string;
  }) => void;
}

const AddSectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddSectionModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
  ];

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: any) => {
    onSubmit(data);
    handleClose();
  };

  return (
    <Modal open={isOpen} setOpen={handleClose} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Add Section</h1>
          <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <CustomInput
              name="name"
              label="Name"
              register={register}
              errorMsg={errors?.name?.message}
              placeholder="Enter name"
            />

            <div className="flex w-full flex-col space-y-1">
              <label className="text-xs font-medium text-grey100">
                Description
              </label>
              <ReactQuill
                theme="snow"
                onChange={(value) => setValue("description", value)}
                modules={modules}
                formats={formats}
                className="mb-12 h-32"
              />
              {errors?.description?.message && (
                <p className="text-xs text-red-500">
                  {errors?.description?.message as string}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-9">
              <CustomButton
                name="Cancel"
                handleClick={handleClose}
                style="bg-danger"
              />
              <CustomButton name="Save" handleClick={()=>{}} />
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddSectionModal;
