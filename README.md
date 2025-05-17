cx# GeminiStudy

GeminiStudy é uma aplicação web Next.js que utiliza Inteligência Artificial Generativa para fornecer aos usuários resumos, flashcards e quizzes gerados a partir de seus documentos PDF enviados. Foi projetada com uma interface limpa e moderna usando Tailwind CSS e componentes ShadCN UI.

## Funcionalidades Principais

-   **Upload de PDF:** Usuários podem enviar arquivos PDF e atribuir um nome à sessão.
-   **Análise por IA:**
    -   **Geração de Resumo:** Obtenha um resumo conciso do conteúdo do PDF.
    -   **Geração de Flashcards:** Crie 10 flashcards baseados em informações chave do PDF.
    -   **Geração de Quiz:** Gere um quiz de múltipla escolha com 10 perguntas a partir do PDF.
-   **Exibição de Resultados em Abas:** Visualize o resumo, flashcards e quiz gerados em uma interface intuitiva com abas.
-   **Design Responsivo:** A aplicação é totalmente responsiva e funciona em diversos dispositivos.

## Stack Tecnológica

-   Next.js (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   ShadCN UI
-   Lucide Icons
-   Genkit (para integração de fluxo de IA com Google Gemini)

## Começando

### Pré-requisitos

-   Node.js (v18 ou superior recomendado)
-   npm ou yarn

### Rodando Localmente

1.  **Clone o repositório:**
    ```bash
    git clone <repository-url>
    cd gemini-study # Ou o nome do diretório do seu projeto
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure Variáveis de Ambiente (se aplicável):**
    Se a integração com IA exigir chaves de API (ex: para Google Gemini), crie um arquivo `.env.local` na raiz do seu projeto e adicione as chaves necessárias. Consulte a documentação do Genkit e Google AI para nomes de variáveis específicos.
    Exemplo:
    ```
    GOOGLE_API_KEY=your_google_api_key_here
    ```
    A configuração do Genkit (`src/ai/dev.ts`) usa `dotenv` para carregá-las.

4.  **Rode os servidores de desenvolvimento:**
    A aplicação usa dois servidores de desenvolvimento: um para o app Next.js e um para os fluxos Genkit.

    -   **Inicie o app Next.js:**
        ```bash
        npm run dev
        ```
        Isso tipicamente iniciará o app em `http://localhost:9002`.

    -   **Inicie o servidor de desenvolvimento Genkit (em um terminal separado):**
        ```bash
        npm run genkit:dev
        # ou para observar mudanças nos fluxos de IA
        npm run genkit:watch
        ```
        Isso inicia a UI de desenvolvedor do Genkit, geralmente em `http://localhost:4000`, permitindo que você inspecione e teste seus fluxos de IA.

5.  **Abra seu navegador:**
    Navegue para `http://localhost:9002` (ou a porta especificada no seu script `dev`) para usar a aplicação.

## Deploy no Vercel

Fazer o deploy do GeminiStudy no Vercel é direto:

1.  **Envie seu código para um repositório Git** (ex: GitHub, GitLab, Bitbucket).
2.  **Cadastre-se ou Faça Login no Vercel.**
3.  **Importe seu repositório Git:**
    -   Clique em "Add New..." -> "Project".
    -   Selecione seu provedor Git e importe o repositório contendo seu projeto GeminiStudy.
4.  **Configure as Configurações do Projeto:**
    -   O Vercel deve detectar automaticamente que é um projeto Next.js.
    -   **Configurações de Build & Desenvolvimento:** Geralmente, os padrões são suficientes.
        -   Framework Preset: Next.js
        -   Build Command: `next build` (ou `npm run build`)
        -   Output Directory: `.next`
        -   Install Command: `npm install` (ou `yarn install`)
    -   **Variáveis de Ambiente:** Adicione quaisquer variáveis de ambiente necessárias para os serviços de IA (como `GOOGLE_API_KEY`) nas configurações do projeto no Vercel. Vá para o seu projeto no Vercel -> Settings -> Environment Variables.
5.  **Deploy.**
    O Vercel fará o build e o deploy da sua aplicação. Uma vez concluído, você receberá uma URL única para o seu site ao vivo.

**Nota Importante para Fluxos de IA Genkit no Vercel:**
Ao fazer deploy de fluxos Genkit, especialmente aqueles que usam APIs externas como Google Gemini, certifique-se de que:
- Suas chaves de API estão corretamente configuradas como variáveis de ambiente no Vercel.
- Os modelos e serviços que você está usando são acessíveis pelos servidores do Vercel (ex: sem restrições de IP que bloqueariam o Vercel).
- Considerações de deploy em produção do Genkit são seguidas se você for além de simples server actions dentro do Next.js. Para este projeto, as server actions devem funcionar bem com o deploy Next.js no Vercel.

## Otimizações Futuras

-   **Cache de Resultados:** Implementar cache (ex: usando Vercel KV, Redis, ou outras soluções de banco de dados) para resumos, flashcards e quizzes gerados para evitar reprocessar o mesmo PDF e acelerar o acesso para requisições repetidas.
-   **Suporte para Outros Formatos de Arquivo:** Estender a funcionalidade para suportar outros tipos de documentos como `.docx`, `.txt`, etc., adicionando lógica de extração de texto apropriada.
-   **Extração de Texto PDF Aprimorada:** Integrar bibliotecas de parse de PDF mais sofisticadas para lidar com layouts complexos, imagens com texto e documentos escaneados de forma mais eficaz.
-   **Contas de Usuário & Histórico:** Permitir que usuários criem contas para salvar seus PDFs processados e insights gerados para referência futura.
-   **Recursos Avançados de Quiz:** Incluir diferentes tipos de perguntas, mecanismos de feedback e acompanhamento de desempenho.
-   **Geração Seletiva:** Permitir que usuários escolham quais insights (resumo, flashcards, quiz) desejam gerar.
-   **Carregamento Progressivo:** Carregar componentes de insights (resumo, flashcards, quiz) individualmente à medida que são gerados para melhorar a performance percebida.

## Acessibilidade

Considerações básicas de acessibilidade foram incluídas:
-   Elementos HTML semânticos.
-   Rótulos para inputs de formulário (`<label htmlFor="...">`).
-   Navegabilidade por teclado e visibilidade de foco para elementos interativos (amplamente tratados pelos componentes ShadCN UI).
-   Atributos ARIA onde apropriado.

Auditorias de acessibilidade adicionais e melhorias podem ser feitas à medida que o projeto evolui.
