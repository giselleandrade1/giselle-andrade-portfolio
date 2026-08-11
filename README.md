# Giselle Andrade — Developer Portfolio

Portfólio profissional de Giselle Andrade, desenvolvido para apresentar projetos, competências técnicas e a trajetória de aprendizado em desenvolvimento de software.

O projeto usa Next.js, React e TypeScript, com foco em uma interface rápida, responsiva e acessível. A arquitetura prioriza Server Components para conteúdo estático e mantém JavaScript no navegador apenas nas interações que realmente precisam dele.

## Tecnologias

- Next.js 16 com App Router
- React 19
- TypeScript em modo estrito
- CSS global para tokens e CSS Modules colocalizados com os componentes
- `next/image` e `next/font` com recursos locais
- ESLint com as regras de Core Web Vitals e TypeScript do Next.js

## Requisitos

- Node.js 20.19 ou superior
- npm 10.9.3

O projeto declara essas versões em `package.json`. Usar uma versão compatível do Node evita diferenças entre desenvolvimento, integração contínua e produção.

## Execução local

Instale exatamente as dependências registradas no lockfile:

```bash
npm ci
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run lint` | Executa ESLint e falha caso exista qualquer warning. |
| `npm run typecheck` | Gera os tipos de rotas do Next.js e valida o TypeScript sem emitir arquivos. |
| `npm run test:browser` | Valida o build servido usando uma instância local do Chrome via CDP. |
| `npm run build` | Cria o build otimizado de produção. |
| `npm run start` | Serve localmente um build já criado. |
| `npm run check` | Executa lint, typecheck e build em sequência. |

Antes de entregar uma alteração, execute:

```bash
npm run check
```

## Arquitetura

```text
app/                  Rotas, layout raiz, metadados e estilos globais
components/
  layout/             Header, navegação e footer
  sections/           Seções estáticas da página
  ui/                 Componentes reutilizáveis
data/                 Conteúdo tipado do portfólio
lib/                  Configuração do site e utilitários
public/
  fonts/              Fontes locais
  images/             Imagens de perfil e conteúdo
  projects/           Previews locais dos projetos
```

`app/layout.tsx` concentra responsabilidades globais, como idioma do documento, fontes, metadados e inicialização do tema. `app/page.tsx` compõe a página usando Server Components por padrão.

Componentes interativos, como menu mobile, seletor de tema, navegação por seção e ações de contato, são Client Components isolados. Dados estáticos não dependem de hooks nem são enviados ao navegador como módulos executáveis sem necessidade.

## Estilos e temas

Os tokens globais definem cores, tipografia, espaçamento, raios, sombras e estados de foco. Os temas claro e escuro usam os mesmos tokens sem manter superfícies escuras no tema claro.

Os estilos específicos ficam próximos dos componentes em CSS Modules. Animações respeitam `prefers-reduced-motion`, e efeitos de ponteiro devem ser limitados a dispositivos que suportam hover preciso.

## Assets e performance

Fontes, ícones, imagem de perfil e previews de projetos são servidos localmente. A página não depende de CDNs de ícones nem de imagens externas de estatísticas para apresentar seu conteúdo principal.

As principais diretrizes de performance são:

- usar `next/image` com dimensões e `sizes` adequados;
- priorizar somente a provável imagem de LCP;
- manter imagens abaixo da dobra com carregamento adiado;
- evitar bibliotecas de animação ou ícones quando CSS e SVG local forem suficientes;
- preservar conteúdo estático como Server Component;
- oferecer fallback para qualquer dado externo opcional.

## Acessibilidade

O objetivo é atender WCAG 2.2 AA. Mudanças devem preservar:

- HTML semântico e hierarquia correta de títulos;
- navegação completa por teclado;
- skip link e foco sempre visível;
- contraste adequado nos temas claro e escuro;
- menu mobile operável com Escape e retorno de foco;
- feedback anunciado por tecnologias assistivas;
- suporte a redução de movimento e alto contraste;
- layout funcional com zoom de 200% e a partir de 320 px.

## SEO

O App Router centraliza os metadados da página e usa as convenções do Next.js para favicon, Open Graph, robots e sitemap. Metadados estruturados devem conter apenas informações verificáveis e usar a URL canônica do portfólio.

## Validação de produção

Depois de `npm run check`, valide o build real:

```bash
npm run start
```

Para executar o smoke test em outro terminal, disponibilize o Chrome via CDP. Exemplo no Linux:

```bash
google-chrome --headless=new \
  --remote-debugging-address=127.0.0.1 \
  --remote-debugging-port=9223 \
  --user-data-dir=/tmp/giselle-portfolio-browser-test \
  about:blank

npm run test:browser
```

Por padrão, a suíte usa `http://127.0.0.1:3000` e o Chrome em `http://127.0.0.1:9223`. As variáveis `BASE_URL` e `CHROME_DEBUG_URL` permitem alterar os dois endereços.

Teste os temas, navegação por teclado, menu mobile, redução de movimento e ausência de overflow horizontal em 320, 375, 480, 768, 1024, 1366, 1440 e 1920 px. Para auditorias Lighthouse, use o servidor de produção em vez do modo de desenvolvimento.

## Autoria

Desenvolvido por [Giselle Andrade](https://github.com/giselleandrade1).
