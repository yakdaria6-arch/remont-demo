import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, area, length, width, height, type, priceMin, priceMax } = body;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
  }

  const text =
    `🔨 Новая заявка с сайта!\n\n` +
    `👤 Имя: ${name}\n` +
    `📞 Телефон: ${phone}\n` +
    `📐 Размеры: ${length} × ${width} × ${height} м (${area} м²)\n` +
    `🏠 Тип ремонта: ${type}\n` +
    `💰 Стоимость: ${priceMin.toLocaleString("ru-RU")} – ${priceMax.toLocaleString("ru-RU")} ₽`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Telegram send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
