import { useEffect, useState } from "react";
import { useFetchBannersQuery } from "../store/services/banner";
import { FiEdit } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import SmallUpDownArrow from "../assets/icons/small-updown-arrow.svg";
import Combobox from "../components/ui/Combobox";
import Loader from "../components/ui/Loader";
import { cn } from "../utils/helpers";
import AddBannerModal from "../components/banners/modals/AddBannerModal";
import { HiMagnifyingGlass } from "react-icons/hi2";

const columns = [
  {
    id: "col_1",
    name: "#",
  },
  {
    id: "col_2",
    name: "Title",
    key: "title",
  },
  {
    id: "col_3",
    name: "Description",
    key: "description",
  },
  {
    id: "col_4",
    name: "Type",
    key: "type",
  },
  {
    id: "col_5",
    name: "Link To",
    key: "link_to",
  },
  {
    id: "col_6",
    name: "Actions",
  },
];

interface Banner {
  banner_id: string;
  title: string;
  description: string;
  image: string;
  link_to: string;
  link_data: string;
  type: string;
}

const Banners = () => {
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [isView, setIsView] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState<ListOptionProps | null>({
    id: 2,
    name: "10",
  });

  const isDripHub = window.location.pathname.includes("dripHub");

  const {
    data: banners,
    isLoading,
    refetch,
  } = useFetchBannersQuery({
    businessId: isDripHub ? 2 : 1,
    companyId: isDripHub ? 2 : 1,
  }) as { data: Banner[] | undefined; isLoading: boolean; refetch: () => void };

  const startIndex = page * parseInt(limit!.name) - parseInt(limit!.name);
  const endIndex = page * parseInt(limit!.name);
  console.log("Slice indices:", { startIndex, endIndex });

  const handleEdit = (banner: Banner, isView?: boolean) => {
    setSelectedBanner(banner);
    setIsView(!!isView);
    setOpenModal(true);
  };

  const handleAddNew = () => {
    setSelectedBanner(null);
    setIsView(false);
    setOpenModal(true);
  };

  useEffect(()=>{
    if(!open){
      setSelectedBanner(null)
    }
  },[open])

  if (!banners) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        {isLoading ? <Loader /> : <p>No banners found</p>}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full gap-3">
      <div className="flex h-full w-full flex-col items-start justify-start">
        <div className="mb-3 flex items-center w-full justify-between">
          <div
            className={`flex h-full w-[30%] items-center justify-center gap-2.5 rounded-lg bg-white px-3.5 text-gray-500 xl:col-span-4 col-span-12`}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Name..."
              className="w-full h-10 bg-transparent text-xs placeholder:text-gray-500"
            />
            <HiMagnifyingGlass className="size-7" />
          </div>
          <button
            onClick={handleAddNew}
            className="whitespace-nowrap rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Add New
          </button>
        </div>

        <div className="w-full xl:h-[calc(100vh-220px)]">
          <div className="h-full w-full overflow-hidden rounded-t-lg border">
            <div className="no-scrollbar h-full overflow-y-scroll">
              {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader />
                </div>
              ) : (
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
                            <img
                              src={SmallUpDownArrow}
                              alt="small-updown-arrow"
                            />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {banners.map((banner, idx) => (
                      <tr
                        key={`banner-${banner.banner_id}-${idx}`}
                        title="Click to View"
                        className={cn(
                          "h-12 cursor-pointer bg-white text-gray-500",
                          {
                            "bg-[#F3F5F9]": idx % 2 !== 0,
                          }
                        )}
                        onClick={() => handleEdit(banner, true)}
                      >
                        <td className="px-3">
                          <span className="text-xs">{idx + 1}</span>
                        </td>
                        <td className="px-3">
                          <span className="text-xs">{banner.title}</span>
                        </td>
                        <td className="px-3">
                          <span className="text-xs">
                            {banner.description || "N/A"}
                          </span>
                        </td>
                        <td className="px-3">
                          <span className="text-xs">{banner.type}</span>
                        </td>
                        <td className="px-3">
                          <span className="text-xs">{banner.link_to}</span>
                        </td>
                        <td className="px-3">
                          <div className="flex justify-end gap-5">
                            <FiEdit
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(banner);
                              }}
                              className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-red-500 p-1 text-white"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between rounded-b-lg border-x border-b bg-white p-2.5">
          {banners && (
            <>
              <div className="flex w-full flex-1 items-center justify-start gap-3">
                {(() => {
                  const totalPages = Math.ceil(
                    banners.length / parseInt(limit!.name)
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
                {Math.ceil(banners.length / parseInt(limit!.name))}
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

        <AddBannerModal
          open={openModal}
          setOpen={setOpenModal}
          selectedBanner={selectedBanner}
          refetch={refetch}
          isView={isView}
          setIsView={setIsView}
        />
      </div>
    </div>
  );
};

export default Banners;
