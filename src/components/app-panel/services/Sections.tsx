import { FiEdit } from "react-icons/fi";
import SmallUpDownArrow from "../../../assets/icons/small-updown-arrow.svg";
import CustomButton from "../../ui/CustomButton";
import Table from "../../ui/Table";
import { useState } from "react";
import AddSectionModal from "./AddSectionModal";

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

const rows = [
  { id: "1", name: "abc", description: "xyz" },
  { id: "2", name: "asd", description: "qwe" },
];

const Sections = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = (data: {
    name: string;
    description: string;
    service_id: string;
  }) => {
    console.log("Form submitted with data:", data);
    // Handle the form submission here (e.g., API call)
  };

  const renderActions = (row: any) => (
    <FiEdit
      onClick={(e) => {
        e.stopPropagation();
        console.log("Edit clicked for row:", row);
      }}
      className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-red-500 p-1 text-white"
    />
  );
  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <CustomButton name="Add Section" handleClick={handleAddModal} />
      </div>
      <Table headers={headers} rows={rows} renderActions={renderActions} />
      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Sections;
