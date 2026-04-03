# Матрица Судьбы — Production-ready MVP

Современный веб-сервис нумерологии: персональная матрица судьбы и совместимость пар.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sovsem007/matrix-destiny&project-name=matrix-destiny&repository-name=matrix-destiny)

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Скопировать .env и настроить переменные
cp .env.example .env.local
# DATABASE_URL необязателен — без него приложение работает через localStorage

# 3. Запустить dev-сервер на порту 3002
npm run dev
```

Открыть [http://localhost:3002](http://localhost:3002)

---

## Структура проекта

```
matrix/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (шрифты, темы)
│   ├── page.tsx                  # Главная страница
│   ├── globals.css               # Tailwind + CSS-переменные тем
│   ├── matrix/page.tsx           # Страница матрицы судьбы
│   ├── compatibility/page.tsx    # Страница совместимости
│   ├── share/[slug]/page.tsx     # Decode share-ссылки
│   └── api/
│       ├── matrix/route.ts       # POST /api/matrix
│       └── compatibility/route.ts# POST /api/compatibility
│
├── components/
│   ├── ui/                       # shadcn-совместимые примитивы
│   ├── layout/                   # Header, Footer, ThemeProvider
│   ├── home/                     # Формы, Hero, HowItWorks
│   ├── matrix/                   # MatrixChart (SVG), Legend, SummaryCard, Accordion
│   └── compatibility/            # Score, Bars, Summary, Strengths
│
├── lib/
│   ├── numerology/
│   │   ├── formulas.config.ts    # ⬅ ВСЕ ФОРМУЛЫ — точки замены
│   │   ├── reduction.ts          # Функции редукции чисел
│   │   ├── matrix-engine.ts      # calculateMatrix()
│   │   └── compatibility-engine.ts # calculateCompatibility()
│   ├── interpretations/
│   │   ├── arcana.ts             # Словарь 22 арканов (RU)
│   │   └── position-meanings.ts  # Метаданные позиций
│   ├── utils/
│   │   ├── storage.ts            # localStorage история
│   │   ├── share.ts              # Share URL утилиты
│   │   └── pdf.ts                # Экспорт в PDF
│   ├── db.ts                     # Prisma singleton
│   └── utils.ts                  # cn(), generateToken(), ...
│
├── store/
│   └── useAppStore.ts            # Zustand store
│
├── types/
│   └── index.ts                  # Все TypeScript типы
│
├── prisma/
│   └── schema.prisma             # DB схема (необязательно)
│
└── __tests__/
    ├── reduction.test.ts
    ├── matrix-engine.test.ts
    └── compatibility-engine.test.ts
```

---

## Как заменить формулы матрицы судьбы

Все точки замены сосредоточены в одном файле:

### `lib/numerology/formulas.config.ts`

| Функция/константа | Что делает | Как заменить |
|---|---|---|
| `REDUCTION_CONFIG` | Диапазон арканов (1..22) и правило нуля | Измените `min`, `max`, `zeroFallback` |
| `extractRawBaseNumbers()` | Как из DD/MM/YYYY извлечь 4 базовых числа | Замените тело функции |
| `computeRawPositions()` | Как из 4 базовых чисел вычислить 9 позиций октаграммы | Замените формулы |
| `computeRawInterpretationPositions()` | Как вычислить производные позиции (отношения, финансы…) | Замените формулы |
| `COMPATIBILITY_WEIGHTS` | Веса четырёх аспектов совместимости | Измените числа (должны суммироваться в 1) |
| `ELEMENT_AFFINITY` | Таблица совместимости элементов | Замените значения 0..100 |

### `lib/interpretations/arcana.ts`

Словарь интерпретаций 22 арканов. Замените любой объект `ARCANA[n]` для подмены смыслов под конкретную методику (Натальи Ладини, Балюры, собственную).

---

## Технологии

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** + CSS-переменные для темизации
- **Framer Motion** — анимации
- **Zustand** — клиентский стейт
- **Zod** — валидация форм
- **SVG** — визуализация октаграммы (без сторонних библиотек)
- **html2canvas + jsPDF** — экспорт в PDF
- **Prisma + PostgreSQL** — опциональная история расчётов

---

## База данных (опционально)

```bash
# PostgreSQL
createdb matrix_destiny

# Добавить в .env.local:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/matrix_destiny"

# Применить схему:
npm run db:push

# Открыть Studio:
npm run db:studio
```

---

## Команды

```bash
npm run dev          # Dev-сервер (порт 3002)
npm run build        # Production build
npm run test         # Unit тесты
npm run db:push      # Применить Prisma схему
npm run db:studio    # Открыть Prisma Studio
```

---

## Допущения по формулам

Поскольку единого стандарта "Матрицы судьбы" нет, реализованы следующие правила:

1. **Базовые числа**: D=день, M=месяц, Y=сумма цифр года, T=D+M+Y
2. **Редукция**: digit-sum до диапазона 1..22; 0 → 22 (Шут)
3. **Позиции октаграммы**: Sky=T, Earth=D+Y, Male=D+M, Female=M+Y, Center=D+M+Y+T; диагонали — суммы смежных кардинальных точек
4. **Совместимость**: взвешенная сумма 4 аспектов (30/25/25/20%), аффинитет по таблице элементов

Всё перечисленное задокументировано в `formulas.config.ts` и легко меняется.

---

## Disclaimer

Сервис носит исключительно развлекательный и информационный характер. Результаты не являются научным, психологическим, медицинским или юридическим заключением.
