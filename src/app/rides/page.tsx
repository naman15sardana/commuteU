"use client";

import { useEffect, useState } from "react";

interface Ride {
  id: string;
  fromLabel: string;
  toCampus: string;
  seats: number;
  departTime: string;
  driverId: string;
  notes?: string;
}

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [form, setForm] = useState({
    driverId: "",
    fromLabel: "",
    toCampus: "",
    seats: "",
    departTime: "",
    notes: "",
  });

  // Fetch rides from API
  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch("/api/rides");
        const data = await res.json();
        setRides(data);
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          driverId: form.driverId,
          fromLabel: form.fromLabel,
          toCampus: form.toCampus,
          seats: Number(form.seats),
          departTime: form.departTime,
          notes: form.notes,
        }),
      });

      if (!res.ok) throw new Error("Failed to create ride");
      const newRide = await res.json();
      alert("Ride added successfully!");
      setRides((prev) => [newRide.ride, ...prev]);
      setForm({
        driverId: "",
        fromLabel: "",
        toCampus: "",
        seats: "",
        departTime: "",
        notes: "",
      });
    } catch (err) {
      alert("Error creating ride: " + err);
    }
  };

  if (loading) return <div className="p-8 text-gray-600">Loading rides...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-800 mb-6">CommuteU Rides</h1>

      {/* Create Ride Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md mb-8 space-y-4 max-w-xl"
      >
        <h2 className="text-lg font-semibold text-gray-700">Create New Ride</h2>

        <input
          type="text"
          placeholder="Driver ID"
          value={form.driverId}
          onChange={(e) => setForm({ ...form, driverId: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="From Location"
          value={form.fromLabel}
          onChange={(e) => setForm({ ...form, fromLabel: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Destination Campus (Burnaby / Surrey / Vancouver)"
          value={form.toCampus}
          onChange={(e) => setForm({ ...form, toCampus: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Seats Available"
          value={form.seats}
          onChange={(e) => setForm({ ...form, seats: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="datetime-local"
          value={form.departTime}
          onChange={(e) => setForm({ ...form, departTime: e.target.value })}
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Ride
        </button>
      </form>

      {/* Rides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.length === 0 ? (
          <p className="text-gray-600">No rides available.</p>
        ) : (
          rides.map((ride) => (
            <div
              key={ride.id}
              className="p-6 bg-white rounded-xl shadow-md border hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                {ride.fromLabel} → {ride.toCampus}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Departure:</strong>{" "}
                {new Date(ride.departTime).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Seats:</strong> {ride.seats}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Driver ID:</strong> {ride.driverId}
              </p>
              {ride.notes && (
                <p className="text-gray-500 italic mt-2">"{ride.notes}"</p>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
