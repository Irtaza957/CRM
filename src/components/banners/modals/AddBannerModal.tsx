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

interface AddBannerModalProps {
  open: boolean;
  selectedBanner: BannerProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView?: boolean;
  setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const bannerTypes = [
  { id: 1, name: "Horizontal" },
  { id: 2, name: "Vertical" },
];

const linkToOptions = [
  { id: 1, name: "categories_page", label: "Categories Page" },
  { id: 2, name: "services_page", label: "Services Page" },
  { id: 3, name: "service_detail_page", label: "Service Detail Page" },
];

const AddBannerModal = ({
  open,
  setOpen,
  selectedBanner,
  refetch,
  isView,
  setIsView,
}: AddBannerModalProps) => {
  const [bannerType, setBannerType] = useState<ListOptionProps | null>(null);
  const [linkTo, setLinkTo] = useState<ListOptionProps | null>(null);
  const [bannerImage, setBannerImage] = useState<File | string | null>(null);

  const { user } = useSelector((state: RootState) => state.global);
  const [createBanner, { isLoading }] = usePostBannerMutation();
  const [updateBanner, { isLoading: updateLoading }] =
    useUpdateBannerMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const resetState=()=>{
    reset({
      title: '',
      link_data: '',
      description: ''
    });
    setBannerType(null);
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
      formData.append("description", data.description);
      formData.append("type", bannerType?.name || "");
      formData.append("link_to", linkTo?.name || "");
      formData.append("link_data", data.link_data);
      formData.append("company_id", "1"); // Replace with actual company_id
      formData.append("business_id", "1"); // Replace with actual business_id
      formData.append("user_id", String(user?.id));

      if (bannerImage) {
        formData.append("banner_image", bannerImage);
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

  useEffect(() => {
    if (selectedBanner?.banner_id) {
      setValue("title", selectedBanner.title);
      setValue("description", selectedBanner.description);
      setValue("link_data", selectedBanner.link_data);

      const selectedType = bannerTypes.find(
        (type) => type.name === selectedBanner.type
      );
      if (selectedType) {
        setBannerType(selectedType);
      }

      const selectedLinkTo = linkToOptions.find(
        (option) => option.name === selectedBanner.link_to
      );
      if (selectedLinkTo) {
        setLinkTo(selectedLinkTo);
      }
    }
  }, [selectedBanner]);

  useEffect(()=>{
    if(!open){
      resetState()
    }
  },[open])

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
              options={bannerTypes}
              value={bannerType}
              handleSelect={(value: ListOptionProps) => setBannerType(value)}
              label="Banner Type"
              placeholder="Select Banner Type"
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
              handleSelect={(value: ListOptionProps) => setLinkTo(value)}
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
            <CustomInput
              name="link_data"
              label="Link Data"
              register={register}
              errorMsg={errors?.link_data?.message}
              placeholder="Enter link data"
              disabled={isView}
            />
          </div>

          <div className="my-7 flex w-full flex-col items-center justify-center space-y-1">
            <label
              htmlFor="description"
              className="w-full text-left text-xs font-medium text-grey100"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full rounded-lg bg-gray-100 p-3 text-xs text-grey100"
              placeholder="Enter description"
              disabled={isView}
            />
            {errors?.description?.message && (
              <p className="w-full text-left text-xs text-red-500">
                {errors?.description?.message as string}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col items-start justify-start gap-2.5">
            <label className="w-full text-left text-xs font-medium text-grey100">
              Banner Image
            </label>
            <ImageUploader
              setImage={setBannerImage}
              link={selectedBanner?.image ? `${selectedBanner.image}` : ""}
              disabled={isView}
            />
          </div>

          <div className="mt-5 flex w-full items-end justify-end gap-3">
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
