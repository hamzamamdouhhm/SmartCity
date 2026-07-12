import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const createMarkerIcon = (color) => {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40" fill="none">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="${color}"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>`
  );
  return L.divIcon({
    className: "custom-marker",
    html: `<img src="data:image/svg+xml,${svg}" width="32" height="40" alt="" style="display:block;" />`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

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
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      className: "map-tiles",
    }).addTo(map);

    const markerColor = municipality.color || "#0A6F51";
    L.marker([municipality.lat, municipality.lng], {
      icon: createMarkerIcon(markerColor),
    })
      .addTo(map)
      .bindPopup(
        `<div style="font-family: Inter, system-ui, sans-serif; font-size: 14px; color: hsl(var(--color-text-primary));">
          <strong>${municipality.name[currentLang]}</strong><br/>
          <span style="opacity: 0.75;">${municipality.kreis}</span>
        </div>`
      );

    L.circle([municipality.lat, municipality.lng], {
      color: markerColor,
      fillColor: markerColor,
      fillOpacity: 0.12,
      weight: 1.5,
      radius: 3500,
    }).addTo(map);

    const timer = setTimeout(() => map.invalidateSize(), 50);

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
      className="rounded-lg border border-border overflow-hidden bg-subtle"
    />
  );
};

export default MunicipalityMap;
