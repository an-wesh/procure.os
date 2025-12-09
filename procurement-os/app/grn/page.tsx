"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function GRNPage() {
  const [pos, setPos] = useState<any[]>([]);
  const [qcs, setQcs] = useState<any[]>([]);
  const [grns, setGrns] = useState<any[]>([]);
  const [form, setForm] = useState({
    po_id: "",
    qc_id: "",
    accepted_qty: "",
    rejected_qty: "",
    remarks: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: pos } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("id", { ascending: false });

    const { data: qcs } = await supabase
      .from("qc")
      .select("*")
      .order("id", { ascending: false });

    const { data: grns } = await supabase
      .from("grn")
      .select("*")
      .order("id", { ascending: false });

    setPos(pos || []);
    setQcs(qcs || []);
    setGrns(grns || []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const acceptedNum = Number(form.accepted_qty || 0);
    const rejectedNum = Number(form.rejected_qty || 0);

    const { data: po } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("id", Number(form.po_id))
      .single();

    if (po && acceptedNum + rejectedNum > Number(po.quantity)) {
      alert("Invalid quantity: accepted + rejected > PO qty");
      return;
    }

    const { data: inserted } = await supabase
      .from("grn")
      .insert({
        po_id: Number(form.po_id),
        qc_id: Number(form.qc_id) || null,
        accepted_qty: acceptedNum,
        rejected_qty: rejectedNum,
        remarks: form.remarks
      })
      .select()
      .single();

    if (inserted?.id) {
      const code = `GRN-${inserted.id.toString().padStart(4, "0")}`;
      await supabase.from("grn").update({ grn_code: code }).eq("id", inserted.id);
    }

    setForm({
      po_id: "",
      qc_id: "",
      accepted_qty: "",
      rejected_qty: "",
      remarks: ""
    });

    await fetchData();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-6">Goods Receipt Note (GRN)</h1>

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

        {/* QC SELECT */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Quality Check (optional)</label>
          <select
            value={form.qc_id}
            onChange={(e) => setForm({ ...form, qc_id: e.target.value })}
            className="p-3 border rounded-lg"
          >
            <option value="">Select QC</option>
            {qcs.map((q) => (
              <option key={q.id} value={q.id}>
                QC-{q.id} (PO-{String(q.po_id).padStart(4, "0")})
              </option>
            ))}
          </select>
        </div>

        {/* ACCEPTED QTY */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Accepted Quantity</label>
          <input
            placeholder="Accepted qty"
            value={form.accepted_qty}
            onChange={(e) => setForm({ ...form, accepted_qty: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* REJECTED QTY */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Rejected Quantity</label>
          <input
            placeholder="Rejected qty"
            value={form.rejected_qty}
            onChange={(e) => setForm({ ...form, rejected_qty: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* REMARKS */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Remarks</label>
          <input
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="md:col-span-2 flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition">
            Create GRN
          </button>
        </div>
      </form>

      {/* GRN TABLE CARD */}
      <section className="bg-white p-6 rounded-xl border shadow-md">
        <h2 className="text-xl font-semibold mb-4">Existing GRNs</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="py-3 px-4 text-left">GRN Code</th>
              <th className="py-3 px-4 text-left">PO</th>
              <th className="py-3 px-4 text-left">Accepted</th>
              <th className="py-3 px-4 text-left">Rejected</th>
            </tr>
          </thead>

          <tbody>
            {grns.map((g) => (
              <tr key={g.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{g.grn_code || `GRN-${g.id}`}</td>
                <td className="py-3 px-4">PO-{String(g.po_id).padStart(4, "0")}</td>
                <td className="py-3 px-4">{g.accepted_qty}</td>
                <td className="py-3 px-4">{g.rejected_qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
