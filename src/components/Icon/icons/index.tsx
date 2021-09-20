import { Size } from "@leafygreen-ui/icon";

// Mock leafygreen-ui/icon Prop types
interface LeafygreenIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | Size;
  role?: "presentation" | "img";
}

export const EvergreenLogo: React.ComponentType<LeafygreenIconProps> = () => (
  <svg width="14" height="28" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6.884 0C4.59 8.35 2.294 16.864 0 25.214c2.032-.246 3.934-.49 6.065-.818-.528 3.34 0 .235-.528 3.604h2.858l-.527-3.604c.164 0 2.95.49 5.737.982-.82-3.438-3.77-1.99-6.72-5.92 1.638.818 4.425 1.5 5.9 1.663-.983-3.438-3.278-1.5-5.9-4.938 1.31.655 3.605 1.172 4.917 1.5-.984-3.439-2.623-1.827-4.918-4.774 1.148.49 2.95 1.008 3.934 1.335-.82-3.438-1.803-2.154-3.934-4.774.984.492 2.131.845 2.95 1.172-.382-1.527-.621-2.063-.968-2.449-.396-.441-.933-.687-1.982-1.997.656.327 1.311.68 1.967.844-.82-2.947-.164-1.99-1.967-4.119.492.164.656.354.984.517L6.884 0z"
      fill="#71CC97"
      fillRule="evenodd"
    />
  </svg>
);

export const KnownFailureIcon: React.ComponentType<LeafygreenIconProps> = ({
  fill,
  size = 16,
}) => (
  <svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <path
      d="M9.38138 6.37605L10.0001 6.99477L10.6188 6.37605L15.5686 1.42631C16.0079 0.986967 16.7202 0.986967 17.1596 1.42631L18.5738 2.84052C19.0131 3.27986 19.0131 3.99217 18.5738 4.43151L13.624 9.38126L13.0053 9.99998L13.624 10.6187L18.5738 15.5684C19.0131 16.0078 19.0131 16.7201 18.5738 17.1594L17.1596 18.5736C16.7202 19.013 16.0079 19.013 15.5686 18.5736L10.6188 13.6239L10.0001 13.0052L9.38138 13.6239L4.43163 18.5736C3.99229 19.013 3.27998 19.013 2.84064 18.5736L1.42643 17.1594C0.98709 16.7201 0.987089 16.0078 1.42643 15.5684L6.37618 10.6187L6.99489 9.99998L6.37618 9.38126L1.42643 4.43151C0.987089 3.99217 0.987089 3.27986 1.42643 2.84052L2.84064 1.42631C3.27998 0.986967 3.99229 0.986967 4.43163 1.42631L9.38138 6.37605Z"
      stroke={fill}
      strokeWidth="1.75"
    />
  </svg>
);

export const SetupFailure: React.ComponentType<LeafygreenIconProps> = ({
  fill,
  size = 16,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="currentColor">
    <path
      d="M26.2 22L17.34 13.16C17.2842 13.1067 17.2182 13.0651 17.1461 13.0377C17.074 13.0102 16.9971 12.9974 16.92 13C16.8425 12.9935 16.7645 13.0046 16.6918 13.0323C16.6191 13.06 16.5536 13.1036 16.5 13.16L16 13.58L13.54 16.12L13.12 16.54V16.68C13.0438 16.7807 13.0025 16.9036 13.0025 17.03C13.0025 17.1563 13.0438 17.2792 13.12 17.38L22 26.24C22.267 26.5405 22.592 26.7838 22.9555 26.9554C23.319 27.127 23.7134 27.2233 24.1151 27.2385C24.5168 27.2537 24.9173 27.1875 25.2927 27.0438C25.6681 26.9001 26.0106 26.682 26.2995 26.4025C26.5884 26.1231 26.8178 25.7881 26.9739 25.4176C27.1299 25.0472 27.2095 24.6491 27.2076 24.2471C27.2058 23.8451 27.1227 23.4477 26.9633 23.0787C26.8039 22.7097 26.5714 22.3768 26.28 22.1L26.2 22Z"
      fill={fill}
    />
    <path
      d="M3.7 5.12L12.62 14.28L13.52 13.38L14.54 12.36L4.82 3.82L5.68 2.96L2.34 0.439998L0.360001 2.54L2.9 5.92L3.7 5.12Z"
      fill={fill}
    />
    <path
      d="M11.34 15.7L9.64 14L1.22 22.42C0.64183 22.9982 0.317017 23.7823 0.317017 24.6C0.317017 25.4177 0.64183 26.2018 1.22 26.78C1.79817 27.3582 2.58234 27.683 3.4 27.683C4.21766 27.683 5.00183 27.3582 5.58 26.78L12.66 19.7L11.74 18.76C11.3436 18.3664 11.0892 17.8523 11.0168 17.2984C10.9444 16.7445 11.0581 16.1822 11.34 15.7Z"
      fill={fill}
    />
    <path
      d="M14.14 9.49999L16 11.26C16.3274 11.1121 16.6809 11.0305 17.04 11.02C17.3711 11.0183 17.6991 11.0829 18.0048 11.21C18.3106 11.3371 18.5877 11.5241 18.82 11.76L20.86 14C21.193 14.0199 21.527 14.0199 21.86 14C23.6375 13.7331 25.2371 12.7733 26.309 11.3304C27.3808 9.88747 27.8378 8.07887 27.58 6.29999C27.5678 6.18762 27.524 6.08099 27.4538 5.99239C27.3836 5.90379 27.2898 5.83682 27.1832 5.7992C27.0766 5.76157 26.9616 5.75483 26.8513 5.77974C26.7411 5.80465 26.6401 5.8602 26.56 5.93999L23.64 8.71999L20.2 7.79999L19.28 4.35999L22.18 1.43999C22.2735 1.3478 22.3363 1.22911 22.36 1.09999C22.3712 1.0211 22.3666 0.940757 22.3465 0.863657C22.3263 0.786557 22.291 0.714245 22.2426 0.650942C22.1942 0.587639 22.1337 0.534614 22.0645 0.494961C21.9954 0.455309 21.9191 0.429824 21.84 0.419994C20.6965 0.259678 19.531 0.392335 18.4527 0.805531C17.3745 1.21873 16.4188 1.89893 15.6752 2.78239C14.9317 3.66585 14.4246 4.72364 14.2016 5.85661C13.9785 6.98957 14.0468 8.16062 14.4 9.25999L14.14 9.49999Z"
      fill={fill}
    />
  </svg>
);

export const SystemFailure: React.ComponentType<LeafygreenIconProps> = ({
  fill,
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.76 21.56C15.5979 21.3931 15.4507 21.2124 15.32 21.02C14.6892 21.0018 14.0664 20.8732 13.48 20.64C12.788 20.4092 12.1507 20.039 11.6073 19.5524C11.0639 19.0657 10.626 18.4729 10.3205 17.8105C10.0151 17.1481 9.84857 16.4301 9.83129 15.7009C9.81401 14.9716 9.94632 14.2466 10.2201 13.5705C10.4938 12.8943 10.9032 12.2814 11.4229 11.7696C11.9426 11.2578 12.5617 10.8579 13.242 10.5945C13.9222 10.3312 14.6492 10.21 15.3781 10.2385C16.107 10.2669 16.8223 10.4444 17.48 10.76C18.3347 11.1097 19.0822 11.6783 19.6474 12.4085C20.2126 13.1388 20.5757 14.0049 20.7 14.92C21.0518 15.0981 21.3753 15.3272 21.66 15.6L23.42 17.36L25.2 15.6C25.7376 15.0545 26.441 14.7028 27.2 14.6H27.44C27.44 14.36 27.44 14.1 27.44 13.86L28.42 13.14C28.6835 12.9457 28.8741 12.6686 28.9611 12.353C29.0481 12.0375 29.0266 11.7018 28.9 11.4L28.1 9.19998C27.9715 8.89766 27.7473 8.64587 27.4619 8.48328C27.1765 8.32069 26.8456 8.2563 26.52 8.29998L25.32 8.49998C24.5936 7.49779 23.7166 6.614 22.72 5.87998L22.9 4.67998C22.9425 4.35717 22.8773 4.02936 22.7146 3.74733C22.5519 3.4653 22.3007 3.2448 22 3.11998L19.82 2.19998C19.5074 2.06026 19.1564 2.03168 18.8253 2.11899C18.4943 2.20631 18.203 2.40427 18 2.67998L17.28 3.67998C16.0615 3.47998 14.8185 3.47998 13.6 3.67998L12.86 2.69998C12.6691 2.43812 12.3955 2.24828 12.0834 2.16118C11.7713 2.07408 11.4389 2.09479 11.14 2.21998L8.94 3.11998C8.64088 3.24534 8.39202 3.46672 8.23268 3.74919C8.07333 4.03166 8.01258 4.35915 8.06 4.67998L8.32 5.99998C7.32815 6.73171 6.45173 7.60814 5.72 8.59998L4.5 8.41998C4.17953 8.37604 3.8535 8.43829 3.57177 8.59721C3.29004 8.75614 3.06813 9.00298 2.94 9.29998L2 11.4C1.87336 11.7018 1.85184 12.0375 1.93889 12.353C2.02594 12.6686 2.21651 12.9457 2.48 13.14L3.46 13.86C3.27079 15.0794 3.27079 16.3206 3.46 17.54L2.48 18.28C2.21813 18.4709 2.0283 18.7445 1.94119 19.0566C1.85409 19.3687 1.87481 19.7011 2 20L2.9 22.2C3.02617 22.5029 3.25068 22.7544 3.53733 22.9141C3.82399 23.0737 4.15606 23.1322 4.48 23.08L5.68 22.9C6.41173 23.8918 7.28815 24.7683 8.28 25.5L8.1 26.72C8.06091 27.0424 8.12752 27.3688 8.28982 27.6501C8.45211 27.9314 8.70132 28.1524 9 28.28L11.18 29.18C11.4819 29.3066 11.8175 29.3281 12.1331 29.2411C12.4486 29.154 12.7258 28.9635 12.92 28.7L13.64 27.72C14.0046 27.7731 14.3718 27.8065 14.74 27.82C14.7002 27.323 14.767 26.8232 14.936 26.3541C15.105 25.885 15.3723 25.4574 15.72 25.1L17.5 23.34L15.76 21.56Z"
      fill={fill}
    />
    <path
      d="M26.36 23.34L26.62 23.06L28.52 21.18L29.68 20C29.928 19.746 30.0668 19.405 30.0668 19.05C30.0668 18.695 29.928 18.3541 29.68 18.1L28.74 17.16C28.5957 17.0139 28.4194 16.9035 28.2249 16.8376C28.0305 16.7716 27.8234 16.7519 27.62 16.78C27.3255 16.8181 27.0515 16.9516 26.84 17.16L23.5 20.48L20.54 17.5L20.18 17.16C20.0569 17.0324 19.9093 16.9309 19.7461 16.8615C19.5829 16.7922 19.4073 16.7565 19.23 16.7565C19.0527 16.7565 18.8771 16.7922 18.7139 16.8615C18.5507 16.9309 18.4031 17.0324 18.28 17.16L17.32 18.1C17.072 18.3541 16.9332 18.695 16.9332 19.05C16.9332 19.405 17.072 19.746 17.32 20L17.82 20.5L20.66 23.34L17.32 26.66C17.0853 26.9208 16.9554 27.2592 16.9554 27.61C16.9554 27.9608 17.0853 28.2993 17.32 28.56L18.28 29.5C18.4031 29.6276 18.5507 29.7291 18.7139 29.7985C18.8771 29.8678 19.0527 29.9035 19.23 29.9035C19.4073 29.9035 19.5829 29.8678 19.7461 29.7985C19.9093 29.7291 20.0569 29.6276 20.18 29.5L21 28.7L22.9 26.7L23.5 26.1L26.84 29.42C26.9631 29.5476 27.1107 29.6491 27.2739 29.7185C27.4371 29.7878 27.6127 29.8235 27.79 29.8235C27.9673 29.8235 28.1429 29.7878 28.3061 29.7185C28.4693 29.6491 28.6169 29.5476 28.74 29.42L29.68 28.48C29.928 28.226 30.0668 27.885 30.0668 27.53C30.0668 27.175 29.928 26.8341 29.68 26.58L26.36 23.34Z"
      fill={fill}
    />
  </svg>
);

export const TimedOut = ({ fill, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 30 29" fill="none">
    <path
      d="M25.68 23L28.7 19.98C28.8149 19.8682 28.9062 19.7345 28.9686 19.5867C29.031 19.439 29.0631 19.2803 29.0631 19.12C29.0631 18.9597 29.031 18.8009 28.9686 18.6532C28.9062 18.5055 28.8149 18.3718 28.7 18.26L27.84 17.4L27.42 17.12H27.28C27.0724 17.0668 26.8546 17.0684 26.6478 17.1245C26.441 17.1805 26.2523 17.2892 26.1 17.44L23 20.44L20.06 17.42C19.9482 17.3051 19.8145 17.2138 19.6667 17.1514C19.519 17.089 19.3603 17.0569 19.2 17.0569C19.0397 17.0569 18.8809 17.089 18.7332 17.1514C18.5855 17.2138 18.4518 17.3051 18.34 17.42L17.48 18.28C17.3651 18.3918 17.2738 18.5255 17.2114 18.6732C17.149 18.8209 17.1169 18.9797 17.1169 19.14C17.1169 19.3003 17.149 19.459 17.2114 19.6067C17.2738 19.7545 17.3651 19.8882 17.48 20L20.5 23L17.48 26.04C17.3392 26.1821 17.2361 26.3572 17.1803 26.5493C17.1244 26.7415 17.1174 26.9445 17.16 27.14V27.3L17.42 27.76L18.28 28.64C18.511 28.8624 18.8193 28.9867 19.14 28.9867C19.4607 28.9867 19.7689 28.8624 20 28.64L23 25.62L26.02 28.64C26.2544 28.8637 26.566 28.9886 26.89 28.9886C27.214 28.9886 27.5256 28.8637 27.76 28.64L28.62 27.76C28.7349 27.6482 28.8262 27.5145 28.8886 27.3667C28.951 27.219 28.9831 27.0603 28.9831 26.9C28.9831 26.7397 28.951 26.5809 28.8886 26.4332C28.8262 26.2855 28.7349 26.1518 28.62 26.04L25.68 23Z"
      fill={fill}
    />
    <path
      d="M14.26 0.999991C12.4687 0.93054 10.6818 1.22339 9.00637 1.86099C7.33094 2.49858 5.80145 3.46782 4.50954 4.71061C3.21762 5.95341 2.18986 7.4442 1.48783 9.09367C0.785804 10.7431 0.42395 12.5173 0.42395 14.31C0.42395 16.1026 0.785804 17.8768 1.48783 19.5263C2.18986 21.1758 3.21762 22.6666 4.50954 23.9094C5.80145 25.1522 7.33094 26.1214 9.00637 26.759C10.6818 27.3966 12.4687 27.6894 14.26 27.62H15.06H15C14.8792 27.0754 14.8984 26.5092 15.0557 25.974C15.2131 25.4389 15.5036 24.9524 15.9 24.56L17.44 23L15.96 21.5C15.6525 21.1892 15.4093 20.8207 15.2446 20.4157C15.0799 20.0107 14.9967 19.5772 15 19.14C15.0022 18.2391 15.3619 17.3759 16 16.74L16.86 15.88C17.4955 15.293 18.3351 14.9772 19.2 15C19.6448 14.9974 20.0858 15.0826 20.4977 15.2508C20.9095 15.4189 21.2841 15.6667 21.6 15.98L23.08 17.48L24.58 15.98C24.8962 15.6616 25.2737 15.4106 25.6896 15.2421C26.1056 15.0737 26.5513 14.9913 27 15C27.1928 14.9793 27.3872 14.9793 27.58 15C27.58 14.78 27.58 14.58 27.58 14.36C27.5853 12.6074 27.2446 10.871 26.5776 9.25036C25.9105 7.62969 24.9302 6.15658 23.6928 4.91546C22.4554 3.67434 20.9853 2.68962 19.3666 2.01773C17.7479 1.34584 16.0126 0.999983 14.26 0.999991ZM9.59999 15.7C9.42271 15.7 9.24716 15.6651 9.08337 15.5972C8.91958 15.5294 8.77076 15.4299 8.6454 15.3046C8.52004 15.1792 8.4206 15.0304 8.35276 14.8666C8.28491 14.7028 8.24999 14.5273 8.24999 14.35C8.24999 14.1727 8.28491 13.9972 8.35276 13.8334C8.4206 13.6696 8.52004 13.5208 8.6454 13.3954C8.77076 13.27 8.91958 13.1706 9.08337 13.1028C9.24716 13.0349 9.42271 13 9.59999 13H13.6V7.19999C13.5995 7.02052 13.6361 6.84289 13.7076 6.67827C13.7791 6.51366 13.8839 6.36563 14.0154 6.24351C14.1469 6.12139 14.3023 6.02782 14.4717 5.9687C14.6412 5.90958 14.8211 5.88618 15 5.89999C15.3466 5.89995 15.6794 6.03627 15.9264 6.27951C16.1734 6.52275 16.3147 6.85338 16.32 7.19999V14.38C16.32 14.7301 16.1809 15.0658 15.9334 15.3134C15.6858 15.5609 15.3501 15.7 15 15.7H9.59999Z"
      fill={fill}
    />
  </svg>
);

export const WillNotRun: React.ComponentType<LeafygreenIconProps> = ({
  fill,
  size = 16,
}) => (
  <svg width={size} height={size} viewBox="0 0 30 28" fill="none">
    <path
      d="M7.64 6.54C8.16669 6.48503 8.66672 6.28078 9.08126 5.95127C9.49581 5.62176 9.80762 5.18071 9.98 4.68V2.82C9.80863 2.31684 9.49758 1.87286 9.08321 1.53995C8.66884 1.20703 8.16826 0.998944 7.64 0.940002C7.39405 0.939988 7.15054 0.988753 6.92356 1.08348C6.69658 1.1782 6.49064 1.31699 6.31766 1.49184C6.14468 1.66668 6.00809 1.87409 5.9158 2.10207C5.82351 2.33005 5.77736 2.57407 5.78 2.82V4.68C5.77732 4.925 5.8236 5.16807 5.91613 5.39495C6.00866 5.62182 6.14556 5.82794 6.31881 6.00119C6.49207 6.17444 6.69818 6.31135 6.92505 6.40387C7.15193 6.4964 7.395 6.54268 7.64 6.54Z"
      fill={fill}
    />
    <path
      d="M17.56 20.62L15.84 18.9C15.2394 18.299 14.8809 17.4979 14.833 16.6496C14.785 15.8012 15.0509 14.9649 15.58 14.3V12.72H17.18C17.7555 12.2829 18.4573 12.0443 19.18 12.04C19.6344 12.0373 20.0846 12.1262 20.5039 12.3015C20.9231 12.4767 21.3027 12.7347 21.62 13.06L23.36 14.78L25.36 12.78L25.56 12.66C25.934 12.4091 26.3459 12.2201 26.78 12.1V8.10001C26.7747 7.09911 26.3748 6.1407 25.667 5.43295C24.9593 4.72519 24.0009 4.32526 23 4.32C23.0378 4.84087 22.9679 5.36394 22.7946 5.85658C22.6213 6.34922 22.3483 6.80085 21.9927 7.18327C21.6371 7.5657 21.2064 7.87072 20.7276 8.07929C20.2488 8.28786 19.7322 8.3955 19.21 8.3955C18.6877 8.3955 18.1711 8.28786 17.6923 8.07929C17.2136 7.87072 16.7829 7.5657 16.4273 7.18327C16.0716 6.80085 15.7986 6.34922 15.6253 5.85658C15.452 5.36394 15.3821 4.84087 15.42 4.32H11.58C11.58 4.81903 11.4817 5.31316 11.2907 5.7742C11.0998 6.23524 10.8199 6.65415 10.467 7.00701C10.1141 7.35987 9.69522 7.63978 9.23418 7.83075C8.77314 8.02171 8.27901 8.12 7.77998 8.12C7.28096 8.12 6.78682 8.02171 6.32579 7.83075C5.86475 7.63978 5.44584 7.35987 5.09298 7.00701C4.74012 6.65415 4.46021 6.23524 4.26924 5.7742C4.07827 5.31316 3.97998 4.81903 3.97998 4.32C3.47927 4.32 2.9835 4.41895 2.52115 4.61116C2.05881 4.80338 1.63901 5.08508 1.28588 5.44006C0.932758 5.79504 0.653269 6.21632 0.463481 6.67967C0.273694 7.14301 0.177349 7.6393 0.179984 8.14001V21.58C0.17997 22.5685 0.571258 23.5167 1.26832 24.2175C1.96539 24.9184 2.91154 25.3147 3.89998 25.32H14.86C14.777 24.7843 14.8226 24.2365 14.993 23.7218C15.1634 23.2072 15.4537 22.7404 15.84 22.36L17.56 20.62Z"
      fill={fill}
    />
    <path
      d="M18.84 6.54C19.3647 6.48617 19.8627 6.28203 20.2743 5.95209C20.6858 5.62215 20.9933 5.18045 21.16 4.68V2.82C20.9922 2.3184 20.6848 1.87507 20.2738 1.54207C19.8629 1.20906 19.3655 1.0002 18.84 0.940002C18.3484 0.950465 17.8804 1.15315 17.5364 1.50459C17.1925 1.85603 16.9999 2.32825 17 2.82V4.68C17 5.16986 17.1932 5.63995 17.5377 5.9882C17.8822 6.33645 18.3502 6.53473 18.84 6.54Z"
      fill={fill}
    />
    <path
      d="M26.18 20.62L26.76 20.04L29.44 17.38C29.564 17.2589 29.6625 17.1143 29.7298 16.9546C29.797 16.7948 29.8317 16.6233 29.8317 16.45C29.8317 16.2767 29.797 16.1052 29.7298 15.9455C29.6625 15.7857 29.564 15.6411 29.44 15.52L28.5 14.58C28.2593 14.369 27.9501 14.2527 27.63 14.2527C27.3099 14.2527 27.0007 14.369 26.76 14.58H26.64L23.4 17.84L20.14 14.58C20.0189 14.456 19.8743 14.3575 19.7146 14.2903C19.5549 14.223 19.3833 14.1884 19.21 14.1884C19.0367 14.1884 18.8652 14.223 18.7055 14.2903C18.5457 14.3575 18.4011 14.456 18.28 14.58L17.36 15.52C17.236 15.6411 17.1375 15.7857 17.0703 15.9455C17.003 16.1052 16.9684 16.2767 16.9684 16.45C16.9684 16.6233 17.003 16.7948 17.0703 16.9546C17.1375 17.1143 17.236 17.2589 17.36 17.38L20.6 20.62L17.36 23.88C17.1738 24.0639 17.0474 24.2998 16.9975 24.5567C16.9475 24.8137 16.9763 25.0797 17.08 25.32C17.1395 25.4798 17.2354 25.6236 17.36 25.74L18.28 26.66C18.4011 26.784 18.5457 26.8825 18.7055 26.9497C18.8652 27.017 19.0367 27.0517 19.21 27.0517C19.3833 27.0517 19.5549 27.017 19.7146 26.9497C19.8743 26.8825 20.0189 26.784 20.14 26.66L21.5 25.32L23.4 23.42L26.64 26.66C26.7611 26.784 26.9057 26.8825 27.0655 26.9497C27.2252 27.017 27.3967 27.0517 27.57 27.0517C27.7433 27.0517 27.9149 27.017 28.0746 26.9497C28.2343 26.8825 28.3789 26.784 28.5 26.66L29.44 25.74C29.564 25.6189 29.6625 25.4743 29.7298 25.3146C29.797 25.1548 29.8317 24.9833 29.8317 24.81C29.8317 24.6367 29.797 24.4652 29.7298 24.3055C29.6625 24.1457 29.564 24.0011 29.44 23.88L26.18 20.62Z"
      fill={fill}
    />
  </svg>
);
