import { ChangeEvent } from "react";

interface FloatingTextareaProps {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  id?: string;
}

const FloatingTextarea = ({
  label,
  value,
  onChange,
  rows = 4,
  id,
}: FloatingTextareaProps) => {
  return (
    <div className="relative w-full">
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 rounded-2xl bg-cyan/25 appearance-none focus:outline-none focus:ring-0 peer resize-none"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className="absolute text-sm capitalize text-gray-500 duration-300 transform z-10 origin-[0] bg-cyan/5 px-3 start-1
              peer-placeholder-shown:scale-100
              peer-placeholder-shown:-translate-y-1/2
              peer-focus:top-2
              peer-focus:scale-75
              peer-focus:bg-white
              peer-focus:-translate-y-4
              rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto
              peer-placeholder-shown:top-1/2 -translate-y-4 scale-75 top-1"
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingTextarea; 