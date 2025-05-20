import "swiper/css";
import "swiper/css/free-mode";
import {
  cn,
  copyToClipboard,
  createTimelineView,
} from "../../../utils/helpers";

import Modal from "../../ui/Modal";
import Combobox from "../../ui/Combobox";
import {
  useFetchBookingsQuery,
  useCreateBookingMutation,
  useFetchBookingDetailsQuery,
  useDeleteAttachmentMutation,
  useFetchBookingSourcesQuery,
  useFetchBookingChannelsQuery,
  useFetchBookingPartnersQuery,
} from "../../../store/services/booking";
import {
  useFetchCustomerFamilyMutation,
  useFetchCustomerAddressesMutation,
  useFetchCustomerAttachmentsMutation,
} from "../../../store/services/customer";
import { RootState } from "../../../store";
import CustomToast from "../../ui/CustomToast";
import AutoComplete from "../../ui/AutoComplete";
import { dayNames, timeSlots } from "../../../utils/constants";
import CustomDatePicker from "../../ui/CustomDatePicker";
import ServiceAutoComplete from "../../ui/ServiceAutoComplete";

import {
  IoClose,
  IoCalendarOutline,
  IoDocumentOutline,
  IoLocationOutline,
} from "react-icons/io5";
import {
  FaRegEdit,
  FaChevronLeft,
  FaRegTrashAlt,
  FaChevronRight,
  FaSearch,
} from "react-icons/fa";
import dayjs from "dayjs";
import { toast } from "sonner";
import { FreeMode } from "swiper/modules";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiPlus, FiDownload } from "react-icons/fi";
import { LuUser2 } from "react-icons/lu";
import { TiArrowSortedDown, TiDocumentText } from "react-icons/ti";
import AddAddressModal from "./AddAddressModal";
import CustomButton from "../../ui/CustomButton";
import BookingHistoryModal from "./BookingHistoryModal";
import AddCustomerModal from "./AddCustomerModal";
import AddFamilyMemberModal from "./AddFamilyMemberModal";
import AddMedicalDetailModal from "./AddMedicalDetailModal";
import EditServiceModal from "./EditServiceModal";
import UploadAttachmentModal from "./UploadAttachmentModal";
import {
  useFetchBranchesQuery,
  useFetchUsersByRolesQuery,
} from "../../../store/services/filters";
import DeleteModal from "./DeleteModal";
import { RiArrowDownSLine } from "react-icons/ri";
import { useFetchCompaniesQuery } from "../../../store/services/company";
import { useFetchBookingPlatformsQuery } from "../../../store/services/booking";
import { useFetchBusinessesQuery } from "../../../store/services/service";

interface NewBookingModal {
  selectedBooking?: string | null;
  open: boolean;
  isViewBooking?: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  setID?: React.Dispatch<React.SetStateAction<string>>;
}

const Bookings = ({
  bookings,
  setUpdate,
  setID,
  setOpen,
}: {
  bookings: BookingProps[];
  setUpdate?: React.Dispatch<React.SetStateAction<boolean>>;
  setID?: React.Dispatch<React.SetStateAction<string>>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Swiper
      slidesPerView={2.15}
      spaceBetween={5}
      freeMode={true}
      modules={[FreeMode]}
    >
      {bookings.map((booking) => (
        <SwiperSlide key={booking.booking_id}>
          <div
            className="grid cursor-pointer grid-cols-12 overflow-hidden rounded-lg bg-white"
            onClick={() => {
              setID?.(booking.booking_id);
              setOpen?.(false);
              setUpdate?.(true);
            }}
          >
            <div
              style={{
                backgroundColor: booking.booking_status.color || "#FF2727",
              }}
              className="col-span-1 h-full w-full"
            />
            <div className="col-span-11 flex h-full w-full flex-col items-center justify-center space-y-1.5 p-1.5 text-xs">
              <div className="flex w-full items-center justify-start space-x-1.5">
                <TiDocumentText className="h-4 w-4" />
                <p className="w-full overflow-hidden truncate text-left">
                  {booking.consultation_team.length !== 0
                    ? booking.consultation_team
                        .map((member) => {
                          return member.name;
                        })
                        .join(" - ")
                    : "N/A"}
                </p>
              </div>
              <div className="flex w-full items-center justify-start space-x-1.5">
                <IoLocationOutline className="h-4 w-4" />
                <span className="w-full overflow-hidden truncate text-left">
                  {booking.location}
                </span>
              </div>
              <div className="flex w-full items-center justify-start space-x-1.5">
                <LuUser2 className="h-4 w-4" />
                <span className="w-full overflow-hidden truncate text-left">
                  {booking.consultation_team.length !== 0
                    ? booking.consultation_team
                        .map((member) => {
                          return member.name;
                        })
                        .join(" - ")
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

const NewBookingModal = ({
  selectedBooking,
  open,
  setOpen,
  setUpdate,
  setID,
}: NewBookingModal) => {
  const [address, setAddress] = useState<number | null>(null);
  const [timeline, setTimeline] = useState<Record<
    string,
    BookingProps[]
  > | null>();
  const [discount, setDiscount] = useState<{
    type: "aed" | "percent";
    value: number;
  }>({
    type: "aed",
    value: 0,
  });
  const [payment, setPayment] = useState("cod");
  const [editMode, setEditMode] = useState(false);
  const [editableAddressId, setEditableAddressId] =
    useState<AddressProps | null>(null);
  const [editableFamilyMember, setEditableFamilyMember] =
    useState<FamilyProps | null>(null);
  const [scheduleTime, setScheduleTime] = useState<ListOptionProps | null>(
    null
  );
  const [source, setSource] = useState<ListOptionProps | null>(null);
  const [platform, setPlatform] = useState<ListOptionProps | null>(null);
  const [channel, setChannel] = useState<ListOptionProps | null>(null);
  const [partner, setPartner] = useState<ListOptionProps | null>(null);
  const [business, setBusiness] = useState<ListOptionProps | null>(null);
  const [company, setCompany] = useState<ListOptionProps | null>(null);
  const [branch, setBranch] = useState<ListOptionProps | null>(null);
  const [scheduleDate, setScheduleDate] = useState<Date | string>(new Date());
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [fetchFamily] = useFetchCustomerFamilyMutation();
  const [selectedServices, setSelectedServices] = useState<
    ServiceProps[] | null
  >([]);
  const [fetchAddresses] = useFetchCustomerAddressesMutation();
  const [family, setFamily] = useState<FamilyProps[] | null>([]);
  const { user } = useSelector((state: RootState) => state.global);
  const [date, setDate] = useState<Date | null>(null);
  const [fetchAttachments] = useFetchCustomerAttachmentsMutation();
  const [addresses, setAddresses] = useState<AddressProps[] | null>([]);
  // const [category, setCategory] = useState<ListOptionProps | null>(null);
  const { data } = useFetchBookingsQuery(
    { date: dayjs(date || new Date()).format("YYYY-MM-DD") },
    {
      skip: !open,
      refetchOnMountOrArgChange: true,
    }
  );
  const [profession, setProfession] = useState<ListOptionProps | null>(null);
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation();
  const [selectedUser, setSelectedUser] = useState<CustomerProps | null>(null);
  const [attachments, setAttachments] = useState<AttachmentProps[] | null>([]);
  const [selectedFamily, setSelectedFamily] = useState<number | null>(null);
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [openFamilyMemberModal, setOpenFamilyMemberModal] = useState(false);
  const [openMedicalDetailsModal, setOpenMedicalDetailsModal] = useState(false);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [openEditServiceModal, setOpenEditServiceModal] = useState(false);
  const [openUploadAttachment, setOpenUploadAttachment] = useState(false);
  const [selectedService, setSelectedServiceModal] = useState<string | null>(
    null
  );
  const [orderId, setOrderId] = useState<string>("");
  // const [categories, setCategories] = useState<ListOptionProps[]>([]);
  const [profesionsData, setProfesionsData] = useState<ListOptionProps[]>([]);
  const [bookingsData, setBookingsData] = useState<any>([]);
  const [toggleSearch, setToggleSearch] = useState(true);
  const [history, setHistory] = useState(false);
  const [openDeleteAttachmentModal, setOpenDeleteAttachmentModal] =
    useState(false);
  const [deleteBookingAttachment, setDeleteAttachment] =
    useState<AttachmentProps | null>(null);

  // const [fetchCategories] = useFetchCategoriesMutation();
  const { data: professions } = useFetchUsersByRolesQuery(
    {},
    {
      skip: !open,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: bookingPlatformsData } = useFetchBookingPlatformsQuery({});
  const { data: bookingPartnersData } = useFetchBookingPartnersQuery(
    String(company?.id || ""),
    {
      skip: !company?.id,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: bookingDetailData } = useFetchBookingDetailsQuery(
    selectedBooking,
    {
      skip: !selectedBooking || !open,
      refetchOnMountOrArgChange: true,
    }
  );
  const [deleteAttachment, { isLoading: deleteLoading }] =
    useDeleteAttachmentMutation();
  const { data: companiesDropdownData } = useFetchCompaniesQuery(
    [{ name: "business", id: business?.id || "" }],
    {
      skip: !business?.id || !open,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: businessData } = useFetchBusinessesQuery([], {
    skip: !open,
    refetchOnMountOrArgChange: true,
  });
  const { data: branchesDropodwnData } = useFetchBranchesQuery(
    [{ name: "company", id: `${company?.id}-company` }],
    {
      skip: !company?.id,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: bookingSourcesData } = useFetchBookingSourcesQuery(
    {},
    {
      skip: !selectedServices?.length,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: bookingChannelsData } = useFetchBookingChannelsQuery(
    {},
    {
      skip: !selectedServices?.length,
      refetchOnMountOrArgChange: true,
    }
  );

  // const getCategories = async () => {
  //   const { data } = await fetchCategories(null);
  //   const temp = data?.data?.map((item: CategoryListProps) => {
  //     return { id: item?.category_id, name: item?.category_name };
  //   });
  //   setCategories(temp);
  // };
  const getAddresses = async (id: string) => {
    const { data } = await fetchAddresses(id);
    setAddresses(data!);
  };

  const getFamily = async (id: string) => {
    const { data } = await fetchFamily(id);
    setFamily(data!);
  };

  const getAttachments = async (id: string) => {
    const { data } = await fetchAttachments(id);
    setAttachments(data!);
  };

  const modifyQuantity = (id: string, qty: number) => {
    const index = selectedServices?.findIndex(
      (item) => parseInt(item.service_id) === parseInt(id)
    );

    if (index !== -1) {
      const newServices = [...selectedServices!];
      newServices[index!] = {
        ...newServices[index!],
        qty: qty ? qty : 1,
      };
      setSelectedServices(newServices);
    }
  };

  const removeSelectedService = (id: number) => {
    const filtered = selectedServices?.filter((_, index) => index !== id);
    setSelectedServices(filtered!);
  };

  const calculateBookingCost = (services: ServiceProps[]) => {
    const totals = services.reduce(
      (acc, service) => {
        const priceWithoutVAT =
          parseFloat(service.total || service?.price_without_vat || "0") *
          service.qty!;

        acc.subtotal += priceWithoutVAT;
        acc.total_vat = acc.subtotal * (5 / 100);

        return acc;
      },
      { subtotal: 0, total_vat: 0 }
    );

    const grand_total = totals.subtotal + totals.total_vat;

    return {
      subtotal: parseFloat(totals.subtotal.toFixed(2)),
      total_vat: parseFloat(totals.total_vat.toFixed(2)),
      grand_total: parseFloat(grand_total.toFixed(2)),
    };
  };

  // const calculateDiscount = () => {
  //   const bookingCost = calculateBookingCost(selectedServices!);
  //   console.log(bookingCost, "bookingCostbookingCost");
  //   if (isNaN(discount.value)) {
  //     return bookingCost.grand_total;
  //   }

  //   if (discount.type === "aed") {
  //     return bookingCost.grand_total - discount.value;
  //   } else {
  //     return (
  //       bookingCost.grand_total -
  //       bookingCost.grand_total * (discount.value / 100)
  //     );
  //   }
  // };

  const calculateVat = () => {
    const sub = calculateBookingCost(selectedServices!).subtotal;
    if (discount.type === "percent") {
      return ((sub - sub * (discount.value / 100)) * (5 / 100))?.toFixed(2);
    }
    return ((sub - discount.value) * (5 / 100))?.toFixed(2);
  };

  const calculateGrandTotal = () => {
    const sub = calculateBookingCost(selectedServices!).subtotal;
    if (discount.type === "percent") {
      return (
        Number(sub - sub * (discount.value / 100)) + Number(calculateVat())
      );
    }
    return Number(sub - discount.value) + Number(calculateVat());
  };

  const postBooking = async () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("customer_id", selectedUser!.customer_id);
    urlencoded.append("family_member_id", String(selectedFamily));
    urlencoded.append("address_id", String(address));
    urlencoded.append("booking_source_id", String(source?.id || ""));
    urlencoded.append("booking_channel_id", String(channel?.id || ""));
    urlencoded.append("company_id", String(company?.id || ""));
    urlencoded.append("branch_id", String(branch?.id || ""));
    urlencoded.append("partner_id", String(partner?.id || "0"));
    urlencoded.append("business_id", String(business?.id || ""));
    urlencoded.append("booking_platform_id", String(platform?.id || ""));
    urlencoded.append("firstname", selectedUser!.firstname);
    urlencoded.append("lastname", selectedUser!.lastname);
    urlencoded.append("phone", selectedUser!.phone);
    urlencoded.append(
      "schedule_date",
      dayjs(scheduleDate).format("YYYY-MM-DD")
    );
    urlencoded.append("schedule_slot", scheduleTime?.name || "");
    urlencoded.append("delivery_notes", deliveryNotes);
    urlencoded.append(
      "payment_method",
      payment === "cod"
        ? "Cash on Delivery"
        : payment === "online"
          ? "Online Payment"
          : payment === "already_paid"
            ? "Already Paid"
            : "Card on Delivery"
    );
    urlencoded.append("payment_method_code", payment);
    urlencoded.append("payment_status", "pending");
    urlencoded.append("split_payment_method", "0");
    urlencoded.append("split_payment_method_code", "0");
    urlencoded.append(
      "sub_total",
      `${calculateBookingCost(selectedServices!).subtotal}`
    );
    urlencoded.append("discount_value", `${discount.value || "0.00"}`);
    urlencoded.append(
      "discount_type",
      `${discount.type === "percent" ? discount.type : "fixed"}`
    );
    if (discount.type === "aed") {
      urlencoded.append("discount", `${discount.value || "0.00"}`);
    } else {
      const total = calculateBookingCost(selectedServices!).grand_total;
      urlencoded.append(
        "discount",
        `${total - Math.round(total - total * (discount.value / 100)) || "0.00"}`
      );
    }
    urlencoded.append(
      "vat_value",
      calculateVat()
      // `${calculateBookingCost(selectedServices!).total_vat}`
    );
    urlencoded.append("total", calculateGrandTotal()?.toFixed(2));
    const services = selectedServices?.map((item) => {
      const price = item.price_without_vat || item.price;
      const disc =
        item.discount_type === "aed"
          ? item.discount_value
          : Number(price) -
            Math.round(
              Number(price) -
                Number(price) * (Number(item.discount_value) / 100)
            );
      return {
        service_id: item.service_id,
        qty: item.qty,
        price: price,
        discount: disc || "0.00",
        discount_value: item.discount_value || "0.00",
        discount_type:
          item.discount_type === "percent" ? item.discount_type : "fixed",
        total: price ? Number(price) * item.qty! : "0.00",
        new_price: item.new_price || "0.00",
      };
    });
    urlencoded.append("services", JSON.stringify(services));
    urlencoded.append("user_id", `${user!.id}`);
    try {
      const data = await createBooking(urlencoded);
      if (data.error) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="error"
            title="Error"
            message="Something went Wrong!"
          />
        ));
      } else {
        toast.custom((t) => (
          <CustomToast
            t={t}
            type="success"
            title="Success"
            message="Successfully Created Booking!"
          />
        ));
        setOpen(false);
        setDeliveryNotes("");
        setAddress(null);
        setScheduleTime(null);
        setScheduleDate(new Date());
        setSelectedServices([]);
        setSelectedFamily(null);
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Error"
          message="Something went Wrong!"
        />
      ));
    }
  };

  const handleSelectFamily = (id: number) => {
    if (id === selectedFamily) {
      setSelectedFamily(null);
    } else {
      setSelectedFamily(id);
    }
  };

  const handleAddAddress = () => {
    setOpenAddressModal(!openAddressModal);
    setEditableAddressId(null);
  };

  const handleFamilymembers = () => {
    setOpenFamilyMemberModal(!openFamilyMemberModal);
    setEditableFamilyMember(null);
  };

  const handleMedicalDetails = () => {
    setOpenMedicalDetailsModal(!openMedicalDetailsModal);
  };

  const handleSetDate = (date: any) => {
    setDate(date);
  };

  const handleEditService = (id: string) => {
    setOpenEditServiceModal(true);
    setSelectedServiceModal(id);
  };

  const handleSetSelectedService = (discount: DiscountType) => {
    if (selectedServices?.length) {
      const temp = selectedServices?.map((service) =>
        service.service_id === selectedService
          ? {
              ...service,
              discount: String(discount.total),
              total: String(discount.total),
              discount_value: String(discount.value),
              new_price: String(discount.newPrice),
              discount_type: discount.type,
            }
          : service
      );
      setSelectedServices(temp);
    }
  };

  // const handleSelectCategoty = (value: ListOptionProps) => {
  //   setCategory(value);
  //   if (value?.name) {
  //     const filteredBookings = bookingsData?.filter((booking) =>
  //       booking?.categories?.some((cat) => cat.code === value.name)
  //     );
  //     setBookingsData(filteredBookings);
  //   } else {
  //     if (data) {
  //       setBookingsData(data);
  //     }
  //   }
  // };

  const handleSelectProfession = (value: ListOptionProps) => {
    setProfession(value);
    if (value?.name) {
      const filteredBookings = bookingsData?.filter((booking: any) =>
        booking?.consultation_team?.some((cat: any) => cat.is_lead === "1")
      );
      setBookingsData(filteredBookings);
    } else {
      if (data) {
        setBookingsData(data);
      }
    }
  };

  const handleEditClick = (address: AddressProps) => {
    setEditMode(true);
    setEditableAddressId(address);
    setOpenAddressModal(true);
  };

  const handleEditFamilymemberClick = (member: FamilyProps) => {
    setEditMode(true);
    setEditableFamilyMember(member);
    setOpenFamilyMemberModal(true);
  };

  const handleEditClientClick = () => {
    setEditMode(true);
    setOpenCustomerModal(true);
  };

  const handleOpenAttachment = (url: string) => {
    window.open(`https://crm.fandcproperties.ru${url}`, "_blank");
  };

  const handleSelectUser = () => {
    setSelectedServices([]);
  };

  const incrementDate = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    const newDate = dayjs(date || new Date())
      .add(1, "day")
      .toDate();
    handleSetDate(newDate);
  };

  const decrementDate = (e: React.MouseEvent<SVGAElement>) => {
    e.stopPropagation();
    const newDate = dayjs(date || new Date())
      .subtract(1, "day")
      .toDate();
    handleSetDate(newDate);
  };

  const handleDeleteAttachment = async () => {
    try {
      if (deleteBookingAttachment) {
        const formData = new FormData();
        formData.append("file_name", deleteBookingAttachment?.file_name);
        formData.append("file_type", deleteBookingAttachment?.file_type);
        formData.append(
          "attachment_id",
          deleteBookingAttachment?.attachment_id
        );
        const response = await deleteAttachment(formData);
        if (response?.error) {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="error"
              title="Error"
              message={`Something Went Wrong!`}
            />
          ));
        } else {
          toast.custom((t) => (
            <CustomToast
              t={t}
              type="success"
              title="Success"
              message={`Attachment Deleted Successfully!`}
            />
          ));
          getAttachments(deleteBookingAttachment?.customer_id || "");
          setOpenDeleteAttachmentModal(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (bookingsData && open) {
      const view = createTimelineView(bookingsData?.bookings || []);
      setTimeline(view);
    }
  }, [bookingsData, open]);

  useEffect(() => {
    if (data) {
      console.log(data, "data");
      setBookingsData(data);
    }
  }, [data]);

  useEffect(() => {
    if (selectedUser && open) {
      getFamily(selectedUser?.customer_id);
      getAddresses(selectedUser?.customer_id);
      getAttachments(selectedUser?.customer_id);
    }
  }, [selectedUser, open]);

  useEffect(() => {
    if (!selectedService?.length) {
      setDiscount({
        type: "aed",
        value: 0,
      });
    }
  }, [selectedService]);
  // useEffect(() => {
  //   getCategories();
  // }, []);

  useEffect(() => {
    if (professions?.data?.doctors?.length) {
      const data = professions?.data?.doctors?.map((item: EmployeeProps) => {
        return { id: item?.user_id, name: item?.position };
      });
      setProfesionsData(data);
    }
  }, [professions]);

  useEffect(() => {
    if (bookingDetailData?.booking_id && open) {
      setSelectedUser({
        customer_id: bookingDetailData?.customer?.id || "",
        branch_id: bookingDetailData?.branch_id || "",
        partner_id: bookingDetailData?.partner_id || "",
        firstname: bookingDetailData?.customer?.firstname || "",
        lastname: bookingDetailData?.customer?.lastname || "",
        phone: bookingDetailData?.customer?.phone || "",
        email: bookingDetailData?.customer?.email || "",
        date_of_birth: bookingDetailData?.customer?.date_of_birth || "",
        gender: bookingDetailData?.customer?.gender || "",
        nationality: bookingDetailData?.customer?.nationality || "",
        is_allergy: bookingDetailData?.customer?.is_allergy || "",
        allergy_description:
          bookingDetailData?.customer?.allergy_description || "",
        is_medication: bookingDetailData?.customer?.is_medication || "",
        medication_description:
          bookingDetailData?.customer?.medication_description || "",
        is_medical_conition:
          bookingDetailData?.customer?.is_medical_conition || "",
        medical_condition_description:
          bookingDetailData?.customer?.medical_condition_description || "",
        special_notes: bookingDetailData?.customer?.special_notes || "",
        active: bookingDetailData?.status,
      });
      const temp: ServiceProps[] = bookingDetailData?.services?.map((item) => {
        return {
          service_id: item?.service_id,
          service_name: item?.service_name,
          qty: Number(item?.quantity),
          discount: item?.discount,
          discount_value: item?.discount_value,
          discount_type: item?.discount_type,
          total: item?.total,
          new_price: item?.new_price,
          price: item?.price,
        };
      });
      setSelectedServices(temp);
      setDiscount({
        type: bookingDetailData?.discount_type === "fixed" ? "aed" : "percent",
        value: Number(bookingDetailData?.discount_value),
      });
      setDeliveryNotes(bookingDetailData?.delivery_notes);
      setScheduleDate(bookingDetailData?.schedule_date);
      setScheduleTime({
        id: bookingDetailData?.schedule_slot,
        name: bookingDetailData?.schedule_slot,
      });
      setPayment(bookingDetailData?.payment_method_code);
      setAddress(Number(bookingDetailData?.address_id));
      setAttachments(bookingDetailData?.attachments);
      setPartner({
        id: bookingDetailData?.partner_id,
        name: bookingDetailData?.partner,
      });
      setBusiness({
        id: bookingDetailData?.business_id,
        name: bookingDetailData?.business,
      });
      setBranch({
        id: bookingDetailData?.branch_id,
        name: bookingDetailData?.branch,
      });
      setChannel({
        id: bookingDetailData?.booking_channel_id,
        name: bookingDetailData?.booking_channel,
      });
      setPlatform({
        id: bookingDetailData?.booking_platform_id,
        name: bookingDetailData?.booking_platform,
      });
      setSource({
        id: bookingDetailData?.booking_source_id,
        name: bookingDetailData?.booking_source,
      });
      setCompany({
        id: bookingDetailData?.company_id,
        name: bookingDetailData?.company,
      });
    }
  }, [bookingDetailData, open]);

  useEffect(() => {
    if (!open) {
      setSelectedUser(null);
      setSelectedServices(null);
      setEditMode(false);
      setTimeline(null);
    }
  }, [open]);

  useEffect(() => {
    if (selectedUser) {
      setToggleSearch(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!business) {
      setCompany(null);
    }
  }, [business]);

  const now = dayjs();
  const selectedDay = dayjs(scheduleDate);
  const isToday = selectedDay.isSame(now, "day");

  // Add 30-minute buffer
  const bufferTime = now.add(30, "minute");

  const filteredTimeSlots = isToday
    ? timeSlots.filter((slot) => {
        const [start] = slot.id.split("-");
        const slotTime = dayjs(`${selectedDay.format("YYYY-MM-DD")}T${start}`);
        return slotTime.isAfter(bufferTime);
      })
    : timeSlots;

  useEffect(() => {
    const currentSlot = filteredTimeSlots.find(
      (slot) => slot.id === scheduleTime?.id
    );
    if (!currentSlot) {
      setScheduleTime(null); // or default to first available
    }
  }, [scheduleDate]);
console.log(partner?.id, orderId, 'orderIdorderId')
  return (
    <>
      <BookingHistoryModal
        selectedUser={selectedUser}
        open={history}
        setOpen={setHistory}
        handleRowClick={(id) => {
          setHistory(false);
          setID?.(id || "");
          setUpdate?.(true);
          setOpen(false);
        }}
      />
      <Modal
        open={open}
        setOpen={setOpen}
        className="h-[95%] w-full max-w-[95%]"
      >
        <div className="grid w-full grid-cols-3 divide-x overflow-hidden rounded-lg bg-gray-100">
          <div className="col-span-1 flex h-full flex-col overflow-auto border-r">
            <div className="flex h-[70px] w-full items-center justify-between border-b bg-white px-2.5">
              <p className="mr-3 rounded-md bg-primary px-2.5 py-1 text-white lg:text-sm xl:text-base">
                {dayNames[new Date(date || new Date()).getDay()]}
              </p>
              <CustomDatePicker
                date={date || new Date()}
                setDate={handleSetDate}
                toggleButton={
                  <div className="flex h-12 w-full items-center text-sm text-gray-500 lg:gap-1 xl:gap-4 xl:text-base">
                    <FaChevronLeft
                      className="cursor-pointer"
                      onClick={decrementDate}
                    />
                    {dayjs(date || new Date()).format("DD MMM YYYY")}
                    <FaChevronRight
                      className="cursor-pointer"
                      onClick={incrementDate}
                    />
                  </div>
                }
              />
              <CustomButton
                name="Today"
                handleClick={() => handleSetDate(new Date())}
                style="bg-white border border-grey50 text-black px-4 xl:px-6"
              />
            </div>
            <div className="grid w-full grid-cols-2 items-center justify-center gap-2.5 border-b px-2.5 py-2.5">
              {/* <Combobox
                value={category}
                options={categories}
                isFilter={true}
                placeholder="Category"
                handleSelect={handleSelectCategoty}
                searchInputPlaceholder="Search..."
                searchInputClassName="p-1.5 text-xs"
                defaultSelectedIconClassName="size-4"
                icon={<TiArrowSortedDown className="size-5" />}
                toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
                listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              /> */}
              <Combobox
                options={profesionsData}
                value={profession}
                isFilter={true}
                placeholder="Professional"
                handleSelect={handleSelectProfession}
                searchInputPlaceholder="Search..."
                searchInputClassName="p-1.5 text-xs"
                defaultSelectedIconClassName="size-4"
                icon={<TiArrowSortedDown className="size-5" />}
                toggleClassName="w-full p-3 rounded-lg text-xs bg-white"
                listClassName="w-full top-[50px] max-h-52 border rounded-lg z-20 bg-white"
                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
              />
            </div>
            {timeline ? (
              <div className="no-scrollbar flex h-full w-full flex-col items-start justify-start overflow-auto">
                {Object.entries(timeline).map(([hour, bookings], idx) => (
                  <div
                    key={idx}
                    className="grid h-[85px] w-full grid-cols-12 gap-1.5 border-y p-1.5 text-gray-500"
                  >
                    <div className="col-span-2 flex w-full items-start justify-start border-r-2">
                      <p className="w-full text-center">{hour}</p>
                    </div>
                    <div className="col-span-10 w-full text-gray-500">
                      <Bookings
                        bookings={bookings}
                        setUpdate={setUpdate}
                        setID={setID}
                        setOpen={setOpen}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="col-span-2 grid h-full w-full grid-cols-2 gap-x-2.5">
            <div className="col-span-2 flex h-[58px] w-full items-center justify-between bg-primary px-2.5 text-white">
              <p className="ml-5 w-full text-left text-lg font-semibold">
                {selectedBooking ? "Update" : "New"} Booking{" "}
                {selectedBooking && `Ref #: ${selectedBooking}`}
              </p>
              <button type="button" onClick={() => setOpen(false)}>
                <IoClose className="size-8" />
              </button>
            </div>
            <div
              className={`no-scrollbar col-span-1 flex h-screen w-full flex-col items-start justify-start gap-2.5 overflow-auto py-2.5 pb-32 pl-2.5`}
            >
              <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                <div
                  className={cn(
                    "flex w-full items-center justify-between border-b pb-2",
                    toggleSearch && "mb-2.5"
                  )}
                >
                  <h1 className="text-left font-semibold text-primary">
                    Customer Details
                  </h1>
                  <div className="flex items-center gap-2">
                    {!selectedUser && !editMode && (
                      <CustomButton
                        name="Add New"
                        handleClick={() => setOpenCustomerModal(true)}
                        style="px-4"
                      />
                    )}
                    {selectedUser && (
                      <div className="py-2">
                        <FaSearch
                          onClick={() => setToggleSearch(!toggleSearch)}
                          className="h-5 w-5 cursor-pointer text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {toggleSearch && (
                  <AutoComplete
                    handleSelectUser={handleSelectUser}
                    setSelectedUser={setSelectedUser}
                  />
                )}
                {selectedUser && (
                  <div
                    className={cn(
                      "justify-betweeen mt-5 flex w-full items-start rounded-lg bg-white",
                      !toggleSearch && "mt-3"
                    )}
                  >
                    <div className="grid w-full grid-cols-12 xl:gap-8">
                      <div className="col-span-7 flex w-full items-center gap-3">
                        <img
                          alt="profile"
                          className="size-14 rounded-full"
                          src={
                            selectedUser?.image ||
                            "https://ui.shadcn.com/avatars/04.png"
                          }
                        />
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <span className="w-full text-left text-xs text-gray-500">
                            {selectedUser.firstname}&nbsp;
                            {selectedUser.lastname}
                          </span>
                          <span className="w-full text-left text-xs text-gray-500">
                            {selectedUser.phone}
                          </span>
                          <span className="w-full text-left text-xs text-gray-500 lg:max-w-20 lg:truncate xl:max-w-max">
                            {selectedUser.email}
                          </span>
                        </div>
                      </div>
                      <div className="col-span-5 flex w-full flex-col items-center justify-between pl-2.5">
                        <span className="w-full text-left text-xs text-gray-500">
                          {dayjs(selectedUser.date_of_birth).format(
                            "DD MMM, YYYY"
                          )}
                        </span>
                        <span className="w-full text-left text-xs text-gray-500">
                          {selectedUser.gender}
                        </span>
                        <span className="w-full text-left text-xs text-gray-500">
                          {selectedUser.nationality
                            ? selectedUser.nationality
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    <FaRegEdit
                      onClick={handleEditClientClick}
                      className="h-5 w-5 cursor-pointer text-gray-500"
                    />
                  </div>
                )}
              </div>
              {selectedUser && (
                <>
                  <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white px-2.5 pb-2.5 pt-0.5">
                    <div className="flex w-full items-center justify-between border-b py-2.5">
                      <h1 className="text-left font-semibold text-primary">
                        Address Details
                      </h1>
                      <FiPlus
                        onClick={handleAddAddress}
                        className="h-5 w-5 cursor-pointer text-gray-500"
                      />
                    </div>
                    <div className="mb-1.5 mt-4 grid w-full grid-cols-2 gap-2.5 text-gray-500">
                      {addresses && addresses?.length !== 0 ? (
                        addresses?.map((address) => (
                          <div
                            key={address.address_id}
                            className="col-span-1 flex w-full flex-col items-center justify-between space-y-1.5 rounded-lg border border-gray-200 bg-gray-100 p-2.5"
                          >
                            <div className="flex w-full items-center justify-between">
                              <span className="truncate font-bold capitalize text-primary">
                                {address.address_type}
                              </span>
                              <div className="flex items-center justify-end space-x-2.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    copyToClipboard(`${address.apartment}, ${address.building_no}
                            , ${address.street}, ${address.extra_direction}`)
                                  }
                                >
                                  <GoShareAndroid />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditClick(address)}
                                >
                                  <FaRegEdit />
                                </button>
                              </div>
                            </div>
                            <span className="w-full overflow-hidden truncate text-left text-xs">
                              {address.apartment},&nbsp;{address.building_no}
                              ,&nbsp;
                              {address.street},&nbsp;{address.extra_direction}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="col-span-2 w-full text-center text-xs text-gray-500">
                          No Addresses Found!
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                    <div className="flex w-full items-center justify-between border-b pb-3">
                      <h1 className="text-left font-semibold text-primary">
                        Medical Details
                      </h1>
                      <FaRegEdit
                        onClick={handleMedicalDetails}
                        className="h-5 w-5 cursor-pointer text-gray-500"
                      />
                    </div>
                    {selectedUser.is_allergy === "0" &&
                      selectedUser.is_medication === "0" &&
                      selectedUser.is_medical_conition === "0" && (
                        <p className="mt-2 text-center text-xs text-gray-500">
                          No Medical Details Found!
                        </p>
                      )}
                    {selectedUser.is_allergy !== "0" && (
                      <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5">
                        <span className="text-xs text-primary">Allergies:</span>
                        {selectedUser.allergy_description
                          .split(",")
                          .map((allergy, idx) => (
                            <span
                              key={idx}
                              className="rounded-full bg-red-200 px-2 text-xs text-red-500"
                            >
                              {allergy}
                            </span>
                          ))}
                      </div>
                    )}
                    {selectedUser.is_medication !== "0" && (
                      <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5 text-xs text-gray-500">
                        <span className="text-primary">Medications:</span>
                        <span>
                          {selectedUser?.medication_description
                            .split(",")
                            .join(", ")}
                        </span>
                      </div>
                    )}
                    {selectedUser.is_medical_conition !== "0" && (
                      <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5 text-xs text-gray-500">
                        <span className="text-primary">
                          Medical Conditions:
                        </span>
                        <span>
                          {selectedUser.medical_condition_description
                            .split(",")
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                    <div className="flex w-full items-center justify-between border-b pb-3">
                      <h1 className="text-left font-semibold text-primary">
                        Family Members
                      </h1>
                      <FiPlus
                        className="h-5 w-5 cursor-pointer text-gray-500"
                        onClick={handleFamilymembers}
                      />
                    </div>
                    <div className="w-full overflow-auto">
                      <div className="grid w-full grid-cols-5 gap-2.5 bg-gray-100 p-2.5 text-xs text-primary">
                        <div className="col-span-1 w-full">Name</div>
                        <div className="col-span-1 w-full">DOB</div>
                        <div className="col-span-1 w-full">Gender</div>
                        <div className="col-span-1 w-full">Relation</div>
                        <div className="col-span-1 w-full">Actions</div>
                      </div>
                      {family?.length ? (
                        family?.map((member, idx) => (
                          <div
                            key={member.family_member_id}
                            className={cn(
                              "grid w-full grid-cols-5 gap-2.5 bg-gray-100 p-2.5 text-xs text-gray-500",
                              {
                                "bg-white": member.family_member_id % 2 !== 0,
                                "border-b": idx === family.length - 1,
                              }
                            )}
                          >
                            <div className="col-span-1 w-full overflow-hidden truncate">
                              {member.firstname}&nbsp;{member.lastname}
                            </div>
                            <div className="col-span-1 w-full overflow-hidden truncate">
                              {dayjs(member.date_of_birth).format("DD-MM-YYYY")}
                            </div>
                            <div className="col-span-1 w-full capitalize">
                              {member.gender === "undefined"
                                ? "N/A"
                                : member.gender}
                            </div>
                            <div className="col-span-1 w-full">
                              {member.relationship === "undefined"
                                ? "N/A"
                                : member.relationship}
                            </div>
                            <div className="col-span-1 flex w-full items-center justify-between gap-1.5">
                              <button
                                onClick={() =>
                                  handleSelectFamily(member?.family_member_id)
                                }
                                className={`rounded-md px-2 py-0.5 text-[10px] text-white ${selectedFamily === member?.family_member_id ? "bg-red-500" : "bg-primary"}`}
                              >
                                {selectedFamily === member?.family_member_id
                                  ? "Remove"
                                  : "Book"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditFamilymemberClick(member)
                                }
                              >
                                <FaRegEdit className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="mt-2 text-center text-xs text-gray-500">
                          No Family Members Found!
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                    <div className="flex w-full items-center justify-between border-b pb-3">
                      <h1 className="text-left font-semibold text-primary">
                        Attachments
                      </h1>
                      <FiPlus
                        onClick={() => setOpenUploadAttachment(true)}
                        className="h-5 w-5 cursor-pointer text-gray-500"
                      />
                    </div>
                    {attachments && attachments?.length !== 0 ? (
                      attachments?.map((attachment) => (
                        <div
                          key={attachment.attachment_id}
                          className="flex w-full items-center justify-between pt-2.5"
                        >
                          <div className="flex items-center justify-center space-x-3">
                            <IoDocumentOutline className="h-12 w-12 text-primary" />
                            <div className="flex w-full flex-col items-center justify-center">
                              <span className="w-full text-left text-sm text-gray-500">
                                {attachment.file_type}
                              </span>
                              <span className="w-full text-left text-xs text-gray-400">
                                {selectedUser.firstname}&nbsp;
                                {selectedUser.lastname}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {dayjs(attachment.created_at).format("DD MMM YYYY")}
                          </span>
                          <div className="flex items-center justify-end space-x-3 text-gray-500">
                            <FiDownload
                              onClick={() =>
                                handleOpenAttachment(attachment?.file_name)
                              }
                              className="h-6 w-6 cursor-pointer"
                            />
                            <FaRegTrashAlt
                              onClick={() => {
                                setOpenDeleteAttachmentModal(true);
                                setDeleteAttachment(attachment);
                              }}
                              className="h-6 w-6 cursor-pointer"
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="mt-2 text-center text-xs text-gray-500">
                        No Attachments Found!
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="no-scrollbar col-span-1 flex max-h-[calc(100vh-100px)] w-full flex-col items-start justify-start gap-2.5 overflow-auto py-2.5 pr-2.5">
              <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                <div className="flex w-full items-center justify-between border-b pb-2.5">
                  <h1 className="text-left font-semibold text-primary">
                    Services List
                  </h1>
                  {!selectedUser && <div className="h-8" />}
                  {selectedUser && (
                    <button
                      onClick={() => setHistory(true)}
                      className="rounded-md bg-primary px-4 py-2.5 text-xs text-white"
                    >
                      Booking History
                    </button>
                  )}
                </div>
                <div className="relative w-full">
                  <ServiceAutoComplete
                    selectedServices={selectedServices}
                    setSelectedServices={setSelectedServices}
                    isCustomerSelected={!!selectedUser?.customer_id}
                    open={open}
                  />
                </div>
                {selectedServices?.length ? (
                  <>
                    <div className="grid w-full grid-cols-9 gap-2.5 p-2.5 text-xs text-primary">
                      <div className="col-span-1 w-full" />
                      <div className="col-span-1 w-full">Code</div>
                      <div className="col-span-2 w-full">Service</div>
                      <div className="col-span-2 w-full">Amount</div>
                      <div className="col-span-1 w-full text-center">Qty.</div>
                      <div className="col-span-1 w-full text-right">Total</div>
                      <div className="col-span-1 w-full text-right"></div>
                    </div>
                    {selectedServices?.map((service, idx) => (
                      <div
                        key={service.service_id}
                        className={cn(
                          "grid w-full grid-cols-9 gap-2.5 p-2.5 text-xs text-gray-500",
                          {
                            "bg-white": idx % 2 !== 0,
                            "bg-gray-100": idx % 2 === 0,
                          }
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => removeSelectedService(idx)}
                        >
                          <IoClose className="h-5 w-5" />
                        </button>
                        <div className="col-span-1 flex w-full items-center justify-start">
                          {service.category_code}
                        </div>
                        <div className="col-span-2 flex w-full items-center justify-start">
                          <p className="w-full overflow-hidden truncate text-left">
                            {service.service_name}
                          </p>
                        </div>
                        <div className="col-span-2 flex w-full items-center justify-start">
                          {/* AED&nbsp; */}
                          {service.price_without_vat || service?.price}
                        </div>
                        <input
                          type="text"
                          placeholder={`${service.qty}`}
                          onChange={(e) =>
                            modifyQuantity(
                              service.service_id,
                              parseInt(e.target.value)
                            )
                          }
                          className="col-span-1 w-full bg-transparent text-center"
                        />
                        <div className="col-span-1 flex w-full items-center justify-end">
                          {/* {service?.qty
                            ? Math.round(parseFloat(service?.price || "0") * parseFloat(service?.qty))
                            : Math.round(
                              parseFloat(service?.price || "0")
                              )} */}
                          {service?.qty
                            ? Math.round(
                                parseFloat(
                                  service.total || service.price || "0"
                                ) * parseFloat(String(service!.qty))
                              )
                            : Math.round(
                                parseFloat(
                                  service.total || service.price || "0"
                                )
                              )}
                        </div>
                        <div
                          onClick={() => handleEditService(service?.service_id)}
                          className="col-span-1 flex w-full cursor-pointer items-center justify-end"
                        >
                          <FaRegEdit />
                        </div>
                      </div>
                    ))}
                    <div className="flex w-full flex-col items-center justify-center space-y-2.5 pt-2.5">
                      <div className="flex w-full items-center justify-end space-x-40 pr-5 text-xs text-gray-500">
                        <p>Subtotal</p>
                        <p>
                          {calculateBookingCost(
                            selectedServices!
                          ).subtotal?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex w-full items-center justify-end space-x-[40px] text-xs text-gray-500">
                        <p>Discount</p>
                        <div className="flex h-[38px] items-center justify-center space-x-2.5 overflow-hidden rounded-lg border p-2.5">
                          <div
                            onClick={() =>
                              setDiscount({ ...discount, type: "aed" })
                            }
                            className="size-3 cursor-pointer rounded-full border border-gray-400 p-px"
                          >
                            <div
                              className={cn("size-full rounded-full", {
                                "bg-gray-500": discount.type === "aed",
                              })}
                            />
                          </div>
                          <span>AED</span>
                          <div
                            onClick={() =>
                              setDiscount({ ...discount, type: "percent" })
                            }
                            className="size-3 cursor-pointer rounded-full border border-gray-400 p-px"
                          >
                            <div
                              className={cn("size-full rounded-full", {
                                "bg-gray-500": discount.type === "percent",
                              })}
                            />
                          </div>
                          <span>%</span>
                          <input
                            type="text"
                            placeholder="0.00"
                            value={discount.value}
                            onChange={(e) =>
                              setDiscount({
                                ...discount,
                                value: parseInt(e.target.value || "0"),
                              })
                            }
                            className="w-10 border-l-2 pl-2.5"
                          />
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-end space-x-[160px] pr-2.5 text-xs text-gray-500">
                        <p>VAT</p>
                        <p>{calculateVat()}</p>
                      </div>
                      <div className="w-72 place-self-end border border-[#EFEFEF]" />
                      <div className="flex w-full items-center justify-end space-x-[105px] pr-2.5 font-bold text-gray-500">
                        <p>Grand Total</p>
                        <p>
                          AED&nbsp;
                          {/* {calculateDiscount()?.toFixed(2)} */}
                          {calculateGrandTotal()?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
              {selectedServices?.length ? (
                <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                  <div className="flex w-full flex-col items-center justify-center space-y-2.5 border-b pb-2.5 pt-2.5 text-gray-500">
                    <h1 className="w-full text-left font-semibold text-primary">
                      Booking Instructions
                    </h1>
                    <textarea
                      rows={3}
                      value={deliveryNotes}
                      placeholder="Notes..."
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      className="w-full rounded-lg bg-gray-100 p-3 text-xs text-grey100 placeholder:italic"
                    />
                  </div>
                  <div className="flex w-full flex-col items-center justify-center space-y-2.5 border-b pb-2.5 pt-2.5 text-gray-500">
                    <h1 className="w-full text-left font-semibold text-primary">
                      Source Details
                    </h1>
                    <div className="grid w-full grid-cols-2 gap-2.5">
                      <Combobox
                        value={platform}
                        options={bookingPlatformsData}
                        handleSelect={(value) => setPlatform(value)}
                        label="Select Platform"
                        placeholder="Select Platform"
                        mainClassName="w-full"
                        toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                        listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={
                          <RiArrowDownSLine className="h-5 w-5 text-grey100" />
                        }
                        isSearch={false}
                        isRemoveAllow={true}
                      />
                      <Combobox
                        value={source}
                        options={bookingSourcesData}
                        handleSelect={(value) => setSource(value)}
                        label="Select Source"
                        placeholder="Select Source"
                        mainClassName="w-full"
                        toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                        listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={
                          <RiArrowDownSLine className="h-5 w-5 text-grey100" />
                        }
                        isSearch={false}
                        isRemoveAllow={true}
                      />
                      <Combobox
                        value={channel}
                        options={bookingChannelsData}
                        handleSelect={(value) => setChannel(value)}
                        label="Select Channel"
                        placeholder="Select Channel"
                        mainClassName="w-full"
                        toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                        listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={
                          <RiArrowDownSLine className="h-5 w-5 text-grey100" />
                        }
                        isSearch={false}
                        isRemoveAllow={true}
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center space-y-2.5 border-b pb-2.5 pt-2.5 text-gray-500">
                    <h1 className="w-full text-left font-semibold text-primary">
                      Company Details
                    </h1>
                    <div className="grid w-full grid-cols-2 gap-2.5">
                      <Combobox
                        value={business}
                        options={businessData?.map((item) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                        handleSelect={(value) => setBusiness(value)}
                        label="Select Business"
                        placeholder="Select Business"
                        mainClassName="w-full"
                        toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                        listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={
                          <RiArrowDownSLine className="h-5 w-5 text-grey100" />
                        }
                        isSearch={false}
                        isRemoveAllow={true}
                      />
                      <Combobox
                        value={company}
                        options={companiesDropdownData?.map((item) => ({
                          id: item.id,
                          name: item.name,
                        }))}
                        handleSelect={(value) => {
                          setCompany(value);
                          setPartner(null);
                          setBranch(null);
                        }}
                        label="Select Company"
                        placeholder="Select Company"
                        mainClassName="w-full"
                        toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                        listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={
                          <RiArrowDownSLine className="h-5 w-5 text-grey100" />
                        }
                        isSearch={false}
                        disabled={!business?.id}
                        isRemoveAllow={!!business?.id}
                      />
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2.5">
                      <Combobox
                        value={branch}
                        options={branchesDropodwnData?.map((item) => ({
                          id: item.branch_id,
                          name: item.name,
                        }))}
                        handleSelect={(value) => setBranch(value)}
                        label="Select Branch"
                        placeholder="Select Branch"
                        mainClassName="w-full"
                        toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                        listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={
                          <RiArrowDownSLine className="h-5 w-5 text-grey100" />
                        }
                        isSearch={false}
                        disabled={!company?.id}
                        isRemoveAllow={true}
                      />
                      <Combobox
                        value={partner}
                        options={bookingPartnersData}
                        handleSelect={(value) => setPartner(value)}
                        label="Select Partner"
                        placeholder="Select Partner"
                        mainClassName="w-full"
                        toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                        listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={
                          <RiArrowDownSLine className="h-5 w-5 text-grey100" />
                        }
                        isSearch={false}
                        disabled={!company?.id}
                        isRemoveAllow={true}
                      />
                    </div>
                    {partner?.id && (
                      <div className="flex w-full justify-end">
                        <div className="flex w-1/2 flex-col items-center justify-center space-y-1">
                          <label className="w-full text-left text-xs font-medium text-grey100">
                            Order ID
                          </label>
                          <input
                            value={orderId}
                            onChange={(e: any) => setOrderId(e.target.value)}
                            placeholder="Enter Order ID"
                            className="flex w-full items-center justify-between rounded-lg bg-grey px-3.5 py-3 text-xs text-gray-500 placeholder:capitalize"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex w-full flex-col items-center justify-center space-y-2.5 border-b pb-2.5 pt-2.5 text-gray-500">
                    <h1 className="w-full text-left font-semibold text-primary">
                      Select Date & Time
                    </h1>
                    <div className="grid w-full grid-cols-2 gap-2.5">
                      <div className="-mt-1.5">
                        <label className="mb-0.5 w-full text-left text-xs font-medium text-grey100">
                          Select Date
                        </label>
                        <CustomDatePicker
                          date={scheduleDate}
                          setDate={setScheduleDate}
                          toggleClassName="-right-20"
                          toggleButton={
                            <div className="flex w-full items-center justify-between rounded-lg bg-gray-100 p-2 text-xs font-medium">
                              <p>{dayjs(scheduleDate).format("DD MMM YYYY")}</p>
                              <div>
                                <IoCalendarOutline className="h-5 w-5 text-grey100" />
                              </div>
                            </div>
                          }
                        />
                      </div>
                      <Combobox
                        value={scheduleTime}
                        options={filteredTimeSlots}
                        handleSelect={(value) => setScheduleTime(value)}
                        label="Select Time"
                        placeholder="Select Time"
                        mainClassName="w-full"
                        toggleClassName="w-full py-2 px-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                        listClassName="w-full top-[56px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={
                          <RiArrowDownSLine className="h-5 w-5 text-grey100" />
                        }
                        isSearch={false}
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center space-y-2.5 border-b pb-2.5 pt-2.5 text-gray-500">
                    <div className="flex w-full items-center justify-between">
                      <h1 className="text-left font-semibold text-primary">
                        Select Address
                      </h1>
                    </div>
                    <div className="mt-2.5 grid w-full grid-cols-2 gap-2.5 text-gray-500">
                      {addresses?.length !== 0 &&
                        addresses?.map((a) => (
                          <div
                            key={a.address_id}
                            onClick={() => setAddress(parseInt(a.address_id))}
                            className={cn(
                              "col-span-1 flex w-full cursor-pointer flex-col items-center justify-between space-y-1.5 rounded-lg border border-gray-200 bg-gray-100 p-2.5",
                              {
                                "border-primary":
                                  address === parseInt(a.address_id),
                              }
                            )}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span className="font-bold capitalize text-primary">
                                {a.address_type}
                              </span>
                            </div>
                            <span className="w-full overflow-hidden truncate text-left text-xs">
                              {a.apartment},&nbsp;{a.building_no}
                              ,&nbsp;
                              {a.street},&nbsp;{a.extra_direction}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center space-y-2.5 border-b pb-2.5 pt-2.5 text-gray-500">
                    <h1 className="w-full text-left font-semibold text-primary">
                      Select Payment Method
                    </h1>
                    <div className="mt-2.5 grid w-full grid-cols-2 gap-2.5 text-gray-500">
                      <div
                        onClick={() => setPayment("cod")}
                        className={cn(
                          "col-span-1 w-full cursor-pointer rounded-md border bg-gray-100 p-2.5",
                          {
                            "border-primary text-primary": payment === "cod",
                          }
                        )}
                      >
                        <p className="w-full text-center text-xs">
                          Cash on Delivery
                        </p>
                      </div>
                      <div
                        onClick={() => setPayment("cdd")}
                        className={cn(
                          "col-span-1 w-full cursor-pointer rounded-md border bg-gray-100 p-2.5",
                          {
                            "border-primary text-primary": payment === "cdd",
                          }
                        )}
                      >
                        <p className="w-full text-center text-xs">
                          Card on Delivery
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full justify-start gap-2.5">
                      <div
                        onClick={() => setPayment("online")}
                        className={cn(
                          "col-span-1 w-1/2 cursor-pointer rounded-md border bg-gray-100 p-2.5",
                          {
                            "border-primary text-primary": payment === "online",
                          }
                        )}
                      >
                        <p className="w-full text-center text-xs">
                          Online Payment
                        </p>
                      </div>
                      <div
                        onClick={() => setPayment("already_paid")}
                        className={cn(
                          "col-span-1 w-1/2 cursor-pointer rounded-md border bg-gray-100 p-2.5",
                          {
                            "border-primary text-primary":
                              payment === "already_paid",
                          }
                        )}
                      >
                        <p className="w-full text-center text-xs">
                          Already Paid
                        </p>
                      </div>
                    </div>
                  </div>
                  <CustomButton
                    name={
                      selectedBooking ? "Update Booking" : "Confirm Booking"
                    }
                    handleClick={postBooking}
                    loading={creating}
                    disabled={
                      creating ||
                      !address ||
                      !scheduleTime ||
                      !!(partner?.id && !orderId)
                    }
                    style="w-full py-3 mt-2"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <AddAddressModal
          customerId={selectedUser?.customer_id}
          userId={user!.id}
          open={openAddressModal}
          setOpen={setOpenAddressModal}
          getAddresses={getAddresses}
          editableAddressId={editableAddressId}
        />
        <AddCustomerModal
          customerId={selectedUser?.customer_id}
          userId={user!.id}
          open={openCustomerModal}
          setOpen={setOpenCustomerModal}
          editMode={editMode}
          userData={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <AddFamilyMemberModal
          customerId={selectedUser?.customer_id}
          userId={user!.id}
          open={openFamilyMemberModal}
          setOpen={setOpenFamilyMemberModal}
          getFamily={getFamily}
          editableFamilyMember={editableFamilyMember}
        />
        <AddMedicalDetailModal
          selectedUser={selectedUser!}
          setSelectedUser={setSelectedUser}
          open={openMedicalDetailsModal}
          setOpen={setOpenMedicalDetailsModal}
        />
        <EditServiceModal
          selectedService={selectedServices?.find(
            (item) => item.service_id === selectedService
          )}
          setSelectedService={handleSetSelectedService}
          open={openEditServiceModal}
          setOpen={setOpenEditServiceModal}
        />
        <UploadAttachmentModal
          customerId={selectedUser?.customer_id}
          userId={user!.id}
          open={openUploadAttachment}
          setOpen={setOpenUploadAttachment}
          getAttachments={getAttachments}
        />
        <DeleteModal
          title="Delete Attachment"
          open={openDeleteAttachmentModal}
          setOpen={setOpenDeleteAttachmentModal}
          deleteLoading={deleteLoading}
          handleDelete={handleDeleteAttachment}
        />
      </Modal>
    </>
  );
};

export default NewBookingModal;
