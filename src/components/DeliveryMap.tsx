import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import type { Driver } from "../DTOs/Driver";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

const bikeIconOnline = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448619.png",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const bikeIconOffline = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448621.png",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const mockDrivers: Driver[] = [
  { id: 1, name: "Lucas", lat: -23.55052, lng: -46.633308, status: "online" },
  { id: 2, name: "Ana", lat: -23.559616, lng: -46.658066, status: "online" },
];

function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, { duration: 1.2 });
    }
  }, [position]);

  return null;
}

function DeliveryMap() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [restaurantLocation, setRestaurantLocation] = useState<[number, number] | null>(null);
  const [targetPosition, setTargetPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("lanchonete");

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocalização não suportada");
      setRestaurantLocation([-23.55, -46.63]);
      setDrivers(mockDrivers);
      setTargetPosition([-23.55, -46.63]);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos: [number, number] = [position.coords.latitude, position.coords.longitude];
        setRestaurantLocation(userPos);
        setTargetPosition(userPos);
        setDrivers(mockDrivers);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao obter localização:", error);
        setRestaurantLocation([-23.55, -46.63]);
        setTargetPosition([-23.55, -46.63]);
        setDrivers(mockDrivers);
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <p>Carregando mapa...</p>;

  const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return (
    <div className="relative w-full h-[99%] rounded-xl overflow-hidden shadow-lg border border-gray-300 dark:border-gray-700">
      <MapContainer
        center={restaurantLocation || [-23.55, -46.63]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {restaurantLocation && (
          <Marker position={restaurantLocation} icon={restaurantIcon}>
            <Popup>
              <strong>Localização atual da empresa</strong> <br />
              Localização atual
            </Popup>
          </Marker>
        )}

        {drivers.map((driver) => {
          const icon = driver.status === "online" ? bikeIconOnline : bikeIconOffline;
          const distance = restaurantLocation
            ? calcDistance(
                restaurantLocation[0],
                restaurantLocation[1],
                driver.lat,
                driver.lng
              ).toFixed(2)
            : null;

          return (
            <div key={driver.id}>
              {restaurantLocation && (
                <Polyline
                  positions={[
                    [restaurantLocation[0], restaurantLocation[1]],
                    [driver.lat, driver.lng],
                  ]}
                  color={driver.status === "online" ? "red" : "gray"}
                  weight={3}
                  opacity={driver.status === "online" ? 0.7 : 0.3}
                />
              )}
              <Marker position={[driver.lat, driver.lng]} icon={icon}>
                <Popup>
                  🏍️ <strong>{driver.name}</strong> <br />
                  Status:{" "}
                  <span
                    style={{
                      color: driver.status === "online" ? "green" : "gray",
                      fontWeight: "bold",
                    }}
                  >
                    {driver.status}
                  </span>
                  <br />
                  {distance && <>Distância: {distance} km</>}
                </Popup>
              </Marker>
            </div>
          );
        })}

        <FlyToLocation position={targetPosition} />
      </MapContainer>

      <div className="
        absolute bottom-3 left-1/2
        -translate-x-1/2 flex flex-wrap
        justify-center gap-3 z-[9999]
        bg-white/90 dark:bg-black/10 backdrop-blur-md
        px-4 py-3 rounded-full shadow-lg"
      >
        <button
          onClick={() => {
            setTargetPosition(restaurantLocation);
            setActive("lanchonete");
          }}
          className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
            active === "lanchonete"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
          }`}
        >
          Empresa
        </button>

        {drivers.map((driver) => (
          <button
            key={driver.id}
            onClick={() => {
              if (driver.status === "online") {
                setTargetPosition([driver.lat, driver.lng]);
                setActive(driver.name);
              }
            }}
            disabled={driver.status !== "online"}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
              driver.status !== "online"
                ? "hidden"
                : active === driver.name
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100"
            }`}
          >
            {driver.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default DeliveryMap;