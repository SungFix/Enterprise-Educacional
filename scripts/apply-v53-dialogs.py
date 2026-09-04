from pathlib import Path
import re

app_path = Path('app.js')
app = app_path.read_text(encoding='utf-8')

helper_anchor = "const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];\n"
helper = r'''

let eeActionDialogResolve = null;
let eeActionDialogMode = 'confirm';
let eeActionDialogPreviousFocus = null;

function ensureEeActionDialog() {
  let dialog = $('#eeActionDialog');
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.id = 'eeActionDialog';
  dialog.className = 'saved-code-dialog';
  dialog.style.width = 'min(560px, calc(100vw - 28px))';
  dialog.setAttribute('aria-labelledby', 'eeActionDialogTitle');
  dialog.setAttribute('aria-describedby', 'eeActionDialogMessage');
  dialog.innerHTML = `<div class="saved-code-modal">
    <div class="saved-code-dialog-head"><div><span class="detail-kicker" id="eeActionDialogKicker">Confirmação</span><strong id="eeActionDialogTitle">Confirmar ação</strong><p id="eeActionDialogMessage"></p></div><button class="icon-button" id="eeActionDialogClose" type="button" aria-label="Fechar"><svg class="ui-icon"><use href="#icon-close"></use></svg></button></div>
    <div class="saved-code-dialog-body" id="eeActionDialogBody" hidden><label class="saved-code-name"><span id="eeActionDialogInputLabel">Valor</span><input id="eeActionDialogInput" type="text" autocomplete="off" /></label></div>
    <div class="saved-code-dialog-actions"><span></span><span></span><button class="button secondary" id="eeActionDialogCancel" type="button">Cancelar</button><button class="button primary" id="eeActionDialogConfirm" type="button">Confirmar</button></div>
  </div>`;
  document.body.append(dialog);

  const finish = result => {
    if (!dialog.open) return;
    const resolve = eeActionDialogResolve;
    eeActionDialogResolve = null;
    dialog.close();
    const previous = eeActionDialogPreviousFocus;
    eeActionDialogPreviousFocus = null;
    if (previous?.isConnected) requestAnimationFrame(() => previous.focus({ preventScroll:true }));
    resolve?.(result);
  };
  dialog._eeFinish = finish;
  $('#eeActionDialogClose', dialog)?.addEventListener('click', () => finish(eeActionDialogMode === 'prompt' ? null : false));
  $('#eeActionDialogCancel', dialog)?.addEventListener('click', () => finish(eeActionDialogMode === 'prompt' ? null : false));
  $('#eeActionDialogConfirm', dialog)?.addEventListener('click', () => {
    const input = $('#eeActionDialogInput', dialog);
    finish(eeActionDialogMode === 'prompt' ? (input?.value ?? '') : true);
  });
  $('#eeActionDialogInput', dialog)?.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); $('#eeActionDialogConfirm', dialog)?.click(); }
  });
  dialog.addEventListener('cancel', event => {
    event.preventDefault();
    finish(eeActionDialogMode === 'prompt' ? null : false);
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) finish(eeActionDialogMode === 'prompt' ? null : false);
  });
  return dialog;
}

function eeOpenActionDialog(options = {}) {
  const dialog = ensureEeActionDialog();
  if (dialog.open) dialog._eeFinish?.(eeActionDialogMode === 'prompt' ? null : false);
  eeActionDialogMode = options.mode === 'prompt' ? 'prompt' : 'confirm';
  eeActionDialogPreviousFocus = document.activeElement;
  const tone = options.tone === 'danger' ? 'danger' : 'default';
  const body = $('#eeActionDialogBody', dialog);
  const input = $('#eeActionDialogInput', dialog);
  const confirmButton = $('#eeActionDialogConfirm', dialog);
  $('#eeActionDialogKicker', dialog).textContent = options.kicker || (tone === 'danger' ? 'Atenção' : (eeActionDialogMode === 'prompt' ? 'Editar' : 'Confirmação'));
  $('#eeActionDialogTitle', dialog).textContent = options.title || (eeActionDialogMode === 'prompt' ? 'Digite um valor' : 'Confirmar ação');
  $('#eeActionDialogMessage', dialog).textContent = options.message || '';
  $('#eeActionDialogCancel', dialog).textContent = options.cancelLabel || 'Cancelar';
  confirmButton.textContent = options.confirmLabel || (eeActionDialogMode === 'prompt' ? 'Salvar' : 'Confirmar');
  confirmButton.className = tone === 'danger' ? 'button danger-ghost' : 'button primary';
  body.hidden = eeActionDialogMode !== 'prompt';
  if (eeActionDialogMode === 'prompt') {
    $('#eeActionDialogInputLabel', dialog).textContent = options.inputLabel || 'Valor';
    input.value = String(options.value ?? '');
    input.placeholder = options.placeholder || '';
    input.maxLength = Number(options.maxLength || 120);
  }
  return new Promise(resolve => {
    eeActionDialogResolve = resolve;
    dialog.showModal();
    requestAnimationFrame(() => {
      if (eeActionDialogMode === 'prompt') { input.focus(); input.select(); }
      else confirmButton.focus();
    });
  });
}

function eeConfirm(message, options = {}) {
  return eeOpenActionDialog({ ...options, mode:'confirm', message });
}
function eePrompt(message, defaultValue = '', options = {}) {
  return eeOpenActionDialog({ ...options, mode:'prompt', message, value:defaultValue });
}
window.eeConfirm = eeConfirm;
window.eePrompt = eePrompt;
'''
if 'function ensureEeActionDialog()' not in app:
    if helper_anchor not in app:
        raise SystemExit('Anchor inicial do app.js não encontrado')
    app = app.replace(helper_anchor, helper_anchor + helper, 1)

replacements = [
    ("const overwrite = confirm(`Já existe um projeto chamado “${sameName.name}”. Deseja substituir esse projeto?`);", "const overwrite = await eeConfirm(`Já existe um projeto chamado “${sameName.name}”. Se continuar, o projeto salvo será substituído.`, { title:'Substituir projeto?', confirmLabel:'Substituir', tone:'danger' });"),
    ("const ok = confirm(`Abrir “${project.name}”? Todo o código atualmente aberto no Playground será limpo. Depois, somente ${savedLabels || 'as linguagens salvas'} deste projeto serão carregadas.`);", "const ok = await eeConfirm(`O código atualmente aberto será limpo. Depois, somente ${savedLabels || 'as linguagens salvas'} de “${project.name}” serão carregadas.`, { title:'Abrir projeto salvo?', confirmLabel:'Abrir projeto' });"),
    ("if (!confirm(`Excluir “${project.name}” dos seus códigos salvos? Essa ação não apaga o código que está aberto no editor.`)) return;", "if (!await eeConfirm(`“${project.name}” será removido dos seus códigos salvos. O código aberto no editor não será apagado.`, { title:'Excluir projeto?', confirmLabel:'Excluir', tone:'danger' })) return;"),
    ("if (!confirm('Restaurar este backup? O progresso, notas, histórico e projetos salvos atuais deste navegador serão substituídos.')) return;", "if (!await eeConfirm('O progresso, notas, histórico e projetos salvos atuais deste navegador serão substituídos.', { title:'Restaurar backup?', confirmLabel:'Restaurar', tone:'danger' })) return;"),
    ("const name = prompt('Novo nome do projeto:', project.name)?.trim();", "const name = (await eePrompt('Digite o novo nome do projeto.', project.name, { title:'Renomear projeto', inputLabel:'Nome do projeto', confirmLabel:'Renomear', maxLength:80 }))?.trim();"),
    ("const nameInput = prompt('Nome do projeto importado:', defaultName);", "const nameInput = await eePrompt('Escolha o nome usado para salvar o projeto importado.', defaultName, { title:'Nome do projeto importado', inputLabel:'Nome do projeto', confirmLabel:'Importar', maxLength:80 });"),
    ("$('#clearPlaygroundHistory')?.addEventListener('click', () => {\n    if (!(state.playgroundHistory || []).length) return;\n    if (!confirm('Limpar as versões salvas do Playground?')) return;", "$('#clearPlaygroundHistory')?.addEventListener('click', async () => {\n    if (!(state.playgroundHistory || []).length) return;\n    if (!await eeConfirm('As versões salvas automaticamente no Histórico do Playground serão apagadas.', { title:'Limpar histórico?', confirmLabel:'Limpar histórico', tone:'danger' })) return;"),
    ("$('#clearEditor').addEventListener('click', () => {\n    if (!$('#codeEditor').value || confirm(`Limpar o código da aba ${languageLabel(activeLang)}?`)) {", "$('#clearEditor').addEventListener('click', async () => {\n    if (!$('#codeEditor').value || await eeConfirm(`O código da aba ${languageLabel(activeLang)} será apagado.`, { title:'Limpar editor?', confirmLabel:'Limpar', tone:'danger' })) {"),
    ("$('#clearAllEditors').addEventListener('click', () => {\n    syncPlaygroundBuffer();\n    const languages = ['html', 'css', 'js', 'python'];\n    const hasCode = languages.some(lang => String(pg[lang] || '').trim());\n    if (hasCode && !confirm('Limpar todos os editores? HTML, CSS, JavaScript e Python serão apagados.')) return;", "$('#clearAllEditors').addEventListener('click', async () => {\n    syncPlaygroundBuffer();\n    const languages = ['html', 'css', 'js', 'python'];\n    const hasCode = languages.some(lang => String(pg[lang] || '').trim());\n    if (hasCode && !await eeConfirm('HTML, CSS, JavaScript e Python serão apagados de uma vez. Uma versão será mantida no Histórico antes da limpeza.', { title:'Limpar todos os editores?', confirmLabel:'Limpar tudo', tone:'danger' })) return;"),
    ("presetSelect.addEventListener('change', () => {\n    const preset = playgroundPresets[presetSelect.value];\n    if (!preset) return;\n    const previousPreset = state.playgroundPreset || 'default';\n    const shouldReplace = confirm(`Carregar “${presetDisplayTitle(preset)}”? O código atual do Playground será substituído.`);", "presetSelect.addEventListener('change', async () => {\n    const preset = playgroundPresets[presetSelect.value];\n    if (!preset) return;\n    const previousPreset = state.playgroundPreset || 'default';\n    const shouldReplace = await eeConfirm(`O código atual do Playground será substituído pelo modelo “${presetDisplayTitle(preset)}”.`, { title:'Carregar modelo?', confirmLabel:'Carregar modelo' });"),
    ("$('#resetProgress').addEventListener('click', () => {\n    if (!confirm('Redefinir todo o progresso salvo neste navegador? A ação apagará aulas, exercícios, projetos e desafios concluídos.')) return;", "$('#resetProgress').addEventListener('click', async () => {\n    if (!await eeConfirm('Aulas, exercícios, projetos e desafios concluídos neste navegador serão redefinidos.', { title:'Redefinir progresso?', confirmLabel:'Redefinir', tone:'danger' })) return;")
]
for old, new in replacements:
    if old not in app:
        raise SystemExit(f'Trecho esperado não encontrado no app.js: {old[:90]}')
    app = app.replace(old, new, 1)
app_path.write_text(app, encoding='utf-8')

platform_path = Path('platform-features.js')
platform = platform_path.read_text(encoding='utf-8')
platform_replacements = [
    ("if (confirmReplace && !confirm('Restaurar esses dados? O progresso, notas, histórico e projetos salvos deste dispositivo serão substituídos.')) return false;", "if (confirmReplace && !await eeConfirm('O progresso, notas, histórico e projetos salvos deste dispositivo serão substituídos.', { title:'Restaurar dados?', confirmLabel:'Restaurar', tone:'danger' })) return false;"),
    ("if (!confirm(`Restaurar o backup da nuvem${row.updated_at ? ` de ${new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(row.updated_at))}` : ''}? Os dados locais serão substituídos.`)) return;", "if (!await eeConfirm(`Os dados locais serão substituídos${row.updated_at ? ` pelo backup de ${new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(row.updated_at))}` : ' pelo backup salvo na nuvem'}.`, { title:'Restaurar backup da nuvem?', confirmLabel:'Restaurar', tone:'danger' })) return;")
]
for old, new in platform_replacements:
    if old not in platform:
        raise SystemExit(f'Trecho esperado não encontrado no platform-features.js: {old[:90]}')
    platform = platform.replace(old, new, 1)
platform = platform.replace('/* Epoch Education — platform features v50', '/* Epoch Education — platform features v53', 1)
platform = platform.replace('appVersion:50', 'appVersion:53', 1)
platform = platform.replace("service-worker.js?v=50", "service-worker.js?v=53", 1)
platform_path.write_text(platform, encoding='utf-8')

index_path = Path('index.html')
index = index_path.read_text(encoding='utf-8')
index = index.replace('?v=50', '?v=53').replace('?v=52', '?v=53')
index_path.write_text(index, encoding='utf-8')

worker_path = Path('service-worker.js')
worker = worker_path.read_text(encoding='utf-8')
worker = worker.replace('v50', 'v53').replace('?v=50', '?v=53').replace('?v=52', '?v=53')
worker_path.write_text(worker, encoding='utf-8')

build_path = Path('scripts/build-standalone.py')
build = build_path.read_text(encoding='utf-8')
build = build.replace('data-build="50"', 'data-build="53"', 1)
build_path.write_text(build, encoding='utf-8')

validator_path = Path('scripts/validate.mjs')
validator = validator_path.read_text(encoding='utf-8')
validator = validator.replace("/appVersion\\s*:\\s*50/.test(platformSource)", "/appVersion\\s*:\\s*53/.test(platformSource)", 1)
validator = validator.replace("'Versão de backup não atualizada para v50'", "'Versão de backup não atualizada para v53'", 1)
native_anchor = "const workerSource = read('service-worker.js');\n"
native_check = """const nativeDialogPattern = /(?<![\\w.])(?:window\\.)?(?:confirm|alert|prompt)\\s*\\(/g;\nif (nativeDialogPattern.test(appSource) || nativeDialogPattern.test(platformSource)) fail('Diálogo nativo do navegador encontrado no código da interface');\nelse ok('Ações da interface usam diálogos visuais do Epoch Education');\n"""
if 'Ações da interface usam diálogos visuais do Epoch Education' not in validator:
    if native_anchor not in validator:
        raise SystemExit('Anchor do validator não encontrado')
    validator = validator.replace(native_anchor, native_anchor + native_check, 1)
validator_path.write_text(validator, encoding='utf-8')

versions_path = Path('versions/VERSOES.md')
versions = versions_path.read_text(encoding='utf-8')
versions = versions.replace('# Epoch Education — histórico completo v1 a v51', '# Epoch Education — histórico completo v1 a v53', 1)
if '- **v52 —' not in versions:
    versions = versions.rstrip() + "\n- **v52 — RELEASE** — Playground ganhou a ação Limpar tudo para apagar HTML, CSS, JavaScript e Python de uma vez, preservando uma versão no Histórico antes da limpeza.\n"
if '- **v53 —' not in versions:
    versions = versions.rstrip() + "\n- **v53 — RELEASE** — Confirmações e entradas nativas do navegador foram substituídas por diálogos próprios do Epoch Education, responsivos e alinhados aos modos Dark e Light.\n"
versions_path.write_text(versions, encoding='utf-8')

app = app_path.read_text(encoding='utf-8')
platform = platform_path.read_text(encoding='utf-8')
native = re.compile(r'(?<![\w.])(?:window\.)?(?:confirm|alert|prompt)\s*\(')
if native.search(app) or native.search(platform):
    raise SystemExit('Ainda existe diálogo nativo confirm/alert/prompt no código de interface')
for token in ['ensureEeActionDialog', 'eeConfirm', 'eePrompt', "title:'Limpar todos os editores?'", "title:'Redefinir progresso?'", "title:'Restaurar backup da nuvem?'"]:
    if token not in (app + platform):
        raise SystemExit(f'Garantia ausente: {token}')
print('Patch de diálogos visuais v53 aplicado com sucesso.')
