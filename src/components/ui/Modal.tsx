import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import styles from "@styles/ui/modal.module.css";

type ModalLevel = "default" | "info" | "warning" | "danger";

type Props = {
  children?: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  footer?: ReactNode;
  isOpen: boolean;
  level?: ModalLevel;
  onClose: () => void;
  title?: string;
};

const Modal: React.FC<Props> = ({
  children,
  className,
  closeOnOverlayClick = true,
  footer,
  isOpen,
  level = "default",
  onClose,
  title,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return;
    if (e.target === e.currentTarget) onClose();
  };

  const icon =
    level === "danger" ? (
      <AlertCircle size={20} />
    ) : level === "warning" ? (
      <AlertTriangle size={20} />
    ) : level === "info" ? (
      <Info size={20} />
    ) : null;

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={[styles.modal, className].filter(Boolean).join(" ")}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            {icon && (
              <span
                aria-hidden="true"
                className={[styles.icon, styles[level]].join(" ")}
              >
                {icon}
              </span>
            )}
            {title && <div className={styles.title}>{title}</div>}
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="閉じる"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
