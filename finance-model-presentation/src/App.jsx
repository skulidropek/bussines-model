import { useEffect, useMemo, useState } from 'react'
import './App.css'

const model = {
  title: 'SPV Financial Model 2022–2030',
  subtitle: 'Один финальный ответ по FCFC и FCFE',
  source: 'Кейс для ИИ.xlsx',
  methodology:
    'FCFC = EBIT (после НДПИ и налога на прибыль 20%) - ΔAR + ΔAP - CAPEX; дисконтирование в конце года (t1).',
  assumptions: [
    'Сценарий: Base (фиксированный, без ветвления).',
    'Налог на прибыль: 20% от EBIT (прочий налог в том же периоде).',
    'НДС, амортизация и налог на имущество: не учитываются по ТЗ.',
    'Дивиденды только после полного погашения долга.',
  ],
  metrics: {
    npvFcfc: 7325271.45,
    npvFcfe: 7409843.34,
    irrFcfc: 0.3806595624,
    irrFcfe: 0.6923325216,
    debtRepayYear: 2026,
    decision: 'ПРИНИМАТЬ',
  },
  yearly: [
    { year: 2022, fcfc: -4500000.0, fcfe: -1000000.0, debtEnd: 3888888.89, dividends: 0 },
    { year: 2023, fcfc: -1500000.0, fcfe: 0.0, debtEnd: 5987654.32, dividends: 0 },
    { year: 2024, fcfc: 2043098.84, fcfe: 0.0, debtEnd: 4382839.42, dividends: 0 },
    { year: 2025, fcfc: 3710297.8, fcfe: 0.0, debtEnd: 747268.47, dividends: 0 },
    { year: 2026, fcfc: 4126880.86, fcfe: 3379612.39, debtEnd: 0.0, dividends: 3379612.39 },
    { year: 2027, fcfc: 3950554.07, fcfe: 3950554.07, debtEnd: 0.0, dividends: 3950554.07 },
    { year: 2028, fcfc: 3856473.66, fcfe: 3856473.66, debtEnd: 0.0, dividends: 3856473.66 },
    { year: 2029, fcfc: 3578347.07, fcfe: 3578347.07, debtEnd: 0.0, dividends: 3578347.07 },
    { year: 2030, fcfc: 3310603.49, fcfe: 3310603.49, debtEnd: 0.0, dividends: 3310603.49 },
  ],
  checks: [
    { name: 'Баланс', status: 'OK', detail: 'Активы = Пассивы + Капитал по всем годам.' },
    { name: 'CF-мост', status: 'OK', detail: 'Изменение Cash согласовано с CFO/CFI/CFF.' },
    { name: 'Дивидендный мораторий', status: 'OK', detail: 'До 2026 дивиденды = 0, пока долг не погашен.' },
  ],
}

const currency = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 })
const percent = new Intl.NumberFormat('ru-RU', { style: 'percent', maximumFractionDigits: 2 })

function formatCurrency(value) {
  return `${currency.format(value)} тыс. руб.`
}

function Metric({ label, value, tone = 'normal' }) {
  return (
    <article className={`metric metric-${tone}`}>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </article>
  )
}

function App() {
  const [index, setIndex] = useState(0)

  const slides = useMemo(
    () => [
      {
        key: 'cover',
        title: 'Итог по финансовой модели',
        content: (
          <div className="hero-layout">
            <div className="hero-copy">
              <p className="kicker">{model.title}</p>
              <h1 className="hero-title">
                We believe in the power of a
                <span> transparent financial decision </span>
                and one final answer.
              </h1>
            </div>

            <section className="ton-panel">
              <div className="panel-copy">
                <h3>What is this model?</h3>
                <p>
                  Единая финансовая модель SPV c итогом по FCFC и FCFE, проверкой связности
                  P&L / BS / CF и автоматическим debt waterfall.
                </p>
                <p className="panel-meta">Источник: {model.source}</p>
              </div>
              <div className="metrics">
                <Metric label="NPV FCFC" value={formatCurrency(model.metrics.npvFcfc)} tone="accent" />
                <Metric label="NPV FCFE" value={formatCurrency(model.metrics.npvFcfe)} tone="accent" />
                <Metric label="IRR FCFC" value={percent.format(model.metrics.irrFcfc)} />
                <Metric label="IRR FCFE" value={percent.format(model.metrics.irrFcfe)} />
                <Metric label="Год погашения долга" value={String(model.metrics.debtRepayYear)} />
                <Metric label="Решение" value={model.metrics.decision} tone="success" />
              </div>
            </section>
          </div>
        ),
      },
      {
        key: 'method',
        title: 'Методика расчета',
        content: (
          <div className="method-layout">
            <p className="formula">{model.methodology}</p>
            <div className="panel panel-light">
              <h3>Ключевые допущения</h3>
              <ul>
                {model.assumptions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ),
      },
      {
        key: 'cashflow',
        title: 'Годовые потоки (один сценарий)',
        content: (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Год</th>
                  <th>FCFC</th>
                  <th>FCFE</th>
                  <th>Долг на конец</th>
                  <th>Дивиденды</th>
                </tr>
              </thead>
              <tbody>
                {model.yearly.map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{currency.format(row.fcfc)}</td>
                    <td>{currency.format(row.fcfe)}</td>
                    <td>{currency.format(row.debtEnd)}</td>
                    <td>{currency.format(row.dividends)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ),
      },
      {
        key: 'checks',
        title: 'Контроль качества модели',
        content: (
          <div className="checks-grid">
            {model.checks.map((check) => (
              <article className="check-card" key={check.name}>
                <header>
                  <h3>{check.name}</h3>
                  <span className={`badge badge-${check.status.toLowerCase()}`}>{check.status}</span>
                </header>
                <p>{check.detail}</p>
              </article>
            ))}
          </div>
        ),
      },
      {
        key: 'answer',
        title: 'Финальный ответ',
        content: (
          <div className="final-answer">
            <p>
              При фиксированных допущениях ТЗ и проверке связности модели оба ключевых индикатора
              (FCFC/FCFE) положительны.
            </p>
            <div className="answer-callout">
              <p>FCFC NPV: {formatCurrency(model.metrics.npvFcfc)}</p>
              <p>FCFE NPV: {formatCurrency(model.metrics.npvFcfe)}</p>
              <strong>{model.metrics.decision}</strong>
            </div>
          </div>
        ),
      },
    ],
    [],
  )

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setIndex((current) => Math.min(current + 1, slides.length - 1))
      }
      if (event.key === 'ArrowLeft') {
        setIndex((current) => Math.max(current - 1, 0))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [slides.length])

  return (
    <main className="deck">
      <header className="site-header">
        <div className="brand">
          <span className="brand-icon" aria-hidden="true">◉</span>
          <div>
            <p className="brand-line">The Open Network</p>
            <p className="brand-line">Finance Presentation</p>
          </div>
        </div>

        <nav className="menu" aria-label="Presentation menu">
          <span>Our Role</span>
          <span>Model</span>
          <span>Checks</span>
          <span>Contacts</span>
        </nav>

        <div className="lang-pill">Eng</div>
      </header>

      <section className="controls-row">
        <p className="meta">Слайд {index + 1} из {slides.length}</p>
        <div className="controls">
          <button onClick={() => setIndex((current) => Math.max(current - 1, 0))} disabled={index === 0}>
            ← Назад
          </button>
          <button onClick={() => setIndex((current) => Math.min(current + 1, slides.length - 1))} disabled={index === slides.length - 1}>
            Вперед →
          </button>
        </div>
      </section>

      <section className="slide" key={slides[index].key}>
        <h2>{slides[index].title}</h2>
        {slides[index].content}
      </section>

      <footer className="dots" aria-label="Навигация по слайдам">
        {slides.map((slide, dotIndex) => (
          <button
            key={slide.key}
            className={dotIndex === index ? 'dot active' : 'dot'}
            onClick={() => setIndex(dotIndex)}
            aria-label={`Слайд ${dotIndex + 1}`}
          />
        ))}
      </footer>
    </main>
  )
}

export default App
