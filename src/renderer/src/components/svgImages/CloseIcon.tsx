import React, { ReactElement } from "react";

interface CloseIconProps {
  className?: string;
  onClick?: () => void;
  id?: string;
}

const CloseIcon: React.FC<CloseIconProps> = React.forwardRef<any, CloseIconProps>((props, ref): ReactElement => {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" {...props} ref={ref}>
      <path d="M9 0.75L1 8.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 0.75L9 8.75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

export default CloseIcon;
