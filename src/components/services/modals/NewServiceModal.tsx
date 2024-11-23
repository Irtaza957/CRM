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
import { useFetchCompaniesQuery } from "../../../store/services/company";
import { FiEdit } from "react-icons/fi";
import { useFetchCategoryQuery } from "../../../store/services/categories";

const NewServiceModal = ({
  open,
  setOpen,
  type,
  selectedCategory,
  refetch,
  refetchServices,
  isView,
  selectedServiceId,
  setIsView,
  isApp
}: NewServiceModalProps) => {
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [provider, setProvider] = useState<ListOptionProps | null>(null);
  const [companyOptions, setCompanyOptions] = useState<ListOptionProps[]>([]);
  const [tab, setTab] = useState<string>("Category");
  const [categoryData, setCategoryData] = useState<CategoryDetailProps | null>(null);

  const { data: businesses } = useFetchBusinessesListQuery({});
  const { data: companiesData } = useFetchCompaniesQuery([{ name: 'business', id: `${business?.id}-business` }], {
    skip: !business?.id,
    refetchOnMountOrArgChange: true,
  });
  const { data: category } = useFetchCategoryQuery(selectedCategory, {
    skip: !selectedCategory,
    refetchOnMountOrArgChange: true,
  });

  const providerOptions = [
    {
      id: 1,
      name: "Business",
      value: business,
      setter: setBusiness,
      options: businesses,
    },
    {
      id: 2,
      name: "Company",
      value: provider,
      setter: setProvider,
      options: companyOptions,
      disabled: !business?.id
    },
  ];

  useEffect(() => {
    if (category) {
      setCategoryData(category);
    }
  }, [category]);

  useEffect(() => {
    if (companiesData?.length) {
      const temp = companiesData?.map((item) => {
        return { id: item.id, name: item.name };
      });
      setCompanyOptions(temp);
    }
  }, [companiesData]);

  useEffect(() => {
    if (categoryData?.category_id) {
      const selectedBusiness = businesses?.find(
        (item) => item?.id === Number(categoryData?.business_id)
      );
      if (selectedBusiness?.id) {
        setBusiness(selectedBusiness);
      }
    }
  }, [categoryData, open]);

  useEffect(()=>{
    if(companyOptions && categoryData?.category_id){
      const selectedCompany = companyOptions?.find(
        (item) => item?.id === categoryData?.company_id
      );
      if (selectedCompany?.id) {
        setProvider(selectedCompany);
      }
    }
  },[companyOptions])

  useEffect(() => {
    if (!open) {
      setBusiness(null);
      setProvider(null);
      setCategoryData(null);
    }
  }, [open]);

  useEffect(() => {
    if (categoryData?.parent_id && categoryData?.parent_id !== '0') {
      setTab("Sub Category");
    } else {
      setTab("Category");
    }
  }, [categoryData]);

  return (
    <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-3xl">
      <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
        <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
          <h1 className="text-xl font-medium">
            {categoryData?.category_id ? (
              `Edit ${tab === "Category" ? "Category" : "Sub Category"}`
            ) : (
              <>
                {selectedServiceId ? 'Edit' : 'Add New'}{" "}
                {type === "category"
                  ? "Service"
                  : type === "branch" ? (tab === "Category" ? "Category" : "Sub Category") : ''}
              </>
            )}
          </h1>
          <div className="flex items-center justify-center gap-2">
            {(isView && !isApp) && (
              <FiEdit onClick={() => setIsView(false)} className="h-6 w-6 cursor-pointer text-white" />
            )}
            <IoClose onClick={() => setOpen(false)} className="h-8 w-8 cursor-pointer" />
          </div>
        </div>
        <div className="no-scrollbar relative flex h-full max-h-[calc(100vh-130px)] w-full flex-col items-start justify-start space-y-5 overflow-auto">
          {type !== "category" &&
            !categoryData?.parent_id &&
            !categoryData?.category_id && (
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
            {!selectedServiceId && (
              <>
                <h1
                  className={`col-span-2 w-full text-left text-base font-bold text-primary ${categoryData?.parent_id ? "pt-5" : "pt-3"} ${type !== "service" ? "pt-0" : "pt-5"}`}
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
                        disabled={option.disabled || isView}
                      />
                    </div>
                  ))}
                </div>
                <h1 className="col-span-2 w-full text-left text-base font-bold text-primary">
                  {type === "category" ? 'Sub Category' : type === 'branch' ? 'Category' : 'Service'} Details
                </h1>
              </>
            )}
            {type === "branch" && tab === "Category" && (
              <AddCategory
                open={open}
                setOpen={setOpen}
                selectedCategory={categoryData}
                provider={provider?.id || ""}
                business={business?.id || ""}
                refetch={refetch}
                isView={isView}
              />
            )}
            {(type === "branch" && tab === "Sub Category") && (
              <AddSubCategory
                refetch={refetch}
                setOpen={setOpen}
                selectedSubCategory={categoryData}
                provider={provider?.id || ""}
                business={business?.id || ""}
                isView={isView}
              />
            )}
            {type === "category" && (
              <AddService
                provider={provider?.id || ""}
                business={business?.id || ""}
                refetch={refetchServices}
                setOpen={setOpen}
                selectedServiceId={selectedServiceId}
                setProvider={setProvider}
                open={open}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewServiceModal;
