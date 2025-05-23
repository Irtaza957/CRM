import { useEffect, useState } from "react";
import BusinessDropdown from "../components/services/dropdowns/Business";
import Combobox from "../components/ui/Combobox";
import { TiArrowSortedDown } from "react-icons/ti";
import BranchDropdown from "../components/services/dropdowns/Branch";
import CategoryDropdown from "../components/booking/dropdowns/Category";
import { useFetchBranchesQuery } from "../store/services/filters";
import { useFetchAllCategoriesQuery } from "../store/services/categories";
import { useFetchCompaniesQuery } from "../store/services/company";
import { useFetchBusinessesQuery } from "../store/services/service";
import { useFetchBookingPlatformsQuery } from "../store/services/booking";
import { setDate } from "../store/slices/app";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import AddCustomerModal from "../components/booking/modals/AddCustomerModal";
import { useFetchCustomersMutation } from "../store/services/customer";
import { customersHeaders } from "../utils/constants";
import Table from "../components/ui/Table";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import DeleteModal from "../components/booking/modals/DeleteModal";

const Customers = () => {
  const [add, setAdd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [provider, setProvider] = useState<ListOptionProps | null>(null);
  const [branch, setBranch] = useState<ListOptionProps | null>(null);
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const [filterArray, setFilterArray] = useState<FilterType[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [customers, setCustomers] = useState<CustomerProps[] | []>([]);
  const [platform, setPlatform] = useState<ListOptionProps | null>(null);
  //   const [pageNum, setPageNum] = useState(1);
  const { user } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();
  const [fetchCustomers] = useFetchCustomersMutation();

  const lastFilter = filterArray[filterArray.length - 1]?.name;

  const shouldFetchBusinesses = filterArray.length === 0;
  const shouldFetchCompanies = lastFilter === "business";
  const shouldFetchBranches = lastFilter === "company";
  const shouldFetchCategories = lastFilter === "branch";

  // Pass the filterArray as query parameters
  const businessQueryParams = shouldFetchBusinesses ? filterArray : null;
  const companyQueryParams = shouldFetchCompanies ? filterArray : null;
  const branchQueryParams = shouldFetchBranches ? filterArray : null;
  const categoryQueryParams = shouldFetchCategories ? filterArray : null;

  const { data: bookingPlatformsData } = useFetchBookingPlatformsQuery({});

  const { data: branches } = useFetchBranchesQuery(branchQueryParams, {
    skip: !shouldFetchBranches,
    refetchOnMountOrArgChange: true,
  });
  const { data: categoriesData } = useFetchAllCategoriesQuery(
    categoryQueryParams,
    {
      skip: !shouldFetchCategories,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: companiesData } = useFetchCompaniesQuery(companyQueryParams, {
    skip: !shouldFetchCompanies,
    refetchOnMountOrArgChange: true,
  });
  const { data: businessData } = useFetchBusinessesQuery(businessQueryParams, {
    skip: !shouldFetchBusinesses,
    refetchOnMountOrArgChange: true,
  });

  const removeFilter = (id: string) => {
    const temp: FilterType[] = filterArray.filter((item) => item.id !== id);
    setFilterArray(temp);
  };

  const addFilter = (name: string, id: string) => {
    setFilterArray((prevFilters) => [
      ...prevFilters.filter((filter) => filter.name !== name),
      { name, id },
    ]);
  };

  const handleSelectBusinessFilter = (value: ListOptionProps) => {
    if (business?.id === value.id) {
      setBusiness(null);
      removeFilter(String(value.id) + "-business");
    } else {
      setBusiness(value);
      if (value?.id) {
        addFilter("business", String(value.id) + "-business");
      } else {
        const temp: FilterType[] = filterArray.filter(
          (item) => item.name !== "business"
        );
        setFilterArray(temp);
      }
    }
  };

  const handleSelectBranch = (value: ListOptionProps) => {
    if (branch?.id === value.id) {
      setBranch(null);
      removeFilter(String(value.id) + "-branch");
    } else {
      setBranch(value);
      if (value?.id) {
        addFilter("branch", String(value.id) + "-branch");
      } else {
        const temp: FilterType[] = filterArray.filter(
          (item) => item.name !== "branch"
        );
        setFilterArray(temp);
      }
    }
  };

  const handleSelectCompanyFilter = (value: ListOptionProps) => {
    if (provider?.id === value.id) {
      setProvider(null);
      removeFilter(String(value.id) + "-company");
    } else {
      setProvider(value);
      if (value?.id) {
        addFilter("company", String(value.id) + "-company");
      } else {
        const temp: FilterType[] = filterArray.filter(
          (item) => item.name !== "company"
        );
        setFilterArray(temp);
      }
    }
  };

  const handleSelectCategoryFilter = (value: ListOptionProps) => {
    if (category?.id === value.id) {
      setCategory(null);
      removeFilter(String(value.id) + "-category");
    } else {
      setCategory(value);
      if (value?.id) {
        addFilter("category", String(value.id) + "-category");
      } else {
        const temp: FilterType[] = filterArray.filter(
          (item) => item.name !== "category"
        );
        setFilterArray(temp);
      }
    }
  };

  const getCustomers = async () => {
    try {
      const resp = await fetchCustomers({});
      console.log(resp, "respresp");
      setCustomers(resp?.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (row: any, editMode?: boolean) => {
    setSelectedCustomer(row.customer_id);
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
      <FaRegTrashAlt
        onClick={(e) => {
          e.stopPropagation();
          setSelectedCustomer(row.id);
          setOpenDeleteModal(true);
        }}
        className="h-5 w-5 cursor-pointer"
      />
    </div>
  );

  useEffect(() => {
    getCustomers();
    return () => {
      dispatch(setDate(null));
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col items-start justify-start">
      <AddCustomerModal
        customerId={selectedCustomer || ""}
        userId={user!.id}
        open={add}
        setOpen={setAdd}
        fetchCustomers={getCustomers}
        viewMode={editMode}
        setIsView={setEditMode}
      />
      <DeleteModal
        title={`Delete Customer`}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        // deleteLoading={deleteFAQLoading}
        handleDelete={() => {}}
      />
      <div className="mb-3 grid w-full grid-cols-6 gap-3">
        <BusinessDropdown
          business={business}
          businesses={businessData}
          handleSelectBusinessFilter={handleSelectBusinessFilter}
        />
        <Combobox
          value={provider}
          options={companiesData?.map((item) => {
            return { id: item.id, name: item.name };
          })}
          handleSelect={handleSelectCompanyFilter}
          placeholder="Company"
          mainClassName="w-full"
          toggleClassName={`w-full p-3 rounded-lg text-xs bg-white ${!provider?.id && "text-gray-500"}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={
            <div>
              <TiArrowSortedDown className="size-5" />
            </div>
          }
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />
        <BranchDropdown
          branchesData={branches?.map((item) => {
            return { id: item?.branch_id, name: item?.name };
          })}
          branch={branch}
          handleSelectBranch={handleSelectBranch}
        />
        <CategoryDropdown
          value={category}
          placeholder="Category"
          data={categoriesData}
          handleSelectCategoryFilter={handleSelectCategoryFilter}
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          icon={
            <div>
              <TiArrowSortedDown className="size-5" />
            </div>
          }
          toggleClassName={`w-full p-3 rounded-lg text-xs bg-white ${!category?.id && "text-gray-500"}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          isRemoveAllow={true}
        />
        <Combobox
          value={platform}
          options={bookingPlatformsData}
          handleSelect={(value) => setPlatform(value)}
          placeholder="Platforms"
          mainClassName="w-full"
          toggleClassName={`w-full p-3 rounded-lg text-xs bg-white ${!platform?.id && "text-gray-500"}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={
            <div>
              <TiArrowSortedDown className="size-5" />
            </div>
          }
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />

        <button
          type="button"
          onClick={() => {
            setSelectedCustomer(null)
            setEditMode(false)
            setAdd(true)
          }}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary text-center text-sm font-semibold text-white shadow-md"
        >
          New Customer
        </button>
      </div>
      <Table
        headers={customersHeaders}
        rows={customers || []}
        renderActions={renderActions}
        handleRowClick={(row) => handleEdit(row, true)}
      />
    </div>
  );
};

export default Customers;
