import { useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface ColorPickerProps {
  label?: string;
  value: string;
  setter: (value: string) => void;
}
const ColorPicker = ({ label, value, setter }: ColorPickerProps) => {
  const [showPicker, setShowPicker] = useState(false)
  const userRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(userRef, () => setShowPicker(false));

  const handleChange = (color: any) => {
    setter(color.hex)
  }

  return (
    <div ref={userRef} className="col-span-1 flex w-full flex-col items-start justify-start gap-1 relative">
      <label
        htmlFor="Service Color"
        className="w-full text-left text-xs text-gray-500"
      >
        {label}
      </label>
      <div
        className='w-full cursor-pointer rounded-lg border border-gray-200 p-2 h-10'
        onClick={() => setShowPicker(!showPicker)}
      >
        <div
          style={{
            backgroundColor: value || '#000000'
          }}
          className='w-full h-full'></div>
      </div>
      {showPicker && (
        <div className='absolute -top-[290px] left-0 w-full h-full z-10'>
          <SketchPicker
            onChange={handleChange}
            color={value}
          />
        </div>
      )}
    </div>
  )
}

export default ColorPicker