import { FiEdit } from "react-icons/fi";
import SmallUpDownArrow from "../../../assets/icons/small-updown-arrow.svg";
import CustomButton from "../../ui/CustomButton";
import Table from "../../ui/Table";
import AddReviewModal from "./AddReviewModal";
import { useState } from "react";

const headers = [
    { label: "#", key: "id", sortable: true, sortIcon: SmallUpDownArrow },
    { label: "Review", key: "name", sortable: true, sortIcon: SmallUpDownArrow },
    { label: "Description", key: "description", sortable: true, sortIcon: SmallUpDownArrow },
    { label: "Quick Actions", key: "actions", sortable: false },
];

const rows = [
    { id: "1", name: "abc", description: "xyz" },
    { id: "2", name: "asd", description: "qwe" },
];

const Reviews = () => {
    const [openModal, setOpen] = useState(false)
    const handleAddModal = () => {
        setOpen(true)
    }

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
        <div className="w-full ">
            <AddReviewModal open={openModal} onClose={()=>setOpen(false)} />
            <div className="flex justify-end mb-3">
                <CustomButton
                    name="Add Review"
                    handleClick={handleAddModal}
                />
            </div>
            <Table headers={headers} rows={rows} renderActions={renderActions} />
        </div>
    )
}

export default Reviews