"use client";

import { useEffect, useRef, useState } from "react";
import { schoolLocation, distanceInMeters } from "@/lib/data";

declare global {
  interface Window {
    L: any;
  }
}

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.L) return resolve();

    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector(`script[src="${LEAFLET_JS}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.head.appendChild(script);
  });
}

export default function LiveMap({
  onStatusChange,
}: {
  onStatusChange?: (inside: boolean, distance: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const userMarker = useRef<any>(null);
  const accuracyCircle = useRef<any>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [inside, setInside] = useState<boolean | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let watchId: number | null = null;
    let cancelled = false;

    async function init() {
      try {
        await loadLeaflet();
        if (cancelled || !mapRef.current) return;

        const L = window.L;

        const map = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
        }).setView([schoolLocation.latitude, schoolLocation.longitude], 17);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);

        // School marker
        L.circleMarker([schoolLocation.latitude, schoolLocation.longitude], {
          radius: 6,
          color: "#3F8C75",
          fillColor: "#3F8C75",
          fillOpacity: 1,
        }).addTo(map);

        // Radius circle around school
        L.circle([schoolLocation.latitude, schoolLocation.longitude], {
          radius: schoolLocation.radiusMeters,
          color: "#3F8C75",
          fillColor: "#7AC79E",
          fillOpacity: 0.2,
          weight: 2,
        }).addTo(map);

        mapInstance.current = map;
        setStatus("ready");

        if (!("geolocation" in navigator)) {
          setErrorMsg("Perangkat tidak mendukung GPS.");
          return;
        }

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const dist = distanceInMeters(
              latitude,
              longitude,
              schoolLocation.latitude,
              schoolLocation.longitude
            );
            const isInside = dist <= schoolLocation.radiusMeters;

            setDistance(dist);
            setInside(isInside);
            onStatusChange?.(isInside, dist);

            if (!mapInstance.current) return;

            if (!userMarker.current) {
              userMarker.current = L.circleMarker([latitude, longitude], {
                radius: 8,
                color: "#2563eb",
                fillColor: "#3b82f6",
                fillOpacity: 0.9,
                weight: 2,
              }).addTo(mapInstance.current);

              accuracyCircle.current = L.circle([latitude, longitude], {
                radius: accuracy,
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.08,
                weight: 1,
              }).addTo(mapInstance.current);

              const bounds = L.latLngBounds([
                [latitude, longitude],
                [schoolLocation.latitude, schoolLocation.longitude],
              ]);
              mapInstance.current.fitBounds(bounds, { padding: [30, 30] });
            } else {
              userMarker.current.setLatLng([latitude, longitude]);
              accuracyCircle.current.setLatLng([latitude, longitude]);
              accuracyCircle.current.setRadius(accuracy);
            }
          },
          () => {
            setErrorMsg("Gagal mengambil lokasi. Aktifkan GPS dan izin lokasi.");
          },
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
        );
      } catch {
        setStatus("error");
      }
    }

    init();

    return () => {
      cancelled = true;
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="h-32 w-full bg-gray-100 transition-opacity duration-500"
        style={{ opacity: status === "ready" ? 1 : 0.4 }}
      />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-[#7AC79E] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-xs text-gray-400">Peta tidak tersedia</span>
        </div>
      )}

      {errorMsg && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-50 text-red-600 text-[10px] px-2 py-1 text-center">
          {errorMsg}
        </div>
      )}

      {inside !== null && !errorMsg && (
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] font-semibold transition-all duration-300 ${
            inside
              ? "bg-[#3F8C75] text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {inside
            ? "Dalam radius"
            : `${Math.round(distance ?? 0)}m dari lokasi`}
        </div>
      )}
    </div>
  );
}
