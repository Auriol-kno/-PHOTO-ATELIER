# PHOTO ATELIER — AGENT HANDOFF

Repo: \`Auriol-kno/-PHOTO-ATELIER\`
Bieżąca robocza gałąź: \`feature/mobile-storage-v0.2\`
Base: \`feature/mobile-foundation-v0.1\` (stamtąd dokumentacja początkowa).
PR target: \`main\`. **Nie scalać bez akceptacji.**

## Produkt

Profesjonalne mobilne laboratorium fotograficzne pod Nikon Zf, Lightroom Classic i style Hasselblad/Leica/Kodak/Fujifilm. Pełne 12 modułów + oddzielne Pliki i chmura. Domyślny motyw Darkroom Atelier.

## Wdrożone

- Statyczna PWA (HTML/CSS/ES Modules), offline app shell.
- Podstawowe ekrany wszystkich modułów.
- Lokalny katalog IndexedDB: metadane + pomniejszone miniatury JPG dla zgodnych typów.
- Systemowy file picker: może czytać źródła dostępne użytkownikowi w iOS Files. RAW = tylko indeks.
- Miniatury pokazane w Portfolio i Compare Lab, backup / restore indeksu JSON.
- Lokalne lekcje, misje, ustawienia motywu.
- Demo porównywania CSS opisane jako **demo**, nie obietnica imitacji konkretnych aparatów.

## Niewdrożone

- Stały dostęp do plików iOS/Windows bez zgody, synchronizacja Supabase, automatyczna integracja dysków cloud.
- Pełna kopia zdjęć, podgląd NEF, pipeline ICC/RAW, XMP/NP3, AI.
- React/TypeScript migration.

## Zasady

1. Nie dodawać plików użytkownika/EXIF/tajnych kluczy do publicznego repozytorium.
2. Nie nadpisywać oryginałów RAW.
3. Każda zewnętrzna synchronizacja włączana jawnie, z priorytetem indeks + miniatury.
4. Rzetelnie odróżniać prototyp CSS od kolorystycznej emulacji.
5. Przed PR testować składnię JS, ścieżkę importu i przechowywanie IndexedDB oraz widoki mobilne.
6. Nie publikować produkcyjnej wersji ani nie scalać do main bez akceptacji.

## Następne zadanie dla Claude/Codex

Przeprowadź migrację obecnego UI do React + TypeScript bez zmiany wyglądu i funkcji oraz z zachowaniem adaptera \`src/storage.js\` lub zastąpieniem go testowanym modułem. Dodaj testy automatyczne dla importu JPG/PNG/NEF, odświeżania biblioteki, backup JSON i zachowania foto-prywatności. Opracuj projekt provider-agnostic adaptera Cloud Storage, ale nie aktywuj uploadu do czasu konfiguracji Supabase i testów RLS.
