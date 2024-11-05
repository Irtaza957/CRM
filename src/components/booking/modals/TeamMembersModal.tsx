import { RiArrowDownSLine } from "react-icons/ri";
import Combobox from "../../ui/Combobox";
import Modal from "../../ui/Modal";
import { useEffect, useState } from "react";
import { useFetchUsersByRolesQuery } from "../../../store/services/filters";
import CustomButton from "../../ui/CustomButton";
import { useAssignTeamMemberMutation, useLazyFetchBookingDetailsQuery } from "../../../store/services/booking";
import CustomToast from "../../ui/CustomToast";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface TeamMembersModal {
    open: boolean;
    bookingId?: string;
    members?: Team[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeamMembersModal = ({ open, bookingId, members, setOpen }: TeamMembersModal) => {
    const [dropdownsData, setDropdownsData] = useState({
        doctors: [],
        drivers: [],
        nurses: []
    })
    const [dropdownValues, setDropdownValues] = useState<{ doctor: ListOptionProps | null, driver: ListOptionProps | null, nurse: ListOptionProps | null }>({
        doctor: null,
        driver: null,
        nurse: null
    })
    const [note, setNote] = useState('')

    const { data: professions } = useFetchUsersByRolesQuery({});
    const [assignTeamMember, { isLoading }] = useAssignTeamMemberMutation();
    const [fetchBookingDetails] = useLazyFetchBookingDetailsQuery();

    const { user } = useSelector((state: RootState) => state.global);

    const handleSelect = (value: ListOptionProps, name: string) => {
        if (name === 'doctor') {
            setDropdownValues({
                ...dropdownValues,
                doctor: value
            });
        } else if (name === 'driver') {
            setDropdownValues({
                ...dropdownValues,
                driver: value
            });
        } else {
            setDropdownValues({
                ...dropdownValues,
                nurse: value
            });
        }
    };

    const closeModal = () => {
        setOpen(false)
    }

    const handleAssign = async () => {
        try {
            let alertMsg = ''
            if (!dropdownValues.driver && !dropdownValues.nurse) {
                alertMsg = 'Please select driver and nurse!'
            }
            else if (!dropdownValues.driver) {
                alertMsg = 'Please select driver!'
            }else if(!dropdownValues.nurse){
                alertMsg = 'Please select nurse!'
            }
            if (alertMsg) {
                toast.custom((t) => (
                    <CustomToast
                        t={t}
                        type="error"
                        title="Error"
                        message={alertMsg}
                    />
                ));
                return
            }
            if (user?.id) {
                const urlencoded = new URLSearchParams();
                urlencoded.append("booking_id", String(bookingId));
                urlencoded.append("user_id", String(user?.id));
                urlencoded.append("doctor_id", String(dropdownValues.doctor?.id || ''));
                urlencoded.append("nurse_id", String(dropdownValues.nurse?.id || ''));
                urlencoded.append("driver_id", String(dropdownValues.driver?.id || ''));
                urlencoded.append("notes", note);
                const response = await assignTeamMember(urlencoded)
                if (response?.error) {
                    toast.custom((t) => (
                        <CustomToast
                            t={t}
                            type="error"
                            title="Error"
                            message="Something Went Wrong!"
                        />
                    ));
                } else {
                    toast.custom((t) => (
                        <CustomToast
                            t={t}
                            type="success"
                            title="Success"
                            message={`Successfully Added Team Member!`}
                        />
                    ));
                    await fetchBookingDetails(bookingId);
                    closeModal()
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (professions?.data?.doctors?.length) {
            const doctors = professions?.data?.doctors?.map((item: EmployeeProps) => {
                return { id: item?.user_id, name: item?.full_name };
            });
            const nurses = professions?.data?.nurses?.map((item: EmployeeProps) => {
                return { id: item?.user_id, name: item?.full_name };
            });
            const drivers = professions?.data?.drivers?.map((item: EmployeeProps) => {
                return { id: item?.user_id, name: item?.full_name };
            });
            setDropdownsData({
                doctors,
                nurses,
                drivers
            });
        }
    }, [professions]);

    useEffect(() => {
        if (!open) {
            setDropdownValues({
                doctor: null,
                driver: null,
                nurse: null
            })
            setNote('')
        }
    }, [open])
    return (
        <Modal
            open={open}
            setOpen={setOpen}
            mainClassName="!z-[99999]"
            className="w-full max-w-lg"
            title="Team Members"
        >
            <div className="w-full p-6">
                <div className="flex items-center justify-between w-full gap-3">
                    <Combobox
                        value={dropdownValues.doctor}
                        options={dropdownsData.doctors}
                        handleSelect={(value) => handleSelect(value, 'doctor')}
                        label="Doctors"
                        placeholder="Doctors"
                        mainClassName="w-full"
                        toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                        listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                        isSearch={false}
                    />
                    <Combobox
                        value={dropdownValues.driver}
                        options={dropdownsData.drivers}
                        handleSelect={(value) => handleSelect(value, 'driver')}
                        label="Drivers"
                        placeholder="Drivers"
                        mainClassName="w-full"
                        toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                        listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                        isSearch={false}
                    />
                    <Combobox
                        value={dropdownValues.nurse}
                        options={dropdownsData.nurses}
                        handleSelect={(value) => handleSelect(value, 'nurse')}
                        label="Nurses"
                        placeholder="Nurses"
                        mainClassName="w-full"
                        toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                        listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                        listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                        icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                        isSearch={false}
                    />
                </div>
                <div className="w-full">
                    <div className="flex w-full flex-col items-center justify-end mt-5">
                        <label className="w-full text-left text-xs text-grey100 font-medium mb-0.5">
                            Booking Instructions
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="mt-2.5 w-full rounded-lg bg-gray-100 p-3 text-xs"
                            placeholder='Note'
                        />
                    </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    {members?.map((item, index) => (
                        <p key={index} className="text-sm whitespace-nowrap border-2 border-grey rounded-full flex items-center justify-between py-1.5 px-4">{item?.name}</p>
                    ))}
                </div>
                <div className="mt-7 flex w-full justify-end gap-3">
                    <CustomButton
                        name="Cancel"
                        handleClick={closeModal}
                        style="bg-danger"
                    />
                    <CustomButton
                        name={"Assign"}
                        handleClick={handleAssign}
                        loading={isLoading}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default TeamMembersModal