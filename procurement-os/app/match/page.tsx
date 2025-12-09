"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function MatchPage() {
  const [pos, setPos] = useState<any[]>([]);
  const [grns, setGrns] = useState<any[]>([]);
  const [invs, setInvs] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: pos } = await supabase
      .from("purchase_orders")
      .select("*")
      .order("id", { ascending: false });

    const { data: grns } = await supabase
      .from("grn")
      .select("*")
      .order("id", { ascending: false });

    const { data: invs } = await supabase
      .from("invoices")
      .select("*")
      .order("id", { ascending: false });

    setPos(pos || []);
    setGrns(grns || []);
    setInvs(invs || []);
  }

  function computeStatus(po: any) {
    const grn = grns.find((g) => g.po_id === po.id);
    const inv = invs.find((i) => i.po_id === po.id);

    const poQty = Number(po.quantity || 0);
    const grnQty = Number(grn?.accepted_qty ?? 0);
    const invQty = Number(inv?.invoice_qty ?? 0);

    let status = "Missing data";
    let issue = "";

    if (!grn && !inv) {
      status = "No GRN & Invoice";
    } else if (poQty === grnQty && grnQty === invQty) {
      status = "OK";
    } else {
      status = "Mismatch";
      if (grnQty < poQty) issue = "Short Receipt";
      if (invQty > grnQty)
        issue = issue ? issue + " + Excess Invoice" : "Excess Invoice";
      if (!grn) issue = "No GRN";
      if (!inv) issue = issue ? issue + " + No Invoice" : "No Invoice";
    }

    return { status, issue, poQty, grnQty, invQty };
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-6">3-Way Match</h1>

      {/* TABLE CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md border overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="py-3 px-4 text-left font-semibold">Purchase Order</th>
              <th className="py-3 px-4 text-left font-semibold">PO Qty</th>
              <th className="py-3 px-4 text-left font-semibold">GRN Qty</th>
              <th className="py-3 px-4 text-left font-semibold">Invoice Qty</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Issues</th>
            </tr>
          </thead>

          <tbody>
            {pos.map((po) => {
              const r = computeStatus(po);

              return (
                <tr key={po.id} className="border-b hover:bg-gray-50 transition">

                  {/* Purchase order column */}
                  <td className="py-3 px-4 font-medium">
                    PO-{String(po.id).padStart(4, "0")} — {po.product}
                  </td>

                  {/* PO qty */}
                  <td className="py-3 px-4">{r.poQty}</td>

                  {/* GRN qty */}
                  <td className="py-3 px-4">{r.grnQty || "-"}</td>

                  {/* Invoice qty */}
                  <td className="py-3 px-4">{r.invQty || "-"}</td>

                  {/* STATUS BADGE */}
                  <td className="py-3 px-4">
                    {r.status === "OK" ? (
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                        OK
                      </span>
                    ) : r.status === "Mismatch" ? (
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                        Mismatch
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-sm font-medium">
                        {r.status}
                      </span>
                    )}
                  </td>

                  {/* ISSUES COLUMN */}
                  <td className="py-3 px-4 text-gray-800 max-w-[250px] whitespace-normal">
                    {r.issue || "-"}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
