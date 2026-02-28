# Contributing to Duo Keyboard Koalition

We're reviving the DKK webapp! To keep things moving smoothly, please follow these guidelines.

## Workflow

1.  **Branching Strategy:**
    - Create a new branch for each feature or fix.
    - Use the format: `feature/<your-name>-<short-description>` or `fix/<your-name>-<short-description>`.
    - Example: `feature/awesome-docs-and-dx`

2.  **Commit Messages:**
    - Be descriptive.
    - Start with a verb (e.g., "Add login page", "Fix typo in README").

3.  **Pull Requests:**
    - Push your branch to GitHub.
    - Open a PR against the `main` branch.
    - Add a description of what you changed and why.
    - Request a review from a teammate.

## Code Style

- **Linting:** We use ESLint. Run `npm run lint` before committing.
- **Formatting:** We use Prettier. Run `npm run format` to tidy up your code.
- **TypeScript:** Keep types strict. Avoid `any` where possible.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and third-party library configurations (Supabase, Firebase).
- `context/`: React Context providers.
- `public/`: Static assets.

## Getting Help

If you're stuck, ask in the `#music` channel or ping `@CodeJedi`.

Let's build something awesome! 🎹🐨
