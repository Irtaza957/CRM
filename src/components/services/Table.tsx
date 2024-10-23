import Loader from "../ui/Loader";
import Combobox from "../ui/Combobox";
import { cn } from "../../utils/helpers";
import Switch from "../../components/ui/Switch";
import UpdateService from "./forms/update/UpdateService";
import { useFetchServicesQuery } from "../../store/services/service";
import SmallUpDownArrow from "../../assets/icons/small-updown-arrow.svg";

import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";

const columns = [
  {
    id: 1,
    name: "#",
  },
  {
    id: 2,
    name: "Service Code",
  },
  {
    id: 3,
    name: "Category Name",
  },
  {
    id: 4,
    name: "Sub Category Name",
  },
  {
    id: 5,
    name: "Service Name",
  },
  {
    id: 6,
    name: "Provider Name",
  },
  {
    id: 7,
    name: "Branch Name",
  },
  {
    id: 8,
    name: "Supplier Name",
  },
  {
    id: 9,
    name: "Selling Price",
  },
  {
    id: 10,
    name: "Quick Actions",
  },
];

const Table = () => {
  const [id, setID] = useState("");
  const [page, setPage] = useState(1);
  const [update, setUpdate] = useState(false);
  const { data, isLoading } = useFetchServicesQuery({});
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 2,
    name: "10",
  });

  return (
    <>
      <UpdateService id={id} open={update} setOpen={setUpdate} />
      <div className="h-[calc(100vh-375px)] w-full xl:h-[calc(100vh-275px)]">
        <div className="h-full w-full overflow-hidden rounded-t-lg border">
          <div className="no-scrollbar h-full overflow-y-scroll">
            <table className="relative w-full min-w-full">
              <thead className="sticky top-0 z-[1] bg-primary text-left text-white shadow-md">
                <tr className="h-12">
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      className="border-x px-3 text-xs font-medium"
                    >
                      <div className="flex w-full items-center justify-center">
                        <span className="flex-1 text-left font-bold">
                          {column.name}
                        </span>
                        <img src={SmallUpDownArrow} alt="small-updown-arrow" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <tbody>
                  {data
                    ?.slice(
                      page * parseInt(limit!.name) - parseInt(limit!.name),
                      page * parseInt(limit!.name)
                    )
                    .map((service, idx) => (
                      <tr
                        key={idx}
                        title="Click to Edit"
                        className={cn(
                          "h-12 cursor-pointer bg-white text-gray-500",
                          {
                            "bg-[#F3F5F9]": idx % 2 !== 0,
                          }
                        )}
                      >
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{idx + 1}</span>
                        </td>
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{service.service_id}</span>
                        </td>
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">
                            {service.category_name}
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">SubCategory Name</span>
                        </td>
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">
                            {service.service_name}
                          </span>
                        </td>
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{service.providor}</span>
                        </td>
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">Branch Name</span>
                        </td>
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">{service.supplier}</span>
                        </td>
                        <td
                          onClick={() => {
                            setID(service.service_id);
                            setUpdate(true);
                          }}
                          className="px-3"
                        >
                          <span className="text-xs">
                            AED {service.price_with_vat}
                          </span>
                        </td>
                        <td className="px-3">
                          <div className="flex justify-between">
                            <Switch />
                            <FiEdit className="col-span-1 h-6 w-6 rounded-md bg-red-500 p-1 text-white" />
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              )}
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
    </>
  );
};

export default Table;
