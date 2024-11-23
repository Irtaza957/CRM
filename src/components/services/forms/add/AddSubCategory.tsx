import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TiArrowSortedDown } from "react-icons/ti";

import {
  useCreateCategoryMutation
} from "../../../../store/services/service";
import Combobox from "../../../ui/Combobox";
import { RootState } from "../../../../store";
import CustomInput from "../../../ui/CustomInput";
import CustomToast from "../../../ui/CustomToast";
import ImageUploader from "../../../ui/ImageUploader";
import { useFetchAllCategoriesQuery, useUpdateCategoryMutation } from "../../../../store/services/categories";
import { IoCloseCircleOutline } from "react-icons/io5";
import { GoPlusCircle } from "react-icons/go";
import CustomButton from "../../../ui/CustomButton";
import ColorPicker from "../../../ui/ColorPicker";

interface AddSubCategoryProps{
  provider: string | number,
  business: string | number,
  isView: boolean,
  selectedSubCategory?: CategoryDetailProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: ()=>void
}
const AddSubCategory = ({provider, business, selectedSubCategory, isView, setOpen, refetch}: AddSubCategoryProps) => {
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
  const [providesVitamins, setProvidesVitamins] = useState<ListOptionProps | null>(null);
  const [allowBundles, setAllowBundles] = useState<ListOptionProps | null>(null);
  const [additionalInputs, setAdditionalInputs] = useState<{ key: string, value: string }[]>([{ key: "", value: "" }]);
  const { user } = useSelector((state: RootState) => state.global);
  const {
    data,
    isLoading: fetching
  } = useFetchAllCategoriesQuery([{ name: 'company', id: `${provider}-company` }, { name: 'business', id: `${business}-business` }], {
    skip: !provider,
    refetchOnMountOrArgChange: true
  });
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
    setAdditionalInputs([{ key: "", value: "" }]);
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
    formData.append("allow_vitamins", String(providesVitamins?.id));
    formData.append("allow_bundles", String(allowBundles?.id));
    const bundles = additionalInputs.map((input) => input.value).filter((value) => value !== "").join(",");
    formData.append("bundles", bundles);

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

    const handleAddInput = () => {
      setAdditionalInputs([...additionalInputs, { key: "", value: "" }]);
    };
    
    const handleRemoveInput = (index: number) => {
      setAdditionalInputs((prev) => prev.filter((_, i) => i !== index));
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
      setProvidesVitamins({ id: selectedSubCategory?.allow_vitamins, name: selectedSubCategory?.allow_vitamins === '1' ? 'Yes' : 'No' });
      setAllowBundles({ id: selectedSubCategory?.allow_bundles, name: selectedSubCategory?.allow_bundles === '1' ? 'Yes' : 'No' });
      setAdditionalInputs(selectedSubCategory?.bundles?.map((bundle: {bundle: string}) => ({ key: "", value: bundle.bundle })));
    }
  },[selectedSubCategory, open])

  useEffect(()=>{
    if(data?.length && selectedSubCategory?.category_id){
      const temp = data?.find((item: CategoryAllListProps)=>String(item.category_id)===selectedSubCategory?.parent_id)
      if(temp) setSelectedCategory({ id: temp.category_id, name: temp.category_name })
    }
  },[data])
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
    <div
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
            options={data?.map((item: CategoryAllListProps) => ({ id: item.category_id, name: item.category_name })) || []}
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
            disabled={!provider || isView}
          />
        </div>
      )}
      <CustomInput
        type="text"
        label="Subcategory Code"
        value={categoryCode}
        setter={setCategoryCode}
        placeholder="Name"
        disabled={isView}
      />
      <CustomInput
        type="text"
        label="Subcategory Name"
        value={categoryName}
        setter={setCategoryName}
        placeholder="Name"
        disabled={isView}
      />
      <ColorPicker label="Subcategory Color" value={color} setter={setColor} />
      <div className="col-span-1 flex w-full flex-col items-center justify-center gap-1">
        <label
          htmlFor="Parent Category"
          className="w-full text-left text-xs text-gray-500"
        >
          Provides Vitamins
        </label>
        <Combobox
          options={[{ id: 1, name: 'Yes' }, { id: 0, name: 'No' }]}
          value={providesVitamins}
          placeholder="Provides Vitamins"
          setValue={setProvidesVitamins}
          mainClassName="col-span-1 w-full"
          defaultSelectedIconClassName="size-4"
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full p-3 rounded-lg text-xs bg-gray-100"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left text-black px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          disabled={isView}
          isSearch={false}
        />
      </div>
      <div className="col-span-1 flex w-full flex-col items-center justify-center gap-1">
        <label
          htmlFor="Parent Category"
          className="w-full text-left text-xs text-gray-500"
        >
          Allow Bundles
        </label>
        <Combobox
          options={[{ id: 1, name: 'Yes' }, { id: 0, name: 'No' }]}
          value={allowBundles}
          placeholder="Allow Bundles"
          setValue={setAllowBundles}
          mainClassName="col-span-1 w-full"
          defaultSelectedIconClassName="size-4"
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full p-3 rounded-lg text-xs bg-gray-100"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left text-black px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          disabled={isView}
          isSearch={false}
        />
      </div>
      {allowBundles?.id == 1 && (
        <div className="col-span-2">
          {additionalInputs.map((input, index) => (
          <div key={index} className="col-span-1 flex w-full items-center gap-3">
            <CustomInput
              type="text"
              value={input.value}
              setter={(value) => {
                const updatedInputs = [...additionalInputs];
                updatedInputs[index].value = value;
                setAdditionalInputs(updatedInputs);
              }}
              placeholder="Enter additional info"
              disabled={isView}
            />
            {index < additionalInputs.length - 1 && (
              <div onClick={() => handleRemoveInput(index)} className="cursor-pointer">
                <IoCloseCircleOutline className="size-5 text-gray-500" />
              </div>
            )}
            {index === additionalInputs.length - 1 && (
              <div onClick={handleAddInput} className="cursor-pointer">
                <GoPlusCircle className="size-5 text-gray-500" />
              </div>
            )}
          </div>
          ))}
        </div>
      )}
      <div className="col-span-2 flex w-full flex-col items-center justify-center space-y-1">
        <label htmlFor="Description" className="w-full text-left">
          Description
        </label>
        <textarea
          rows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg bg-gray-100 p-3 capitalize text-xs text-grey100"
          disabled={isView}
        />
      </div>
      <div className="col-span-2 flex w-full flex-col items-center justify-center space-y-2.5">
        <h1 className="w-full text-left text-base font-bold text-primary">
          Image Gallery
        </h1>
        <div className="grid w-full grid-cols-6 gap-6">
          <ImageUploader
            link={selectedSubCategory?.icon ? `https://crm.fandcproperties.ru${selectedSubCategory?.icon}` : ''}
           label="Icon" setImage={setIcon} disabled={isView} />
          <ImageUploader 
            link={selectedSubCategory?.thumbnail ? `https://crm.fandcproperties.ru${selectedSubCategory?.thumbnail}` : ''}
            label="Thumbnail" setImage={setThumbnail} disabled={isView} />
          <ImageUploader 
            link={selectedSubCategory?.cover_image ? `https://crm.fandcproperties.ru${selectedSubCategory?.cover_image}` : ''}
            label="Cover Image" setImage={setCoverImage} disabled={isView} />
        </div>
      </div>
      <div className="col-span-2 flex gap-3 w-full items-end justify-end">
        <CustomButton
          name="Cancel"
          handleClick={() => setOpen(false)}
          style="bg-danger"
        />
        {!isView && (
          <CustomButton
            name={selectedSubCategory?.category_id ? "Update" : "Save"}
            handleClick={handleCategorySubmit}
            loading={isLoading || updateLoading}
            disabled={isLoading || updateLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AddSubCategory;
