import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

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

      <Marker position={[-23.55, -46.63]}>
        <Popup>
          Teste: Hospital São Lucas
        </Popup>
      </Marker>

      <Marker position={[-22.55, -46.63]}>
        <Popup>
          Hospital São Thiago
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapaEmpresas;
