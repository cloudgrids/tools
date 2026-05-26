import React from "react";

export function Logo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      {...props}
    >
      <path
        d="M16 2L2 9v14l14 7 14-7V9L16 2Z"
        fill="url(#logo-grad-1)"
        fillOpacity="0.1"
        stroke="url(#logo-grad-1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 13l-5 2.5v5L16 23l5-2.5v-5L16 13Z"
        fill="url(#logo-grad-2)"
      />
      <path
        d="M16 2v11M2 9l14 7M30 9l-14 7"
        stroke="url(#logo-grad-1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="logo-grad-1"
          x1="2"
          y1="2"
          x2="30"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient
          id="logo-grad-2"
          x1="16"
          y1="13"
          x2="16"
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#60A5FA" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Logo;
