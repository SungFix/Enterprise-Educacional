# QA estático — v44

## Estrutura
- IDs HTML: **257**
- IDs duplicados: **0**
- Controles `aria-controls` apontando para alvo ausente: **0**
- Botões/links estáticos sem nome acessível: **0**
- Campos visíveis estáticos sem associação de rótulo: **0**
- Erros de parsing CSS: **0**
- `overflow-x: hidden` global usado para mascarar layout: **não**
- Referências de cache encontradas no HTML: **44**

## Comportamentos revisados no código
- Menu mobile fecha por `Esc`, clique fora e navegação.
- Sidebar mobile das aulas fecha por `Esc`, clique fora, resize e troca de rota.
- Popover do glossário fecha por `Esc` e clique fora.
- Busca possui debounce, histórico, correção aproximada e expansão de resultados.
- Revisão inteligente considera erro, intervalo de tempo e revisão programada.
- Sincronização automática possui espera/debounce e trava de conflito antes de enviar.
- Certificado só é liberado após critérios objetivos.
- Mapa de trilha usa links reais para aulas e estado atual/concluído.

## Limitação da revisão visual
O navegador Chromium do ambiente bloqueia páginas locais e `localhost` com `ERR_BLOCKED_BY_ADMINISTRATOR`. Por isso, a validação visual foi feita por inspeção de estrutura/CSS e pelas capturas fornecidas na conversa, não por screenshot automatizado do build v44.
