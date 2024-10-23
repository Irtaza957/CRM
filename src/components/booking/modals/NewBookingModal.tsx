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
} from "../../../store/services/booking";
import {
  useFetchCustomerFamilyMutation,
  useFetchCustomerAddressesMutation,
  useFetchCustomerAttachmentsMutation,
} from "../../../store/services/customer";
import { RootState } from "../../../store";
import CustomToast from "../../ui/CustomToast";
import AutoComplete from "../../ui/AutoComplete";
import { options } from "../../../utils/constants";
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
  FaRegClock,
  FaChevronLeft,
  FaRegTrashAlt,
  FaChevronRight,
} from "react-icons/fa";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { FreeMode } from "swiper/modules";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { GoShareAndroid } from "react-icons/go";
import { Swiper, SwiperSlide } from "swiper/react";
import { FiPlus, FiDownload } from "react-icons/fi";
import { LuLoader2, LuUser2 } from "react-icons/lu";
import { TiArrowSortedDown, TiDocumentText } from "react-icons/ti";

const Bookings = ({ bookings }: { bookings: BookingProps[] }) => {
  return (
    <Swiper
      slidesPerView={2.15}
      spaceBetween={5}
      freeMode={true}
      modules={[FreeMode]}
    >
      {bookings.map((booking) => (
        <SwiperSlide key={booking.booking_id}>
          <div className="grid grid-cols-12 overflow-hidden rounded-lg bg-white">
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

const NewBookingModal = ({ open, setOpen }: ModalProps) => {
  const [address, setAddress] = useState(1);
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
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [fetchFamily] = useFetchCustomerFamilyMutation();
  const [selectedServices, setSelectedServices] = useState<
    ServiceProps[] | null
  >([]);
  const [fetchAddresses] = useFetchCustomerAddressesMutation();
  const [family, setFamily] = useState<FamilyProps[] | null>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { user } = useSelector((state: RootState) => state.global);
  const [fetchAttachments] = useFetchCustomerAttachmentsMutation();
  const [addresses, setAddresses] = useState<AddressProps[] | null>([]);
  const [category, setCategory] = useState<ListOptionProps | null>(null);
  const { data } = useFetchBookingsQuery(dayjs(date).format("YYYY-MM-DD"));
  const [profession, setProfession] = useState<ListOptionProps | null>(null);
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation();
  const [selectedUser, setSelectedUser] = useState<CustomerProps | null>(null);
  const [attachments, setAttachments] = useState<AttachmentProps[] | null>([]);

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

  const removeSelectedService = (id: string) => {
    const filtered = selectedServices?.filter((item) => item.service_id !== id);
    setSelectedServices(filtered!);
  };

  const calculateBookingCost = (services: ServiceProps[]) => {
    const totals = services.reduce(
      (acc, service) => {
        const priceWithoutVAT =
          parseFloat(service.price_without_vat) * service.qty!;
        const vatValue = parseFloat(service.vat_value) * service.qty!;

        acc.subtotal += priceWithoutVAT;
        acc.total_vat += vatValue;

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

  const calculateDiscount = () => {
    const bookingCost = calculateBookingCost(selectedServices!);

    if (isNaN(discount.value)) {
      return bookingCost.grand_total;
    }

    if (discount.type === "aed") {
      return bookingCost.grand_total - discount.value;
    } else {
      return (
        bookingCost.grand_total -
        bookingCost.grand_total * (discount.value / 100)
      );
    }
  };

  const postBooking = async () => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("customer_id", selectedUser!.customer_id);
    urlencoded.append("family_member_id", "0");
    urlencoded.append("address_id", address.toString());
    urlencoded.append("booking_source_id", "1");
    urlencoded.append("partner_id", "1");
    urlencoded.append("firstname", selectedUser!.firstname);
    urlencoded.append("lastname", selectedUser!.lastname);
    urlencoded.append("phone", selectedUser!.phone);
    urlencoded.append("schedule_date", scheduleDate);
    urlencoded.append("schedule_slot", scheduleTime);
    urlencoded.append("delivery_notes", deliveryNotes);
    urlencoded.append(
      "payment_method",
      payment === "cod" ? "Cash on Delivery" : "Card on Delivery"
    );
    urlencoded.append("payment_method_code", payment);
    urlencoded.append("payment_status", "pending");
    urlencoded.append("split_payment_method", "0");
    urlencoded.append("split_payment_method_code", "0");
    urlencoded.append(
      "subtotal",
      `${calculateBookingCost(selectedServices!).subtotal}`
    );
    urlencoded.append("discount_value", `${discount.value}`);
    urlencoded.append(
      "vat_value",
      `${calculateBookingCost(selectedServices!).total_vat}`
    );
    urlencoded.append(
      "total",
      `${calculateBookingCost(selectedServices!).grand_total}`
    );
    urlencoded.append(
      "services",
      JSON.stringify(
        selectedServices?.map((item) => {
          return {
            service_id: item.service_id,
            qty: item.qty,
            price: item.price_without_vat,
          };
        })
      )
    );
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

  useEffect(() => {
    if (data) {
      const view = createTimelineView(data!);
      setTimeline(view);
    }
  }, [data]);

  useEffect(() => {
    if (selectedUser) {
      getFamily(selectedUser?.customer_id);
      getAddresses(selectedUser?.customer_id);
      getAttachments(selectedUser?.customer_id);
    }
  }, [selectedUser]);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      className="h-[95%] w-full max-w-[95%] lg:max-w-[85%]"
    >
      <div className="grid w-full grid-cols-3 divide-x overflow-hidden rounded-lg bg-gray-100">
        <div className="col-span-1 flex h-full flex-col overflow-auto border-r">
          <div className="h-12 w-full border-b">
            <CustomDatePicker
              date={date}
              setDate={setDate}
              toggleButton={
                <div className="flex h-12 w-full items-center justify-between bg-white px-2.5 text-gray-500">
                  <FaChevronLeft />
                  {dayjs(date).format("DD MMM YYYY")}
                  <FaChevronRight />
                </div>
              }
            />
          </div>
          <div className="grid w-full grid-cols-2 items-center justify-center gap-2.5 border-b px-2.5 py-2.5">
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
              value={profession}
              placeholder="Profession"
              setValue={setProfession}
              searchInputPlaceholder="Search..."
              searchInputClassName="p-1.5 text-xs"
              defaultSelectedIconClassName="size-4"
              icon={<TiArrowSortedDown className="size-5" />}
              toggleClassName="w-full shadow-md p-3 rounded-lg text-xs bg-white"
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
                    <Bookings bookings={bookings} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[827px] w-full items-center justify-center">
              <LuLoader2 className="size-10 animate-spin text-secondary" />
            </div>
          )}
        </div>
        <div className="col-span-2 grid h-full w-full grid-cols-2 gap-x-2.5">
          <div className="col-span-2 flex h-12 w-full items-center justify-between bg-primary px-2.5 text-white">
            <p className="w-full text-left text-lg font-semibold">
              New Booking
            </p>
            <button type="button" onClick={() => setOpen(false)}>
              <IoClose className="size-8" />
            </button>
          </div>
          <div className="no-scrollbar col-span-1 flex h-[892px] w-full flex-col items-start justify-start gap-2.5 overflow-auto py-2.5 pl-2.5">
            <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
              <div className="mb-2.5 flex w-full items-center justify-between border-b pb-2.5">
                <h1 className="text-left font-semibold text-primary">
                  Client Details
                </h1>
                <FaRegEdit className="h-5 w-5 text-gray-500" />
              </div>
              <AutoComplete setSelectedUser={setSelectedUser} />
            </div>
            {selectedUser && (
              <>
                <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                  <div className="grid w-full grid-cols-12">
                    <div className="col-span-7 flex w-full items-center justify-between">
                      <img
                        alt="profile"
                        className="size-14 rounded-full"
                        src={
                          selectedUser.image ||
                          "https://ui.shadcn.com/avatars/04.png"
                        }
                      />
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <span className="w-full text-left text-xs text-gray-500">
                          {selectedUser.firstname}&nbsp;{selectedUser.lastname}
                        </span>
                        <span className="w-full text-left text-xs text-gray-500">
                          {selectedUser.phone}
                        </span>
                        <span className="w-full text-left text-xs text-gray-500">
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
                  <div className="flex w-full items-center justify-between border-b py-2.5">
                    <h1 className="text-left font-semibold text-primary">
                      Address Details
                    </h1>
                    <FiPlus className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="mt-2.5 grid w-full grid-cols-2 gap-2.5 text-gray-500">
                    {addresses?.length !== 0 &&
                      addresses?.map((address) => (
                        <div
                          key={address.address_id}
                          className="col-span-1 flex w-full flex-col items-center justify-between space-y-1.5 rounded-lg border border-gray-200 bg-gray-100 p-2.5"
                        >
                          <div className="flex w-full items-center justify-between">
                            <span className="font-bold capitalize text-primary">
                              {address.address_type}
                            </span>
                            <div className="flex items-center justify-end space-x-2.5">
                              {address.map_link && (
                                <Link target="_blank" to={address.map_link}>
                                  <IoLocationOutline />
                                </Link>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  copyToClipboard(`${address.apartment}, ${address.building_no}
                            , ${address.street}, ${address.extra_direction}`)
                                }
                              >
                                <GoShareAndroid />
                              </button>
                              <FaRegEdit />
                            </div>
                          </div>
                          <span className="w-full overflow-hidden truncate text-left text-xs">
                            {address.apartment},&nbsp;{address.building_no}
                            ,&nbsp;
                            {address.street},&nbsp;{address.extra_direction}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                  <div className="flex w-full items-center justify-between border-b pb-2.5">
                    <h1 className="text-left font-semibold text-primary">
                      Medical Details
                    </h1>
                    <FiPlus className="h-5 w-5 text-gray-500" />
                  </div>
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
                      <span className="text-primary">Medical Conditions:</span>
                      <span>
                        {selectedUser.medical_condition_description
                          .split(",")
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                  <div className="flex w-full items-center justify-between border-b pb-2.5">
                    <h1 className="text-left font-semibold text-primary">
                      Family Members
                    </h1>
                    <FiPlus className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="grid w-full grid-cols-5 gap-2.5 bg-gray-100 p-2.5 text-xs text-primary">
                    <div className="col-span-1 w-full">Name</div>
                    <div className="col-span-1 w-full">DOB</div>
                    <div className="col-span-1 w-full">Gender</div>
                    <div className="col-span-1 w-full">Relation</div>
                    <div className="col-span-1 w-full">Actions</div>
                  </div>
                  {family?.length !== 0 &&
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
                          {member.gender}
                        </div>
                        <div className="col-span-1 w-full">
                          {member.relationship}
                        </div>
                        <div className="col-span-1 flex w-full items-center justify-between">
                          <button className="rounded-md bg-primary px-1 py-0.5 text-[10px] text-white">
                            Edit
                          </button>
                          <button className="rounded-md bg-primary px-1 py-0.5 text-[10px] text-white">
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
                  <div className="flex w-full items-center justify-between border-b pb-2.5">
                    <h1 className="text-left font-semibold text-primary">
                      Attachments
                    </h1>
                    <FiPlus className="h-5 w-5 text-gray-500" />
                  </div>
                  {attachments?.length !== 0 &&
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
                          <FiDownload className="h-6 w-6" />
                          <FaRegTrashAlt className="h-6 w-6" />
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
          <div className="no-scrollbar col-span-1 flex h-[892px] w-full flex-col items-start justify-start gap-2.5 overflow-auto py-2.5 pr-2.5">
            <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white p-2.5">
              <div className="flex w-full items-center justify-between border-b pb-2.5">
                <h1 className="text-left font-semibold text-primary">
                  Booking Details
                </h1>
                <button className="rounded-md bg-primary px-5 py-1.5 text-xs text-white">
                  Booking History
                </button>
              </div>
              <div className="relative w-full">
                <ServiceAutoComplete
                  selectedServices={selectedServices}
                  setSelectedServices={setSelectedServices}
                />
              </div>
              <div className="grid w-full grid-cols-9 gap-2.5 p-2.5 text-xs text-primary">
                <div className="col-span-1 w-full" />
                <div className="col-span-1 w-full">Code</div>
                <div className="col-span-3 w-full">Service</div>
                <div className="col-span-2 w-full">Amount</div>
                <div className="col-span-1 w-full text-center">Qty.</div>
                <div className="col-span-1 w-full text-right">Total</div>
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
                    onClick={() => removeSelectedService(service.service_id)}
                  >
                    <IoClose className="h-5 w-5" />
                  </button>
                  <div className="col-span-1 flex w-full items-center justify-start">
                    {service.category_code}
                  </div>
                  <div className="col-span-3 flex w-full items-center justify-start">
                    <p className="w-full overflow-hidden truncate text-left">
                      {service.service_name}
                    </p>
                  </div>
                  <div className="col-span-2 flex w-full items-center justify-start">
                    AED&nbsp;
                    {service.price_without_vat}
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
                    {service?.qty
                      ? parseFloat(service.price_without_vat) * service!.qty
                      : service.price_without_vat}
                  </div>
                </div>
              ))}
              <div className="flex w-full flex-col items-center justify-center space-y-2.5 pt-2.5">
                <div className="flex w-full items-center justify-end space-x-40 pr-2.5 text-xs text-gray-500">
                  <p>Subtotal</p>
                  <p>{calculateBookingCost(selectedServices!).subtotal}</p>
                </div>
                <div className="flex w-full items-center justify-end space-x-7 text-xs text-gray-500">
                  <p>Discount</p>
                  <div className="flex h-[38px] items-center justify-center space-x-2.5 overflow-hidden rounded-lg border p-2.5">
                    <div
                      onClick={() => setDiscount({ ...discount, type: "aed" })}
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
                      onChange={(e) =>
                        setDiscount({
                          ...discount,
                          value: parseInt(e.target.value),
                        })
                      }
                      className="w-10 border-l-2 pl-2.5"
                    />
                  </div>
                </div>
                <div className="flex w-full items-center justify-end space-x-36 pr-2.5 text-xs text-gray-500">
                  <p>VAT</p>
                  <p>{calculateBookingCost(selectedServices!).total_vat}</p>
                </div>
                <div className="w-72 place-self-end border border-gray-300" />
                <div className="flex w-full items-center justify-end space-x-[105px] pr-2.5 font-bold text-gray-500">
                  <p>Grand Total</p>
                  <p>
                    AED&nbsp;
                    {Math.round(calculateDiscount())}
                  </p>
                </div>
              </div>
            </div>
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
                  className="w-full rounded-lg bg-gray-100 p-3 text-xs placeholder:italic"
                />
              </div>
              <div className="flex w-full flex-col items-center justify-center space-y-2.5 border-b pb-2.5 pt-2.5 text-gray-500">
                <h1 className="w-full text-left font-semibold text-primary">
                  Select Time & Date
                </h1>
                <div className="grid w-full grid-cols-2 gap-2.5">
                  <div className="flex w-full items-center justify-center space-x-2.5 rounded-lg bg-gray-100 p-2.5">
                    <input
                      type="text"
                      value={scheduleDate}
                      placeholder="04 Oct 2023"
                      className="w-full bg-transparent text-xs"
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                    <IoCalendarOutline className="h-5 w-5" />
                  </div>
                  <div className="flex w-full items-center justify-center space-x-2.5 rounded-lg bg-gray-100 p-2.5">
                    <input
                      type="text"
                      value={scheduleTime}
                      placeholder="08:00 - 09:00"
                      className="w-full bg-transparent text-xs"
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                    <FaRegClock className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col items-center justify-center space-y-2.5 border-b pb-2.5 pt-2.5 text-gray-500">
                <div className="flex w-full items-center justify-between">
                  <h1 className="text-left font-semibold text-primary">
                    Select Address
                  </h1>
                  <FiPlus className="h-5 w-5 text-gray-500" />
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
                          <div className="flex items-center justify-end space-x-2.5">
                            {a.map_link && (
                              <Link target="_blank" to={a.map_link}>
                                <IoLocationOutline />
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(`${a.apartment}, ${a.building_no}
                            , ${a.street}, ${a.extra_direction}`)
                              }
                            >
                              <GoShareAndroid />
                            </button>
                            <FaRegEdit />
                          </div>
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
                  Select Payment
                </h1>
                <div className="mt-2.5 grid w-full grid-cols-2 gap-2.5 text-gray-500">
                  <div
                    onClick={() => setPayment("cod")}
                    className={cn(
                      "col-span-1 w-full cursor-pointer rounded-md border bg-gray-100 p-2.5 shadow-md",
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
                      "col-span-1 w-full cursor-pointer rounded-md border bg-gray-100 p-2.5 shadow-md",
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
              </div>
              <button
                type="button"
                disabled={creating}
                onClick={() => postBooking()}
                className="w-full rounded-lg bg-primary py-3 text-white"
              >
                {creating ? (
                  <div className="flex w-full items-center justify-center gap-3">
                    <LuLoader2 className="animate-spin" />
                    <span>Please Wait...</span>
                  </div>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default NewBookingModal;
