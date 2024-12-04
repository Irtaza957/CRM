import React, { useState } from "react";
import Combobox from "./Combobox";
import { cn } from "../../utils/helpers";
import { FaChevronDown } from "react-icons/fa";

interface Header {
  label: string;
  key: string;
  sortable?: boolean;
  sortIcon?: string;
}

interface TableProps {
  headers: Header[];
  rows: Array<Record<string, any>>;
  className?: string;
  renderActions?: (row: Record<string, any>) => React.ReactNode;
  handleRowClick?: (row: Record<string, any>) => void;
}

const Table: React.FC<TableProps> = ({ headers, rows, renderActions, className = "", handleRowClick }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 2,
    name: "10",
  });
  return (
    <>
      <div className={`h-full w-full overflow-hidden rounded-t-lg border ${className}`}>
        <div className="no-scrollbar h-full overflow-y-scroll">
          <table className="relative w-full min-w-full">
            <thead className="sticky top-0 z-[1] bg-primary text-left text-white shadow-md">
              <tr className="h-12">
                {headers.map((header, idx) => (
                  <th
                    key={idx}
                    className={`border-x px-3 text-xs font-medium whitespace-nowrap ${header.key === "actions" ? "text-center" : ""
                      }`}
                  >
                    <div
                      className={`flex ${header.key === "actions" ? "justify-center" : "justify-start"
                        } items-center w-full`}
                    >
                      <span className={cn("flex-1 text-left font-bold", header.label==='Quick Actions' && 'text-center')}>
                        {header.label}
                      </span>
                      {header.sortable && header.key !== "actions" && (
                        <img src={header.sortIcon} alt={`${header.label}-sort`} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows?.length > 0 ? rows?.slice(
                page * parseInt(limit!.name) - parseInt(limit!.name),
                page * parseInt(limit!.name)
              ).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  title="Click to View"
                  className={`h-12 text-gray-500 cursor-pointer ${rowIndex % 2 === 0 ? "bg-[#F3F5F9]" : "bg-white"
                    }`}
                >
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="pl-4" onClick={()=>handleRowClick?.(row)}>
                      
                      {header.key === "actions" ? (
                        <div className="flex justify-center gap-5">
                          {renderActions && renderActions(row)}
                        </div>
                      ) : (
                        header.key==='image' ? (
                          <img src={row[header.key]?.includes('http') ? row[header.key] : `${import.meta.env.VITE_BASE_URL}/${row[header.key]}`} alt={row.title} className="w-8 h-8 object-cover rounded-full" />
                        ) : (
                          <span className="text-xs" dangerouslySetInnerHTML={{ __html: row[header.key] }}></span>
                        )
                      )}
                    </td>
                  ))}
                </tr>
              )) : 
              <tr>
                <td colSpan={headers.length} className="h-12 text-center text-sm text-gray-500 bg-[#F3F5F9]">No data found</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex w-full items-center justify-between rounded-b-lg border-x border-b bg-white p-2.5">
        {rows && (
          <>
            <div className="flex w-full flex-1 items-center justify-start gap-3">
              {(() => {
                const totalPages = Math.ceil(
                  rows?.length / parseInt(limit!.name)
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
              {Math.ceil(rows?.length / parseInt(limit!.name))}
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
