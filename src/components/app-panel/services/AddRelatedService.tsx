import "react-quill/dist/quill.snow.css";
import Modal from "../../ui/Modal";
import CustomButton from "../../ui/CustomButton";
import { IoClose } from "react-icons/io5";
import { useCreateRelatedSectionMutation, useFetchServicesQuery } from "../../../store/services/service";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Combobox from "../../ui/Combobox";
import { TiArrowSortedDown } from "react-icons/ti";
import { useState } from "react";

interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedServiceId: string;
    refetch: () => void;
}

const AddRelatedService = ({
    isOpen,
    onClose,
    selectedServiceId,
    refetch
}: AddSectionModalProps) => {
    const [selectedService, setSelectedService] = useState<ListOptionProps | null>(null)
    const [createRelatedSection, {isLoading: isLoadingAdd}] = useCreateRelatedSectionMutation();
    const { user } = useSelector((state: RootState) => state.global);
    const {
        data: servicesData
      } = useFetchServicesQuery([{name: 'business', id: '1-business'}, {name: 'company', id: '1-company'}], {
        refetchOnMountOrArgChange: true,
      });
    const handleClose = () => {
        onClose();
    };

    const resetState = () => {
        handleClose()
    }

    const handleFormSubmit = async () => {
        try {
            if (!selectedServiceId) {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        type="error"
                        title="Error"
                        message={`Something Went Wrong!`}
                    />
                ));
                return
            }
            const urlencoded = new URLSearchParams();
            urlencoded.append("service_id", selectedServiceId);
            urlencoded.append("user_id", String(user?.id));
            urlencoded.append("related_service", String(selectedService?.id || ""));
            
            const response = await createRelatedSection(urlencoded)
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
                resetState()
                refetch()
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        type="success"
                        title="Success"
                        message={`Successfully Added Related Service!`}
                    />
                ));
                handleClose()
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleSelectService = (value: ListOptionProps) => {
        setSelectedService(value)
    }

    return (
        <Modal open={isOpen} setOpen={handleClose} className="w-[95%] lg:max-w-lg">
            <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
                <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
                    <h1 className="text-xl font-medium">Add Section</h1>
                    <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
                </div>

                <div className="w-full h-[30vh] flex flex-col justify-between gap-5 overflow-y-scroll p-5">
                    <Combobox
                        value={selectedService}
                        options={servicesData?.map((item) => {
                            return { id: item.service_id, name: item.service_name };
                        })}
                        handleSelect={handleSelectService}
                        placeholder="Service"
                        mainClassName="w-full"
                        toggleClassName={`w-full shadow-md p-3 rounded-lg text-xs bg-white ${!selectedService?.id && 'text-gray-500'}`}
                        listClassName="w-full top-[45px] max-h-[125px] border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={<div><TiArrowSortedDown className="size-5" /></div>}
                        searchInputPlaceholder="Search..."
                        searchInputClassName="p-1.5 text-xs"
                    />
                    <div className="space-y-4">
                        <div className="flex justify-end space-x-3 pt-9">
                            <CustomButton
                                name="Cancel"
                                handleClick={handleClose}
                                style="bg-danger"
                            />
                            <CustomButton 
                                name="Save" 
                                handleClick={handleFormSubmit} 
                                loading={isLoadingAdd}
                                disabled={isLoadingAdd}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddRelatedService;
