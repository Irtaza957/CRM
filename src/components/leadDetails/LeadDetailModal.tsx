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
import { useFetchLeadStagesQuery, useMoveLeadMutation } from "../../store/services/leads";
import { leadChannels } from "../../utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadDetailSchema } from "../../utils/schemas";

interface AddLeadModalProps {
  open: boolean;
  selectedLead: string | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
  isView?: boolean;
  setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
  refetchLeadChat: () => void;
}

const LeadDetailModal = ({
  open,
  setOpen,
  isView,
  selectedLead,
  refetch,
  refetchLeadChat
}: AddLeadModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control
  } = useForm({
    resolver: zodResolver(leadDetailSchema),
    mode: "all",
  });

  const { data: stagesData } = useFetchLeadStagesQuery({})
  const [moveLead, { isLoading }] = useMoveLeadMutation()

  const resetState = () => {
    reset({
      stage: {
        id: "",
        name: "",
        list: []
      },
      channel: {
        id: "",
        name: "",
        list: []
      },
      notes: "",
    });


  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const onSubmit = async (data: any) => {
    try {
      if (selectedLead) {
        const formData = new URLSearchParams();
        formData.append("stage_id", data.stage.id);
        formData.append("lead_id", selectedLead);
        formData.append("log_source", data.channel.id);
        formData.append("notes", data.description);
        const response = await moveLead(formData)

        if (response.error) {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="error"
              title="Error"
              message="Something went wrong!"
            />
          ));
        } else {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="success"
              title="Success"
              message="Lead moved successfully"
            />
          ));
          handleClose()
          refetchLeadChat()
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
          <h1 className="text-xl font-medium">Move</h1>
          <div className="flex items-center justify-center gap-2">
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>
        <div className="h-full max-h-[80vh] w-full overflow-y-scroll p-5">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="stage"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={stagesData}
                  value={field.value}
                  onChange={field.onChange}
                  label="Lead Stage"
                  placeholder="Select Lead Stage"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                  errorMsg={errors?.stage?.message}
                />
              )}
            />
            <Controller
              name="channel"
              control={control}
              render={({ field }) => (
                <Combobox
                  options={leadChannels}
                  value={field.value}
                  onChange={field.onChange}
                  label="Channel"
                  placeholder="Select Channel"
                  mainClassName="w-full"
                  toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                  listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                  listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                  isSearch={false}
                  disabled={isView}
                  errorMsg={errors?.channel?.message}
                />
              )}
            />
          </div>
          <CommonTextarea
            name="description"
            register={register}
            errors={errors}
            disabled={isView}
            placeholder=""
            title="Reason"
            rows={5}
          />

          <div className="mt-6 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            <CustomButton name="Move" handleClick={handleSubmit(onSubmit)} loading={isLoading} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LeadDetailModal;
