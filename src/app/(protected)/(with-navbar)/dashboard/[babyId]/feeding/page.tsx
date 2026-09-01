import AddFeedingForm from "@/components/forms/AddFeedingForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const FeedingPage = () => {
  return (
    <div className="px-4 pt-8">
      <div className="text-[#1F2937] flex items-center space-x-4 text-2xl font-semibold mb-2">
        <Link href="/dashboard">
          <ChevronLeft />
        </Link>
        <h2>Repas</h2>
      </div>
      <p className="text-[#6B7280] mb-8 text-sm">
        Ajoute un biberon ou une tétée très rapidement.
      </p>
      <AddFeedingForm />
    </div>
  );
};

export default FeedingPage;
