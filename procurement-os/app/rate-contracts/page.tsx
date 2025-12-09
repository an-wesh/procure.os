"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function RateContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [form, setForm] = useState({
    vendor_id: "",
    product: "",
    rate: "",
    valid_from: "",
    valid_to: "",
    packaging: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: vendors } = await supabase
      .from("vendors")
      .select("*")
      .order("id", { ascending: false });

    const { data: contracts } = await supabase
      .from("rate_contracts")
      .select("*")
      .order("id", { ascending: false });

    setVendors(vendors || []);
    setContracts(contracts || []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("rate_contracts").insert({
      vendor_id: Number(form.vendor_id),
      product: form.product,
      rate: Number(form.rate),
      valid_from: form.valid_from || null,
      valid_to: form.valid_to || null,
      packaging: form.packaging,
    });

    setForm({
      vendor_id: "",
      product: "",
      rate: "",
      valid_from: "",
      valid_to: "",
      packaging: "",
    });

    fetchData();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-6">Rate Contracts</h1>

      {/* FORM CARD */}
      <form
        onSubmit={submit}
        className="
          bg-white 
          p-6 
          rounded-xl 
          shadow-md 
          border 
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-4 
          mb-10
        "
      >
        {/* Vendor */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Vendor *</label>
          <select
            required
            value={form.vendor_id}
            onChange={(e) =>
              setForm({ ...form, vendor_id: e.target.value })
            }
            className="p-3 border rounded-lg"
          >
            <option value="">Select vendor</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Product *</label>
          <input
            required
            placeholder="Product"
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Rate */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Rate *</label>
          <input
            required
            placeholder="Rate"
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Valid From */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Valid From</label>
          <input
            type="date"
            value={form.valid_from}
            onChange={(e) =>
              setForm({ ...form, valid_from: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Valid To */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Valid To</label>
          <input
            type="date"
            value={form.valid_to}
            onChange={(e) =>
              setForm({ ...form, valid_to: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Packaging */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Packaging</label>
          <input
            placeholder="e.g., 200 kg drum"
            value={form.packaging}
            onChange={(e) =>
              setForm({ ...form, packaging: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition">
            Save Contract
          </button>
        </div>
      </form>

      {/* CONTRACT TABLE */}
      <section className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Rate Contract List</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="py-3 px-4 text-left">Vendor</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Rate</th>
              <th className="py-3 px-4 text-left">Validity</th>
              <th className="py-3 px-4 text-left">Packaging</th>
            </tr>
          </thead>

          <tbody>
            {contracts.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">
                  {vendors.find((v) => v.id === c.vendor_id)?.name ||
                    c.vendor_id}
                </td>
                <td className="py-3 px-4">{c.product}</td>
                <td className="py-3 px-4">{c.rate}</td>
                <td className="py-3 px-4">
                  {c.valid_from || "-"} → {c.valid_to || "-"}
                </td>
                <td className="py-3 px-4">{c.packaging || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
