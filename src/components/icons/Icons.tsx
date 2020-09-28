import React from "react";

export const EvergreenLogo = () => (
  <svg width="14" height="28" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.884 0C4.59 8.35 2.294 16.864 0 25.214c2.032-.246 3.934-.49 6.065-.818-.528 3.34 0 .235-.528 3.604h2.858l-.527-3.604c.164 0 2.95.49 5.737.982-.82-3.438-3.77-1.99-6.72-5.92 1.638.818 4.425 1.5 5.9 1.663-.983-3.438-3.278-1.5-5.9-4.938 1.31.655 3.605 1.172 4.917 1.5-.984-3.439-2.623-1.827-4.918-4.774 1.148.49 2.95 1.008 3.934 1.335-.82-3.438-1.803-2.154-3.934-4.774.984.492 2.131.845 2.95 1.172-.382-1.527-.621-2.063-.968-2.449-.396-.441-.933-.687-1.982-1.997.656.327 1.311.68 1.967.844-.82-2.947-.164-1.99-1.967-4.119.492.164.656.354.984.517L6.884 0z"
      fill="#71CC97"
      fillRule="evenodd"
    />
  </svg>
);

export const Pause = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="14">
    <path
      fill="currentColor"
      fillRule="nonzero"
      d="M.4 0C.2 0 0 .2 0 .4v13.2c0 .2.2.4.4.4h3.8l.3-.1.1-.3V.4c0-.2-.2-.4-.4-.4H.4zm6.4 0c-.2 0-.4.2-.4.4V14l.4.1h3.8l.3-.1.1-.3V.4l-.1-.3-.3-.1H6.8z"
    />
  </svg>
);

export const Play = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14">
    <g fill="none">
      <path
        fill="currentColor"
        d="M12.3 5.8L2.3.2C1.2-.4 0 .3 0 1.4v11.2c0 1 1.2 1.7 2.2 1.2l10-5.6c1-.5 1-1.9 0-2.4"
        mask="url(#a)"
      />
    </g>
  </svg>
);

export const FailedIcon = () => (
  <svg width="22px" height="22px" viewBox="0 0 22 22">
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-1124.000000, -648.000000)">
        <g transform="translate(1125.000000, 649.000000)">
          <circle stroke="#CF4A22" strokeWidth={2} cx={10} cy={10} r={10} />
          <g transform="translate(4.000000, 4.000000)" fill="#CF4A22">
            <path d="M6.55144413,0.144677043 C6.73102168,0.245689415 6.87941035,0.394078077 6.98042272,0.573655627 L11.8068443,9.15396066 C12.1114536,9.69548827 11.9193933,10.3814178 11.3778657,10.686027 C11.2094739,10.7807474 11.0195258,10.8305046 10.8263218,10.8305046 L1.17347866,10.8305046 C0.552158315,10.8305046 0.048478659,10.3268249 0.048478659,9.70550455 C0.048478659,9.51230059 0.0982357656,9.32235251 0.19295618,9.15396066 L5.01937776,0.573655627 C5.32398704,0.0321280151 6.00991652,-0.159932239 6.55144413,0.144677043 Z M5.99990024,7.77630533 C5.48213329,7.77630533 5.06240024,8.19603838 5.06240024,8.71380533 C5.06240024,9.23157229 5.48213329,9.65130533 5.99990024,9.65130533 C6.51766719,9.65130533 6.93740024,9.23157229 6.93740024,8.71380533 C6.93740024,8.19603838 6.51766719,7.77630533 5.99990024,7.77630533 Z M6.93740024,3.27630533 L5.06240024,3.27630533 L5.24990024,7.02630533 L6.74990024,7.02630533 L6.93740024,3.27630533 Z" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export const RunningIcon = () => (
  <svg width="22px" height="22px" viewBox="0 0 22 22">
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-1124.000000, -566.000000)">
        <g id="Group-4" transform="translate(1125.000000, 567.000000)">
          <circle
            id="Oval"
            stroke="#007CAD"
            strokeWidth={2}
            cx={10}
            cy={10}
            r={10}
          />
          <path
            d="M10,17 C13.8659932,17 17,13.8659932 17,10 C17,6.13400675 13.8659932,3 10,3 C10,5.32759884 10,8.42828353 10,10 C3.27975701,11.9656673 10,10 3.27975701,11.9656673 C4.12925531,14.8747832 6.81644217,17 10,17 Z"
            id="Oval"
            fill="#007CAD"
          />
        </g>
      </g>
    </g>
  </svg>
);

export const SucceededIcon = () => (
  <svg width="22px" height="22px" viewBox="0 0 22 22">
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-1052.000000, -648.000000)">
        <g id="Group-6" transform="translate(1053.000000, 649.000000)">
          <g
            id="Glyphs-/-Checkmark"
            transform="translate(2.000000, 2.000000)"
            fill="#13AA52"
          >
            <path
              d="M13.3137085,4 L14.7279221,5.41421356 L6.94974747,13.1923882 L2,8.24264069 L3.41421356,6.82842712 L6.949,10.364 L13.3137085,4 Z"
              id="Fill-/-All"
            />
          </g>
          <circle stroke="#13AA52" strokeWidth={2} cx={10} cy={10} r={10} />
        </g>
      </g>
    </g>
  </svg>
);
