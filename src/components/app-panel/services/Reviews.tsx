import { FiEdit } from "react-icons/fi";
import SmallUpDownArrow from "../../../assets/icons/small-updown-arrow.svg";
import CustomButton from "../../ui/CustomButton";
import Table from "../../ui/Table";
import AddReviewModal from "./AddReviewModal";
import { useEffect, useState } from "react";
import { useDeleteReviewMutation, useFetchReviewsQuery, useUpdateReviewStatusMutation } from "../../../store/services/service";
import Loader from "../../ui/Loader";
import CustomToast from "../../ui/CustomToast";
import { toast } from "sonner";
import DeleteModal from "../../booking/modals/DeleteModal";
import Switch from "../../ui/Switch";
import { FaRegTrashAlt } from "react-icons/fa";

const headers = [
  { label: "#", key: "id", sortable: true, sortIcon: SmallUpDownArrow },
  { label: "Review", key: "review", sortable: true, sortIcon: SmallUpDownArrow },
  {
    label: "Description",
    key: "description",
    sortable: true,
    sortIcon: SmallUpDownArrow,
  },
  { label: "Quick Actions", key: "actions", sortable: false },
];

const Reviews = ({ selectedServiceID }: { selectedServiceID: string }) => {
  const [openModal, setOpen] = useState(false);
  const [isView, setIsView] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewProps | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);

  const [deleteReview, { isLoading: deleteReviewLoading }] = useDeleteReviewMutation();
  const [updateReviewStatus] = useUpdateReviewStatusMutation();
  const { data: reviews, refetch, isLoading } = useFetchReviewsQuery(selectedServiceID, {
    skip: !selectedServiceID,
    refetchOnMountOrArgChange: true
  });

  const handleAddModal = () => {
    setOpen(true);
  };

  const handleEdit = (row: any, isView: boolean = false) => {
    setOpen(true);
    setSelectedReview(row);
    setIsView(isView);
  };

  const handleStatusToggle = async (row: any) => {
    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append("id", String(row.review_id));
      urlencoded.append("active", row.active === "1" ? "0" : "1");

      const response = await updateReviewStatus(urlencoded);

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
      const response = await deleteReview(deleteItem);
      if (response?.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Couldn't delete review. Please try again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Review deleted successfully!"
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
    setDeleteItem(row?.review_id);
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
    if (!openModal) {
      setSelectedReview(null)
    }
  }, [openModal])


  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="w-full">
      <AddReviewModal 
        open={openModal} 
        onClose={() => setOpen(false)} 
        selectedServiceId={selectedServiceID} 
        reviewData={selectedReview} refetch={refetch}
        isView={isView}
        setIsView={setIsView}
      />
      <div className="mb-3 flex justify-end">
        <CustomButton name="Add Review" handleClick={handleAddModal} />
      </div>
      <div className="w-full h-[calc(100vh-305px)]">
        <Table
          headers={headers}
          rows={reviews || []}
          renderActions={renderActions}
          handleRowClick={(row) => handleEdit(row, true)}
        />
      </div>
      <DeleteModal
        title={`Delete Review`}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        deleteLoading={deleteReviewLoading}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Reviews;
