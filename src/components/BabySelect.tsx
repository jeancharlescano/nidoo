"use client";

import { setSelectedBaby } from "@/lib/actions/baby/set-selected-baby";
import { useRouter } from "next/navigation";

export default function BabySelect({
  babies,
  selectedBabyId,
}: {
  babies: { id: string; firstName: string }[];
  selectedBabyId: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selectedBabyId}
      onChange={async (e) => {
        const babyId = e.target.value;

        await setSelectedBaby(babyId);

        router.push(`/dashboard?babyId=${babyId}`);
      }}
      className="text-xl"
    >
      {babies.map((baby) => (
        <option key={baby.id} value={baby.id}>
          {baby.firstName}
        </option>
      ))}
    </select>
  );
}
