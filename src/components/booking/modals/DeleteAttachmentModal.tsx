import React from "react";
import Modal from "../../ui/Modal";
import CustomButton from "../../ui/CustomButton";
import { useDeleteAttachmentMutation } from "../../../store/services/booking";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";

interface DeleteAttachmentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  attachment: AttachmentProps;
  getAttachments: (agr0: string) => void;
}

const DeleteAttachmentModal = ({
  open,
  setOpen,
  attachment,
  getAttachments,
}: DeleteAttachmentModalProps) => {
  const [deleteAttachment] = useDeleteAttachmentMutation();

  const handleDeleteAttachment = async (attachment: AttachmentProps) => {
    try {
      const formData = new FormData();
      formData.append("file_name", attachment?.file_name);
      formData.append("file_type", attachment?.file_type);
      formData.append("attachment_id", attachment?.attachment_id);
      const response=await deleteAttachment(formData);
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
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`Attachment Deleted Successfully!`}
          />
        ));
        getAttachments(attachment?.customer_id || "");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={!!open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[30%] max-w-[80%]"
      title="Delete Attachment"
    >
      <div className="w-full px-6 py-7">
        <p className="text-left text-[18px] font-bold text-primary">
          Are you sure you want to delete this attachment?
        </p>
        <div className="mt-7 flex w-full justify-end gap-3">
          <CustomButton name="Cancel" handleClick={() => setOpen(false)} />
          <CustomButton
            name="Delete"
            style="bg-danger"
            handleClick={() => handleDeleteAttachment(attachment)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAttachmentModal;
