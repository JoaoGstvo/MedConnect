import { useState, useEffect } from "react";
import CardVaga from "./CardVaga";

function ListaVagas() {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    carregarVagas();
  }, []);

  const carregarVagas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/vagas');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar vagas');
      }
      
      const vagasData = await response.json();
      setVagas(vagasData);
    } catch (err) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInscricao = (vaga, usuario) => {
    console.log(`Usuário ${usuario.nome} inscrito na vaga: ${vaga.titulo}`);
    // Aqui você pode adicionar mais lógica se necessário
  };

  if (loading) return <div className="loading">Carregando vagas...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="vagas-container">
      <h2>Vagas de Emprego em Saúde</h2>
      <div className="vagas-grid">
        {vagas.map(vaga => (
          <CardVaga 
            key={vaga.id_vaga} 
            vaga={vaga} 
            onInscricao={handleInscricao}
          />
        ))}
      </div>
      {vagas.length === 0 && (
        <div className="no-vagas">
          Nenhuma vaga disponível no momento.
        </div>
      )}
    </div>
  );
}

export default ListaVagas;