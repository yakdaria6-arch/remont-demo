"use client";

import { useState } from "react";

const ROOM_TYPES = [
  { label: "Косметический", pricePerSqm: 3500 },
  { label: "Капитальный", pricePerSqm: 6500 },
  { label: "Под ключ (евро)", pricePerSqm: 10000 },
  { label: "Дизайнерский", pricePerSqm: 16000 },
];

export default function Home() {
  const [area, setArea] = useState(50);
  const [typeIndex, setTypeIndex] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
          name,
          phone,
          area,
          type: ROOM_TYPES[typeIndex].label,
          priceMin,
          priceMax,
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
    <main className="min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <section className="bg-orange-500 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-orange-100 text-sm font-semibold uppercase tracking-widest mb-3">Ремонт квартир в Москве</p>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
            Ремонт без стресса<br/>и скрытых доплат
          </h1>
          <p className="text-lg text-orange-100 mb-8">
            Фиксированная цена в договоре. Сдаём в срок или платим неустойку.
            Работаем с 2015 года — 430 сданных объектов.
          </p>
          <a href="#calculator" className="bg-white text-orange-600 font-bold px-8 py-4 rounded-xl text-lg shadow-lg hover:bg-orange-50 transition">
            Рассчитать стоимость →
          </a>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "📋", title: "Договор", desc: "Фиксированная цена" },
            { icon: "🏗️", title: "Опыт", desc: "430 объектов" },
            { icon: "⏱️", title: "Срок", desc: "Пеня за просрочку" },
            { icon: "🔧", title: "Гарантия", desc: "2 года на работы" },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2">
              <span className="text-4xl">{item.icon}</span>
              <span className="font-bold text-gray-800">{item.title}</span>
              <span className="text-sm text-gray-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Калькулятор */}
      <section id="calculator" className="py-16 px-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
            Калькулятор ремонта
          </h2>
          <p className="text-gray-500 text-center mb-8">Узнайте стоимость за 30 секунд</p>

          <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
            {/* Тип ремонта */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Тип ремонта</label>
              <div className="grid grid-cols-2 gap-3">
                {ROOM_TYPES.map((t, i) => (
                  <button
                    key={t.label}
                    onClick={() => setTypeIndex(i)}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition ${
                      typeIndex === i
                        ? "border-orange-500 bg-orange-50 text-orange-700"
                        : "border-gray-200 text-gray-600 hover:border-orange-300"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Площадь */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Площадь квартиры: <span className="text-orange-500">{area} м²</span>
              </label>
              <input
                type="range"
                min={20}
                max={200}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>20 м²</span>
                <span>200 м²</span>
              </div>
            </div>

            {/* Результат */}
            <div className="bg-orange-50 rounded-xl p-5 text-center">
              <p className="text-sm text-orange-700 font-medium mb-1">Ориентировочная стоимость</p>
              <p className="text-3xl font-extrabold text-orange-600">
                {priceMin.toLocaleString("ru-RU")} – {priceMax.toLocaleString("ru-RU")} ₽
              </p>
              <p className="text-xs text-orange-400 mt-1">Точная цена — после замера мастера (бесплатно)</p>
            </div>

            {/* Форма */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-sm font-semibold text-gray-700">Оставьте заявку — перезвоним за 15 минут</p>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                />
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-base transition disabled:opacity-60"
                >
                  {loading ? "Отправляем..." : "Получить точный расчёт бесплатно"}
                </button>
                <p className="text-xs text-gray-400 text-center">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Заявка принята!</h3>
                <p className="text-gray-500">Наш менеджер позвонит вам в течение 15 минут</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Этапы работы */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Как мы работаем</h2>
          <div className="space-y-6">
            {[
              { step: "01", title: "Замер и смета", desc: "Бесплатный выезд мастера — составляем детальную смету без скрытых позиций" },
              { step: "02", title: "Договор", desc: "Фиксируем цену, сроки и штрафы за просрочку. Платите поэтапно" },
              { step: "03", title: "Ремонт", desc: "Работаем по технологии. Ежедневные фотоотчёты в WhatsApp" },
              { step: "04", title: "Сдача объекта", desc: "Принимаете работу, подписываете акт. Гарантия 2 года" },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start">
                <span className="text-3xl font-extrabold text-orange-200 w-12 shrink-0">{item.step}</span>
                <div>
                  <h3 className="font-bold text-gray-800">{item.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Финальный CTA */}
      <section className="py-16 px-4 bg-orange-500 text-white text-center">
        <h2 className="text-3xl font-extrabold mb-4">Готовы начать?</h2>
        <p className="text-orange-100 mb-8 text-lg">Бесплатный замер в удобное время. Без обязательств.</p>
        <a href="#calculator" className="bg-white text-orange-600 font-bold px-10 py-4 rounded-xl text-lg shadow-lg hover:bg-orange-50 transition">
          Рассчитать стоимость
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-sm text-center py-6 px-4">
        © 2025 РемонтМастер. Москва и МО. Все права защищены.
      </footer>
    </main>
  );
}
