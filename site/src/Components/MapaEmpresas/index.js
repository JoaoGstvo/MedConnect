import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";

// Criando ícones personalizados
const hospitalIcon = new L.Icon({
  iconUrl: "https://static.vecteezy.com/ti/vetor-gratis/p1/1511712-hospital-outline-icon-vetor.jpg",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const clinicIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const labIcon = new L.Icon({
  iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuitY2neoawB4ra7JLfyxyB7-fdwT-AtixZA&s",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const pharmacyIcon = new L.Icon({
  iconUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXG2yITsGJFXgnyTuJ1HeWU_KAPyXNRj9dvA&s",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

function MapaEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Banco de dados de coordenadas para TODOS os estados brasileiros
  const coordenadasEstados = {
    // Região Norte
    'AC': { capital: { lat: -9.9747, lng: -67.8100 }, cidades: [{ nome: "Rio Branco", lat: -9.9747, lng: -67.8100 }] },
    'AP': { capital: { lat: 0.0340, lng: -51.0695 }, cidades: [{ nome: "Macapá", lat: 0.0340, lng: -51.0695 }] },
    'AM': { capital: { lat: -3.1190, lng: -60.0217 }, cidades: [{ nome: "Manaus", lat: -3.1190, lng: -60.0217 }] },
    'PA': { capital: { lat: -1.4554, lng: -48.4902 }, cidades: [{ nome: "Belém", lat: -1.4554, lng: -48.4902 }] },
    'RO': { capital: { lat: -8.7612, lng: -63.9005 }, cidades: [{ nome: "Porto Velho", lat: -8.7612, lng: -63.9005 }] },
    'RR': { capital: { lat: 2.8235, lng: -60.6758 }, cidades: [{ nome: "Boa Vista", lat: 2.8235, lng: -60.6758 }] },
    'TO': { capital: { lat: -10.1844, lng: -48.3336 }, cidades: [{ nome: "Palmas", lat: -10.1844, lng: -48.3336 }] },
    
    // Região Nordeste
    'AL': { capital: { lat: -9.6653, lng: -35.7353 }, cidades: [{ nome: "Maceió", lat: -9.6653, lng: -35.7353 }] },
    'BA': { capital: { lat: -12.9714, lng: -38.5014 }, cidades: [{ nome: "Salvador", lat: -12.9714, lng: -38.5014 }] },
    'CE': { capital: { lat: -3.7319, lng: -38.5267 }, cidades: [{ nome: "Fortaleza", lat: -3.7319, lng: -38.5267 }] },
    'MA': { capital: { lat: -2.5307, lng: -44.3068 }, cidades: [{ nome: "São Luís", lat: -2.5307, lng: -44.3068 }] },
    'PB': { capital: { lat: -7.1195, lng: -34.8450 }, cidades: [{ nome: "João Pessoa", lat: -7.1195, lng: -34.8450 }] },
    'PE': { capital: { lat: -8.0476, lng: -34.8770 }, cidades: [{ nome: "Recife", lat: -8.0476, lng: -34.8770 }] },
    'PI': { capital: { lat: -5.0920, lng: -42.8038 }, cidades: [{ nome: "Teresina", lat: -5.0920, lng: -42.8038 }] },
    'RN': { capital: { lat: -5.7793, lng: -35.2009 }, cidades: [{ nome: "Natal", lat: -5.7793, lng: -35.2009 }] },
    'SE': { capital: { lat: -10.9472, lng: -37.0731 }, cidades: [{ nome: "Aracaju", lat: -10.9472, lng: -37.0731 }] },
    
    // Região Centro-Oeste
    'DF': { capital: { lat: -15.7942, lng: -47.8822 }, cidades: [{ nome: "Brasília", lat: -15.7942, lng: -47.8822 }] },
    'GO': { capital: { lat: -16.6809, lng: -49.2533 }, cidades: [{ nome: "Goiânia", lat: -16.6809, lng: -49.2533 }] },
    'MT': { capital: { lat: -15.6010, lng: -56.0974 }, cidades: [{ nome: "Cuiabá", lat: -15.6010, lng: -56.0974 }] },
    'MS': { capital: { lat: -20.4697, lng: -54.6201 }, cidades: [{ nome: "Campo Grande", lat: -20.4697, lng: -54.6201 }] },
    
    // Região Sudeste
    'ES': { capital: { lat: -20.3155, lng: -40.3128 }, cidades: [{ nome: "Vitória", lat: -20.3155, lng: -40.3128 }] },
    'MG': { capital: { lat: -19.9167, lng: -43.9345 }, cidades: [{ nome: "Belo Horizonte", lat: -19.9167, lng: -43.9345 }] },
    'RJ': { capital: { lat: -22.9068, lng: -43.1729 }, cidades: [{ nome: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 }] },
    'SP': { capital: { lat: -23.5505, lng: -46.6333 }, cidades: [{ nome: "São Paulo", lat: -23.5505, lng: -46.6333 }] },
    
    // Região Sul
    'PR': { capital: { lat: -25.4284, lng: -49.2733 }, cidades: [{ nome: "Curitiba", lat: -25.4284, lng: -49.2733 }] },
    'RS': { capital: { lat: -30.0346, lng: -51.2177 }, cidades: [{ nome: "Porto Alegre", lat: -30.0346, lng: -51.2177 }] },
    'SC': { capital: { lat: -27.5954, lng: -48.5480 }, cidades: [{ nome: "Florianópolis", lat: -27.5954, lng: -48.5480 }] }
  };

  // Função para obter coordenadas baseadas no estado da empresa
  const getCoordenadasFromEmpresa = (empresa, index) => {
    const estadoEmpresa = empresa.estado;
    
    // Verifica se o estado existe no banco de dados
    if (estadoEmpresa && coordenadasEstados[estadoEmpresa]) {
      const estadoData = coordenadasEstados[estadoEmpresa];
      const cidade = estadoData.cidades[0]; // Usa a capital do estado
      
      console.log(`Empresa ${empresa.nome} no estado ${estadoEmpresa} -> ${cidade.nome}`);
      
      return [cidade.lat, cidade.lng];
    }
    
    // SEM FALLBACK - se estado não for reconhecido, retorna null
    console.warn(`Estado ${estadoEmpresa} não reconhecido para empresa ${empresa.nome}`);
    return null;
  };

  // Função para buscar empresas da API
  const fetchEmpresas = async () => {
    try {
      setLoading(true);
      console.log("Buscando empresas da API...");
      
      const response = await fetch("http://localhost:5000/api/empresas");
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Empresas recebidas da API:", data);
      setEmpresas(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar empresas:", err);
      setError(err.message);
      // Dados de exemplo para demonstração com todos os estados
      } finally {
      setLoading(false);
    }
  };

 
  // Função para determinar o tipo de empresa baseado no nome
  const getTipoEmpresa = (nome) => {
    const nomeLower = nome.toLowerCase();
    
    if (nomeLower.includes('hospital')) return 'hospital';
    if (nomeLower.includes('clínica') || nomeLower.includes('clinica')) return 'clínica';
    if (nomeLower.includes('laboratório') || nomeLower.includes('laboratorio')) return 'laboratório';
    if (nomeLower.includes('farmácia') || nomeLower.includes('farmacia') || nomeLower.includes('drogaria')) return 'farmácia';
    
    return 'clínica';
  };

  // Função para obter o ícone baseado no tipo
  const getIconByTipo = (tipo) => {
    const icons = {
      'hospital': hospitalIcon,
      'clínica': clinicIcon,
      'laboratório': labIcon,
      'farmácia': pharmacyIcon
    };
    return icons[tipo] || clinicIcon;
  };

  // Função para obter a cor baseada no tipo
  const getTipoColor = (tipo) => {
    const cores = {
      'hospital': "#ff4444",
      'clínica': "#4488ff", 
      'laboratório': "#44aa44",
      'farmácia': "#ffaa00"
    };
    return cores[tipo] || "#666666";
  };

  // Função para calcular o centro do mapa baseado nas empresas
  const getMapCenter = () => {
    if (empresas.length === 0) return [-15.7801, -47.9292]; // Centro do Brasil
    
    const empresasComCoordenadas = empresas.filter(empresa => {
      const estado = empresa.estado;
      return estado && coordenadasEstados[estado];
    });

    if (empresasComCoordenadas.length === 0) return [-15.7801, -47.9292];

    const coordenadas = empresasComCoordenadas.map(empresa => {
      const estado = empresa.estado;
      return coordenadasEstados[estado].capital;
    });
    
    const avgLat = coordenadas.reduce((sum, coord) => sum + coord.lat, 0) / coordenadas.length;
    const avgLng = coordenadas.reduce((sum, coord) => sum + coord.lng, 0) / coordenadas.length;
    
    return [avgLat, avgLng];
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  // Filtra apenas empresas com estados válidos
  const empresasComCoordenadas = empresas.filter(empresa => {
    const estado = empresa.estado;
    return estado && coordenadasEstados[estado];
  });

  if (loading) {
    return (
      <div style={{ 
        height: "500px", 
        width: "100%", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        border: "2px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "16px", marginBottom: "10px" }}>Carregando empresas...</div>
          <div style={{ fontSize: "14px", color: "#666" }}>Buscando dados da API</div>
        </div>
      </div>
    );
  }

  if (error && empresas.length === 0) {
    return (
      <div style={{ 
        height: "500px", 
        width: "100%", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        border: "2px solid #ff6b6b",
        borderRadius: "8px",
        backgroundColor: "#fff5f5"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "16px", marginBottom: "10px", color: "#e53e3e" }}>
            Erro ao carregar empresas
          </div>
          <div style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
            {error}
          </div>
          <button 
            onClick={fetchEmpresas}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4299e1",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header informativo */}
      <div style={{ 
        marginBottom: "15px", 
        padding: "15px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px",
        border: "1px solid #dee2e6"
      }}>
        <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>
          Mapa de Empresas de Saúde - Brasil
        </h3>
        <p style={{ margin: "0", color: "#666", fontSize: "14px" }}>
          {empresasComCoordenadas.length} empresa(s) em {new Set(empresasComCoordenadas.map(e => e.estado)).size} estado(s)
          {empresas.length > empresasComCoordenadas.length && (
            <span style={{ color: "#e53e3e", marginLeft: "10px" }}>
              ({empresas.length - empresasComCoordenadas.length} empresa(s) sem estado válido)
            </span>
          )}
        </p>
      </div>

      <MapContainer
        center={getMapCenter()}
        zoom={4}
        style={{ height: "500px", width: "100%", border: "2px solid #ddd", borderRadius: "8px" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {empresasComCoordenadas.map((empresa, index) => {
          const tipo = getTipoEmpresa(empresa.nome);
          const coordenadas = getCoordenadasFromEmpresa(empresa, index);
          const icon = getIconByTipo(tipo);
          
          if (!coordenadas) return null;
          
          return (
            <Marker 
              key={empresa.id_empresa} 
              position={coordenadas} 
              icon={icon}
            >
              <Popup>
                <div style={{ minWidth: "250px" }}>
                  <h3 style={{ 
                    margin: "0 0 8px 0", 
                    color: getTipoColor(tipo),
                    fontSize: "16px"
                  }}>
                    {empresa.nome}
                  </h3>
                  
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    marginBottom: "6px",
                    fontSize: "12px"
                  }}>
                    <span style={{
                      background: getTipoColor(tipo),
                      color: "white",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      textTransform: "capitalize"
                    }}>
                      {tipo}
                    </span>
                  </div>

                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    <strong>📧</strong> {empresa.email}
                  </p>

                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    <strong>📞</strong> {empresa.telefone || "Não informado"}
                  </p>

                  <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
                    <strong>📍</strong> {empresa.cidade} - {empresa.estado}
                  </p>

                  {empresa.descricao && (
                    <div style={{ marginTop: "8px" }}>
                      <strong style={{ fontSize: "12px" }}>Descrição:</strong>
                      <div style={{ fontSize: "11px", color: "#555", marginTop: "4px" }}>
                        {empresa.descricao}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ 
                    marginTop: "8px", 
                    fontSize: "10px", 
                    color: "#999",
                    borderTop: "1px solid #eee",
                    paddingTop: "6px"
                  }}>
                    Cadastrada em: {new Date(empresa.data_criacao).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

    </div>
  );
}

export default MapaEmpresas;