import AddDiaperForm from "@/components/forms/AddDiaperForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const DiaperPage = () => {
  return (
    <div className="px-4 pt-8">
      <div className="text-[#1F2937] flex items-center space-x-4 text-2xl font-semibold mb-2">
        <Link href="/dashboard">
          <ChevronLeft />
        </Link>
        <h2>Couches</h2>
      </div>
      <p className="text-[#6B7280] mb-8 text-sm">
        Choisis le type, ajuste l’heure si besoin, puis valide.
      </p>
      <AddDiaperForm />
    </div>
  );
};

export default DiaperPage;
