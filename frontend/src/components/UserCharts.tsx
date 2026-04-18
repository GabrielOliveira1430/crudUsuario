import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
} from "recharts";

import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

type Props = {
  growth?: { name: string; users: number }[];
  roles?: { ADMIN: number; USER: number };
};

export default function UserCharts({ growth, roles }: Props) {
  const { theme } = useTheme();

  const safeGrowth =
    Array.isArray(growth) && growth.length > 0
      ? growth
      : [{ name: "Sem dados", users: 0 }];

  const safeRoles = roles || { ADMIN: 0, USER: 0 };

  const totalUsers =
    (safeRoles.ADMIN || 0) + (safeRoles.USER || 0);

  const pieData = [
    { name: "Admins", value: safeRoles.ADMIN },
    { name: "Users", value: safeRoles.USER },
  ];

  const COLORS = [theme.colors.danger, theme.colors.primary];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: "flex", gap: 20, marginTop: 20 }}
    >
      {/* 📈 AREA */}
      <div style={card(theme)}>
        <h3 style={title(theme)}>Crescimento</h3>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={safeGrowth}>
            <defs>
              <linearGradient id="gradientUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={theme.colors.primary} stopOpacity={0.4} />
                <stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke={theme.colors.border} opacity={0.3} />

            <XAxis dataKey="name" stroke={theme.colors.subtext} />
            <YAxis stroke={theme.colors.subtext} />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="users"
              stroke={theme.colors.primary}
              strokeWidth={3}
              fill="url(#gradientUsers)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 🔵🔴 DONUT */}
      <div style={card(theme)}>
        <h3 style={title(theme)}>Usuários vs Admins</h3>

        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={3}
                stroke="none"
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div style={centerLabel(theme)}>
            <strong style={{ fontSize: 22 }}>{totalUsers}</strong>
            <span style={{ fontSize: 12 }}>usuários</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload }: any) {
  const { theme } = useTheme();

  if (active && payload?.length) {
    return (
      <div
        style={{
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          padding: "8px 12px",
          borderRadius: 8,
          fontSize: 12,
        }}
      >
        <div>{payload[0].name}</div>
        <strong>{payload[0].value}</strong>
      </div>
    );
  }

  return null;
}

const card = (theme: any): React.CSSProperties => ({
  flex: 1,
  background: theme.colors.card,
  padding: 20,
  borderRadius: 16,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow,
});

const title = (theme: any): React.CSSProperties => ({
  color: theme.colors.text,
  marginBottom: 10,
});

const centerLabel = (theme: any): React.CSSProperties => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
  color: theme.colors.text,
});