"use client";
import { signUpAction, type SignUpState } from "@/lib/actions/auth/sign-up";
import Link from "next/link";
import { useActionState } from "react";
import Button from "../ui/Button";

const initialState: SignUpState = {
  errors: {},
};

const SignUpForm = () => {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialState,
  );
  return (
    <form action={formAction}>
      {state?.errors.general && (
        <p className="text-red-500 font-semibold text-xs -mt-4 mb-4">
          {state.errors.general[0]}
        </p>
      )}
      <label className="flex flex-col text-sm font-semibold mb-4">
        Prénom
        <input
          className={`border ${state?.errors.firstName ? "border-red-500" : "border-[#DDE5DF]"}  px-2 p-3 mt-1 rounded-xl text-[#6B7280] font-medium tracking-wider`}
          name="firstName"
          type="text"
          defaultValue={state.values?.firstName}
          placeholder="John"
        />
        {state?.errors.firstName && (
          <p className="text-red-500 font-medium text-xs ">
            {state.errors.firstName[0]}
          </p>
        )}
      </label>
      <label className="flex flex-col text-sm font-semibold mb-4">
        Nom
        <input
          className={`border ${state?.errors.lastName ? "border-red-500" : "border-[#DDE5DF]"} px-2 p-3 mt-1 rounded-xl font-medium tracking-wider`}
          name="lastName"
          type="text"
          defaultValue={state.values?.lastName}
          placeholder="Snow"
        />
        {state?.errors.lastName && (
          <p className="text-red-500 font-medium text-xs ">
            {state.errors.lastName[0]}
          </p>
        )}
      </label>
      <label className="flex flex-col text-sm font-semibold mb-4">
        Adresse e-mail
        <input
          className={`border ${state?.errors.email ? "border-red-500" : "border-[#DDE5DF]"} px-2 p-3 mt-1 rounded-xl font-medium tracking-wider`}
          name="email"
          type="email"
          defaultValue={state.values?.email}
          placeholder="parent@email.com"
          required
        />
        {state?.errors.email && (
          <p className="text-red-500 font-medium text-xs ">
            {state.errors.email[0]}
          </p>
        )}
      </label>
      <label className="flex flex-col text-sm font-semibold mb-4">
        Mot de passe
        <input
          className={`border ${state?.errors.password ? "border-red-500" : "border-[#DDE5DF]"} px-2 p-3 mt-1 rounded-xl font-semibold tracking-widest`}
          name="password"
          type="password"
          placeholder="********"
          required
        />
        {state?.errors.password && (
          <p className="text-red-500 font-medium text-xs ">
            {state.errors.password[0]}
          </p>
        )}
      </label>
      <label className="flex flex-col text-sm font-semibold mb-8">
        Confirmer mot de passe
        <input
          className={`border ${state?.errors.confirmPassword ? "border-red-500" : "border-[#DDE5DF]"} px-2 p-3 mt-1 rounded-xl font-semibold tracking-widest`}
          name="confirmPassword"
          type="password"
          placeholder="********"
          required
        />
        {state?.errors.confirmPassword && (
          <p className="text-red-500 font-medium text-xs ">
            {state.errors.confirmPassword[0]}
          </p>
        )}
      </label>

      <Button buttonText="Créer mon compte" />
      <div className="w-full flex justify-center mb-8">
        <Link
          href="/login"
          className=" font-semibold text-sm text-[#4F8A69] hover:underline cursor-pointer"
        >
          Déjà inscrit ? Se connecter
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
