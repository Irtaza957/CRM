import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../../ui/Modal";
import ServiceDetails from "./ServiceDetail";
import Sections from "./Sections";
import FAQs from "./FAQs";
import Reviews from "./Reviews";
import RelatedServices from "./RelatedServices";
import { cn } from "../../../utils/helpers";

interface ServiceDetailModalProps {
  open: boolean;
  selectedServiceId: string;
  isApp: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const tabs = [
  "Service Details",
  "Section",
  "FAQ's",
  "Reviews",
  "Related Services",
];

const ServiceDetailModal = ({
  open,
  selectedServiceId,
  isApp,
  setOpen,
}: ServiceDetailModalProps) => {
  const [selectedTab, setSelectedTab] = useState<string>("Service Details");

  useEffect(() => {
    if (!open) {
      setSelectedTab("Service Details");
    }
  }, [open]);

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      mainClassName="!z-[99999]"
      className="w-full max-w-[70%]"
      title="Service Detail"
    >
      <ul className="w-[96%] rounded-lg text-center text-sm font-medium text-gray-500 shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
        {tabs.map((tab, index) => (
          <li
            className="w-full focus-within:z-10"
            key={index}
            onClick={() => setSelectedTab(tab)}
          >
            <p className={
              cn("inline-block w-full cursor-pointer border-r border-gray-200 bg-white p-4 hover:bg-primary hover:text-white focus:ring-4 focus:ring-blue-300 dark:border-gray-700",
                selectedTab === tab && "bg-primary text-white",
                index === tabs.length - 1 && "rounded-r-md",
                index === 0 && "rounded-l-md"
              )

            }>
              {tab}
            </p>
          </li>
        ))}
      </ul>
      <div className="!h-[calc(100vh-200px)] w-full overflow-y-scroll px-4 pb-1 pt-2">
        <div>
          {selectedTab === "Service Details" && (
            <ServiceDetails
              selectedServiceId={selectedServiceId}
              isApp={isApp}
            />
          )}
          {selectedTab === "Section" && (
            <Sections selectedServiceId={selectedServiceId} />
          )}
          {selectedTab === "FAQ's" && <FAQs serviceId={selectedServiceId} />}
          {selectedTab === "Reviews" && <Reviews selectedServiceID={selectedServiceId} />}
          {selectedTab === "Related Services" && (
            <RelatedServices selectedServiceId={selectedServiceId} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ServiceDetailModal;
