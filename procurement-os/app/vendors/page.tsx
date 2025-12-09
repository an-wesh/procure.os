"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    gst: "",
    payment_terms: "",
    lead_time: "",
    contact_name: "",
    contact_email: "",
    contact_phone: ""
  });

  async function fetchVendors() {
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .order("id", { ascending: false });

    setVendors(data || []);
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    await supabase.from("vendors").insert(form);

    setForm({
      name: "",
      gst: "",
      payment_terms: "",
      lead_time: "",
      contact_name: "",
      contact_email: "",
      contact_phone: ""
    });

    fetchVendors();
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-6">Vendors</h1>

      {/* FORM CARD */}
      <form
        onSubmit={submit}
        className="
          bg-white p-6 rounded-xl shadow-md border
          grid grid-cols-1 md:grid-cols-2 gap-4 mb-10
        "
      >
        {/* Vendor Name */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Vendor Name *</label>
          <input
            required
            placeholder="Vendor Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* GST */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">GST Number</label>
          <input
            placeholder="GST"
            value={form.gst}
            onChange={(e) => setForm({ ...form, gst: e.target.value })}
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Payment Terms */}
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

        {/* Lead Time */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Lead Time (days)</label>
          <input
            placeholder="Lead time"
            value={form.lead_time}
            onChange={(e) =>
              setForm({ ...form, lead_time: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Contact Name */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Contact Name</label>
          <input
            placeholder="Name of contact person"
            value={form.contact_name}
            onChange={(e) =>
              setForm({ ...form, contact_name: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Contact Phone */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Contact Phone</label>
          <input
            placeholder="Phone number"
            value={form.contact_phone}
            onChange={(e) =>
              setForm({ ...form, contact_phone: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* Contact Email */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Contact Email</label>
          <input
            placeholder="Email address"
            value={form.contact_email}
            onChange={(e) =>
              setForm({ ...form, contact_email: e.target.value })
            }
            className="p-3 border rounded-lg"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="md:col-span-2 flex justify-end">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow hover:bg-blue-700 transition">
            Create Vendor
          </button>
        </div>
      </form>

      {/* VENDOR TABLE CARD */}
      <section className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Vendor List</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-gray-100 border-b text-gray-700">
                <th className="py-3 px-4 text-left font-semibold">Vendor</th>
                <th className="py-3 px-4 text-left font-semibold">GST</th>
                <th className="py-3 px-4 text-left font-semibold">Contact Name</th>
                <th className="py-3 px-4 text-left font-semibold">Phone</th>
                <th className="py-3 px-4 text-left font-semibold">Email</th>
                <th className="py-3 px-4 text-left font-semibold">Payment Terms</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((v) => (
                <tr key={v.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 font-medium">{v.name}</td>
                  <td className="py-3 px-4">{v.gst || "-"}</td>
                  <td className="py-3 px-4">{v.contact_name || "-"}</td>
                  <td className="py-3 px-4">{v.contact_phone || "-"}</td>
                  <td className="py-3 px-4">{v.contact_email || "-"}</td>
                  <td className="py-3 px-4">{v.payment_terms || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
