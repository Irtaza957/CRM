import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../../ui/Modal"
import ServiceDetails from "./ServiceDetail";
import Sections from "./Sections";
import FAQs from "./FAQs";
import Reviews from "./Reviews";

interface ServiceDetailModalProps {
    open: boolean;
    selectedServiceId: string;
    isApp: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const tabs = ["Service Details", "Section", "FAQ's", "Reviews", "Related Services"]

const ServiceDetailModal = ({ open, selectedServiceId, isApp, setOpen }: ServiceDetailModalProps) => {
    const [selectedTab, setSelectedTab] = useState<string>("Service Details");
    return (
        <Modal
            open={open}
            setOpen={setOpen}
            mainClassName="!z-[99999]"
            className="w-full max-w-[70%]"
            title="Service Detail"
        >
            <div className="h-auto max-h-[calc(100vh-150px)] w-full overflow-y-scroll px-6 pt-2 pb-1">
                <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                    {tabs.map((tab, index) => ( 
                        <li className="w-full focus-within:z-10" key={index} onClick={() => setSelectedTab(tab)}>
                            <p className="inline-block w-full p-4 bg-white cursor-pointer border-r border-gray-200 dark:border-gray-700 rounded-s-lg focus:ring-4 focus:ring-blue-300 hover:text-gray-700 hover:bg-gray-50">
                                {tab}
                            </p>
                        </li>
                    ))}
                </ul>
                <div className="mt-4">
                {selectedTab === "Service Details" && <ServiceDetails selectedServiceId={selectedServiceId} isApp={isApp} />}
                {selectedTab === "Section" && <Sections />}
                {selectedTab === "FAQ's" && <FAQs />}
                {selectedTab === "Reviews" && <Reviews />}
                </div>
            </div>
        </Modal>
    )
}

export default ServiceDetailModal