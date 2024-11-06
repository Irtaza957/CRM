import Modal from "../../ui/Modal";
import { cn } from "../../../utils/helpers";
import BookingLogsModal from "./BookingLogsModal";
import CancelBookingModal from "./CancelBookingModal";
import BasicEdit from "../../../assets/icons/edit-basic.svg";
import Attachments from "../../../assets/icons/attachments.svg";
import LocationTwo from "../../../assets/icons/location-two.svg";
import PhoneColored from "../../../assets/icons/phone-colored.svg";
import ReAssign from "../../../assets/icons/colored/re-assign.svg";
import CalendarPlain from "../../../assets/icons/calendar-plain.svg";
import WhatsAppColored from "../../../assets/icons/whatsapp-colored.svg";
import { useFetchBookingDetailsQuery } from "../../../store/services/booking";
import LocationSquare from "../../../assets/icons/colored/location-colored.svg";
import PhoneSquare from "../../../assets/icons/colored/colored-phone-square.svg";
import WhatsappSquare from "../../../assets/icons/colored/colored-whatsapp-square.svg";

import dayjs from "dayjs";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
import { RiVisaLine } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa6";
import UploadDocumentsModal from "./UploadDocumentsModal";
import BookingHistoryModal from "./BookingHistoryModal";
import TeamMembersModal from "./TeamMembersModal";

const ViewBookingModal = ({ id, open, setOpen }: ModalProps) => {
  const [logs, setLogs] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [upload, setUpload] = useState(false);
  const [editing, setEditing] = useState(false);
  const [history, setHistory] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isAssignModal, setIsAssignModal]=useState(false)

  const { data, isLoading } = useFetchBookingDetailsQuery(id, {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });
  const handleAssign=()=>{
    setIsAssignModal(true)
  }

  return (
    <>
      <TeamMembersModal members={data?.team} showMembers={["3","4","5","6",'7'].includes(data?.status_id || '')} bookingId={data?.booking_id} open={isAssignModal} setOpen={setIsAssignModal} />
      <BookingLogsModal logsData={data?.logs} open={logs} setOpen={setLogs} />
      <UploadDocumentsModal open={upload} setOpen={setUpload} />
      <BookingHistoryModal open={history} setOpen={setHistory} />
      <CancelBookingModal id={id} open={cancel} setOpen={setCancel} />
      <Modal open={open} setOpen={setOpen} className="h-[95%] w-full max-w-[95%] lg:max-w-[85%]">
        <div className="w-full items-center justify-center overflow-hidden rounded-lg bg-gray-100">
          <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
            <h1 className="text-xl font-medium">Booking Ref: {id}</h1>
            <IoClose
              onClick={() => setOpen(false)}
              className="h-8 w-8 cursor-pointer"
            />
          </div>
          <div className="flex w-full flex-col items-center justify-center space-y-2.5 p-2.5">
            {isLoading ? (
              <LuLoader2 className="h-14 w-14 animate-spin text-secondary" />
            ) : (
                <>
                  <div className="flex gap-3 w-full h-full relative">
                    <div className="w-full max-h-[calc(100vh-170px)] overflow-auto">
                      <div className="flex w-full bg-white rounded-lg flex-col items-start justify-start space-y-2.5 ">
                        {/* Client Details */}
                        <div className="flex w-full flex-col items-center justify-center rounded-lg p-2.5">
                          <div className="flex w-full items-center justify-between border-b pb-2.5">
                            <h1 className="text-left font-semibold text-primary">
                            Customer Details
                            </h1>
                            <button
                              type="button"
                              onClick={() => setHistory(true)}
                              className="rounded-md bg-primary px-5 py-1.5 text-xs text-white"
                            >
                              Booking History
                            </button>
                          </div>
                          <div className="flex w-full items-center justify-between pt-2.5">
                            <div className="grid flex-1 grid-cols-2 gap-7">
                              <div className="flex w-full flex-1 items-center justify-start gap-3.5">
                                <img
                                  alt="profile"
                                  className="size-14 rounded-full"
                                  src="https://ui.shadcn.com/avatars/04.png"
                                />
                                <div className="flex flex-col items-center justify-center space-y-1">
                                  <span className="w-full text-left text-xs text-[#656565]">
                                    {data?.customer?.firstname}&nbsp;
                                    {data?.customer?.lastname}
                                  </span>
                                  <span className="w-full text-left text-xs text-[#656565]">
                                    {data?.customer.phone}
                                  </span>
                                  <span className="w-full text-left text-xs text-[#656565]">
                                    {data?.customer.email}
                                  </span>
                                </div>
                              </div>
                              <div className="flex w-full flex-1 flex-col items-center justify-center space-y-1">
                                <span className="w-full pr-5 text-right text-xs text-[#656565] lg:pr-0 lg:text-left">
                                  {data?.customer.date_of_birth}
                                </span>
                                <span className="w-full pr-5 text-right text-xs text-[#656565] lg:pr-0 lg:text-left">
                                  {data?.customer.gender}
                                </span>
                                <span className="w-full pr-5 text-right text-xs text-[#656565] lg:pr-0 lg:text-left">
                                  {data?.customer.nationality}
                                </span>
                              </div>
                            </div>
                            <div className="flex h-full flex-col items-center justify-between gap-1">
                              <img
                                src={PhoneColored}
                                alt="phone"
                                className="size-7"
                              />
                              <img
                                src={WhatsAppColored}
                                alt="whatsapp"
                                className="size-7"
                              />
                            </div>
                          </div>
                        </div>
                        {/* Family Member */}
                        {data?.family_member_details &&
                          Object.keys(data?.family_member_details).length !== 0 && (
                            <div className="flex w-full flex-col items-center justify-center rounded-lg p-2.5">
                              <h1 className="w-full border-b pb-2.5 text-left font-semibold text-primary">
                                Family Member
                              </h1>
                              <div className="grid w-full grid-cols-2 gap-2.5 bg-white p-2.5 text-xs text-gray-500">
                                <div className="col-span-1 w-full text-primary">
                                  Name
                                </div>
                                <div className="col-span-1 w-full">
                                  {data?.family_member_details.firstname}&nbsp;
                                  {data?.family_member_details.lastname}
                                </div>
                              </div>
                              <div className="grid w-full grid-cols-2 gap-2.5 bg-gray-100 p-2.5 text-xs text-gray-500">
                                <div className="col-span-1 w-full text-primary">
                                  Date of Birth
                                </div>
                                <div className="col-span-1 w-full">
                                  {dayjs(
                                    data?.family_member_details.date_of_birth
                                  ).format("DD MMM YYYY")}
                                </div>
                              </div>
                              <div className="grid w-full grid-cols-2 gap-2.5 bg-white p-2.5 text-xs text-gray-500">
                                <div className="col-span-1 w-full text-primary">
                                  Relationship
                                </div>
                                <div className="col-span-1 w-full">
                                  {data?.family_member_details.relationship}
                                </div>
                              </div>
                              <div className="grid w-full grid-cols-2 gap-2.5 bg-gray-100 p-2.5 text-xs text-gray-500">
                                <div className="col-span-1 w-full text-primary">
                                  Gender
                                </div>
                                <div className="col-span-1 w-full">
                                  {data?.family_member_details.gender}
                                </div>
                              </div>
                            </div>
                          )}
                        {/* Medical Details */}
                        <div className="flex w-full flex-col items-center justify-center rounded-lg p-2.5">
                          <h1 className="w-full border-b pb-2.5 text-left font-semibold text-primary">
                            Medical Details
                          </h1>
                          {data?.customer.is_allergy !== "0" && (
                            <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5">
                              <span className="text-xs text-primary">
                                Allergies:
                              </span>
                              {data?.customer.allergy_description
                                .split(",")
                                ?.map((allergy, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded-full bg-red-200 px-2 text-xs text-red-500"
                                  >
                                    {allergy}
                                  </span>
                                ))}
                            </div>
                          )}
                          {data?.customer.is_medication !== "0" && (
                            <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5 text-xs text-gray-500">
                              <span className="text-primary">Medications:</span>
                              <span>
                                {data?.customer.medication_description
                                  .split(",")
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                          {data?.customer.is_medical_conition !== "0" && (
                            <div className="flex w-full flex-wrap items-center justify-start gap-1.5 pt-2.5 text-xs text-gray-500">
                              <span className="text-primary">
                                Medical Conditions:
                              </span>
                              <span>
                                {data?.customer.medical_condition_description
                                  .split(",")
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex w-full bg-white rounded-lg flex-col items-start justify-start space-y-2.5 p-2.5 mt-3">
                        {/* Booking Details */}
                        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white">
                          <h1 className="w-full border-b pb-2.5 text-left font-semibold text-primary">
                            Services List
                          </h1>
                          <div className="grid w-full grid-cols-2">
                            {data?.address.address_type && (
                              <div className="flex w-full flex-col items-center justify-center space-y-2.5 pt-2.5 text-gray-500">
                                <h1 className="w-full text-left text-sm font-semibold text-primary">
                                  Selected Address
                                </h1>
                                <div className="flex w-full items-start justify-start gap-2.5">
                                  <img src={LocationTwo} alt="location-two-icon" />
                                  <span className="flex-1 text-wrap text-xs">
                                    {data?.address.apartment},&nbsp;
                                    {data?.address.building}, {data?.address.street}
                                    , {data?.address.area}, {data?.address.emirate}
                                  </span>
                                </div>
                              </div>
                            )}
                            <div className="flex w-full flex-col items-center justify-center space-y-2.5 pt-2.5 text-gray-500">
                              <h1 className="w-full text-left text-sm font-semibold text-primary">
                                Selected Time & Date
                              </h1>
                              <div className="flex w-full items-center justify-start gap-2.5">
                                <FaRegClock className="size-4 text-[#858688]" />
                                <span className="text-xs">
                                  Date:&nbsp;
                                  {dayjs(data?.schedule_date).format(
                                    "DD MMM, YYYY"
                                  )}
                                </span>
                              </div>
                              <div className="flex w-full items-center justify-start gap-2.5 pb-2.5">
                                <img
                                  src={CalendarPlain}
                                  alt="plain-calendar-icon"
                                />
                                <span className="text-xs">
                                  Time: {data?.schedule_slot.split("-").join(" - ")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Selected Payment Method */}
                        <div className="flex w-full flex-col items-center justify-center space-y-2.5 rounded-lg bg-white">
                          <h1 className="w-full border-b pb-2.5 text-left font-semibold text-primary">
                            Selected Payment Method
                          </h1>
                          <div className="flex w-full items-center justify-start space-x-10 text-xs text-gray-500">
                            {data?.payment_method === "Online Payment" && (
                              <RiVisaLine className="h-8 w-8 text-blue-900" />
                            )}
                            <p>{data?.payment_method}</p>
                            <p className="rounded-full bg-green-500 px-5 py-0.5 text-white">
                              {data?.payment_status}
                            </p>
                          </div>
                          {data?.payment_method === "Online Payment" && (
                            <>
                              <p className="w-full text-left text-xs text-gray-500">
                                <span className="text-primary">
                                  Payment Confirmation Code:
                                </span>
                                &nbsp;CTAMT11
                              </p>
                              <p className="w-full text-left text-xs text-gray-500">
                                <span className="text-primary">
                                  Deducted Amount:
                                </span>
                                &nbsp;AED 000
                              </p>
                              <p className="w-full text-left text-xs text-gray-500">
                                <span className="text-primary">Deducted Time:</span>
                                &nbsp;05/10/23 16:45
                              </p>
                            </>
                          )}
                        </div>
                        {/* Team Members */}
                        {/* {data?.team.length !== 0 && ( */}
                        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white">
                          <div className="flex w-full items-center justify-between border-b pb-2.5">
                            <h1 className="text-left font-semibold text-primary">
                              Team Members
                            </h1>
                            <div className="flex items-center justify-end space-x-2.5">
                              {!["8","9"].includes(data?.status_id || '') &&
                              <button onClick={handleAssign} className="rounded-md bg-primary px-5 py-1.5 text-xs text-white">
                                {["3","4","5","6",'7'].includes(data?.status_id || '') ? "Re-assign": 'Assign'}
                              </button>}
                              <button
                                type="button"
                                onClick={() => setLogs(true)}
                                className="rounded-md bg-primary px-5 py-1.5 text-xs text-white"
                              >
                                Booking Log
                              </button>
                            </div>
                          </div>
                          {!["1","2"].includes(data?.status_id || '') &&
                          <>
                          <div className="mt-2.5 grid w-full grid-cols-4 gap-2.5 bg-gray-100 p-2.5 text-xs text-primary">
                            <p className="col-span-1 w-full text-left">Team</p>
                            <p className="col-span-1 w-full text-left">Title</p>
                            <p className="col-span-1 w-full text-left">Status</p>
                            <p className="col-span-1 w-full text-left">Action</p>
                          </div>
                          {data?.team.map((m, idx) => (
                            <div
                              key={m.user_id}
                              className={cn(
                                "grid w-full grid-cols-4 gap-2.5 p-2.5 text-xs text-gray-500",
                                {
                                  "bg-white": idx % 2 === 0,
                                  "bg-gray-100": idx % 2 !== 0,
                                }
                              )}
                            >
                              <p className="col-span-1 w-full text-left">
                                {m.name}
                              </p>
                              <p className="col-span-1 w-full text-left">
                                {m.position}
                              </p>
                              <div className="col-span-1 flex w-full items-center justify-start">
                                <p
                                  style={{
                                    backgroundColor:
                                      m.is_accepted === "1"
                                        ? "#7761A1"
                                        : "#008146",
                                  }}
                                  className="rounded-full px-2 py-0.5 text-center text-white"
                                >
                                  {m.is_accepted === "1" ? "Accepted" : "Pending"}
                                </p>
                              </div>
                              <div className="flex w-full items-center justify-between">
                                <img
                                  src={PhoneSquare}
                                  alt="icon"
                                  className="size-5 cursor-pointer"
                                />
                                <img
                                  src={WhatsappSquare}
                                  alt="icon"
                                  className="size-5 cursor-pointer"
                                />
                                <img
                                  onClick={handleAssign}
                                  src={ReAssign}
                                  alt="icon"
                                  className="size-5 cursor-pointer"
                                />
                                <img
                                  src={LocationSquare}
                                  alt="icon"
                                  className="size-5 cursor-pointer"
                                />
                              </div>
                            </div>
                          ))}
                          </>}
                        </div>
                        {/* )} */}
                        {/* Booking Instructions */}
                        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white">
                          <h1 className="w-full border-b pb-2.5 text-left font-semibold text-primary">
                            Booking Instructions
                          </h1>
                          <textarea
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            className="mt-2.5 w-full rounded-lg bg-gray-100 p-3 text-xs"
                            placeholder={
                              data?.delivery_notes || "Further Instructions..."
                            }
                            disabled={!editing}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full max-h-[calc(100vh-170px)] overflow-auto">
                      <div className="flex w-full flex-col rounded-lg bg-white items-start justify-start space-y-2.5 min-h-[455px]">
                        {/* Customer Attachments */}
                        <div className="flex h-fit w-full flex-col items-start justify-start overflow-auto rounded-lg bg-white px-2.5 py-3">
                          <div className="flex w-full items-center justify-center border-b pb-2.5">
                            <h1 className="flex-1 text-left font-semibold text-primary">
                              Customer Attachments
                            </h1>
                            {editing && (
                              <button type="button" onClick={() => setUpload(true)}>
                                <img src={BasicEdit} alt="icon" />
                              </button>
                            )}
                          </div>
                          {data?.customer.attachments?.map((attachment) => (
                            <div
                              key={attachment.attachment_id}
                              className="flex w-full items-center justify-between pt-2.5"
                            >
                              <div className="flex items-center justify-center space-x-3">
                                <img
                                  src={Attachments}
                                  alt="attachments"
                                  className="size-7"
                                />
                                <div className="flex w-full flex-col items-center justify-center">
                                  <span className="w-full text-left text-sm text-gray-500">
                                    {attachment.file_type}
                                  </span>
                                  <span className="w-full text-left text-xs text-gray-400">
                                    {attachment.user}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">
                                {dayjs(attachment.created_at).format("DD MMM YYYY")}
                              </span>
                            </div>
                          ))}
                        </div>
                        {/* Booking Attachments */}
                        {data?.booking_attachments?.length ?
                          <div className="flex h-fit max-h-[200px] w-full flex-col items-start justify-start overflow-auto rounded-lg bg-white px-2.5 pb-2.5">
                            <h1 className="w-full border-b pb-2.5 text-left font-semibold text-primary">
                              Booking Attachments
                            </h1>
                            {data?.booking_attachments?.map((attachment) => (
                              <div
                                key={attachment.attachment_id}
                                className="flex w-full items-center justify-between pt-2.5"
                              >
                                <div className="flex items-center justify-center space-x-3">
                                  <img
                                    src={Attachments}
                                    alt="attachments"
                                    className="size-7"
                                  />
                                  <div className="flex w-full flex-col items-center justify-center">
                                    <span className="w-full text-left text-sm text-gray-500">
                                      {attachment.file_type}
                                    </span>
                                    <span className="w-full text-left text-xs text-gray-400">
                                      {attachment.user}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {dayjs(attachment.created_at).format("DD MMM YYYY")}
                                </span>
                              </div>
                            ))}
                          </div> : null}
                      </div>
                      <div className="flex w-full flex-col rounded-lg bg-white items-start justify-start space-y-2.5 p-2.5 mt-3">
                        {/* Service Details */}
                        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white">
                          <div className="flex w-full items-center justify-center border-b pb-2.5">
                            <h1 className="flex-1 text-left font-semibold text-primary">
                              Service Details
                            </h1>
                            {editing && <img src={BasicEdit} alt="icon" />}
                          </div>
                          <div className="grid w-full grid-cols-5 gap-2.5 p-2.5 text-xs text-primary">
                            <div className="col-span-1 w-full text-right">
                              Category
                            </div>
                            <div className="col-span-1 w-full text-right">
                              Service
                            </div>
                            <div className="col-span-1 w-full text-right">
                              Amount
                            </div>
                            <div className="col-span-1 w-full text-right">
                              Quantity
                            </div>
                            <div className="col-span-1 w-full text-right">
                              Total
                            </div>
                          </div>
                          {data?.services?.map((service, idx) => (
                            <div
                              key={service.service_id}
                              className={cn(
                                "grid w-full grid-cols-5 gap-2.5 p-2.5 text-xs text-gray-500",
                                {
                                  "bg-white": idx % 2 !== 0,
                                  "bg-gray-100": idx % 2 === 0,
                                }
                              )}
                            >
                              <div className="col-span-1 w-full text-left lg:text-right">
                                DOC
                              </div>
                              <div className="col-span-1 w-full overflow-hidden truncate text-right">
                                {service.service_name
                                  ? service.service_name
                                  : "N/A"}
                              </div>
                              <div className="col-span-1 w-full text-right">
                                {service.price}
                              </div>
                              <div className="col-span-1 w-full text-right">
                                {service.quantity}
                              </div>
                              <div className="col-span-1 w-full text-right">
                                {parseFloat(service.price) *
                                  parseInt(service.quantity)}
                              </div>
                            </div>
                          ))}
                          <div className="flex w-full flex-col items-center justify-center space-y-2.5 pt-2.5">
                            <div className="flex w-full items-center justify-end space-x-10 pr-2.5 text-xs text-gray-500">
                              <p>Subtotal</p>
                              <p>
                                {data?.services.reduce(
                                  (sum, service) => sum + parseFloat(service.total),
                                  0
                                )}
                              </p>
                            </div>
                            <div className="flex w-full items-center justify-end space-x-10 pr-2.5 text-xs text-gray-500">
                              <p>Discount</p>
                              <p>000</p>
                            </div>
                            <div className="flex w-full items-center justify-end space-x-10 pr-2.5 text-xs text-gray-500">
                              <p>VAT</p>
                              <p>000</p>
                            </div>
                            <div className="w-56 place-self-end border border-gray-300" />
                            <div className="flex w-full items-center justify-end space-x-10 pr-2.5 font-bold text-gray-500">
                              <p>Grand Total</p>
                              <p>
                                AED&nbsp;
                                {data?.services.reduce(
                                  (sum, service) => sum + parseFloat(service.total),
                                  0
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* Other Details */}
                        <div className="flex w-full flex-col items-center justify-center rounded-lg bg-white pt-2.5">
                          <div className="flex w-full items-center justify-between border-b pb-2.5">
                            <h1 className="text-left font-semibold text-primary">
                              Other Details
                            </h1>
                            <button className="rounded-md bg-primary px-5 py-1.5 text-xs text-white">
                              Call Records
                            </button>
                          </div>
                          <div className="grid w-full grid-cols-2 gap-2.5 pt-2.5">
                            <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
                              <label
                                htmlFor="source"
                                className="w-full text-left text-xs text-primary"
                              >
                                Source
                              </label>
                              <input
                                type="text"
                                placeholder={data?.booking_source}
                                className="w-full rounded-lg bg-gray-100 p-3 text-xs text-gray-500"
                                disabled={!editing}
                              />
                            </div>
                            <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
                              <label
                                htmlFor="source"
                                className="w-full text-left text-xs text-primary"
                              >
                                Channel
                              </label>
                              <input
                                type="text"
                                placeholder={data?.booking_source}
                                className="w-full rounded-lg bg-gray-100 p-3 text-xs text-gray-500"
                                disabled={!editing}
                              />
                            </div>
                            <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
                              <label
                                htmlFor="source"
                                className="w-full text-left text-xs text-primary"
                              >
                                Provider
                              </label>
                              <input
                                type="text"
                                placeholder={data?.partner}
                                className="w-full rounded-lg bg-gray-100 p-3 text-xs text-gray-500"
                                disabled={!editing}
                              />
                            </div>
                            <div className="col-span-1 flex w-full flex-col items-center justify-center space-y-1">
                              <label
                                htmlFor="source"
                                className="w-full text-left text-xs text-primary"
                              >
                                Branch
                              </label>
                              <input
                                type="text"
                                placeholder={data?.branch}
                                className="w-full rounded-lg bg-gray-100 p-3 text-xs text-gray-500"
                                disabled={!editing}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!["8","9"].includes(data?.status_id || '') &&
                  <div className="sticky bottom-0 bg-white p-3 w-full flex items-center gap-3 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCancel(true)}
                      className="w-full rounded-lg bg-red-500 py-3 text-white"
                    >
                      Cancel Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(!editing)}
                      className="w-full rounded-lg bg-secondary py-3 text-white"
                    >
                      {editing ? "Confirm" : "Edit Booking"}
                    </button>
                  </div>}
                </>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ViewBookingModal;
