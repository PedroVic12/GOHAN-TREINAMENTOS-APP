# PDF Insights

PDF Insights is a Next.js web application that leverages Generative AI to provide users with summaries, flashcards, and quizzes generated from their uploaded PDF documents. It's designed with a clean, modern interface using Tailwind CSS and ShadCN UI components.

## Core Features

-   **PDF Upload:** Users can upload PDF files and assign a session name.
-   **AI-Powered Analysis:**
    -   **Summary Generation:** Get a concise summary of the PDF content.
    -   **Flashcard Generation:** Create 5 flashcards based on key information in the PDF.
    -   **Quiz Generation:** Generate a 5-question multiple-choice quiz from the PDF.
-   **Tabbed Results Display:** View the generated summary, flashcards, and quiz in an intuitive tabbed interface.
-   **Responsive Design:** The application is fully responsive and works across various devices.

## Tech Stack

-   Next.js (App Router)
-   React
-   TypeScript
-   Tailwind CSS
-   ShadCN UI
-   Lucide Icons
-   Genkit (for AI flow integration with Google Gemini)

## Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd pdf-insights # Or your project directory name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Environment Variables (if applicable):**
    If the AI integration requires API keys (e.g., for Google Gemini), create a `.env.local` file in the root of your project and add the necessary keys. Refer to the Genkit and Google AI documentation for specific variable names.
    Example:
    ```
    GOOGLE_API_KEY=your_google_api_key_here
    ```
    The Genkit setup (`src/ai/dev.ts`) uses `dotenv` to load these.

4.  **Run the development server:**
    The application uses two development servers: one for the Next.js app and one for Genkit flows.

    -   **Start the Next.js app:**
        ```bash
        npm run dev
        ```
        This will typically start the app on `http://localhost:9002`.

    -   **Start the Genkit development server (in a separate terminal):**
        ```bash
        npm run genkit:dev
        # or for watching changes in AI flows
        npm run genkit:watch
        ```
        This starts the Genkit developer UI, usually on `http://localhost:4000`, allowing you to inspect and test your AI flows.

5.  **Open your browser:**
    Navigate to `http://localhost:9002` (or the port specified in your `dev` script) to use the application.

## Deployment on Vercel

Deploying PDF Insights to Vercel is straightforward:

1.  **Push your code to a Git repository** (e.g., GitHub, GitLab, Bitbucket).
2.  **Sign up or Log in to Vercel.**
3.  **Import your Git repository:**
    -   Click on "Add New..." -> "Project".
    -   Select your Git provider and import the repository containing your PDF Insights project.
4.  **Configure Project Settings:**
    -   Vercel should automatically detect that it's a Next.js project.
    -   **Build & Development Settings:** Usually, the defaults are fine.
        -   Framework Preset: Next.js
        -   Build Command: `next build` (or `npm run build`)
        -   Output Directory: `.next`
        -   Install Command: `npm install` (or `yarn install`)
    -   **Environment Variables:** Add any environment variables required for the AI services (like `GOOGLE_API_KEY`) in the Vercel project settings. Go to your project on Vercel -> Settings -> Environment Variables.
5.  **Deploy.**
    Vercel will build and deploy your application. Once done, you'll get a unique URL for your live site.

**Important Note for Genkit AI Flows on Vercel:**
When deploying Genkit flows, especially those using external APIs like Google Gemini, ensure that:
- Your API keys are correctly set as environment variables in Vercel.
- The models and services you are using are accessible from Vercel's servers (e.g., no IP restrictions that would block Vercel).
- Genkit's production deployment considerations are followed if you move beyond simple server actions within Next.js. For this project, the server actions should work fine with Next.js deployment on Vercel.

## Future Optimizations

-   **Result Caching:** Implement caching (e.g., using Vercel KV, Redis, or other database solutions) for generated summaries, flashcards, and quizzes to avoid re-processing the same PDF and to speed up access for repeated requests.
-   **Support for Other File Formats:** Extend functionality to support other document types like `.docx`, `.txt`, etc., by adding appropriate text extraction logic.
-   **Enhanced PDF Text Extraction:** Integrate more sophisticated PDF parsing libraries to handle complex layouts, images with text, and scanned documents more effectively.
-   **User Accounts & History:** Allow users to create accounts to save their processed PDFs and generated insights for future reference.
-   **Advanced Quiz Features:** Include different question types, feedback mechanisms, and performance tracking.
-   **Selective Generation:** Allow users to choose which insights (summary, flashcards, quiz) they want to generate.
-   **Progressive Loading:** Load insights components (summary, flashcards, quiz) individually as they are generated to improve perceived performance.

## Accessibility

Basic accessibility considerations have been included:
-   Semantic HTML elements.
-   Labels for form inputs (`<label htmlFor="...">`).
-   Keyboard navigability and focus visibility for interactive elements (largely handled by ShadCN UI components).
-   ARIA attributes where appropriate.

Further accessibility audits and improvements can be made as the project evolves.
