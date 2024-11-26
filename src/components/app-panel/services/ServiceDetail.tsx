import AddService from "../../services/forms/add/AddService";

interface ServiceDetailsProps {
    selectedServiceId: string;
    isApp: boolean;
}

const ServiceDetails = ({ selectedServiceId, isApp }: ServiceDetailsProps) => {
    return (
        <AddService selectedServiceId={selectedServiceId} isApp={isApp} />
  )
}

export default ServiceDetails