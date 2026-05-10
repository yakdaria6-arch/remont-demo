"use client";

import { useState, useEffect } from "react";

type RoomType = { label: string; pricePerSqm: number };
type Stat = { num: string; label: string };
type Review = { name: string; city: string; text: string; rating: number; project: string };
type PortfolioItem = { title: string; area: string; type: string; days: string; before: string; after: string };
type SiteData = {
  company: { name: string; phone: string; city: string };
  stats: Stat[];
  roomTypes: RoomType[];
  portfolio: PortfolioItem[];
  reviews: Review[];
};

const FAQ = [
  {
    q: "Почему цена фиксированная? Это реально?",
    a: "Да. Мы делаем детальный замер и прописываем все работы в смете до копейки. Если что-то упустили при замере — это наша ошибка, клиент не доплачивает.",
  },
  {
    q: "Что если вы не уложитесь в срок?",
    a: "В договоре прописана неустойка — 0,5% от суммы за каждый день просрочки. Это дисциплинирует лучше любых обещаний.",
  },
  {
    q: "Можно ли купить материалы самому?",
    a: "Да. Вы можете купить материалы сами — тогда мы работаем только за услуги. Или доверить закупку нам — у нас есть скидки у поставщиков до 15%.",
  },
  {
    q: "Как проходит оплата?",
    a: "Поэтапно: 30% аванс, 40% после черновых работ, 30% при сдаче объекта. Никаких полных предоплат.",
  },
  {
    q: "Какая гарантия на работы?",
    a: "2 года на все виды работ. Если что-то отвалится — приедем и переделаем бесплатно.",
  },
];

export default function Home() {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [typeIndex, setTypeIndex] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePortfolio, setActivePortfolio] = useState(0);
  const [showAfter, setShowAfter] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/site-data")
      .then(r => r.json())
      .then(setSiteData);
  }, []);

  if (!siteData) return null;

  const { company, stats, roomTypes, portfolio, reviews } = siteData;
  const area = parseFloat(length) * parseFloat(width) || 0;
  const price = area * roomTypes[typeIndex].pricePerSqm;
  const priceMin = Math.round(price * 0.9 / 1000) * 1000;
  const priceMax = Math.round(price * 1.2 / 1000) * 1000;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, phone,
          area: area.toFixed(1),
          length, width, height,
          type: roomTypes[typeIndex].label,
          priceMin, priceMax,
        }),
      });
      if (!res.ok) throw new Error("error");
      setSubmitted(true);
    } catch {
      setError(`Ошибка отправки. Позвоните нам: ${company.phone}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white font-sans">

      {/* Hero */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1400&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="relative max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-amber-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-3 md:mb-4">
            Ремонт квартир в {company.city}
          </p>
          <h1 className="text-3xl md:text-6xl font-extrabold leading-tight mb-4 md:mb-6">
            Ремонт без стресса<br/>и скрытых доплат
          </h1>
          <p className="text-base md:text-lg text-gray-300 mb-8 md:mb-10 max-w-xl mx-auto">
            Фиксированная цена в договоре. Сдаём в срок или платим неустойку. Работаем с 2015 года — {stats[0]?.num} объектов.
          </p>
          <div className="flex flex-col gap-3 justify-center max-w-xs mx-auto md:max-w-none md:flex-row">
            <a href="#calculator" className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-4 rounded-xl text-base md:text-lg transition text-center">
              Рассчитать стоимость →
            </a>
            <a href={`tel:${company.phone.replace(/\D/g, "")}`} className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-xl text-base md:text-lg transition text-center">
              {company.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Цифры */}
      <section className="bg-amber-400 py-10 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-gray-900">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-extrabold">{item.num}</p>
              <p className="text-sm font-medium mt-1 opacity-70">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Калькулятор */}
      <section id="calculator" className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-2">Калькулятор ремонта</h2>
          <p className="text-gray-500 text-center mb-6 md:mb-8">Узнайте стоимость за 30 секунд</p>

          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Тип ремонта</label>
              <div className="grid grid-cols-2 gap-3">
                {roomTypes.map((t, i) => (
                  <button key={t.label} onClick={() => setTypeIndex(i)}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition text-left ${
                      typeIndex === i ? "border-amber-400 bg-amber-50 text-gray-900" : "border-gray-200 text-gray-600 hover:border-amber-300"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Размеры комнаты (в метрах)</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Длина", value: length, set: setLength },
                  { label: "Ширина", value: width, set: setWidth },
                  { label: "Высота", value: height, set: setHeight },
                ].map((field) => (
                  <div key={field.label}>
                    <p className="text-xs text-gray-400 mb-1 text-center">{field.label}</p>
                    <input type="number" min={1} max={50} step={0.1} placeholder="0"
                      value={field.value} onChange={(e) => field.set(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-3 text-center text-lg font-bold focus:outline-none focus:border-amber-400" />
                    <p className="text-xs text-gray-400 mt-1 text-center">м</p>
                  </div>
                ))}
              </div>
              {area > 0 && <p className="text-xs text-gray-400 mt-2 text-center">Площадь: {area.toFixed(1)} м²</p>}
            </div>

            <div className={`rounded-xl p-5 text-center transition ${area > 0 ? "bg-amber-50 border border-amber-200" : "bg-gray-100"}`}>
              <p className="text-sm font-medium mb-1 text-gray-500">Ориентировочная стоимость</p>
              {area > 0 ? (
                <>
                  <p className="text-3xl font-extrabold text-gray-900">
                    {priceMin.toLocaleString("ru-RU")} – {priceMax.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Точная цена — после бесплатного замера</p>
                </>
              ) : (
                <p className="text-gray-400">Введите размеры комнаты выше</p>
              )}
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">Оставьте заявку — перезвоним за 15 минут</p>
                <input type="text" placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400" />
                <input type="tel" placeholder="+7 (___) ___-__-__" value={phone} onChange={(e) => setPhone(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400" />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" disabled={loading}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold py-4 rounded-xl text-base transition disabled:opacity-60">
                  {loading ? "Отправляем..." : "Получить точный расчёт бесплатно"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Нажимая кнопку, вы соглашаетесь с{" "}
                  <a href="/privacy" target="_blank" className="underline hover:text-gray-600 transition">обработкой персональных данных</a>
                </p>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Заявка принята!</h3>
                <p className="text-gray-500">Перезвоним в течение 15 минут</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Портфолио */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-2">Наши работы</h2>
          <p className="text-gray-500 text-center mb-8 md:mb-10">Реальные объекты — фото до и после</p>

          <div className="flex gap-2 justify-center mb-6 md:mb-8 flex-wrap">
            {portfolio.map((p, i) => (
              <button key={i} onClick={() => { setActivePortfolio(i); setShowAfter(false); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activePortfolio === i ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {p.title}
              </button>
            ))}
          </div>

          {portfolio[activePortfolio] && (
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <div className="relative">
                <img src={showAfter ? portfolio[activePortfolio].after : portfolio[activePortfolio].before}
                  alt={showAfter ? "После" : "До"} className="w-full h-72 object-cover" />
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold ${showAfter ? "bg-green-500 text-white" : "bg-gray-800 text-white"}`}>
                  {showAfter ? "ПОСЛЕ" : "ДО"}
                </span>
              </div>
              <div className="bg-gray-50 p-6">
                <div className="flex flex-wrap gap-4 mb-4">
                  <span className="text-sm text-gray-500">📐 {portfolio[activePortfolio].area}</span>
                  <span className="text-sm text-gray-500">🏠 {portfolio[activePortfolio].type}</span>
                  <span className="text-sm text-gray-500">⏱ {portfolio[activePortfolio].days}</span>
                </div>
                <button onClick={() => setShowAfter(!showAfter)}
                  className="bg-gray-900 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition">
                  {showAfter ? "← Посмотреть ДО" : "Посмотреть ПОСЛЕ →"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-2">Отзывы клиентов</h2>
          <p className="text-gray-500 text-center mb-8 md:mb-10">{stats[0]?.num} выполненных объектов — вот что говорят люди</p>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {reviews.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <span key={j} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="font-bold text-gray-800 text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{r.city}</p>
                  <p className="text-amber-600 text-xs mt-1">{r.project}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Этапы */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-8 md:mb-10">Как мы работаем</h2>
          <div className="space-y-6">
            {[
              { step: "01", title: "Бесплатный замер", desc: "Выезжаем в удобное время, замеряем и составляем детальную смету — без скрытых позиций" },
              { step: "02", title: "Договор с фиксированной ценой", desc: "Прописываем цену, сроки и штрафы за просрочку. Платите поэтапно — 30/40/30%" },
              { step: "03", title: "Ремонт с фотоотчётами", desc: "Работаем по технологии, убираем мусор ежедневно. Фото в WhatsApp каждый день" },
              { step: "04", title: "Сдача и гарантия", desc: "Принимаете работу по акту. Гарантия 2 года — если что-то не так, приедем и исправим" },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <span className="text-4xl font-extrabold text-amber-300 w-14 shrink-0 leading-none">{item.step}</span>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center mb-8 md:mb-10">Частые вопросы</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center gap-4">
                  <span className="font-semibold text-gray-800">{item.q}</span>
                  <span className="text-gray-400 text-xl shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="py-12 md:py-20 px-4 bg-gray-900 text-white text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Готовы начать?</h2>
        <p className="text-gray-400 mb-8 text-base md:text-lg">Бесплатный замер в удобное время. Без обязательств.</p>
        <a href="#calculator" className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-10 py-4 rounded-xl text-lg transition">
          Рассчитать стоимость →
        </a>
      </section>

      <footer className="bg-gray-950 text-gray-400 text-sm py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
            <div>
              <p className="text-white font-bold text-base mb-1">{company.name}</p>
              <p className="text-gray-500 text-xs">{company.city} и Московская область</p>
              <a href={`tel:${company.phone.replace(/\D/g, "")}`} className="text-amber-400 hover:text-amber-300 text-sm mt-2 inline-block transition">
                {company.phone}
              </a>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <p className="text-gray-500 uppercase tracking-widest font-semibold mb-1">Документы</p>
              <a href="/privacy" target="_blank" className="hover:text-white transition">Политика конфиденциальности</a>
              <a href="/oferta" target="_blank" className="hover:text-white transition">Публичная оферта</a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} {company.name}. Все права защищены.</p>
            <p>Сайт не является публичной офертой. Окончательная стоимость определяется после замера.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
