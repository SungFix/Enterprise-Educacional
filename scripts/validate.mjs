import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fail = message => { console.error(`ERRO: ${message}`); process.exitCode = 1; };
const ok = message => console.log(`OK: ${message}`);
const read = file => fs.readFileSync(path.join(root,file),'utf8');

for (const file of ['index.html','styles.css','content-data.js','app.js','platform-features.js','bootstrap.js','manifest.webmanifest','service-worker.js']) {
  if (!fs.existsSync(path.join(root,file))) fail(`Arquivo ausente: ${file}`);
}

const html = read('index.html');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
const duplicates = ids.filter((id,index) => ids.indexOf(id) !== index);
if (duplicates.length) fail(`IDs duplicados: ${[...new Set(duplicates)].join(', ')}`); else ok(`${ids.length} IDs únicos no HTML`);

const localRefs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]).filter(ref => !/^(?:https?:|data:|mailto:|tel:|javascript:)/.test(ref));
for (const ref of localRefs) {
  const clean = ref.split('?')[0].replace(/^\.\//,'');
  if (!clean || clean.endsWith('/')) continue;
  if (!fs.existsSync(path.join(root,clean))) fail(`Referência local ausente: ${ref}`);
}
ok('Referências locais verificadas');

const contentSource = read('content-data.js').trim();
const prefix = 'window.EE_CONTENT = ';
if (!contentSource.startsWith(prefix)) fail('content-data.js não possui o formato esperado');
let data;
try { data = JSON.parse(contentSource.slice(prefix.length).replace(/;\s*$/,'')); }
catch (error) { fail(`JSON de conteúdo inválido: ${error.message}`); }

if (data) {
  const lessons = data.lessons || [];
  const required = ['id','courseId','moduleId','moduleTitle','title','intro','objectives','explanation','deepDive','practicalContext','code','understand','errors','practice','summary','nextStep'];
  const seen = new Set();
  for (const lesson of lessons) {
    if (seen.has(lesson.id)) fail(`ID de aula duplicado: ${lesson.id}`); seen.add(lesson.id);
    for (const field of required) {
      const value = lesson[field];
      if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) fail(`Aula ${lesson.id} sem ${field}`);
    }
  }
  const lessonIds = new Set(lessons.map(l => l.id));
  for (const course of data.courses || []) for (const module of course.modules || []) for (const id of module.lessonIds || []) if (!lessonIds.has(id)) fail(`Módulo referencia aula ausente: ${id}`);
  ok(`${lessons.length} aulas auditadas`);
  ok(`${(data.exercises || []).length} exercícios · ${(data.projects || []).length} projetos · ${(data.challenges || []).length} desafios · ${(data.glossary || []).length} termos`);
}

const css = read('styles.css');
let depth = 0; for (const ch of css.replace(/\/\*[\s\S]*?\*\//g,'')) { if (ch === '{') depth++; if (ch === '}') depth--; if (depth < 0) break; }
if (depth !== 0) fail(`CSS com chaves desequilibradas (${depth})`); else ok('CSS estruturalmente balanceado');

if (/\b(?:TODO|FIXME)\b/.test(read('app.js') + read('platform-features.js'))) fail('TODO/FIXME encontrado no JavaScript');
else ok('Sem TODO/FIXME no JavaScript publicado');


// Extended integrity checks (v44)
if (data) {
  const uniqueIds = (items, label) => {
    const ids = new Set();
    for (const item of items || []) {
      if (!item?.id) { fail(`${label} sem id`); continue; }
      if (ids.has(String(item.id))) fail(`ID duplicado em ${label}: ${item.id}`);
      ids.add(String(item.id));
    }
  };
  uniqueIds(data.exercises, 'exercícios'); uniqueIds(data.projects, 'projetos'); uniqueIds(data.challenges, 'desafios');
  const lessonIds = new Set((data.lessons || []).map(item => String(item.id)));
  for (const exercise of data.exercises || []) if (exercise.relatedLessonId && !lessonIds.has(String(exercise.relatedLessonId))) fail(`Exercício ${exercise.id} referencia aula ausente: ${exercise.relatedLessonId}`);
  for (const course of data.courses || []) {
    const listed = [];
    for (const module of course.modules || []) listed.push(...(module.lessonIds || []).map(String));
    const duplicatesInsideCourse = listed.filter((id,index) => listed.indexOf(id) !== index);
    if (duplicatesInsideCourse.length) fail(`Aulas repetidas na trilha ${course.id}: ${[...new Set(duplicatesInsideCourse)].join(', ')}`);
  }
  ok('IDs e vínculos de exercícios/projetos/desafios verificados');
}

const manifest = JSON.parse(read('manifest.webmanifest'));
if (!manifest.name || !manifest.start_url || !Array.isArray(manifest.icons) || manifest.icons.length < 2) fail('Manifest PWA incompleto');
else ok('Manifest PWA verificado');

const versionSources = [html, read('app.js'), read('platform-features.js'), read('bootstrap.js'), read('service-worker.js')].join('\n');
const staleVersionRefs = [...versionSources.matchAll(/\?v=(\d+)/g)].map(match => Number(match[1])).filter(version => version < 46);
if (staleVersionRefs.length) fail(`Referências de cache antigas nos arquivos públicos: ${[...new Set(staleVersionRefs)].join(', ')}`); else ok('Referências de cache dos arquivos públicos atualizadas');

for (const breakpoint of ['430px','760px','900px']) if (!css.includes(`max-width:${breakpoint}`) && !css.includes(`max-width: ${breakpoint}`)) fail(`Breakpoint responsivo ausente: ${breakpoint}`);
else {}
ok('Breakpoints principais presentes');

if (/html\s*,?\s*body[^\{]*\{[^}]*overflow-x\s*:\s*hidden/i.test(css)) fail('overflow-x:hidden global encontrado; corrija a causa do overflow');
else ok('Sem overflow-x:hidden global mascarando layout');

if (process.exitCode) process.exit(process.exitCode);
