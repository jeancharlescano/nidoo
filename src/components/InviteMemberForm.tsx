"use client";

import {
  inviteMemberAction,
  InviteMemberState,
} from "@/lib/actions/mail/mail-action";
import Button from "./ui/Button";
import { useActionState } from "react";
import Link from "next/link";

const initialState: InviteMemberState = {};

const InviteMemberForm = () => {
  const [state, formAction, pending] = useActionState(
    inviteMemberAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <label className="flex flex-col text-sm font-semibold mb-4">
        Adresse e-mail
        <input
          className="border border-[#DDE5DF] px-2 p-3 rounded-xl text-[#1F2937] font-medium tracking-wider"
          name="email"
          type="email"
          placeholder="parent2@email.com"
          required
        />
      </label>
      {state.errors && (
        <p className="text-red-500 font-semibold text-xs mb-4 -mt-4">
          {state.errors[0]}
        </p>
      )}
      <Button buttonText="Envoyer l'invitation" />
      {!state.success && (
        <>
          <Link
            href="/onboarding/summary"
            className="block text-center mt-2 border border-[#DDE5DF] py-3 w-full rounded-xl text-md font-semibold mb-2 cursor-pointer"
          >
            Etape suivante
          </Link>
          <div className="flex flex-col mt-8 ">
            <p className="font-semibold text-sm text-[#1F2937]">
              ✓ E-mail envoyé
            </p>
            <p className="font-semibold text-xs text-[#6B7280]">
              Pensez à vérifier vos courriers indésirables si vous ne le voyez
              pas.
            </p>
          </div>
        </>
      )}
    </form>
  );
};

export default InviteMemberForm;
