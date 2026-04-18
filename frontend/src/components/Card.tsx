import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

type Props = {
  title: string;
  value: number | string;
};

export default function Card({ title, value }: Props) {
  const { theme } = useTheme();
  const numericValue = Number(value) || 0;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ duration: 0.2 }}
      style={card(theme)}
    >
      <p style={label(theme)}>{title}</p>

      <h2 style={valueStyle(theme)}>
        {numericValue.toLocaleString("pt-BR")}
      </h2>
    </motion.div>
  );
}

const card = (theme: any): React.CSSProperties => ({
  flex: 1,
  background: theme.colors.card,
  padding: 20,
  borderRadius: theme.radius,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow,

  // 🔥 efeito SaaS
  transition: "all 0.2s ease",
});

const label = (theme: any): React.CSSProperties => ({
  color: theme.colors.subtext,
  fontSize: 13,
  marginBottom: 6,
});

const valueStyle = (theme: any): React.CSSProperties => ({
  color: theme.colors.text,
  fontSize: 30,
  fontWeight: 700,
});