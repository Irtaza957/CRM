import { FiEdit } from "react-icons/fi";
import SmallUpDownArrow from "../../../assets/icons/small-updown-arrow.svg";
import CustomButton from "../../ui/CustomButton";
import Table from "../../ui/Table";
import { useEffect, useState } from "react";
import AddSectionModal from "./AddSectionModal";
import { useDeleteSectionMutation, useFetchSectionsQuery, useUpdateSectionStatusMutation } from "../../../store/services/service";
import Loader from "../../ui/Loader";
import Switch from "../../ui/Switch";
import { FaRegTrashAlt } from "react-icons/fa";
import CustomToast from "../../ui/CustomToast";
import { toast } from "sonner";
import DeleteModal from "../../booking/modals/DeleteModal";

const headers = [
  { label: "#", key: "id", sortable: true, sortIcon: SmallUpDownArrow },
  { label: "Name", key: "name", sortable: true, sortIcon: SmallUpDownArrow },
  {
    label: "Description",
    key: "description",
    sortable: true,
    sortIcon: SmallUpDownArrow,
  },
  { label: "Quick Actions", key: "actions", sortable: false },
];

const Sections = ({ selectedServiceId }: { selectedServiceId: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<SectionProps | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const [isView, setIsView] = useState(false);
  const { data: serviceData, isLoading, refetch } = useFetchSectionsQuery(selectedServiceId, {
    skip: !selectedServiceId,
    refetchOnMountOrArgChange: true
  });
  const [deleteSection, { isLoading: deleteSectionLoading }] = useDeleteSectionMutation();
  const [updateSectionStatus] = useUpdateSectionStatusMutation();

  const handleAddModal = () => {
    setIsModalOpen(true);
  };
  const handleEdit = (row: any, isView: boolean = false) => {
    setIsView(isView);
    setIsModalOpen(true);
    setSelectedSection(row);
  };

  const handleStatusToggle = async (row: any) => {
    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append("id", String(row.id));
      urlencoded.append("active", row.active === "1" ? "0" : "1");

      const response = await updateSectionStatus(urlencoded);

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
      const response = await deleteSection(deleteItem);
      if(response?.error){
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Couldn't delete banner. Please try again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Banner deleted successfully!"
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
      setSelectedSection(null)
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
        <CustomButton name="Add Section" handleClick={handleAddModal} />
      </div>
      <div className="w-full h-[calc(100vh-305px)]">
        <Table 
          headers={headers} 
          rows={serviceData || []} 
          renderActions={renderActions} 
          handleRowClick={(row) => handleEdit(row, true)}
        />
      </div>
      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedServiceId={selectedServiceId}
        refetch={refetch}
        selectedSection={selectedSection}
        isView={isView}
        setIsView={setIsView}
      />
      <DeleteModal
        title={`Delete Section`}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        deleteLoading={deleteSectionLoading}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Sections;
