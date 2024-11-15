import { toast } from "sonner";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
import { TiArrowSortedDown } from "react-icons/ti";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import Modal from "../../../ui/Modal";
import {
  useFetchServiceQuery,
  useFetchCategoryListQuery,
  useUpdateServiceMutation,
} from "../../../../store/services/service";
import Combobox from "../../../ui/Combobox";
import { RootState } from "../../../../store";
import CustomInput from "../../../ui/CustomInput";
import CustomToast from "../../../ui/CustomToast";
import ImageUploader from "../../../ui/ImageUploader";

interface UpdateServiceModalProps {
  id: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  refetch: ()=>void
}

const UpdateService = ({ id, open, setOpen, refetch }: UpdateServiceModalProps) => {
  const [vat, setVat] = useState("");
  const [code, setCode] = useState("");
  const [size, setSize] = useState("");
  const [duration, setDuration] = useState("");
  const [priceVat, setPriceVat] = useState("");
  const [color, setColor] = useState("#000000");
  const [selectedCategory, setSelectedCategory] =
    useState<ListOptionProps | null>(null);
  const [priceNoVat, setPriceNoVat] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const { data: serviceDetails } = useFetchServiceQuery(id,     {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const { data, isLoading } = useFetchCategoryListQuery({});
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const { user } = useSelector((state: RootState) => state.global);
  const [updateService, { isLoading: creating }] = useUpdateServiceMutation();

  const clearForm = () => {
    setVat("");
    setCode("");
    setSize("");
    setDuration("");
    setPriceVat("");
    setPriceNoVat("");
    setServiceName("");
    setDescription("");
    setThumbnail(null);
    setColor("#000000");
    setResponseTime("");
    setCoverImage(null);
    setSelectedCategory(null);
  };
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("company_id", serviceDetails?.company_id || '');
    formData.append("category_id", `${selectedCategory?.id}`);
    formData.append("user_id", `${user?.id}`);
    formData.append("code", code);
    formData.append("service_name", serviceName);
    formData.append("size", size);
    formData.append("duration", duration);
    formData.append("response_time", responseTime);
    formData.append("description", description);
    formData.append("price_without_vat", priceNoVat);
    formData.append("price_with_vat", priceVat);
    formData.append("vat_amount", vat);
    formData.append("color", color);
    formData.append("thumbnail", thumbnail!);
    formData.append("cover_image", coverImage!);
    formData.append("service_id", id);

    try {
      const data = await updateService(formData);
      if (data.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="error"
            message="Couldn't Create Service. Please Try Again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="success"
            message="Created Service Successfully!"
          />
        ));
        refetch()
        setOpen(false);
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

  useEffect(() => {
    if (serviceDetails) {
      setSize(serviceDetails?.size ? serviceDetails?.size : "");
      setServiceName(serviceDetails?.name ? serviceDetails?.name : "");
      setVat(serviceDetails?.vat_value ? serviceDetails?.vat_value : "");
      setDuration(serviceDetails?.duration ? serviceDetails?.duration : "");
      setCode(serviceDetails?.color_code ? serviceDetails?.color_code : "");
      setColor(
        serviceDetails?.color_code ? serviceDetails?.color_code : "#000000"
      );
      setDescription(
        serviceDetails?.description ? serviceDetails?.description : ""
      );
      setPriceVat(
        serviceDetails?.price_with_vat ? serviceDetails?.price_with_vat : ""
      );
      setResponseTime(
        serviceDetails?.response_time ? serviceDetails?.response_time : ""
      );
      setPriceNoVat(
        serviceDetails?.price_without_vat
          ? serviceDetails?.price_without_vat
          : ""
      );
      const temp: ListOptionProps | undefined = data?.find(item => item.id===Number(serviceDetails?.category_id))
      setSelectedCategory(temp || null)
    }
  }, [serviceDetails]);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      className="h-[80vh] w-full lg:max-w-3xl"
    >
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-between rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Update Service</h1>
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
            handleSubmit();
          }}
          className="no-scrollbar grid max-h-full w-full grid-cols-2 gap-5 overflow-auto p-5"
        >
          {!isLoading && (
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
            type="number"
            label="VAT"
            value={vat}
            setter={setVat}
            placeholder="VAT"
          />
          <CustomInput
            type="text"
            label="Code"
            value={code}
            setter={setCode}
            placeholder="Code"
          />
          <CustomInput
            type="number"
            value={size}
            setter={setSize}
            placeholder="Size"
            label="Size (in mL.)"
          />
          <CustomInput
            type="text"
            value={duration}
            label="Duration"
            setter={setDuration}
            placeholder="Duration"
          />
          <CustomInput
            type="number"
            value={priceVat}
            setter={setPriceVat}
            label="Price with VAT"
            placeholder="Price with VAT"
          />
          <CustomInput
            type="number"
            value={priceNoVat}
            setter={setPriceNoVat}
            label="Price without VAT"
            placeholder="Price without VAT"
          />
          <CustomInput
            type="text"
            value={serviceName}
            label="Service Name"
            setter={setServiceName}
            placeholder="Service Name"
          />
          <CustomInput
            type="text"
            value={responseTime}
            label="Response Time"
            setter={setResponseTime}
            placeholder="Response Time"
          />
          <div className="col-span-1 flex w-full flex-col items-start justify-start gap-1">
            <label
              htmlFor="Service Color"
              className="w-full text-left text-xs text-gray-500"
            >
              Service Color
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
                link={serviceDetails?.thumbnail ? `https://crm.fandcproperties.ru${serviceDetails?.thumbnail}` : ''}
                label="Thumbnail"
                setImage={setThumbnail}
              />
              <ImageUploader
                link={
                  serviceDetails?.cover_image ? `https://crm.fandcproperties.ru${serviceDetails?.cover_image}` : ""
                }
                label="Cover Image"
                setImage={setCoverImage}
              />
            </div>
          </div>
          <div className="col-span-2 flex w-full items-end justify-end gap-5">
            <button
              type="submit"
              disabled={creating}
              onClick={() => {
                setOpen(false);
                clearForm();
              }}
              className="place-self-end rounded-lg bg-red-500 px-10 py-2 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="place-self-end rounded-lg bg-primary px-10 py-2 text-white"
            >
              {creating ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <LuLoader2 className="animate-spin" />
                  <span>Please Wait...</span>
                </div>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateService;
