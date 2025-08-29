import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import nodemailer from "nodemailer";

const formSchema = z.object({
  nome: z.string().min(2),
  cidade: z.string().min(2),
  telefone: z.string().min(10),
  iniciaEm: z.string().min(1),
  contrato: z.string().min(1),
  cargoDe: z.string().min(1),
  turno: z.string().min(1),
  valorVT: z.string().min(1),
  chavePix: z.string().min(1),
  banco: z.string().min(1),
  supervisorResponsavel: z.string().min(2),
  website: z.string().optional(),
});

// Simple in-memory rate limit per IP: 5 req per 15 minutes
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 5;
const ipHits = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const record = ipHits.get(ip);
  if (!record) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (now - record.windowStart > RATE_WINDOW_MS) {
    ipHits.set(ip, { count: 1, windowStart: now });
    return false;
  }
  record.count += 1;
  ipHits.set(ip, record);
  return record.count > RATE_MAX;
}

function sanitize(input?: string) {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "");
}

function renderHtml(data: z.infer<typeof formSchema>) {
  const rows: [string, string][] = [
    ["NOME", sanitize(data.nome)],
    ["CIDADE", sanitize(data.cidade)],
    ["TELEFONE", sanitize(data.telefone)],
    ["ÍNICIA EM", sanitize(data.iniciaEm)],
    ["CONTRATO", sanitize(data.contrato)],
    ["CARGO DE", sanitize(data.cargoDe)],
    ["TURNO", sanitize(data.turno)],
    ["VALOR VT", sanitize(data.valorVT)],
    ["CHAVE PIX", sanitize(data.chavePix)],
    ["BANCO", sanitize(data.banco)],
    ["SUPERVISOR RESPONSÁVEL", sanitize(data.supervisorResponsavel)],
  ];
  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, Arial;">
    <h2 style="margin:0 0 12px;">Cadastro de Candidato</h2>
    <table cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      ${rows
        .map(
          ([k, v]) => `
        <tr>
          <td style="border:1px solid #e5e5e5; background:#fafafa; width: 40%; font-weight:600;">${k}</td>
          <td style="border:1px solid #e5e5e5;">${v || "-"}</td>
        </tr>`
        )
        .join("")}
    </table>
  </div>`;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return new NextResponse(
      "Limite de envios atingido. Tente novamente mais tarde.",
      { status: 429 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = formSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.website && data.website.trim().length > 0) {
    // honeypot triggered: pretend success
    return NextResponse.json({ ok: true });
  }

  const subject = `Cadastro — ${data.nome} — ${data.cargoDe}`;
  const html = renderHtml(data);

  const to = process.env.FORM_TO_EMAIL || "contato@klfacilities.com.br";
  const from =
    process.env.FORM_FROM_EMAIL || "nao-responder@klfacilities.com.br";

  const resendKey = process.env.RESEND_API_KEY;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  try {
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({ to, from, subject, html });
    } else if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({ to, from, subject, html });
    } else {
      return new NextResponse("Provedor de e-mail não configurado", {
        status: 500,
      });
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erro ao enviar e-mail";
    return new NextResponse(message, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
