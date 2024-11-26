import { useMemo, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiMagnifyingGlass } from "react-icons/hi2";

import Combobox from "../components/ui/Combobox";
import CategoryDropdown from "../components/booking/dropdowns/Category";
import { useFetchServicesQuery } from "../store/services/service";
import { useFetchAllCategoriesQuery } from "../store/services/categories";
import Table from "../components/services/Table";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ServiceDetailModal from "../components/app-panel/services/ServiceDetailModal";
import { useLocation } from "react-router-dom";

const AppPanelServices = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const [subCategory, setSubCategory] = useState<ListOptionProps | null>(null);
  const { pathname } = useLocation();
  const isDripHubPage = pathname.includes('dripHub')
  const [filterArray, setFilterArray] = useState<FilterType[]>([
    { name: "business", id: isDripHubPage ? "2" : "1" },
    { name: "company", id: isDripHubPage ? "2" : "1" },
  ]);
  const { sidebar } = useSelector((state: RootState) => state.global);
  const [open, setOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");

  const {
    data: servicesData,
    refetch: refetchServices,
    isFetching: servicesFetching,
    isError: servicesError,
  } = useFetchServicesQuery(filterArray, {
    refetchOnMountOrArgChange: true,
  });

  const { data: categoriesDropdownData } = useFetchAllCategoriesQuery({});

  const handleEdit = (row: any) => {
    setOpen(true);
    setSelectedServiceId(row.service_id);
  };

  const filteredData = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    return servicesData?.filter((item) =>
      item.service_name.toLowerCase().includes(lowercasedSearch)
    );
  }, [search, servicesData]);

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
        const temp: FilterType[] = filterArray.filter(
          (item) => item.name !== "category"
        );
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
        const temp: FilterType[] = filterArray.filter(
          (item) => item.name !== "category"
        );
        setFilterArray(temp);
      }
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-full gap-3">
        <div className="flex h-full w-full flex-col items-start justify-start">
          <div
            className={`mb-5 grid w-full grid-cols-12 ${sidebar ? "gap-1.5" : "gap-2.5"}`}
          >
            {/* Filters */}
            <div
              className={`col-span-8 grid w-full grid-cols-2 xl:col-span-8 ${sidebar ? "gap-1.5" : "gap-2.5"}`}
            >
              <CategoryDropdown
                value={category}
                placeholder="Category"
                data={categoriesDropdownData?.filter(
                  (category) => category.parent_id === "0"
                )}
                handleSelectCategoryFilter={handleSelectCategoryFilter}
                searchInputPlaceholder="Search..."
                searchInputClassName="p-1.5 text-xs"
                icon={
                  <div>
                    <TiArrowSortedDown className="size-5" />
                  </div>
                }
                toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!category?.id && "text-gray-500"}`}
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
                toggleClassName={`w-full shadow-md px-2 py-3 rounded-lg text-xs bg-white whitespace-nowrap ${!subCategory?.id && "text-gray-500"}`}
                listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                isRemoveAllow={true}
              />
            </div>

            {/* Search Bar */}
            <div
              className={`flex h-full w-full items-center justify-center gap-2.5 rounded-lg bg-white px-3.5 text-gray-500 xl:col-span-4 col-span-12`}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Name..."
                className="w-full bg-transparent text-xs placeholder:text-gray-500"
              />
              <HiMagnifyingGlass className="size-7" />
            </div>
          </div>

          {/* Table */}
          <Table
            data={servicesError ? [] : filteredData}
            isLoading={servicesFetching}
            handleEdit={handleEdit}
            refetchServices={refetchServices}
            filterArray={filterArray}
            isApp={true}
          />
        </div>
      </div>
      <ServiceDetailModal
        open={open}
        setOpen={setOpen}
        selectedServiceId={selectedServiceId}
        isApp={true}
      />
    </>
  );
};

export default AppPanelServices;
