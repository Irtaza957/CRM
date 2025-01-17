import { useEffect, useMemo, useRef, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiMagnifyingGlass } from "react-icons/hi2";

import Combobox from "../components/ui/Combobox";
import CategoryDropdown from "../components/booking/dropdowns/Category";
import BusinessDropdown from "../components/services/dropdowns/Business";
import NewServiceModal from "../components/services/modals/NewServiceModal";
import { useFetchCompaniesQuery } from "../store/services/company";
import { useFetchServicesQuery } from "../store/services/service";
import { useFetchAllCategoriesQuery } from "../store/services/categories";
import Table from "../components/services/Table";
import * as XLSX from "xlsx";
import { useFetchBusinessesQuery } from "../store/services/service";
import NewBusinessModal from "../components/services/modals/NewBusinessModal";
import BranchDropdown from "../components/services/dropdowns/Branch";
import { useFetchBranchesQuery } from "../store/services/filters";
import AddCompanyModal from "../components/services/modals/AddCompanyModal";
import AddBranchModal from "../components/services/modals/AddBranchModal";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const ServiceList = () => {
  const [search, setSearch] = useState("");
  const [upload, setUpload] = useState(false);
  const [provider, setProvider] = useState<ListOptionProps | null>(null);
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const [subCategory, setSubCategory] = useState<ListOptionProps | null>(null);
  // const [customersData, setCustomers] = useState<CustomerProps[] | []>([]);
  // const [openCustomerModal, setOpenCustomerModal] = useState(false);
  // const [selectedCustomer, setSelectedCustomer] =
  //   useState<CustomerProps | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [id, setID] = useState("");
  const [openBusinessModal, setOpenBusinessModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessProps | null>(null);
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [filterArray, setFilterArray] = useState<FilterType[]>([]);
  const [branch, setBranch] = useState<ListOptionProps | null>(null);
  const [openCompanyModal, setOpenCompanyModal] = useState(false);
  const [selectedCompany, setSelectedCompany] =
    useState<{ id: string, business: string } | null>(null);
  const [openBranchModal, setOpenBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchProps | null>(
    null
  );
  const [isView, setIsView] = useState(false)
  const { pathname } = useLocation()
  const isApp = pathname.includes('app')
  const {sidebar} = useSelector((state: RootState) => state.global);
  // const { user } = useSelector((state: RootState) => state.global);

  // const [fetchCustomers, { isLoading: customerLoading }] =
  //   useFetchCustomersMutation();

  const lastFilter = filterArray[filterArray.length - 1]?.name;

  const shouldFetchBusinesses = filterArray.length === 0;
  const shouldFetchCompanies = lastFilter === "business";
  const shouldFetchBranches = lastFilter === "company";
  const shouldFetchCategories = lastFilter === "branch";
  const shouldFetchServices = lastFilter === "category";

  // Pass the filterArray as query parameters
  const businessQueryParams = shouldFetchBusinesses ? filterArray : null;
  const companyQueryParams = shouldFetchCompanies ? filterArray : null;
  const branchQueryParams = shouldFetchBranches ? filterArray : null;
  const categoryQueryParams = shouldFetchCategories ? filterArray : null;
  const serviceQueryParams = shouldFetchServices ? filterArray : null;

  const {
    data: servicesData,
    refetch: refetchServices,
    isFetching: servicesFetching,
    isError: servicesError
  } = useFetchServicesQuery(serviceQueryParams, {
    skip: !shouldFetchServices,
    refetchOnMountOrArgChange: true
  });

  const { data: branches, isFetching: branchFetching, refetch: refetchBranches } = useFetchBranchesQuery(
    branchQueryParams,
    {
      skip: !shouldFetchBranches,
      refetchOnMountOrArgChange: true
    }
  );
  const {
    data: categoriesData,
    refetch,
    isFetching: categoriesLoading,
    isError: categoryError
  } = useFetchAllCategoriesQuery(categoryQueryParams, {
    skip: !shouldFetchCategories,
    refetchOnMountOrArgChange: true
  });

  const { data: companiesData, isFetching: fetchingCompanies, refetch: refetchCompanies } =
    useFetchCompaniesQuery(companyQueryParams, {
      skip: !shouldFetchCompanies,
      refetchOnMountOrArgChange: true
    });
  const {
    data: businessData,
    isFetching: businessLoading,
    refetch: refetchBusinesses,
  } = useFetchBusinessesQuery(businessQueryParams, {
    skip: !shouldFetchBusinesses,
    refetchOnMountOrArgChange: true
  });

  const { data: categoriesDropdownData, refetch: refetchCategoriesDropdown } = useFetchAllCategoriesQuery({});

  const { data: branchesDropodwnData, refetch: refetchBranchesDropdown } = useFetchBranchesQuery(null);

  const { data: companiesDropdownData, refetch: refetchCompaniesDropdown } = useFetchCompaniesQuery(null);

  const handleAddModal = () => {
    if (lastFilter === "category") {
      setUpload(true);
    } else if (lastFilter === "branch") {
      setUpload(true);
    } else if (lastFilter === "business") {
      setOpenCompanyModal(true);
    } else if (lastFilter === "company") {
      setOpenBranchModal(true);
    } else {
      setOpenBusinessModal(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log(jsonData, "jsonDatajsonData");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // const getCustomers = async () => {
  //   const response = await fetchCustomers({});
  //   setCustomers(response?.data?.data || []);
  // };

  const handleEdit = (row: any, isView?: boolean) => {
    if (isView) {
      setIsView(true)
    }
    if (lastFilter === "category") {
      setID(row.service_id);
      setUpload(true);
    } else if (lastFilter === "branch") {
      setSelectedCategory(row?.category_id);
      setUpload(true);
    } else if (lastFilter === "business") {
      setSelectedCompany({ id: row?.id, business: row?.business });
      setOpenCompanyModal(true);
    } else if (lastFilter === "company") {
      setSelectedBranch(row);
      setOpenBranchModal(true);
    } else {
      setSelectedBusiness(row);
      setOpenBusinessModal(true);
    }
  };

  const filteredData = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    const lastItem = filterArray[filterArray.length - 1]?.name;

    if (filterArray?.length === 0) {
      return businessData?.filter(
        (business) =>
          business.name.toLowerCase().includes(lowercasedSearch) ||
          business.code.toLowerCase().includes(lowercasedSearch)
      );
    }
    switch (lastItem) {
      case "business":
        return companiesData?.filter(item => item.name.toLowerCase().includes(lowercasedSearch));
      case "company":
        return branches?.filter(item => item.name.toLowerCase().includes(lowercasedSearch));
      case "branch":
        return categoriesData?.filter(item => item.category_name.toLowerCase().includes(lowercasedSearch));
      case "category":
        return servicesData?.filter(item => item.service_name.toLowerCase().includes(lowercasedSearch));
      default:
        return [];
    }
  }, [
    search,
    servicesData,
    categoriesData,
    companiesData,
    businessData,
    branches,
  ]);

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
  const handleSelectBranch = (value: ListOptionProps) => {
    if (branch?.id === value.id) {
      setBranch(null);
      removeFilter(String(value.id) + "-branch");
    } else {
      setBranch(value);
      if (value?.id) {
        addFilter("branch", String(value.id) + "-branch");
      } else {
        const temp: FilterType[] = filterArray.filter((item) => item.name !== "branch");
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
        const temp: FilterType[] = filterArray.filter((item) => item.name !== "company");
        setFilterArray(temp);
      }
    }
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
        const temp: FilterType[] = filterArray.filter((item) => item.name !== "business");
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
      setSubCategory(null);
      if (value?.id) {
        addFilter("category", String(value.id) + "-category");
      } else {
        const temp: FilterType[] = filterArray.filter((item) => item.name !== "category");
        setFilterArray(temp);
      }
    }
  };

  const handleSelectSubCategoryFilter = (value: ListOptionProps) => {
    if (subCategory?.id === value.id) {
      setSubCategory(null);
      removeFilter(String(value.id) + "-category");
    } else {
      setSubCategory(value);
      setCategory(null);
      if (value?.id) {
        addFilter("category", String(value.id) + "-category");
      } else {
        const temp: FilterType[] = filterArray.filter((item) => item.name !== "category");
        setFilterArray(temp);
      }
    }
  };

  const handleRefetchCompanies = () => {
    refetchCompaniesDropdown && refetchCompaniesDropdown();
    refetchCompanies && refetchCompanies();
  }

  const handleRefetchBranches = () => {
    refetchBranchesDropdown && refetchBranchesDropdown();
    refetchBranches && refetchBranches();
  }

  const handleRefetchCategories = () => {
    refetchCategoriesDropdown && refetchCategoriesDropdown();
    refetch && refetch();
  }

  useEffect(() => {
    if (!upload) {
      setSelectedCategory(null);
      setID("");
    }
  }, [upload]);

  useEffect(() => {
    if (!openBranchModal) {
      setSelectedBranch(null);
      setIsView(false)
    }
  }, [openBranchModal]);

  useEffect(() => {
    if (!openCompanyModal) {
      setSelectedCompany(null);
      setIsView(false)
    }
  }, [openCompanyModal]);

  useEffect(() => {
    if (!openBusinessModal) {
      setSelectedBusiness(null);
      setIsView(false)
    }
  }, [openBusinessModal]);

  useEffect(() => {
    if (!upload) {
      setSelectedCategory(null);
      setIsView(false)
    }
  }, [upload]);

  return (
    <>
      <NewBusinessModal
        open={openBusinessModal}
        setOpen={setOpenBusinessModal}
        selectedBusiness={selectedBusiness}
        refetch={() => {
          if (filterArray?.length === 0) {
            refetchBusinesses && refetchBusinesses();
          }
        }}
        isView={isView}
        setIsView={() => setIsView(false)}
        isApp={isApp}
      />
      <NewServiceModal
        selectedCategory={selectedCategory}
        companiesData={companiesDropdownData}
        open={upload}
        refetch={handleRefetchCategories}
        refetchServices={refetchServices}
        setOpen={setUpload}
        type={filterArray[filterArray.length - 1]?.name}
        isView={isView}
        setIsView={setIsView}
        selectedServiceId={id}
        isApp={isApp}
      />
      {/* <AddCustomerModal
        userId={user!.id}
        customerId={selectedCustomer?.customer_id}
        open={openCustomerModal}
        setOpen={setOpenCustomerModal}
        fetchCustomers={getCustomers}
        userData={selectedCustomer}
        editMode={!!selectedCustomer?.customer_id}
        isService={true}
      /> */}
      <AddCompanyModal
        open={openCompanyModal}
        setOpen={setOpenCompanyModal}
        selectedCompany={selectedCompany}
        businesses={businessData}
        refetch={handleRefetchCompanies}
        isView={isView}
        setIsView={setIsView}
        isApp={isApp}
      />
      <AddBranchModal
        open={openBranchModal}
        setOpen={setOpenBranchModal}
        selectedBranch={selectedBranch}
        refetch={handleRefetchBranches}
        isView={isView}
        setIsView={setIsView}
        isApp={isApp}
      />
      <div className="flex w-full gap-3 min-h-screen">
        <div className="flex h-full w-full flex-col items-start justify-start">
          <div className={`mb-5 grid w-full grid-cols-12 ${sidebar ? 'gap-1.5' : 'gap-2.5'}`}>
            {/* Filters */}
            <div className={`col-span-12 grid grid-cols-5 ${isApp ? 'xl:col-span-9' : 'xl:col-span-7'} ${sidebar ? 'gap-1.5' : 'gap-2.5'}`}>
              <BusinessDropdown
                business={business}
                businesses={businessData}
                handleSelectBusinessFilter={handleSelectBusinessFilter}
              />
              <Combobox
                value={provider}
                options={companiesDropdownData?.map((item) => {
                  return { id: item.id, name: item.name };
                })}
                handleSelect={handleSelectCompanyFilter}
                placeholder="Company"
                mainClassName="w-full"
                toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!provider?.id && 'text-gray-500'}`}
                listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                icon={<div><TiArrowSortedDown className="size-5" /></div>}
                searchInputPlaceholder="Search..."
                searchInputClassName="p-1.5 text-xs"
                isRemoveAllow={true}
              />
              <BranchDropdown
                branchesData={branchesDropodwnData?.map((item) => {
                  return { id: item?.branch_id, name: item?.name };
                })}
                branch={branch}
                handleSelectBranch={handleSelectBranch}
              />
              <CategoryDropdown
                value={category}
                placeholder="Category"
                data={categoriesDropdownData?.filter(
                  (category) => category.parent_id === "0"
                )}
                handleSelectCategoryFilter={handleSelectCategoryFilter}
                searchInputPlaceholder="Search..."
                searchInputClassName="p-1.5 text-xs"
                icon={<div><TiArrowSortedDown className="size-5" /></div>}
                toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!category?.id && 'text-gray-500'}`}
                listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                isRemoveAllow={true}
              />
              <Combobox
                options={categoriesDropdownData
                  ?.filter((category) => category.parent_id !== "0")
                  ?.map((item) => {
                    return { id: item.category_id, name: item.category_name };
                  })}
                value={subCategory}
                handleSelect={handleSelectSubCategoryFilter}
                placeholder="Sub Category"
                searchInputPlaceholder="Search..."
                searchInputClassName="p-1.5 text-xs"
                defaultSelectedIconClassName="size-4"
                icon={
                  <div>
                    <TiArrowSortedDown className="size-5" />
                  </div>
                }
                toggleClassName={`w-full shadow-md px-2 py-3 rounded-lg text-xs bg-white whitespace-nowrap ${!subCategory?.id && 'text-gray-500'}`}
                listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                isRemoveAllow={true}
              />
            </div>

            {/* Search Bar */}
            <div className={`xl:col-span-3 flex h-full w-full items-center justify-center gap-2.5 rounded-lg bg-white px-3.5 text-gray-500 ${isApp ? 'col-span-12' : 'col-span-8'}`}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Name..."
                className="w-full bg-transparent text-xs placeholder:text-gray-500"
              />
              <HiMagnifyingGlass className="size-7" />
            </div>

            {/* Add Button */}
            {!isApp && (
              <>
                <div className="col-span-2 xl:col-span-1">
                  <button
                    onClick={handleAddModal}
                    className={`h-full w-full whitespace-nowrap rounded-lg bg-primary text-sm font-semibold text-white ${sidebar ? 'px-2' : 'px-3'}`}
                  >
                    Add New
                  </button>
                </div>
                {/* Upload Button */}
                <div className="col-span-2 xl:col-span-1">
                  <button
                    onClick={handleUploadClick}
                    className="h-full w-full whitespace-nowrap rounded-lg bg-secondary py-3 text-sm font-semibold text-white"
                  >
                    Upload
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".xlsx, .csv"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Table */}
          <Table
            data={servicesError || categoryError ? [] : filteredData}
            isLoading={
              branchFetching ||
              categoriesLoading ||
              servicesFetching ||
              businessLoading ||
              fetchingCompanies
            }
            handleEdit={handleEdit}
            refetchServices={refetchServices}
            refetchCategories={refetch}
            filterArray={filterArray}
            isApp={isApp}
          />
        </div>
      </div>
    </>
  );
};

export default ServiceList;
