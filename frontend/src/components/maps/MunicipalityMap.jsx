import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MunicipalityMap = ({ municipality, height = "300px" }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("en") ? "en" : "de";
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [municipality.lat, municipality.lng],
      zoom: 12,
      zoomControl: false,
      attributionControl: true
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    L.marker([municipality.lat, municipality.lng])
      .addTo(map)
      .bindPopup(`<b>${municipality.name[currentLang]}</b><br/>${municipality.kreis}`);

    L.circle([municipality.lat, municipality.lng], {
      color: municipality.color,
      fillColor: municipality.color,
      fillOpacity: 0.15,
      radius: 3500
    }).addTo(map);

    // Ensure Leaflet recalculates size after the container has been laid out
    const timer = setTimeout(() => map.invalidateSize(), 0);

    return () => {
      clearTimeout(timer);
      map.remove();
      mapRef.current = null;
    };
  }, [municipality, currentLang]);

  return (
    <div
      ref={containerRef}
      style={{ height, width: "100%", position: "relative" }}
      className="rounded-2xl border border-gray-100 overflow-hidden"
    />
  );
};

export default MunicipalityMap;
