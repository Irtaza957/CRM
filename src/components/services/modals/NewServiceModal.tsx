import Modal from "../../ui/Modal";
import Combobox from "../../ui/Combobox";
import AddService from "../forms/add/AddService";
import AddCategory from "../forms/add/AddCategory";
import AddSubCategory from "../forms/add/AddSubCategory";

import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { useFetchBusinessesListQuery } from "../../../store/services/filters";
import { cn } from "../../../utils/helpers";

const NewServiceModal = ({
  companiesData,
  open,
  setOpen,
  type,
  selectedCategory,
  refetch,
  refetchServices,
}: NewServiceModalProps) => {
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [provider, setProvider] = useState<ListOptionProps | null>(null);
  const [companyOptions, setCompanyOptions] = useState<ListOptionProps[]>([]);
  const [tab, setTab] = useState<string>("Category");

  const { data: businesses } = useFetchBusinessesListQuery({});
  const providerOptions = [
    {
      id: 1,
      name: "Business",
      value: business,
      setter: setBusiness,
      options: companyOptions,
    },
    {
      id: 2,
      name: "Company",
      value: provider,
      setter: setProvider,
      options: businesses,
    },
  ];

  useEffect(() => {
    if (companiesData?.length) {
      const temp = companiesData?.map((item) => {
        return { id: item.id, name: item.name };
      });
      setCompanyOptions(temp);
    }
  }, [companiesData]);

  useEffect(() => {
    if (selectedCategory?.category_id) {
      const selectedBusiness = businesses?.find(
        (item) => item?.name === selectedCategory?.business
      );
      if (selectedBusiness?.id) {
        setBusiness(selectedBusiness);
      }
      const selectedCompany = companyOptions?.find(
        (item) => item?.name === selectedCategory?.company_name
      );
      if (selectedCompany?.id) {
        setProvider(selectedCompany);
      }
    }
  }, [selectedCategory, open]);

  useEffect(() => {
    if (!open) {
      setBusiness(null);
      setProvider(null);
    }
  }, [open]);
  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-3xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {selectedCategory?.category_id ? (
              "Edit Category"
            ) : (
              <>
                Add New{" "}
                {type === "category"
                  ? "Service"
                  : type === "branch" ? ( tab === "Category" ? "Category" : "Sub Category") : ''}
              </>
            )}
          </h1>
          <IoClose
            onClick={() => setOpen(false)}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <div className="no-scrollbar relative flex h-full max-h-[calc(100vh-130px)] w-full flex-col items-start justify-start space-y-5 overflow-auto">
          {type !== "category" &&
            !selectedCategory?.parent_id &&
            !selectedCategory?.category_id && (
              <div className="sticky top-0 z-10 flex w-full items-center justify-start space-x-5 bg-white px-5 py-5">
                <button
                  onClick={() => setTab("Category")}
                  className={cn("rounded-lg border border-primary px-4 py-2", {
                    "bg-primary text-white": tab === "Category",
                    "bg-gray-100 text-primary": tab !== "Category",
                  })}
                >
                  Category
                </button>
                <button
                  onClick={() => setTab("Sub Category")}
                  className={cn("rounded-lg border border-primary px-4 py-2", {
                    "bg-primary text-white": tab === "Sub Category",
                    "bg-gray-100 text-primary": tab !== "Sub Category",
                  })}
                >
                  Sub Category
                </button>
              </div>
            )}
          <div className="flex w-full flex-col items-center justify-center space-y-2.5 px-5 pb-5">
            <h1
              className={`col-span-2 w-full text-left text-base font-bold text-primary ${selectedCategory?.parent_id ? "pt-5" : "pt-3"} ${type !== "service" ? "pt-0" : "pt-5"}`}
            >
              Provider Details
            </h1>
            <div className="grid w-full grid-cols-2 gap-5">
              {providerOptions.map((option) => (
                <div
                  key={option.id}
                  className="col-span-1 flex w-full flex-col items-center justify-center gap-1"
                >
                  <label
                    htmlFor={option.name}
                    className="w-full text-left text-xs text-gray-500"
                  >
                    {option.name}
                  </label>
                  <Combobox
                    value={option.value}
                    placeholder="Reason"
                    setValue={option.setter}
                    options={option.options}
                    mainClassName="col-span-1 w-full"
                    searchInputPlaceholder="Search..."
                    searchInputClassName="p-1.5 text-xs"
                    defaultSelectedIconClassName="size-4"
                    icon={<TiArrowSortedDown className="size-5" />}
                    toggleClassName="w-full p-3 rounded-lg text-xs bg-gray-100"
                    listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
                    listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                  />
                </div>
              ))}
            </div>
            <h1 className="col-span-2 w-full text-left text-base font-bold text-primary">
              {type === "category" ? 'Sub Category' : type==='branch' ? 'Category' : 'Service'} Details
            </h1>
            {type === "branch" && tab === "Category" && (
              <AddCategory
                open={open}
                setOpen={setOpen}
                selectedCategory={selectedCategory}
                provider={provider?.id || ""}
                business={business?.id || ""}
                refetch={refetch}
              />
            )}
            {(type === "branch" && tab === "Sub Category") && (
              <AddSubCategory
                refetch={refetch}
                setOpen={setOpen}
                selectedSubCategory={selectedCategory}
                provider={provider?.id || ""}
                business={business?.id || ""}
              />
            )}
            {type === "category" && (
              <AddService
                provider={provider?.id || ""}
                business={business?.id || ""}
                refetch={refetchServices}
                setOpen={setOpen}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewServiceModal;
