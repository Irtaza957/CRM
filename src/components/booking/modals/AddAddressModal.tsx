import React, { useState } from 'react'
import Modal from '../../ui/Modal'
import CustomInput from '../../ui/CustomInput'
import Combobox from '../../ui/Combobox'
import { RiArrowDownSLine } from "react-icons/ri";
import CustomButton from '../../ui/CustomButton';
import { useAddAddressMutation } from '../../../store/services/booking';
import { useForm } from 'react-hook-form';

interface AddAddressModalProps {
    open: boolean,
    customerId?: string,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const emiratesOption = [
    { id: 1, name: 'abc' },
    { id: 2, name: 'xyz' },
    { id: 3, name: 'asd' },
]
const AddAddressModal = ({ open, customerId, setOpen }: AddAddressModalProps) => {
    const [emirate, setEmirate] = useState<ListOptionProps | null>(null);
    const [villa, setVilla] = useState<ListOptionProps | null>(null);

    const [addAddress, { isLoading }] = useAddAddressMutation();

    const {
        register,
        setValue,
        reset,
        handleSubmit,
      } = useForm();

    const handleSelectEmirate = (value: ListOptionProps) => {
        setEmirate(value)
        setValue("emirate_id", value.id); 
    }

    const handleSelectArea = (value: ListOptionProps) => {
        setVilla(value)
        setValue("area_id", value.id); 
    }

    const handleSave = async (data) => {
        try {
            if(customerId){
            const payload = {
                customer_id: customerId,
                address_type: data?.address_type,
                area_id: data?.area_id,
                building_no: data?.building_no,
                apartment: data?.apartment,
                street: data?.street,
                map_link: data?.map_link,
                extra_direction: data?.extra_direction
            }
                await addAddress(payload)
                reset()
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const closeModal=()=>{
        setOpen(false)
    }
    return (
        <Modal
            open={open}
            setOpen={setOpen}
            mainClassName="!z-[99999]"
            className="w-[60%] max-w-[80%]"
            title='Address'
        >
            <div className='w-full px-6 py-7'>
                <p className='text-left text-[18px] text-primary font-bold'>Address Details</p>
                <div className='mt-4 w-full'>
                    <div className='w-full flex gap-5 items-center justify-center'>
                        <CustomInput
                            name='address_type'
                            placeholder="Address Type"
                            label="Address Type"
                            register={register}
                        />
                        <Combobox
                            value={emirate}
                            options={emiratesOption}
                            handleSelect={handleSelectEmirate}
                            label='Emirate'
                            placeholder="Select Emirate"
                            mainClassName="w-full"
                            toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                            listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                            icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                            isSearch={false}
                        />
                        <Combobox
                            value={villa}
                            options={emiratesOption}
                            handleSelect={handleSelectArea}
                            label='Area'
                            placeholder="Select Area"
                            mainClassName="w-full"
                            toggleClassName="w-full p-3 rounded-lg text-xs text-grey100 bg-grey"
                            listClassName="w-full top-[64px] max-h-52 border rounded-lg z-20 bg-white"
                            listItemClassName="w-full text-left px-3 py-1.5 hover:bg-primary/20 text-xs space-x-1.5"
                            icon={<RiArrowDownSLine className="size-5 text-grey100" />}
                            isSearch={false}
                        />
                    </div>
                    <div className='w-full flex gap-5 items-center justify-center my-4'>
                        <CustomInput
                            name='street'
                            label="Steet"
                            placeholder="Steet"
                            register={register}
                        />
                        <CustomInput
                            name='building_no'
                            label="Building"
                            placeholder="Building Name"
                            type="text"
                            register={register}
                        />
                        <CustomInput
                            label="Villa / Apartment No."
                            placeholder="Villa / Apartment No."
                            name='apartment'
                            type="text"
                            register={register}
                        />
                    </div>
                    <div className='w-full flex gap-5 items-center justify-center'>
                        <div className='w-[50%]'>
                        <CustomInput
                            label="Extra Direction"
                            placeholder="Type..."
                            name='extra_direction'
                            type="text"
                            register={register}
                        />
                        </div>
                        <div className='w-full'>
                            <CustomInput
                                label="Map Link"
                                placeholder="Map Link"
                                name='map_link'
                                type="text"
                                register={register}
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
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default AddAddressModal