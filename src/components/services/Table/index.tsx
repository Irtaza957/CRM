import Loader from "../../ui/Loader";
import Combobox from "../../ui/Combobox";
import { cn } from "../../../utils/helpers";
import Switch from "../../ui/Switch";
import SmallUpDownArrow from "../../../assets/icons/small-updown-arrow.svg";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import {
  categoriesColumns,
  customerColumns,
  serviceColumns,
  businessColumns,
} from "../../../utils/constants";
import {
  useUpdateServicesStatusMutation,
  useUpdateCategoryStatusMutation,
} from "../../../store/services/service";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";

interface TableProps {
  selectedTab: string;
  isLoading: boolean;
  data: any;
  handleEdit?: (arg0: any) => void;
  refetchServices?: () => void;
  refetchCategories?: () => void;
}

interface Column {
  id: number;
  name: string;
  key?: string;
}

const Table = ({
  selectedTab,
  data,
  isLoading,
  handleEdit,
  refetchServices,
  refetchCategories,
}: TableProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 2,
    name: "10",
  });
  const [updateServiceStatus] = useUpdateServicesStatusMutation();
  const [updateCategoryStatus] = useUpdateCategoryStatusMutation();

  const getColumns = () => {
    switch (selectedTab) {
      case "service":
        return serviceColumns;
      case "customer":
        return customerColumns;
      case "category":
        return categoriesColumns;
      case "business":
        return businessColumns;
      default:
        return serviceColumns;
    }
  };

  const handleStatusToggle = async (row: any) => {
    try {
      if(selectedTab === 'business'){
       return 
      }
      const urlencoded = new URLSearchParams();
      urlencoded.append(
        "id",
        String(selectedTab === "service" ? row.service_id : row.category_id)
      );
      urlencoded.append("active", row.active === "1" ? "0" : "1");

      const response =
        selectedTab === "service"
          ? await updateServiceStatus(urlencoded)
          : await updateCategoryStatus(urlencoded);

      if ("error" in response) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Couldn't update status. Please try again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Status updated successfully!"
          />
        ));
        if (selectedTab === "service") {
          refetchServices && refetchServices();
        } else {
          refetchCategories && refetchCategories();
        }
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Error"
          message="Couldn't update status. Please try again!"
        />
      ));
    }
  };

  return (
    <>
      <div className="h-[calc(100vh-375px)] w-full xl:h-[calc(100vh-275px)]">
        <div className="h-full w-full overflow-hidden rounded-t-lg border">
          <div className="no-scrollbar h-full overflow-y-scroll">
            <table className="relative w-full min-w-full">
              <thead className="sticky top-0 z-[1] bg-primary text-left text-white shadow-md">
                <tr className="h-12">
                  <th className="border-x px-3 text-xs font-medium">
                    <div className="flex w-full items-center justify-center">
                      <span className="flex-1 text-left font-bold">#</span>
                      <img src={SmallUpDownArrow} alt="small-updown-arrow" />
                    </div>
                  </th>
                  {getColumns().map((column: Column, index: number) => (
                    <th
                      key={`${column.id}-${index}`}
                      className="border-x px-3 text-xs font-medium"
                    >
                      <div className="flex w-full items-center justify-center">
                        <span className="flex-1 whitespace-nowrap text-left font-bold">
                          {column.name}
                        </span>
                        <img src={SmallUpDownArrow} alt="small-updown-arrow" />
                      </div>
                    </th>
                  ))}
                  <th className="border-x px-3 text-xs font-medium">
                    <div className="flex w-full items-center justify-center">
                      <span className="flex-1 text-left font-bold">
                        Quick Actions
                      </span>
                      <img src={SmallUpDownArrow} alt="small-updown-arrow" />
                    </div>
                  </th>
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
                    .map((row: DataProps, idx: number) => (
                      <tr
                        key={idx}
                        title="Click to Edit"
                        className={cn("h-12 bg-white text-gray-500", {
                          "bg-[#F3F5F9]": idx % 2 !== 0,
                        })}
                      >
                        <td className="px-3">
                          <span className="text-xs">{idx + 1}</span>
                        </td>
                        {/* className={`size-4 rounded-full bg-[${item?.color_code}]`} */}
                        {getColumns().map((column: Column, index: number) => (
                          <td key={`${column.id}-${index}`} className="px-3">
                            <span className="text-xs">
                              {column.key === "price_with_vat" && "AED"}
                              {[
                                "is_medical_conition",
                                "is_medication",
                                "is_allergy",
                              ].includes(column.key || '') ? (
                                row[column.key || ''] === "1" ? (
                                  "Yes"
                                ) : (
                                  "No"
                                )
                              ) : column.key === "color" ? (
                                <div
                                  className={`size-4 rounded-full bg-[${row[column.key]}]`}
                                ></div>
                              ) : (
                                row[column.key || column.name.toLowerCase()] ||
                                "N/A"
                              )}
                            </span>
                          </td>
                        ))}
                        <td className="px-3">
                          <div
                            className={`flex justify-end gap-5`}
                          >
                            {!["customer"].includes(
                              selectedTab
                            ) && (
                              <Switch
                                key={`${row.service_id || row.category_id}-${row.active}`}
                                checked={row.active === "1"}
                                onChange={() => {
                                  handleStatusToggle(row);
                                }}
                              />
                            )}
                            <FiEdit
                              onClick={() => handleEdit && handleEdit(row)}
                              className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-red-500 p-1 text-white"
                            />
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
