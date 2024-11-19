import { toast } from "sonner";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
import { HexColorPicker } from "react-colorful";
import { type Dispatch, type SetStateAction, useState } from "react";

import Modal from "../../../ui/Modal";
import { RootState } from "../../../../store";
import CustomInput from "../../../ui/CustomInput";
import CustomToast from "../../../ui/CustomToast";
import ImageUploader from "../../../ui/ImageUploader";
import { useCreateCategoryMutation } from "../../../../store/services/service";

interface AddCategoryModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddCategory = ({ open, setOpen }: AddCategoryModalProps) => {
  const [tagline, setTagline] = useState("");
  const [duration, setDuration] = useState("");
  const [color, setColor] = useState("#000000");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<File | string | null>(null);
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const { user } = useSelector((state: RootState) => state.global);
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const clearForm = () => {
    setTagline("");
    setDuration("");
    setColor("#000000");
    setDescription("");
    setIcon(null);
    setCategoryCode("");
    setCategoryName("");
    setThumbnail(null);
    setCoverImage(null);
  };

  const handleCategorySubmit = async () => {
    const formData = new FormData();
    formData.append("business_id", "1");
    formData.append("company_id", "1");
    formData.append("parent_id", "0");
    formData.append("code", categoryCode);
    formData.append("color", color);
    formData.append("category_name", categoryName);
    formData.append("tagline", tagline);
    formData.append("description", description);
    formData.append("icon", icon!);
    formData.append("thumbnail", thumbnail!);
    formData.append("cover_image", coverImage!);
    formData.append("duration", duration);
    formData.append("user_id", `${user?.id}`);

    try {
      const data = await createCategory(formData);
      if (data.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="error"
            message="Couldn't Create Category. Please Try Again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="success"
            message="Created Category Successfully!"
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
          message="Couldn't Create Category. Please Try Again!"
        />
      ));
    }
  };

  return (
    <Modal open={open} setOpen={setOpen} className="h-[80vh] w-[95%]">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-between rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">New Category</h1>
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
            label="Category Code"
            value={categoryCode}
            setter={setCategoryCode}
            placeholder="Name"
          />
          <CustomInput
            type="text"
            label="Category Name"
            value={categoryName}
            setter={setCategoryName}
            placeholder="Name"
          />
          <CustomInput
            type="text"
            label="Duration"
            value={duration}
            setter={setDuration}
            placeholder="30 - 45 Minutes"
          />
          <CustomInput
            type="text"
            label="Tagline"
            value={tagline}
            setter={setTagline}
            placeholder="Name"
          />
          <div className="col-span-1 flex w-full flex-col items-start justify-start gap-1">
            <label
              htmlFor="Category Color"
              className="w-full text-left text-xs text-gray-500"
            >
              Category Color
            </label>
            <HexColorPicker color={color} onChange={setColor} />
          </div>
          <div className="col-span-2 flex w-full flex-col items-center justify-center space-y-1">
            <label htmlFor="Description" className="w-full text-left">
              Description
            </label>
            <textarea
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg bg-gray-100 p-3 capitalize text-xs text-grey100"
            />
          </div>
          <div className="col-span-2 flex w-full flex-col items-center justify-center space-y-2.5">
            <h1 className="w-full text-left text-base font-bold text-primary">
              Image Gallery
            </h1>
            <div className="grid w-full grid-cols-6 gap-6">
              <ImageUploader label="Icon" setImage={setIcon} />
              <ImageUploader label="Thumbnail" setImage={setThumbnail} />
              <ImageUploader label="Cover Image" setImage={setCoverImage} />
            </div>
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

export default AddCategory;
