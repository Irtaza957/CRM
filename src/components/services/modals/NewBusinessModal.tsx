import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoClose } from "react-icons/io5";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { useCreateBusinessMutation } from "../../../store/services/service";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import ImageUploader from "../../ui/ImageUploader";
import { useUpdateBusinessMutation } from "../../../store/services/business";
import { FiEdit } from "react-icons/fi";

interface NewBusinessModalProps {
  open: boolean;
  selectedBusiness: BusinessProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch?: () => void;
  isView: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
  isApp: boolean;
}

const businessSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

const NewBusinessModal = ({
  open,
  setOpen,
  selectedBusiness,
  refetch,
  isView,
  setIsView,
  isApp
}: NewBusinessModalProps) => {
  const [icon, setIcon] = useState<File | string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [cover, setCover] = useState<File | string | null>(null);

  const [createBusiness, { isLoading }] = useCreateBusinessMutation();
  const [updateBusiness, { isLoading: updateLoading }] = useUpdateBusinessMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessSchema),
  });

  const handleClose = () => {
    resetState();
    setOpen(false);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("code", data.code);
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("icon", icon || '');
      formData.append("thumbnail", thumbnail || '');
      formData.append("cover_image", cover || '');

      let response;
      if (selectedBusiness?.id) {
        formData.append("id", selectedBusiness?.id);
        response = await updateBusiness(formData);
      } else {
        response = await createBusiness(formData);
      }

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Failed to create business"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Business created successfully"
          />
        ));
        handleClose();
        refetch?.();
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

  const resetState = () => {
    reset({
      code: "",
      name: "",
      description: "",
    });
    setIcon(null);
    setThumbnail(null);
    setCover(null);
  }

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  useEffect(() => {
    if (selectedBusiness?.id) {
      setValue("code", selectedBusiness?.code);
      setValue("name", selectedBusiness?.name);
      setValue("description", selectedBusiness?.description);
      setIcon(selectedBusiness?.icon || null);
      setThumbnail(selectedBusiness?.thumbnail || null);
      setCover(selectedBusiness?.cover_image || null);
    }
  }, [selectedBusiness, open]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-3xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">{isView ? 'View Business' : selectedBusiness?.id ? 'Update Business' : 'Add Business'}</h1>
          <div className="flex items-center justify-center gap-2">
            {(isView && !isApp) && (
              <FiEdit
                onClick={() => setIsView(false)}
                className="h-6 w-6 cursor-pointer text-white"
              />
            )}
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div
          className=" h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5"
        >
          <div className="flex w-full gap-5">
            <CustomInput
              name="code"
              label="Business Code"
              register={register}
              errorMsg={errors?.code?.message}
              placeholder="Enter business code"
              disabled={isView}
            />
            <CustomInput
              name="name"
              label="Business Name"
              register={register}
              errorMsg={errors?.name?.message}
              placeholder="Enter business name"
              disabled={isView}
            />
          </div>

          <div className="col-span-2 flex w-full flex-col items-center justify-center space-y-1 my-7">
            <label htmlFor="Description" className="w-full text-left text-xs text-grey100 font-medium">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={8}
              className="w-full rounded-lg bg-gray-100 p-3 text-xs text-grey100"
              placeholder="Enter business description"
              disabled={isView}
            />
            {errors?.description?.message && (
              <p className="w-full text-left text-xs text-red-500">
                {errors?.description?.message as string}
              </p>
            )}
          </div>

          <div className="col-span-2 flex w-full flex-col items-center justify-center space-y-2.5 mb-10">
            <h1 className="w-full text-left text-base font-bold text-primary">
              Image Gallery
            </h1>
            <div className="grid w-full grid-cols-6 gap-6">
              <ImageUploader
                label="Icon"
                setImage={setIcon}
                link={selectedBusiness?.icon ? `https://crm.fandcproperties.ru${selectedBusiness?.icon}` : ''}
                disabled={isView}
              />
              <ImageUploader
                label="Thumbnail"
                setImage={setThumbnail}
                link={selectedBusiness?.thumbnail ? `https://crm.fandcproperties.ru${selectedBusiness?.thumbnail}` : ''}
                disabled={isView}
              />
              <ImageUploader
                label="Cover Image"
                setImage={setCover}
                link={selectedBusiness?.cover_image ? `https://crm.fandcproperties.ru${selectedBusiness?.cover_image}` : ''}
                disabled={isView}
              />
            </div>
          </div>

          <div className="col-span-2 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            {!isView && (
              <CustomButton
                name={selectedBusiness?.id ? "Update" : "Save"}
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

export default NewBusinessModal;
