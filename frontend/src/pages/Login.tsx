import { useLogin } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import Button from "../components/Button";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha mínima de 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Código enviado!");
        navigate("/verify-2fa");
      },
      onError: () => {
        toast.error("Credenciais inválidas");
      },
    });
  };

  return (
    <div style={container}>
      <div style={{ ...card, background: theme.colors.card }}>
        <div style={header}>
          <h1 style={title}>Bem-vindo</h1>
          <p style={subtitle}>Acesse sua conta</p>
        </div>

        <form style={form} onSubmit={handleSubmit(onSubmit)}>
          <Input
            placeholder="Email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            placeholder="Senha"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button loading={isPending} fullWidth>
            Entrar
          </Button>
        </form>

        <div style={links}>
          <span onClick={() => navigate("/forgot-password")} style={link}>
            Esqueceu a senha?
          </span>

          <span onClick={() => navigate("/register")} style={link}>
            Criar conta
          </span>
        </div>
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #6366f10f, transparent)",
};

const card: React.CSSProperties = {
  width: 360,
  padding: 32,
  borderRadius: 14,
  boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  animation: "fadeIn 0.4s ease",
};

const header: React.CSSProperties = {
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const title: React.CSSProperties = {
  fontSize: 24,
};

const subtitle: React.CSSProperties = {
  fontSize: 14,
  opacity: 0.7,
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const links: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 13,
};

const link: React.CSSProperties = {
  cursor: "pointer",
  color: "#6366f1",
};