import { forwardRef } from "react";
import { Dialog } from "@base-ui-components/react";
import styles from "./modal.module.css";
import clsx from "clsx";

interface IModalProps {
  className?: string;
  open?: boolean;
  setOpen?: (open: boolean, event?: Event, reason?: any) => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

const Modal = forwardRef<HTMLDivElement, IModalProps>(
  ({ open = false, setOpen, title, children, className }, ref) => {
    return (
      <Dialog.Root open={open} dismissible={false} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className={styles.Backdrop} />
          <Dialog.Popup ref={ref} className={clsx(styles.Popup, className)}>
            {children}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    );
  }
);

export { Modal };
