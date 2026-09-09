# Vizuální reference (před / po refactoringu)

Malé skripty mimo samotný web. Nasazení na GitHub Pages se netýkají,
`screenshots/` a `node_modules/` jsou v `.gitignore`.

## Instalace (jednou)

    npm --prefix tools install

## Použití

    node tools/vizref.mjs --out screenshots/before   # stav před úpravou
    # …refactoring…
    node tools/vizref.mjs --out screenshots/after    # stav po úpravě
    node tools/vizdiff.mjs screenshots/before screenshots/after

`vizdiff` vypíše u každého snímku počet a procento změněných pixelů
a rozdílové obrázky uloží do `screenshots/diff/`.

## Co se fotí

- 14 celostránkových snímků v šířkách kolem breakpointů z `css/style.css`
  (1100, 900, 640) – vždy těsně pod a nad hranicí.
- 3 stavy, které na statické fotce nejsou vidět: otevřené mobilní menu,
  karta služby pod myší (`:hover`), skip link po zaostření tabulátorem.

Snímky jsou deterministické – animace a přechody skript vypíná, takže dva
běhy nad nezměněným webem dají bit po bitu stejné soubory a v diffu není šum.
