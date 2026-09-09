# Plán úprav – index.html / style.css / main.js

Vychází z revize webu. Body jsou seřazené podle priority v rámci každé
kategorie. Odkazy na řádky jsou z revize a mohou se posunout po prvních
úpravách.

Vizuální regrese ověřená Playwrightem (`tools/vizref.mjs` +
`tools/vizdiff.mjs`) v 14 rozlišeních + 3 interaktivních stavech, viz
poznámky u jednotlivých bodů a shrnutí na konci souboru.

## Hotovo

- [x] **Aktuální rok v patičce přes JS** – statická hodnota `2026` v
  index.html nahrazena `<span data-rok>2026</span>`, js/main.js ji při
  načtení přepíše na `new Date().getFullYear()`. Bez JS zůstává fungovat
  fallback (aktuální rok napevno).

## Nově nahlášené vizuální chyby (mobil)

- [x] **LinkedIn ikona pod fotkou autora není na mobilu vidět.**
  Přesunuta dovnitř `<figure class="about__figure">` a pozicovaná
  procentuálně (`left`/`bottom` v `%`) místo dřívějších pevných margin
  hacků opakovaných zvlášť pro každý breakpoint. Škáluje se automaticky
  s kruhovou fotkou, na mobilu teď sedí u levého okraje kruhu stejně
  jako na desktopu. `.about__badge` zkontrolován, nepřekrývá se
  (badge nahoře vpravo, LinkedIn dole vlevo).

- [x] **Texty v sekci „O mně“ jsou na mobilu zarovnané na střed, mají být
  doprava.** `text-align:center` → `right` u `.hero__title`,
  `.hero__tagline`, `.about`, `.about__name`, `.about__text`;
  `.about{justify-items:center→end}` a `.badges{align-items:center→flex-end}`
  změněny společně s text-align (grid/flex kontejnery). `.sluzby__head`/
  `.rozhovory__head` ponechány na střed – jde o samostatné pill nadpisy,
  ne o pokračování textu „O mně“ (viz poznámka v původním bodu o scope).
  Ověřeno na 900/901px hranici, plynulý přechod bez přeskoku.

## Přístupnost

- [x] **Skip link neviditelný i po zaostření.** Přidána
  `a.visually-hidden:focus` varianta – po Tabu se zobrazí jako červená
  pilulka vlevo nahoře, čitelný text.

- [x] **`tabindex="0"` na kartách služeb jako berlička pro hover efekt.**
  Zvoleno řešení B z revize: obsah karty (ikona + seznam) je teď vidět
  natrvalo na všech šířkách, stejně jako už dřív na mobilu – žádný
  hover/focus-within trik, žádný tabindex. **Toto je jediná položka,
  která mění vzhled desktopové verze viditelně** (karty jsou vyšší,
  seznam služeb je vidět bez najetí myší) – schválně, jde o přímý
  důsledek opravy přístupnosti, ne o regresi.

- [x] **Nadpisová hierarchie neodpovídá struktuře.**
  `<h2 class="about__name">` → `<p>` (jde o stylizované jméno vedle H1,
  ne o nadpis nové sekce). Patička: `h4` + `div` → `<dl><dt><dd>`
  (Telefon/Email/Sítě nejsou nadpisy, ale popisky). Stejný vzorec
  aplikován i na kontaktní blok v sekci Klienti (`h3` → `dt`/`dd`) pro
  konzistenci.

- [x] **`<figcaption>` „O mně“ popisuje sekci, ne fotku.**
  Změněno na `<span class="pill about__badge">` uvnitř `<figure>` –
  vizuálně beze změny, sémanticky už netvrdí, že jde o popisek fotky.

## Sekce kontakt

- [x] **`id="kontakt"` visí na `<div>` uvnitř sekce Klienti.**
  Předěláno na vnořenou `<section id="kontakt" aria-labelledby="kontakt-nadpis">`
  s vlastním (vizuálně skrytým, `.visually-hidden`) `<h2>Kontakt</h2>`.
  Zůstává vnořená uvnitř `.section--klienti` kvůli sdílenému pozadí
  (stejný obrázek/overlay jako klienti), ale má teď vlastní smysluplný
  landmark a nadpis. Vizuálně 100% beze změny (nadpis je jen pro
  screen readery).

## Opakující se kód / duplicitní data

- [x] **Kontakt (telefon, e-mail) natvrdo na 6 místech.** Minimální
  varianta z revize: přidány komentáře „při změně uprav i JSON-LD“ u
  JSON-LD bloku, kontaktní sekce, karet služeb a rozhovorů. Generování
  z jednoho zdroje (Eleventy/Astro/skript) je větší infrastrukturní
  změna nad rámec tohoto refactoringu statických souborů – neděláno,
  viz shrnutí na konci.

- [x] **Per-klientské CSS třídy jen kvůli výšce obrázku.** Pět pravidel
  `.klienti__item--*{height:…}` nahrazeno `style="--h:113px"` na
  `<figure>` a jedním sdíleným `.klienti__item img{height:var(--h)}`.

- [x] **Čtyři prázdné `<div class="section__bg">`.** Nahrazeno
  `.section::before`/`::after`. Menší DOM, odpadl `aria-hidden` na
  těchto 4 elementech.

## Výkon

- [x] **Preloaduje se jen font Garet.** Přidán preload pro
  `worksans-latin.woff2` a `mulish-latin.woff2`. Mrtvý `garet-book.woff`
  fallback smazán ze souborového systému i z `@font-face`.

- [x] **Hero pozadí se objeví až po CSS.** Přidán
  `<link rel="preload" as="image" href="assets/img/bg-hero.jpg">`.

- [ ] **Žádné responzivní obrázky.** **Neděláno** – vyžaduje reálné
  generování zmenšených/WebP variant (image pipeline), na tomto stroji
  není k dispozici spolehlivý WebP encoder (`sips` to nepodporuje) a
  stávající obrázky jsou už rozumně velké (nejtěžší `bg-klienti.jpg`
  306 kB, zbytek pod 170 kB) – riziko vizuálních artefaktů z ručního
  zmenšení bez zavedeného pipeline převažuje nad přínosem v rámci
  tohoto refactoringu. Zůstává jako doporučení do budoucna.

## Drobnosti

- [x] `- moderní řešení` → `– moderní řešení` (pomlčka místo spojovníku).
- [x] `<br class="br-lg">` odstraněn, nahrazen `text-wrap:balance` na
  `.about__text p`.
- [x] YouTube odkaz „Nejslavnější světoví sportovci…“ zbaven tracking
  parametrů (`?si=…&feature=youtu.be`), sjednoceno s ostatními čtyřmi.
- [ ] `#top` na hero a `#obsah` na `main` – **ponecháno beze změny.**
  Slouží dvěma různým účelům (logo/domů vs. skip-link cíl obsahu), i
  když teď míří na téměř stejné místo; sloučení by tyto role smísilo
  a plán sám to označoval jen jako „zvážit“, ne jako jasný požadavek.
- [x] `document.body.style.overflow` → `document.documentElement.dataset.navOpen`,
  zámek scrollu (`overflow:hidden`) přesunut do CSS
  (`html[data-nav-open='true']`).

## Shrnutí refactoringu (viz commit)

Hotovo vše kromě dvou bodů, oba vědomě ponechány a zdůvodněny výše:
responzivní obrázky (chybí spolehlivé nástroje na WebP na tomto stroji)
a sloučení `#top`/`#obsah` (plán to jen navrhoval ke zvážení, ne jako
požadavek, a role obou kotev jsou odlišné).

Jediná viditelná změna vzhledu na desktopu: karty služeb teď zobrazují
seznam trvale (dřív jen na hover) – přímý důsledek opravy
přístupnosti (`tabindex="0"` jako berlička). Vše ostatní ověřeno
Playwright screenshoty jako vizuálně shodné s verzí před refactoringem
(`screenshots/before` vs. `screenshots/after`, lokálně, negitované).
