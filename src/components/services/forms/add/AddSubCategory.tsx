import { toast } from "sonner";
import { useState } from "react";
import { useSelector } from "react-redux";
import { LuLoader2 } from "react-icons/lu";
import { HexColorPicker } from "react-colorful";
import { TiArrowSortedDown } from "react-icons/ti";

import {
  useCreateCategoryMutation,
  useFetchCategoryListQuery,
} from "../../../../store/services/service";
import Combobox from "../../../ui/Combobox";
import { RootState } from "../../../../store";
import CustomInput from "../../../ui/CustomInput";
import CustomToast from "../../../ui/CustomToast";
import ImageUploader from "../../../ui/ImageUploader";

const AddSubCategory = () => {
  const [tagline, setTagline] = useState("");
  const [duration, setDuration] = useState("");
  const [color, setColor] = useState("#000000");
  const [selectedCategory, setSelectedCategory] =
    useState<ListOptionProps | null>(null);
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const { user } = useSelector((state: RootState) => state.global);
  const { data, isLoading: fetching } = useFetchCategoryListQuery({});
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
    formData.append("parent_id", `${selectedCategory?.id}`);
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
            message="Couldn't Create Subcategory. Please Try Again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="success"
            message="Created Subcategory Successfully!"
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
          message="Couldn't Create Subcategory. Please Try Again!"
        />
      ));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCategorySubmit();
      }}
      className="grid w-full grid-cols-2 gap-5"
    >
      {!fetching && (
        <div className="col-span-1 flex w-full flex-col items-center justify-center gap-1">
          <label
            htmlFor="Parent Category"
            className="w-full text-left text-xs text-gray-500"
          >
            Parent Category
          </label>
          <Combobox
            options={data!}
            value={selectedCategory}
            placeholder="Parent Category"
            setValue={setSelectedCategory}
            mainClassName="col-span-1 w-full"
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            defaultSelectedIconClassName="size-4"
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full p-3 rounded-lg text-xs bg-gray-100"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left text-black px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          />
        </div>
      )}
      <CustomInput
        type="text"
        label="Subcategory Code"
        value={categoryCode}
        setter={setCategoryCode}
        placeholder="Name"
      />
      <CustomInput
        type="text"
        label="Subcategory Name"
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
      <div className="col-span-2 flex w-full flex-col items-start justify-start gap-1">
        <label
          htmlFor="Subcategory Color"
          className="w-full text-left text-xs text-gray-500"
        >
          Subcategory Color
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
          className="w-full rounded-lg bg-gray-100 p-3 capitalize"
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
  );
};

export default AddSubCategory;
