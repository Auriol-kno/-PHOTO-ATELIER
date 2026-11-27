# QA — manual + static checks

## Zweryfikować lokalnie przed PR

- \`npm run check\` — składnia JS.
- \`python -m http.server 4173\`, otworzyć w Chromium/Safari.
- Każda z 5 dolnych zakładek działa; wszystkie moduły w menu Więcej otwierają się.
- Zaimportować JPG i PNG, sprawdzić powstanie miniatury.
- Zaimportować NEF: katalog pokazuje RAW, bez podglądu; nie zmienia oryginału.
- Odświeżyć stronę: indeks i podglądy utrzymują się, jeśli IndexedDB nie został wyczyszczony.
- Porównać wybrane zdjęcie w A/B, zmienić styl i przesunąć suwak.
- Usuń wpis z katalogu: oryginał pozostaje na dysku.
- Eksport/Import katalogu JSON: metadane wracają, ale miniatury nie (jawnie).
- Progress Academy i Missions przetrwa odświeżenie.
- Motywy jasny/ciemny, cel dotykowy >=44px, dostępność na 390x844.
- Sprawdzić iOS Safari i uruchomienie z ekranu początkowego.
- Sprawdzić brak zapytań uploadujących użytkownika.
- PWA w trybie offline po pierwszym uruchomieniu na HTTPS.

## Znane ograniczenia

- Nie ma backendu, prawdziwego AI, wywoływania RAW, konwersji NP3/XMP, chmurowego sync ani desktop companion.
- Stylizacja Compare Lab przez CSS jest tylko makietą, bez gwarancji powtarzalności kolorów.
- Podgląd zdjęć z HEIC/TIFF zależy od przeglądarki.
- IndexedDB może zostać usunięty z powodu kwoty/zwolnienia miejsca.
- Użyte w mockupie zdjęcia Unsplash są ładowane zewnętrznie; trzeba zapewnić odpowiednie licencje i offline placeholdery.
