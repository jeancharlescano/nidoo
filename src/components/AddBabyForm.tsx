"use client";
// import { useActionState } from "react";

const AddBabyForm = () => {
  // const { state, formAction, pending } = useActionState();
  return (
    <form>
      <label className="flex flex-col text-sm font-semibold mb-4">
        Prénom du bébé
        <input
          className={`border border-[#DDE5DF]  px-2 p-3 mt-1 rounded-xl text-[#6B7280] font-medium tracking-wider`}
          name="name"
          type="text"
          placeholder="Léo"
        />
      </label>
    </form>
  );
};

export default AddBabyForm;
