import React from "react";

const TaskManagementIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.9624 9.59961H20.5249"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.4751 9.59961L7.4126 10.5371L10.2251 7.72461"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.9624 18.3501H20.5249"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.4751 18.3501L7.4126 19.2876L10.2251 16.4751"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 26H17.25C23.5 26 26 23.5 26 17.25V9.75C26 3.5 23.5 1 17.25 1H9.75C3.5 1 1 3.5 1 9.75V17.25C1 23.5 3.5 26 9.75 26Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TaskManagementIcon;
