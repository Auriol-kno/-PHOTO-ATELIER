# PHOTO ATELIER Mobile

Mobile-first fotografia · Nikon Zf · Lightroom Classic · Color Science.

**Status: v0.2 local-first PWA, work in progress.** Interfejs i katalog plików działają jako aplikacja webowa; nie jest to natywna aplikacja iOS, wywoływarka RAW ani produkcyjna synchronizacja chmury.

## Start (Windows / macOS / Linux)

W katalogu repozytorium:
\`\`\`bash
python -m http.server 4173
\`\`\`
Otwórz \`http://localhost:4173\`.

Na iPhone aplikacja webowa wymaga wdrożenia HTTPS. To **nie jest** jeszcze opublikowany adres aplikacji. Nie wdrażamy publicznie bez zgody właściciela.

## Działające funkcje

- Nawigacja: 12 modułów oraz osobny ekran **Pliki i chmura**.
- Import z systemowego selektora plików (iOS Files/iCloud Drive, lokalne pliki i dostawcy obecni w systemowym pickerze).
- Katalog metadanych i **małych miniatur** w IndexedDB; działa po odświeżeniu (dopóki przeglądarka nie usunie danych).
- Rejestracja RAW \`.NEF\` jako pozycji katalogu **bez kopiowania oryginału ani renderowania RAW**.
- Podgląd JPG/PNG/WebP, prosty Compare Lab na jednym zdjęciu, style w formie **demonstracyjnych filtrów CSS**, portfolio miniatur.
- Postęp Akademii i Photo Missions w pamięci lokalnej.
- Eksport/import indeksu metadanych JSON (bez oryginałów, bez podglądów), demo receptury kolorystycznej JSON.
- Motyw Darkroom / Light.

## Nie wdrożono

- Synchronizacji konta z Supabase/iCloud/Google Drive/OneDrive, stałego indeksowania folderów PC/NAS.
- Bezpośredniego dostępu do całego dysku bez zgody użytkownika.
- Renderingu NEF/HEIC/TIFF w pełnej jakości, obsługi ICC i kalibracji, rzeczywistych emulacji Hasselblad/Leica.
- Eksportu zatwierdzonych presetów Lightroom XMP i Nikon NP3.
- AI oceniającego zdjęcia.

## Najważniejsza reguła bezpieczeństwa

Oryginalne fotografie nie są domyślnie kopiowane do aplikacji ani wysyłane do chmury, GitHuba lub AI. Ta wersja zapisuje tylko miniatury i metadane w pamięci przeglądarki. IndexedDB może być wyczyszczony przez OS: **to nie jest backup zdjęć**.

## Dokumentacja

- [Architektura przechowywania i dostępu](docs/STORAGE_ARCHITECTURE.md)
- [Model danych](docs/DATA_MODEL.md)
- [Konfiguracja przyszłej chmury](docs/CLOUD_SETUP.md)
- [QA / ograniczenia](docs/QA.md)
- [Handoff dla agentów](docs/HANDOFF.md)
- [Roadmap](docs/ROADMAP.md)

## Współpraca

Kod rozwijamy przez osobne gałęzie i PR. Bez automatycznego scalenia do \`main\`. Nie dodawać prawdziwych prywatnych zdjęć, tokenów ani komercyjnych presetów do publicznego repozytorium.
