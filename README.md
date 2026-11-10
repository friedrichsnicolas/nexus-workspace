# neXus Workspace

Installierbare Web-App für iPhone, iPad und Desktop. Drei vorhandene neXus-Tools in ihren neuesten gefundenen Fassungen, mit gemeinsamem Einstieg und Navigation. Keine externen Laufzeitabhängigkeiten.

## GitHub Pages
1. Repository `nexus-workspace` mit Standardbranch `main` anlegen.
2. Inhalt dieses Ordners einschließlich `.github/workflows/pages.yml` hochladen. `dist` und `.github` müssen unmittelbar im Repository liegen.
3. Settings → Pages → Build and deployment → Source: GitHub Actions.
4. Unter Actions den Workflow „Deploy neXus Workspace“ ausführen (oder einen Commit auf main pushen).
5. Die URL steht im erfolgreichen Deployment unter Environments / github-pages.

Quelle: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## iPhone und iPad
URL in Safari öffnen, Teilen → Zum Home-Bildschirm. Erst nach der Meldung „Für Offline-Nutzung vorbereitet“ offline verwenden. Jedes Modul öffnet im selben App-Fenster. Touch-/Stiftunterschriften bleiben Teil des Protokolls. Echte Geräteprüfung steht aus.

## Daten und Exporte
Keine automatische Speicherung, kein Backend, keine Gerätesynchronisation. Vor Modulwechsel/Schließen JSON exportieren. Exitgespräch und Übergabeprotokoll behalten ihre bestehenden JSON-Funktionen. Der Bewertungsrechner hat ergänzend JSON-Import/Export. PDF: Druckfunktion im Modul → Systemdialog → PDF sichern/teilen. Verhalten des Druckdialogs auf iOS/iPadOS bitte auf dem Zielgerät prüfen.

GitHub Pages stellt den App-Code bereit; es ist keine Benutzerverwaltung implementiert. Keine ausgefüllten HR-Formulare oder personenbezogenen JSON-Dateien ins Repository hochladen. Die App wird ohne Fallakten ausgeliefert.

## Enthaltene Originalfassungen
- neXus_Bewertungsrechner_2027_erweitert.html
- neXus_AP19_Exitgespraech_Interaktiv_mit_Logo.html
- neXus_Uebergabe_Rueckgabeprotokoll_Getrennte_Vorgaenge.html

Frühere Versionen derselben Tools wurden nicht als zusätzliche Module übernommen. Private Tools sind nicht enthalten.

## Wartung
Bei Änderungen an Offline-Dateien die CACHE-Version in dist/sw.js erhöhen. Nach Schließen aller App-Fenster wird der neue Service Worker beim nächsten Start aktiv. Kein Build erforderlich.
