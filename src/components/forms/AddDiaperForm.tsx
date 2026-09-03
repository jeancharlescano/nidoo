"use client";
import { useParams } from "next/navigation";
import Button from "../ui/Button";
import {
  createDiaperAction,
  CreateDiaperState,
} from "@/lib/actions/diaper/create-diaper";
import { useActionState } from "react";

const initialState: CreateDiaperState = {
  errors: [],
};

const AddDiaperForm = () => {
  const [state, formAction, pending] = useActionState(
    createDiaperAction,
    initialState,
  );
  const params = useParams<{ babyId: string }>();
  const babyId = params.babyId;

  return (
    <>
      <form action={formAction} className="w-full min-w-0">
        {state?.errors && (
          <p className="text-red-500 font-semibold text-xs -mt-4 mb-4">
            {state.errors[0]}
          </p>
        )}
        <input type="hidden" name="babyId" value={babyId} />
        {/* Type de couche */}
        <p className="text-sm font-semibold mb-1">Type de couche</p>
        <div className="flex w-full gap-2 mb-4">
          <label className="flex-1 min-w-0 cursor-pointer">
            <input
              className="peer sr-only"
              name="diaperType"
              type="radio"
              value="PEE"
              required
            />

            <div className="h-12 flex items-center justify-center border border-[#DDE5DF] px-2 rounded-xl text-center transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm font-semibold tracking-wider text-[#1F2937] hover:border-gray-400 py-2">
              💧 Pipi
            </div>
          </label>

          <label className="flex-1 min-w-0 cursor-pointer">
            <input
              className="peer sr-only"
              name="diaperType"
              type="radio"
              value="POOP"
            />

            <div className="h-12 flex items-center justify-center border border-[#DDE5DF] px-2 rounded-xl text-center transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm font-semibold tracking-wider text-[#1F2937] hover:border-gray-400 py-2">
              💩 Caca
            </div>
          </label>
          <label className="flex-1 min-w-0 cursor-pointer">
            <input
              className="peer sr-only"
              name="diaperType"
              type="radio"
              value="BOTH"
            />

            <div className="h-12 flex items-center justify-center border border-[#DDE5DF] px-2 rounded-xl text-center transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm font-semibold tracking-wider text-[#1F2937] hover:border-gray-400 py-2">
              💧💩
            </div>
          </label>
        </div>

        {/* heure du change */}
        <label className="block mb-8 w-full">
          <span className="text-sm font-semibold mb-1 block">
            Heure du change
          </span>

          <div className="w-full border border-[#DDE5DF] rounded-xl px-4 py-3 bg-white box-border">
            <input
              type="time"
              name="diaperTime"
              className="block w-full min-w-0 border-0 p-0 text-sm bg-transparent outline-none appearance-none"
            />
          </div>
        </label>
        <Button buttonText="✓ Enregistrer la couche" disabled={pending} />
      </form>
    </>
  );
};

export default AddDiaperForm;
