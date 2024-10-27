import React, { useState } from 'react'
import Modal from '../../ui/Modal'
import CustomInput from '../../ui/CustomInput'
import Combobox from '../../ui/Combobox'
import { RiArrowDownSLine } from "react-icons/ri";
import CustomButton from '../../ui/CustomButton';
import { useForm } from 'react-hook-form';
import CustomDatePicker from '../../ui/CustomDatePicker';
import { IoCalendarOutline } from 'react-icons/io5';
import dayjs from 'dayjs';

interface AddAddressModalProps {
    open: boolean,
    customerId?: string,
    userId?: number,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const options = [
    { id: 1, name: 'abc' },
    { id: 2, name: 'xyz' },
    { id: 3, name: 'asd' },
]
const AddCustomerModal = ({ open, customerId, userId, setOpen }: AddAddressModalProps) => {
    const [gender, setGender] = useState<ListOptionProps | null>(null);
    const [source, setSource] = useState<ListOptionProps | null>(null);
    const [nationality, setNationality] = useState<ListOptionProps | null>(null);
    const [scheduleDate, setScheduleDate] = useState<Date | string>(new Date());

    const {
        register,
        setValue,
        reset,
        handleSubmit,
    } = useForm();

    const handleSelectGender = (value: ListOptionProps) => {
        setGender(value)
        setValue("gender", value.id);
    }

    const handleSelectSource = (value: ListOptionProps) => {
        setSource(value)
        setValue("source", value.id);
    }

    const handleSelectNationality = (value: ListOptionProps) => {
        setNationality(value)
        setValue("nationality", value.id);
    }

    const handleSave = async () => {
        try {
            if (customerId && userId) {
                reset()
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const closeModal = () => {
        setOpen(false)
    }
    return (
        <Modal
            open={open}
            setOpen={setOpen}
            mainClassName="!z-[99999]"
            className="w-[70%] max-w-[80%]"
            title='New Customer'
        >
            <div className='w-full px-6 py-7'>
                <p className='text-left text-[18px] text-primary font-bold'>Personal Details</p>
                <div className='mt-4 w-full'>
                    <div className='w-full flex gap-5 items-center justify-center'>
                        <CustomInput
                            name='firstname'
                            placeholder="First Name"
                            label="First Name"
                            register={register}
                        />
                        <CustomInput
                            name='Lastname'
                            placeholder="Last Name"
                            label="Last Name"
                            register={register}
                        />
                        <div className='flex items-center justify-center gap-2 w-full'>
                            <div className='w-full'>
                                <label className="w-full text-left text-xs text-grey100 font-medium mb-0.5">
                                    Select Date
                                </label>
                                <CustomDatePicker
                                    date={scheduleDate}
                                    setDate={setScheduleDate}
                                    toggleClassName='-right-20'
                                    toggleButton={
                                        <div className="flex w-full items-center justify-between rounded-lg bg-gray-100 p-3 text-xs font-medium">
                                            <p className='whitespace-nowrap'>{dayjs(scheduleDate).format("DD MMM YYYY")}</p>
                                            <div><IoCalendarOutline className="h-5 w-5 text-grey100" /></div>
                                        </div>
                                    }
                                />
                            </div>
                            <Combobox
                                value={source}
                                options={options}
                                handleSelect={handleSelectSource}
                                label='Source'
                                placeholder="Select Source"
                                mainClassName="w-full mt-1"
                                toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey whitespace-nowrap"
                                listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                                icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                                isSearch={false}
                            />
                        </div>
                    </div>
                    <div className='w-full flex gap-5 items-center justify-center my-4'>
                        <CustomInput
                            name='mobile'
                            label="Mobile No."
                            placeholder="Mobile No."
                            register={register}
                        />
                        <CustomInput
                            name='email'
                            label="Email"
                            placeholder="Email"
                            type="text"
                            register={register}
                        />
                        <div className='flex items-center justify-center gap-2 w-full'>
                            <Combobox
                                value={gender}
                                options={options}
                                handleSelect={handleSelectGender}
                                label='Gender'
                                placeholder="Gender"
                                mainClassName="w-full"
                                toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                                listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                                icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                                isSearch={false}
                            />
                            <Combobox
                                value={nationality}
                                options={options}
                                handleSelect={handleSelectNationality}
                                label='Nationality'
                                placeholder="Nationality"
                                mainClassName="w-full"
                                toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                                listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                                listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                                icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                                isSearch={false}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end gap-3 w-full mt-7'>
                        <CustomButton
                            name='Cancel'
                            handleClick={closeModal}
                            style="bg-danger"
                        />
                        <CustomButton
                            name='Save'
                            handleClick={handleSubmit(handleSave)}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default AddCustomerModal