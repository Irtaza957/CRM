import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import SmallUpDownArrow from "../../../assets/icons/small-updown-arrow.svg";
import CustomButton from "../../ui/CustomButton";
import Table from "../../ui/Table";
import AddFAQModal from "./AddFAQModal";
import { useDeleteFAQMutation, useFetchFAQsQuery, useUpdateFAQStatusMutation } from "../../../store/services/service";
import Loader from "../../ui/Loader";
import { FaRegTrashAlt } from "react-icons/fa";
import Switch from "../../ui/Switch";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import DeleteModal from "../../booking/modals/DeleteModal";

interface FAQProps {
  faq_id: string;
  question: string;
  answer: string;
  service_id: string;
  user_id: number;
  id: string;
}

const headers = [
  { label: "#", key: "id", sortable: true, sortIcon: SmallUpDownArrow },
  {
    label: "Question",
    key: "question",
    sortable: true,
    sortIcon: SmallUpDownArrow,
  },
  {
    label: "Answer",
    key: "answer",
    sortable: true,
    sortIcon: SmallUpDownArrow,
  },
  { label: "Quick Actions", key: "actions", sortable: false },
];

const FAQs = ({ serviceId }: { serviceId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQProps | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const [deleteFAQ, { isLoading: deleteFAQLoading }] = useDeleteFAQMutation();
  const [updateFAQStatus] = useUpdateFAQStatusMutation();
  const { data: faqs, refetch, isLoading } = useFetchFAQsQuery(serviceId);

  const handleAddModal = () => {
    setSelectedFAQ(null);
    setIsModalOpen(true);
  };

  const handleEdit = (row: any, isView: boolean = false) => {
    setSelectedFAQ(row);
    setIsModalOpen(true);
    setIsView(isView);
  };

  const handleStatusToggle = async (row: any) => {
    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append("id", String(row.id));
      urlencoded.append("active", row.active === "1" ? "0" : "1");

      const response = await updateFAQStatus(urlencoded);

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Couldn't update status. Please try again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Status updated successfully!"
          />
        ));
        refetch();
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Error"
          message="Couldn't update status. Please try again!"
        />
      ));
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteFAQ(deleteItem);
      if (response?.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Couldn't delete FAQ. Please try again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="FAQ deleted successfully!"
          />
        ));
        refetch()
        setOpenDeleteModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteModal = (row: any) => {
    setOpenDeleteModal(true);
    setDeleteItem(row?.id);
  }

  const renderActions = (row: any) => (
    <div className="flex gap-3 justify-end mr-2">
      <Switch
        checked={row.active === "1"}
        onChange={() => {
          handleStatusToggle(row);
        }}
      />
      <FiEdit
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(row);
        }}
        className="col-span-1 h-5 w-5 cursor-pointer rounded-md bg-red-500 p-1 text-white"
      />
      <FaRegTrashAlt
        onClick={(e) => {
          e.stopPropagation()
          handleDeleteModal(row)
        }}
        className="h-5 w-5 cursor-pointer"
      />
    </div>
  );

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedFAQ(null)
    }
  }, [isModalOpen])

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <CustomButton name="Add FAQ" handleClick={handleAddModal} />
      </div>
      <div className="w-full h-[calc(100vh-305px)]">
        <Table headers={headers} rows={faqs || []} renderActions={renderActions} handleRowClick={(row) => handleEdit(row, true)} />
      </div>
      <AddFAQModal
        isOpen={isModalOpen}
        setOpen={setIsModalOpen}
        selectedFAQ={selectedFAQ}
        serviceId={serviceId}
        refetch={refetch}
        isView={isView}
        setIsView={setIsView}
      />
      <DeleteModal
        title={`Delete FAQ`}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        deleteLoading={deleteFAQLoading}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default FAQs;
