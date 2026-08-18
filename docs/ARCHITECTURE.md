# Frontend Architecture

## Scope

This document defines responsibility and dependency boundaries for the React
and Vite application. The application is organized by routes, pages, features,
shared UI, and infrastructure libraries.

```text
main.tsx
  -> AppRouter
       -> page
            -> feature component
                 -> shared UI component
                 -> feature API types
                 -> lib/api
            -> page-specific style
  -> AuthContext
```

## Responsibilities

- `pages/<route>/` owns route-level composition and that page's state and
  submission flow.
- `components/features/` owns reusable behavior with a clear product meaning.
- `components/ui/` owns reusable presentational primitives without
  route-specific business behavior.
- `components/layouts/` owns public and authenticated page chrome.
- `features/<domain>/apiTypes.ts` owns request and response contracts for that
  API domain.
- `contexts/` owns genuinely application-wide state such as authentication.
- `lib/api.ts` owns HTTP transport, credential refresh, and normalized errors;
  it does not own page behavior.
- `styles/pages/<route>/` keeps page styles separate. Shared component styles
  stay under the matching `styles/ui`, `styles/features`, or
  `styles/layouts` directory.

Pages may depend on features, shared components, contexts, and libraries.
Shared UI must not depend on pages. Infrastructure libraries must not import
React route components.

## State, API, and security

Keep state local unless multiple distant consumers require it. Stabilize
Context functions and provider values when identity affects consumers.
Represent loading, success, empty, and error states explicitly.

Never expose secrets through Vite variables or `env.json`; browser runtime
configuration is public. Authentication redirects must preserve public token
flows such as password reset. Render server errors in a readable layout and do
not expose raw internal details.

## Testing

Test reusable UI behavior and context logic with Vitest and Testing Library.
Add route regression tests for authentication redirects and critical flows.
Mock the network boundary in unit tests; validate complete frontend/backend
flows in the generated application's integration environment.
