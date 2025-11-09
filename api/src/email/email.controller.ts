import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('dev/email')
export class EmailController {
  constructor(private readonly email: EmailService) {}

  @Post('send')
  async send(@Body() body: { to: string; subject?: string; html?: string }) {
    const subject = body.subject ?? 'Legmint test email';
    const html = body.html ?? '<p>This is a test email from Legmint.</p>';
    return this.email.sendEmail({ to: body.to, subject, html });
  }
}
