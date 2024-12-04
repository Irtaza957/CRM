import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IoClose } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RiArrowDownSLine } from "react-icons/ri";
import Modal from "../../ui/Modal";
import CustomInput from "../../ui/CustomInput";
import CustomButton from "../../ui/CustomButton";
import Combobox from "../../ui/Combobox";
import { toast } from "sonner";
import CustomToast from "../../ui/CustomToast";
import { RootState } from "../../../store";
import { FiEdit } from "react-icons/fi";
import { useAddHomeSectionMutation, useFetchServicesQuery, useUpdateHomeSectionMutation } from "../../../store/services/service";

interface AddHomeSectionModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBusiness: string | number | null;
    selectedCompany: string | number | null;
    selectedHomeSection: HomeSectionProps | null;
    refetch: () => void;
    isView?: boolean;
    setIsView?: React.Dispatch<React.SetStateAction<boolean>>;
}

const companySchema = z.object({
    name: z.string().min(1, "Name is required"),
    rows: z.string().min(1, "Rows is required"),
});

const AddHomeSection = ({
    open,
    setOpen,
    selectedBusiness,
    selectedCompany,
    selectedHomeSection,
    refetch,
    isView,
    setIsView
}: AddHomeSectionModalProps) => {
    const [selectedServices, setSelectedServices] = useState<ListOptionProps[]>([]);
    const { user } = useSelector((state: RootState) => state.global);

    const {
        data: servicesData,
    } = useFetchServicesQuery([{ name: 'business', value: `${selectedBusiness}-business` }, { name: 'company', value: `${selectedCompany}-company` }], {
        skip: !selectedBusiness && !selectedCompany,
        refetchOnMountOrArgChange: true,
    });
    const [addHomeSection, { isLoading }] = useAddHomeSectionMutation();
    const [updateHomeSection, { isLoading: updateLoading }] =
    useUpdateHomeSectionMutation();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(companySchema),
    });

    const handleSelectServices = (value: ListOptionProps[]) => {
        setSelectedServices(value);
    };

    const handleClose = () => {
        setOpen(false);
        resetState();
    };

    const resetState = () => {
        reset({
            name: "",
            rows: "",
        });
    };

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append("user_id", String(user?.id));
            const servicesString = (selectedServices as ListOptionProps[])
                ?.map((service) => service.id)
                .join(",");
            formData.append("service_ids", servicesString);
            formData.append("name", data.name);
            formData.append("rows", data.rows);
            formData.append("business_id", String(selectedBusiness || ''));
            formData.append("company_id", String(selectedCompany || ''));

            let response;
            if (selectedHomeSection?.id) {
                formData.append("section_id", selectedHomeSection?.id);
                response = await updateHomeSection(formData);
            } else {
                response = await addHomeSection(formData);
            }

            if ("error" in response) {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        type="error"
                        title="Error"
                        message={`Failed to ${selectedHomeSection?.id ? "update" : "create"} home section`}
                    />
                ));
            } else {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        type="success"
                        title="Success"
                        message={`Home section ${selectedHomeSection?.id ? "updated" : "created"} successfully`}
                    />
                ));
                refetch();
                handleClose();
            }
        } catch (error) {
            toast.custom((t) => (
                <CustomToast
                    t={t}
                    type="error"
                    title="Error"
                    message="Something went wrong"
                />
            ));
        }
    };

    useEffect(() => {
        if (selectedHomeSection?.id) {
            setValue("name", selectedHomeSection?.name);
            setValue("rows", selectedHomeSection?.total_rows);
            const selectedService=servicesData?.filter((service: any) => selectedHomeSection?.services?.some((id: any) => id?.id === service.service_id))?.map((service: any) => ({
                id: service.service_id,
                name: service.service_name
            }))
            setSelectedServices(selectedService || [])
        }
    }, [selectedHomeSection, open]);


    useEffect(() => {
        if (!open) {
            resetState();
        }
    }, [open]);

    return (
        <Modal open={open} setOpen={setOpen} className="w-[95%] lg:max-w-xl">
            <div className="flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-white">
                <div className="flex w-full items-center justify-between bg-primary px-5 py-2.5 text-white">
                    <h1 className="text-xl font-medium">
                        {isView ? "View Home Section" : selectedHomeSection?.id ? "Update Home Section" : "Add Home Section"}
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        {(isView) && (
                            <FiEdit
                                onClick={() => setIsView?.(false)}
                                className="h-6 w-6 cursor-pointer text-white"
                            />
                        )}
                        <IoClose onClick={handleClose} className="h-8 w-8 cursor-pointer" />
                    </div>
                </div>

                <div className="h-full max-h-[70vh] w-full gap-5 overflow-y-scroll p-5">
                    <div className="grid grid-cols-2 gap-5">
                        <CustomInput
                            name="name"
                            label="Home Section Name"
                            register={register}
                            errorMsg={errors?.name?.message}
                            placeholder="Enter name..."
                            disabled={isView}
                        />
                        <CustomInput
                            name="rows"
                            label="Rows"
                            register={register}
                            errorMsg={errors?.rows?.message}
                            placeholder="Enter rows..."
                            disabled={isView}
                            type="number"
                        />
                    </div>
                    <div className="col-span-2 mt-4 mb-8">
                        <Combobox
                            value={selectedServices}
                            options={servicesData?.map((service: any) => ({
                                id: service.service_id,
                                name: service.service_name
                            }))}
                            handleSelect={handleSelectServices}
                            label="Services"
                            placeholder="Select Services"
                            mainClassName="w-full"
                            toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                            listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                            icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                            isSearch={false}
                            errorMsg={errors?.services?.message}
                            isMultiSelect={true}
                            disabled={isView}
                        />
                    </div>

                    <div className="col-span-2 flex w-full items-end justify-end gap-3">
                        <CustomButton
                            name="Cancel"
                            handleClick={handleClose}
                            style="bg-danger"
                        />
                        {!isView && (
                            <CustomButton
                                name={selectedHomeSection?.id ? "Update" : "Save"}
                                handleClick={handleSubmit(onSubmit)}
                                loading={isLoading || updateLoading}
                                disabled={isLoading || updateLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AddHomeSection;
