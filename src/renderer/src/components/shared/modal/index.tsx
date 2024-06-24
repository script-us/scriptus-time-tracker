import * as React from "react";
import { Dialog, DialogContent, DialogProps } from "@mui/material";
import styles from "./Modal.module.scss";

const Modal: React.FC<DialogProps> = ({ open = false, onClose, children, className, classes, ...props }): React.ReactElement => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="draggable-dialog-title" maxWidth="lg" fullWidth={true} classes={{ ...classes, root: `${className} ${styles.root}` }} {...props}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
