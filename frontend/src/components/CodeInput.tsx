import { useRef } from "react";
import { useTheme } from "../hooks/useTheme";

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

export default function CodeInput({
  length = 6,
  value,
  onChange,
}: Props) {
  const { theme } = useTheme();

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newValue = value.split("");
    newValue[index] = val;
    const final = newValue.join("").slice(0, length);

    onChange(final);

    // auto next
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div style={container}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el; // ✅ CORRIGIDO (sem retorno)
          }}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          maxLength={1}
          style={{
            ...input(theme),
            border: `1px solid ${theme.colors.border}`,
          }}
        />
      ))}
    </div>
  );
}

const container: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
};

const input = (theme: any): React.CSSProperties => ({
  width: 45,
  height: 50,
  textAlign: "center",
  fontSize: 20,
  borderRadius: theme.radius,
  outline: "none",
  background: theme.colors.card,
  color: theme.colors.text,
});