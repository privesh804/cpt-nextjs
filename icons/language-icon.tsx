import React from "react";

const LanguageIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="27"
      height="28"
      viewBox="0 0 27 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.5 26.5C20.4036 26.5 26 20.9036 26 14C26 7.09644 20.4036 1.5 13.5 1.5C6.59644 1.5 1 7.09644 1 14C1 20.9036 6.59644 26.5 13.5 26.5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="square"
      />
      <path
        d="M13.5 26.5C16.8333 23.4697 18.5 19.303 18.5 14C18.5 8.69697 16.8333 4.5303 13.5 1.5C10.1667 4.5303 8.5 8.69697 8.5 14C8.5 19.303 10.1667 23.4697 13.5 26.5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M1.625 10.25H25.375M1.625 17.75H25.375"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LanguageIcon;
