import React, { useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { cn } from "../../../utils/helpers";

interface AddAddressModalProps {
  open: boolean;
  selectedService: ServiceProps | undefined;
  setSelectedService: (arg0: DiscountType) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditServiceModal = ({
  open,
  selectedService,
  setSelectedService,
  setOpen,
}: AddAddressModalProps) => {
  const [discount, setDiscount] = useState<DiscountType>({
    type: "aed",
    value: 0,
  });
  const [newPrice, setNewPrice] = useState<number | string | null>(null);

  const calculateDiscount = () => {
    if (isNaN(discount.value)) {
      return Number(newPrice || selectedService?.price_without_vat);
    }
    if (discount.type === "aed") {
      return (
        Number(newPrice || selectedService?.price_without_vat || selectedService?.price) - discount.value
      );
    } else {
      return (
        Number(newPrice || selectedService?.price_without_vat || selectedService?.price) -
        Number(newPrice || selectedService?.price_without_vat || selectedService?.price) *
          (discount.value / 100)
      );
    }
  };

  const handleSave = () => {
    setSelectedService({
      ...discount,
      total: calculateDiscount(),
      newPrice: Number(newPrice) || 0,
    });
    setDiscount({
      type: "aed",
      value: 0,
    });
    setNewPrice(0);
    setOpen(false);
  };

  useEffect(() => {
    if (selectedService?.discount_type) {
      setDiscount({
        type: selectedService.discount_type,
        value: Number(selectedService.discount_value),
      });
    } else {
      setDiscount({
        type: "aed",
        value: 0,
      });
    }
  }, [selectedService]);

  return (
    <Modal
      open={!!open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[30%] max-w-[80%]"
      title="Service"
    >
      <div className="w-full px-6 py-7">
        <p className="text-left text-[18px] font-bold text-primary">
          Edit Service
        </p>
        <div className="mt-4 w-full">
          {/* <div className='w-full flex gap-5 items-center justify-center'> */}
          <CustomInput
            value={newPrice}
            setter={setNewPrice}
            placeholder="New Price"
            label="New Price"
            type="number"
          />
          <div className="my-5 flex w-full items-center justify-end space-x-4 text-xs text-gray-500">
            <p className="text-xs font-medium text-grey100">Discount</p>
            <div className="flex h-[38px] items-center justify-center space-x-2.5 overflow-hidden rounded-lg border p-2.5">
              <div
                onClick={() => setDiscount({ ...discount, type: "aed" })}
                className="size-3 cursor-pointer rounded-full border border-gray-400 bg-black p-px"
              >
                <div
                  className={cn("size-full rounded-full", {
                    "bg-gray-500": discount.type === "aed",
                  })}
                />
              </div>
              <span>AED</span>
              <div
                onClick={() => setDiscount({ ...discount, type: "percent" })}
                className="size-3 cursor-pointer rounded-full border border-gray-400 p-px"
              >
                <div
                  className={cn("size-full rounded-full", {
                    "bg-gray-500": discount.type === "percent",
                  })}
                />
              </div>
              <span>%</span>
              <input
                value={discount.value}
                type="number"
                placeholder="0.00"
                onChange={(e) => {
                  if (parseInt(e.target.value) >= 0) {
                    setDiscount({
                      ...discount,
                      value: parseInt(e.target.value),
                    });
                  }
                }}
                className="w-10 border-l-2 pl-2.5"
              />
            </div>
          </div>
          <div className="flex w-full items-center justify-end space-x-[115px] border-t-2 border-gray-300 pr-2.5 pt-3 font-bold text-gray-500">
            <p>Total</p>
            <p>
              AED&nbsp;
              {Math.round(calculateDiscount())}
            </p>
          </div>
          {/* </div> */}
          <div className="mt-7 flex w-full justify-end gap-3">
            <CustomButton name="Save" handleClick={handleSave} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditServiceModal;
