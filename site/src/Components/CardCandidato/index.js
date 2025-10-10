import { FileText, User, Phone, Briefcase } from "lucide-react";
import './index.scss';

function CardCandidato() {
  return (
    <div className="card-candidato fade-in">
      <div className="info">
        <h3><User size={18} /> Nome do Candidato</h3>
        <p><strong>Email:</strong> candidato@email.com</p>
        <p><strong><Phone size={14} /> Telefone:</strong> (11) 98765-4321</p>
        <p><strong><Briefcase size={14} /> Vaga:</strong> Enfermeiro(a)</p>
      </div>

      <div className="acoes">
        <button>
          <FileText size={16} /> Visualizar Currículo
        </button>
        <select>
          <option>Status</option>
          <option>Em Análise</option>
          <option>Selecionado para Entrevista</option>
          <option>Rejeitado</option>
        </select>
      </div>
    </div>
  );
}

export default CardCandidato;
