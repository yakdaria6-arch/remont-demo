"use client";

import { useState } from "react";

const ROOM_TYPES = [
  { label: "Обои, покраска, полы", pricePerSqm: 3500 },
  { label: "Замена труб, проводки, полов", pricePerSqm: 6500 },
  { label: "Евроремонт под ключ", pricePerSqm: 10000 },
  { label: "Дизайнерский", pricePerSqm: 16000 },
];

const PORTFOLIO = [
  {
    title: "3-комнатная квартира, Кутузовский",
    area: "89 м²",
    type: "Евроремонт",
    days: "47 дней",
    before: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
    after: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&q=80",
  },
  {
    title: "Студия, Новая Москва",
    area: "42 м²",
    type: "Под ключ",
    days: "28 дней",
    before: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  },
  {
    title: "2-комнатная, Пресня",
    area: "65 м²",
    type: "Дизайнерский",
    days: "61 день",
    before: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    after: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80",
  },
];

const REVIEWS = [
  {
    name: "Анна Петрова",
    city: "Москва, Хамовники",
    text: "Делали евроремонт в двушке. Всё строго по смете — ни рубля сверху. Закончили на 3 дня раньше срока. Особенно понравились ежедневные фото в WhatsApp — было спокойно.",
    rating: 5,
    project: "Евроремонт, 58 м²",
  },
  {
    name: "Дмитрий Козлов",
    city: "Москва, Митино",
    text: "Скептически относился к фиксированной цене — думал, найдут повод доплатить. Но нет — всё как в договоре. Бригада аккуратная, мусор убирали каждый день.",
    rating: 5,
    project: "Капитальный ремонт, 74 м²",
  },
  {
    name: "Светлана Морозова",
    city: "Москва, Бутово",
    text: "Обращалась уже второй раз — сначала делали коридор и кухню, теперь всю квартиру. Качество стабильное, мастера вежливые. Рекомендую без оговорок.",
    rating: 5,
    project: "Под ключ, 91 м²",
  },
];

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

  const area = parseFloat(length) * parseFloat(width) || 0;
  const price = area * ROOM_TYPES[typeIndex].pricePerSqm;
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
          type: ROOM_TYPES[typeIndex].label,
          priceMin, priceMax,
        }),
      });
      if (!res.ok) throw new Error("error");
      setSubmitted(true);
    } catch {
      setError("Ошибка отправки. Позвоните нам: +7 (999) 000-00-00");
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
        <div className="relative max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-4">Ремонт квартир в Москве</p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Ремонт без стресса<br/>и скрытых доплат
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
            Фиксированная цена в договоре. Сдаём в срок или платим неустойку. Работаем с 2015 года — 430 объектов.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#calculator" className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition">
              Рассчитать стоимость →
            </a>
            <a href="tel:+79990000000" className="border border-white/30 hover:border-white text-white font-semibold px-8 py-4 rounded-xl text-lg transition">
              +7 (999) 000-00-00
            </a>
          </div>
        </div>
      </section>

      {/* Цифры */}
      <section className="bg-amber-400 py-10 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-gray-900">
          {[
            { num: "430+", label: "сданных объектов" },
            { num: "10 лет", label: "на рынке" },
            { num: "2 года", label: "гарантия" },
            { num: "0 ₽", label: "скрытых доплат" },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-extrabold">{item.num}</p>
              <p className="text-sm font-medium mt-1 opacity-70">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Калькулятор */}
      <section id="calculator" className="py-20 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Калькулятор ремонта</h2>
          <p className="text-gray-500 text-center mb-8">Узнайте стоимость за 30 секунд</p>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Тип ремонта</label>
              <div className="grid grid-cols-2 gap-3">
                {ROOM_TYPES.map((t, i) => (
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
                <p className="text-xs text-gray-400 text-center">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Наши работы</h2>
          <p className="text-gray-500 text-center mb-10">Реальные объекты — фото до и после</p>

          <div className="flex gap-3 justify-center mb-8 flex-wrap">
            {PORTFOLIO.map((p, i) => (
              <button key={i} onClick={() => { setActivePortfolio(i); setShowAfter(false); }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activePortfolio === i ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {p.title}
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg">
            <div className="relative">
              <img src={showAfter ? PORTFOLIO[activePortfolio].after : PORTFOLIO[activePortfolio].before}
                alt={showAfter ? "После" : "До"} className="w-full h-72 object-cover" />
              <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-bold ${showAfter ? "bg-green-500 text-white" : "bg-gray-800 text-white"}`}>
                {showAfter ? "ПОСЛЕ" : "ДО"}
              </span>
            </div>
            <div className="bg-gray-50 p-6">
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="text-sm text-gray-500">📐 {PORTFOLIO[activePortfolio].area}</span>
                <span className="text-sm text-gray-500">🏠 {PORTFOLIO[activePortfolio].type}</span>
                <span className="text-sm text-gray-500">⏱ {PORTFOLIO[activePortfolio].days}</span>
              </div>
              <button onClick={() => setShowAfter(!showAfter)}
                className="bg-gray-900 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl transition">
                {showAfter ? "← Посмотреть ДО" : "Посмотреть ПОСЛЕ →"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">Отзывы клиентов</h2>
          <p className="text-gray-500 text-center mb-10">430 выполненных объектов — вот что говорят люди</p>

          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Как мы работаем</h2>
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Частые вопросы</h2>
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
      <section className="py-20 px-4 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">Готовы начать?</h2>
        <p className="text-gray-400 mb-8 text-lg">Бесплатный замер в удобное время. Без обязательств.</p>
        <a href="#calculator" className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-10 py-4 rounded-xl text-lg transition">
          Рассчитать стоимость →
        </a>
      </section>

      <footer className="bg-gray-950 text-gray-500 text-sm text-center py-6 px-4">
        © 2025 РемонтМастер. Москва и МО. Все права защищены.
      </footer>
    </main>
  );
}
