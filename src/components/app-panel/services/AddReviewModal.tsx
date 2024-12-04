import { useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import { IoClose } from "react-icons/io5";
import {
  useAddReviewMutation,
  useUpdateReviewMutation,
} from "../../../store/services/service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import { RiArrowDownSLine } from "react-icons/ri";
import Combobox from "../../ui/Combobox";
import { useFetchCustomersMutation } from "../../../store/services/customer";
import { FiEdit } from "react-icons/fi";
import CommonTextarea from "../../ui/CommonTextarea";

interface AddReviewModalProps {
  open: boolean;
  onClose: () => void;
  reviewData?: ReviewProps | null;
  selectedServiceId: string;
  refetch: () => void;
  isView: boolean;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddReviewModal = ({
  open,
  onClose,
  reviewData,
  selectedServiceId,
  refetch,
  isView,
  setIsView
}: AddReviewModalProps) => {
  const [customer, setCustomer] = useState<ListOptionProps | null>(null)
  const [customersData, setCustomersData] = useState<ListOptionProps[] | []>([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [addReview, {isLoading: isLoadingAdd}] = useAddReviewMutation();
  const [updateReview, {isLoading: isLoadingUpdate}] = useUpdateReviewMutation();
  const { user } = useSelector((state: RootState) => state.global);
   const [fetchCustomers] =
    useFetchCustomersMutation();

  useEffect(() => {
    if (reviewData) {
      setValue("customer_id", reviewData.customer_id);
      setValue("review", reviewData.review);
      setValue("description", reviewData.description);
    }
  }, [reviewData, setValue]);
  const getCustomers = async () => {
    const response = await fetchCustomers({});
    const temp=response?.data?.data?.map((item: CustomerProps)=> ({id: item.customer_id, name: item.full_name}))
    setCustomersData(temp || []);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const resetState=()=>{
    reset({
      review: "",
      description: "",
    })
    setCustomer(null)
  }

  const handleFormSubmit = async (data: any) => {
    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append("customer_id", '1');
      urlencoded.append("review", data.review);
      urlencoded.append("description", data.description);
      urlencoded.append("user_id", String(user?.id || ''));
      let response
      if (reviewData?.review_id) {
        urlencoded.append("review_id", reviewData.review_id);
        response=await updateReview(urlencoded);
      } else {
        urlencoded.append("service_id", selectedServiceId);
        response=await addReview(urlencoded);
      }
      if (response?.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Something Went Wrong!`}
          />
        ));
      } else {
        resetState()
        refetch()
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Successfully Added Review!`}
          />
        ));
        handleClose()
      }
      handleClose();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleSelectCustomer = (option: ListOptionProps) => {
    setCustomer(option)
  }

  useEffect(()=>{
    if(open){
      getCustomers()
    }
  },[open])

  useEffect(() => {
    if (reviewData) {
      setValue("review", reviewData.review)
      setValue("description", reviewData.description)
    }
  }, [reviewData, open])

  useEffect(()=>{
    if(customersData && reviewData?.customer_id){
      const selectedCustomer=customersData.find(item=> item.id==reviewData.customer_id)
      setCustomer(selectedCustomer || null)
    }
  },[customersData])

  useEffect(()=>{
    if(!open){
      resetState()
    }
  },[open])


  return (
    <Modal open={open} setOpen={handleClose} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {reviewData?.review_id ? `${isView ? 'View' : 'Edit'} Review` : "Add Review"}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {isView && (
              <FiEdit onClick={() => setIsView?.(false)} className="h-6 w-6 cursor-pointer text-white" />
            )}
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <div className="space-y-4">
          <Combobox
              options={customersData}
              value={customer}
              handleSelect={handleSelectCustomer}
              label="Customer"
              placeholder="Select Customer"
              mainClassName="w-full"
              toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
              listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="size-5 text-grey100" />}
              disabled={isView}
            />
            <CustomInput
              name="review"
              label="Review"
              register={register}
              errorMsg={errors?.review?.message}
              placeholder="Enter Review"
              disabled={isView}
            />
            <CommonTextarea
                name="description"
                register={register}
                errors={errors}
                disabled={isView}
                placeholder="Enter description..."
                title="Description"
                rows={6}
              />

            <div className="flex justify-end space-x-3 pt-9">
              <CustomButton
                name="Cancel"
                handleClick={handleClose}
                style="bg-danger"
              />
              {!isView && (
                <CustomButton 
                  name={reviewData?.review_id ? "Update" : "Save"} 
                handleClick={handleSubmit(handleFormSubmit)}
                loading={isLoadingAdd || isLoadingUpdate}
                  disabled={isLoadingAdd || isLoadingUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddReviewModal;
