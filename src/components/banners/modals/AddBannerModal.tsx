import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import Combobox from "../../ui/Combobox";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import {
  usePostBannerMutation,
  useUpdateBannerMutation,
} from "../../../store/services/banner";
import { RiArrowDownSLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FiEdit } from "react-icons/fi";
import ImageUploader from "../../ui/ImageUploader";
import { linkToOptions, pageOptions, placeOptions } from "../../../utils/constants";
import { useFetchAllCategoriesQuery } from "../../../store/services/categories";
import { useFetchServicesQuery } from "../../../store/services/service";

interface AddBannerModalProps {
  open: boolean;
  selectedBanner: BannerProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView?: boolean;
  setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
  businessId: string | number | null;
  companyId: string | number | null;
}

const AddBannerModal = ({
  open,
  setOpen,
  selectedBanner,
  refetch,
  isView,
  setIsView,
  businessId,
  companyId
}: AddBannerModalProps) => {
  const [linkTo, setLinkTo] = useState<ListOptionProps | null>(null);
  const [linkData, setLinkData] = useState<ListOptionProps | ListOptionProps[] | null>(null)
  const [linkDataOptions, setLinkDataOptions] = useState<ListOptionProps[]>()
  const [bannerImage, setBannerImage] = useState<File | string | null>(null);
  const [page, setPage] = useState<ListOptionProps | null>(null)
  const [place, setPlace] = useState<ListOptionProps | null>(null)
  const { user } = useSelector((state: RootState) => state.global);
  const [createBanner, { isLoading }] = usePostBannerMutation();
  const [updateBanner, { isLoading: updateLoading }] =
    useUpdateBannerMutation();
  const {
    data: categoriesData,
  } = useFetchAllCategoriesQuery([{ name: 'business', id: '1-business' }, { name: 'company', id: '1-company' }], {
    skip: linkTo?.id !== 'categories_page',
    refetchOnMountOrArgChange: true
  });

  const {
    data: servicesData,
  } = useFetchServicesQuery([{ name: 'business', id: '1-business' }, { name: 'company', id: '1-company' }], {
    skip: (linkTo?.id !== 'services_page' && linkTo?.id !== 'service_detail_page'),
    refetchOnMountOrArgChange: true
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const resetState = () => {
    reset({
      title: '',
      link_data: '',
      description: ''
    });
    setLinkTo(null);
    setBannerImage(null);
  }
  const handleClose = () => {
    setOpen(false);
    resetState()
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("link_to", String(linkTo?.id || ""));
      formData.append("company_id", String(companyId));
      formData.append("business_id", String(businessId));
      formData.append("page", String(page?.id || ""));
      formData.append("place", String(place?.id || ""));
      formData.append("user_id", String(user?.id));
      let link=''
      if(Array.isArray(linkData)){
        link=linkData?.map((item) => item.id).join(", ")
      }else{
        link=String(linkData?.id || '')
      }
      formData.append("link_data", link || '');

      if (bannerImage) {
        formData.append("image", bannerImage);
      }

      let response;
      if (selectedBanner?.banner_id) {
        formData.append("banner_id", selectedBanner.banner_id);
        response = await updateBanner(formData);
      } else {
        response = await createBanner(formData);
      }

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Failed to ${selectedBanner?.banner_id ? "update" : "create"} banner`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Banner ${selectedBanner?.banner_id ? "updated" : "created"} successfully`}
          />
        ));
        refetch();
        handleClose();
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Error"
          message="Something went wrong"
        />
      ));
    }
  };

  const handleSelectLinkTo=(value: ListOptionProps)=>{
    setLinkData(null)
    setLinkTo(value)
  }

  const handleSelectPage=(value: ListOptionProps)=>{
    setPage(value)
  }

  const handleSelectPlace=(value: ListOptionProps)=>{
    setPlace(value)
  }

  useEffect(() => {
    if (selectedBanner?.banner_id) {
      setValue("title", selectedBanner.title);
      setValue("description", selectedBanner.description);
      setBannerImage(selectedBanner?.image || '')
      setPage(pageOptions.find(option => option.id === selectedBanner.page) || null)
      setPlace(placeOptions.find(option => option.id === selectedBanner.place) || null)

      const selectedLinkTo = linkToOptions.find(
        (option) => option.id === selectedBanner.link_to
      );
      if (selectedLinkTo) {
        setLinkTo(selectedLinkTo);
      }
    }
  }, [selectedBanner]);
  
  useEffect(()=>{
    if (linkDataOptions) {
      const selectedLinkData = selectedBanner?.link_data?.split(', ')
      if (selectedLinkData?.length) {
        const data = linkDataOptions.filter(item => selectedLinkData.includes(String(item.id)))
        if (data) {
          setLinkData(data)
        }
      }
    }
  }, [linkDataOptions])
  
  useEffect(() => {
    if (!open) {
      resetState()
    }
  }, [open])

  useEffect(() => {
    if (categoriesData) {
      const data = categoriesData?.map(item => ({ id: item.category_id, name: item.category_name }))
      if (data?.length) {
        setLinkDataOptions(data)
      }
    }
  }, [categoriesData])

  useEffect(() => {
    if (servicesData) {
      const data = servicesData?.map(item => ({ id: item.service_id, name: item.service_name }))
      if (data) {
        setLinkDataOptions(data)
      }
    }
  }, [servicesData])

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {selectedBanner?.banner_id ? "Update Banner" : "Add Banner"}
          </h1>
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
          <div className="grid grid-cols-2 gap-5">
            <CustomInput
              name="title"
              label="Title"
              register={register}
              errorMsg={errors?.title?.message}
              placeholder="Enter title"
              disabled={isView}
            />
            <Combobox
              options={pageOptions}
              value={page}
              handleSelect={handleSelectPage}
              label="Page"
              placeholder="Select Page"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              disabled={isView}
            />
            <Combobox
              options={placeOptions}
              value={place}
              handleSelect={handleSelectPlace}
              label="Place"
              placeholder="Select Place"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              disabled={isView}
            />
            <Combobox
              options={linkToOptions}
              value={linkTo}
              handleSelect={handleSelectLinkTo}
              label="Link To"
              placeholder="Select Link To"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              disabled={isView}
            />
            <Combobox
              options={linkDataOptions}
              value={linkData}
              handleSelect={(value: ListOptionProps) => setLinkData(value)}
              label="Link Data"
              placeholder="Select Link Data"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              disabled={isView || !linkTo?.id}
              isMultiSelect={linkTo?.id!=='service_detail_page'}
            />
          </div>

          <div className="grid w-full flex-col items-start justify-start gap-2.5 mt-5">
            <label className="w-full text-left text-xs font-medium text-grey100">
              Banner Image
            </label>
            <ImageUploader
              setImage={setBannerImage}
              link={selectedBanner?.image ? `https://crm.fandcproperties.ru${selectedBanner.image}` : ""}
              disabled={isView}
            />
          </div>

          <div className="mt-8 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            {!isView && (
              <CustomButton
                name={selectedBanner?.banner_id ? "Update" : "Save"}
                handleClick={handleSubmit(onSubmit)}
                loading={isLoading || updateLoading}
                disabled={isLoading || updateLoading}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddBannerModal;
