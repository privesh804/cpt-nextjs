import React from "react";

const TotalExpensesIcon: React.FC<LogoProps> = (props) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 71 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M35.4988 34.0258H68.9999C69.009 38.2305 68.1482 42.3954 66.4671 46.2806C64.786 50.1659 62.3179 53.6948 59.2048 56.6643L35.4988 34.0258ZM35.4988 34.0258V1.9292C29.9887 1.92958 24.5638 3.22959 19.7047 5.71405C14.8456 8.19851 10.7023 11.7907 7.64207 16.1724C4.58179 20.554 2.69897 25.5898 2.16041 30.8336C1.62186 36.0774 2.4442 41.3673 4.55459 46.2345C6.66497 51.1018 9.99824 55.3961 14.259 58.7371C18.5198 62.078 23.5766 64.3624 28.9814 65.3878C34.3861 66.4133 39.9719 66.1481 45.2438 64.6158C50.5157 63.0835 55.311 60.3313 59.2048 56.6033"
        stroke="#71D467"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export default TotalExpensesIcon;