import {
  forwardRef,
  useState,
  type CSSProperties,
} from "react";
import { useTheme } from "../hooks/useTheme";

type Props = {
  placeholder?: string;
  type?: string;
  error?: string;

  name?: string;
  value?: string; // ✅ ADICIONADO (não quebra nada)
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      placeholder,
      type = "text",
      error,
      name,
      value,
      onChange,
      onBlur,
    },
    ref
  ) => {
    const { theme } = useTheme();

    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    const wrapper: CSSProperties = {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    };

    const style: CSSProperties = {
      padding: "12px",
      paddingRight: isPassword ? "40px" : "12px",
      borderRadius: theme.radius,
      border: `1px solid ${error ? "#dc2626" : theme.colors.border}`,
      background: theme.colors.card,
      color: theme.colors.text,
      fontSize: 14,
      outline: "none",
    };

    const eyeButton: CSSProperties = {
      position: "absolute",
      right: 10,
      top: 10,
      cursor: "pointer",
      fontSize: 16,
      opacity: 0.6,
    };

    return (
      <div style={wrapper}>
        <input
          ref={ref}
          name={name}
          value={value} // ✅ agora aceita controlado
          style={style}
          placeholder={placeholder}
          type={inputType}
          onChange={onChange}
          onBlur={onBlur}
        />

        {isPassword && (
          <span
            style={eyeButton}
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        )}

        {error && (
          <span style={{ color: "#dc2626", fontSize: 12 }}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default Input;