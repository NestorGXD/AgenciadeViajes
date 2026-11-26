"use client";

import { useEffect, useState } from "react";
import { DestinationData } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Plus, Edit2, Trash2, X, Check, Globe } from "lucide-react";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<DestinationData | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchDestinations = async () => {
    try {
      const res = await fetch("/api/destinations");
      if (res.ok) {
        const data = await res.json();
        setDestinations(data.destinations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  const openCreateModal = () => {
    setEditingDest(null);
    setName("");
    setSlug("");
    setCountry("");
    setCity("");
    setLatitude("");
    setLongitude("");
    setBasePrice("");
    setImageUrl("");
    setDescription("");
    setFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (d: DestinationData) => {
    setEditingDest(d);
    setName(d.name);
    setSlug(d.slug);
    setCountry(d.country);
    setCity(d.city);
    setLatitude(d.latitude.toString());
    setLongitude(d.longitude.toString());
    setBasePrice(d.basePrice.toString());
    setImageUrl(d.imageUrl);
    setDescription(d.description);
    setFeatured(d.featured);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      slug,
      country,
      city,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      basePrice: parseFloat(basePrice),
      imageUrl,
      description,
      featured,
    };

    try {
      let res;
      if (editingDest) {
        res = await fetch(`/api/destinations/${editingDest.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/destinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        fetchDestinations();
      } else {
        const err = await res.json();
        alert(err.error || "Error al guardar el destino.");
      }
    } catch {
      alert("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, destName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el destino "${destName}"?`)) return;

    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchDestinations();
      } else {
        alert("Error al eliminar.");
      }
    } catch {
      alert("Error al eliminar.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Gestión de Destinos y Mapa
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra los puntos geográficos, coordenadas para Leaflet y precios base.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          Nuevo Destino
        </button>
      </div>

      {/* Tabla de Destinos */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Destino</th>
              <th className="py-3 px-4">Ubicación</th>
              <th className="py-3 px-4">Coordenadas GPS</th>
              <th className="py-3 px-4">Precio Base</th>
              <th className="py-3 px-4">Destacado</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {destinations.map((d) => (
              <tr key={d.id} className="hover:bg-slate-900/40 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                    />
                    <div>
                      <span className="font-bold text-white block">{d.name}</span>
                      <span className="text-[10px] text-slate-500">{d.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {d.city}, {d.country}
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-amber-300">
                  {d.latitude.toFixed(4)}, {d.longitude.toFixed(4)}
                </td>
                <td className="py-3 px-4 font-bold text-emerald-400">
                  {formatCurrency(d.basePrice)}
                </td>
                <td className="py-3 px-4">
                  {d.featured ? (
                    <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Sí
                    </span>
                  ) : (
                    <span className="text-slate-600 text-[10px]">No</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(d)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id, d.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear / Editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base">
                {editingDest ? "Editar Destino Turístico" : "Crear Nuevo Destino"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Cancún y Riviera Maya"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">País</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="México"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Ciudad</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cancún"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Latitud (GPS)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="21.1619"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Longitud (GPS)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="-86.8515"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Precio Base ($ USD)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="480"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="feat"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                  <label htmlFor="feat" className="text-slate-300 font-bold cursor-pointer">
                    Destacado en Home
                  </label>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción turística..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl"
                >
                  {saving ? "Guardando..." : "Guardar Destino"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
