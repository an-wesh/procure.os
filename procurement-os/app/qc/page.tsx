"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function QCPage() {
  const [pos, setPos] = useState<any[]>([]);
  const [qcs, setQcs] = useState<any[]>([]);

  const [form, setForm] = useState({
    po_id: "",
    batch_no: "",
    purity: "",
    moisture: "",
    appearance: "",
    accepted: true,
    coa_url: "",
    raw_text: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: poData } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("id", { ascending: false });

    const { data: qcData } = await supabase
      .from("qc")
      .select("*")
      .order("id", { ascending: false });

    setPos(poData || []);
    setQcs(qcData || []);
  }

  async function parseText() {
    if (!form.raw_text) return;

    const resp = await fetch("/api/parse-qc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: form.raw_text }),
    });

    const body = await resp.json();

    if (body?.parsed) {
      setForm((f) => ({
        ...f,
        batch_no: body.parsed.batch_no ?? f.batch_no,
        purity: body.parsed.purity ?? f.purity,
        moisture: body.parsed.moisture ?? f.moisture,
        appearance: body.parsed.appearance ?? f.appearance,
      }));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("qc").insert({
      po_id: Number(form.po_id),
      batch_no: form.batch_no,
      purity: Number(form.purity || 0),
      moisture: Number(form.moisture || 0),
      appearance: form.appearance,
      accepted: form.accepted,
      coa_url: form.coa_url,
    });

    setForm({
      po_id: "",
      batch_no: "",
      purity: "",
      moisture: "",
      appearance: "",
      accepted: true,
      coa_url: "",
      raw_text: "",
    });

    fetchData();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6">QC Entry</h1>

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
        {/* PO SELECT */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Purchase Order *</label>
          <select
            required
            value={form.po_id}
            onChange={(e) => setForm({ ...form, po_id: e.target.value })}
            className="p-3 border rounded-lg"
          >
            <option value="">Select PO</option>
            {pos.map((p) => (
              <option key={p.id} value={p.id}>
                PO-{String(p.id).padStart(4, "0")} — {p.product}
              </option>
            ))}
          </select>
        </div>

        {/* RAW TEXT / PDF PASTE AREA */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Paste CoA / PDF Text</label>
          <textarea
            placeholder="Paste CoA text here for AI extraction..."
            value={form.raw_text}
            onChange={(e) => setForm({ ...form, raw_text: e.target.value })}
            className="p-3 border rounded-lg h-32"
          />
        </div>

        {/* AI PARSE BUTTON */}
        <div className="md:col-span-2 flex justify-start">
          <button
            type="button"
            onClick={parseText}
            className="px-4 py-2 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition"
          >
            AI Parse
          </button>
        </div>

        {/* BATCH NO */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Batch No</label>
          <input
            placeholder="Batch No"
            value={form.batch_no}
            onChange={(e) => setForm({ ...form, batch_no: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* PURITY */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Purity (%)</label>
          <input
            placeholder="Purity"
            value={form.purity}
            onChange={(e) => setForm({ ...form, purity: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* MOISTURE */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Moisture (%)</label>
          <input
            placeholder="Moisture"
            value={form.moisture}
            onChange={(e) => setForm({ ...form, moisture: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* APPEARANCE */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Appearance</label>
          <input
            placeholder="Appearance"
            value={form.appearance}
            onChange={(e) => setForm({ ...form, appearance: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* ACCEPTED CHECKBOX */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={form.accepted}
            onChange={(e) =>
              setForm({ ...form, accepted: e.target.checked })
            }
          />
          <label className="font-semibold">Accepted</label>
        </div>

        {/* COA URL */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">CoA URL (optional)</label>
          <input
            placeholder="https://example.com/coa.pdf"
            value={form.coa_url}
            onChange={(e) => setForm({ ...form, coa_url: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* SUBMIT */}
        <div className="md:col-span-2 flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition">
            Save QC Entry
          </button>
        </div>
      </form>

      {/* QC TABLE */}
      <section className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">QC Entries</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="py-3 px-4 text-left">PO</th>
              <th className="py-3 px-4 text-left">Batch</th>
              <th className="py-3 px-4 text-left">Purity</th>
              <th className="py-3 px-4 text-left">Moisture</th>
              <th className="py-3 px-4 text-left">Accepted</th>
            </tr>
          </thead>

          <tbody>
            {qcs.map((q) => (
              <tr key={q.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">PO-{String(q.po_id).padStart(4, "0")}</td>
                <td className="py-3 px-4">{q.batch_no}</td>
                <td className="py-3 px-4">{q.purity}</td>
                <td className="py-3 px-4">{q.moisture}</td>
                <td className="py-3 px-4">{q.accepted ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
