import React, { useState } from 'react'
import Modal from '../../ui/Modal'
import CustomInput from '../../ui/CustomInput'
import Combobox from '../../ui/Combobox'
import { RiArrowDownSLine } from "react-icons/ri";
import CustomButton from '../../ui/CustomButton';

interface AddAddressModalProps {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const emiratesOption = [
    { id: 1, name: 'abc' },
    { id: 2, name: 'xyz' },
    { id: 3, name: 'asd' },
]
const AddAddressModal = ({ open, setOpen }: AddAddressModalProps) => {
    const [emirate, setEmirate] = useState<ListOptionProps | null>(null);
    const [villa, setVilla] = useState<ListOptionProps | null>(null);

    const handleSelect = (value: ListOptionProps) => {
        setEmirate(value)
    }

    const handleSubmit=()=>{
        closeModal()
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
                            type="text"
                            value={''}
                            setter={() => { }}
                            placeholder="Address Type"
                            label="Address Type"
                        />
                        <Combobox
                            value={emirate}
                            options={emiratesOption}
                            handleSelect={handleSelect}
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
                            handleSelect={(value)=>setVilla(value)}
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
                            label="Steet"
                            placeholder="Steet"
                            type="text"
                            value={''}
                            setter={() => { }}
                        />
                        <CustomInput
                            label="Building"
                            placeholder="Building Name"
                            type="text"
                            value={''}
                            setter={() => { }}
                        />
                        <CustomInput
                            label="Villa / Apartment No."
                            placeholder="Villa / Apartment No."
                            type="text"
                            value={''}
                            setter={() => { }}
                        />
                    </div>
                    <div className='w-full flex gap-5 items-center justify-center'>
                        <div className='w-[50%]'>
                        <CustomInput
                            label="Steet"
                            placeholder="Steet"
                            type="text"
                            value={''}
                            setter={() => { }}
                        />
                        </div>
                        <div className='w-full'>
                            <CustomInput
                                label="Map Link"
                                placeholder="Map Link"
                                type="text"
                                value={''}
                                setter={() => { }}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end gap-3 w-full mt-7'>
                        <CustomButton name='Cancel' handleClick={closeModal} style="bg-danger"/>
                        <CustomButton name='Save' handleClick={handleSubmit}/>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default AddAddressModal