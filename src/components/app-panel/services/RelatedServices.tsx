import SmallUpDownArrow from "../../../assets/icons/small-updown-arrow.svg";
import CustomButton from "../../ui/CustomButton";
import Table from "../../ui/Table";
import { useState } from "react";
import { useFetchRelatedServicesQuery } from "../../../store/services/service";
import AddRelatedService from "./AddRelatedService";
import Loader from "../../ui/Loader";

const headers = [
  { label: "Code", key: "code", sortable: true, sortIcon: SmallUpDownArrow },
  {
    label: "Name",
    key: "name",
    sortable: true,
    sortIcon: SmallUpDownArrow,
  },
  {
    label: "Price With VAT",
    key: "price_with_vat",
    sortable: true,
    sortIcon: SmallUpDownArrow,
  },
  {
    label: "Promotional Price With VAT",
    key: "promotional_price_with_vat",
    sortable: true,
    sortIcon: SmallUpDownArrow,
  },
];

const RelatedServices = ({selectedServiceId}:{selectedServiceId:string}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: serviceData, refetch, isLoading } = useFetchRelatedServicesQuery(selectedServiceId, {
    skip: !selectedServiceId,
    refetchOnMountOrArgChange: true
  });

  const handleAddModal = () => {
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
         <Loader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex justify-end">
        <CustomButton name="Add Related Service" handleClick={handleAddModal} />
      </div>
      <div className="w-full h-[calc(100vh-305px)]">
      <Table headers={headers} rows={serviceData || []} />
      </div>
      <AddRelatedService
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedServiceId={selectedServiceId}
        refetch={refetch}
      />
    </div>
  );
};

export default RelatedServices;
