interface Props {
  color?: string;
  size?: string;
}

const Lock = ({ size = "20", color = "currentColor" }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 15 16"
      fill="none"
    >
      <g clipPath="url(#clip0_77_127)">
        <path
          d="M4.71875 4.5V6H9.71875V4.5C9.71875 3.11875 8.6 2 7.21875 2C5.8375 2 4.71875 3.11875 4.71875 4.5ZM2.71875 6V4.5C2.71875 2.01562 4.73438 0 7.21875 0C9.70312 0 11.7188 2.01562 11.7188 4.5V6H12.2188C13.3219 6 14.2188 6.89687 14.2188 8V14C14.2188 15.1031 13.3219 16 12.2188 16H2.21875C1.11563 16 0.21875 15.1031 0.21875 14V8C0.21875 6.89687 1.11563 6 2.21875 6H2.71875Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_77_127">
          <path d="M0.21875 0H14.2188V16H0.21875V0Z" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Lock;
