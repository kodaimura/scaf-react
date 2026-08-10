import type { InputHTMLAttributes } from "react";
import styles from "@styles/ui/form.module.css";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className, ...props }: InputProps) => {
  const classNames = [styles.control, className].filter(Boolean).join(" ");

  return <input {...props} className={classNames} />;
};

export default Input;
