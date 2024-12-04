import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoClose, IoCalendarOutline } from "react-icons/io5";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import Combobox from "../../ui/Combobox";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import {
  usePostCouponMutation,
  useUpdateCouponMutation,
} from "../../../store/services/coupons";
import { RiArrowDownSLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FiEdit } from "react-icons/fi";
import dayjs from "dayjs";
import CustomDatePicker from "../../ui/CustomDatePicker";
import { discountTypes } from "../../../utils/constants";

interface AddCouponModalProps {
  open: boolean;
  selectedCoupon: CouponProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView?: boolean;
  setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
  businessId: string | number | null;
  companyId: string | number | null;
}

const AddCouponModal = ({
  open,
  setOpen,
  selectedCoupon,
  refetch,
  isView,
  setIsView,
  businessId,
  companyId
}: AddCouponModalProps) => {
  const [discountType, setDiscountType] = useState<ListOptionProps | null>(
    null
  );
  const [expiryDate, setExpiryDate] = useState<string | Date>(new Date());

  const { user } = useSelector((state: RootState) => state.global);
  const [createCoupon, { isLoading }] = usePostCouponMutation();
  const [updateCoupon, { isLoading: updateLoading }] =
    useUpdateCouponMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const resetState=()=>{
    reset({
      total_redeems: '',
      name: '',
      code: ''
    });
    setDiscountType(null);
    setExpiryDate(new Date());
  }

  const handleClose = () => {
    setOpen(false);
    resetState()
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new URLSearchParams();
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("expiry_date", dayjs(expiryDate).format("YYYY-MM-DD"));
      formData.append("total_redeems", data.total_redeems);
      formData.append("discount_type", String(discountType?.id));
      formData.append("discount_value", data.discount_value);
      formData.append("company_id", String(companyId));
      formData.append("business_id", String(businessId));
      formData.append("user_id", String(user?.id));

      let response;
      if (selectedCoupon?.coupon_id) {
        formData.append("coupon_id", selectedCoupon.coupon_id);
        response = await updateCoupon(formData);
      } else {
        response = await createCoupon(formData);
      }

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Failed to ${selectedCoupon?.coupon_id ? "update" : "create"} coupon`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Coupon ${selectedCoupon?.coupon_id ? "updated" : "created"} successfully`}
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
    if (selectedCoupon?.coupon_id) {
      setValue("name", selectedCoupon.name);
      setValue("code", selectedCoupon.code);
      setValue("discount_value", selectedCoupon.discount_value);
      setValue("total_redeems", selectedCoupon.total_redeems);
      setExpiryDate(selectedCoupon.expiry_date);

      const selectedType = discountTypes.find(
        (type) => type.id === selectedCoupon.discount_type
      );
      if (selectedType) {
        setDiscountType(selectedType);
      }
    }
  }, [selectedCoupon]);

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
            {selectedCoupon?.coupon_id ? "Update Coupon" : "Add Coupon"}
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
              name="name"
              label="Name"
              register={register}
              errorMsg={errors?.name?.message}
              placeholder="Enter coupon name"
              disabled={isView}
            />
            <CustomInput
              name="code"
              label="Code"
              register={register}
              errorMsg={errors?.code?.message}
              placeholder="Enter coupon code"
              disabled={isView}
            />
            <div className="flex w-full flex-col">
              <label className="mb-1 w-full text-left text-xs font-medium text-grey100">
                Expiry Date
              </label>
              <CustomDatePicker
                date={expiryDate}
                setDate={setExpiryDate}
                toggleButton={
                  <div className="flex w-full items-center justify-between rounded-lg bg-gray-100 p-3 text-xs font-medium text-grey100">
                    <p className="whitespace-nowrap">
                      {dayjs(expiryDate).format("DD MMM YYYY")}
                    </p>
                    <div>
                      <IoCalendarOutline className="h-5 w-5 text-grey100" />
                    </div>
                  </div>
                }
                disabled={isView}
              />
            </div>
            <CustomInput
              name="total_redeems"
              label="Total Redeems"
              register={register}
              errorMsg={errors?.total_redeems?.message}
              placeholder="Enter total redeems"
              type="number"
              disabled={isView}
            />
            <Combobox
              options={discountTypes}
              value={discountType}
              handleSelect={(value: ListOptionProps) => setDiscountType(value)}
              label="Discount Type"
              placeholder="Select Discount Type"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              isSearch={false}
              disabled={isView}
            />
            <CustomInput
              name="discount_value"
              label="Discount Value"
              register={register}
              errorMsg={errors?.discount_value?.message}
              placeholder={`Enter discount ${discountType?.name === "percent" ? "percentage" : "amount"}`}
              type="number"
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
                name={selectedCoupon?.coupon_id ? "Update" : "Save"}
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

export default AddCouponModal;
