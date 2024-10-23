import { useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiMagnifyingGlass } from "react-icons/hi2";

import Combobox from "../components/ui/Combobox";
import Table from "../components/services/Table";
import { emirates, options } from "../utils/constants";
import BranchDropdown from "../components/services/dropdowns/Branch";
import CategoryDropdown from "../components/booking/dropdowns/Category";
import ProviderDropdown from "../components/booking/dropdowns/Provider";
import BusinessDropdown from "../components/services/dropdowns/Business";
import NewServiceModal from "../components/services/modals/NewServiceModal";

const ServiceList = () => {
  const [tab, setTab] = useState("");
  const [search, setSearch] = useState("");
  const [upload, setUpload] = useState(false);
  const [provider, setProvider] = useState<string>("");
  const [emirate, setEmirate] = useState<ListOptionProps | null>(null);
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const [subCategory, setSubCategory] = useState<ListOptionProps | null>(null);

  return (
    <>
      <NewServiceModal open={upload} setOpen={setUpload} type={tab} />
      <div className="flex h-full w-full flex-col items-start justify-start">
        <div className="mb-5 grid w-full grid-cols-4 gap-2.5 xl:grid-cols-7">
          <div className="col-span-4 flex w-full items-center justify-center gap-2.5 rounded-lg bg-white px-3.5 text-gray-500 xl:col-span-5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Service Name or Code"
              className="w-full bg-transparent text-xs placeholder:text-gray-500"
            />
            <HiMagnifyingGlass className="size-7" />
          </div>
          <div className="col-span-4 grid w-full grid-cols-2 gap-2.5 xl:col-span-2">
            <button
              onClick={() => {
                setTab("Category");
                setUpload(true);
              }}
              className="h-full w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white"
            >
              New Category
            </button>
            <button
              onClick={() => {
                setTab("Service");
                setUpload(true);
              }}
              className="h-full w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white"
            >
              New Service
            </button>
          </div>
          <BusinessDropdown />
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
          <ProviderDropdown
            provider={provider}
            setProvider={setProvider}
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
          />
          <Combobox
            options={options}
            value={subCategory}
            setValue={setSubCategory}
            placeholder="Sub Category"
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            defaultSelectedIconClassName="size-4"
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          />
          <Combobox
            value={emirate}
            options={emirates}
            placeholder="Emirate"
            setValue={setEmirate}
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            defaultSelectedIconClassName="size-4"
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          />
          <BranchDropdown emirate_id={`${emirate?.id}`} company_id={provider} />
          <button
            onClick={() => setUpload(true)}
            className="col-span-1 h-full w-full rounded-lg bg-secondary p-3 text-sm font-semibold text-white"
          >
            Upload
          </button>
        </div>
        <Table />
      </div>
    </>
  );
};

export default ServiceList;
