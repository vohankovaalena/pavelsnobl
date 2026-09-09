# Plán úprav – index.html / style.css / main.js

Vychází z revize webu. Body jsou seřazené podle priority v rámci každé
kategorie. Odkazy na řádky jsou z revize a mohou se posunout po prvních
úpravách.

## Hotovo

- [x] **Aktuální rok v patičce přes JS** – statická hodnota `2026` v
  [index.html:383](index.html#L383) nahrazena `<span data-rok>2026</span>`,
  [js/main.js](js/main.js#L1-L5) ji při načtení přepíše na `new Date().getFullYear()`.
  Bez JS zůstává fungovat fallback (aktuální rok napevno).

## Nově nahlášené vizuální chyby (mobil)

- [ ] **LinkedIn ikona pod fotkou autora není na mobilu vidět.**
  Aktuálně: `.about__linkedin{margin:-18px auto 0}` v
  [style.css:506](css/style.css#L506) (media query `max-width:900px`) ikonu
  vycentruje pod kruhovou fotkou a posune nahoru – v praxi zaniká.
  Na desktopu/1100px je stejná ikonka odsazená ke straně
  (`margin-left:53px` resp. `8%`, [style.css:235](css/style.css#L235),
  [493](css/style.css#L493)) a je vidět.
  → **Cíl:** na mobilu ikonu umístit ke straně fotky stejně jako na velkém
  webu (ne vycentrovanou pod ni). Při úpravě zkontrolovat i `.about__badge`
  (štítek „O mně“, [style.css:491](css/style.css#L491)), ať se nepřekrývají,
  a ověřit, že ikona není odříznutá kvůli `overflow-x:hidden` na `body`
  ([style.css:79](css/style.css#L79)).

- [ ] **Texty v sekci „O mně“ jsou na mobilu zarovnané na střed, mají být
  doprava** (jako na velkém webu / v původním designu).
  Zasažená pravidla v media query `max-width:900px`:
  - [style.css:501](css/style.css#L501) `.hero__title{text-align:center}`
  - [style.css:502](css/style.css#L502) `.hero__tagline{text-align:center}`
  - [style.css:504](css/style.css#L504) `.about{...text-align:center}`
  - [style.css:508](css/style.css#L508) `.about__name{text-align:center}`
  - [style.css:509](css/style.css#L509) `.about__text{text-align:center}`
  - [style.css:513](css/style.css#L513) `.sluzby__head,.rozhovory__head{text-align:center}`
  → **Cíl:** nahradit `center` za `right` (přesný scope potvrdit proti
  referenčnímu/původnímu designu – nemusí platit pro úplně všechny bloky,
  např. karty služeb mají vlastní centrování řešit zvlášť).
  Pozor na `.about{justify-items:center}` – u grid/flex kontejnerů je
  potřeba měnit i zarovnání položek (`justify-items`/`align-items`), ne jen
  `text-align`.

## Přístupnost

- [ ] **Skip link neviditelný i po zaostření.**
  `.visually-hidden` ([style.css:99](css/style.css#L99)) použitý na odkazu
  „Přejít na obsah“ ([index.html:159](index.html#L159)) nemá `:focus`
  pravidlo – klávesnicový uživatel na něj natabuje, ale nic neuvidí.
  → Přidat `:focus` variantu, která element vrátí do layoutu (viditelné
  pozadí, čitelný text).

- [ ] **`tabindex="0"` na kartách služeb jako berlička pro hover efekt.**
  [index.html:236](index.html#L236), [248](index.html#L248) – obsah karty
  (`.card__list`) se na desktopu zobrazí jen při `:hover`/`:focus-within`
  ([style.css:330-335](css/style.css#L330-L335)). Fokusovatelný element bez
  role a bez vysvětlení chování je matoucí pro screen reader i pro
  hybridní (dotyk+myš) zařízení.
  → Zvážit `<button>`/`<details>` s explicitním stavem, nebo obsah nechat
  vidět trvale jako na mobilu ([style.css:514-520](css/style.css#L514-L520)).

- [ ] **Nadpisová hierarchie neodpovídá struktuře.**
  - `h2` „Pavel Šnobl“ ([index.html:210](index.html#L210)) je podnadpis
    sloganu, ne nadpis druhé úrovně obsahu.
  - Patička používá `h4` ([index.html:363](index.html#L363),
    [366](index.html#L366), [370](index.html#L370)) bez `h3` nadřazeného
    kontextu; „Telefon / Email / Sítě“ nejsou skutečné nadpisy – vhodnější
    `<dl>` nebo prostý text.
  → Sjednotit hierarchii, případně přehodnotit, co má být nadpis a co popisek.

- [ ] **`<figcaption>` „O mně“ popisuje sekci, ne fotku.**
  [index.html:194](index.html#L194) – sémanticky mimo, `figcaption` patří
  k obsahu `<figure>` (fotce), ne k celé sekci.

## Sekce kontakt

- [ ] **`id="kontakt"` visí na `<div>` uvnitř sekce Klienti.**
  [index.html:343](index.html#L343) – nav odkaz „Kontakt“ vede doprostřed
  cizí sekce, blok navíc nemá vlastní `h2`.
  → Předělat na samostatný `<section id="kontakt">` s vlastním nadpisem.

## Opakující se kód / duplicitní data

- [ ] **Kontakt (telefon, e-mail) natvrdo na 6 místech.**
  JSON-LD: [index.html:57](index.html#L57), [83](index.html#L83),
  [94-95](index.html#L94-L95); viditelný obsah:
  [346](index.html#L346), [350](index.html#L350), [364](index.html#L364),
  [368](index.html#L368). Stejný vzorec u LinkedIn URL (3×) a u seznamu
  služeb (`hasOfferCatalog` [106-122](index.html#L106-L122) vs. karty
  [240-256](index.html#L240-L256)) i u rozhovorů
  ([127-131](index.html#L127-L131) vs. [272-301](index.html#L272-L301)).
  → Minimálně komentář „při změně uprav i JSON-LD“; ideálně generovat
  stránku z jednoho zdroje dat (malý build krok – Eleventy/Astro/skript).

- [ ] **Per-klientské CSS třídy jen kvůli výšce obrázku.**
  [style.css:412-416](css/style.css#L412-L416) – pět pravidel typu
  `.klienti__item--soucek img{height:113px}`. Jsou to data ve stylopisu.
  → Nahradit `style="--h:113px"` na `<figure>` (nebo doladit `width`/`height`
  atributy) a jedno sdílené pravidlo `.klienti__item img{height:var(--h)}`.

- [ ] **Čtyři prázdné `<div class="section__bg">`.**
  [index.html:185](index.html#L185), [229](index.html#L229),
  [265](index.html#L265), [313](index.html#L313) – čistě prezentační,
  duplicitní napříč sekcemi.
  → Nahradit `.section::before`/`::after`, zmenší se DOM a odpadne
  `aria-hidden` na těchto elementech.

## Výkon

- [ ] **Preloaduje se jen font Garet.**
  [index.html:36](index.html#L36) – Work Sans a Mulish
  ([style.css:16-46](css/style.css#L16-L46)) se stáhnou až po CSS, takže
  text v nich krátce problikne fallbackem (FOIT/FOUT).
  → Preloadnout aspoň latin varianty obou. Zároveň `garet-book.woff`
  ([style.css:11](css/style.css#L11)) je mrtvá váha – dnešní prohlížeče
  otevřou woff2, woff fallback lze smazat.

- [ ] **Hero pozadí se objeví až po CSS (typicky nejhorší LCP na stránce).**
  [style.css:184](css/style.css#L184) – `background-image` na
  `.section--hero .section__bg`.
  → `<link rel="preload" as="image" href="assets/img/bg-hero.jpg">` v
  `<head>`.

- [ ] **Žádné responzivní obrázky.**
  Logo 1080×192, fotka 960×960, ikony karet 604×604 – na mobil jde stejný
  soubor jako na 4K monitor.
  → `srcset`/`sizes` + WebP varianty; z celého seznamu pravděpodobně
  největší úspora dat.

## Drobnosti

- [ ] [index.html:188](index.html#L188): `- moderní řešení` – spojovník
  místo pomlčky `–`, zbytek webu má typografii sjednocenou.
- [ ] [index.html:220](index.html#L220): `<br class="br-lg">` jako layoutové
  zalomení řádku – křehké vůči změně textu. Zvážit `text-wrap: balance`
  nebo úpravu `max-width`.
- [ ] [index.html:291](index.html#L291): jediný YouTube odkaz nese tracking
  parametry `?si=…&feature=youtu.be`, ostatní čtyři jsou čisté – sjednotit.
- [ ] `#top` na hero ([index.html:184](index.html#L184)) a `#obsah` na
  `main` ([index.html:181](index.html#L181)) míří prakticky na totéž místo
  – zvážit sloučení.
- [ ] [js/main.js:12](js/main.js#L17): `document.body.style.overflow`
  zapisuje inline styl přímo z JS. Čistší řešení: `data-open` na `<html>`
  a zámek scrollu (`overflow:hidden`) řešit v CSS – JS pak drží jen stav,
  ne vzhled.

## Doporučené pořadí (nejlepší poměr přínos/riziko)

1. LinkedIn ikona na mobilu (vizuální bug, reportovaný uživatelem)
2. Zarovnání textů na mobilu (vizuální bug, reportovaný uživatelem)
3. Skip link `:focus`
4. Klientské výšky obrázků přes CSS proměnnou
5. `section__bg` → `::before`/`::after`
6. Preload fontů + hero obrázku
