"use client";

import { useState, useEffect, useRef, useCallback } from "react";

function PhotoUpload({ value, onChange, label, password }: {
  value: string;
  onChange: (url: string) => void;
  label: string;
  password: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-password": password }, body: fd });
    const data = await res.json();
    if (data.url) onChange(data.url);
    setUploading(false);
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [password]);

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
          dragging ? "border-amber-400 bg-amber-50" : "border-gray-200 hover:border-amber-300"
        }`}
      >
        {uploading ? (
          <p className="text-sm text-gray-400">Загружаем...</p>
        ) : value ? (
          <img src={value} alt={label} className="h-28 w-full object-cover rounded-lg" onError={e => (e.currentTarget.style.display = "none")} />
        ) : (
          <p className="text-sm text-gray-400">Перетащите фото сюда или кликните</p>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
      </div>
      <input
        type="url"
        placeholder="или вставьте ссылку https://..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
      />
    </div>
  );
}

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

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState<SiteData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"company" | "stats" | "prices" | "portfolio" | "reviews">("company");
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  async function login() {
    const res = await fetch("/api/site-data", { headers: { "x-admin-password": password } });
    if (res.status === 401) { setAuthError("Неверный пароль"); return; }
    setData(await res.json());
    setAuthed(true);
  }

  function refreshPreview() {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    setSaveMsg("");
    const res = await fetch("/api/site-data", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-password": password },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaveMsg(res.ok ? "✅ Сохранено! Изменения появятся на сайте." : "❌ Ошибка сохранения");
    setTimeout(() => setSaveMsg(""), 4000);
  }

  function updateCompany(field: string, value: string) {
    setData(d => d ? { ...d, company: { ...d.company, [field]: value } } : d);
  }

  function updateStat(i: number, field: string, value: string) {
    setData(d => {
      if (!d) return d;
      const stats = [...d.stats];
      stats[i] = { ...stats[i], [field]: value };
      return { ...d, stats };
    });
  }

  function updateRoomType(i: number, field: string, value: string | number) {
    setData(d => {
      if (!d) return d;
      const roomTypes = [...d.roomTypes];
      roomTypes[i] = { ...roomTypes[i], [field]: value };
      return { ...d, roomTypes };
    });
  }

  function updateReview(i: number, field: string, value: string | number) {
    setData(d => {
      if (!d) return d;
      const reviews = [...d.reviews];
      reviews[i] = { ...reviews[i], [field]: value };
      return { ...d, reviews };
    });
  }

  function updatePortfolio(i: number, field: string, value: string) {
    setData(d => {
      if (!d) return d;
      const portfolio = [...d.portfolio];
      portfolio[i] = { ...portfolio[i], [field]: value };
      return { ...d, portfolio };
    });
  }

  function addPortfolio() {
    setData(d => d ? { ...d, portfolio: [...d.portfolio, { title: "", area: "", type: "", days: "", before: "", after: "" }] } : d);
  }

  function removePortfolio(i: number) {
    setData(d => d ? { ...d, portfolio: d.portfolio.filter((_, idx) => idx !== i) } : d);
  }

  function addReview() {
    setData(d => d ? { ...d, reviews: [...d.reviews, { name: "", city: "", text: "", rating: 5, project: "" }] } : d);
  }

  function removeReview(i: number) {
    setData(d => d ? { ...d, reviews: d.reviews.filter((_, idx) => idx !== i) } : d);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Админ-панель</h1>
          <p className="text-gray-500 text-sm text-center mb-6">РемонтМастер</p>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-amber-400"
          />
          {authError && <p className="text-red-500 text-sm mb-3">{authError}</p>}
          <button onClick={login} className="w-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold py-3 rounded-xl transition">
            Войти
          </button>
        </div>
      </div>
    );
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>;

  async function saveAndRefresh() {
    await save();
    setTimeout(refreshPreview, 300);
  }

  const tabs = [
    { id: "company", label: "Компания" },
    { id: "stats", label: "Цифры" },
    { id: "prices", label: "Цены" },
    { id: "portfolio", label: "Портфолио" },
    { id: "reviews", label: "Отзывы" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-extrabold text-lg">Админ-панель</h1>
          <p className="text-gray-400 text-xs mt-0.5">{data.company.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {saveMsg && <span className="text-sm">{saveMsg}</span>}
          <button
            onClick={() => setShowPreview(v => !v)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${showPreview ? "bg-white text-gray-900 border-white" : "border-white/30 text-white hover:border-white"}`}
          >
            {showPreview ? "Скрыть превью" : "Превью сайта"}
          </button>
          <button
            onClick={saveAndRefresh}
            disabled={saving}
            className="bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold px-6 py-2 rounded-xl text-sm transition disabled:opacity-60"
          >
            {saving ? "Сохраняем..." : "Сохранить"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
      {/* Left panel */}
      <div className={`flex flex-col overflow-y-auto ${showPreview ? "w-1/2" : "w-full"} transition-all`}>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 shrink-0">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-semibold border-b-2 transition ${
                activeTab === tab.id
                  ? "border-amber-400 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 w-full">

        {/* Компания */}
        {activeTab === "company" && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900">Данные компании</h2>
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
              {[
                { field: "name", label: "Название компании", placeholder: "РемонтМастер" },
                { field: "phone", label: "Телефон", placeholder: "+7 (999) 000-00-00" },
                { field: "city", label: "Город", placeholder: "Москва" },
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input
                    type="text"
                    value={data.company[field as keyof typeof data.company]}
                    onChange={e => updateCompany(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Цифры */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900">Цифры под Hero</h2>
            <p className="text-gray-500 text-sm">Отображаются в жёлтой полосе под главным экраном</p>
            <div className="space-y-4">
              {data.stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Число / значение</label>
                    <input
                      type="text"
                      value={stat.num}
                      onChange={e => updateStat(i, "num", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Подпись</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={e => updateStat(i, "label", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Цены */}
        {activeTab === "prices" && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900">Цены калькулятора</h2>
            <p className="text-gray-500 text-sm">Цена за м² для каждого типа ремонта</p>
            <div className="space-y-4">
              {data.roomTypes.map((rt, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Тип ремонта</label>
                    <input
                      type="text"
                      value={rt.label}
                      onChange={e => updateRoomType(i, "label", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="w-36">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Цена за м² (₽)</label>
                    <input
                      type="number"
                      value={rt.pricePerSqm}
                      onChange={e => updateRoomType(i, "pricePerSqm", Number(e.target.value))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Портфолио */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">Портфолио</h2>
              <button onClick={addPortfolio} className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
                + Добавить объект
              </button>
            </div>
            <p className="text-gray-500 text-sm">Вставьте прямые ссылки на фото (Яндекс.Диск, Google Drive, Imgur и др.)</p>
            <div className="space-y-6">
              {data.portfolio.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">Объект #{i + 1}</span>
                    <button onClick={() => removePortfolio(i)} className="text-red-400 hover:text-red-600 text-sm transition">
                      Удалить
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Название (например: 2-комнатная, Центр)</label>
                    <input type="text" value={item.title} onChange={e => updatePortfolio(i, "title", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Площадь</label>
                      <input type="text" placeholder="65 м²" value={item.area} onChange={e => updatePortfolio(i, "area", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Тип ремонта</label>
                      <input type="text" placeholder="Евроремонт" value={item.type} onChange={e => updatePortfolio(i, "type", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Срок</label>
                      <input type="text" placeholder="45 дней" value={item.days} onChange={e => updatePortfolio(i, "days", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>
                  <PhotoUpload label="Фото ДО" value={item.before} password={password}
                    onChange={url => updatePortfolio(i, "before", url)} />
                  <PhotoUpload label="Фото ПОСЛЕ" value={item.after} password={password}
                    onChange={url => updatePortfolio(i, "after", url)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Отзывы */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">Отзывы</h2>
              <button onClick={addReview} className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
                + Добавить
              </button>
            </div>
            <div className="space-y-6">
              {data.reviews.map((review, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">Отзыв #{i + 1}</span>
                    <button onClick={() => removeReview(i)} className="text-red-400 hover:text-red-600 text-sm transition">
                      Удалить
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Имя</label>
                      <input type="text" value={review.name} onChange={e => updateReview(i, "name", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Город/район</label>
                      <input type="text" value={review.city} onChange={e => updateReview(i, "city", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Проект (например: Евроремонт, 58 м²)</label>
                    <input type="text" value={review.project} onChange={e => updateReview(i, "project", e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Текст отзыва</label>
                    <textarea value={review.text} onChange={e => updateReview(i, "text", e.target.value)} rows={3}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-2">Рейтинг: {review.rating} ★</label>
                    <input type="range" min={1} max={5} value={review.rating} onChange={e => updateReview(i, "rating", Number(e.target.value))}
                      className="w-full accent-amber-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button onClick={saveAndRefresh} disabled={saving}
            className="w-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-bold py-4 rounded-xl text-base transition disabled:opacity-60">
            {saving ? "Сохраняем..." : "Сохранить изменения"}
          </button>
          {saveMsg && <p className="text-center mt-3 text-sm">{saveMsg}</p>}
        </div>
      </div>
      </div>{/* end left panel */}

      {/* Right panel — preview */}
      {showPreview && (
        <div className="w-1/2 border-l border-gray-200 flex flex-col bg-white">
          <div className="px-4 py-3 bg-gray-100 border-b border-gray-200 flex items-center justify-between shrink-0">
            <span className="text-sm font-semibold text-gray-600">Превью сайта</span>
            <button onClick={refreshPreview} className="text-xs text-amber-600 hover:text-amber-800 font-semibold transition">
              Обновить ↺
            </button>
          </div>
          <iframe ref={iframeRef} src="/" className="flex-1 w-full" title="preview" />
        </div>
      )}
      </div>{/* end flex row */}
    </div>
  );
}
