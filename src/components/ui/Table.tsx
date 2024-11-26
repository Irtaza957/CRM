import React from "react";

interface Header {
  label: string;
  key: string;
  sortable?: boolean;
  sortIcon?: string;
}

interface TableProps {
  headers: Header[];
  rows: Array<Record<string, any>>;
  renderActions?: (row: Record<string, any>) => React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ headers, rows, renderActions, className = "" }) => {
  return (
    <div className={`h-full w-full overflow-hidden rounded-t-lg border ${className}`}>
      <div className="no-scrollbar h-full overflow-y-scroll">
        <table className="relative w-full min-w-full">
          <thead className="sticky top-0 z-[1] bg-primary text-left text-white shadow-md">
            <tr className="h-12">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className={`border-x px-3 text-xs font-medium ${
                    header.key === "actions" ? "text-center" : ""
                  }`}
                >
                  <div
                    className={`flex ${
                      header.key === "actions" ? "justify-center" : "justify-start"
                    } items-center w-full`}
                  >
                    <span className="flex-1 text-left font-bold">
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
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                title="Click to View"
                className={`h-12 text-gray-500 cursor-pointer ${
                  rowIndex % 2 === 0 ? "bg-[#F3F5F9]" : "bg-white"
                }`}
              >
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-3">
                    {header.key === "actions" ? (
                      <div className="flex justify-center gap-5">
                        {renderActions && renderActions(row)}
                      </div>
                    ) : (
                      <span className="text-xs">{row[header.key]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
