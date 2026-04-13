// Email sending is stubbed for now.
// When ready, integrate Nodemailer here with SMTP_* env vars.
export async function sendTemporaryPasswordEmail(
  to: string,
  name: string,
  tempPassword: string
): Promise<void> {
  console.log(
    `[ConVEL Mailer - STUB] Para: ${to} | Nome: ${name} | Senha temporária: ${tempPassword}`
  );
}
