# LearnLite

**LearnLite** é uma aplicação web construída com Next.js que utiliza Inteligência Artificial Generativa para oferecer aos usuários resumos, flashcards e quizzes gerados a partir de documentos PDF enviados. A interface é limpa e moderna, desenvolvida com Tailwind CSS e componentes da ShadCN UI.

### Acesse o LearnLite: https://learnlitetest.vercel.app

## Versão Desktop

<p align="center">Modo escuro</p>

![Image](https://github.com/user-attachments/assets/712e098c-d31c-4df9-82ae-72a0c2292773)

<p align="center">Modo claro</p>

![Image](https://github.com/user-attachments/assets/de5d0d14-8932-43f3-89dd-b9926361af8d)

## Versão Mobile

<p align="center">
  <img src="https://github.com/user-attachments/assets/3e4c0ab9-598e-4549-ad51-423231938fdb" width=200>
  <img src="https://github.com/user-attachments/assets/8818f8b4-4c37-45fd-a425-c3e98e7a64f7" width=200>
  <img src="https://github.com/user-attachments/assets/d1256221-bf4c-4934-af63-a970bb0b8431" width=200>
  <img src="https://github.com/user-attachments/assets/22fec5b6-14a0-4feb-a8fe-d3a76a32c044" width=200>
</p>

## Funcionalidades Principais

- **Upload de PDF:** Usuários podem enviar arquivos PDF e nomear a sessão correspondente.  
- **Análise por IA:**  
  - **Resumo:** Geração automática de um resumo conciso do conteúdo do PDF.  
  - **Flashcards:** Criação de 10 flashcards com informações chave extraídas do PDF.  
  - **Quiz:** Geração de um quiz de múltipla escolha com 10 perguntas baseadas no conteúdo.  
- **Exibição em Abas:** Os resultados são organizados em uma interface intuitiva com abas para fácil navegação entre resumo, flashcards e quiz.  
- **Design Responsivo:** A aplicação é totalmente responsiva, garantindo ótimo funcionamento em diferentes dispositivos.  

---

## Stack

- Next.js (App Router)  
- React  
- TypeScript  
- Tailwind CSS  
- ShadCN UI  
- Lucide Icons  
- Genkit (para integração dos fluxos de IA com Google Gemini)  

---

## Como Começar

### Pré-requisitos

- Node.js (versão 18 ou superior recomendada)  
- npm ou yarn  

### Rodando Localmente

1. Clone o repositório:
    
   ```bash
   git clone <repository-url>
   cd gemini-study
   
2. Instale as dependências:

   ```bash
   git clone <repository-url>
   cd gemini-study

3. Configure as variáveis de ambiente:
Crie um arquivo .env.local na raiz do projeto e adicione sua chave de API para o Google Gemini:

    ```ini
    npm run dev
      # ou
    yarn run dev
    
  Geralmente disponível em http://localhost:9002.

4. Inicie o app Next.js:
  
    ```ini
    npm run dev
    # ou
    yarn run dev
