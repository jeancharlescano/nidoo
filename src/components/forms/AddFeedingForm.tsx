"use client";
import { useActionState, useState } from "react";
import Button from "../ui/Button";
import {
  createFeedingAction,
  CreateFeedingState,
} from "@/lib/actions/feeding/create-feeding";
import { useParams } from "next/navigation";

const initialState: CreateFeedingState = {
  errors: [],
};
const AddFeedingForm = () => {
  const [customQty, setCustomQty] = useState(false);
  const [state, formAction, pending] = useActionState(
    createFeedingAction,
    initialState,
  );

  const params = useParams<{ babyId: string }>();
  const babyId = params.babyId;
  return (
    <form action={formAction} className="w-full min-w-0">
      {state?.errors && (
        <p className="text-red-500 font-semibold text-xs -mt-4 mb-4">
          {state.errors[0]}
        </p>
      )}
      <input type="hidden" name="babyId" value={babyId} />
      <p className="text-sm font-semibold mb-1">Type de repas</p>
      <div className="flex w-full gap-3 mb-4">
        <label className="flex-1 cursor-pointer">
          <input
            className="peer sr-only"
            name="feedingType"
            type="radio"
            value="BOTTLE"
            required
          />

          <div className="border border-[#DDE5DF] px-4 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm font-semibold tracking-wider text-[#1F2937] hover:border-gray-400 ">
            🍼 Biberon
          </div>
        </label>

        <label className="flex-1 cursor-pointer">
          <input
            className="peer sr-only"
            name="feedingType"
            type="radio"
            value="BREAST"
          />

          <div className="border border-[#DDE5DF] px-4 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm font-semibold tracking-wider text-[#1F2937] hover:border-gray-400 ">
            🤱 Tétée
          </div>
        </label>
      </div>

      {/* Quantité */}
      <p className="text-sm font-semibold mb-1">Quantité</p>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <label className=" cursor-pointer">
          <input
            className="peer sr-only"
            name="feedingQty"
            type="radio"
            value="30"
            onChange={() => setCustomQty(false)}
            required
          />

          <div className="w-full whitespace-nowrap border border-[#DDE5DF] px-2 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm  tracking-wider text-[#1F2937] hover:border-gray-400 ">
            30 ml
          </div>
        </label>

        <label className=" cursor-pointer">
          <input
            className="peer sr-only"
            name="feedingQty"
            type="radio"
            value="60"
            onChange={() => setCustomQty(false)}
          />

          <div className="w-full whitespace-nowrap border border-[#DDE5DF] px-2 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm  tracking-wider text-[#1F2937] hover:border-gray-400 ">
            60 ml
          </div>
        </label>
        <label className=" cursor-pointer">
          <input
            className="peer sr-only"
            name="feedingQty"
            type="radio"
            value="90"
            onChange={() => setCustomQty(false)}
          />

          <div className="w-full whitespace-nowrap border border-[#DDE5DF] px-2 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm  tracking-wider text-[#1F2937] hover:border-gray-400 ">
            90 ml
          </div>
        </label>
        <label className=" cursor-pointer">
          <input
            className="peer sr-only"
            name="feedingQty"
            type="radio"
            value="120"
            onChange={() => setCustomQty(false)}
          />

          <div className="w-full whitespace-nowrap border border-[#DDE5DF] px-2 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm  tracking-wider text-[#1F2937] hover:border-gray-400 ">
            120 ml
          </div>
        </label>
        <label className=" cursor-pointer">
          <input
            className="peer sr-only"
            name="feedingQty"
            type="radio"
            value="150"
            onChange={() => setCustomQty(false)}
          />

          <div className="w-full whitespace-nowrap border border-[#DDE5DF] px-2 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm  tracking-wider text-[#1F2937] hover:border-gray-400 ">
            150 ml
          </div>
        </label>
        <label className=" cursor-pointer">
          <input
            className="peer sr-only"
            name="feedingQty"
            type="radio"
            value="custom"
            onChange={() => setCustomQty(true)}
          />

          <div className="w-full whitespace-nowrap border border-[#DDE5DF] px-2 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#E7EEFF] peer-checked:text-[#4F8A69] text-sm  tracking-wider text-[#1F2937] hover:border-gray-400 ">
            Autre
          </div>
        </label>
      </div>

      {customQty && (
        <label className="block mb-4">
          <span className="text-sm font-semibold mb-1 block">
            Quantité personnalisée (en ml)
          </span>

          <input
            type="number"
            name="customFeedingQty"
            placeholder="Ex : 180"
            className="w-full border border-[#DDE5DF] rounded-xl px-4 py-3 text-sm"
          />
        </label>
      )}
      <label className="block mb-8">
        <span className="text-sm font-semibold mb-1 block">Heure du repas</span>

        <div className="w-full border border-[#DDE5DF] rounded-xl px-4 py-3 bg-white box-border">
          <input
            type="time"
            name="diaperTime"
            className="block w-full min-w-0 border-0 p-0 text-sm bg-transparent outline-none appearance-none"
          />
        </div>
      </label>
      <Button buttonText="✓ Enregistrer le repas" disabled={pending} />
    </form>
  );
};

export default AddFeedingForm;
