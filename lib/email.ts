import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInviteEmail(email: string, role: string): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const loginUrl = `${appUrl}/auth/login`;

  const roleLabel = {
    'super_admin': 'Super Administrador',
    'admin': 'Administrador',
    'operador': 'Operador'
  }[role] || role;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Bem-vindo ao ConVEL!</h2>
      <p>Você foi convidado para participar do sistema de gestão de livros do ConVEL.</p>
      <p><strong>Seu papel:</strong> ${roleLabel}</p>
      <p>Para aceitar o convite e acessar o sistema, clique no botão abaixo:</p>
      <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
        Acessar ConVEL
      </a>
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Se não conseguir clicar no botão, copie e cole o seguinte link no seu navegador:<br>
        <a href="${loginUrl}">${loginUrl}</a>
      </p>
      <p style="color: #999; font-size: 11px; margin-top: 20px;">
        Este é um convite para acessar o sistema ConVEL. Se você recebeu este e-mail por engano, ignore-o.
      </p>
    </div>
  `;

  await resend.emails.send({
    from: 'ConVEL <noreply@convel.com.br>',
    to: email,
    subject: 'Convite para acessar ConVEL',
    html: htmlContent,
  });
}
