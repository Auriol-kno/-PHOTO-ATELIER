# PHOTO ATELIER v0.3 — biblioteka kolorów i edytor

## Dostarczone

- Ponad 90 autorskich wyglądów inspirowanych rodzinami kolorystycznymi dużych producentów aparatów i marek filmu analogowego.
- Biblioteka posegregowana po marce, ze zintegrowaną wyszukiwarką i łączami do źródeł nazw profili.
- Compare Lab: A / A+B / B, dotykowa linia na zdjęciu (Pointer Events + pointer capture) oraz suwak jako opcja dostępności, klawiatura lewo/prawo.
- Edytor 7 parametrów (jasność, kontrast, saturacja, ocieplenie, przesunięcie barw, matowość, monochrom).
- „Zapisz jako mój profil” — osobny, nieinwazyjny profil w localStorage, edycja wersji, usuwanie.
- Eksport/import własnych profili do JSON; ustawienia zachowywane po odświeżeniu, o ile przeglądarka nie wyczyści danych.
- Jedno zdjęcie używane po obu stronach Compare Lab; własny JPEG/PNG/WebP poprzez local-first katalog.

## Ograniczenia

To **wizualne inspiracje CSS**, nie pobrane ani skalibrowane oryginalne LUT / ICC / DCP / XMP / NP3 od marek. Parametr „temperatura” nie jest fizyczną kalibracją white balance w kelwinach. Nie przypisuj efektom profesjonalnej zgodności bez profilowania i zdjęć referencyjnych.

Zdjęcia i własne profile nie są automatycznie przesyłane do chmury. Dane aplikacji mogą zostać usunięte przez Safari; eksport JSON jest ręczną kopią profili. Weryfikacja na fizycznym iPhone wymagana przed wydaniem.

## Architektura

- \`src/catalog.js\`: dane marek, style i czyste funkcje transformacji.
- \`src/app.js\`: widoki, edytor, gesty i zapis lokalny.
- \`src/styles.css\`: styli interfejsu dotykowego.
- \`tests/styles.mjs\`: testy katalogu, zakresów, A/B, sanitizacji danych.

## Dalsze zadania

1. Przenieść profil użytkownika do IndexedDB i opcjonalnej prywatnej synchronizacji Supabase (po autoryzacji).
2. Eksport XMP poprzez niezależnie zweryfikowany silnik parametrów Lightroom Classic.
3. Natywny iPhone picker z dostępem do plików po zgodzie i prawdziwy renderer RAW/ICC.
4. Testy E2E Safari / WebKit gestów, klawiatury i przepływu tworzenia profilu.
