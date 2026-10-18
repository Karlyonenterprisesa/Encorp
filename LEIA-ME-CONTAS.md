# Contas de estudante, aulas e testes — configuração

O site é estático; as contas e o progresso vivem em duas funções da Vercel (`api/aluno.js`, `api/aprendizagem.js`)
e numa base de dados Redis (REST). **Sem estas variáveis o site continua a funcionar**, mas as contas ficam desactivadas
e o leitor de cursos mostra «as contas ainda não estão activas».

## 1. Configurar na Vercel (uma vez)
1. Projecto → *Storage* → *Marketplace* → **Upstash for Redis** → criar e ligar ao projecto
   (cria `KV_REST_API_URL` e `KV_REST_API_TOKEN`).
2. *Settings → Environment Variables* → criar **`SESSION_SECRET`** com 32 ou mais caracteres aleatórios
   (por exemplo, `openssl rand -hex 32`). Não o partilhe nem o coloque no repositório.
3. Publicar de novo (*Redeploy*).

## 2. Como funciona
- **Registo:** o servidor atribui número de estudante (`ENC-000001`), nome de utilizador único e código de 4 dígitos (gerado com `crypto.randomInt`).
  O código aparece **uma única vez** e não é recuperável. Guarda-se apenas um hash (HMAC com `SESSION_SECRET` + scrypt com sal).
- **Sessão:** cookie `HttpOnly; Secure; SameSite=Lax`, assinado, revogado ao sair.
- **Protecção:** 5 falhas por utilizador (mesmo inexistente) bloqueiam 15 min; 40 tentativas por IP / 15 min; 5 registos por IP / hora.
- **Aulas (modo «Progressivo» no CMS):** a aula seguinte só abre depois de aprovar a anterior — validado **no servidor**.
  O servidor regista os slides (ordem e ritmo mínimo de 3 s) e o vídeo; só então inicia o teste.
- **Testes:** exactamente 10 perguntas; correcção no servidor; as respostas certas nunca saem do servidor antes da aprovação.
- Os dados dos cursos com conta são gerados em `api/_dados/cursos.json` (privado: `/api/_dados/*` e `/conteudo/*` respondem 404 no site).

## 3. Editar no CMS
*Cursos → (curso) → Modo = Progressivo*, depois, em cada aula: conteúdo escrito, slides, vídeo (link YouTube ou MP4), «vídeo obrigatório» e teste.
O teste tem de ter **exactamente 10 perguntas** (o CMS e o `build.mjs` verificam; o build falha com uma mensagem clara se não tiver).
Vídeo sem endereço configurado → nunca bloqueia a aula.

## 3b. PowerPoint automático
Cada aula com slides ganha um **.pptx** gerado sozinho no build (`tools/gerar-pptx.mjs`, dependência `pptxgenjs`):
capa, «Nesta aula», um slide por slide do CMS e slide do teste. Fica em `api/_dados/slides/<curso>/aula-N.pptx` (privado) e o
estudante só o descarrega com a aula desbloqueada (botão no leitor). Para desactivar numa aula: *Permitir descarregar os slides em PowerPoint = desligado*.
Editar os slides no Decap → publicar → o PPTX é refeito. Se `pptxgenjs` faltar, o build avisa e continua.

## 4. Limitações conhecidas
- Código de 4 dígitos é fraco por natureza; a protecção está no limite de tentativas e na «pimenta» do servidor.
- Não há recuperação de código nem painel de administração: um estudante que perca o código tem de criar nova conta.
- O servidor não consegue «ver» o vídeo; usa o evento de fim do leitor e um tempo mínimo decorrido (melhor esforço).
- Ficheiros MP4 carregados no CMS são públicos por URL; para vídeo protegido use YouTube «não listado».
- Testar: `npm test` (compila e corre 29 verificações com Redis simulado).
