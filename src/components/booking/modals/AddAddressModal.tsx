import React, { useState, useEffect } from "react";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import Combobox from "../../ui/Combobox";
import { RiArrowDownSLine } from "react-icons/ri";
import CustomButton from "../../ui/CustomButton";
import {
  useAddAddressMutation,
  useUpdateAddressMutation,
} from "../../../store/services/booking";
import { useForm } from "react-hook-form";
import CustomToast from "../../ui/CustomToast";
import { toast } from "sonner";

interface AddAddressModalProps {
  open: boolean;
  customerId?: string;
  userId?: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  getAddresses: (agr0: string) => void;
  editableAddressId?: any;
  editMode?: boolean;
}

const emiratesOption = [
  { id: 1, name: "abc" },
  { id: 2, name: "xyz" },
  { id: 3, name: "asd" },
];

const AddAddressModal = ({
  open,
  customerId,
  userId,
  setOpen,
  getAddresses,
  editableAddressId,
  editMode,
}: AddAddressModalProps) => {
  const [emirate, setEmirate] = useState<any | null>(null);
  const [villa, setVilla] = useState<any | null>(null);

  const [addAddress, { isLoading }] = useAddAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

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

  const { register, setValue, reset, handleSubmit } = useForm({
    defaultValues,
  });

  const handleSelectEmirate = (value: any) => {
    setEmirate(value);
    setValue("emirate_id", value.id);
  };

  const handleSelectArea = (value: any) => {
    setVilla(value);
    setValue("area_id", value.id);
  };

  useEffect(() => {
    if (open) {
      if (editMode && editableAddressId) {
        setValue("address_type", editableAddressId.address_type);
        setValue("emirate_id", editableAddressId.emirate);
        setValue("area_id", editableAddressId.area_id);
        setValue("building_no", editableAddressId.building_no);
        setValue("apartment", editableAddressId.apartment);
        setValue("street", editableAddressId.street);
        setValue("map_link", editableAddressId.map_link);
        setValue("extra_direction", editableAddressId.extra_direction);

        // Set Emirate and Area Combobox values
        setEmirate({
          id: editableAddressId.emirate,
          name: editableAddressId.emirate,
        });
        setVilla({
          id: editableAddressId.area_id,
          name: editableAddressId.area,
        });
      } else {
        reset(); // Clear form if not in edit mode
        setEmirate(null); // Reset emirate dropdown value
        setVilla(null); // Reset area dropdown value
      }
    }
  }, [editMode, editableAddressId, open, setValue, reset]);

  const handleSave = async (data: any) => {
    try {
      if (customerId && userId) {
        const urlencoded = new URLSearchParams();
        urlencoded.append("user_id", String(userId));
        urlencoded.append("customer_id", customerId);
        urlencoded.append("address_type", data?.address_type);
        urlencoded.append("area_id", data?.area_id);
        urlencoded.append("building_no", data?.building_no);
        urlencoded.append("apartment", data?.apartment);
        urlencoded.append("street", data?.street);
        urlencoded.append("map_link", data?.map_link);
        urlencoded.append("extra_direction", data?.extra_direction);
        urlencoded.append("lat", "0");
        urlencoded.append("lng", "0");
        urlencoded.append("is_default", "0");

        if (editMode) {
          urlencoded.append("address_id", editableAddressId?.address_id);
          await updateAddress(urlencoded);
        } else {
          await addAddress(urlencoded);
        }
        reset();
        getAddresses(customerId);
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Successfully Added Address!"
          />
        ));
        closeModal();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setOpen(false);

    // Reset the form fields to their initial default values
    reset(defaultValues);

    // Reset the dropdown values
    setEmirate(null);
    setVilla(null);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[60%] max-w-[80%]"
      title={editMode ? "Edit Address" : "Add Address"}
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
            />
            <Combobox
              value={emirate}
              options={emiratesOption}
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
              options={emiratesOption}
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
              label="Steet"
              placeholder="Steet"
              register={register}
            />
            <CustomInput
              name="building_no"
              label="Building"
              placeholder="Building Name"
              type="text"
              register={register}
            />
            <CustomInput
              label="Villa / Apartment No."
              placeholder="Villa / Apartment No."
              name="apartment"
              type="text"
              register={register}
            />
          </div>
          <div className="flex w-full items-center justify-center gap-5">
            <div className="w-[50%]">
              <CustomInput
                label="Extra Direction"
                placeholder="Type..."
                name="extra_direction"
                type="text"
                register={register}
              />
            </div>
            <div className="w-full">
              <CustomInput
                label="Map Link"
                placeholder="Map Link"
                name="map_link"
                type="text"
                register={register}
              />
            </div>
          </div>
          <div className="mt-7 flex w-full justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={closeModal}
              style="bg-danger"
            />
            <CustomButton
              name={editMode ? "Update" : "Save"}
              handleClick={handleSubmit(handleSave)}
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddAddressModal;
