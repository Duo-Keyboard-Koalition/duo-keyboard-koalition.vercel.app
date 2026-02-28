# Duo Keyboard Koalition (DKK) Webapp

![DKK Logo](public/logo.png) _(Coming Soon)_

## Overview

Welcome to the **Duo Keyboard Koalition (DKK) Webapp** repository! This is the central hub for the DKK community, featuring a dashboard for members, event listings, and team collaboration tools.

We are reviving the DKK to connect keyboard enthusiasts, host hackathons, and build awesome projects together.

## Tech Stack

- **Frontend:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Auth:** [Supabase](https://supabase.com/) & [Firebase](https://firebase.google.com/)
- **Package Manager:** [pnpm](https://pnpm.io/) (recommended) or npm

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Duo-Keyboard-Koalition/duo-keyboard-koalition.vercel.app.git
    cd duo-keyboard-koalition
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up environment variables:**
    Copy `.env.example` (if available) or create a `.env.local` file with your Supabase/Firebase keys. See `env.md` for details.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    pnpm dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started, branch naming conventions, and code style.

## License

MIT License. See [LICENSE](LICENSE) for details.
