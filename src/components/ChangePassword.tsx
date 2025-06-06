import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useChangePasswordMutation } from "../store/services/user";
import CustomToast from "./ui/CustomToast";
import { toast } from "sonner";
import Modal from "./ui/Modal";
import CustomInput from "./ui/CustomInput";
import CustomButton from "./ui/CustomButton";

interface AddHomeSectionModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
}

const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),

    new_password: z.string().min(1, "New password is required"),

    confirm_password: z.string().min(1, "Confirm password should match new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

const ChangePassword = ({
  open,
  setOpen,
  handleLogout,
}: AddHomeSectionModalProps) => {
  const { user } = useSelector((state: RootState) => state.global);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    reset({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("user_id", String(user?.id));
      formData.append("current_password", data.current_password);
      formData.append("new_password", data.new_password);

      const response = await changePassword(formData);

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Failed to change password`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Password changed successfully`}
          />
        ));
        handleLogout();
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
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Change Password</h1>
          <div className="flex items-center justify-center gap-2">
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <CustomInput
            name="current_password"
            label="Current Password"
            register={register}
            errorMsg={errors?.current_password?.message}
            placeholder="Enter current password..."
          />
          <div className="my-3">
            <CustomInput
              name="new_password"
              label="New Password"
              register={register}
              errorMsg={errors?.new_password?.message}
              placeholder="Enter new password..."
            />
          </div>
          <CustomInput
            name="confirm_password"
            label="Confirm Password"
            register={register}
            errorMsg={errors?.confirm_password?.message}
            placeholder="Enter confirm password..."
          />

          <div className="col-span-2 mt-3 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            <CustomButton
              name={"Save"}
              handleClick={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ChangePassword;
