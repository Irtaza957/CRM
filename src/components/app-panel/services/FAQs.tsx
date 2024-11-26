import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { toast } from "sonner";
import SmallUpDownArrow from "../../../assets/icons/small-updown-arrow.svg";
import CustomButton from "../../ui/CustomButton";
import Table from "../../ui/Table";
import AddFAQModal from "./AddFAQModal";
import CustomToast from "../../ui/CustomToast";
interface FAQProps {
  faq_id: string;
  question: string;
  answer: string;
  service_id: string;
  user_id: number;
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

// Temporary mock data
const rows = [
  { id: "1", question: "What is this?", answer: "This is a FAQ" },
  { id: "2", question: "How does it work?", answer: "It works great!" },
];

const FAQs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQProps | null>(null);

  const handleAddModal = () => {
    setSelectedFAQ(null);
    setIsModalOpen(true);
  };

  const handleEditFAQ = (row: FAQProps) => {
    setSelectedFAQ(row);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    console.log("Form submitted:", data);
    toast.custom((t) => (
      <CustomToast
        t={t}
        type="success"
        title="Success"
        message={`FAQ ${selectedFAQ ? "updated" : "added"} successfully`}
      />
    ));
    setIsModalOpen(false);
  };

  const renderActions = (row: any) => (
    <FiEdit
      onClick={(e) => {
        e.stopPropagation();
        handleEditFAQ(row);
      }}
      className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-red-500 p-1 text-white"
    />
  );

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <CustomButton name="Add FAQ" handleClick={handleAddModal} />
      </div>
      <Table headers={headers} rows={rows} renderActions={renderActions} />

      <AddFAQModal
        isOpen={isModalOpen}
        setOpen={setIsModalOpen}
        selectedFAQ={selectedFAQ}
        serviceId={'1'}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FAQs;
