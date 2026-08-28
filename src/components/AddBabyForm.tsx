"use client";

import {
  createBabyAction,
  CreateBabyState,
} from "@/lib/actions/baby/create-baby";
import Button from "./ui/Button";
import { useActionState } from "react";

const initialState: CreateBabyState = {
  errors: [],
};
const AddBabyForm = ({ source }: { source?: string }) => {
  console.log("🚀 ~ AddBabyForm ~ source:", source);
  const [state, formAction, pending] = useActionState(
    createBabyAction,
    initialState,
  );
  return (
    <form action={formAction}>
      {state?.errors && (
        <p className="text-red-500 font-semibold text-xs -mt-4 mb-4">
          {state.errors[0]}
        </p>
      )}
      <input
        type="hidden"
        name="source"
        value={source ? "onboarding" : "settings"}
      />
      <label className="flex flex-col text-sm font-semibold mb-4">
        Prénom du bébé
        <input
          className={`border border-[#DDE5DF]  px-2 p-3 mt-1 rounded-xl text-[#1F2937] font-medium tracking-wider`}
          name="name"
          type="text"
          placeholder="Léo"
        />
      </label>
      <label className="flex flex-col text-sm font-semibold mb-4">
        Date de naissance
        <input
          className={`border border-[#DDE5DF]  px-2 p-3 mt-1 rounded-xl text-[#1F2937] font-medium tracking-wider`}
          name="dateOfBirth"
          type="date"
        />
      </label>

      <p className="text-sm font-semibold mb-1">Sexe</p>
      <div className="flex w-full gap-3 mb-4">
        <label className="flex-1 cursor-pointer">
          <input className="peer sr-only" name="sexe" type="radio" value="F" />

          <div className="border border-[#DDE5DF] px-4 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#4F8A69] peer-checked:text-white text-sm font-semibold tracking-wider text-[#1F2937] hover:border-gray-400 ">
            Fille
          </div>
        </label>

        <label className="flex-1 cursor-pointer">
          <input className="peer sr-only" name="sexe" type="radio" value="H" />

          <div className="border border-[#DDE5DF] px-4 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#4F8A69] peer-checked:text-white text-sm font-semibold tracking-wider text-[#1F2937] hover:border-gray-400 ">
            Garçon
          </div>
        </label>

        <label className="flex-1 cursor-pointer">
          <input className="peer sr-only" name="sexe" type="radio" value="O" />

          <div className="border border-[#DDE5DF] px-4 py-3 rounded-xl text-center  transition peer-checked:border-[#4F8A69] peer-checked:bg-[#4F8A69] peer-checked:text-white text-sm font-semibold tracking-wider text-[#1F2937] hover:border-gray-400 ">
            Autre
          </div>
        </label>
      </div>

      <label className="flex flex-col text-sm font-semibold mb-4">
        Poids (en Kg)
        <input
          className={`border border-[#DDE5DF]  px-2 p-3 mt-1 rounded-xl text-[#1F2937] font-medium tracking-wider`}
          name="weight"
          type="number"
          step="0.1"
          min="1"
          placeholder="3.5"
        />
      </label>
      <Button buttonText="Créer le profil de bébé" disabled={pending} />
    </form>
  );
};

export default AddBabyForm;
