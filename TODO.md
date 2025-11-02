# TODO: Add Arabic Language Support and Theme Toggle

## Information Gathered
- Current project supports only French ("fr") in lib/i18n.ts.
- LanguageSwitcher component exists but has type mismatch (includes "en" and "ar" but only "fr" defined).
- ThemeProvider handles dark/light theme but not language.
- Header has navigation but no language switcher or theme toggle.
- Layout sets lang="fr" statically.

## Plan
- Update lib/i18n.ts: Add "ar" to Language type, add Arabic translations for all keys.
- Update components/theme-provider.tsx: Add language state management, provide context for language and theme.
- Update components/language-switcher.tsx: Use language context, fix types.
- Update components/header.tsx: Add language switcher and theme toggle icons in the header.
- Update app/layout.tsx: Use language from context for html lang and dir (RTL for Arabic).
- Update lib/i18n.ts: Modify t function to use current language from context.

## Dependent Files to Edit
- lib/i18n.ts
- components/theme-provider.tsx
- components/language-switcher.tsx
- components/header.tsx
- app/layout.tsx

## Followup Steps
- Test language switching and theme toggle.
- Run the app to verify RTL layout for Arabic.
- Ensure all text switches correctly.

## Completed Tasks
- [x] Updated lib/i18n.ts with Arabic translations and language type
- [x] Enhanced theme-provider.tsx with language context
- [x] Fixed language-switcher.tsx to use context
- [x] Added language switcher and theme toggle to header.tsx
- [x] Updated layout.tsx for dynamic lang and dir
- [x] Updated about/page.tsx to use context
- [x] Updated footer.tsx to use context
- [x] Started development server
