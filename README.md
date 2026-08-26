# Enterprise Educacional

Plataforma educacional estática, responsiva e interativa para aprender desenvolvimento e programação com aulas extensas, exemplos, exercícios, desafios, projetos, progresso local, Glossário, Busca e Playground HTML/CSS/JavaScript/Python.

## Conteúdo atual

- **HTML:** 12 módulos e 164 aulas/conteúdos;
- **CSS:** 18 módulos e 195 aulas/conteúdos;
- **JavaScript:** 25 módulos e 262 aulas/conteúdos;
- **Python:** 24 módulos e 202 aulas/conteúdos;
- **Total:** 823 aulas/conteúdos em 79 módulos;
- **Exercícios:** 291;
- **Desafios:** 24;
- **Projetos:** 31;
- **Glossário:** 74 termos.

## Experiência premium

A interface foi refinada para usar uma escala mais rica de preto, grafite, cinza e prata no Dark Mode e branco suave, off-white e cinzas neutros no Light Mode. O layout continua desktop-first, mas adapta grids, navegação, aulas, exercícios, projetos e Playground para tablet e celular.

Principais melhorias atuais:

- Home com hierarquia mais forte, painel de código, métricas reais e recomendação de próximo passo;
- cards diferentes para trilhas, recursos, projetos e desafios, sem repetir a mesma composição em todo o produto;
- Header com estado ativo, Busca central e atalho **Ctrl/Cmd + K**;
- Trilhas alimentadas pelos 823 conteúdos reais e com próximo conteúdo/progresso por tecnologia;
- Sistema de aulas usando `content-data.js`, sidebar organizada por módulos, índice contextual, tempo estimado, conteúdo aprofundado, Glossário contextual, **modo foco, aulas salvas, notas por aula**, atalhos Alt+←/→ e navegação anterior/próxima;
- exercícios com tentativas persistidas, status de conclusão e feedback educacional;
- projetos com checklist persistente, progresso por etapas, critérios de conclusão e extensões;
- desafios com requisitos, dicas progressivas, solução oficial e conclusão persistente;
- Playground com HTML/CSS/JavaScript e **Python 3 real via Pyodide**, presets Web/Python, console/terminal recolhível, `stdin` para `input()`, carregamento automático de pacotes compatíveis, persistência, linhas numeradas, status do editor, preview desktop/tablet/mobile, **execução do resultado em tela cheia**, modo de editor em tela cheia, tabs acessíveis, `Ctrl/Cmd + Enter`, `Ctrl/Cmd + S`, autoindentação e redimensionamento entre editor e resultado no desktop;
- Glossário redesenhado com busca, filtros por categoria e letra, contagem de resultados, navegação visual, aulas relacionadas, termos relacionados e cópia rápida de definição;
- Progresso com visão geral, progresso por trilha, sequência de estudo, atividade recente, recomendação, aulas salvas e conquistas discretas;
- 404 integrada à identidade do produto;
- estados vazios mais úteis e foco visível em componentes interativos.

## Integração do aprendizado

- Trilhas → Módulos → Aulas utilizam a mesma base de dados;
- concluir aulas afeta progresso por trilha e progresso geral;
- exercícios, projetos e desafios também entram no progresso geral;
- aulas HTML/CSS/JavaScript com configuração de editor e exemplos Python podem abrir o código diretamente no Playground;
- Glossário referencia aulas relacionadas;
- Busca global indexa trilhas, módulos, aulas, exercícios, desafios, projetos e Glossário.

## Branding

Assets principais:

- `assets/branding/enterprise-symbol.png` — símbolo usado no Header/Footer, extraído diretamente da opção 1 aprovada
- `assets/branding/enterprise-symbol.svg` — compatibilidade vetorial/raster encapsulada
- `assets/branding/enterprise-logo-horizontal.svg`
- `assets/branding/favicon-16.png` / `favicon-32.png` / `apple-touch-icon.png` — favicons derivados da mesma referência

## Estrutura

- `index.html` — estrutura global e áreas principais;
- `styles.css` — Design System, Dark/Light, componentes e responsividade;
- `content-data.js` — currículo completo, aulas, exercícios, desafios, projetos e Glossário;
- `app.js` — roteamento hash, renderização, persistência, progresso, Busca, Glossário, mecânicas das aulas e Playground Web/Python;
- `assets/branding/` — identidade vetorial e favicon.

## Executar localmente

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

Não existe etapa de build: o projeto é entregue como HTML/CSS/JavaScript estático e é compatível com hospedagem estática, incluindo GitHub Pages.


## Editor Python

A aba Python usa **Pyodide 0.27.7** carregado sob demanda a partir do CDN oficial via jsDelivr. O código roda em um Web Worker separado da interface. A primeira execução precisa de conexão com a internet para baixar o runtime; depois o Worker permanece carregado durante a sessão.

Recursos atuais:

- Python 3 no navegador;
- `print()` em terminal próprio;
- erros e `stderr` no mesmo terminal;
- `input()` usando o painel de `stdin`;
- imports de pacotes compatíveis com Pyodide carregados automaticamente quando possível;
- botão para interromper a execução encerrando o Worker;
- exemplos Python das aulas podem abrir diretamente no Playground.

## Refinamentos recentes

- console do Playground pode ser ocultado e reaberto sem perder a saída;
- mensagens recebidas enquanto o console está recolhido geram um contador discreto;
- o botão **Tela cheia** executa o código e abre somente o resultado (ou o terminal Python) em fullscreen;
- o editor mantém uma opção separada de tela cheia para quem quiser programar com mais espaço;
- o Glossário ganhou filtros por categoria, lista mais legível e uma página de termo mais rica;
- o símbolo e favicon agora usam a própria opção 1 aprovada como base visual, sem reinterpretar o desenho em outro símbolo.


## Atualizações recentes

- contraste do Light Mode reforçado para telas com brilho alto; superfícies agora usam uma escala quente de creme, bege e cinza-amarronzado sem perder a identidade neutra

- correção de regressão: `app.js` e `styles.css` foram restaurados para a versão completa que usa `content-data.js`, mantendo Python, console recolhível, fullscreen de resultado, Glossário avançado e todas as mecânicas premium.

- `assets/branding/enterprise-symbol-light.png` — versão do ícone para Light Mode
- `assets/branding/favicon-light-16.png` / `favicon-light-32.png` / `apple-touch-icon-light.png` — favicons específicos do tema claro

- transição suave entre Dark e Light Mode, incluindo superfícies, textos, bordas, controles e troca animada do símbolo da marca


## Correção v13

- restaurada a base completa do site (editor Python, Playground, Glossário, progresso e seletor de modelos)
- corrigido o layout global e o tamanho da marca
- animação Sol/Lua refeita sem troca de orientação
- paleta clara neutra v11 mantida sobre a base completa


## Refinamento v15

- progresso discreto de leitura nas aulas
- busca dentro da navegação de cursos longos
- índice da aula acompanha a seção atual
- módulos extras nas Trilhas ficam recolhíveis
- Busca global agrupada por tipo de conteúdo e com debounce
- Glossário em mobile usa fluxo lista → detalhe → voltar
- stdin do Python só aparece quando o código usa `input()`
- resultado em tela cheia mostra uma dica temporária de saída
- refinamentos de hierarquia sem adicionar novas áreas pesadas


## Ajuste v16 — Playground Python

- ao selecionar Python, o painel de Resultado é substituído por um Terminal Python
- a prévia visual e os controles Desktop/Tablet/Mobile ficam ocultos em Python
- o console ocupa toda a coluna direita e não pode ser recolhido em Python
- a ação de tela cheia passa a mostrar somente a saída textual do Python
- HTML/CSS/JavaScript continuam com Resultado visual + Console recolhível


## Ajuste v17 — Glossário

- filtros de categoria e letra separados em grupos próprios
- correção de sobreposição entre “Todos” e a letra A em telas estreitas
- contador de termos movido para o cabeçalho do filtro
- chips e alfabeto com rolagem horizontal independente
- lista com espaçamento e scrollbar refinados
- mobile reorganizado para evitar colisões visuais


## Ajuste v18 — Glossário

- filtros de Categoria e Inicial agora exibem barra horizontal visível
- roda vertical do mouse move horizontalmente os filtros enquanto o cursor está sobre eles
- ao chegar ao começo/fim horizontal, a roda volta a rolar a página normalmente

## Refinamento visual

- hierarquia visual mais consistente em Home, Trilhas, Aula, Playground, Glossário e Progresso
- tipografia e espaçamentos recalibrados para desktop e mobile
- cards menos pesados e com superfícies mais claras
- Light Mode com separação maior entre fundo, superfície e borda
- Playground tratado como workspace, com chrome mais compacto
- Glossário com painel de navegação mais limpo e detalhe mais editorial


## Refinamento v20

- hierarquia visual e espaçamentos recalibrados em Home, páginas internas e cards
- navegação mobile reforçada com Escape, clique externo e fechamento automático
- índice "Nesta aula" corrigido em telas intermediárias/mobile e mantido acessível durante a leitura
- controles do Playground endurecidos contra overflow e abas com rolagem horizontal por mouse
- Glossário com indicação de conteúdo horizontal adicional, scroll snap e estados de overflow
- busca, aula e glossário com melhor quebra de texto e estabilidade em telas estreitas
- Light Mode com separação mais clara de superfícies sem abandonar a paleta neutra
- ajustes específicos para 1260, 900, 620 e 430 px

## Aprendizado adaptativo

Esta atualização adiciona mecânicas focadas em aprendizado real:

- fila de revisão inteligente baseada em erros e tentativas;
- sessões rápidas de 10 exercícios;
- domínio por módulo calculado com aulas, exercícios, erros e checkpoints;
- checkpoints curtos de módulo;
- recomendações de revisão, prática e projeto na Home;
- ligação direta Aula → Exercícios relacionados → Playground;
- indicador de preparo e pré-requisitos nos projetos;
- histórico local de versões do código no Playground com restauração.

## Editor inteligente do Playground

Esta atualização transforma o editor do Playground em um ambiente mais próximo de IDEs conhecidas, sem perder o foco educacional:

- diagnóstico de erros e avisos em tempo real para HTML, CSS, JavaScript e Python;
- marcação da linha com problema no gutter e no editor;
- painel de problemas com “Explique este erro”, navegação até a linha e Quick Fix quando a correção é segura;
- correções rápidas para casos como `:` ausente no Python, símbolos sem par, `alt` ausente em imagens e tags HTML abertas;
- autocomplete com descrição, snippets e símbolos definidos pelo próprio aluno;
- `Ctrl/⌘ + Espaço` para abrir sugestões manualmente;
- fechamento automático de `()`, `[]`, `{}`, aspas e tags HTML;
- indentação inteligente, Tab/Shift+Tab e Enter entre pares de chaves;
- coloração de sintaxe no editor;
- destaque da linha atual, pares de chaves e ocorrências do texto selecionado;
- guias de indentação apenas nas linhas realmente indentadas;
- documentação curta ao passar o mouse sobre termos comuns;
- botão Formatar e atalho `Alt + Shift + F`;
- comentar/descomentar com `Ctrl/⌘ + /`;
- busca dentro do arquivo com `Ctrl/⌘ + F`;
- estado `hidden` corrigido para controles contextuais, incluindo Parar e viewports no modo Python.


## Playground — códigos salvos

- botão Salvar permite escolher HTML, CSS, JavaScript e/ou Python
- nomeia projetos e persiste em IndexedDB, com fallback local
- Meus códigos permite abrir, buscar, renomear, duplicar e excluir
- abrir um projeto substitui somente as linguagens salvas; as demais são preservadas
- Ctrl/Cmd+S atualiza rapidamente o projeto aberto quando a linguagem atual faz parte dele
- histórico automático continua separado dos projetos salvos
- botão de tela cheia do editor fica sempre como a última ação da toolbar


## Ajuste de toolbar do Playground

- abas de linguagem e ações do editor deixam de disputar a mesma linha quando o painel está dividido
- ações passam para uma segunda faixa quando a largura real do editor é menor
- textos não quebram em duas linhas
- tela cheia permanece sempre como a última ação e fica acessível no fim da faixa


## Ajuste de abertura de códigos salvos

Ao abrir um projeto em **Meus códigos**, o Playground agora limpa HTML, CSS, JavaScript e Python antes de restaurar o projeto. Assim, somente as linguagens realmente salvas naquele projeto permanecem preenchidas. O conteúdo anterior continua protegido pelo Histórico automático com um snapshot criado antes da troca.


## Ajuste de interface do Playground

- toolbar simplificada com ações principais visíveis e menu Mais para ações secundárias
- tela cheia permanece como último controle
- status bar reduzida às informações realmente úteis
- cabeçalho do Resultado mais limpo
- indicador azul de correspondência de símbolos removido


## Presets escuros
- Todos os presets Web prontos agora iniciam com fundo grafite escuro e superfícies escuras.
- Cards, formulários e contador foram adaptados para texto claro e bordas discretas.
- O Resultado também usa canvas escuro durante o carregamento, evitando flash branco.
- O usuário continua livre para mudar as cores pelo CSS.


## Ajustes de Playground

- botão Executar removido do cabeçalho do Playground e movido para a barra do Resultado como botão de play ao lado de Desktop/Tablet/Mobile
- botão Parar do Python acompanha a área de execução
- Console agora respeita o Light Mode em vez de permanecer preto
- Terminal Python também acompanha a paleta clara quando o site estiver no Light Mode


## Ajuste do Glossário

- removidos os indicadores visuais em forma de seta à direita dos filtros de Categoria e Inicial
- barras de rolagem horizontal e rolagem pelo mouse/trackpad foram mantidas

## Refinamento explicativo

As aulas agora destacam objetivos de aprendizagem, comparações lado a lado quando pertinentes, explicação linha por linha de exemplos de código, erros comuns em seção própria e um resumo final com checklist do que o aluno deve conseguir fazer antes de avançar.


## Ajuste de notas da aula

- Corrigida a área “Minhas notas” para separar título, descrição e ícone.
- Removido o marcador nativo do details e adicionado chevron consistente com o restante da interface.
- Melhorados espaçamento, responsividade e estado aberto/fechado.


## Refinamento de aula
- cabeçalho inicial da aula reorganizado
- ações Salvar aula e Modo foco viraram controles consistentes
- metadados de módulo/aula/tempo agrupados
- Minhas notas redesenhado com hierarquia, textarea e status mais limpos


## Correção de links automáticos do Glossário

- termos do glossário agora só viram links quando aparecem como palavras ou expressões completas
- abreviações como `DOM` não quebram palavras maiores como `domínio`
- evita botões aleatórios dentro de textos das aulas


## Ajuste de interface da aula

- Removidos os controles **Salvar aula** e **Modo foco** do topo da aula.
- Removidos os indicadores **Módulo**, **Aula** e **Leitura** que deixavam o início carregado.
- Mantido apenas o breadcrumb discreto de navegação antes do título da aula.


## Ajuste de navegação das aulas

- aumentada a distância entre a linha vertical e os textos do bloco “Nesta aula” em todas as aulas;
- em layouts horizontais (tablet/mobile), a linha vertical foi removida para evitar ruído visual.


## Ajuste atual

- Área Minhas notas simplificada e reorganizada.
- Removidos rótulos redundantes que ficavam colados no HTML standalone.
- Cabeçalho, textarea, status de salvamento e contador receberam layout próprio.
- HTML standalone reconstruído com o CSS completo na posição correta.


## Ajuste da Home

- removida a causa da rolagem horizontal na Home; os fundos decorativos das seções agora respeitam a largura real do container em vez de usar `100vw`.

## Refinamentos atuais

Esta rodada prioriza utilidade e robustez, sem adicionar gamificação superficial.

- Meus códigos agora permite exportar cada projeto como ZIP com arquivos reais (`index.html`, `style.css`, `script.js`, `main.py`) e metadados do projeto.
- A biblioteca permite importar o ZIP exportado pelo site ou selecionar arquivos HTML, CSS, JavaScript e Python diretamente.
- A página Progresso ganhou backup completo dos dados locais: progresso, notas, checkpoints, histórico e estado do Playground, além dos projetos salvos no IndexedDB/fallback local.
- O backup completo pode ser restaurado pelo próprio site após confirmação explícita.
- A Home consolidou “Continue daqui”, revisão, prática rápida e projeto recomendado em uma única área mais simples.
- Aulas e componentes longos receberam contenção local para URLs, código, tabelas e conteúdo extenso, reduzindo risco de overflow lateral.
- Foram adicionados ajustes específicos para 430 px e 390 px em Home, Aula, Exercícios, Playground, Glossário, Projetos e biblioteca de códigos.
- CSS antigo de uma interface de cabeçalho de aula já removida foi excluído, junto do estado morto de favoritos que não possuía mais interface.


## Aprimoramentos v41

- PWA instalável quando publicado em HTTPS, com cache offline do conteúdo e runtime-cache do Pyodide após o primeiro uso.
- Sincronização opcional em nuvem via Supabase, com autenticação por e-mail e backup completo por usuário.
- Verificação automática de projetos com testes objetivos sobre HTML, CSS, JavaScript e Python.
- Verificação geral do código atual no Playground.
- Histórico de estudo em 12 semanas com calendário de atividade.
- Busca tolerante a pequenos erros de digitação.
- Referências oficiais no fim das aulas.
- Recuperação adicional de rascunho do Playground.
- Pipeline de CI para sintaxe, integridade de conteúdo, assets e estrutura.
- Projeto dividido em CSS, dados, núcleo, recursos de plataforma e bootstrap, mantendo também um HTML único para teste.

A sincronização em nuvem exige que o proprietário configure um projeto Supabase. Consulte `SUPABASE_SETUP.md` e `supabase/schema.sql`.


## Ajuste do Progresso

- Domínio por assunto usa quatro colunas em telas largas, evitando um quarto card isolado na linha seguinte.
- As quatro trilhas aparecem juntas em uma linha no desktop largo.
- Atividade recente e Próximo passo ocupam uma segunda linha equilibrada.
- Cards de trilha ficaram mais compactos e mantêm adaptação em notebook, tablet e celular.


## Refinamento do Progresso — v43

- Tela de Progresso reorganizada para responder primeiro “o que estudar agora?”.
- Removida duplicação visual entre módulos zerados e cards de trilha.
- Módulos aparecem em “Em andamento” somente depois de realmente iniciados.
- Trilhas ganharam cards compactos com estado, próxima etapa e ação clara.
- Projetos em andamento aparecem apenas quando alguma etapa foi marcada.
- Histórico recente foi integrado ao calendário de estudo.
- Backup, nuvem e instalação foram movidos para um bloco secundário recolhível.
- Estado inicial com 0% ganhou orientação explícita para a primeira aula.
- Responsividade específica para desktop, tablet, 760px e 430px.

## Consolidação de qualidade — v44

Esta rodada fecha os principais pontos de melhoria que ainda faltavam sem transformar o site em uma interface mais carregada.

- Trilhas ganharam **Mapa da trilha** com módulos concluídos, módulo atual e próximos módulos, além de links diretos para continuar estudando.
- Cards de trilha foram simplificados para evitar repetição do mapa e reduzir poluição visual.
- Revisão inteligente passou a usar **revisão espaçada**: erros voltam mais cedo e acertos consecutivos aumentam gradualmente o intervalo de revisão.
- Busca global ganhou histórico local, atalhos quando vazia, expansão de grupos e sugestão para pequenas digitações incorretas.
- Verificador de projetos/código agora identifica melhor a linguagem relacionada ao requisito que falhou e oferece **Corrigir no editor** para abrir diretamente a aba adequada.
- Sincronização Supabase ganhou modo automático opcional, debounce e detecção de conflito entre dados locais e backup remoto antes de sobrescrever conteúdo.
- Trilhas concluídas podem liberar **certificado**, desde que também atendam critérios mínimos de prática, checkpoints e projeto.
- Adicionado link de acessibilidade “Pular para o conteúdo principal”.
- Sidebar mobile das aulas e popover do Glossário receberam comportamento consistente de `Esc`, clique fora e mudança de rota.
- Search index passou a armazenar textos normalizados previamente, reduzindo trabalho repetido durante a digitação.
- CI/validação agora também verifica IDs de exercícios/projetos/desafios, vínculos de exercícios com aulas, manifest PWA, versões de cache, breakpoints principais e ausência de `overflow-x:hidden` global usado para mascarar bugs.
- Gerados relatórios `reports/CONTENT_AUDIT_V44.md` e `reports/QA_V44.md`.
- Criado `scripts/build-standalone.py` para reconstruir de forma reproduzível o `Enterprise-Educacional.html` autossuficiente.

A sincronização em nuvem continua dependendo de um projeto Supabase configurado pelo proprietário. A v44 não inclui credenciais privadas nem um backend de terceiros pré-configurado.


## Correção de ícones — v46

- corrigida a geração do HTML único: o cache-busting `?v=...` não é mais anexado aos data URIs de branding/favicons;
- adicionada camada de compatibilidade para ícones SVG internos, evitando falhas de `<use href="#..."><\/use>` ao abrir o HTML como arquivo local em navegadores mais restritivos;
- os ícones continuam acompanhando Dark/Light Mode e controles dinâmicos.

## Refinamento de produto — v46

Esta revisão prioriza consistência e maturidade visual sem adicionar novas mecânicas. Foram recalibrados Home, Header, Trilhas, Aula, Exercícios, Projetos, Desafios, Playground, Glossário, Progresso, Footer e breakpoints intermediários/mobile. O roteador também passa a identificar a página ativa em `body[data-page]`, permitindo ajustes futuros sem seletores globais frágeis.
