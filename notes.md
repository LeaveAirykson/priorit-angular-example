## Verwendete Technologien

- Angular 15
- chart.js
- ts-prune
- Tailwind CSS
- Jest

## Anmerkungen

- Die ISBN Nummer wird nicht nur syntaktisch validiert, sondern auch deren Prüfzimmer. Dieses Verhalten lässt sich für die Testzwecke über die Toolbar unten deaktivieren.
- Über den Button "Testdaten erstellen" werden 6 vordefinierte Bücher erstellt um das Interface schneller testen zu können.
- Nachdem es kein Backend gibt, beinhaltet das Beispiel gewisse Logiken, die in der Praxis sinnvoller serverseitig abgehandelt werden sollten. Wie Beispielsweise das laden, suchen, filtern, sortieren der Datensätze.
- Die Filter gelten als "und" Konditionen, wobei für die Felder "Sprache" und "Sachgruppe" bei einer Mehrauswahl "oder" Konditionen ausgeführt werden.

## Verbesserungen/weitere Überlegungen

- Die Datentabelle gibt aktuell alle Daten aus. Es wäre in der Praxis sinnvoll eine Pagination in der Datentabelle zu verwenden um die Performance zu verbessern.
- Filter: Sachgruppe könnte man per Regex lösen um auf die ersten 3 Gliederungsebenen zu matchen. Beispiel: 500, 500.100, 500.234.
- Man könnte mittels Shortcuts die UX deutlich verbessern.
