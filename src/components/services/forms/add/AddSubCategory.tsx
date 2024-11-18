import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LuLoader2 } from "react-icons/lu";
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
import { useUpdateCategoryMutation } from "../../../../store/services/categories";

interface AddSubCategoryProps{
  provider: string | number,
  business: string | number,
  selectedSubCategory?: CategoryAllListProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: ()=>void
}
const AddSubCategory = ({provider, business, selectedSubCategory, setOpen, refetch}: AddSubCategoryProps) => {
  const [tagline, setTagline] = useState("");
  const [duration, setDuration] = useState("");
  const [color, setColor] = useState("#000000");
  const [selectedCategory, setSelectedCategory] =
    useState<ListOptionProps | null>(null);
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<File | string | null>(null);
  const [categoryCode, setCategoryCode] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const { user } = useSelector((state: RootState) => state.global);
  const { data, isLoading: fetching } = useFetchCategoryListQuery({}, {skip: !open});
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updateLoading }] = useUpdateCategoryMutation();

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
    formData.append("business_id", String(business || ''));
    formData.append("company_id", String(provider || ''));
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
      let data
      if(selectedSubCategory?.category_id){
        formData.append("id", `${selectedSubCategory?.category_id}`);
        data = await updateCategory(formData);
      }else{
         data = await createCategory(formData);
      }
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
        refetch()
        clearForm();
        setOpen(false)
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
    
    useEffect(()=>{
    if(selectedSubCategory?.category_id){
      setCategoryCode(selectedSubCategory?.code)
      setCategoryName(selectedSubCategory?.category_name)
      setColor(selectedSubCategory?.color)
      setCoverImage(selectedSubCategory?.cover_image || null)
      setThumbnail(selectedSubCategory?.thumbnail)
      setDescription(selectedSubCategory?.description)
      setDuration(selectedSubCategory?.duration || '')
      setTagline(selectedSubCategory?.tagline || '')
      const temp: ListOptionProps | undefined =data?.find((item)=>String(item.id)===selectedSubCategory?.parent_id)
      if(temp) setSelectedCategory(temp)
    }
  },[selectedSubCategory, open])

  useEffect(()=>{
    if(!open){
      setCategoryCode('')
      setCategoryName('')
      setColor('')
      setCoverImage(null)
      setThumbnail(null)
      setIcon(null)
      setDescription('')
      setTagline('')
      setDuration('')
      setCoverImage(null)
      setSelectedCategory(null)
    }
  },[open])

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
      <div className="col-span-1 flex w-full flex-col items-start justify-start gap-1">
        <label
          htmlFor="Subcategory Color"
          className="w-full text-left text-xs text-gray-500"
        >
          Subcategory Color
        </label>
        <input value={color} onChange={(e) => setColor(e.target.value)}  type="color" className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700" id="hs-color-input" title="Choose your color"></input>
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
          <ImageUploader
            link={selectedSubCategory?.icon ? `https://crm.fandcproperties.ru${selectedSubCategory?.icon}` : ''}
           label="Icon" setImage={setIcon} />
          <ImageUploader 
            link={selectedSubCategory?.thumbnail ? `https://crm.fandcproperties.ru${selectedSubCategory?.thumbnail}` : ''}
           label="Thumbnail" setImage={setThumbnail} />
          <ImageUploader 
            link={selectedSubCategory?.cover_image ? `https://crm.fandcproperties.ru${selectedSubCategory?.cover_image}` : ''}
           label="Cover Image" setImage={setCoverImage} />
        </div>
      </div>
      <div className="col-span-2 flex w-full items-end justify-end">
        <button
          type="submit"
          disabled={isLoading || updateLoading}
          className="place-self-end rounded-lg bg-primary px-10 py-2 text-white"
        >
          {isLoading || updateLoading ? (
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
