import React from 'react';
import { Link } from 'react-router-dom';

export interface LogoIconProps {
  className?: string;
  size?: number | string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({
  className = 'w-8 h-8',
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
      style={style}
      aria-hidden="true"
    >
      <g transform="translate(-288,-288)">
        <path
          d="m 298,297 h 49 v 6 h -49 z"
          fill="#3e4f59"
          fillRule="evenodd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 298,303 h 49 v 40 h -49 z"
          fill="#acbec2"
          fillRule="evenodd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 298,303 v 40 h 29.76953 a 28.484051,41.392605 35.599482 0 0 18.625,-40 z"
          fill="#e8edee"
          fillRule="evenodd"
          stroke="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 300,296 c -1.64501,0 -3,1.355 -3,3 v 40 c 0,0.55229 0.44772,1 1,1 0.55229,0 1,-0.44771 1,-1 v -40 c 0,-0.56413 0.43587,-1 1,-1 h 45 c 0.56413,0 1,0.43587 1,1 v 3 h -42 c -0.55228,0 -1,0.44772 -1,1 0,0.55229 0.44772,1 1,1 h 42 v 37 c 0,0.56413 -0.43587,1 -1,1 h -49 c -0.55228,0 -1,0.44772 -1,1 0,0.55229 0.44772,1 1,1 h 49 c 1.64501,0 3,-1.35499 3,-3 0,-14 0,-28 0,-42 0,-1.645 -1.35499,-3 -3,-3 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 343,299 c -0.55228,0 -1,0.44772 -1,1 0,0.55229 0.44772,1 1,1 0.55229,0 1,-0.44771 1,-1 0,-0.55228 -0.44771,-1 -1,-1 z"
          fill="#ed7161"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 339,299 c -0.55228,0 -1,0.44772 -1,1 0,0.55229 0.44772,1 1,1 0.55229,0 1,-0.44771 1,-1 0,-0.55228 -0.44771,-1 -1,-1 z"
          fill="#ecba16"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 335,299 c -0.55228,0 -1,0.44772 -1,1 0,0.55229 0.44772,1 1,1 0.55229,0 1,-0.44771 1,-1 0,-0.55228 -0.44771,-1 -1,-1 z"
          fill="#42b05c"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 293,342 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 301,302 c -0.55228,0 -1,0.44772 -1,1 0,0.55229 0.44772,1 1,1 0.55229,0 1,-0.44771 1,-1 0,-0.55228 -0.44771,-1 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 319,307.06836 a 1,1 0 0 0 -1,1 v 28.86328 a 1,1 0 0 0 1,1 1,1 0 0 0 1,-1 v -28.86328 a 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 310,326 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 5 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 303,326 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 3 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 303,332 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 12 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 332,309 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 9 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 324,309 c -0.55228,0 -1,0.44771 -1,1 0,0.55228 0.44772,1 1,1 0.55229,0 1,-0.44772 1,-1 0,-0.55229 -0.44771,-1 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 332,325 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 9 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 324,325 c -0.55228,0 -1,0.44771 -1,1 0,0.55228 0.44772,1 1,1 0.55229,0 1,-0.44772 1,-1 0,-0.55229 -0.44771,-1 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 324,317 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 17 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 324,334 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 17 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 312.00001,312 a 2.99999,2.99999 0 0 1 -2.99999,3 2.99999,2.99999 0 0 1 -2.99999,-3 2.99999,2.99999 0 0 1 2.99999,-2.99998 2.99999,2.99999 0 0 1 2.99999,2.99998 z"
          fill="#ffa221"
          fillRule="evenodd"
          stroke="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 304.00002,321 c 0,-3.31371 2.23858,-6 5,-6 2.76142,0 4.99998,2.68629 4.99998,6 z"
          fill="#ffa221"
          fillRule="evenodd"
          stroke="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 307.82621,309.24415 a 2.99999,2.99999 0 0 0 -1.82617,2.75586 2.99999,2.99999 0 0 0 3,3 2.99999,2.99999 0 0 0 0.68555,-0.0801 5.7604036,9.6529589 0 0 0 -1.85938,-5.67578 z"
          fill="#ffc343"
          fillRule="evenodd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 309.00004,315.00001 c -2.76142,0 -5,2.68629 -5,6 h 5.07227 a 5.7604036,9.6529589 0 0 0 0.6875,-4.54297 5.7604036,9.6529589 0 0 0 -0.0606,-1.39844 C 309.47078,315.0202 309.23732,315 309.00004,315 Z"
          fill="#ffc343"
          fillRule="evenodd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
        <path
          d="m 309.00004,308.00001 c -2.19728,0 -3.99999,1.80272 -4,4 0,1.09667 0.44883,2.09529 1.17188,2.82031 -1.91443,1.19449 -3.17188,3.55834 -3.17188,6.17969 a 1.000105,1.000105 0 0 0 1,1 h 4 a 1.000005,1.000005 0 0 0 1,-1 1.000005,1.000005 0 0 0 -1,-1 h -2.83594 c 0.39188,-2.32414 1.98868,-4 3.83594,-4 1.84726,0 3.44406,1.67586 3.83594,4 h -0.83594 a 1.000005,1.000005 0 0 0 -1,1 1.000005,1.000005 0 0 0 1,1 h 2 a 1.000105,1.000105 0 0 0 1,-1 c 0,-2.62135 -1.25745,-4.9852 -3.17188,-6.17969 0.72305,-0.72502 1.17188,-1.72364 1.17188,-2.82031 -1e-5,-2.19728 -1.80272,-4 -4,-4 z m 0,2 c 1.1164,0 2,0.8836 2,2 0,1.11641 -0.88359,2 -2,2 -1.11641,0 -2,-0.88359 -2,-2 0,-1.1164 0.8836,-2 2,-2 z"
          fill="#000000"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="4.1"
        />
      </g>
    </svg>
  );
};

export interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  text?: string;
  to?: string | null;
}

const SIZE_CONFIGS = {
  sm: {
    icon: 'w-6 h-6',
    text: 'text-sm font-bold tracking-tight',
    gap: 'gap-2',
  },
  md: {
    icon: 'w-8 h-8',
    text: 'font-title-lg text-title-lg font-bold tracking-tight',
    gap: 'gap-2.5',
  },
  lg: {
    icon: 'w-10 h-10',
    text: 'text-2xl font-bold tracking-tight',
    gap: 'gap-3',
  },
  xl: {
    icon: 'w-14 h-14',
    text: 'text-3xl font-extrabold tracking-tight',
    gap: 'gap-3.5',
  },
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  iconClassName = '',
  textClassName = '',
  size = 'md',
  showText = true,
  text = 'ProHub',
  to = '/',
}) => {
  const config = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;
  const content = (
    <span className={`inline-flex items-center ${config.gap} group select-none ${className}`}>
      <LogoIcon className={`${config.icon} transition-transform duration-200 group-hover:scale-105 ${iconClassName}`} />
      {showText && (
        <span className={`${config.text} text-primary group-hover:opacity-95 transition-opacity ${textClassName}`}>
          {text}
        </span>
      )}
    </span>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center no-underline focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
