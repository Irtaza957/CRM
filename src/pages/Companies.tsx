import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiMagnifyingGlass } from "react-icons/hi2";

import { cn } from "../utils/helpers";
import Switch from "../components/ui/Switch";
import { options } from "../utils/constants";
import Combobox from "../components/ui/Combobox";
import { useFetchCompaniesQuery } from "../store/services/company";
import AddCompany from "../components/companies/modals/AddCompany";
import UpdateCompany from "../components/companies/modals/UpdateCompany";

const Companies = () => {
  const columns = [
    {
      id: 1,
      name: "#",
    },
    {
      id: 2,
      name: "Company Code",
    },
    {
      id: 3,
      name: "Company Name",
    },
    {
      id: 4,
      name: "Phone",
    },
    {
      id: 5,
      name: "Email",
    },
    {
      id: 6,
      name: "Total Branches",
    },
    {
      id: 7,
      name: "Business",
    },
    {
      id: 8,
      name: "Actions",
    },
  ];
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data } = useFetchCompaniesQuery({});
  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 2,
    name: "10",
  });
  const [branch, setBranch] = useState<ListOptionProps | null>(null);
  const [emirate, setEmirate] = useState<ListOptionProps | null>(null);
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [provider, setProvider] = useState<ListOptionProps | null>(null);
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const [subCategory, setSubCategory] = useState<ListOptionProps | null>(null);

  return (
    <>
      <AddCompany open={openAdd} setOpen={setOpenAdd} />
      <UpdateCompany id={selected} open={openUpdate} setOpen={setOpenUpdate} />
      <div className="flex h-full w-full flex-col items-start justify-start">
        <div className="mb-5 grid w-full grid-cols-4 gap-2.5 xl:grid-cols-7">
          <div className="col-span-4 flex w-full items-center justify-center space-x-2.5 rounded-lg bg-white p-3.5 text-gray-500 xl:col-span-7">
            <input
              type="text"
              value={search}
              placeholder="Search Category"
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs placeholder:italic placeholder:text-gray-500"
            />
            <HiMagnifyingGlass className="size-4" />
          </div>
          <Combobox
            value={business}
            options={options}
            placeholder="Business"
            setValue={setBusiness}
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            defaultSelectedIconClassName="size-4"
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          />
          <Combobox
            value={category}
            options={options}
            placeholder="Category"
            setValue={setCategory}
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            defaultSelectedIconClassName="size-4"
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
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
            value={provider}
            options={options}
            placeholder="Provider"
            setValue={setProvider}
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            defaultSelectedIconClassName="size-4"
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          />
          <Combobox
            options={[
              {
                id: 1,
                name: "Dubai",
              },
              {
                id: 2,
                name: "Abu Dhabi",
              },
              {
                id: 3,
                name: "Sharjah",
              },
              {
                id: 4,
                name: "Ajman",
              },
              {
                id: 5,
                name: "Umm Al Quwain",
              },
              {
                id: 6,
                name: "Ras Al Khaimah",
              },
              {
                id: 7,
                name: "Fujairah",
              },
              {
                id: 8,
                name: "Al Ain",
              },
            ]}
            value={emirate}
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
          <Combobox
            value={branch}
            options={options}
            setValue={setBranch}
            placeholder="Branch"
            mainClassName="col-span-1 w-full"
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            defaultSelectedIconClassName="size-4"
            icon={<TiArrowSortedDown className="size-5" />}
            toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
            listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          />
          <button
            type="button"
            onClick={() => setOpenAdd(true)}
            className="col-span-1 h-full w-full rounded-lg bg-secondary p-3 text-xs text-white"
          >
            New Company
          </button>
        </div>
        <div className="h-[calc(100vh-375px)] w-full xl:h-[calc(100vh-275px)]">
          <div className="h-full w-full overflow-hidden rounded-t-lg border">
            <div className="no-scrollbar h-full overflow-y-scroll">
              <table className="relative w-full min-w-full">
                <thead className="sticky top-0 z-[1] bg-primary text-left text-white shadow-md">
                  <tr className="h-10">
                    {columns.map((column) => (
                      <th
                        key={column.id}
                        className="border-x px-3 text-xs font-medium"
                      >
                        <span className="line-clamp-1">{column.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data
                    ?.slice(
                      page * parseInt(limit!.name) - parseInt(limit!.name),
                      page * parseInt(limit!.name)
                    )
                    .map((company, idx) => (
                      <tr
                        key={idx}
                        title="Click to Edit"
                        className={cn(
                          "h-10 cursor-pointer bg-white text-gray-500",
                          {
                            "bg-[#F3F5F9]": idx % 2 !== 0,
                          }
                        )}
                      >
                        <td
                          onClick={() => {
                            setSelected(company.id);
                            setOpenUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{idx + 1}</span>
                        </td>
                        <td
                          onClick={() => {
                            setSelected(company.id);
                            setOpenUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{company.code}</span>
                        </td>
                        <td
                          onClick={() => {
                            setSelected(company.id);
                            setOpenUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{company.name}</span>
                        </td>
                        <td
                          onClick={() => {
                            setSelected(company.id);
                            setOpenUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{company.phone}</span>
                        </td>
                        <td
                          onClick={() => {
                            setSelected(company.id);
                            setOpenUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{company.email}</span>
                        </td>
                        <td
                          onClick={() => {
                            setSelected(company.id);
                            setOpenUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">
                            {company.total_branches}
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            setSelected(company.id);
                            setOpenUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{company.business}</span>
                        </td>
                        <td className="pl-4">
                          <div className="flex gap-1">
                            <Switch />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex w-full items-center justify-between rounded-b-lg border-x border-b bg-white p-2.5">
          {data && (
            <>
              <div className="flex w-full flex-1 items-center justify-start gap-3">
                {(() => {
                  const totalPages = Math.ceil(
                    data?.length / parseInt(limit!.name)
                  );
                  const maxVisibleButtons = 5;
                  const startPage = Math.max(
                    1,
                    page - Math.floor(maxVisibleButtons / 2)
                  );
                  const endPage = Math.min(
                    totalPages,
                    startPage + maxVisibleButtons - 1
                  );

                  const adjustedStartPage = Math.max(
                    1,
                    endPage - maxVisibleButtons + 1
                  );

                  const pageNumbers = [
                    ...Array(endPage - adjustedStartPage + 1).keys(),
                  ].map((n) => adjustedStartPage + n);

                  return (
                    <>
                      {adjustedStartPage > 1 && (
                        <>
                          <div
                            onClick={() => setPage(1)}
                            className={cn(
                              "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                              {
                                "bg-primary text-white": page === 1,
                              }
                            )}
                          >
                            1
                          </div>
                          <div className="flex size-[31px] items-center justify-center text-xs">
                            ...
                          </div>
                        </>
                      )}
                      {pageNumbers.map((pageNumber) => (
                        <div
                          key={pageNumber}
                          onClick={() => setPage(pageNumber)}
                          className={cn(
                            "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                            {
                              "bg-primary text-white": page === pageNumber,
                            }
                          )}
                        >
                          {pageNumber}
                        </div>
                      ))}
                      {endPage < totalPages && (
                        <>
                          <div className="flex size-[31px] items-center justify-center text-xs">
                            ...
                          </div>
                          <div
                            onClick={() => setPage(totalPages)}
                            className={cn(
                              "flex size-[31px] cursor-pointer items-center justify-center rounded-md bg-gray-100 text-xs text-black shadow-md",
                              {
                                "bg-primary text-white": page === totalPages,
                              }
                            )}
                          >
                            {totalPages}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
              <p className="mr-2.5 text-xs font-semibold">
                Showing {page} of&nbsp;
                {Math.ceil(data?.length / parseInt(limit!.name))}
                &nbsp;Pages
              </p>
            </>
          )}
          <Combobox
            options={[
              {
                id: 1,
                name: "5",
              },
              {
                id: 2,
                name: "10",
              },
              {
                id: 3,
                name: "15",
              },
              {
                id: 4,
                name: "20",
              },
            ]}
            value={limit}
            placeholder="Limit"
            setValue={setLimit}
            searchInputPlaceholder="Search..."
            searchInputClassName="p-1.5 text-xs"
            icon={<FaChevronDown className="size-3" />}
            defaultSelectedIconClassName="size-2.5 text-secondary"
            toggleClassName="w-full border px-3 py-1.5 rounded-lg text-xs bg-white"
            listClassName="w-full bottom-8 max-h-52 border rounded-lg z-10 bg-white"
            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
          />
        </div>
      </div>
    </>
  );
};

export default Companies;
