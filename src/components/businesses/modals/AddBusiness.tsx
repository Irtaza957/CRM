import { toast } from "sonner";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
import { type Dispatch, type SetStateAction, useState } from "react";

import Modal from "../../ui/Modal";
import { RootState } from "../../../store";
import CustomInput from "../../ui/CustomInput";
import CustomToast from "../../ui/CustomToast";
import { usePostBusinessMutation } from "../../../store/services/business";

interface AddBusinessModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddBusiness = ({ open, setOpen }: AddBusinessModalProps) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createBusiness, { isLoading }] = usePostBusinessMutation();
  const { user } = useSelector((state: RootState) => state.global);

  const clearForm = () => {
    setCode("");
    setName("");
    setDescription("");
  };

  const handleCategorySubmit = async () => {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    formData.append("user_id", `${user?.id}`);
    formData.append("description", description);

    try {
      const data = await createBusiness(formData);
      if (data.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="error"
            message="Couldn't Create Business. Please Try Again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="success"
            message="Created Business Successfully!"
          />
        ));
        clearForm();
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="error"
          message="Couldn't Create Business. Please Try Again!"
        />
      ));
    }
  };

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-3xl">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-between rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">New Business</h1>
          <IoClose
            onClick={() => {
              setOpen(false);
              clearForm();
            }}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCategorySubmit();
          }}
          className="no-scrollbar grid max-h-full w-full grid-cols-2 gap-5 overflow-auto p-5"
        >
          <CustomInput
            type="text"
            label="Company Code"
            value={code}
            setter={setCode}
            placeholder="Code"
          />
          <CustomInput
            type="text"
            label="Company Name"
            value={name}
            setter={setName}
            placeholder="Name"
          />
          <div className="col-span-2 flex w-full flex-col items-center justify-center space-y-1">
            <label htmlFor="Description" className="w-full text-left">
              Description
            </label>
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-gray-100 p-3 capitalize"
            />
          </div>
          <div className="col-span-2 flex w-full items-end justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="place-self-end rounded-lg bg-primary px-10 py-2 text-white"
            >
              {isLoading ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <LuLoader2 className="animate-spin" />
                  <span>Please Wait...</span>
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddBusiness;
