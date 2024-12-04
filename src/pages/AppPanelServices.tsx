import { useEffect, useMemo, useState } from "react";
import { TiArrowSortedDown } from "react-icons/ti";
import { HiMagnifyingGlass } from "react-icons/hi2";

import Combobox from "../components/ui/Combobox";
import CategoryDropdown from "../components/booking/dropdowns/Category";
import { useDeleteHomeSectionMutation, useFetchBusinessesQuery, useFetchHomeSectionsQuery, useFetchServicesQuery, useUpdateHomeSectionStatusMutation } from "../store/services/service";
import { useFetchAllCategoriesQuery } from "../store/services/categories";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ServiceDetailModal from "../components/app-panel/services/ServiceDetailModal";
import BusinessDropdown from "../components/services/dropdowns/Business";
import { useFetchCompaniesQuery } from "../store/services/company";
import { appPanelTabs, bannersHeaders, couponsHeaders, homeSectionsHeaders, servicesHeaders } from "../utils/constants";
import { cn } from "../utils/helpers";
import CustomButton from "../components/ui/CustomButton";
import AddHomeSection from "../components/app-panel/services/AddHomeSection";
import { FiEdit } from "react-icons/fi";
import Table from "../components/ui/Table";
import Loader from "../components/ui/Loader";
import { useDeleteBannerMutation, useFetchBannersQuery, useUpdateBannerStatusMutation } from "../store/services/banner";
import { useDeleteCouponMutation, useFetchCouponsQuery, useUpdateCouponStatusMutation } from "../store/services/coupons";
import AddCouponModal from "../components/coupons/modals/AddCouponModal";
import AddBannerModal from "../components/banners/modals/AddBannerModal";
import Switch from "../components/ui/Switch";
import { toast } from "sonner";
import CustomToast from "../components/ui/CustomToast";
import { FaRegTrashAlt } from "react-icons/fa";
import DeleteModal from "../components/booking/modals/DeleteModal";

const AppPanelServices = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const [subCategory, setSubCategory] = useState<ListOptionProps | null>(null);
  const [company, setCompany] = useState<ListOptionProps | null>(null);
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [filterArray, setFilterArray] = useState<FilterType[]>([]);
  const { sidebar } = useSelector((state: RootState) => state.global);
  const [open, setOpen] = useState(false);
  const [openAddHomeSection, setOpenAddHomeSection] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedTab, setSelectedTab] = useState("Services");
  const [selectedHomeSection, setSelectedHomeSection] = useState<HomeSectionProps | null>(null);
  const [openCouponModal, setOpenCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<CouponProps | null>(null);
  const [openBannerModal, setOpenBannerModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerProps | null>(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [isView, setIsView] = useState(false)
  const {
    data: servicesData,
    isLoading: servicesFetching,
  } = useFetchServicesQuery(filterArray, {
    skip: selectedTab !== "Services" || filterArray.length === 0,
    refetchOnMountOrArgChange: true,
  });
  const { data: homeSectionsData, isLoading: homeSectionsFetching, refetch: refetchHomeSections } = useFetchHomeSectionsQuery(filterArray, {
    skip: selectedTab !== "Home Sections",
    refetchOnMountOrArgChange: true,
  });

  const {
    data: bannersData,
    isLoading: bannersFetching,
    refetch: refetchBanners,
  } = useFetchBannersQuery(filterArray, {
    skip: selectedTab !== "Banners",
    refetchOnMountOrArgChange: true,
  }) as { data: BannerProps[] | undefined; isLoading: boolean; refetch: () => void }

  const {
    data: couponsData,
    isLoading: couponsFetching,
    refetch: refetchCoupons,
  } = useFetchCouponsQuery(filterArray, {
    skip: selectedTab !== "Coupons",
    refetchOnMountOrArgChange: true,
  }) as { data: CouponProps[] | undefined; isLoading: boolean; refetch: () => void };

  const [updateBannerStatus] = useUpdateBannerStatusMutation();
  const [updateCouponStatus] = useUpdateCouponStatusMutation();
  const [deleteBanner, { isLoading: deleteBannerLoading }] = useDeleteBannerMutation();
  const [deleteCoupon, { isLoading: deleteCouponLoading }] = useDeleteCouponMutation();
  const [deleteHomeSection, { isLoading: deleteHomeSectionLoading }] = useDeleteHomeSectionMutation();
  const [updateHomeSectionStatus] = useUpdateHomeSectionStatusMutation();

  const { data: businessData } = useFetchBusinessesQuery({});
  const { data: companiesDropdownData } = useFetchCompaniesQuery([{ name: 'business', id: `${business?.id}-business` }],{
    skip: !business?.id,
    refetchOnMountOrArgChange: true,
  });
  const { data: categoriesDropdownData } = useFetchAllCategoriesQuery({});

  const handleEdit = (row: any, isView: boolean = false) => {
    if (isView) {
      setIsView(true)
    }
    if (selectedTab === 'Services') {
      setOpen(true);
      setSelectedServiceId(row.service_id);
    } else if (selectedTab === 'Home Sections') {
      setSelectedHomeSection(row);
      setOpenAddHomeSection(true);
    } else if (selectedTab === 'Coupons') {
      setSelectedCoupon(row);
      setOpenCouponModal(true);
    } else if (selectedTab === 'Banners') {
      setSelectedBanner(row);
      setOpenBannerModal(true);
    }
  };

  const headers = selectedTab === 'Services' ? servicesHeaders : selectedTab === 'Home Sections' ? homeSectionsHeaders : selectedTab === 'Coupons' ? couponsHeaders : bannersHeaders;

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

  const handleSelectCompanyFilter = (value: ListOptionProps) => {
    if (company?.id === value.id) {
      setCompany(null);
      removeFilter(String(value.id) + "-company");
    } else {
      setCompany(value);
      if (value?.id) {
        addFilter("company", String(value.id) + "-company");
      } else {
        const temp: FilterType[] = filterArray.filter((item) => item.name !== "company");
        setFilterArray(temp);
      }
    }
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

  const handleAddModal = () => {
    setIsView(false)
    if (selectedTab === 'Home Sections') {
      setSelectedHomeSection(null);
      setOpenAddHomeSection(true);
    } else if (selectedTab === 'Coupons') {
      setSelectedCoupon(null);
      setOpenCouponModal(true);
    } else if (selectedTab === 'Banners') {
      setSelectedBanner(null);
      setOpenBannerModal(true);
    } else if (selectedTab === 'Services') {
      setSelectedServiceId('');
      setOpen(true);
    }
  }

  const handleStatusToggle = async (row: any) => {
    try {
      const urlencoded = new URLSearchParams();
      urlencoded.append(
        "id",
        String(selectedTab === "Banners" ? row.banner_id : selectedTab === 'Home Sections' ? row.id : row.coupon_id)
      );
      urlencoded.append("active", row.active === "1" ? "0" : "1");

      const response =
        selectedTab === "Banners"
          ? await updateBannerStatus(urlencoded)
          : selectedTab === 'Home Sections'
            ? await updateHomeSectionStatus(urlencoded)
            : await updateCouponStatus(urlencoded);

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
        if (selectedTab === "Banners") {
          refetchBanners();
        } else if (selectedTab === 'Home Sections') {
          refetchHomeSections();
        } else {
          refetchCoupons();
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

  const handleDelete = async () => {
    try {
      let response;
      if (selectedTab === 'Banners') {
        response = await deleteBanner(deleteItem?.banner_id);
      } else if (selectedTab === 'Coupons') {
        response = await deleteCoupon(deleteItem?.coupon_id);
      } else if (selectedTab === 'Home Sections') {
        response = await deleteHomeSection(deleteItem?.id);
      }
      if (response?.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Couldn't delete banner. Please try again!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Banner deleted successfully!"
          />
        ));
        if (selectedTab === 'Banners') {
          refetchBanners();
        } else {
          refetchCoupons();
        }
        setOpenDeleteModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteModal = (row: any) => {
    if (selectedTab !== 'Home Sections') {
      setOpenDeleteModal(true);
      setDeleteItem(row);
    }
  }

  const renderActions = (row: any) => (
    <div className="flex gap-5 justify-end">
      {selectedTab !== 'Services' && (
        <Switch
          key={`${selectedTab === 'Home Sections' ? row.id : selectedTab === 'Coupons' ? row.coupon_id : row.banner_id}-${selectedTab === 'Banners' ? row.title : row.name}`}
          checked={row.active === "1"}
          onChange={() => {
            handleStatusToggle(row);
          }}
        />
      )}
      <FiEdit
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(row);
        }}
        className="col-span-1 h-6 w-6 cursor-pointer rounded-md bg-red-500 p-1 text-white"
      />
      {selectedTab !== 'Services' && (
        <FaRegTrashAlt
          onClick={(e) => {
            e.stopPropagation()
            handleDeleteModal(row)
          }}
          className="h-6 w-6 cursor-pointer"
        />
      )}
    </div>
  );

  useEffect(() => {
    if (companiesDropdownData?.length) {
      const firstCompany = companiesDropdownData[0]
      if (firstCompany?.id) {
        setCompany({ id: firstCompany.id, name: firstCompany.name });
        setFilterArray((prevFilters) => [
          ...prevFilters.filter((filter) => filter.name !== "company"),
          { name: "company", id: `${firstCompany.id}-company` },
        ]);
      }
    }
  }, [companiesDropdownData]);

  useEffect(() => {
    if (businessData?.length) {
      const firstBusiness = businessData[0]
      if (firstBusiness?.id) {
        setBusiness({ id: firstBusiness.id, name: firstBusiness.name });
        setFilterArray((prevFilters) => [
          ...prevFilters.filter((filter) => filter.name !== "business"),
          { name: "business", id: `${firstBusiness.id}-business` },
        ]);
      }
    }
  }, [businessData]);

  useEffect(() => {
    if (selectedTab !== 'Services' && filterArray.some((item) => item.name === 'category')) {
      const temp: FilterType[] = filterArray.filter((item) => item.name !== 'category');
      setFilterArray(temp);
      setCategory(null);
      setSubCategory(null);
    }
  }, [selectedTab])

  const filteredData = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    switch (selectedTab) {
      case 'Services':
        return servicesData?.filter((item) =>
          item.service_name.toLowerCase().includes(lowercasedSearch)
        );
      case 'Home Sections':
        return homeSectionsData?.filter((item) =>
          item.name.toLowerCase().includes(lowercasedSearch)
        );
      case 'Banners':
        return bannersData?.filter((item) =>
          item.title.toLowerCase().includes(lowercasedSearch)
        );
      case 'Coupons':
        return couponsData?.filter((item) =>
          item.name.toLowerCase().includes(lowercasedSearch)
        );
    }
  }, [search, servicesData, homeSectionsData, selectedTab, bannersData, couponsData]);

  if (servicesFetching || homeSectionsFetching || bannersFetching || couponsFetching) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <AddHomeSection
        open={openAddHomeSection}
        setOpen={setOpenAddHomeSection}
        selectedBusiness={business?.id || ''}
        selectedCompany={company?.id || ''}
        refetch={refetchHomeSections}
        selectedHomeSection={selectedHomeSection}
        isView={isView}
        setIsView={setIsView}
      />
      <AddCouponModal
        open={openCouponModal}
        setOpen={setOpenCouponModal}
        selectedCoupon={selectedCoupon}
        refetch={refetchCoupons}
        isView={isView}
        setIsView={setIsView}
        businessId={business?.id || ''}
        companyId={company?.id || ''}
      />
      <AddBannerModal
        open={openBannerModal}
        setOpen={setOpenBannerModal}
        selectedBanner={selectedBanner}
        refetch={refetchBanners}
        isView={isView}
        setIsView={setIsView}
        businessId={business?.id || ''}
        companyId={company?.id || ''}
      />
      <div className="flex min-h-screen w-full gap-3">
        <div className="flex h-full w-full flex-col items-start justify-start">
          <div className="col-span-12 grid w-full grid-cols-12 mb-3 gap-3">
            <ul className="flex justify-end col-span-8 rounded-lg text-center text-sm font-medium text-gray-500 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
              {appPanelTabs.map((tab, index) => (
                <li
                  className="w-full focus-within:z-10"
                  key={index}
                  onClick={() => setSelectedTab(tab)}
                >
                  <p className={
                    cn("w-full cursor-pointer border-r border-gray-200 whitespace-nowrap bg-white p-3 hover:bg-primary hover:text-white focus:ring-4 focus:ring-blue-300 dark:border-gray-700",
                      selectedTab === tab && "bg-primary text-white",
                      index === 0 && "rounded-l-md",
                      index === appPanelTabs.length - 1 && "rounded-r-md"
                    )

                  }>
                    {tab}
                  </p>
                </li>
              ))}
            </ul>
            {selectedTab !== 'Services' && (
              <div className="col-span-4 flex justify-end w-full">
                <CustomButton
                  name={`Add New ${selectedTab === 'Home Sections' ? 'Section' : selectedTab === 'Coupons' ? 'Coupon' : 'Banner'}`}
                  handleClick={handleAddModal}
                  style="font-medium text-base px-10 w-full"
                />
              </div>
            )}
          </div>
          <div
            className={`mb-3 grid w-full grid-cols-12 ${sidebar ? "gap-1.5" : "gap-2.5"}`}
          >
            {/* Filters */}
            <div
              className={`grid w-full ${sidebar ? "gap-1.5" : "gap-2.5"} col-span-8 ${selectedTab === 'Services' ? 'grid-cols-4' : 'grid-cols-2'}`}
            >
              <BusinessDropdown
                business={business}
                businesses={businessData}
                handleSelectBusinessFilter={handleSelectBusinessFilter}
              />
              <Combobox
                value={company}
                options={companiesDropdownData?.map((item) => {
                  return { id: item.id, name: item.name };
                })}
                handleSelect={handleSelectCompanyFilter}
                placeholder="Company"
                mainClassName="w-full"
                toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!company?.id && 'text-gray-500'}`}
                listClassName="w-full top-[45px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                icon={<div><TiArrowSortedDown className="size-5" /></div>}
                searchInputPlaceholder="Search..."
                searchInputClassName="p-1.5 text-xs"
                isRemoveAllow={true}
              />
              {selectedTab === 'Services' && (
                <>
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
                </>
              )}
            </div>
            <div
              className={`col-span-4 flex h-full w-full items-center justify-center gap-2.5 rounded-lg bg-white px-3.5 text-gray-500`}
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
          <div className="w-full xl:h-[calc(100vh-260px)]">
            <Table
              headers={headers}
              rows={filteredData || []}
              renderActions={renderActions}
              handleRowClick={(row) => handleEdit(row, true)}
            />
          </div>
        </div>
      </div>
      <ServiceDetailModal
        open={open}
        setOpen={setOpen}
        selectedServiceId={selectedServiceId}
        isApp={true}
      />
      <DeleteModal
        title={`Delete ${selectedTab === 'Banners' ? 'Banner' : 'Coupon'}`}
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        deleteLoading={deleteBannerLoading || deleteCouponLoading || deleteHomeSectionLoading}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default AppPanelServices;