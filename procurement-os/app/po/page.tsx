"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function POPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [poList, setPoList] = useState<any[]>([]);
  const [form, setForm] = useState({
    vendor_id: "",
    product: "",
    quantity: "",
    rate: "",
    delivery_date: "",
    tax: "",
    payment_terms: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: vendors } = await supabase.from("vendors").select("*");
    const { data: poList } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("id", { ascending: false });

    setVendors(vendors || []);
    setPoList(poList || []);
  }

  async function onVendorOrProductChange(vendorId: string, product: string) {
    setForm({ ...form, vendor_id: vendorId, product });

    if (!vendorId || !product) return;

    const today = new Date().toISOString().slice(0, 10);

    const { data: contract } = await supabase
      .from("rate_contracts")
      .select("*")
      .eq("vendor_id", Number(vendorId))
      .eq("product", product)
      .lte("valid_from", today)
      .gte("valid_to", today)
      .maybeSingle();

    if (contract) {
      setForm((prev) => ({ ...prev, rate: String(contract.rate) }));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("purchase_orders").insert({
      vendor_id: Number(form.vendor_id),
      product: form.product,
      quantity: Number(form.quantity),
      rate: Number(form.rate),
      delivery_date: form.delivery_date || null,
      tax: Number(form.tax || 0),
      payment_terms: form.payment_terms,
      notes: form.notes,
    });

    setForm({
      vendor_id: "",
      product: "",
      quantity: "",
      rate: "",
      delivery_date: "",
      tax: "",
      payment_terms: "",
      notes: "",
    });

    await fetchData();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-6">Purchase Orders</h1>

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
        {/* VENDOR SELECT */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Vendor *</label>
          <select
            required
            value={form.vendor_id}
            onChange={(e) =>
              onVendorOrProductChange(e.target.value, form.product)
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

        {/* PRODUCT INPUT */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Product *</label>
          <input
            required
            placeholder="Product"
            value={form.product}
            onChange={(e) =>
              onVendorOrProductChange(form.vendor_id, e.target.value)
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* QUANTITY */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Quantity *</label>
          <input
            required
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* RATE */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Rate (auto-filled if contract exists)</label>
          <input
            placeholder="Rate"
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* DELIVERY DATE */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Delivery Date</label>
          <input
            type="date"
            value={form.delivery_date}
            onChange={(e) =>
              setForm({ ...form, delivery_date: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* TAX */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Tax (%)</label>
          <input
            placeholder="Tax"
            value={form.tax}
            onChange={(e) => setForm({ ...form, tax: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* PAYMENT TERMS */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Payment Terms</label>
          <input
            placeholder="Payment terms"
            value={form.payment_terms}
            onChange={(e) =>
              setForm({ ...form, payment_terms: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* NOTES */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Notes</label>
          <input
            placeholder="Additional notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* SUBMIT */}
        <div className="md:col-span-2 flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition">
            Create PO
          </button>
        </div>
      </form>

      {/* PO PREVIEW CARD */}
      <section className="bg-white p-6 rounded-xl shadow-md border mb-10">
        <h2 className="text-xl font-semibold mb-4">Recent Purchase Orders (Last 5)</h2>

        <div className="grid gap-4">
          {poList.slice(0, 5).map((po) => (
            <div key={po.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="text-sm text-gray-600 mb-1">
                PO-{po.id.toString().padStart(4, "0")}
              </div>
              <div><strong>Vendor:</strong> {vendors.find((v) => v.id === po.vendor_id)?.name || po.vendor_id}</div>
              <div><strong>Product:</strong> {po.product}</div>
              <div><strong>Qty:</strong> {po.quantity}</div>
              <div><strong>Rate:</strong> {po.rate}</div>
              <div><strong>Value:</strong> {Number(po.quantity) * Number(po.rate)}</div>
              <div><strong>Delivery:</strong> {po.delivery_date || "-"}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FULL PO TABLE */}
      <section className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">All Purchase Orders</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="py-3 px-4 text-left">PO</th>
              <th className="py-3 px-4 text-left">Vendor</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Qty</th>
            </tr>
          </thead>

          <tbody>
            {poList.map((po) => (
              <tr key={po.id} className="border-b hover:bg-gray-50 transition">
                <td className="py-3 px-4">PO-{String(po.id).padStart(4, "0")}</td>
                <td className="py-3 px-4">{vendors.find((v) => v.id === po.vendor_id)?.name || po.vendor_id}</td>
                <td className="py-3 px-4">{po.product}</td>
                <td className="py-3 px-4">{po.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
