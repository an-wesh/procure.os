// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procurement OS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-100">

        {/* FIXED SIDEBAR */}
        <aside
          className="fixed top-0 left-0 h-screen w-64 bg-blue-900 text-white shadow-xl z-50 flex flex-col"
        >
          <div className="px-6 py-6 border-b border-blue-700">
            <h1 className="text-2xl font-bold tracking-wide">
              Procurement OS
            </h1>
          </div>

          <nav className="flex flex-col gap-3 px-6 py-6 text-lg font-medium">
            <a className="hover:bg-blue-700 px-4 py-2 rounded" href="/vendors">Vendors</a>
            <a className="hover:bg-blue-700 px-4 py-2 rounded" href="/rate-contracts">Rate Contracts</a>
            <a className="hover:bg-blue-700 px-4 py-2 rounded" href="/po">Purchase Orders</a>
            <a className="hover:bg-blue-700 px-4 py-2 rounded" href="/qc">QC</a>
            <a className="hover:bg-blue-700 px-4 py-2 rounded" href="/grn">GRN</a>
            <a className="hover:bg-blue-700 px-4 py-2 rounded" href="/invoice">Invoice</a>
            <a className="hover:bg-blue-700 px-4 py-2 rounded" href="/match">3-Way Match</a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="ml-64 w-full min-h-screen p-10">
          {children}
        </main>

      </body>
    </html>
  );
}
