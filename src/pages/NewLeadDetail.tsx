import { cn } from "../utils/helpers";
import Source from "../assets/icons/source.svg";
import Globe from "../assets/icons/globe-black.svg";
import Tag from "../assets/icons/tag.svg";
import Service from "../assets/icons/layer-service.svg";
import WhatsappGreen from "../assets/icons/whatsapp-green.svg";
import WhatsappWhite from "../assets/icons/whatsapp-white.svg";
import PhoneBlue from "../assets/icons/phone-colored.svg";
import PhoneWhite from "../assets/icons/phone-white.svg";
import EmailRed from "../assets/icons/email-color.svg";
import EmailWhite from "../assets/icons/email-white.svg";

import { useState } from "react";
import OverviewTab from "../components/NewLeadDetail/OverviewTab";
import ActivityHistory from "../components/NewLeadDetail/ActivityHistory";
import WhatsappTab from "../components/NewLeadDetail/WhatsappTab";
import PhoneCallTab from "../components/NewLeadDetail/PhoneCallTab";
import EmailTab from "../components/NewLeadDetail/EmailTab";
import LeadDetailModal from "../components/leadDetails/LeadDetailModal";
import LeadAssignModal from "../components/leads/LeadAssignModal";
import CreateNoteModal from "../components/NewLeadDetail/Modals/CreateNoteModal";
import FollowupModal from "../components/NewLeadDetail/Modals/FollowupModal";
import AddLeadModal from "../components/leads/AddLeadModal";
import { useFetchNationalityQuery } from "../store/services/booking";
import { useFetchLeadSourcesQuery, useFetchLeadChannelsQuery } from "../store/services/leads";
import { useParams } from "react-router-dom";

const NewLeadDetail = () => {
    const [openLeadModal, setOpenLeadModal] = useState(false)
    const [openLeadAssignModal, setOpenLeadAssignModal] = useState(false)
    const [openCreateNoteModal, setOpenCreateNoteModal] = useState(false)
    const [openFollowupModal, setOpenFollowupModal] = useState(false)
    const [openAddLeadModal, setOpenAddLeadModal] = useState(false)
    const [activeTab, setActiveTab] = useState<
        "overView" | "activity_history" | "whatsApp" | "call" | "email"
    >("overView");
    const { id } = useParams()

    const { data: nationalities } = useFetchNationalityQuery({});
    const { data: sources } = useFetchLeadSourcesQuery(
        {},
        {
            skip: !open,
            refetchOnMountOrArgChange: true,
        }
    );

    const { data: channels } = useFetchLeadChannelsQuery({}, {
        skip: !open,
        refetchOnMountOrArgChange: true,
    });

    const actions = [
        "Edit Lead",
        "Assign Agent",
        "Schedule Appointment",
        "Add Note",
        "Initiate Follow-Up",
        "Create a Meeting",
    ];

    const handleMoveLeads = (value: boolean) => {
        setOpenLeadModal(value)
    }

    const handleAssignModal = (value: boolean) => {
        setOpenLeadAssignModal(value)
    }

    const handleClickAction = (action: string) => {
        if (action === "Edit Lead") {
            setOpenAddLeadModal(true)
        } else if (action === "Assign Agent") {
            setOpenLeadAssignModal(true)
        } else if (action === "Add Note") {
            setOpenCreateNoteModal(true)
        } else if (action === "Initiate Follow-Up") {
            setOpenFollowupModal(true)
        }
    }
    return (
        <>
            <AddLeadModal
                selectedLeadId={id || ''}
                open={openAddLeadModal}
                setOpen={setOpenAddLeadModal}
                refetch={() => { }}
                isView={false}
                nationalities={nationalities}
                sources={sources}
                channels={channels}
            />
            <CreateNoteModal
                open={openCreateNoteModal}
                setOpen={setOpenCreateNoteModal}
            />
            <FollowupModal
                open={openFollowupModal}
                setOpen={setOpenFollowupModal}
            />
            <LeadDetailModal
                selectedLead={'1'}
                open={openLeadModal}
                setOpen={setOpenLeadModal}
                refetch={() => { }}
                refetchLeadChat={() => { }}
            />
            <LeadAssignModal
                selectedLead={null}
                open={openLeadAssignModal}
                setOpen={setOpenLeadAssignModal}
                refetch={() => { }}
                selectedLeadId={id || ''}
            />
            <section className="flex h-full flex-col gap-3">
                <div className="flex flex-wrap justify-center gap-2 gap-y-6 rounded-2xl border border-[#E3E3E3] bg-white px-2 py-2.5">
                    <div className="flex flex-1 items-center gap-3 border-r border-[#E3E3E3] pr-5">
                        <div className="flex items-center justify-center rounded-full bg-[#4DA6F4] p-3.5 text-xl text-white">
                            <span>SD</span>
                        </div>
                        <div>
                            <p className="text-black text-sm">Mr. Sandy Dev</p>
                            <p className="text-xs text-[#656565]">+971 55 755 9446</p>
                            <p className="mt-0.5 text-xs text-[#656565]">mymail@gmail.com</p>
                        </div>
                    </div>
                    {/* source */}
                    <div className="flex flex-1 items-start gap-2 border-r border-[#E3E3E3] pl-2">
                        <img src={Source} alt="Source" />
                        <div>
                            <p className=" text-black text-sm">Source</p>
                            <p className="text-xs text-[#656565]">Google</p>
                        </div>
                    </div>
                    {/* nationality */}
                    <div className="flex flex-1 items-start gap-2 border-r border-[#E3E3E3] pl-3">
                        <img src={Globe} alt="Globe" />
                        <div>
                            <p className=" text-black text-sm">Nationality</p>
                            <p className="text-xs text-[#656565]">India</p>
                        </div>
                    </div>
                    {/* nationality */}
                    <div className="flex flex-1 flex-col justify-between border-r border-[#E3E3E3] pl-2 pr-5">
                        <div className="flex gap-2">
                            <img src={Tag} alt="Tag" />
                            <p className=" text-black text-sm">Priority</p>
                        </div>
                        <div className="w-fit rounded-lg bg-[#F0422C] px-3 py-1 text-xs text-white">
                            High Priority
                        </div>
                    </div>
                    {/* service */}
                    <div className="flex flex-1 items-start gap-2 border-r border-[#E3E3E3] pl- pr-8">
                        <img src={Service} alt="Service" />
                        <div>
                            <p className="whitespace-nowrap text-black text-sm">Service Interest</p>
                            <p className="text-xs text-[#656565]">IVD</p>
                        </div>
                    </div>
                    {/* status */}
                    <div className="flex flex-1 items-start gap-2 pl-2 pr-5">
                        <img src={Service} alt="Service" />
                        <div>
                            <p className=" text-black text-sm">Status</p>
                            <p className="text-xs text-[#656565]">Conacted</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 gap-3 overflow-hidden">
                    {/* actions */}
                    <div className="h-full w-[20%] overflow-hidden rounded-[18px] border border-[#E3E3E3] bg-white p-5">
                        <div className="h-full overflow-y-auto">
                            <p className="mb-2  2xl:text-xl">Actions</p>
                            <div className="flex flex-col gap-1 relative z-10">
                                {actions.map((item) => (
                                    <p onClick={() => handleClickAction(item)} className="cursor-pointer px-3 py-2 text-[#656565] rounded-lg hover:bg-gray-50">
                                        {item}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex h-full w-[80%] flex-col gap-2 rounded-[18px] border border-[#E3E3E3] bg-white px-3 py-2">
                        {/* tabs bar */}
                        <div className="flex justify-between gap-4 overflow-x-auto">
                            <div className="flex gap-2 min-w-fit">
                                <button
                                    onClick={() => setActiveTab("overView")}
                                    className={cn(
                                        "rounded-xl px-3 transition-all duration-200 ease-in-out min-w-fit text-sm 2xl:text-base",
                                        [
                                            activeTab == "overView"
                                                ? "bg-[#126FAC] text-white"
                                                : "bg-[#F3F5F9] text-black",
                                        ]
                                    )}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab("activity_history")}
                                    className={cn(
                                        "rounded-xl px-3 transition-all duration-200 ease-in-out min-w-fit text-sm 2xl:text-base",
                                        [
                                            activeTab == "activity_history"
                                                ? "bg-[#126FAC] text-white"
                                                : "bg-[#F3F5F9] text-black",
                                        ]
                                    )}
                                >
                                    Activity History
                                </button>
                            </div>
                            {/* social tab */}
                            <div className="flex gap-2">
                                <button onClick={() => handleMoveLeads(true)} className="rounded-xl bg-[#F3F5F9] px-3 py-2 transition-all duration-200 ease-in-out min-w-fit text-sm 2xl:text-base">
                                    Move Leads
                                </button>
                                <button onClick={() => handleAssignModal(true)} className="rounded-xl bg-[#F3F5F9] px-3 py-2 transition-all duration-200 ease-in-out min-w-fit text-sm 2xl:text-base">
                                    Assign
                                </button>
                                {/* whatsapp */}
                                <button
                                    onClick={() => setActiveTab("whatsApp")}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl py-2.5 pl-3 pr-5 transition-all duration-200 ease-in-out min-w-fit text-sm 2xl:text-base",
                                        [
                                            activeTab === "whatsApp"
                                                ? "bg-[#5BE27F] text-white"
                                                : "bg-[#F3F5F9] text-black",
                                        ]
                                    )}
                                >
                                    <img
                                        src={
                                            activeTab === "whatsApp" ? WhatsappWhite : WhatsappGreen
                                        }
                                        alt="icon"
                                        className="size-6 2xl:size-7"
                                    />
                                    WhatsApp
                                </button>
                                {/* call */}
                                <button
                                    onClick={() => setActiveTab("call")}
                                    className={cn(
                                        "flex px-4 items-center gap-3 rounded-xl  transition-all duration-200 ease-in-out text-sm 2xl:text-base",
                                        [
                                            activeTab === "call"
                                                ? "bg-[#2BA3F2] text-white"
                                                : "bg-[#F3F5F9] text-black",
                                        ]
                                    )}
                                >
                                    <img
                                        src={activeTab === "call" ? PhoneWhite : PhoneBlue}
                                        alt="icon"
                                        className="size-6 2xl:size-7"
                                    />
                                    Call
                                </button>
                                {/* email */}
                                <button
                                    onClick={() => setActiveTab("email")}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl py-2.5 px-4 transition-all duration-200 ease-in-out text-sm 2xl:text-base",
                                        [
                                            activeTab === "email"
                                                ? "bg-[#F0422C] text-white"
                                                : "bg-[#F3F5F9] text-black",
                                        ]
                                    )}
                                >
                                    <img
                                        src={activeTab === "email" ? EmailWhite : EmailRed}
                                        alt="icon"
                                        className="size-6 2xl:size-7"
                                    />
                                    Email
                                </button>
                            </div>
                        </div>
                        {/* tabs detail */}
                        <div className="h-full flex-1 overflow-y-auto">
                            {activeTab === "overView" ? (
                                <OverviewTab />
                            ) : activeTab === "activity_history" ? (
                                <ActivityHistory />
                            ) : activeTab === "whatsApp" ? (
                                <WhatsappTab />
                            ) : activeTab === "call" ? (
                                <PhoneCallTab />
                            ) : (
                                <EmailTab />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NewLeadDetail;
