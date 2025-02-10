import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import Modal from "../ui/Modal";
import CustomButton from "../ui/CustomButton";
import Combobox from "../ui/Combobox";
import { toast } from "sonner";
import CustomToast from "../ui/CustomToast";
import { RiArrowDownSLine } from "react-icons/ri";
import CommonTextarea from "../ui/CommonTextarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadAssignSchema } from "../../utils/schemas";
import { useAssignLeadMutation, useFetchUsersQuery } from "../../store/services/leads";

interface LeadAssignModalProps {
  open: boolean;
  selectedLead: LeadProps | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView?: boolean;
  setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLeadId: string | null
}

const LeadAssignModal = ({
  open,
  setOpen,
  isView,
  selectedLeadId,
  refetch,
}: LeadAssignModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leadAssignSchema),
    mode: "all",
  });


  const [assignLead, {isLoading: assignLoading}] = useAssignLeadMutation()
  const {data: users} = useFetchUsersQuery({})

  const resetState = () => {
    reset({
      agent: { id: 0, name: "", list: [] }
    });
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const onSubmit = async (data: any) => {
    try {
      if(selectedLeadId){
        const formData = new URLSearchParams();
        formData.append("user_id", data.agent.id);
        formData.append("lead_id", selectedLeadId);
        formData.append("note", data.description);
        const response = await assignLead(formData)
        if(response?.error){
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="error"
              title="Error"
              message="Something went wrong"
            />
          ))
        }else{
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="success"
              title="Success"
              message="Lead assigned successfully!"
            />
          ))
          setOpen(false)
          refetch()
        }
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
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-2xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">Assign</h1>
          <div className="flex items-center justify-center gap-2">
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>
        <div className="h-full max-h-[80vh] w-full overflow-y-scroll p-5">
          <Controller
            name="agent"
            control={control}
            render={({ field }) => (
              <Combobox
                options={users}
                value={field.value}
                onChange={field.onChange}
                label="Agent"
                placeholder="Select Agent"
                mainClassName="w-full"
                toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                isSearch={false}
                disabled={isView}
                errorMsg={errors?.agent?.message}
              />
            )}
          />
          <CommonTextarea
            name="description"
            register={register}
            disabled={isView}
            placeholder=""
            title="Instrucion"
            rows={6}
          />

          <div className="mt-8 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            <CustomButton name="Assign" handleClick={handleSubmit(onSubmit)} loading={assignLoading} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeadAssignModal;
