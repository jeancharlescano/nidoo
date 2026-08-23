"use client";

import { useActionState } from "react";
import Button from "../ui/Button";
import {
  forgotPasswordAction,
  type ForgotPasswordState,
} from "@/lib/actions/auth/forgot-password";

const initialState: ForgotPasswordState = {
  errors: {},
};

const ForgotPasswordForm = () => {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    initialState,
  );

  return (
    <>
      <form action={formAction}>
        {state?.errors.general && (
          <p className="text-red-500 font-semibold text-xs -mt-4 mb-4">
            {state.errors.general[0]}
          </p>
        )}
        <label className="flex flex-col text-sm font-semibold mb-8">
          Adresse e-mail
          <input
            className={`border ${state?.errors.email ? "border-red-500" : "border-[#DDE5DF]"} px-2 p-3 mt-1 rounded-xl text-[#6B7280] font-medium tracking-wider`}
            name="email"
            type="email"
            defaultValue={state.values?.email}
            placeholder="parent@gmail.com"
          />
          {state?.errors.email && (
            <p className="text-red-500 font-medium text-xs">
              {state.errors.email[0]}
            </p>
          )}
        </label>
        <Button buttonText="Envoyer le lien" disabled={pending} />
      </form>

      {state?.success && (
        <div className="bg-[#EDF5FF] w-full p-4 rounded-xl mt-8">
          <p className="text-sm font-bold mb-2">✓ E-mail envoyé</p>
          <p className="text-sm font-medium text-[#6B7280]">
            Pensez à vérifier vos courriers indésirables si vous ne le voyez
            pas.
          </p>
        </div>
      )}
    </>
  );
};

export default ForgotPasswordForm;
