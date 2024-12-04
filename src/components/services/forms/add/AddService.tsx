import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TiArrowSortedDown } from "react-icons/ti";

import {
  usePostServiceMutation,
  useCategoryBundleMutation,
  useFetchServiceQuery,
  useUpdateServiceMutation,
  useServiceVitaminMutation,
} from "../../../../store/services/service";
import Combobox from "../../../ui/Combobox";
import { RootState } from "../../../../store";
import CustomInput from "../../../ui/CustomInput";
import CustomToast from "../../../ui/CustomToast";
import ImageUploader from "../../../ui/ImageUploader";
import CustomButton from "../../../ui/CustomButton";
import { useFetchAllCategoriesQuery } from "../../../../store/services/categories";
import ColorPicker from "../../../ui/ColorPicker";

interface AddServiceProps {
  provider?: string | number;
  business?: string | number;
  selectedServiceId: string;
  open?: boolean;
  isApp?: boolean;
  refetch?: () => void;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setProvider?: React.Dispatch<React.SetStateAction<ListOptionProps | null>>;
}

interface VitaminOption {
  name: string;
  selected: boolean;
}

const AddService = ({
  provider,
  business,
  selectedServiceId,
  open,
  isApp,
  refetch,
  setOpen,
  setProvider,
}: AddServiceProps) => {
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
  const [promotionalPrice, setPromotionalPrice] = useState("");
  const [promotionalPriceVat, setPromotionalPriceVat] = useState("");
  const [promotionalPriceNoVat, setPromotionalPriceNoVat] = useState("");
  const [bundles, setBundles] = useState<BundleProps[]>([]);
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const { user } = useSelector((state: RootState) => state.global);
  const [postService, { isLoading: creating }] = usePostServiceMutation();
  const [categoryBundle] = useCategoryBundleMutation();
  const [serviceVitamin] = useServiceVitaminMutation();
  const [serviceDetails, setServiceDetails] = useState<ServiceDetailProps | null>(null)
  const { data, isLoading } = useFetchAllCategoriesQuery(
    [
      { name: "company", id: `${provider}-company` },
      { name: "business", id: `${business}-business` },
    ],
    {
      skip: !provider,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: serviceData } = useFetchServiceQuery(selectedServiceId, {
    skip: !selectedServiceId,
    refetchOnMountOrArgChange: true,
  });
  const [updateService, { isLoading: updating }] = useUpdateServiceMutation();
  const [vitamins, setVitamins] = useState<VitaminOption[]>([]);
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
    setBundles([]);
    setPromotionalPrice("");
    setPromotionalPriceVat("");
    setPromotionalPriceNoVat("");
    setVitamins([]);
    // setServiceDetails(null)
  };


  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("company_id", String(provider || ""));
    formData.append("business_id", String(business || ""));
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
    formData.append("promotional_price_without_vat", promotionalPriceNoVat);
    formData.append("promotional_vat_amount", promotionalPrice);
    formData.append("promotional_price_with_vat", promotionalPriceVat);
    formData.append("bundles", JSON.stringify(bundles));
    const selectedVitamins = vitamins
      .filter((v) => v.selected)
      .map((v) => v.name)
      .join(",");
    formData.append("vitamins", selectedVitamins);

    try {
      let data;
      if (selectedServiceId) {
        formData.append("service_id", selectedServiceId);
        data = await updateService(formData);
      } else {
        data = await postService(formData);
      }
      if (data.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="error"
            message={`Couldn't ${selectedServiceId ? "Update" : "Create"} Service. Please Try Again!`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="success"
            message={`Service ${selectedServiceId ? "Updated" : "Created"} Successfully!`}
          />
        ));
        refetch && refetch();
        setOpen && setOpen(false);
        clearForm();
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="error"
          message={`Couldn't ${selectedServiceId ? "Update" : "Create"} Service. Please Try Again!`}
        />
      ));
    }
  };

  const getVitamins = async (selectVitamins?: VitaminOption[]) => {
    try {
      const response: any = await serviceVitamin({});
      const vitaminOptions = response?.data?.map(
        (vitamin: VitaminOption) => ({
          name: vitamin.name,
          selected: selectVitamins?.some(item => item.name === vitamin.name) || false,
        })
      );
      setVitamins(vitaminOptions || []);
    } catch (error) {
      console.log(error, "error");
    }
  }

  const handleCategorySelect = async (option: ListOptionProps) => {
    setSelectedCategory(option);
    const selectedCategory = data?.find(
      (category: CategoryListProps) => category.category_id === option.id
    );
    if (selectedCategory?.allow_vitamins === "1") {
      getVitamins()
    } else {
      setVitamins([]);
    }
    if (selectedCategory?.allow_bundles === "1") {
      try {
        const response = await categoryBundle(selectedCategory?.category_id);
        const bundles = response?.data?.map((bundle) => ({
          name: bundle.bundle,
          price_without_vat: "",
          price_with_vat: "",
          vat_value: "",
        }));
        if (bundles) {
          setBundles(bundles);
        }
      } catch (error) {
        console.log(error, "error");
      }
    } else {
      setBundles([]);
    }
  };

  useEffect(() => {
    if (serviceData) {
      setServiceDetails(serviceData)
    }
  }, [serviceData])
  useEffect(() => {
    if (serviceDetails?.id) {
      setProvider && setProvider(
        serviceDetails?.company_id
          ? { id: serviceDetails?.company_id, name: "" }
          : null
      );
      setVat(serviceDetails?.vat_value || "");
      setPriceNoVat(serviceDetails?.price_without_vat || "");
      setPriceVat(serviceDetails?.price_with_vat || "");
      setCode(serviceDetails?.code || "");
      setServiceName(serviceDetails?.name || "");
      setDuration(serviceDetails?.duration || "");
      setResponseTime(serviceDetails?.response_time || "");
      setDescription(serviceDetails?.description || "");
      setPromotionalPriceNoVat(
        serviceDetails?.promotional_price_without_vat || ""
      );
      setPromotionalPrice(serviceDetails?.promotional_price_vat_value || "");
      setPromotionalPriceVat(serviceDetails?.promotional_price_with_vat || "");
      setSize(serviceDetails?.size || "");
      setThumbnail(serviceDetails?.thumbnail || null);
      setCoverImage(serviceDetails?.cover_image || null);
      const tempBundles: BundleProps[] = (
        serviceDetails?.bundles as BundleProps[]
      )?.map((item: BundleProps) => ({
        name: item.bundle || "",
        price_without_vat: item.price_without_vat,
        price_with_vat: item.price_with_vat,
        vat_value: item.vat_value,
      }));
      setBundles(tempBundles || []);
      if (serviceDetails?.vitamins.length) {
        getVitamins(serviceDetails?.vitamins)
      }else{
        setVitamins([])
      }
    }
  }, [serviceDetails, open]);

  useEffect(() => {
    if (data && selectedServiceId) {
      const selectedCategory = data?.find(
        (category: CategoryListProps) =>
          category.category_id === serviceDetails?.category_id
      );
      setSelectedCategory(
        selectedCategory
          ? {
            id: selectedCategory.category_id,
            name: selectedCategory.category_name,
          }
          : null
      );
    }
  }, [data]);

  useEffect(() => {
    if (!open) {
      // clearForm();
    }
  }, [open]);
  return (
    <div
      className={`grid w-full grid-cols-3 gap-5 ${selectedServiceId && "mt-4"}`}
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
            options={data?.map((item: CategoryListProps) => ({
              id: item.category_id,
              name: item.category_name,
            }))}
            value={selectedCategory}
            placeholder="Parent Category"
            handleSelect={handleCategorySelect}
            mainClassName="col-span-1 w-full"
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            defaultSelectedIconClassName="size-4"
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full p-3 rounded-lg text-xs bg-gray-100"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left text-black px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
            disabled={!provider || isApp}
          />
        </div>
      )}
      <CustomInput
        type="text"
        label="ServiceCode"
        value={code}
        setter={setCode}
        placeholder="Code"
        disabled={isApp}
      />
      <CustomInput
        type="text"
        value={serviceName}
        label="Service Name"
        setter={setServiceName}
        placeholder="Service Name"
        disabled={isApp}
      />
      <CustomInput
        type="text"
        value={duration}
        label="Duration"
        setter={setDuration}
        placeholder="Duration"
        disabled={isApp}
      />
      <CustomInput
        type="text"
        value={responseTime}
        label="Response Time"
        setter={setResponseTime}
        placeholder="Response Time"
        disabled={isApp}
      />
      <CustomInput
        type="number"
        value={priceNoVat}
        setter={setPriceNoVat}
        label="Price without VAT"
        placeholder="Price without VAT"
        disabled={isApp}
      />
      <CustomInput
        type="number"
        label="VAT"
        value={vat}
        setter={setVat}
        placeholder="VAT"
        disabled={isApp}
      />
      <CustomInput
        type="number"
        value={priceVat}
        setter={setPriceVat}
        label="Price with VAT"
        placeholder="Price with VAT"
        disabled={isApp}
      />
      <CustomInput
        type="number"
        value={promotionalPriceNoVat}
        setter={setPromotionalPriceNoVat}
        label="Promotional price without VAT"
        placeholder="Promotional price without VAT"
        disabled={isApp}
      />
      <CustomInput
        type="number"
        value={promotionalPrice}
        setter={setPromotionalPrice}
        label="Promotional price"
        placeholder="Promotional price"
        disabled={isApp}
      />
      <CustomInput
        type="number"
        value={promotionalPriceVat}
        setter={setPromotionalPriceVat}
        label="Promotional price with VAT"
        placeholder="Promotional price with VAT"
        disabled={isApp}
      />
      {bundles?.map((bundle) => (
        <>
          <CustomInput
            type="number"
            value={bundle.price_without_vat}
            setter={(value) =>
              setBundles(
                bundles.map((b) =>
                  b.name === bundle.name
                    ? { ...b, price_without_vat: value }
                    : b
                )
              )
            }
            placeholder={`${bundle.name}'s promortional price without VAT`}
            label={`${bundle.name}'s promortional price without VAT`}
            disabled={isApp}
          />
          <CustomInput
            type="number"
            value={bundle.vat_value}
            setter={(value) =>
              setBundles(
                bundles.map((b) =>
                  b.name === bundle.name ? { ...b, vat_value: value } : b
                )
              )
            }
            placeholder={`${bundle.name}'s promortional price`}
            label={`${bundle.name}'s promortional price`}
            disabled={isApp}
          />
          <CustomInput
            type="number"
            value={bundle.price_with_vat}
            setter={(value) =>
              setBundles(
                bundles.map((b) =>
                  b.name === bundle.name ? { ...b, price_with_vat: value } : b
                )
              )
            }
            placeholder={`${bundle.name}'s promortional price with VAT`}
            label={`${bundle.name}'s promortional price with VAT`}
            disabled={isApp}
          />
        </>
      ))}
      <CustomInput
        type="number"
        value={size}
        setter={setSize}
        placeholder="Size"
        label="Size (in mL.)"
        disabled={isApp}
        />
      <ColorPicker label="Service Color" value={color} setter={setColor} disabled={isApp} />
      {vitamins.length > 0 && (
        <div className="col-span-2 mb-4 flex flex-col gap-2">
          <label className="text-left font-medium">Vitamins</label>
          <div className="flex flex-col gap-4">
            {vitamins.map((vitamin, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="min-w-[120px] text-sm">{vitamin.name}</span>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`vitamin-${vitamin.name}`}
                      disabled={isApp}
                      checked={vitamin.selected}
                      onChange={() => {
                        setVitamins(
                          vitamins.map((v, i) =>
                            i === index ? { ...v, selected: true } : v
                          )
                        );
                      }}
                      className="custom-radio"
                    />
                    <span>Yes</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`vitamin-${vitamin.name}`}
                      checked={!vitamin.selected}
                      disabled={isApp}
                      onChange={() => {
                        setVitamins(
                          vitamins.map((v, i) =>
                            i === index ? { ...v, selected: false } : v
                          )
                        );
                      }}
                      className="custom-radio"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="col-span-3 flex w-full flex-col items-center justify-center space-y-1">
        <label htmlFor="Description" className="w-full text-left">
          Description
        </label>
        <textarea
          rows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg bg-gray-100 p-3 text-xs capitalize text-grey100"
          disabled={isApp}
        />
      </div>
      <div className="col-span-3 flex w-full flex-col items-center justify-center space-y-2.5">
        <h1 className="w-full text-left text-base font-bold text-primary">
          Image Gallery
        </h1>
        <div className="grid w-full grid-cols-6 gap-6">
          <ImageUploader
            label="Thumbnail"
            setImage={setThumbnail}
            link={
              serviceDetails?.thumbnail
                ? serviceDetails?.thumbnail.startsWith("http")
                  ? serviceDetails?.thumbnail
                  : `https://crm.fandcproperties.ru${serviceDetails?.thumbnail}`
                : ""
            }
            disabled={isApp}
          />
          <ImageUploader
            label="Cover Image"
            setImage={setCoverImage}
            link={
              serviceDetails?.cover_image
                ? serviceDetails?.cover_image.startsWith("http")
                  ? serviceDetails?.cover_image
                  : `https://crm.fandcproperties.ru${serviceDetails?.cover_image}`
                : ""
            }
            disabled={isApp}
          />
        </div>
      </div>
      <div className="col-span-3 flex w-full items-end justify-end gap-3">
        {!isApp &&  <>
        <CustomButton
          name="Cancel"
          handleClick={() => setOpen?.(false)}
          style="bg-danger"
        />
        <CustomButton
          name={selectedServiceId ? "Update" : "Save"}
          handleClick={handleSubmit}
          loading={creating || updating}
          disabled={creating || updating || isApp}
          />
          </>
        }
      </div>
    </div>
  );
};

export default AddService;
