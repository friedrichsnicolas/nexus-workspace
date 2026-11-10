# neXus Workspace

Installierbare Web-App für iPhone, iPad und Desktop. HR-Werkzeuge mit gemeinsamem Einstieg, Navigation und lokaler Vorgangsverwaltung. Keine externen Laufzeitabhängigkeiten.

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
Kein Backend und keine Gerätesynchronisation. Alle vier Werkzeuge können über „Entwurf speichern“ lokal auf diesem Gerät gesichert werden. Vor Modulwechsel/Schließen speichern; ungespeicherte Änderungen werden beim Verlassen angekündigt. Unter „Entwürfe“ lassen sich Vorgänge öffnen, kopieren, durchsuchen, filtern, in den Papierkorb verschieben und wiederherstellen. Eine vollständige JSON-Sicherung enthält auch den Papierkorb. Beim Import werden vorhandene Vorgänge niemals überschrieben; Kollisionen werden als zusätzliche Kopie importiert. Browserdaten löschen entfernt die lokalen Entwürfe. Regelmäßig Sicherungen herunterladen. Exitgespräch und Übergabeprotokoll behalten ihre bestehenden JSON-Funktionen. Der Bewertungsrechner hat ergänzend JSON-Import/Export. PDF: Export im Modul; die vorgeschaltete Prüfung blockiert fehlende Pflichtangaben und meldet mögliche Widersprüche. Der Zeugnisgenerator bietet zusätzlich echten, bearbeitbaren DOCX-Export mit Logo, A4-Briefkopf, Blocksatz und Seitenzahlen. Verhalten des Druckdialogs auf iOS/iPadOS bitte auf dem Zielgerät prüfen.

GitHub Pages stellt den App-Code bereit; es ist keine Benutzerverwaltung implementiert. Keine ausgefüllten HR-Formulare oder personenbezogenen JSON-Dateien ins Repository hochladen. Die App wird ohne Fallakten ausgeliefert.

## Erweiterungen
- Positionsvorlagen Associate, Consultant, Senior und Managing Consultant. Einsatzbereich und Aufgaben bleiben individuell bearbeitbar. Vorlagen ersetzen vorhandene Texte erst nach Bestätigung.
- Keine gemeinsame Mitarbeiter-Stammdatenbank. Namen in einzelnen Formularen gehören ausschließlich zum jeweiligen Vorgang.

## Entwicklung
Kein Build erforderlich. Für die Funktionsprüfungen: `npm install`, danach `npm test` (Node.js 18 oder neuer). Der Test lädt die lokalen HTML-Module in einer virtuellen DOM-Umgebung und prüft Speicher-/Wiederherstellungsabläufe, Vorlagen und Validierung.

Die Word-Bibliothek docx 9.5.1 wird lokal ausgeliefert; Lizenz: `dist/LICENSE-docx.txt`.

## Enthaltene Originalfassungen
- neXus_Bewertungsrechner_2027_erweitert.html
- neXus_AP19_Exitgespraech_Interaktiv_mit_Logo.html
- neXus_Uebergabe_Rueckgabeprotokoll_Getrennte_Vorgaenge.html

Frühere Versionen derselben Tools wurden nicht als zusätzliche Module übernommen. Private Tools sind nicht enthalten.

## Wartung
Bei Änderungen an Offline-Dateien die CACHE-Version in dist/sw.js erhöhen. Nach Schließen aller App-Fenster wird der neue Service Worker beim nächsten Start aktiv. Kein Build erforderlich.

Onboarding-/Offboarding-Checklisten und Freigabestatus wurden entfernt. Lokale Entwürfe und alte Sicherungen bleiben lesbar. Ältere Checklisten werden nicht mehr angezeigt; sie bleiben in der Gesamtsicherung erhalten.

## neXus Corporate Design
Das Frontend verwendet Original-Logo, neXus-Blau #225378 / #286893 und ein gemeinsames Layout. Geräte-Badges und Installationsanleitung sind entfernt. Die Hausschrift IdealistSans-Light wird mit der unveränderten Original-OTF-Datei lokal ausgeliefert, vorgeladen und für Offline-Nutzung zwischengespeichert. Eine Installation der Schrift auf dem Gerät ist nicht erforderlich. Copyright und Lizenzhinweis stehen in `dist/fonts/NOTICE-IdealistSans.txt`. Die PDF- und Word-Brieflayouts bleiben davon unabhängig.
