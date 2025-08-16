import React from "react";

interface InputProps {
  id: string;
  name?: string; // Add name prop
  label: string;
  type?: "text" | "date" | "select" | "email" | "file" | "area";
  value?: string;
  options?: string[];
  required?: boolean; // Add required prop for better UX
  onChange?: (
      e: React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
  ) => void;
}

const FloatingInput: React.FC<InputProps> = ({
                                               id,
                                               name,
                                               label,
                                               type = "text",
                                               value,
                                               options,
                                               required = false,
                                               onChange,
                                             }) => {
  // Use name prop if provided, otherwise fall back to id
  const inputName = name || id;

  return (
      <div className="relative w-full">
        {type === "select" ? (
            <select
                id={id}
                name={inputName}
                value={value}
                onChange={onChange}
                required={required}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-cyan/25 rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
            >
              {options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
              ))}
            </select>
        ) : type === "area" ? (
            <textarea
                id={id}
                name={inputName}
                value={value}
                onChange={onChange}
                required={required}
                className="block h-32 w-full resize-none px-2.5 pt-4 pb-2.5 text-sm text-gray-900 bg-cyan/25 rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
                placeholder=" "
                rows={5}
            />
        ) : (
            <input
                type={type}
                id={id}
                name={inputName}
                value={value}
                onChange={onChange}
                required={required}
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-cyan/25 rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
                placeholder=" "
            />
        )}
        <label
            htmlFor={id}
            className={`absolute text-sm text-gray-800 capitalize duration-300 transform z-10 origin-[0] bg-cyan/5 px-2 start-1
        peer-placeholder-shown:scale-100
        peer-placeholder-shown:-translate-y-1/2
        peer-focus:top-2
        peer-focus:bg-white
        peer-focus:scale-75
        peer-focus:-translate-y-4
        rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto
        ${
                type === "area"
                    ? "top-2 scale-75 -translate-y-4 peer-placeholder-shown:top-1/4"
                    : " peer-placeholder-shown:top-1/2 -translate-y-4 scale-75 top-1"
            }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
  );
};

export default FloatingInput;