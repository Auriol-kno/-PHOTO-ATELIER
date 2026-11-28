# DATA MODEL v0.2

## Wspólne identyfikatory

- \`asset_id\` UUID, odrębny od nazwy lub ścieżki pliku.
- \`source_locator\`: \`provider\` (local-picker, pc-folder, iCloud, user-cloud), \`opaque_ref\`, \`needs_permission\`. Bez publicznego kopiowania prywatnych ścieżek.
- \`originals\`: SHA-256, rozmiar, media-type, camera/exif (tylko potrzebne), immutable=true, storage-provider, sync-state.
- \`previews\`: identyfikator asset, format, rozdzielczość, cache revision.
- \`recipes\`: nazwany styl, autor, zgodność, format wyjściowy (demo JSON / sprawdzony XMP / sprawdzony NP3), parametry, wersja, licencja.
- \`edits\`: asset_id, recipe_id, revision_id, wynik renderingu (opcjonalnie), czas, urządzenie.
- \`albums\`: id, nazwa, opis. Łączenie przez \`album_assets\` (nie przenoszenie oryginałów).
- \`sync_jobs\`: id, asset_id, operation, state (queued/running/error/done), progress, retries, checksum.

## Stany pliku

\`indexed\` → \`preview-ready\` / \`preview-unavailable\`; opcjonalnie \`original-local\`, \`original-cloud\`, \`needs-relink\`.

## Zapis edycji

Oryginał zawsze pozostaje poza miejscem modyfikacji. Lightroom XMP i Nikon NP3 nie są formatami zamiennymi. Dla obu tworzymy oddzielne zweryfikowane artefakty, nie automatyczną konwersję bajtów.
