import Button from "./Button";
import { useAuth } from "../context/AuthContext";
import { upgradePlan } from "../services/userService";

export default function UpgradeButton() {
  const { user, refreshUser } = useAuth();

  if (user?.plan === "PRO") return null;

  const handleUpgrade = async () => {
    try {
      await upgradePlan();

      alert("Agora você é PRO 🚀");

      // 🔥 atualiza usuário no contexto
      await refreshUser();

    } catch (err) {
      console.error("Erro ao atualizar plano", err);
      alert("Erro ao atualizar plano");
    }
  };

  return (
    <Button onClick={handleUpgrade}>
      🚀 Virar PRO
    </Button>
  );
}