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
import { zodResolver } from "@hookform/resolvers/zod";
import CustomToast from "../../ui/CustomToast";
import { toast } from "sonner";
import { addressTypes, emirates } from "../../../utils/constants";
import { addressSchema } from "../../../utils/schemas";
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
  const [addressType, setAddressType] = useState<ListOptionProps | null>(null);
  const [addressTypeError, setAddressTypeError] = useState<string>();
  const [villa, setVilla] = useState<ListOptionProps | null>(null);

  const [addAddress, { isLoading }] = useAddAddressMutation();
  const [updateAddress, { isLoading: updateLoading }] =
    useUpdateAddressMutation();
  const { data: areasDate } = useFetchAreasQuery(emirate?.id as string, {
    skip: !emirate?.id,
    refetchOnMountOrArgChange: true,
  });

  const defaultValues = {
    emirate_id: null,
    area_id: null,
    building_no: "",
    apartment: "",
    street: "",
    map_link: "",
    extra_direction: "",
    longitude: "",
    latitude: "",
  };

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues,
    mode: "all",
  });

  const handleSelectEmirate = (value: any) => {
    setEmirate(value);
    setValue("emirate_id", value.id);
  };

  const handleSelectAddressType = (value: any) => {
    setAddressType(value);
    setAddressTypeError("");
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
        urlencoded.append("address_type", String(addressType?.id || ""));
        urlencoded.append("area_id", data.area_id);
        urlencoded.append("building_no", data.building_no);
        urlencoded.append("apartment", data.apartment);
        urlencoded.append("street", data.street);
        urlencoded.append("map_link", data.map_link);
        urlencoded.append("extra_direction", data.extra_direction);
        urlencoded.append("lat", data.latitude);
        urlencoded.append("lng", data.longitude);
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
      console.log(editableAddressId, "editableAddressIdeditableAddressId");
      if (editableAddressId && editableAddressId?.address_id) {
        setValue("emirate_id", editableAddressId.emirate);
        setValue("area_id", editableAddressId.area_id);
        setValue("building_no", editableAddressId.building_no);
        setValue("apartment", editableAddressId.apartment);
        setValue("street", editableAddressId.street);
        setValue("map_link", editableAddressId.map_link);
        setValue("extra_direction", editableAddressId.extra_direction);
        setValue("latitude", editableAddressId.lat);
        setValue("longitude", editableAddressId.lng);

        // Set Emirate and Area Combobox values
        const selectedAddressType = addressTypes?.find(
          (item) => item.id === editableAddressId.address_type
        );
        if (selectedAddressType) {
          setAddressType(selectedAddressType);
        }
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
            <Combobox
              value={addressType}
              options={addressTypes}
              handleSelect={handleSelectAddressType}
              label="Address Type"
              placeholder="Address Type"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              errorMsg={addressTypeError}
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
              isSearch={true}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              disabled={!emirate?.id}
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
              label="Building / Villa"
              placeholder="Building / Villa"
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
            {/* <div className="w-[50%]"> */}
            <CustomInput
              label="Extra Direction"
              placeholder="Extra Direction"
              name="extra_direction"
              register={register}
              errorMsg={errors.extra_direction?.message}
            />
            {/* </div> */}
            <CustomInput
              label="Longirude"
              placeholder="Longirude"
              name="longitude"
              register={register}
              errorMsg={errors.longitude?.message}
            />
            <CustomInput
              label="Latitude"
              placeholder="Latitude"
              name="latitude"
              register={register}
              errorMsg={errors.latitude?.message}
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
            {/* <div className="mt-5 flex cursor-pointer items-center gap-3 rounded-md bg-primary px-6 py-2 text-white">
                <p>Map</p>
                <img src={Map} alt="" />
              </div> */}
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
          handleClick={handleSubmit(
            (data) => handleSave(data),
            (errors) => {
              console.log("Validation errors:", errors);
              if (!addressType?.id) {
                setAddressTypeError("Address Type is required");
                return;
              }
            }
          )}
          loading={isLoading || updateLoading}
          disabled={isLoading || updateLoading}
        />
      </div>
    </Modal>
  );
};

export default AddAddressModal;
