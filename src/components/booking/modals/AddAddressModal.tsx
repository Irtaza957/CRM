import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import Combobox from "../../ui/Combobox";
import { RiArrowDownSLine } from "react-icons/ri";
import CustomButton from "../../ui/CustomButton";
import {
  useAddAddressMutation,
  useFetchAreasQuery,
  useUpdateAddressMutation,
} from "../../../store/services/booking";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod"; // Import Zod
import { zodResolver } from "@hookform/resolvers/zod"; // Import Zod resolver
import CustomToast from "../../ui/CustomToast";
import { toast } from "sonner";
import { emirates } from "../../../utils/constants";
import Map from "../../../assets/icons/map.svg";

const addressSchema = z.object({
  address_type: z.string().min(1, "Address Type is required"),
  emirate_id: z.number().min(1, "Emirate is required"),
  area_id: z.number().min(1, "Area is required"),
  building_no: z.string().min(1, "Building Number is required"),
  apartment: z.string().min(1, "Apartment Number is required"),
  street: z.string().min(1, "Street is required"),
  map_link: z.string().min(1, "Map Link is required"),
  extra_direction: z.string().min(1, "Extra Direction is required"),
});

interface AddAddressModalProps {
  open: boolean;
  customerId?: string;
  userId?: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getAddresses: (arg0: string) => void;
  editableAddressId?: any;
}

const AddAddressModal = ({
  open,
  customerId,
  userId,
  setOpen,
  getAddresses,
  editableAddressId,
}: AddAddressModalProps) => {
  const [emirate, setEmirate] = useState<ListOptionProps | null>(null);
  const [villa, setVilla] = useState<ListOptionProps | null>(null);

  const [addAddress, { isLoading }] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();
  const { data: areasDate } = useFetchAreasQuery(emirate?.id as string, {
    skip: !emirate?.id,
    refetchOnMountOrArgChange: true,
  });

  const defaultValues = {
    address_type: "",
    emirate_id: null,
    area_id: null,
    building_no: "",
    apartment: "",
    street: "",
    map_link: "",
    extra_direction: "",
  };

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues,
    mode: "all",
  });

  const handleSelectEmirate = (value: any) => {
    setEmirate(value);
    setValue("emirate_id", value.id);
  };

  const handleSelectArea = (value: any) => {
    setVilla(value);
    setValue("area_id", value.id);
  };

  const resetState = () => {
    reset(defaultValues);
    setEmirate(null);
    setVilla(null);
  };

  const handleSave: SubmitHandler<any> = async (data) => {
    try {
      if (customerId && userId) {
        const urlencoded = new URLSearchParams();
        urlencoded.append("user_id", String(userId));
        urlencoded.append("address_type", data.address_type);
        urlencoded.append("area_id", data.area_id);
        urlencoded.append("building_no", data.building_no);
        urlencoded.append("apartment", data.apartment);
        urlencoded.append("street", data.street);
        urlencoded.append("map_link", data.map_link);
        urlencoded.append("extra_direction", data.extra_direction);
        urlencoded.append("lat", "0");
        urlencoded.append("lng", "0");
        urlencoded.append("is_default", "0");

        let response;
        if (editableAddressId?.address_id) {
          urlencoded.append("address_id", editableAddressId?.address_id);
          response = await updateAddress(urlencoded);
        } else {
          urlencoded.append("customer_id", customerId);
          response = await addAddress(urlencoded);
        }
        if (response?.error) {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="error"
              title="Error"
              message="Something Went Wrong"
            />
          ));
        } else {
          getAddresses(customerId);
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="success"
              title="Success"
              message={`Successfully ${editableAddressId?.address_id ? "Updated" : "Added"} Address!`}
            />
          ));
          closeModal();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpen(false);
    resetState();
  };

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (editableAddressId && editableAddressId?.address_id) {
        setValue("address_type", editableAddressId.address_type);
        setValue("emirate_id", editableAddressId.emirate);
        setValue("area_id", editableAddressId.area_id);
        setValue("building_no", editableAddressId.building_no);
        setValue("apartment", editableAddressId.apartment);
        setValue("street", editableAddressId.street);
        setValue("map_link", editableAddressId.map_link);
        setValue("extra_direction", editableAddressId.extra_direction);

        // Set Emirate and Area Combobox values
        const emirateId = emirates?.find(
          (item) => item.name === editableAddressId.emirate
        )?.id;
        setEmirate({
          id: Number(emirateId),
          name: editableAddressId.emirate,
        });
        setVilla({
          id: Number(editableAddressId.area_id),
          name: editableAddressId.area,
        });
      }
    }
  }, [editableAddressId, open, setValue]);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[60%] max-w-[80%]"
      title={editableAddressId?.address_id ? "Edit Address" : "Add Address"}
    >
      <div className="w-full px-6 py-7">
        <p className="text-left text-[18px] font-bold text-primary">
          Address Details
        </p>
        <div className="mt-4 w-full">
          <div className="flex w-full items-center justify-center gap-5">
            <CustomInput
              name="address_type"
              placeholder="Address Type"
              label="Address Type"
              register={register}
              errorMsg={errors.address_type?.message} // Display error message
            />
            <Combobox
              value={emirate}
              options={emirates}
              handleSelect={handleSelectEmirate}
              label="Emirate"
              placeholder="Select Emirate"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
            />
            <Combobox
              value={villa}
              options={areasDate}
              handleSelect={handleSelectArea}
              label="Area"
              placeholder="Select Area"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
            />
          </div>
          <div className="my-4 flex w-full items-center justify-center gap-5">
            <CustomInput
              name="street"
              label="Street"
              placeholder="Street"
              register={register}
              errorMsg={errors.street?.message} // Display error message
            />
            <CustomInput
              name="building_no"
              label="Building No"
              placeholder="Building No"
              register={register}
              errorMsg={errors.building_no?.message} // Display error message
            />
            <CustomInput
              name="apartment"
              label="Apartment No"
              placeholder="Apartment No"
              register={register}
              errorMsg={errors.apartment?.message} // Display error message
            />
          </div>
          <div className="flex w-full items-start justify-start gap-5">
            <div className="w-[50%]">
              <CustomInput
                label="Extra Direction"
                placeholder="Extra Direction"
                name="extra_direction"
                register={register}
                errorMsg={errors.extra_direction?.message}
              />
            </div>
            <div className="flex w-full items-start justify-start gap-2">
              <CustomInput
                label="Map Link"
                placeholder="Map Link"
                name="map_link"
                register={register}
                errorMsg={errors.map_link?.message}
              />
              <div className="mt-5 flex cursor-pointer items-center gap-3 rounded-md bg-primary px-6 py-2 text-white">
                <p>Map</p>
                <img src={Map} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-end gap-3 px-6 pb-4">
        <CustomButton
          name="Cancel"
          handleClick={closeModal}
          style="bg-danger"
        />
        <CustomButton
          name={editableAddressId?.address_id ? "Update" : "Save"}
          handleClick={handleSubmit(handleSave)}
          loading={isLoading}
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
};

export default AddAddressModal;
