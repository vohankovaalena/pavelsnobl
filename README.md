# pavelsnobl.cz

Statická (bezWixová) verze webu **pavelsnobl.cz** – jedna stránka, žádný build,
stačí nahrát obsah složky na hosting.

## Struktura

```
index.html              – obsah stránky (sémantické HTML)
css/style.css           – veškerý styl, členěný do očíslovaných sekcí
js/main.js              – jediná funkce: mobilní menu
assets/img/             – obrázky (staženo z Wixu, zmenšeno a znovu zkomprimováno)
assets/fonts/           – Garet Book (fírma webu), Work Sans, Mulish (self-hosted)
robots.txt              – pravidla pro roboty + odkaz na sitemapu
sitemap.xml             – jedna URL, `lastmod` je potřeba ručně aktualizovat
llms.txt                – shrnutí webu pro AI asistenty (llmstxt.org)
```

## Poznámky

* Písma jsou hostovaná lokálně, ne přes Google Fonts CDN – kvůli GDPR
  a nezávislosti na cizí službě.
* Garet Book je font nahraný na původním Wixu; Work Sans nahrazuje stejnojmenný
  font z Wixu, Mulish nahrazuje komerční Avenir (na Wixu licencovaný jen v rámci
  jejich platformy).
* Karty ve „Službách“ odkrývají seznam při najetí myší / při zaostření
  klávesnicí; na mobilu je seznam vidět rovnou – stejně jako na živém webu.

## SEO a GEO

* Titulek, popisek, canonical, Open Graph i Twitter Card jsou v `<head>`.
* Strukturovaná data (JSON-LD, jeden `@graph`) popisují osobu, poradenskou
  praxi, katalog služeb, web i stránku – slouží vyhledávačům pro rich results
  a AI asistentům jako podklad pro citaci.
* `robots.txt` **záměrně povoluje** AI crawlery (GPTBot, ClaudeBot,
  PerplexityBot, Google-Extended…), aby se web mohl objevovat v odpovědích
  AI asistentů. Pokud to není žádoucí, stačí u nich přepsat `Allow` na
  `Disallow`.
* Při změně obsahu je potřeba ručně srovnat tři místa: viditelný text,
  JSON-LD v `index.html` a `llms.txt`. Strukturovaná data nesmí tvrdit nic,
  co na stránce není vidět.
* Co web zatím nemá a nejvíc by pomohlo: sekce častých dotazů (FAQ) psaná
  v otázkách a odpovědích – přesně to, co AI asistenty i Google citují
  nejraději. Vyžaduje ale nový text a doplnění do designu.
