"use client";

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
      onChange={(e) => {
        router.push(`/dashboard?babyId=${e.target.value}`);
      }}
      className="border rounded-full px-2 bg-gray-200 text-xl"
    >
      {babies.map((baby) => (
        <option key={baby.id} value={baby.id}>
          {baby.firstName}
        </option>
      ))}
    </select>
  );
}
