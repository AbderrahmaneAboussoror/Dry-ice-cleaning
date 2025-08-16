import SelectBase, { StylesConfig, GroupBase } from "react-select";

interface OptionType {
  value: string;
  label: string;
}

interface Props {
  options: OptionType[];
  placeholder?: string;
  onChange?: (selectedOption: OptionType | null) => void;
  value?: OptionType | null;
}

const CustomSelect = ({
  options,
  placeholder = "Choisir une langue",
  onChange,
  value,
}: Props) => {
  const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
    control: (base) => ({
      ...base,
      backgroundColor: "transparent",
      border: "none",
      borderColor: "transparent",
      boxShadow: "none",
      minHeight: "auto",
      fontSize: "14px",
      "&:hover": {
        borderColor: "transparent",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0",
    }),
    input: (base) => ({
      ...base,
      margin: "0",
      padding: "0",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0",
      color: "#666",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#26687D"
        : state.isFocused
        ? "#f3f3f3"
        : "#fff",
      color: state.isSelected ? "#fff" : "#333",
      cursor: "pointer",
      padding: "10px",
      fontSize: "14px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#333",
      fontSize: "14px",
      margin: "0",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      marginTop: "4px",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#999",
      fontSize: "14px",
      margin: "0",
    }),
  };

  return (
    <SelectBase<OptionType>
      options={options}
      styles={customStyles}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      isSearchable={false}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  );
};

export default CustomSelect;
