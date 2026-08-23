import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Nidoo <onboarding@resend.dev>",
    to: email,
    subject: "Nidoo => Vérifiez votre adresse e-mail",
    html: `
      <h1>Bienvenue sur Nidoo !</h1>
      <p>Cliquez sur le bouton ci-dessous pour vérifier votre adresse e-mail.</p>
      <a href="${url}">Vérifier mon e-mail</a>
    `,
  });
}
