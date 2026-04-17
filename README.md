This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

---

---

---

---

---

# Prompts do Workshop — Segundo Cérebro com Claude Code

Todos os prompts usados durante o workshop, prontos para copiar e colar no Claude Code.

## DIA 1

### Demo inicial (aquecimento)

```bash
Crie um arquivo HTML com um botão que, ao clicar, mostra a data e hora atual na tela. Tema escuro, visual bonito.
```

### Prompt 1 — Estrutura base do app

```bash
Crie um app de notas pessoal chamado "Segundo Cérebro" em um único arquivo HTML.

Requisitos:
- Tema escuro, visual moderno e limpo
- Sidebar à esquerda (260px) com lista de notas
- Área principal à direita para editar a nota selecionada
- Cada nota tem: título, conteúdo (texto livre), data de criação e atualização
- Botão "Nova Nota" no topo da sidebar
- Nota selecionada fica destacada na sidebar
- Salvar automaticamente no localStorage ao digitar
- Botão para excluir nota com confirmação
- Mostrar contador de notas no rodapé da sidebar
- Emoji 🧠 no título do app
- Quando não tem nota selecionada, mostrar estado vazio com mensagem

Tudo em um único arquivo HTML com CSS e JS embutidos. Sem dependências externas.
```

### Prompt 2 — Busca e tags

```bash
Adicione ao app:

1. Campo de busca no topo da sidebar que filtra notas por título e conteúdo em tempo real
2. Sistema de tags: cada nota pode ter múltiplas tags
3. Para adicionar tag: campo de input pequeno no editor, digitar e pressionar Enter
4. Tags aparecem como chips coloridos no editor, com botão X para remover
5. Na sidebar, abaixo da busca, mostrar todas as tags existentes como chips clicáveis
6. Clicar numa tag filtra as notas que possuem aquela tag
7. Tags também aparecem na preview de cada nota na sidebar
8. Busca também encontra por tag
```

### Prompt 3 — Gravação de áudio (Groq Whisper)

```bash
Adicione um botão "🎤 Gravar Áudio" no editor de notas.

Comportamento:

1. Ao clicar, começa a gravar áudio pelo microfone do navegador (MediaRecorder API)
2. O botão muda para "⏹ Parar" com indicador visual pulsante (vermelho)
3. Ao parar, envia o áudio para a API da Groq (Whisper V3) para transcrever
4. A transcrição é adicionada automaticamente ao conteúdo da nota
5. Mostrar loading enquanto transcreve

Detalhes técnicos:

- Usar MediaRecorder com mimeType 'audio/webm'
- Endpoint: https://api.groq.com/openai/v1/audio/transcriptions
- Modelo: whisper-large-v3
- Enviar como FormData com campos: file, model, language="pt"
- Usar a mesma API key da Groq já configurada no app
- Se não tem API key, abrir modal de configuração
```

### Prompt 4 — Upload de documentos

```bash
Adicione um botão "📄 Upload" no editor que aceita arquivos .txt, .md, .csv e .pdf.

Comportamento:

1. Ao clicar, abre seletor de arquivo
2. Ao selecionar, lê o conteúdo do arquivo
3. Adiciona o conteúdo como texto na nota atual
4. Para .txt e .md: leitura direta como texto
5. Para .csv: leitura como texto (mantém formatação)
6. Para .pdf: extração básica de texto
7. Mostrar nome do arquivo importado como referência na nota
```

### Prompt 5 — Integração com IA (Groq)

```bash
Adicione integração com a API da Groq para funcionalidades de IA.

1. Botão "Configurar API" no header que abre um modal com:
   - Seletor de provedor (Groq, OpenAI, Anthropic)
   - Campo para API Key
   - Seletor de modelo (para Groq: llama-3.3-70b-versatile, llama-3.1-8b-instant, mixtral-8x7b-32768)
   - Salvar no localStorage

2. Barra inferior no editor com 4 botões de IA:
   - 📝 Resumir: gera resumo conciso da nota em até 5 bullets
   - 💡 Extrair Insights: identifica aprendizados, conexões não óbvias
   - 🚀 Gerar Ideias: sugere 5 desdobramentos práticos
   - 📂 Organizar: reestrutura em categorias (fatos, opiniões, tarefas, perguntas)

3. Resultado da IA aparece em painel expansível abaixo dos botões
4. Mostrar loading spinner enquanto processa
5. Status da API no header (conectado/desconectado)
6. Se não tem API key, clicar nos botões abre o modal de configuração
7. Se nota está vazia, mostrar alerta

Para Groq, usar endpoint: https://api.groq.com/openai/v1/chat/completions
Todos os prompts devem pedir resposta em português brasileiro.
```

## DIA 2

### Prompt 6 — Scraper do Miro (Playwright)

```bash
Crie um script Node.js chamado miro-scraper.js que usa Playwright para abrir um board do Miro (URL passada como argumento), esperar carregar, extrair todos os sticky notes visíveis, e imprimir o conteúdo organizado por cor:

- Verde = O que deu bem
- Vermelho/Rosa = O que deu mal
- Amarelo = Aprendizados
- Azul = Ações

Usar: node miro-scraper.js <URL>

O board é público (view-only, sem login).
Usar Playwright com Chromium headless.
Se não conseguir extrair via DOM, tentar extrair texto geral da página e agrupar por seções.
```

Nota para o instrutor: Rodar antes:

```bash
npm install playwright && npx playwright install chromium
```

### Prompt 7 — Botão Post Mortem no app

```bash
No app do Segundo Cérebro, adicione um botão "🔍 Post Mortem" na barra de IA.

Quando clicar, analisa o conteúdo da nota atual como um post mortem.
A IA deve retornar um JSON estruturado com 5 categorias:

- positivos (verde)
- negativos (vermelho)
- aprendizados (amarelo)
- padrões (roxo)
- ações (azul)

Resultado aparece em cards coloridos abaixo da barra de IA.
Adicionar automaticamente a tag "post-mortem" à nota.
Cards com ícones e visual moderno.
```

### Prompt 8 — Refinamentos (opcionais, para demo ao vivo)

```bash
Quando eu analisar um post mortem, a IA deve comparar com post mortems anteriores já salvos e destacar se algum padrão já apareceu antes. Mostrar em um card extra "Padrões Recorrentes entre Post Mortems".

Adicione um botão "Copiar análise" que copia o resultado da análise como texto formatado, pronto para colar no Slack ou email.

Adicione um botão "Exportar" que gera um arquivo .txt com o post mortem original + análise da IA, e faz download automático.

Adicione botão "Copiar análise" que copia tudo formatado para colar no Slack.

Quando analisar como post mortem, destaque especificamente ações que precisam de dono definido.
```

## Fluxo da demo do Miro (Dia 2)

Para o instrutor: esse é o fluxo manual durante o workshop.

1. No terminal, rodar: node miro-scraper.js "URL_DO_BOARD"
2. Copiar o output do terminal
3. No app Segundo Cérebro, criar uma nova nota
4. Colar o output como conteúdo da nota
5. Clicar no botão "🔍 Post Mortem" na barra de IA
6. Mostrar os cards coloridos com a análise

"Em produção, você automatiza: o script roda, o resultado entra direto no app. Para o workshop, a gente faz o fluxo manual para entender cada peça."

### Texto de exemplo para demonstração (Notas - Dia 1)

```bash
Reunião de discovery com o time de vendas. João mencionou que clientes enterprise pedem SSO com frequência — aparentemente é blocker em pelo menos 3 deals abertos. O time de CS reportou 3 churns no último mês, todos citaram "falta de relatórios customizáveis" como motivo principal. Maria sugeriu priorizar dashboard analytics no próximo quarter. Precisamos alinhar com eng sobre viabilidade de SSO no Q3. Benchmark com Mixpanel e Amplitude mostra que ambos têm relatórios customizáveis como feature core. Talvez valha um quick win: permitir export CSV por enquanto. Felipe perguntou se dá para fazer um protótipo rápido do dashboard antes da próxima board review.
```

### Texto de exemplo para demonstração (Post Mortem - Dia 2)

```bash
CONTEXTO: Dia 12 de março, terça-feira, 14h32. API Gateway principal ficou indisponível por 47 minutos. Impacto: 100% dos clientes Enterprise sem acesso. 2.300 requisições falharam. 3 clientes abriram chamado urgente. Time de plantão: Ana (SRE), Carlos (Backend), Juliana (CS).

O QUE DEU BEM:
- Juliana percebeu o problema antes do alerta disparar (pelo Slack de clientes)
- Comunicação no canal #incidentes foi rápida
- Rollback executado em 5 minutos
- Carlos identificou causa raiz em menos de 20 minutos
- Página de status atualizada em 8 minutos

O QUE DEU MAL:
- Deploy feito às 14h (horário de pico) sem feature flag
- Sem alerta de latência acima de 2s no gateway
- Teste de carga não cobriu cenário de conexões simultâneas
- Runbook de incidentes não tinha passo para "verificar rate limiting"
- Dois engenheiros de férias sem cobertura definida
- Rollback derrubou 3 jobs de background que precisaram relanço manual
- Canal #incidentes poluído com mensagens de quem não estava envolvido

APRENDIZADOS:
- Deploy em horário de pico sem feature flag é risco desnecessário
- Precisamos de alerta de latência no gateway
- Testes de carga precisam simular picos reais
- Runbook precisa revisão trimestral
- Definir on-call formal com cobertura de férias
- Jobs de background devem ter auto-recovery

NOTAS SOLTAS:
- "Isso já aconteceu em novembro com outro serviço"
- "A gente sempre fala de feature flag mas nunca vira regra"
- "Precisa automatizar o rollback"
```

---

---

---

---

---

---
