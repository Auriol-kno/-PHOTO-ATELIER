# CLOUD SETUP — plan wdrożenia (NIEAKTYWNY)

**Stan:** brak podłączonego projektu Supabase. Żaden upload chmurowy nie działa, nie ma loginu ani automatycznej synchronizacji.

## Zalecany stack

- Supabase Auth (opcjonalne logowanie użytkownika)
- Supabase Postgres (metadane, katalog, albumy, wersje receptur)
- Supabase Storage, **prywatne buckety**: \`photo-previews\`, \`photo-originals\` (tylko opt-in), \`photo-exports\`
- Lokalna baza IndexedDB w PWA; natywna SQLite po dodaniu shell iOS
- Docelowy Windows companion do indeksowania folderów

## Kolejność

1. Utworzyć projekt Supabase w koncie właściciela (bez hardkodowania kluczy).
2. Utworzyć tabele \`assets\`, \`source_locations\`, \`albums\`, \`album_assets\`, \`recipes\`, \`sync_jobs\`. Każda tabela prywatna posiada \`user_id\` powiązany z \`auth.uid()\`.
3. Włączyć RLS **we wszystkich tabelach prywatnych**, polityki SELECT/INSERT/UPDATE/DELETE z \`user_id = auth.uid()\`.
4. Utworzyć bucket \`photo-previews\` (private). Dodawać obiekty wyłącznie pod prefiksem \`<auth.uid()>/<asset_id>/preview.jpg\`; RLS kontroluje nazwę właściciela.
5. \`photo-originals\` i \`photo-exports\` również private, osobne ograniczenia rozmiarów i typów oraz uprawnienia.
6. Upload oryginałów tylko po osobnej zgodzie. Duże pliki przesyłać resumable TUS; walidować checksums i resume/retry.
7. Linki do odczytu z autoryzacją lub krótkotrwałe signed URLs. Brak \`public=true\` dla fotografii użytkownika.
8. Zaprojektować eksport, trwałe usuwanie danych, odłączenie konta i oddzielne czyszczenie cache.
9. Dodać alert o danych EXIF i lokalizacji GPS.
10. Dopiero potem zintegrować UI. **Nie wdrażać automatycznego uploadu bez testów i wyraźnej zgody.**

## Bezpieczeństwo

Nigdy nie umieszczać \`service_role\` w aplikacji mobilnej lub w GitHub. Klucz publiczny anon/publishable może być w kliencie tylko przy prawidłowych RLS. Wszystkie operacje ograniczone do użytkownika. Nie uznawać samych prywatnych bucketów za wystarczającą izolację bez testów RLS.

## Alternatywne źródła plików

Na iOS iCloud Drive, Drive, OneDrive i Dropbox są widoczne przez systemową aplikację Pliki, jeśli dostawca obsługuje File Provider i jest skonfigurowany. To daje selekcję pliku, nie ciągłą indeksację czy synchronizację.

## Niezbędne testy przed produkcją

Dwa konta, izolacja między użytkownikami, błędne uprawnienia, wznawianie uploadu, limity rozmiaru, utrata zasięgu, konflikt zmian, usuwanie, bezpieczeństwo share linków, eksport danych.
