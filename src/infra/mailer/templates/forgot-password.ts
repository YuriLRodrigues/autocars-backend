type ForgotPasswordProps = {
  url: string;
  name: string;
};

export const forgotPasswordTemplate = ({ url, name }: ForgotPasswordProps) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperar Senha</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f8f8f8;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #ff6f00;
      color: #fff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      text-align: center;
      color: #333;
    }
    .content img {
      width: 100px;
      margin-bottom: 20px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
    }
    .content .cta-button {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #ff6f00;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    }
    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px 20px;
    }
    .footer p {
      margin: 5px 0;
      font-size: 14px;
      color: #555;
    }
    .social-links {
      margin: 10px 0;
    }
    .social-links a {
      margin: 0 10px;
      text-decoration: none;
      font-size: 16px;
      color: #ff6f00;
    }

  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>AutoCars</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>"${name}"</strong>,</p>
      <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para prosseguir:</p>
      <a href="${url}" class="cta-button">Redefinir Senha</a>
      <p>Se você não solicitou a redefinição de senha, ignore este e-mail. Sua senha permanecerá segura.</p>
    </div>
    <div class="footer">
      <div class="social-links">
        <a href="https://facebook.com">Facebook</a> | 
        <a href="https://instagram.com">Instagram</a> | 
        <a href="https://twitter.com">Twitter</a>
      </div>
      <p>AutoCars &copy; 2024. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
`;
};
