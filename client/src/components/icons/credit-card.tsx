interface Props {
  color?: string;
  size?: string;
}

const CreditCard = ({ size = "20", color = "currentColor" }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 23 21"
      fill="none"
    >
      <g clip-path="url(#clip0_62_1573)">
        <path
          d="M2.5 1.75C1.12109 1.75 0 2.87109 0 4.25V5.5H22.5V4.25C22.5 2.87109 21.3789 1.75 20 1.75H2.5ZM22.5 9.25H0V16.75C0 18.1289 1.12109 19.25 2.5 19.25H20C21.3789 19.25 22.5 18.1289 22.5 16.75V9.25ZM4.375 14.25H6.875C7.21875 14.25 7.5 14.5312 7.5 14.875C7.5 15.2188 7.21875 15.5 6.875 15.5H4.375C4.03125 15.5 3.75 15.2188 3.75 14.875C3.75 14.5312 4.03125 14.25 4.375 14.25ZM8.75 14.875C8.75 14.5312 9.03125 14.25 9.375 14.25H14.375C14.7188 14.25 15 14.5312 15 14.875C15 15.2188 14.7188 15.5 14.375 15.5H9.375C9.03125 15.5 8.75 15.2188 8.75 14.875Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_62_1573">
          <path d="M0 0.5H22.5V20.5H0V0.5Z" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CreditCard;
