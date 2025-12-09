"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function InvoicePage() {
  const [pos, setPos] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [form, setForm] = useState({
    po_id: "",
    invoice_no: "",
    invoice_qty: "",
    invoice_amount: "",
    taxes: "",
    file: null as File | null
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: pos } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("id", { ascending: false });

    const { data: invoices } = await supabase
      .from("invoices")
      .select("*")
      .order("id", { ascending: false });

    setPos(pos || []);
    setInvoices(invoices || []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    let file_url = "";
    if (form.file) {
      const file = form.file;
      const fileName = `${Date.now()}_${file.name}`;

      const { data, error } = await supabase.storage
        .from("invoices")
        .upload(fileName, file);

      if (error) {
        alert("Upload error: " + error.message);
        return;
      }

      const { data: publicData } = supabase.storage
        .from("invoices")
        .getPublicUrl(fileName);

      file_url = publicData.publicUrl;
    }

    await supabase.from("invoices").insert({
      po_id: Number(form.po_id),
      invoice_no: form.invoice_no,
      invoice_qty: Number(form.invoice_qty || 0),
      invoice_amount: Number(form.invoice_amount || 0),
      taxes: Number(form.taxes || 0),
      file_url
    });

    setForm({
      po_id: "",
      invoice_no: "",
      invoice_qty: "",
      invoice_amount: "",
      taxes: "",
      file: null
    });

    await fetchData();
  }

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Invoice Upload</h1>

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

        {/* Invoice No */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Invoice Number</label>
          <input
            placeholder="Invoice No"
            value={form.invoice_no}
            onChange={(e) =>
              setForm({ ...form, invoice_no: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Invoice Qty */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Invoice Quantity</label>
          <input
            placeholder="Quantity"
            value={form.invoice_qty}
            onChange={(e) =>
              setForm({ ...form, invoice_qty: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Invoice Amount */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Invoice Amount</label>
          <input
            placeholder="Amount"
            value={form.invoice_amount}
            onChange={(e) =>
              setForm({ ...form, invoice_amount: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Taxes */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Taxes</label>
          <input
            placeholder="Taxes"
            value={form.taxes}
            onChange={(e) =>
              setForm({ ...form, taxes: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* File Upload */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Upload Invoice File</label>
          <input
            type="file"
            onChange={(e) =>
              setForm({
                ...form,
                file: e.target.files ? e.target.files[0] : null
              })
            }
            className="p-3 border rounded-lg bg-gray-50"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition">
            Upload Invoice
          </button>
        </div>
      </form>

      {/* TABLE OF INVOICES */}
      <section className="bg-white p-6 rounded-xl border shadow-md">
        <h2 className="text-xl font-semibold mb-4">Invoices</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="py-3 px-4 text-left">Invoice No</th>
              <th className="py-3 px-4 text-left">PO</th>
              <th className="py-3 px-4 text-left">Qty</th>
              <th className="py-3 px-4 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{inv.invoice_no}</td>
                <td className="py-3 px-4">
                  PO-{String(inv.po_id).padStart(4, "0")}
                </td>
                <td className="py-3 px-4">{inv.invoice_qty}</td>
                <td className="py-3 px-4">{inv.invoice_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
