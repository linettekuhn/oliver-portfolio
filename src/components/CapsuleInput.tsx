import type { ComponentProps, ComponentType, ReactNode } from "react";
import styles from "./styles/CapsuleInput.module.css";

type Props = Omit<ComponentProps<"input">, "onChange"> & {
  onChange: (text: string) => void;
  IconComponent?: ComponentType<{ size?: number; color?: string }>;
  secure?: boolean;
  children?: ReactNode;
};

export default function CapsuleInput({
  value,
  onChange,
  placeholder,
  IconComponent,
  secure = false,
  children,
  ...rest
}: Props) {
  return (
    <div className={styles.inputWrapper}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2xs)",
          flex: 1,
          minWidth: 0,
        }}
      >
        {IconComponent && <IconComponent size={17} />}
        <input
          type={secure ? "password" : "text"}
          className={styles.input}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          {...rest}
        />
      </div>
      {children}
    </div>
  );
}
