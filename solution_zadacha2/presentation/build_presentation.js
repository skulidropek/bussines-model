const fs = require('fs')
const path = require('path')
const PptxGenJS = require('pptxgenjs')

const outDir = __dirname
const rootDir = path.resolve(__dirname, '..')
const metrics = JSON.parse(fs.readFileSync(path.join(rootDir, 'metrics.json'), 'utf8'))
const scenarioCompare = metrics.scenario_compare

const priceSensitivity = [
  { price: 180, annual: 13320000, npv: 32150705.9055, irr: 1.0350722307, dpp: 1.0911 },
  { price: 190, annual: 9960000, npv: 20887464.7762, irr: 0.7479709504, dpp: 1.5098 },
  { price: 200, annual: 6600000, npv: 9624223.6469, irr: 0.4438583625, dpp: 2.4079 },
  { price: 210, annual: 3240000, npv: -1639017.4824, irr: 0.0931542577, dpp: 6.1956 },
  { price: 215, annual: 1560000, npv: -7270638.0471, irr: -0.1390867030, dpp: null },
  { price: 220, annual: -120000, npv: -12902258.6118, irr: null, dpp: null },
]

const intervalSensitivity = [
  { interval: 1.75, annual: 15000000, npv: 37782326.4702, irr: 1.1753669243, dpp: 0.9583 },
  { interval: 1.9, annual: 9960000, npv: 20887464.7762, irr: 0.7479709504, dpp: 1.5098 },
  { interval: 2.0, annual: 6600000, npv: 9624223.6469, irr: 0.4438583625, dpp: 2.4079 },
  { interval: 2.1, annual: 3240000, npv: -1639017.4824, irr: 0.0931542577, dpp: 6.1956 },
  { interval: 2.15, annual: 1560000, npv: -7270638.0471, irr: -0.1390867030, dpp: null },
  { interval: 2.25, annual: -1800000, npv: -18533879.1764, irr: null, dpp: null },
]

const tornado = {
  npv: [
    {
      factor: 'Интервал замены',
      lowDelta: 37782326.4702 - metrics.base_case.npv,
      highDelta: -7270638.0471 - metrics.base_case.npv,
      swing: Math.abs(37782326.4702 - -7270638.0471),
    },
    {
      factor: 'Цена масла',
      lowDelta: 32150705.9055 - metrics.base_case.npv,
      highDelta: -7270638.0471 - metrics.base_case.npv,
      swing: Math.abs(32150705.9055 - -7270638.0471),
    },
  ],
  irr: [
    {
      factor: 'Интервал замены',
      lowDelta: 1.1753669243 - metrics.base_case.irr,
      highDelta: -0.1390867030 - metrics.base_case.irr,
      swing: Math.abs(1.1753669243 - -0.1390867030),
    },
    {
      factor: 'Цена масла',
      lowDelta: 1.0350722307 - metrics.base_case.irr,
      highDelta: -0.1390867030 - metrics.base_case.irr,
      swing: Math.abs(1.0350722307 - -0.1390867030),
    },
  ],
}

const fmtRub = (v) => `${Math.round(v).toLocaleString('ru-RU')} ₽`
const fmtPct = (v) => `${(v * 100).toFixed(2)}%`
const fmtNum = (v, d = 2) => Number(v).toFixed(d)

const pptx = new PptxGenJS()
pptx.layout = 'LAYOUT_WIDE'
pptx.author = 'Codex'
pptx.company = 'skulidropek'
pptx.subject = 'Финансовая модель лаборатории масла'
pptx.title = 'Решение кейса: покупка лаборатории'
pptx.theme = {
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  lang: 'ru-RU',
}

const colors = {
  navy: '12304A',
  blue: '1F5B89',
  soft: 'EAF1F7',
  green: '1E8E3E',
  red: 'B3261E',
  text: '1F2933',
  muted: '6B7280',
}

function addHeader(slide, title, subtitle) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.7, fill: { color: colors.navy }, line: { color: colors.navy } })
  slide.addText(title, { x: 0.4, y: 0.12, w: 8.5, h: 0.35, fontSize: 20, bold: true, color: 'FFFFFF' })
  if (subtitle) {
    slide.addText(subtitle, { x: 0.4, y: 0.52, w: 8.8, h: 0.22, fontSize: 11, color: 'D9E2EC' })
  }
}

// Slide 1
{
  const s = pptx.addSlide()
  addHeader(s, 'Покупка лаборатории анализа масла', 'Кейс: Задача для ИИ 2 | base case: 15% discount, horizon 5 years')

  s.addText('РЕШЕНИЕ: ПРИНИМАТЬ', {
    x: 0.5, y: 1.0, w: 5.8, h: 0.7,
    fontSize: 36, bold: true, color: colors.green,
  })

  s.addText('Сравнение сценариев (формульная модель в Excel):', {
    x: 0.5, y: 1.75, w: 7.5, h: 0.35,
    fontSize: 15, color: colors.text, bold: true,
  })

  const cards = [
    {
      label: 'Scenario 1: Base',
      value: `NPV ${fmtRub(scenarioCompare.scenario_1.npv)}`,
      note: `IRR ${fmtPct(scenarioCompare.scenario_1.irr)} | DPP ${fmtNum(scenarioCompare.scenario_1.dpp_years)} | ${scenarioCompare.scenario_1.decision}`,
    },
    {
      label: 'Scenario 2: Conservative',
      value: `NPV ${fmtRub(scenarioCompare.scenario_2.npv)}`,
      note: `IRR ${fmtPct(scenarioCompare.scenario_2.irr)} | DPP ${fmtNum(scenarioCompare.scenario_2.dpp_years)} | ${scenarioCompare.scenario_2.decision}`,
    },
  ]

  cards.forEach((c, i) => {
    const x = 0.5 + i * 6.35
    s.addShape(pptx.ShapeType.roundRect, {
      x, y: 2.2, w: 6.1, h: 2.1,
      fill: { color: colors.soft }, line: { color: 'C5D5E5', pt: 1.2 }, radius: 0.08,
    })
    s.addText(c.label, { x: x + 0.22, y: 2.44, w: 5.6, h: 0.24, fontSize: 12, color: colors.muted, bold: true })
    s.addText(c.value, { x: x + 0.22, y: 2.8, w: 5.6, h: 0.48, fontSize: 23, bold: true, color: colors.blue })
    s.addText(c.note, { x: x + 0.22, y: 3.42, w: 5.6, h: 0.42, fontSize: 11, color: colors.muted })
  })

  s.addText(
    `Δ(2-1): NPV ${fmtRub(scenarioCompare.delta_2_minus_1.npv)} | IRR ${fmtPct(scenarioCompare.delta_2_minus_1.irr)} | DPP ${fmtNum(scenarioCompare.delta_2_minus_1.dpp_years)} года`,
    {
      x: 0.5, y: 4.55, w: 12.4, h: 0.35, fontSize: 12.5, color: colors.text,
    }
  )

  s.addText('Break-even: цена 219.64 ₽/л (при интервале 2.0), интервал 2.196 раз/мес (при цене 200 ₽/л).', {
    x: 0.5, y: 5.0, w: 12.0, h: 0.35, fontSize: 12.5, color: colors.text,
  })
}

// Slide 2
{
  const s = pptx.addSlide()
  addHeader(s, 'Логика модели и входные параметры', 'Все расчеты сделаны на том же листе Excel, как требует ТЗ')

  s.addText('Исходные драйверы', { x: 0.5, y: 1.0, w: 4, h: 0.3, fontSize: 16, bold: true, color: colors.blue })
  s.addText([
    { text: '• Текущая частота: 3 раз/мес\n', options: { bullet: { indent: 18 } } },
    { text: '• Целевая частота: 2 раз/мес\n', options: { bullet: { indent: 18 } } },
    { text: '• Парк: 70 ед.; замена: 200 л\n', options: { bullet: { indent: 18 } } },
    { text: '• Текущая цена масла: 150 ₽/л\n', options: { bullet: { indent: 18 } } },
    { text: '• Новая цена масла: 200 ₽/л\n', options: { bullet: { indent: 18 } } },
    { text: '• Лаборатория: 150 тыс. ₽/мес OPEX\n', options: { bullet: { indent: 18 } } },
    { text: '• CAPEX: 12.5 млн ₽ без НДС (t0)', options: { bullet: { indent: 18 } } },
  ], { x: 0.5, y: 1.3, w: 5.8, h: 3.5, fontSize: 14, color: colors.text })

  s.addShape(pptx.ShapeType.roundRect, {
    x: 6.5, y: 1.2, w: 6.2, h: 3.6,
    fill: { color: 'F8FAFC' }, line: { color: 'D1D9E0', pt: 1.2 }, radius: 0.08,
  })
  s.addText('Формулы', { x: 6.8, y: 1.45, w: 3, h: 0.25, fontSize: 14, bold: true, color: colors.blue })
  s.addText('Savings_month = CurrentCost_month - (ProjectOilCost_month + LabOpex_month)', {
    x: 6.8, y: 1.85, w: 5.8, h: 0.55, fontSize: 12, color: colors.text,
  })
  s.addText('Savings_year = Savings_month × 12\nNPV = CF0 + NPV(rate, CF1:CF5)\nIRR = IRR(CF0:CF5)\nDPP = год до окупаемости + дробная часть года', {
    x: 6.8, y: 2.4, w: 5.8, h: 1.5, fontSize: 12, color: colors.text,
  })
  s.addText('Годовая экономия (base): 6,600,000 ₽', {
    x: 6.8, y: 4.15, w: 5.8, h: 0.3, fontSize: 14, bold: true, color: colors.green,
  })
}

// Slide 3
{
  const s = pptx.addSlide()
  addHeader(s, 'Sensitivity по NPV и IRR', 'Факторы: цена масла и интервал замены (раз/мес)')

  s.addText('Цена масла (фикс. интервал 2.0)', { x: 0.5, y: 1.0, w: 5, h: 0.3, fontSize: 14, bold: true, color: colors.blue })
  const t1 = [
    [{ text: 'Цена, ₽/л', options: { bold: true } }, { text: 'NPV, ₽', options: { bold: true } }, { text: 'IRR', options: { bold: true } }],
    ...priceSensitivity.map((r) => [String(r.price), Math.round(r.npv).toLocaleString('ru-RU'), r.irr === null ? 'N/A' : fmtPct(r.irr)]),
  ]
  s.addTable(t1, {
    x: 0.5, y: 1.35, w: 5.9, h: 3.5,
    border: { type: 'solid', color: 'D1D9E0', pt: 1 },
    fill: 'FFFFFF', color: colors.text, fontSize: 11,
    colW: [1.5, 2.6, 1.6],
  })

  s.addText('Интервал замены (фикс. цена 200 ₽/л)', { x: 6.9, y: 1.0, w: 5.8, h: 0.3, fontSize: 14, bold: true, color: colors.blue })
  const t2 = [
    [{ text: 'Интервал', options: { bold: true } }, { text: 'NPV, ₽', options: { bold: true } }, { text: 'IRR', options: { bold: true } }],
    ...intervalSensitivity.map((r) => [String(r.interval), Math.round(r.npv).toLocaleString('ru-RU'), r.irr === null ? 'N/A' : fmtPct(r.irr)]),
  ]
  s.addTable(t2, {
    x: 6.9, y: 1.35, w: 5.9, h: 3.5,
    border: { type: 'solid', color: 'D1D9E0', pt: 1 },
    fill: 'FFFFFF', color: colors.text, fontSize: 11,
    colW: [1.4, 2.7, 1.6],
  })

  s.addText('При stress-точках возможен IRR = N/A (нет смены знака cash flow).', {
    x: 0.5, y: 5.0, w: 12.0, h: 0.3, fontSize: 12, color: colors.red,
  })
}

// Slide 4
{
  const s = pptx.addSlide()
  addHeader(s, 'Tornado и риски исполнения', 'Ранжирование влияния факторов на результат')

  const labels = tornado.npv.map((r) => r.factor)
  s.addChart(pptx.ChartType.bar, [
    { name: 'Low vs base', labels, values: tornado.npv.map((r) => Math.round(r.lowDelta)) },
    { name: 'High vs base', labels, values: tornado.npv.map((r) => Math.round(r.highDelta)) },
  ], {
    x: 0.5, y: 1.05, w: 6.2, h: 3.2,
    barDir: 'bar', barGrouping: 'clustered',
    catAxisLabelFontSize: 10, valAxisLabelFontSize: 9,
    showLegend: true, legendPos: 'b',
    chartColors: ['2E7D32', 'C62828'],
    valAxisTitle: 'ΔNPV, ₽',
    catAxisTitle: 'Фактор',
  })

  s.addChart(pptx.ChartType.bar, [
    { name: 'Low vs base', labels: tornado.irr.map((r) => r.factor), values: tornado.irr.map((r) => Number((r.lowDelta * 100).toFixed(2))) },
    { name: 'High vs base', labels: tornado.irr.map((r) => r.factor), values: tornado.irr.map((r) => Number((r.highDelta * 100).toFixed(2))) },
  ], {
    x: 6.85, y: 1.05, w: 6.0, h: 3.2,
    barDir: 'bar', barGrouping: 'clustered',
    catAxisLabelFontSize: 10, valAxisLabelFontSize: 9,
    showLegend: true, legendPos: 'b',
    chartColors: ['1976D2', 'D32F2F'],
    valAxisTitle: 'ΔIRR, п.п.',
    catAxisTitle: 'Фактор',
  })

  s.addText('Ключевые риски и контроль:', { x: 0.5, y: 4.45, w: 4.5, h: 0.3, fontSize: 14, bold: true, color: colors.blue })
  s.addText([
    { text: '• Риск 1: цена нового масла выше break-even\n', options: { bullet: { indent: 18 } } },
    { text: '• Риск 2: фактический интервал замены хуже плана\n', options: { bullet: { indent: 18 } } },
    { text: '• Контроль: ежемесячный мониторинг фактической цены и интервала\n', options: { bullet: { indent: 18 } } },
    { text: '• Триггер пересмотра: NPV rolling-прогноза < 0', options: { bullet: { indent: 18 } } },
  ], { x: 0.5, y: 4.75, w: 12.2, h: 1.1, fontSize: 13, color: colors.text })
}

const pptxPath = path.join(outDir, 'Задача для ИИ 2 - презентация.pptx')
pptx.writeFile({ fileName: pptxPath })

const html = `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Презентация — Задача для ИИ 2</title>
  <link rel="stylesheet" href="./preview.css" />
</head>
<body>
  <main class="deck">
    <section class="slide">
      <h1>Покупка лаборатории анализа масла</h1>
      <p class="decision">РЕШЕНИЕ: ПРИНИМАТЬ</p>
      <div class="cards">
        <article>
          <h3>Сценарий 1 (Base)</h3>
          <p>${fmtRub(scenarioCompare.scenario_1.npv)}</p>
          <small>IRR ${fmtPct(scenarioCompare.scenario_1.irr)} | DPP ${fmtNum(scenarioCompare.scenario_1.dpp_years)} | ${scenarioCompare.scenario_1.decision}</small>
        </article>
        <article>
          <h3>Сценарий 2 (Conservative)</h3>
          <p>${fmtRub(scenarioCompare.scenario_2.npv)}</p>
          <small>IRR ${fmtPct(scenarioCompare.scenario_2.irr)} | DPP ${fmtNum(scenarioCompare.scenario_2.dpp_years)} | ${scenarioCompare.scenario_2.decision}</small>
        </article>
      </div>
      <p class="note">Δ(2-1): NPV ${fmtRub(scenarioCompare.delta_2_minus_1.npv)} | IRR ${fmtPct(scenarioCompare.delta_2_minus_1.irr)} | DPP ${fmtNum(scenarioCompare.delta_2_minus_1.dpp_years)} года</p>
      <p class="note">Break-even price: ${metrics.break_even.price_at_freq_2.toFixed(2)} ₽/л | Break-even interval: ${metrics.break_even.freq_at_price_200.toFixed(3)} раз/мес</p>
    </section>

    <section class="slide">
      <h2>Sensitivity: цена масла (фикс. интервал 2.0)</h2>
      <table>
        <thead><tr><th>Цена, ₽/л</th><th>NPV, ₽</th><th>IRR</th></tr></thead>
        <tbody>
          ${priceSensitivity.map((r) => `<tr><td>${r.price}</td><td>${Math.round(r.npv).toLocaleString('ru-RU')}</td><td>${r.irr === null ? 'N/A' : fmtPct(r.irr)}</td></tr>`).join('')}
        </tbody>
      </table>
      <h2>Sensitivity: интервал (фикс. цена 200 ₽/л)</h2>
      <table>
        <thead><tr><th>Интервал</th><th>NPV, ₽</th><th>IRR</th></tr></thead>
        <tbody>
          ${intervalSensitivity.map((r) => `<tr><td>${r.interval}</td><td>${Math.round(r.npv).toLocaleString('ru-RU')}</td><td>${r.irr === null ? 'N/A' : fmtPct(r.irr)}</td></tr>`).join('')}
        </tbody>
      </table>
    </section>
  </main>
</body>
</html>`

const css = `
:root {
  --bg: #f2f6fa;
  --card: #ffffff;
  --ink: #1f2933;
  --muted: #617487;
  --accent: #1f5b89;
  --ok: #1e8e3e;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: "Calibri", "Segoe UI", sans-serif;
  background: radial-gradient(circle at 20% 10%, #dce8f4, #f4f8fc 45%), linear-gradient(120deg, #f3f7fb, #edf3f9);
  color: var(--ink);
}
.deck { max-width: 1100px; margin: 24px auto; display: grid; gap: 22px; padding: 0 16px 24px; }
.slide {
  background: var(--card);
  border: 1px solid #d7e2ee;
  border-radius: 16px;
  padding: 26px;
  box-shadow: 0 20px 50px rgba(22, 46, 76, 0.08);
}
h1 { margin: 0 0 12px; font-size: 40px; color: #12304a; }
h2 { margin: 0 0 10px; font-size: 22px; color: #1f5b89; }
.decision { font-size: 34px; font-weight: 800; color: var(--ok); margin: 8px 0 20px; }
.cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.cards article { background: #edf4fb; border: 1px solid #c7d9ea; border-radius: 12px; padding: 14px; }
.cards h3 { margin: 0; color: var(--muted); font-size: 14px; }
.cards p { margin: 8px 0 0; font-size: 28px; color: var(--accent); font-weight: 700; }
.cards small { display: block; margin-top: 8px; color: #4b5e71; font-size: 13px; line-height: 1.35; }
.note { margin-top: 16px; color: #364a5e; font-size: 16px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
th, td { border: 1px solid #d6e1ec; padding: 8px; text-align: right; }
th:first-child, td:first-child { text-align: left; }
thead th { background: #edf4fb; }
@media (max-width: 800px) {
  h1 { font-size: 30px; }
  .decision { font-size: 26px; }
  .cards { grid-template-columns: 1fr; }
}
`

fs.writeFileSync(path.join(outDir, 'preview.html'), html, 'utf8')
fs.writeFileSync(path.join(outDir, 'preview.css'), css, 'utf8')

console.log('Built:')
console.log('-', pptxPath)
console.log('-', path.join(outDir, 'preview.html'))
