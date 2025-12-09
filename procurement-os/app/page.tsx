// app/page.tsx

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">

      {/* HERO SECTION */}
      <section className="pt-32 pb-20 px-6 md:px-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-6xl mx-auto text-center">

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Procurement OS  
            <span className="block text-blue-600 mt-2">
              Automate Purchasing. Eliminate Chaos.
            </span>
          </h1>

          <p className="mt-6 text-xl text-gray-700 max-w-2xl mx-auto">
            The complete operating system for vendor management, rate contracts,
            purchase orders, QC, GRN, invoicing, and 3-way matching — built for manufacturers.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a
              href="/vendors"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg shadow-md transition-all"
            >
              Launch App
            </a>

            <a
              href="#features"
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-lg transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-24 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900">Powerful Features</h2>
          <p className="mt-4 text-gray-600 text-lg">
            Everything your procurement workflow needs — in one place.
          </p>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">

            <Feature
              title="Vendor Management"
              desc="Track vendors, documentation, and performance all in one system."
            />

            <Feature
              title="Rate Contracts"
              desc="Centralized contracts with automated renewal and price tracking."
            />

            <Feature
              title="Purchase Orders"
              desc="Create, approve, and dispatch POs with full history and analytics."
            />

            <Feature
              title="Quality Checks"
              desc="QC workflows with image uploads, approvals, and rejection logs."
            />

            <Feature
              title="GRN + Invoicing"
              desc="Seamless GRN creation, invoice logging, and discrepancy detection."
            />

            <Feature
              title="3-Way Matching"
              desc="Fully automated PO ↔ GRN ↔ Invoice matching to reduce errors."
            />

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <h2 className="text-4xl font-bold">Ready to modernize procurement?</h2>
        <p className="mt-4 text-xl opacity-90">
          Start using Procurement OS today.
        </p>

        <a
          href="/vendors"
          className="mt-8 inline-block px-10 py-4 bg-white text-blue-700 rounded-xl text-lg font-semibold shadow-lg hover:bg-gray-100"
        >
          Go to Dashboard
        </a>
      </section>

    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 text-gray-600">{desc}</p>
    </div>
  );
}
