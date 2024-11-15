import { useEffect, useMemo, useRef, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiMagnifyingGlass } from "react-icons/hi2";

import Combobox from "../components/ui/Combobox";
import CategoryDropdown from "../components/booking/dropdowns/Category";
import BusinessDropdown from "../components/services/dropdowns/Business";
import NewServiceModal from "../components/services/modals/NewServiceModal";
import { useFetchCompaniesQuery } from "../store/services/company";
import { useFetchServicesQuery } from "../store/services/service";
import { useFetchCustomersMutation } from "../store/services/customer";
import { useFetchAllCategoriesQuery } from "../store/services/categories";
import Table from "../components/services/Table";
import AddCustomerModal from "../components/booking/modals/AddCustomerModal";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import * as XLSX from "xlsx";
import UpdateService from "../components/services/forms/update/UpdateService";
import { cn } from "../utils/helpers";
import { useFetchNationalityQuery } from "../store/services/booking";
import { useFetchSourcesQuery } from "../store/services/filters";
import { useFetchBusinessesQuery } from "../store/services/service";
import NewBusinessModal from "../components/services/modals/NewBusinessModal";

const tabs = [
  { id: "business", label: "Businessess" },
  { id: "service", label: "Services" },
  { id: "category", label: "Categories" },
  { id: "customer", label: "Customers" }
];

const ServiceList = () => {
  const [tab, setTab] = useState<string>("business"); // default to 'service' tab
  const [search, setSearch] = useState("");
  const [upload, setUpload] = useState(false);
  const [provider, setProvider] = useState<ListOptionProps | null>(null);
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const [subCategory, setSubCategory] = useState<ListOptionProps | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<string>("0");
  const [customersData, setCustomers] = useState<CustomerProps[] | []>([]);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerProps | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryAllListProps | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [update, setUpdate] = useState(false);
  const [id, setID] = useState("");
  const [source, setSource] = useState<ListOptionProps | null>(null);
  const [nationality, setNationality] = useState<ListOptionProps | null>(null);
  const [openBusinessModal, setOpenBusinessModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProps | null>(null);
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [filter, setFilter] = useState<string>('');

  const { user } = useSelector((state: RootState) => state.global);
  const {
    data: servicesData,
    refetch: refetchServices,
    isFetching: servicesFetching,
  } = useFetchServicesQuery({
    company_id: selectedCompany !== "0" ? selectedCompany : null,
    filters: {
      business: business?.id,
      provider: provider?.id,
      category: category?.id,
      subCategory: subCategory?.id,
    },
  }, {
    skip: tab !== "service",
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const [fetchCustomers, { isLoading: customerLoading }] =
    useFetchCustomersMutation();

  const {
    data: categoriesData,
    refetch,
    isFetching: categoriesLoading,
  } = useFetchAllCategoriesQuery(  {
    customer_id: Number(selectedCompany),
    filters: {
      business: business?.id,
      provider: provider?.id,
      category: category?.id,
    },
  }, {
    skip: tab !== "category",
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    refetchOnFocus: true,
  });

  const {
    data: categoriesDropdownData,
  } = useFetchAllCategoriesQuery({ });
  const { data: companiesData } = useFetchCompaniesQuery({});
  const { data: sources } = useFetchSourcesQuery({});
  const { data: nationalities } = useFetchNationalityQuery({});
  const { data: businessData, isFetching: businessLoading, refetch: refetchBusinesses } =
    useFetchBusinessesQuery(
      Number(selectedCompany),
      {
        skip: tab !== "business",
        refetchOnMountOrArgChange: true,
      }
    );

  const addButtonText =
    tab === "service"
      ? "Add Service"
      : tab === "category"
        ? "Add Category"
        : tab === "customer"
          ? "Add Customer"
          : "Add Business";

  const handleSelectCompany = (id: string) => {
    setSelectedCompany(id);
  };

  const handleAddModal = () => {
    if (tab === "customer") {
      setOpenCustomerModal(true);
    } else if (tab === "business") {
      setOpenBusinessModal(true);
    } else {
      setUpload(true);
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

  const getCustomers = async () => {
    const id = Number(selectedCompany);
    const query = id ? `?company_id=${id}${filter ? `&${filter}` : ''}` : filter ? `?${filter}` : '';
    const response = await fetchCustomers(query);
    setCustomers(response?.data?.data || []);
  };

  const handleEdit = (row: any) => {
    if (tab === "customer") {
      setSelectedCustomer(row);
      setOpenCustomerModal(true);
    } else if (tab === "category") {
      setSelectedCategory(row);
      setUpload(true);
    } else if (tab === "business") {
      setSelectedBusiness(row)
      setOpenBusinessModal(true);
    } else {
      setID(row.service_id);
      setUpdate(true);
    }
  };

  useEffect(() => {
    if (tab === "customer") {
      getCustomers();
    }
  }, [tab, selectedCompany]);

  useEffect(() => {
    if (!upload) {
      setSelectedCategory(null);
    }
  }, [upload]);

  const filteredData = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();

    switch (tab) {
      case "service":
        return servicesData?.filter(
          (service) =>
            service.service_name.toLowerCase().includes(lowercasedSearch) ||
            service.code?.toLowerCase().includes(lowercasedSearch)
        );
      case "category":
        return categoriesData?.filter(
          (category) =>
            category.category_name.toLowerCase().includes(lowercasedSearch) ||
            category.code.toLowerCase().includes(lowercasedSearch)
        );
      case "customer":
        return customersData?.filter((customer) =>
          customer.full_name?.toLowerCase().includes(lowercasedSearch)
        );
      case "business":
        return businessData?.filter(
          (business) =>
            business.name.toLowerCase().includes(lowercasedSearch) ||
            business.code.toLowerCase().includes(lowercasedSearch)
        );
      default:
        return [];
    }
  }, [tab, search, servicesData, categoriesData, customersData, businessData]);

  const handleSelectCompanyFilter = (value: ListOptionProps) => {
    if (provider?.id === value.id) {
      setProvider(null);
    } else {
      setProvider(value);
    }
  };

  const handleSelectBusinessFilter = (value: ListOptionProps) => {
    if (business?.id === value.id) {
      setBusiness(null);
    } else {
      setBusiness(value);
    }
  };
  
  const handleSelectCategoryFilter = (value: ListOptionProps) => {
    if (category?.id === value.id) {
      setCategory(null);
    } else {
      setCategory(value);
    }
  };

  const handleSelectSubCategoryFilter = (value: ListOptionProps) => {
    if (subCategory?.id === value.id) {
      setSubCategory(null);
    } else {
      setSubCategory(value);
    }
  };
  
  const handleSelectSource = (value: ListOptionProps) => {
    if (source?.id === value.id) {
      setSource(null);
    } else {
      setSource(value);
    }
  };

  const handleSelectNationality = (value: ListOptionProps) => {
    if (nationality?.id === value.id) {
      setNationality(null);
    } else {
      setNationality(value);
    }
  };

  const renderFilters = () => {
    switch (tab) {
      case "category":
        return (
          <div className="col-span-7 grid grid-cols-3 gap-2.5">
            <BusinessDropdown business={business} handleSelectBusinessFilter={handleSelectBusinessFilter} />
            {/* <ProviderDropdown
              provider={provider}
              setProvider={setProvider}
              icon={<TiArrowSortedDown className="size-5" />}
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            /> */}
            <Combobox
              value={provider}
              options={companiesData?.map(item => { return { id: item.id, name: item.name } })}
              handleSelect={handleSelectCompanyFilter}
              placeholder="Company"
              mainClassName="w-full"
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<TiArrowSortedDown className="size-5" />}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
            />
            <CategoryDropdown
              value={category}
              placeholder="Category"
              data={categoriesDropdownData?.filter(category => category.parent_id === '0')}
              handleSelectCategoryFilter={handleSelectCategoryFilter}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              icon={<TiArrowSortedDown className="size-5" />}
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
            />
          </div>
        );
      case "customer":
        return (
          <div className="col-span-6 xl:col-span-7 grid grid-cols-3 xl:grid-cols-4 gap-2.5">
            <BusinessDropdown business={business} handleSelectBusinessFilter={handleSelectBusinessFilter} />
            {/* <ProviderDropdown
              provider={provider}
              setProvider={setProvider}
              icon={<TiArrowSortedDown className="size-5" />}
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            /> */}
            <Combobox
              value={provider}
              options={companiesData?.map(item => { return { id: item.id, name: item.name } })}
              handleSelect={handleSelectCompanyFilter}
              placeholder="Company"
              mainClassName="w-full"
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<TiArrowSortedDown className="size-5" />}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
            />
            <Combobox
              value={source}
              options={sources}
              handleSelect={handleSelectSource}
              placeholder="Source"
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              mainClassName="w-full"
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<TiArrowSortedDown className="size-5" />}
            />
            <Combobox
              value={nationality}
              options={nationalities}
              handleSelect={handleSelectNationality}
              placeholder="Nationality"
              mainClassName="w-full"
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<TiArrowSortedDown className="size-5" />}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
            />
          </div>
        );
      case "service":
        return (
          <div className="col-span-7 grid grid-cols-4 gap-2.5">
            <BusinessDropdown business={business} handleSelectBusinessFilter={handleSelectBusinessFilter} />
            {/* <ProviderDropdown
              provider={provider}
              setProvider={setProvider}
              icon={<TiArrowSortedDown className="size-5" />}
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
            /> */}
            <Combobox
              value={provider}
              options={companiesData?.map(item => { return { id: item.id, name: item.name } })}
              handleSelect={handleSelectCompanyFilter}
              placeholder="Company"
              mainClassName="w-full"
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              icon={<TiArrowSortedDown className="size-5" />}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
            />
            <CategoryDropdown
              value={category}
              placeholder="Category"
              data={categoriesDropdownData?.filter(category => category.parent_id === '0')}
              handleSelectCategoryFilter={handleSelectCategoryFilter}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              icon={<TiArrowSortedDown className="size-5" />}
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
              listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
            />
            <Combobox
              options={categoriesDropdownData?.filter(category => category.parent_id !== '0')?.map(item => { return { id: item.category_id, name: item.category_name } })}
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
              toggleClassName="w-full shadow-md px-2 py-3 rounded-lg text-xs bg-white whitespace-nowrap"
              listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
              listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
            />
          </div>
        );
      default:
        return null;
    }
  };

  const getSearchPlaceholder = () => {
    switch (tab) {
      case "customer":
        return "Search by Name";
      case "business":
        return "Search by Business Name";
      default:
        return `Search by ${tab === "service" ? "Service" : "Category"} Name or Code`;
    }
  };

  useEffect(() => {
    if (tab === 'customer') {
      const params = [];
      if (business) params.push(`business=${business.id}`);
      if (provider) params.push(`company=${provider.id}`);
      if (source) params.push(`category=${source.id}`);
      if (nationality) params.push(`subCategory=${nationality.id}`);
      setFilter(params.join('&'));
    }
  }, [business, provider, source, nationality]);


  useEffect(() => {
    if (tab === 'customer') {
      getCustomers()
    }
  }, [filter])

  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (selectedCompany) queryParams.append("business", selectedCompany);
    if (provider) queryParams.append("company", String(provider.id || ''));
    if (category?.id) queryParams.append("category", String(category.id));
    if (subCategory?.id)
      queryParams.append("subCategory", String(subCategory.id));
    if (source?.id) queryParams.append("source", String(source.id));
    if (nationality?.id)
      queryParams.append("nationality", String(nationality.id));

    if (queryParams.toString()) {
      console.log(".......>>>>>", queryParams.toString());
    }
  }, [
    selectedCompany,
    provider,
    category,
    subCategory,
    source,
    nationality
  ]);

  useEffect(() => {
    setFilter('')
    setBusiness(null)
    setProvider(null)
    setCategory(null)
    setSubCategory(null)
    setSource(null)
    setNationality(null)
  }, [tab])

  return (
    <>
      <NewBusinessModal
        open={openBusinessModal}
        setOpen={setOpenBusinessModal}
        selectedBusiness={selectedBusiness}
        refetch={() => {
          if (tab === "business") {
            refetchBusinesses && refetchBusinesses();
          }
        }}
      />
      <UpdateService
        id={id}
        open={update}
        setOpen={setUpdate}
        refetch={refetchServices}
      />
      <NewServiceModal
        selectedCategory={selectedCategory}
        companiesData={companiesData}
        open={upload}
        refetch={refetch}
        refetchServices={refetchServices}
        setOpen={setUpload}
        type={tab}
      />
      <AddCustomerModal
        userId={user!.id}
        customerId={selectedCustomer?.customer_id}
        open={openCustomerModal}
        setOpen={setOpenCustomerModal}
        fetchCustomers={getCustomers}
        userData={selectedCustomer}
        editMode={!!selectedCustomer?.customer_id}
        isService={true}
      />
      <div className="flex w-full gap-3">
        <div>
          {/* <div className="md:flex">
            <ul className="flex-column space-y mb-4 max-h-screen space-y-4 overflow-y-auto text-sm font-medium text-gray-500 md:mb-0 md:me-4 dark:text-gray-400">
              <li>
                <p
                  onClick={() => setSelectedCompany("0")}
                  className={`w-full cursor-pointer whitespace-nowrap rounded-lg px-4 py-3 text-start shadow-sm ${
                    selectedCompany === "0"
                      ? "border-2 border-[#0557A5] bg-[#044570] text-white"
                      : "bg-gray-50 text-primary"
                  }`}
                >
                  All Companies
                </p>
              </li>
              {companiesData?.map((company, index) => (
                <li key={index} onClick={() => handleSelectCompany(company.id)}>
                  <p
                    className={`w-full cursor-pointer rounded-lg px-4 py-3 text-start shadow-sm ${
                      selectedCompany === company.id
                        ? "border-2 border-[#0557A5] bg-[#044570] text-white"
                        : "bg-gray-50 text-primary"
                    }`}
                  >
                    {company?.name}
                  </p>
                </li>
              ))}
            </ul>
          </div> */}
          <div className="relative z-30 hidden max-h-[calc(100vh-30px)] overflow-y-auto rounded-md bg-white text-white transition-[width] md:block">
            <div className="relative z-20 h-full overflow-hidden">
              <ul className="flex w-full flex-col">
                <li
                  onClick={() => handleSelectCompany("0")}
                  className={cn(
                    "w-full cursor-pointer whitespace-nowrap border-l-4 text-primary border-primary py-3 px-4 hover:text-white hover:border-white hover:bg-darkprimary border-b",
                    {
                      "border-white bg-darkprimary text-white": selectedCompany === "0",
                    }
                  )}
                >
                  <span className="flex-1 text-left text-sm font-semibold">
                    All Companies{" "}
                  </span>
                </li>
                {companiesData?.map((company, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelectCompany(company.id)}
                    className={cn(
                      "w-full cursor-pointer truncate text-primary whitespace-nowrap border-l-4 border-primary py-3 px-4 hover:text-white hover:border-white hover:bg-darkprimary border-b",
                      {
                        "border-white bg-darkprimary text-white":
                          selectedCompany === company.id,
                        "border-b-0": companiesData?.length === index + 1
                      }
                    )}
                  >
                    <span className="flex-1 text-left text-sm font-semibold">
                      {company.name}{" "}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-start justify-start">
          {/* Tabs */}
          <div className="mb-5 flex gap-4 rounded-md border border-[#E5E7EB] p-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-lg px-4 py-2 font-semibold ${tab === t.id ? "bg-primary text-white" : "border bg-white text-primary"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mb-5 grid w-full grid-cols-7 gap-2.5">
            {/* Search Bar */}
            <div className="col-span-3 xl:col-span-5 flex h-full w-full items-center justify-center gap-2.5 rounded-lg bg-white px-3.5 text-gray-500">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={getSearchPlaceholder()}
                className="w-full bg-transparent text-xs placeholder:text-gray-500"
              />
              <HiMagnifyingGlass className="size-7" />
            </div>

            {/* Add Button */}
            <div className="col-span-2 xl:col-span-1">
              <button
                onClick={handleAddModal}
                className="h-full w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white whitespace-nowrap px-3"
              >
                {addButtonText}
              </button>
            </div>

            {/* Upload Button */}
            <div className="col-span-2 xl:col-span-1">
              <button
                onClick={handleUploadClick}
                className="h-full w-full rounded-lg bg-secondary py-3 text-sm font-semibold text-white whitespace-nowrap"
              >
                Upload
              </button>
            </div>

            {/* Filters */}
            {tab !== 'business' &&
              renderFilters()
            }
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx, .csv"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          {/* Table */}
          <Table
            selectedTab={tab}
            data={filteredData}
            isLoading={
              customerLoading ||
              categoriesLoading ||
              servicesFetching ||
              businessLoading
            }
            handleEdit={handleEdit}
            refetchServices={refetchServices}
            refetchCategories={refetch}
          />
        </div>
      </div>
    </>
  );
};

export default ServiceList;
