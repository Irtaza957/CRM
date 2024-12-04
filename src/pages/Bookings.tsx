import { useEffect, useState } from "react";
import Table from "../components/booking/Table";
import NewBookingModal from "../components/booking/modals/NewBookingModal";
import BusinessDropdown from "../components/services/dropdowns/Business";
import Combobox from "../components/ui/Combobox";
import { TiArrowSortedDown } from "react-icons/ti";
import BranchDropdown from "../components/services/dropdowns/Branch";
import CategoryDropdown from "../components/booking/dropdowns/Category";
import { useFetchBookingStatusesQuery, useFetchBranchesQuery, useFetchUsersByRolesQuery } from "../store/services/filters";
import { useFetchAllCategoriesQuery } from "../store/services/categories";
import { useFetchCompaniesQuery } from "../store/services/company";
import { useFetchBusinessesQuery } from "../store/services/service";
import { useFetchBookingSourcesQuery } from "../store/services/booking";
import { paymentStatuses } from "../utils/constants";
import { setDate } from "../store/slices/app";
import { useDispatch } from "react-redux";

const Bookings = () => {
  const [add, setAdd] = useState(false);
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [provider, setProvider] = useState<ListOptionProps | null>(null);
  const [branch, setBranch] = useState<ListOptionProps | null>(null);
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const [filterArray, setFilterArray] = useState<FilterType[]>([]);
  const [profesionsData, setProfesionsData] = useState<ListOptionProps[]>([]);
  const [source, setSource] = useState<ListOptionProps | null>(null);
  const [profession, setProfession] = useState<ListOptionProps | null>(null);
  const { data: professions } = useFetchUsersByRolesQuery({});
  const { data: bookingSourcesData } = useFetchBookingSourcesQuery({});
  const [bookingStatus, setBookingStatus] = useState<ListOptionProps | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<ListOptionProps | null>(null);
  const dispatch = useDispatch()

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

  const { data: branches } = useFetchBranchesQuery(
    branchQueryParams,
    {
      skip: !shouldFetchBranches,
      refetchOnMountOrArgChange: true
    }
  );
  const {
    data: categoriesData
  } = useFetchAllCategoriesQuery(categoryQueryParams, {
    skip: !shouldFetchCategories,
    refetchOnMountOrArgChange: true
  });

  const { data: companiesData } =
    useFetchCompaniesQuery(companyQueryParams, {
      skip: !shouldFetchCompanies,
      refetchOnMountOrArgChange: true
    });
  const {
    data: businessData
  } = useFetchBusinessesQuery(businessQueryParams, {
    skip: !shouldFetchBusinesses,
    refetchOnMountOrArgChange: true
  });
  const { data: bookingStatuses } = useFetchBookingStatusesQuery({});

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
        const temp: FilterType[] = filterArray.filter((item) => item.name !== "business");
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

  const handleSelectCategoryFilter = (value: ListOptionProps) => {
    if (category?.id === value.id) {
      setCategory(null);
      removeFilter(String(value.id) + "-category");
    } else {
      setCategory(value);
      if (value?.id) {
        addFilter("category", String(value.id) + "-category");
      } else {
        const temp: FilterType[] = filterArray.filter((item) => item.name !== "category");
        setFilterArray(temp);
      }
    }
  };

  useEffect(() => {
    if (professions?.data?.doctors?.length) {
      const data = professions?.data?.doctors?.map((item: EmployeeProps) => {
        return { id: item?.user_id, name: item?.position };
      });
      setProfesionsData(data);
    }
  }, [professions]);

  useEffect(()=>{
    return () => {
      dispatch(setDate(null))
    }
  },[])
  return (
    <div className="flex h-full w-full flex-col items-start justify-start">
      <NewBookingModal open={add} setOpen={setAdd} />
      {/* <div className="grid w-full grid-cols-4 gap-2.5 xl:grid-cols-8">
        <CategoryDropdown
          value={category}
          placeholder="Category"
          setValue={setCategory}
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
        />
        <SourceDropdown
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
        />
        <RegionDropdown
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
        />
        <ProviderDropdown
          provider={provider}
          setProvider={setProvider}
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
        />
        <ProfessionalDropdown
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
        />
        <BookingStatusDropdown
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName={`w-full shadow-md py-3 rounded-lg text-xs bg-white ${sidebar ? "px-1" : "px-3"}`}
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          sidebar={sidebar}
        />
        <PaymentStatusDropdown
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          icon={<TiArrowSortedDown className="size-5" />}
          toggleClassName={`w-full shadow-md py-3 rounded-lg text-xs bg-white whitespace-nowrap ${sidebar ? "px-1" : "px-3"}`}
          listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          sidebar={sidebar}
        />
        <button
          type="button"
          onClick={() => setAdd(true)}
          className="col-span-1 flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary text-center text-sm font-semibold text-white shadow-md"
        >
          New Booking
        </button>
      </div> */}
      <div className="grid w-full grid-cols-5 gap-3 mb-3">
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
          toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!provider?.id && 'text-gray-500'}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={<div><TiArrowSortedDown className="size-5" /></div>}
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
          icon={<div><TiArrowSortedDown className="size-5" /></div>}
          toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!category?.id && 'text-gray-500'}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          isRemoveAllow={true}
        />
        <Combobox
          value={source}
          options={bookingSourcesData}
          handleSelect={(value) => setSource(value)}
          placeholder="Source"
          mainClassName="w-full"
          toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!source?.id && 'text-gray-500'}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={<div><TiArrowSortedDown className="size-5" /></div>}
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />
      </div>
      <div className="grid w-full grid-cols-5 gap-3">
        <Combobox
          value={profession}
          options={profesionsData}
          handleSelect={(value) => setProfession(value)}
          placeholder="Profession"
          mainClassName="w-full"
          toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!profession?.id && 'text-gray-500'}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={<div><TiArrowSortedDown className="size-5" /></div>}
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />
        <Combobox
          value={bookingStatus}
          options={bookingStatuses?.map((item) => {
            return { id: item?.label, name: item?.value };
          })}
          handleSelect={(value) => setBookingStatus(value)}
          placeholder="Booking Status"
          mainClassName="w-full"
          toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!bookingStatus?.id && 'text-gray-500'}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={<div><TiArrowSortedDown className="size-5" /></div>}
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />
        <Combobox
          value={paymentStatus}
          options={paymentStatuses}
          handleSelect={(value) => setPaymentStatus(value)}
          placeholder="Payment Status"
          mainClassName="w-full"
          toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!paymentStatus?.id && 'text-gray-500'}`}
          listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
          listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          icon={<div><TiArrowSortedDown className="size-5" /></div>}
          searchInputPlaceholder="Search..."
          searchInputClassName="p-1.5 text-xs"
          isRemoveAllow={true}
        />
        <button
          type="button"
          onClick={() => setAdd(true)}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-primary text-center text-sm font-semibold text-white shadow-md"
        >
          New Booking
        </button>
      </div>
      <Table />
    </div>
  );
};

export default Bookings;