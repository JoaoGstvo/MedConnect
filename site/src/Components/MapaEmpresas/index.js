import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Criando o ícone personalizado
const hospitalIcon = new L.Icon({
  iconUrl: "/Images/Logo.png", // coloque a URL do seu ícone aqui
  iconSize: [60,], // tamanho do ícone
  iconAnchor: [17, 35], // ponto do ícone que vai marcar a posição
  popupAnchor: [0, -35], // onde o popup vai abrir em relação ao ícone
});

function MapaEmpresas() {
  return (
    <MapContainer
      center={[-23.55, -46.63]}
      zoom={13}
      style={{ height: "500px", width: "100%", border: "2px solid red" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />

      <Marker position={[-23.55, -46.63]} icon={hospitalIcon}>
        <Popup>Teste: Hospital São Lucas</Popup>
      </Marker>

      <Marker position={[-22.55, -47.62]} icon={hospitalIcon}>
        <Popup>Hospital São Thiago</Popup>
      </Marker>

        <Marker position={[-22.55, -48.64]} icon={hospitalIcon}>
        <Popup>Hospital São Thiago</Popup>
      </Marker>
        <Marker position={[-22.55, -49.66]} icon={hospitalIcon}>
        <Popup>Hospital São Thiago</Popup>
      </Marker>
        <Marker position={[-22.55, -46.68]} icon={hospitalIcon}>
        <Popup>Hospital São Thiago</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapaEmpresas;
