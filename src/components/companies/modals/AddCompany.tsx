import { toast } from "sonner";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
import { type Dispatch, type SetStateAction, useState } from "react";

import Modal from "../../ui/Modal";
import { RootState } from "../../../store";
import CustomInput from "../../ui/CustomInput";
import CustomToast from "../../ui/CustomToast";
import { usePostCompanyMutation } from "../../../store/services/company";

interface AddCompanyModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AddCompany = ({ open, setOpen }: AddCompanyModalProps) => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [license, setLicense] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [business, setBusiness] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [createCompany, { isLoading }] = usePostCompanyMutation();
  const { user } = useSelector((state: RootState) => state.global);

  const clearForm = () => {
    setCode("");
    setName("");
    setPhone("");
    setEmail("");
    setBusiness("");
    setWorkingHours("");
    setLicense("");
    setAddress("");
    setIndustry("");
  };

  const handleCategorySubmit = async () => {
    const formData = new FormData();
    formData.append("user_id", `${user?.id}`);
    formData.append("business", business);
    formData.append("code", code);
    formData.append("name", name);
    formData.append("license", license);
    formData.append("industry", industry);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("working_hours", workingHours);
    formData.append("area_id", "1");
    formData.append("address", address);

    try {
      const data = await createCompany(formData);
      if (data.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="error"
            message="Couldn't Create Company. Please Try Again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="success"
            message="Created Company Successfully!"
          />
        ));
        clearForm();
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="error"
          message="Couldn't Create Category. Please Try Again!"
        />
      ));
    }
  };

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-3xl">
      <div className="flex w-full flex-col items-center justify-center">
        <div className="flex w-full items-center justify-between rounded-t-lg bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">New Company</h1>
          <IoClose
            onClick={() => {
              setOpen(false);
              clearForm();
            }}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCategorySubmit();
          }}
          className="no-scrollbar grid max-h-full w-full grid-cols-2 gap-5 overflow-auto p-5"
        >
          <CustomInput
            type="text"
            label="Business"
            value={business}
            setter={setBusiness}
            placeholder="Business"
          />
          <CustomInput
            type="text"
            label="Company Code"
            value={code}
            setter={setCode}
            placeholder="Code"
          />
          <CustomInput
            type="text"
            label="Company Name"
            value={name}
            setter={setName}
            placeholder="Name"
          />
          <CustomInput
            type="text"
            label="Licence"
            value={license}
            setter={setLicense}
            placeholder="License"
          />
          <CustomInput
            type="text"
            label="Industry"
            value={industry}
            setter={setIndustry}
            placeholder="Industry"
          />
          <CustomInput
            type="text"
            label="Phone"
            value={phone}
            setter={setPhone}
            placeholder="Phone"
          />
          <CustomInput
            type="text"
            label="Email"
            value={email}
            setter={setEmail}
            placeholder="Email"
          />
          <CustomInput
            type="text"
            label="Working Hours"
            value={workingHours}
            setter={setWorkingHours}
            placeholder="09:00 - 07:00"
          />
          <CustomInput
            type="text"
            label="Address"
            value={address}
            setter={setAddress}
            placeholder="Address"
          />
          <div className="col-span-2 flex w-full items-end justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="place-self-end rounded-lg bg-primary px-10 py-2 text-white"
            >
              {isLoading ? (
                <div className="flex w-full items-center justify-center gap-2">
                  <LuLoader2 className="animate-spin" />
                  <span>Please Wait...</span>
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddCompany;
