// pages/index.jsx
import { useRouter } from "next/router";

export default function HomeMenu() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <h1>Jogo da Faca</h1>

      <button style={styles.button} onClick={() => router.push("/sala/criar")}>
        Criar Sala
      </button>

      <button style={styles.button} onClick={() => router.push("/sala/buscar")}>
        Buscar Sala
      </button>

      <button style={styles.button} onClick={() => router.push("")}>
        Sair do jogo
      </button>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    background: "#111",
    color: "#fff",
  },
  button: {
    padding: "15px 25px",
    background: "#0f0",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    cursor: "pointer",
    width: "200px",
  },
};
