interface Props {
    color?: string;
    size?: string;
  }

const Shield = ({ size = "20", color = "currentColor" }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 17 16"
      fill="none"
    >
      <g clipPath="url(#clip0_77_122)">
        <path
          d="M8.56251 0C8.70626 0 8.85001 0.03125 8.98126 0.090625L14.8656 2.5875C15.5531 2.87813 16.0656 3.55625 16.0625 4.375C16.0469 7.475 14.7719 13.1469 9.38751 15.725C8.86564 15.975 8.25939 15.975 7.73751 15.725C2.35314 13.1469 1.07814 7.475 1.06251 4.375C1.05939 3.55625 1.57189 2.87813 2.25939 2.5875L8.14689 0.090625C8.27501 0.03125 8.41876 0 8.56251 0ZM8.56251 2.0875V13.9C12.875 11.8125 14.0344 7.19062 14.0625 4.41875L8.56251 2.0875Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_77_122">
          <path d="M0.5625 0H16.5625V16H0.5625V0Z" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Shield;
