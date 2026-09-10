import { auth } from "@/auth";
import {
  getInvitationByToken,
  getInvitationUser,
} from "@/lib/queries/invitationQueries";
import { membershipSnapshot } from "@/lib/utils/membershipSnapshot";
import { invitationSignOutAction } from "@/lib/actions/accept-invitation";
import AcceptInvitationForm, {
  InvitationSignInForm,
} from "@/components/forms/AcceptInvitationForm";
import IntroHeader from "@/components/ui/IntroHeader";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Rejoindre une famille · Nidoo",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const [session, invitation] = await Promise.all([
    auth(),
    getInvitationByToken(token),
  ]);
  const user = session?.user?.id
    ? await getInvitationUser(session.user.id)
    : null;
  const sameEmail =
    !!user &&
    !!invitation &&
    user.email.toLowerCase() === invitation.email.toLowerCase();
  if (
    sameEmail &&
    user.memberships.some((member) => member.familyId === invitation.familyId)
  )
    redirect("/dashboard");

  let content;
  if (
    !invitation ||
    invitation.acceptedAt ||
    invitation.expiresAt <= new Date()
  ) {
    content = (
      <p role="alert" className="mb-6">
        Cette invitation est invalide, a expiré ou a déjà été utilisée. Demandez
        au parent de vous envoyer une nouvelle invitation.
      </p>
    );
  } else if (!user) {
    content = (
      <>
        <p className="text-[#6B7280] mb-6">
          Connectez-vous ou créez votre compte pour rejoindre la famille. Un
          lien de connexion sera envoyé à l’adresse destinataire de cette
          invitation.
        </p>
        <InvitationSignInForm token={token} />
      </>
    );
  } else if (!sameEmail) {
    content = (
      <>
        <p role="alert" className="mb-6">
          Vous êtes connecté avec {user.email}. Cette invitation est destinée à
          une autre adresse. Connectez-vous avec le compte invité pour
          continuer.
        </p>
        <form action={invitationSignOutAction.bind(null, token)}>
          <Button buttonText="Changer de compte" />
        </form>
      </>
    );
  } else {
    content = (
      <>
        <div className="rounded-2xl bg-[#EAF4EE] p-5 mb-6">
          <p className="text-3xl text-center mb-3">👨‍👩‍👦</p>
          <p className="text-center">
            Rejoignez {invitation.family.name} pour suivre bébé ensemble.
          </p>
        </div>
        {user.memberships.map((membership) => (
          <div
            key={membership.id}
            className="border border-amber-300 bg-amber-50 rounded-xl p-4 mb-6 text-sm"
          >
            <p className="font-semibold mb-2">
              Vous allez quitter {membership.family.name}.
            </p>
            {membership.family.members.length === 1 ? (
              <p>
                Vous en êtes le seul membre : cette famille, ses profils de bébé
                et tout leur historique seront définitivement supprimés. Ces
                données ne seront pas transférées à la nouvelle famille.
              </p>
            ) : (
              <p>
                Cette famille et les données de ses bébés seront conservées pour
                les autres membres. Vous n’y aurez plus accès. Si nécessaire, le
                rôle d’administrateur sera transmis à un membre restant. Vos
                invitations en attente pour cette famille seront annulées.
              </p>
            )}
          </div>
        ))}
        <AcceptInvitationForm
          token={token}
          snapshot={membershipSnapshot(user.memberships)}
          firstName={user.firstName ?? ""}
          lastName={user.lastName ?? ""}
          switching={user.memberships.length > 0}
        />
      </>
    );
  }
  return (
    <main className="p-6 max-w-md w-full mx-auto text-[#1F2937]">
      <IntroHeader />
      <h1 className="text-3xl font-semibold mb-4">Rejoindre une famille</h1>
      {content}
      <Link
        href={user ? "/auth/post-auth" : "/auth/login"}
        className="block text-center border border-[#DDE5DF] rounded-xl p-3 mt-2 font-semibold"
      >
        Annuler
      </Link>
    </main>
  );
}
