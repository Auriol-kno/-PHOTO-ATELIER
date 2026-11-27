# STORAGE ARCHITECTURE — v0.2

## Decyzja: katalog niezależny od fizycznych plików

Jedno zdjęcie ma stabilne \`asset_id\`. Obiekt **Asset** wskazuje na jedno lub wiele miejsc przechowywania oryginału i wersje obróbki. Nie utożsamiamy folderu, nazwy pliku i albumu. Zdjęcie źródłowe jest niezmienne. Edycje są nieinwazyjnymi recepturami i wersjami.

\`\`\`
iPhone / PWA (obecnie)
  └── wybór pliku przez systemowy picker
       ├── zdjęcie: metadane + mały JPG preview → IndexedDB
       └── NEF/XMP/NP3: metadane → IndexedDB
             │ (przyszłe logowanie i świadoma synchronizacja)
             ▼
Supabase Auth + Postgres RLS (metadane, albumy, receptury)
  └── prywatny Storage (miniatury + na życzenie pełne RAW)
             ▲
Windows / Tauri companion (przyszłość)
  └── indeks wskazanych folderów SSD/NAS/OneDrive/Google Drive
       └── Lightroom Classic + lokalne oryginały NEF/XMP
\`\`\`

## Gdzie trzymamy co

| Typ | Primary | Urządzenie mobilne | Chmura |
|---|---|---|---|
| RAW/NEF | PC / NAS / user-selected cloud | metadane, preview | tylko opt-in |
| JPEG/HEIC/TIFF | plik właściciela | miniatura / indeks | opcjonalnie |
| XMP | folder przy RAW/album | eksport/import | wersjonowane |
| NP3 | folder profili Nikon | eksport/import | wersjonowane |
| Albumy, oceny, notatki | lokalny katalog | SQLite w native / IndexedDB w PWA | Supabase Postgres opt-in |
| Style publiczne / lekcje | repo / CDN z legalnymi materiałami | cache | treści serwisu |

## Dostęp do plików

1. **iPhone (aktualna PWA):** \`<input type=file>\` z aplikacją Pliki może wskazać On My iPhone, iCloud Drive, Google Drive/OneDrive/Dropbox z File Provider (jeśli obecne). Wybrane pliki są tylko importowane do indeksu; brak automatycznego skanowania.
2. **iPhone (docelowy shell natywny):** Capacitor/Swift bridge i systemowy UIDocumentPicker, do tego security-scoped URL/bookmarks tam, gdzie właściwe. Dostęp tylko po zgodzie użytkownika. iCloud Documents entitlement, jeśli potrzebne. Architektura nie zakłada pełnego dostępu do iPhone.
3. **PC Windows:** docelowy mały companion (Tauri/Rust) pozwalający wybrać folder fotograficzny i tworzyć indeks bez niekontrolowanego kopiowania RAW.
4. **Zewnętrzne chmury:** na start import przez Pliki, nie OAuth. Później kontrolowane konektory ze zgodą i możliwością odłączenia.

## Local-first MVP

- IndexedDB przechowuje miniatury jako małe \`Blob\`, wpisy katalogowe i typ pliku. Nie przechowuje oryginalnych NEF.
- Import zdjęcia generuje kopię JPEG do 1400 px. Jeżeli dekodowanie się nie uda, pozostaje wpis bez miniatury.
- Import RAW: metadata-only. W przyszłości wykorzystać renderer NEF i EXIF na backendzie/desktop companion po wyborze pliku.
- Duplikaty MVP: nazwa + rozmiar + czas modyfikacji. Docelowo SHA-256 oryginału, liczony strumieniowo.
- Użytkownik może eksportować **indeks JSON bez miniatur i oryginałów**. Odzyskanie indeksu nie odtwarza plików; backup RAW jest niezależnym procesem.
- Nie opierać bezpieczeństwa archiwum o IndexedDB: cache może zostać usunięty (limity urządzenia/przeglądarki).

## Docelowy model chmury

- Supabase Auth (opcjonalne konto), Postgres z RLS i prywatne buckety \`photo-previews\`, \`photo-originals\`, \`photo-exports\`.
- Osobny przełącznik dla synchronizacji indeksu, miniaturek i pełnych RAW.
- Użytkownik może działać offline bez konta; kolejka synchronizacji z retry i kontrolą integralności.
- Wysyłanie dużych RAW protokołem resumable TUS, nie jednym requestem.
- Trwałe identyfikatory \`asset_id\`, osobne \`source_locator\`; unikać przechowywania lokalnych ścieżek w chmurze jeśli niepotrzebne.
- Nie publiczne URL, tylko autoryzowane pobranie lub krótkotrwałe signed URL.
- Konflikty: immutable original + revision dla edycji; nie nadpisywać automatycznie dwóch równoległych edycji.
- Żadne zdjęcia nie są wysyłane do AI bez odrębnej zgody. Przed wysyłką usunąć zbędny EXIF, w tym geolokalizację.

## Konwencja archiwum na PC

\`\`\`
PHOTO_ATELIER_LIBRARY/
  2026/
    2026-11-27_Session/
      originals/         # oryginalne NEF/JPEG — nigdy nadpisywane
      sidecars/          # XMP, receptury, opis wersji
      exports/           # wywołane JPG/TIFF
      contact-sheets/    # pomocnicze plansze
  presets/
    lightroom/           # XMP
    nikon-zf/            # NP3 (zweryfikowane)
  backups/               # indeks eksportów, nie jedyna kopia RAW
\`\`\`

## Wydajność i backup

- 3-2-1 dla oryginałów: trzy kopie, dwa nośniki, jedna poza lokalizacją.
- Domyślnie upload tylko miniatur po zgodzie. Zdjęcia o pełnej rozdzielczości — wyraźny opt-in.
- Możliwość usunięcia lokalnego cache, chmurowej kopii oraz dostępu konektora osobno.
- Wszystkie usługi i koszty zależne od faktycznego wolumenu danych; limity weryfikować przed wyborem planu.

## Źródła techniczne

- Apple File Provider i dokumenty: https://developer.apple.com/documentation/uikit/providing-access-to-directories
- Expo / native file picker (alternatywa do Capacitor): https://docs.expo.dev/versions/latest/sdk/document-picker/
- IndexedDB: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- Quota / eviction: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
- Supabase storage RLS: https://supabase.com/docs/guides/storage/security/access-control
- Supabase resumable uploads: https://supabase.com/docs/guides/storage/uploads/resumable-uploads
