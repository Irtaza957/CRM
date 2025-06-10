import { useState } from "react";
import { usersHeaders } from "../utils/constants";
import Table from "../components/ui/Table";
import { FiEdit } from "react-icons/fi";
import DeleteModal from "../components/booking/modals/DeleteModal";
import { toast } from "sonner";
import CustomToast from "../components/ui/CustomToast";
import AddUserModal from "../components/users/AddUserModal";
import {
  useActivateUserMutation,
  useDeleteUserMutation,
  useFetchAllUsersQuery,
} from "../store/services/users";
import Switch from "../components/ui/Switch";

const Users = () => {
  const [add, setAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { data: users, refetch } = useFetchAllUsersQuery({});
  const [deleteUserMutation, { isLoading }] = useDeleteUserMutation();
  const [activateUserMutation] = useActivateUserMutation();

  const handleEdit = (row: any, editMode?: boolean) => {
    setSelectedCustomer(row.user_id);
    setAdd(true);
    setEditMode(editMode || false);
  };

  const renderActions = (row: any) => (
    <div className="mr-2 flex justify-end gap-3">
      <FiEdit
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(row);
        }}
        className="col-span-1 h-5 w-5 cursor-pointer rounded-md bg-red-500 p-1 text-white"
      />
      {/* <FaRegTrashAlt
        onClick={(e) => {
          e.stopPropagation();
          setSelectedCustomer(row.user_id);
          setOpenDeleteModal(true);
        }}
        className="h-5 w-5 cursor-pointer"
      /> */}
      <Switch
        checked={row.active === "1"}
        onChange={() => {
          handleStatusToggle(row);
        }}
      />
    </div>
  );

  const handleStatusToggle = async (row: any) => {
    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append("user_id", String(row.user_id));
      urlencoded.append("active", row.active === "1" ? "0" : "1");

      const response = await activateUserMutation(urlencoded);

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
            message={`User ${row.active === "1" ? "deactivated" : "activated"} successfully!`}
          />
        ));
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Error"
          message="Error Occured. Please try again!"
        />
      ));
    }
  };

  const handledeleteConfirm = async () => {
    try {
      const response = await deleteUserMutation(selectedCustomer);
      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={`Failed to delete user`}
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`User deleted successfully`}
          />
        ));
        setOpenDeleteModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-start">
      <DeleteModal
        title={`Delete User`}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        deleteLoading={isLoading}
        handleDelete={handledeleteConfirm}
      />
      <AddUserModal
        open={add}
        setOpen={setAdd}
        setIsView={setEditMode}
        selectedHomeSection={selectedCustomer || ""}
        refetch={refetch}
        isView={editMode}
      />
      <div className="mt-1 flex w-full justify-end">
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSelectedCustomer(null);
              setEditMode(false);
              setAdd(true);
            }}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-md"
          >
            New User
          </button>
        </div>
      </div>
      <Table
        headers={usersHeaders}
        rows={users?.data || []}
        renderActions={renderActions}
        handleRowClick={(row) => handleEdit(row, true)}
      />
    </div>
  );
};

export default Users;
