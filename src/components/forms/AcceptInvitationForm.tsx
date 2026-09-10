"use client";

import { useActionState } from "react";
import { acceptInvitationAction, invitationSignInAction, type InvitationState } from "@/lib/actions/accept-invitation";
import Button from "@/components/ui/Button";

const initialState: InvitationState = {};

export function InvitationSignInForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState(invitationSignInAction.bind(null, token), initialState);
  return <form action={action}>
    {state.error && <p role="alert" className="text-red-600 text-sm mb-4">{state.error}</p>}
    <Button disabled={pending} buttonText={pending ? "Envoi en cours…" : "Recevoir mon lien de connexion"} />
  </form>;
}

export default function AcceptInvitationForm({ token, snapshot, firstName, lastName, switching }: {
  token: string; snapshot: string; firstName: string; lastName: string; switching: boolean;
}) {
  const [state, action, pending] = useActionState(acceptInvitationAction.bind(null, token, snapshot), initialState);
  return <form action={action}>
    {state.error && <p role="alert" className="text-red-600 text-sm mb-4">{state.error}</p>}
    <label className="flex flex-col text-sm font-semibold mb-4">
      Prénom
      <input name="firstName" autoComplete="given-name" defaultValue={firstName} required minLength={2} maxLength={50}
        className="border border-[#DDE5DF] p-3 mt-1 rounded-xl font-medium" />
    </label>
    <label className="flex flex-col text-sm font-semibold mb-6">
      Nom
      <input name="lastName" autoComplete="family-name" defaultValue={lastName} required minLength={2} maxLength={50}
        className="border border-[#DDE5DF] p-3 mt-1 rounded-xl font-medium" />
    </label>
    {switching && <label className="flex items-start gap-3 text-sm mb-6">
      <input type="checkbox" name="confirmSwitch" required className="mt-1" />
      J’ai compris les conséquences indiquées ci-dessus et je confirme le changement de famille.
    </label>}
    <Button disabled={pending} buttonText={pending ? "Rattachement en cours…" : switching ? "Confirmer et rejoindre la famille" : "Rejoindre la famille"} />
  </form>;
}
