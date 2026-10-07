# ControlVisi – Samenvoeging pakket + ICF en AI-aanpak

Versie 1.0 · 7 oktober 2026 · Status: concept ter goedkeuring (nog niets gebouwd)

Dit document legt de punten recht waarop `controlvisi-specificatie.md` (pakket, generatie, frameworks, scores) en `controlvisi-icf-implementatiedocument.md` (ICF, uitvoering, review) elkaar tegenspreken, en beschrijft hoe AI zo goed en slim mogelijk wordt ingezet. **Bij strijd gaat dit document voor.**

Markeringen zoals in de specificatie: **[BESLOTEN]**, **[VOORSTEL]**, **[OPEN]**.

---

## 1. Eén product, twee lagen

Pakket en ICF zijn geen twee producten maar twee lagen:

| Laag | Vraag | Inhoud |
|---|---|---|
| **Pakket** (ontwerp) | Wat zou moeten gelden voor dit proces? | Per proces gegenereerde risico's, controls, key controls, testplannen, framework-dekking, gaps, scores |
| **ICF** (uitvoering) | Wat voeren we echt uit, door wie, hoe vaak en met welk resultaat? | Per organisatie en jaar: planning, uitvoering, bewijs, review, uitkomst, bevindingen |

### 1.1 Pakketcontrols opnemen in het ICF **[BESLOTEN]**
1. In een pakket komt de knop **"Opnemen in ICF"**, per control of voor een selectie.
2. Opnemen is **handmatig met bevestiging** (geen automatisme). De gebruiker vult aan wat het pakket niet weet: eigenaar, frequentie, geplande maanden, key control ja/nee.
3. Het ICF bewaart een **eigen kopie** met `source_control_id` (verwijzing naar de bron). Latere wijziging of hergeneratie van het pakket verandert een ICF-control met uitvoeringshistorie **nooit** stilzwijgend. Reden: een auditor moet kunnen zien wat er destijds gold.
4. Verschilt de bron van de kopie, dan toont het ICF "bron gewijzigd" met de keuze **overnemen** of **negeren** (de AI vat het verschil samen, zie §5.7).
5. Controls die direct in het ICF worden aangemaakt (of via import) hebben geen bron en blijven gewoon bestaan.

### 1.2 Gevolg voor het ICF-document
De aparte "AI-generatie van een framework" (ICF §6.4) vervalt. Een ICF vullen wordt: processen kiezen → pakketten genereren met de 4-stappenpijplijn, frameworkbibliotheek en scores uit de specificatie → opnemen in het ICF. **Er is één generatiemotor.**

---

## 2. Namen, rollen en rechten

- **Naam:** `organization_id` (niet `tenant_id`). Overal.
- **Rollen** **[VOORSTEL]** – ontwerpen en uitvoeren zijn verschillend werk, dus niet geforceerd samengevoegd:

| Rol | Vervangt | Rechten |
|---|---|---|
| Beheerder | admin | Alles binnen de organisatie: gebruikers, instellingen, pakketten, ICF, import/export, heropenen van perioden |
| Opsteller | editor | Pakketten maken en bewerken, controls opnemen in het ICF, framework beheren |
| Uitvoerder | (nieuw) | Eigen controls uitvoeren, bewijs uploaden |
| Reviewer | (nieuw) | Uitvoeringen beoordelen, bevindingen maken |
| Auditor | deel van viewer | Alleen lezen, inclusief audit trail en export; optioneel met einddatum |
| Directie | deel van viewer | Dashboard en rapporten |

- Zolang de ICF-module uit staat blijven admin/editor/viewer gelden (uit de specificatie).
- **Functiescheiding** (uitvoerder ≠ reviewer, afgedwongen in de database) geldt alleen in het ICF.
- Platformbeheerder blijft apart (`platform_admins`), zonder standaardtoegang tot klantdata.

---

## 3. Evidence: twee begrippen

| Begrip | Waar | Betekenis |
|---|---|---|
| **Bewijseis** | Op de control (pakket én ICF) | Welk bewijs wordt verwacht (de checklist uit de specificatie) |
| **Bewijs** | Bij één uitvoering in één periode | Een geüpload bestand, met versies |

- Bij "Opnemen in ICF" wordt de bewijseis meegekopieerd.
- **Bewijs verplicht ja/nee is een instelling per control**, standaard verplicht bij key controls en optioneel bij de rest. **[VOORSTEL]**

---

## 4. Eén fasering

De specificatiefasen blijven de ruggengraat; de ICF-module is een tweede spoor dat erop bouwt. **[VOORSTEL]**

| Stap | Inhoud | Bron |
|---|---|---|
| A | Fundament: organisatie, rechten, audit trail-basis, i18n, bedrijfsinformatie, afdelingen, rollen | Spec fase 1 (+ audit trail uit ICF §7) |
| B | Motor: frameworkbibliotheek, 4-staps generatie, scores | Spec fase 2 |
| C | Pakketscherm: intake, controlemoment, resultaat, bewerken | Spec fase 3 |
| D | Frameworks laag 2 en 3 | Spec fase 4 |
| E | **Brug** "Opnemen in ICF" | Nieuw (§1) |
| F | ICF-uitvoering: jaarplanning, mijn taken, bewijs, review, vergrendelen, bevindingen | ICF fase 3 |
| G | Inzicht: dashboard, Excel-/PDF-export | ICF fase 4 |
| H | Afronden: herinneringen, SOX/COSO-laag, juridisch NL/EN, licentie, huisstijl | Spec fase 5 + ICF fase 5 |

Principe **[BESLOTEN]**: eerst pakketten volledig laten werken (A t/m C), daarna de rest.

---

## 5. AI zo goed en slim mogelijk inzetten

### 5.1 Uitgangspunten
1. **AI stelt voor, de mens beslist.** AI schrijft nooit een uitvoeringsstatus (groen/oranje/rood), reviewuitkomst, goedkeuring of vergrendeling. Dat blijft altijd een menselijke handeling.
2. **Alles wat AI maakt is herkenbaar** (`ai_generated`, AI-label) en gaat pas na bevestiging het framework in. `user_edited` wordt nooit overschreven (AR-06).
3. **Berekenen in code, niet in AI**: scores, ratings, nummering, planning, gaps (AR-09).
4. **Context in plaats van gokken**: AI gebruikt bedrijfscontext, afdelingen, rollen en documentsamenvattingen; ontbrekende info wordt benoemd, niet verzonnen (AR-07).
5. **Privacy**: geen persoonsnamen in prompts (V-01); alleen de minimaal benodigde gegevens; nooit trainen op klantdata (contractueel vastleggen, O-07).
6. **Afgesloten perioden zijn voor AI onaanraakbaar.**

### 5.2 Waar AI wordt ingezet

| # | Toepassing | Wat de AI doet | Wat de mens doet | Fase |
|---|---|---|---|---|
| 1 | **Pakketgeneratie** (4 stappen, controlemoment) | Proces, RACI, risico's, controls, testplannen, evidence, framework-dekking | Bevestigt na stap 1, keurt items goed | B |
| 2 | **Bedrijfsinformatie** | Website scannen, documenten samenvatten, checklist voor ontbrekende info | Kiest wat overgenomen wordt | A |
| 3 | **Rolvoorstellen** | Stelt ontbrekende rollen voor met reden | Accepteert, koppelt of wijst af | B |
| 4 | **Kwaliteitscheck op controls** | Beoordeelt per control: concreet? toetsbaar (wie/wat/wanneer/bewijs)? dubbel met een andere control? | Past aan of negeert de suggestie | C |
| 5 | **Gap → maatregel** | Stelt bij een gap een concrete control of actie voor, gekoppeld aan de eis | Neemt over als control/actie | C |
| 6 | **Opnemen in ICF** | Stelt eigenaar, frequentie en maanden voor op basis van risico, control en rollen | Bevestigt per control | E |
| 7 | **Bron-gewijzigd-samenvatting** | Vat in gewone taal samen wat er veranderd is tussen bron en ICF-kopie | Kiest overnemen/negeren | E |
| 8 | **Importassistent** | Stelt kolomkoppeling en waardenmapping voor, herkent eigenaren en frequenties | Controleert voorbeeldscherm en bevestigt | F |
| 9 | **Bewijs-voorcontrole** | Vergelijkt een geüpload bewijs met de bewijseis ("lijkt dit het gevraagde rapport, voor de juiste periode?") | Reviewer beslist; AI-oordeel is alleen een hint | F |
| 10 | **Bevinding → oorzaak en actie** | Bij oranje/rood: stelt oorzaak, impact en herstelactie voor | Keurt actie goed, kiest eigenaar | F |
| 11 | **Dashboard-duiding** | Schrijft een korte managementtekst: wat gaat goed, wat loopt achter, waar zit het risico | Leest en gebruikt of negeert | G |
| 12 | **Signalering** | Wijst op patronen: controls die steeds te laat zijn, risico's met alleen detectieve controls, eigenaren met te veel controls | Beslist of er actie nodig is | G |
| 13 | **Frameworkwijziging** | Toont welke pakketten/controls geraakt worden als een eis in de bibliotheek wijzigt | Beslist per pakket | D/H |
| 14 | **Vraag het ControlVisi** (later) | Beantwoordt vragen in gewone taal over de eigen data ("welke key controls zijn dit kwartaal rood?"), alleen-lezen, binnen de rechten van de gebruiker | Controleert antwoord aan de hand van bronverwijzingen | later |

### 5.3 Slimmer, niet alleen meer
- **Gestructureerde output** via function calling, eenvoudig schema; grenzen in de beschrijving, afdwingen in code (AR-01, AR-04).
- **Stap voor stap, hervatbaar**: elke AI-stap logt in `generation_runs` (AR-15) en kan los herhaald worden.
- **Zelfcorrectie**: na validatie volgt één gerichte herstelronde voor alleen het ontbrekende (bijv. controls voor risico's zonder control); blijft het fout, dan een zichtbare waarschuwing.
- **Bronverwijzingen**: bij elk AI-voorstel wordt getoond waarop het steunt (document, framework-eis, bedrijfscontext), zodat de gebruiker kan verifiëren.
- **Eerst een goedkoop model waar het kan**: classificeren, mappen, samenvatten en kwaliteitschecks op een snel model; generatie van risico's/controls op een sterker model. De keuze per taak wordt gemeten, niet aangenomen.
- **Kostenbewaking**: rate-limit per organisatie (V-05), tokenbudget per aanroep, gebruiksteller op de server, geen dubbele aanroepen voor ongewijzigde invoer (resultaat hergebruiken bij identieke invoer).
- **Prompts onder versiebeheer**: elke AI-aanroep slaat promptversie en model op, zodat een voorstel later herleidbaar is.

### 5.4 Evaluatie van de AI zelf **[VOORSTEL]**
- Een vaste **synthetische testset** van procesbeschrijvingen (zelf geschreven, zonder echte bedrijfsdata), met geautomatiseerde controles: elk risico heeft een control, elke control een eigenaar uit de rollen, elke gap herleidbaar tot een eis, aantallen binnen de bandbreedte, geen lege secties.
- Daarna een inhoudelijke leesbeoordeling, en vóór externe "audit-ready"-claims een review door een specialist (O-04).
- Bij elke promptwijziging dezelfde set opnieuw draaien en vergelijken.

### 5.5 Wat AI bewust niet doet
- Geen automatische uitvoeringsstatus, review of goedkeuring.
- Geen wijziging in afgesloten perioden of het eerder vastgelegde bewijs.
- Geen juridisch of auditadvies; elk pakket blijft "AI-concept, laat controleren door een professional" (AR-12).
- Geen persoonsnamen of persoonsgegevens in prompts waar dat niet nodig is.

### 5.6 Audit trail van AI
Elke AI-actie die data raakt (voorstel gemaakt, voorstel overgenomen, voorstel afgewezen) komt in de audit trail met gebruiker, taak, model en promptversie. Zo is later te zien wat de AI voorstelde en wat de mens koos.

### 5.7 Voorbeeld: bron-gewijzigd (toepassing 7)
Een pakket wordt opnieuw gegenereerd; control C-007 is veranderd. Het ICF-exemplaar toont: *"Bron gewijzigd: frequentie van maandelijks naar wekelijks; extra eis dat de goedkeuring in het ERP wordt vastgelegd."* Met knoppen **Overnemen** en **Negeren**. De uitvoeringshistorie blijft altijd ongemoeid.

---

## 6. Excel-voorbeeldbestanden **[BESLOTEN]**
De Excelbestanden van Allego en Essent blijven **buiten de repository en worden niet gebruikt** als testbestand, fixture of mappingprofiel. Ze bevatten namen van personen en interne informatie van derden. Passages in het ICF-document die ze daarvoor noemen zijn aangepast. Excel-import als functie blijft bestaan; testdata hiervoor wordt synthetisch en zelf geschreven (en eventueel later geanonimiseerd, alleen na een aparte beslissing).

---

## 7. Open punten

1. **[OPEN]** Rolnamen definitief (§2): beheerder/opsteller/uitvoerder/reviewer/auditor/directie akkoord?
2. **[OPEN]** Bewijs verplicht: standaard alleen bij key controls akkoord (§3)?
3. **[OPEN]** Welke AI-toepassingen uit §5.2 horen bij de eerste versie, en welke later? Voorstel: 1, 2, 3, 4, 5 vroeg; 6–10 samen met de ICF-fasen; 11–14 pas na een pilot.
4. **[OPEN]** AI-aanbieder, regio en dataverwerking (O-07 uit de specificatie) – vooraf nodig voor de verwerkersovereenkomst.
5. **[OPEN]** Daily/weekly controls: per dag/week vastleggen, of maandelijks samenvatten (voorstel: maandelijks).
6. Overige open punten uit specificatie §11 en ICF §15 blijven gelden (prijs, huisstijl, pilotklant, 2FA voor beheerders).

*Einde document.*
