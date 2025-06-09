import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoClose } from "react-icons/io5";
import { RiArrowDownSLine } from "react-icons/ri";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";
import { useFetchCompaniesQuery } from "../../store/services/company";
import CustomToast from "../ui/CustomToast";
import Modal from "../ui/Modal";
import Combobox from "../ui/Combobox";
import CustomInput from "../ui/CustomInput";
import { useFetchBranchesQuery } from "../../store/services/filters";
import CustomButton from "../ui/CustomButton";
import {
  useFetchUserByIdQuery,
  useFetchUserDesignationsQuery,
  useFetchUserRolesQuery,
  usePostUserMutation,
  useUpdateUserMutation,
} from "../../store/services/users";

interface AddHomeSectionModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedHomeSection: string;
  refetch: () => void;
  isView?: boolean;
  setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const companySchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  email: z.string().min(1, "Email is required"),
});

const AddUserSection = ({
  open,
  setOpen,
  selectedHomeSection,
  refetch,
  isView,
  setIsView,
}: AddHomeSectionModalProps) => {
  const [company, setCompany] = useState<ListOptionProps | null>(null);
  const [branch, setBranch] = useState<ListOptionProps | null>(null);
  const [role, setRole] = useState<ListOptionProps | null>(null);
  const [designation, setDesignation] = useState<ListOptionProps | null>(null);
  const [dropdownErrors, setDropdownErrors] = useState({
    company: "",
    role: "",
    designation: "",
  });

  const { data: rolesDropdownData } = useFetchUserRolesQuery({open}, {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });
  const { data: designationsDropdownData } = useFetchUserDesignationsQuery({open}, {
    skip: !open,
    refetchOnMountOrArgChange: true,

  });

  const { data: branchesDropodwnData } = useFetchBranchesQuery(
    [{ name: "company", id: `${company?.id}-company` }],
    {
      skip: !company,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: userByIdData } = useFetchUserByIdQuery(selectedHomeSection, {
    skip: !selectedHomeSection || !open,
    refetchOnMountOrArgChange: true,
  });

  const [addUser, { isLoading }] = usePostUserMutation();
  const [updateUser, { isLoading: updateLoading }] = useUpdateUserMutation({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(companySchema),
  });

  const { data: companiesDropdownData } = useFetchCompaniesQuery([], {
    refetchOnMountOrArgChange: true,
  });

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    reset({
      first_name: "",
      email: "",
      last_name: "",
      phone: "",
      username: "",
      password: "",
    });
    setCompany(null);
    setBranch(null);
    setRole(null);
    setDesignation(null);
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("firstname", data.first_name);
      formData.append("lastname", data.last_name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("role_id", String(role?.id || "1"));
      formData.append("company_id", String(company?.id || "0"));
      formData.append("branch_id", String(branch?.id || "0"));
      formData.append("designation_id", String(designation?.id || "0"));

      let response: any;
      if (selectedHomeSection) {
        formData.append("user_id", selectedHomeSection);
        response = await updateUser(formData);
      } else {
        response = await addUser(formData);
      }

      if ("error" in response) {
        console.log(response, "responseresponseresponse");
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message={
              response?.error?.data?.error ||
              `Failed to ${selectedHomeSection ? "update" : "create"} user`
            }
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message={`${selectedHomeSection ? "User updated" : "User created"} successfully`}
          />
        ));
        refetch();
        handleClose();
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
    console.log(userByIdData,selectedHomeSection, 'userByIdDatauserByIdData')
    if (userByIdData?.data && selectedHomeSection) {
      const data=userByIdData?.data
      setValue("first_name", data?.firstname);
      setValue("last_name", data?.lastname);
      setValue("email", data?.email);
      setValue("phone", data?.phone);
      setValue("username", data?.username);
      setValue("password", data?.password);
      const selectedCompany=companiesDropdownData?.find((item: any)=>item.id==data?.company_id)
      const selectedBranch=branchesDropodwnData?.find((item: any)=>item.branch_id===data?.branch_id)
      const selectedRole=rolesDropdownData?.data?.find((item: any)=>item.role_id===data?.role_id)
      const selectedDesignation=designationsDropdownData?.data?.find((item: any)=>item.designation_id===data?.designation_id)
      setCompany(selectedCompany ? {id:selectedCompany.id,name:selectedCompany.name}:null)
      setBranch(selectedBranch ? {id:selectedBranch.branch_id,name:selectedBranch.name}:null)
      setRole(selectedRole ? {id:selectedRole.role_id,name:selectedRole.role}:null)
      setDesignation(selectedDesignation ? {id:selectedDesignation.designation_id,name:selectedDesignation.designation}:null)
    }
  }, [userByIdData, rolesDropdownData, designationsDropdownData, open]);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {isView
              ? "View User"
              : selectedHomeSection
                ? "Update User"
                : "Add User"}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {isView && (
              <FiEdit
                onClick={() => setIsView?.(false)}
                className="h-6 w-6 cursor-pointer text-white"
              />
            )}
            <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>

        <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
          <div className="grid grid-cols-2 gap-5">
            <Combobox
              value={company}
              options={companiesDropdownData?.map((item) => ({
                id: item.id,
                name: item.name,
              }))}
              handleSelect={(value: ListOptionProps) => {
                setCompany(value);
                setDropdownErrors((prev) => ({
                  ...prev,
                  company: "",
                }));
              }}
              label="Select Company"
              placeholder="Select Company"
              mainClassName="w-full"
              toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
              listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="h-5 w-5 text-grey100" />}
              isSearch={false}
              isRemoveAllow={true}
              errorMsg={dropdownErrors.company}
            />
            <Combobox
              value={branch}
              options={branchesDropodwnData?.map((item) => ({
                id: item.branch_id,
                name: item.name,
              }))}
              handleSelect={(value) => setBranch(value)}
              label="Select Branch"
              placeholder="Select Branch"
              mainClassName="w-full"
              toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
              listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="h-5 w-5 text-grey100" />}
              isSearch={false}
              isRemoveAllow={true}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-5">
            <CustomInput
              name="first_name"
              label="First Name"
              register={register}
              errorMsg={errors?.first_name?.message}
              placeholder="Enter first name..."
              disabled={isView}
            />
            <CustomInput
              name="last_name"
              label="Last Name"
              register={register}
              errorMsg={errors?.last_name?.message}
              placeholder="Enter last name..."
              disabled={isView}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-5">
            <CustomInput
              name="email"
              label="Email"
              register={register}
              errorMsg={errors?.username?.message}
              placeholder="Enter email..."
              disabled={isView}
              type="email"
            />
            <CustomInput
              name="username"
              label="Username"
              register={register}
              errorMsg={errors?.username?.message}
              placeholder="Enter username..."
              disabled={isView}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-5">
            <CustomInput
              name="phone"
              label="Phone"
              register={register}
              errorMsg={errors?.phone?.message}
              placeholder="Enter phone..."
              disabled={isView}
            />
            <CustomInput
              name="password"
              label="Password"
              register={register}
              errorMsg={errors?.password?.message}
              placeholder="Enter password..."
              disabled={isView}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-5">
            <Combobox
              value={role}
              options={rolesDropdownData?.data?.map((item: any) => {
                return {
                  id: item.role_id,
                  name: item.role,
                };
              })}
              handleSelect={(value) => {
                setRole(value);
                setDropdownErrors((prev) => ({
                  ...prev,
                  role: "",
                }));
              }}
              label="Select Role"
              placeholder="Select Role"
              mainClassName="w-full"
              toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
              listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="h-5 w-5 text-grey100" />}
              isSearch={false}
              isRemoveAllow={true}
              errorMsg={dropdownErrors.role}
            />
            <Combobox
              value={designation}
              options={designationsDropdownData?.data?.map((item: any) => {
                return {
                  id: item.designation_id,
                  name: item.designation,
                };
              })}
              handleSelect={(value) => {
                setDesignation(value);
                setDropdownErrors((prev) => ({
                  ...prev,
                  designation: "",
                }));
              }}
              label="Select Designation"
              placeholder="Select Designation"
              mainClassName="w-full"
              toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
              listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<RiArrowDownSLine className="h-5 w-5 text-grey100" />}
              isSearch={false}
              isRemoveAllow={true}
              errorMsg={dropdownErrors.designation}
            />
          </div>

          <div className="col-span-2 mt-5 flex w-full items-end justify-end gap-3">
            <CustomButton
              name="Cancel"
              handleClick={handleClose}
              style="bg-danger"
            />
            {!isView && (
              <CustomButton
                name={selectedHomeSection ? "Update" : "Save"}
                handleClick={handleSubmit(
                  (data) => onSubmit(data),
                  (errors) => {
                    console.log("Validation errors:", errors);
                    if (!company?.id) {
                      setDropdownErrors((prev) => ({
                        ...prev,
                        company: "Company is required",
                      }));
                    }
                    if (!role?.id) {
                      setDropdownErrors((prev) => ({
                        ...prev,
                        role: "Role is required",
                      }));
                    }
                    if (!designation?.id) {
                      setDropdownErrors((prev) => ({
                        ...prev,
                        designation: "Designation is required",
                      }));
                    }
                  }
                )}
                loading={isLoading || updateLoading}
                disabled={isLoading || updateLoading}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserSection;
