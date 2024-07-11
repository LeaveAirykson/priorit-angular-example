## Verwendete Technologien

- Angular 15
- chart.js
- ts-prune
- Tailwind CSS
- Jest

## Anmerkungen

- Die Validierung der ISBN Nummer inkludiert neben der Prüfung der Syntax auch die Überprüfung der Prüfziffer. Dieses Verhalten lässt sich für die Testzwecke über die Demo Toolbar deaktivieren.
- Über den Button "Testdaten erstellen" werden vordefinierte Bücher erstellt um das Interface schneller testen zu können.
- Nachdem es kein Backend gibt, beinhaltet das Beispiel gewisse Logiken, die in der Praxis sinnvoller serverseitig abgehandelt werden sollten. Wie Beispielsweise das speichern, suchen, filtern und sortieren der Datensätze.
- Die Filter gelten als "und" Konditionen, wobei für die Felder "Sprache" und "Sachgruppe" bei einer Mehrauswahl "oder" Konditionen ausgeführt werden.
- Der 10% Zuschlag für deutsche Bücher wird von der Zwischensumme (Basisbetrag \* Faktor) berechnet.

## Verbesserungen/weitere Überlegungen

- Die Datentabelle gibt aktuell alle Daten aus. Es wäre in der Praxis sinnvoll eine Pagination in der Datentabelle zu verwenden um die Performance zu verbessern.
- Filter: Sachgruppe könnte man per Regex lösen um auf die ersten 3 Gliederungsebenen zu matchen. Beispiel: 500, 500.100, 500.234.
- Man könnte mittels Shortcuts die UX deutlich verbessern.
