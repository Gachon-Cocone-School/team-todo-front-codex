# Agent workflow

## Commands

- Install: `npm ci`
- Run locally: `npm run dev`
- Full verification: `npm run check`
- Focused tests: `npm test -- path/to/file.test.tsx`
- Format changed files: `npm run format`

## Project context

- Product scope and user flows: [`docs/plan.md`](docs/plan.md).
- Required manual scenarios: [`docs/TEST_CASE.md`](docs/TEST_CASE.md).
- Visual tokens: [`docs/DESIGN-productivity.md`](docs/DESIGN-productivity.md) and [`docs/DESIGN-warm.md`](docs/DESIGN-warm.md).
- Use Next.js App Router. The initial route is the TODO list; theme selection belongs in Settings and must persist.
- The backend has no authentication or comments. Keep TODO requests aligned with `/api/v1/todos`; read the API address from `API_BASE_URL` and do not hard-code it.
- Automated tests use Vitest and Testing Library. Playwright E2E is out of scope; visual changes still require the relevant manual cases from `docs/TEST_CASE.md`.

## Work loop

1. **Specify:** Read the relevant plan, test cases, design guide, and existing implementation. Restate the observable acceptance criteria in the task plan when the change spans multiple files or behaviors.
2. **Plan:** Choose the smallest vertical slice that satisfies those criteria. Identify affected routes, API calls, states, themes, and tests before editing.
3. **Implement:** Add or update a test for each behavior change. Test the user-visible contract, not only the helper implementation. Avoid unrelated cleanup and new dependencies unless the task needs them.
4. **Verify:** Run the narrow relevant test while iterating, then `npm run check`. For visual changes, inspect both themes and responsive states; report manual checks separately from automated results.
5. **Review:** Inspect `git status` and the full diff for unintended files, missing acceptance cases, secrets, generated artifacts, and scope creep. Fix failures and repeat the loop.
6. **Stop:** Finish only when acceptance criteria and required checks pass. Report checks that could not run and any remaining risk; never describe an unperformed manual check as verified.

## Boundaries

- Do not add authentication, comments, or an administration screen unless the product scope changes.
- Preserve the two design guides as separate themes. Do not silently combine or replace their tokens.
- Keep generated files, `.env` files, and local databases out of Git.
- Change dependencies through `package.json`, regenerate `package-lock.json` with npm, and explain why the dependency is needed. Never edit the lockfile by hand.
- Do not bypass failing lint, formatting, type, test, or build checks. Do not use `git commit --no-verify`.
- Do not publish, deploy, or modify remote repository settings without an explicit request.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
