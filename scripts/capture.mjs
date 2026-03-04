import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.resolve(__dirname, '..');
const SHOTS = path.join(PROJECT, 'public', 'screenshots');
const BASE = 'http://localhost:3000';

const VIEWPORT = { width: 1440, height: 900 };

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function selectField(page, labelText) {
  return page
    .locator('.MuiFormControl-root')
    .filter({ hasText: labelText })
    .locator('[role="combobox"]');
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  /* ── Screenshot pass (no video) ──────────────────────────── */
  const sCtx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 });
  const sp = await sCtx.newPage();

  // 1. Landing page
  await sp.goto(BASE, { waitUntil: 'networkidle' });
  await sleep(2000);
  await sp.screenshot({ path: path.join(SHOTS, '01_landing_page.png'), fullPage: true });
  console.log('✓ 01_landing_page');

  // 2. Comparator – default config (Recommendation + Score Breakdown tab)
  await sp.goto(`${BASE}/platform-comparator`, { waitUntil: 'networkidle' });
  await sleep(2000);
  await sp.screenshot({ path: path.join(SHOTS, '02_comparator_default.png'), fullPage: true });
  console.log('✓ 02_comparator_default');

  // 3. Score Breakdown tab (scroll to see table + radar)
  const scoreTab = sp.getByRole('tab', { name: 'Score Breakdown' });
  await scoreTab.click();
  await sleep(1000);
  await sp.screenshot({ path: path.join(SHOTS, '03_score_breakdown.png'), fullPage: true });
  console.log('✓ 03_score_breakdown');

  // 4. Decision Trace tab
  const traceTab = sp.getByRole('tab', { name: 'Decision Trace' });
  await traceTab.click();
  await sleep(1000);
  await sp.screenshot({ path: path.join(SHOTS, '04_decision_trace.png'), fullPage: true });
  console.log('✓ 04_decision_trace');

  // 5. Architecture tab
  const archTab = sp.getByRole('tab', { name: 'Architecture' });
  await archTab.click();
  await sleep(2000);
  await sp.screenshot({ path: path.join(SHOTS, '05_architecture.png'), fullPage: true });
  console.log('✓ 05_architecture');

  // 6. Capabilities tab
  const capTab = sp.getByRole('tab', { name: 'Capabilities' });
  await capTab.click();
  await sleep(1000);
  await sp.screenshot({ path: path.join(SHOTS, '06_capabilities.png'), fullPage: true });
  console.log('✓ 06_capabilities');

  // 7. Lock-in & Portability tab
  const lockTab = sp.getByRole('tab', { name: 'Lock-in & Portability' });
  await lockTab.click();
  await sleep(1000);
  await sp.screenshot({ path: path.join(SHOTS, '07_lockin_portability.png'), fullPage: true });
  console.log('✓ 07_lockin_portability');

  // 8. Migration tab
  const migTab = sp.getByRole('tab', { name: 'Migration' });
  await migTab.click();
  await sleep(1000);
  await sp.screenshot({ path: path.join(SHOTS, '08_migration.png'), fullPage: true });
  console.log('✓ 08_migration');

  // 9. Comparison tab
  const cmpTab = sp.getByRole('tab', { name: 'Comparison' });
  await cmpTab.click();
  await sleep(1000);
  await sp.screenshot({ path: path.join(SHOTS, '09_comparison.png'), fullPage: true });
  console.log('✓ 09_comparison');

  // 10. Risk Alerts tab
  const riskTab = sp.getByRole('tab', { name: 'Risk Alerts' });
  await riskTab.click();
  await sleep(1000);
  await sp.screenshot({ path: path.join(SHOTS, '10_risk_alerts.png'), fullPage: true });
  console.log('✓ 10_risk_alerts');

  // 11. Change config to Agent + AWS + Highly Regulated
  await sp.getByRole('tab', { name: 'Score Breakdown' }).click();
  await sleep(500);

  await selectField(sp, 'Workload Type').click();
  await sp.getByRole('option', { name: /Agent Workflow/i }).click();
  await sleep(300);

  await selectField(sp, 'Data Gravity').click();
  await sp.getByRole('option', { name: /Amazon Web Services/i }).click();
  await sleep(300);

  await selectField(sp, 'Security Level').click();
  await sp.getByRole('option', { name: /Highly Regulated/i }).click();
  await sleep(300);

  await selectField(sp, 'Governance Requirement').click();
  await sp.getByRole('option', { name: /High/i }).click();
  await sleep(1500);
  await sp.screenshot({ path: path.join(SHOTS, '11_agent_aws_regulated.png'), fullPage: true });
  console.log('✓ 11_agent_aws_regulated');

  // 12. Chatbot + Azure + Standard
  await selectField(sp, 'Workload Type').click();
  await sp.getByRole('option', { name: /Chatbot/i }).click();
  await sleep(300);

  await selectField(sp, 'Data Gravity').click();
  await sp.getByRole('option', { name: /Microsoft Azure/i }).click();
  await sleep(300);

  await selectField(sp, 'Security Level').click();
  await sp.getByRole('option', { name: /Standard/i }).click();
  await sleep(1500);
  await sp.screenshot({ path: path.join(SHOTS, '12_chatbot_azure.png'), fullPage: true });
  console.log('✓ 12_chatbot_azure');

  // 13. Export panel
  const exportSection = sp.locator('text=Export & Share');
  if (await exportSection.count() > 0) {
    await exportSection.scrollIntoViewIfNeeded();
    await sleep(500);
    await sp.screenshot({ path: path.join(SHOTS, '13_export_panel.png'), fullPage: true });
    console.log('✓ 13_export_panel');
  }

  // 14. Data Disclosure drawer
  const disclosureBtn = sp.locator('button:has-text("Data Sources")');
  if (await disclosureBtn.count() > 0) {
    await disclosureBtn.click();
    await sleep(1000);
    await sp.screenshot({ path: path.join(SHOTS, '14_data_disclosure.png'), fullPage: true });
    console.log('✓ 14_data_disclosure');
    await sp.keyboard.press('Escape');
    await sleep(500);
  }

  await sCtx.close();
  console.log('\n── Screenshots complete ──\n');

  /* ── Video recording pass ────────────────────────────────── */
  const vCtx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    recordVideo: {
      dir: path.join(PROJECT, 'public', 'demo'),
      size: VIEWPORT,
    },
  });
  const vp = await vCtx.newPage();

  // Landing page
  await vp.goto(BASE, { waitUntil: 'networkidle' });
  await sleep(3000);

  // Scroll down the landing page slowly
  await vp.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await sleep(2500);
  await vp.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(1500);

  // Click "Launch Decision Engine"
  const launchBtn = vp.locator('button:has-text("Launch Decision Engine"), a:has-text("Launch Decision Engine")');
  if (await launchBtn.count() > 0) {
    await launchBtn.first().click();
  } else {
    await vp.goto(`${BASE}/platform-comparator`, { waitUntil: 'networkidle' });
  }
  await sleep(2500);

  // Default view - show recommendation
  await vp.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(1500);

  // Scroll down to see full score table
  await vp.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
  await sleep(2000);

  // Browse tabs
  const tabNames = [
    'Decision Trace',
    'Architecture',
    'Capabilities',
    'Lock-in & Portability',
    'Migration',
    'Comparison',
    'Risk Alerts',
  ];

  for (const name of tabNames) {
    await vp.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(500);
    const t = vp.getByRole('tab', { name });
    await t.click();
    await sleep(2000);
    await vp.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }));
    await sleep(1500);
  }

  // Change configuration – Agent + AWS + Highly Regulated
  await vp.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(800);

  await vp.getByRole('tab', { name: 'Score Breakdown' }).click();
  await sleep(800);

  await selectField(vp, 'Workload Type').click();
  await sleep(500);
  await vp.getByRole('option', { name: /Agent Workflow/i }).click();
  await sleep(1000);

  await selectField(vp, 'Data Gravity').click();
  await sleep(500);
  await vp.getByRole('option', { name: /Amazon Web Services/i }).click();
  await sleep(1000);

  await selectField(vp, 'Security Level').click();
  await sleep(500);
  await vp.getByRole('option', { name: /Highly Regulated/i }).click();
  await sleep(1000);

  await selectField(vp, 'Deployment Preference').click();
  await sleep(500);
  await vp.getByRole('option', { name: /Infrastructure Control/i }).click();
  await sleep(1000);

  await selectField(vp, 'Governance Requirement').click();
  await sleep(500);
  await vp.getByRole('option', { name: /High/i }).click();
  await sleep(2000);

  // Show updated scores and radar
  await vp.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
  await sleep(2000);

  // Quick browse updated architecture and risks
  await vp.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(500);
  await vp.getByRole('tab', { name: 'Architecture' }).click();
  await sleep(2500);

  await vp.getByRole('tab', { name: 'Risk Alerts' }).click();
  await sleep(2000);

  // Switch to Multimodal + Google + Enterprise
  await vp.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(500);

  await selectField(vp, 'Workload Type').click();
  await sleep(500);
  await vp.getByRole('option', { name: /Multimodal AI/i }).click();
  await sleep(800);

  await selectField(vp, 'Data Gravity').click();
  await sleep(500);
  await vp.getByRole('option', { name: /Google Cloud/i }).click();
  await sleep(800);

  await selectField(vp, 'Security Level').click();
  await sleep(500);
  await vp.getByRole('option', { name: /Enterprise/i }).click();
  await sleep(1000);

  await vp.getByRole('tab', { name: 'Score Breakdown' }).click();
  await sleep(2000);
  await vp.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
  await sleep(2000);

  // Demo button
  await vp.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(1000);
  const demoBtn = vp.locator('button:has-text("Demo")');
  if (await demoBtn.count() > 0) {
    await demoBtn.first().click();
    await sleep(3000);
  }

  // Final scroll to show export
  await vp.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await sleep(2000);

  await vp.close();
  await vCtx.close();
  console.log('── Video recorded ──');

  await browser.close();

  // Rename video file
  const { readdirSync, renameSync } = await import('fs');
  const demoDir = path.join(PROJECT, 'public', 'demo');
  const videos = readdirSync(demoDir).filter(f => f.endsWith('.webm'));
  if (videos.length > 0) {
    const src = path.join(demoDir, videos[videos.length - 1]);
    const dest = path.join(demoDir, 'demo_walkthrough.webm');
    renameSync(src, dest);
    console.log(`✓ Video saved: public/demo/demo_walkthrough.webm`);
  }

  console.log('\n✅ All assets captured!');
  console.log(`Screenshots: public/screenshots/`);
  console.log(`Video: public/demo/demo_walkthrough.webm`);
}

main().catch(err => { console.error(err); process.exit(1); });
