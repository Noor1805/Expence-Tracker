import MagicBento from "../components/layout/effects/MagicBento";

export default function FeaturesSection() {
  return (
    <section className="w-full py-28 bg-[#050505] text-white relative">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <h2 className="text-4xl md:text-5xl font-bold">
          Everything you need to
          <span className="text-orange-500"> manage money smarter</span>
        </h2>
        <p className="text-gray-400 mt-4 text-lg">
          Monexa combines tracking, analytics, budgeting, and security into one
          powerful financial platform.
        </p>
      </div>

      {/* BENTO GRID */}
      <div className="flex justify-center">
        <MagicBento glowColor="255, 102, 0" />
      </div>
    </section>
  );
}
