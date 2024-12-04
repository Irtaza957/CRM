import React from "react";
import Modal from "../../ui/Modal";
import CustomButton from "../../ui/CustomButton";
interface DeleteAttachmentModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteLoading?: boolean;
  title: string;
  handleDelete: () => void;
}

const DeleteModal = ({
  open,
  setOpen,
  deleteLoading,
  handleDelete,
  title
}: DeleteAttachmentModalProps) => {

  return (
    <Modal
      open={!!open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-[30%] max-w-[80%]"
      title={title}
    >
      <div className="w-full p-5">
        <p className="text-left text-[18px] font-bold text-primary">
          Are you sure you want to delete?
        </p>
        <div className="mt-7 flex w-full justify-end gap-3">
          <CustomButton name="Cancel" handleClick={() => setOpen(false)} />
          <CustomButton
            name="Delete"
            style="bg-danger"
            handleClick={handleDelete}
            loading={deleteLoading}
            disabled={deleteLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
