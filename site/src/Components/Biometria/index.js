

export default function BiometricLogin() {

  // Registro rápido só pra teste
  const registerBiometric = async () => {
    try {
      const publicKey = {
        challenge: new Uint8Array(32).map(() => Math.floor(Math.random() * 256)),
        rp: { name: "Teste Biometria" },
        user: {
          id: new Uint8Array(16).map(() => Math.floor(Math.random() * 256)),
          name: "teste@user.com",
          displayName: "Usuário Teste",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform", // usa sensor do próprio dispositivo
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "direct",
      };

      const credential = await navigator.credentials.create({ publicKey });
      console.log("Registro teste concluído:", credential);
      alert("Registro concluído! Veja no console.");
    } catch (err) {
      console.error("Erro no registro:", err);
      alert("Erro: " + err.message);
    }
  };

  // Login rápido só pra teste
  const loginBiometric = async () => {
    try {
      const publicKey = {
        challenge: new Uint8Array(32).map(() => Math.floor(Math.random() * 256)),
        userVerification: "required",
      };

      const assertion = await navigator.credentials.get({ publicKey });
      console.log("Login teste concluído:", assertion);
      alert("Login concluído! Veja no console.");
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Erro: " + err.message);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Teste Login Biométrico</h2>
      <button onClick={registerBiometric} style={{ marginRight: 10 }}>Registrar</button>
      <button onClick={loginBiometric}>Login</button>
    </div>
  );
}