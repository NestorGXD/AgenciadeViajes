"use client";

import { useEffect, useState } from "react";
import { HotelData, DestinationData, HotelCategoryType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Building, Plus, Edit2, Trash2, X } from "lucide-react";

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<DestinationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<any | null>(null);

  // Form fields
  const [destinationId, setDestinationId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState<HotelCategoryType>("ALL_INCLUSIVE");
  const [pricePerNight, setPricePerNight] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [amenities, setAmenities] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [hotelsRes, destsRes] = await Promise.all([
        fetch("/api/hotels"),
        fetch("/api/destinations"),
      ]);

      if (hotelsRes.ok) {
        const hData = await hotelsRes.json();
        setHotels(hData.hotels || []);
      }

      if (destsRes.ok) {
        const dData = await destsRes.json();
        setDestinations(dData.destinations || []);
        if (dData.destinations?.length > 0 && !destinationId) {
          setDestinationId(dData.destinations[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = () => {
    setEditingHotel(null);
    setName("");
    setDescription("");
    setAddress("");
    setCategory("ALL_INCLUSIVE");
    setPricePerNight("");
    setImageUrl("");
    setAmenities("Wifi,Piscina,Restaurante");
    setModalOpen(true);
  };

  const openEditModal = (h: any) => {
    setEditingHotel(h);
    setDestinationId(h.destinationId);
    setName(h.name);
    setDescription(h.description);
    setAddress(h.address);
    setCategory(h.category);
    setPricePerNight(h.pricePerNight.toString());
    setImageUrl(h.imageUrl);
    setAmenities(h.amenities);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      destinationId,
      name,
      description,
      address,
      category,
      pricePerNight: parseFloat(pricePerNight),
      imageUrl,
      amenities,
    };

    try {
      let res;
      if (editingHotel) {
        res = await fetch(`/api/hotels/${editingHotel.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/hotels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        fetchData();
      } else {
        alert("Error al guardar hotel.");
      }
    } catch {
      alert("Error de conexión.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este hotel?")) return;
    try {
      const res = await fetch(`/api/hotels/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {
      alert("Error eliminando hotel.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Gestión de Hoteles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra alojamientos, categorías y precios por noche asociados a cada destino.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-md shadow-amber-500/20 transition self-start"
        >
          <Plus className="w-4 h-4" />
          Nuevo Hotel
        </button>
      </div>

      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Hotel</th>
              <th className="py-3 px-4">Destino Asociado</th>
              <th className="py-3 px-4">Categoría</th>
              <th className="py-3 px-4">Precio / Noche</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {hotels.map((h) => (
              <tr key={h.id} className="hover:bg-slate-900/40 transition">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={h.imageUrl}
                      alt={h.name}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                    />
                    <div>
                      <span className="font-bold text-white block">{h.name}</span>
                      <span className="text-[10px] text-slate-500">{h.address}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-amber-300 font-semibold">
                  {h.destination?.name || "Sin destino"}
                </td>
                <td className="py-3 px-4">
                  <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-semibold text-[10px]">
                    {h.category}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-emerald-400">
                  {formatCurrency(h.pricePerNight)}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(h)}
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Crear / Editar Hotel */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base">
                {editingHotel ? "Editar Hotel" : "Registrar Hotel"}
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
                <label className="text-slate-300 font-bold block mb-1">Destino Turístico</label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Nombre del Hotel</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Grand Riviera Resort"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as HotelCategoryType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="ALL_INCLUSIVE">Todo Incluido</option>
                    <option value="BOUTIQUE">Boutique</option>
                    <option value="BUDGET">Económico</option>
                    <option value="BEACHFRONT">Frente al Mar</option>
                    <option value="PET_FRIENDLY">Pet-Friendly</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Precio / Noche ($ USD)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    placeholder="180"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Dirección / Zona</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Blvd. Kukulcan Km 16.5, Zona Hotelera"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Amenidades (Separadas por comas)</label>
                <input
                  type="text"
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  placeholder="Piscina,Spa,Wifi,Restaurante"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">URL de Imagen</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none"
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
                  {saving ? "Guardando..." : "Guardar Hotel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
