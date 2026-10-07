import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import ts from 'typescript';

const read = (path) => readFileSync(path, 'utf8');
const moduleCode = ts.transpileModule(read('src/data/tools.ts'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { tools: registry } = await import(`data:text/javascript;base64,${Buffer.from(moduleCode).toString('base64')}`);
const slugs = ['welfare-benefit-eligibility', 'year-end-tax-refund-calculator', 'loan-interest-rate-change-calculator'];
const maps = ['src/pages/index.astro', 'src/pages/tools/index.astro'].map((path) => {
  const source = ts.createSourceFile(path, read(path).split('---')[1], ts.ScriptTarget.Latest, true);
  let mapping;
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'topicBySlug' && ts.isObjectLiteralExpression(node.initializer)) {
      mapping = new Map(node.initializer.properties.filter(ts.isPropertyAssignment).map((p) => [p.name.text, p.initializer.text]));
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(mapping, `${path}: 분류 맵 없음`);
  return mapping;
});
for (const slug of slugs) {
  assert.equal(registry.filter((tool) => tool.slug === slug).length, 1, `${slug}: 등록 중복·누락`);
  for (const map of maps) assert.ok(map.has(slug), `${slug}: 목록 분류 누락`);
  const url = `https://bigyocalc.com/tools/${slug}/`;
  assert.equal(read('public/sitemap.xml').split(`<loc>${url}</loc>`).length - 1, 1, `${slug}: 사이트맵 중복·누락`);
  assert.ok(read('src/styles/app.scss').includes(slug), `${slug}: 스타일 등록 누락`);
  const html = read(`dist/tools/${slug}/index.html`);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${slug}: H1 개수`);
  assert.ok(html.includes(`href="${url}"`), `${slug}: canonical`);
  assert.ok(html.includes(`/og/tools/${slug}.png`), `${slug}: 전용 OG`);
  assert.ok(html.includes('FAQPage'), `${slug}: FAQ 스키마`);
  for (const match of html.matchAll(/href="(\/(?:tools|reports)\/[^"?#]+)"/g)) {
    const target = match[1].replace(/\/$/, '');
    assert.ok(existsSync(`dist${target}/index.html`), `${slug}: 없는 내부 링크 ${target}`);
  }
  const image = readFileSync(`public/og/tools/${slug}.png`);
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);
  console.log(`통과: ${slug} 등록·두 목록 분류·사이트맵·스타일·H1·canonical·OG·FAQ·내부 링크`);
}
