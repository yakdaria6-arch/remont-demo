export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Политика конфиденциальности</h1>

        <div className="prose prose-gray text-gray-700 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Общие положения</h2>
            <p>Настоящая политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей, оставляющих заявки на сайте. Используя сайт, вы соглашаетесь с условиями настоящей политики.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Какие данные мы собираем</h2>
            <p>При заполнении формы заявки мы получаем:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Имя пользователя</li>
              <li>Номер телефона</li>
              <li>Параметры объекта (площадь, тип ремонта) — для формирования расчёта</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Цели обработки данных</h2>
            <p>Персональные данные используются исключительно для:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Обратной связи с пользователем по оставленной заявке</li>
              <li>Формирования коммерческого предложения</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Хранение и защита данных</h2>
            <p>Мы не передаём ваши персональные данные третьим лицам. Данные хранятся на защищённых серверах и используются только сотрудниками компании для связи с клиентом.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Права пользователя</h2>
            <p>Вы вправе в любой момент отозвать согласие на обработку персональных данных, направив запрос по телефону или обратившись к нам напрямую. После отзыва согласия ваши данные будут удалены.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. Контакты</h2>
            <p>По вопросам обработки персональных данных обращайтесь к нам по телефону, указанному на сайте.</p>
          </section>
        </div>

        <a href="/" className="inline-block mt-10 text-sm text-amber-600 hover:text-amber-800 font-semibold transition">
          ← Вернуться на главную
        </a>
      </div>
    </main>
  );
}
