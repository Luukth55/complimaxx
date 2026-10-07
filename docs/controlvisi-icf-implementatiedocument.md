# ControlVisi – ICF-module: uitwerking en implementatieplan

Versie 1.0 · 7 oktober 2026 · Status: concept ter bespreking (nog niets gebouwd in Lovable)

---

## 1. Doel en uitgangspunten

**Doel.** ControlVisi laat bedrijven hun In Control Framework (ICF) opzetten, uitvoeren, laten beoordelen en aantonen, zonder zware Excelbestanden. Bedrijven beginnen niet met een lege pagina: ze uploaden hun bestaande ICF of laten er een genereren.

**Uitgangspunten (door jou bepaald):**
1. **Simpel is de kracht.** Alleen de juiste dingen, niet te uitgebreid. Geavanceerde onderdelen staan standaard uit.
2. **Alle soorten bedrijven.** Eén kernmodel; lagen zijn aan te zetten (zie §5).
3. **Niet opnieuw beginnen.** Import van een bestaand ICF (Excel) en generatie met AI op basis van bedrijfsinfo.
4. **Tweetalig.** De hele tool is volledig te gebruiken in Nederlands én Engels, instelbaar.
5. **Fraaie export naar Excel** (en PDF) als auditrapport.
6. **Betrouwbaar voor auditors:** audit trail, vergrendelen van afgesloten perioden, functiescheiding.
7. **Eerst overleggen, dan wijzigen** in Lovable. Eerst de kern (generatie met gekoppelde onderdelen) goed krijgen.
8. **Licentie licht:** geldig tot een datum plus handmatig verlengen. Geen Stripe, betaling per factuur.
9. **Data in de EU.**

---

## 2. Wat is een ICF? (korte uitleg voor in de tool en de verkoop)

Een ICF legt vast dat een organisatie haar risico's beheerst en dat kan bewijzen. De keten:

**Risico → Control → Eigenaar & frequentie → Uitvoering met bewijs → Review → Uitkomst (groen/oranje/rood) → Bevinding & actie**

- **Risico:** wat kan er misgaan?
- **Control:** welke maatregel voorkomt of ontdekt dat?
- **Uitvoering:** de eigenaar voert de control uit en legt bewijs vast.
- **Review (2e lijn):** een onafhankelijk persoon beoordeelt.
- **Uitkomst:** groen = uitgevoerd zonder bevindingen; oranje = uitgevoerd met beperkte bevindingen; rood = uitgevoerd met significante bevindingen.

### SOX en COSO (de geavanceerde laag)
- **SOX (Sarbanes-Oxley):** Amerikaanse wet (2002) voor beursgenoteerde bedrijven en hun dochters. Een *SOX key control* is een control die jaarlijks door de accountant wordt getest, met een *testscript*. Voor de meeste mkb-bedrijven niet verplicht.
- **COSO:** internationaal raamwerk met vijf componenten: Control environment, Risk assessment, Control activities, Information & communication, Monitoring activities. Elke control krijgt een component, zodat zichtbaar is of het framework in balans is.
- In ControlVisi zijn dit **optionele velden** die per klant aan te zetten zijn.

---

## 3. Analyse van de twee voorbeeldbestanden

### 3.1 Allego (Integrated Control Framework, focus controls Q1-23)
Bladen: *Control Framework*, *Invoer* (keuzelijsten), *Risk universe level 1-3*, *Risk universe*.

- 332 controls, 251 unieke risico's (van de ingevulde regels).
- Disciplines: Financial (193), Process (82), IT (30), Entity Level Controls (27).
- **Kolommen per regel (~66):**
  - Indeling: Discipline, Scope, Sub-process, Value stream, Financial item, Source
  - Risico: Risk nr, Risk statement, Risk owner, Caused by, Effect/Impact, Risk Universe (3 niveaus)
  - Assertions: Accuracy, Completeness, Cutoff, Existence & Occurrence, Presentation & Disclosure, Rights & Obligations, Valuation
  - Control: Control nr, Key Control Activity, Control owner, Frequency, Category (review / transactional / ITGC / ELC / SOD), Classification (manual / IT-dependent manual / automated / direct of indirect ELC), Preventative/Detective, Fraud consideration
  - Systeem & bewijs: bronsysteem, kritieke rapporten en spreadsheets, Completeness / Accuracy / Validity (IPE), Restricted access
  - SOX: SOX key control, Test script, klaar om te testen in week X, gerelateerde controls
  - Uitvoering: per maand een vinkje, specificaties/opmerkingen en acties
  - Review: Reviewer 2e lijn en opmerkingen 2e lijn
- Keuzelijsten (Invoer): Discipline, Scope (balans, W&V, FSCP, O2C, P2P, H2R, Strategic, General IT, Application IT, Tax-onderdelen), Risk Universe, Value stream, Financial item (18), Source, Frequentie (daily, weekly, monthly, quarterly, semi-annual, annual, as needed, automated), SOX Ja/Nee, Type (key / non-key), COSO-componenten.
- Risk universe: boom Level 1 (Business, Financial, …) → Level 2 → Level 3.

### 3.2 Essent (ICF Servicepartner)
Bladen: *Overzicht* (dashboard), *Service Partner* (framework + testplan), *Blad1* (keuzelijsten).

- 97 controls in 22 categorieën: balansposten (vaste activa, huur/lease, onderhanden werk, voorraden, debiteuren, liquide middelen, overlopende activa/passiva, voorzieningen, crediteuren), resultatenrekening (omzet, kosten, personeel), belastingen (loonheffing, btw, vpb), procescontroles (betaling, opbrengsten, inventarisatie, inkoop), IT (general en application controls).
- Quality Controls bovenaan (4 vragen met status).
- Kolommen: ID, Categorie, Frequentie, Required (verplicht aantal), Planned (gepland aantal), Type (bijv. "Aans." = aansluiting), jaarplanning per maand, en per maand een apart testblok met status + commentaar.
- Statussen: **N.V.T., Niet gepland, Gepland (niet getest), Groen, Oranje, Rood**.
- Dashboard: per maand het aantal controls per status, totaal en per categorie (Financial, Tax, Process & IT), met legenda.
- Frequentie-logica: Maand = 12, Kwartaal = 4, Jaar = 1 keer per jaar.

### 3.3 Wat we overnemen
| Van | Wat |
|---|---|
| Allego | Risico → control-structuur, risk universe als boom, eigenaren, frequentie, preventief/detectief, handmatig/geautomatiseerd, review 2e lijn, SOX/COSO als optionele laag |
| Essent | Statusmodel, jaarplanning per maand, verplicht vs. gepland, dashboard per status/maand/categorie, kwaliteitscontroles |
| Beide | Bewijs en opmerkingen per uitvoering |

---

## 4. Datamodel

Alle tabellen krijgen `tenant_id` (klant), `created_at`, `created_by`, `updated_at`, `updated_by`. Gebruik UUID's.

| Tabel | Belangrijkste velden |
|---|---|
| **tenant** (bedrijf) | naam, branche, taal (nl/en), licentie_geldig_tot, geavanceerde_laag (bool), bedrijfsinfo |
| **user / membership** | user_id, tenant_id, rol, afdeling_id, plaatsvervanger_id |
| **department** | naam, tenant_id (uit FitVisi) |
| **risk_category** | boom: parent_id, naam (risk universe), tenant_id of globaal sjabloon |
| **risk** | nr, omschrijving, categorie_id, eigenaar_id, oorzaak, effect; optioneel: assertions (jsonb) |
| **control** | nr, omschrijving, discipline/categorie, eigenaar_id, frequentie, type (preventief/detectief), uitvoering (handmatig/geautomatiseerd), actief; optioneel: coso_component, sox_key, testscript, fraudeoverweging, bronsysteem |
| **control_risk** | control_id, risk_id (veel-op-veel) |
| **control_occurrence** | control_id, periode (jaar, maand), status, gepland_op, uitgevoerd_op, uitvoerder_id, opmerking, vergrendeld (bool) |
| **evidence** | occurrence_id, bestand, versie, geupload_door, geupload_op |
| **review** | occurrence_id, reviewer_id, uitkomst (groen/oranje/rood), opmerking, datum |
| **finding_action** | occurrence_id of control_id, omschrijving, eigenaar_id, deadline, status |
| **audit_log** | tenant_id, tabel, record_id, actie, oud (jsonb), nieuw (jsonb), user_id, tijdstip |
| **framework_template** | branche, taal, inhoud (risico's, controls), versie |
| **import_job** | bestand, mapping (jsonb), status, foutenlijst |
| **i18n** | (alleen indien vertalingen van frameworkinhoud in de database worden opgeslagen, zie §8) |

### Statussen van een uitvoering
`nvt` → `niet_gepland` → `gepland` → (uitgevoerd, wacht op review) → `groen` | `oranje` | `rood`

Een rood of oranje resultaat vraagt om minimaal één bevinding/actie. Een groen resultaat vraagt om bewijs (instelbaar per control).

### Planning genereren
Uit `frequentie` wordt het aantal occurrences per jaar afgeleid: daily/weekly worden samengevoegd tot maandelijks vastleggen (tool is geen dagregistratie), monthly = 12, quarterly = 4, semi-annual = 2, annual = 1, as needed = op aanvraag. De gebruiker kan de gewenste maanden aanpassen (Essent: "Required" vs. "Planned").

---

## 5. Lagen (simpel houden)

| Laag | Wat | Voor wie |
|---|---|---|
| **Basis (altijd)** | Risico, control, eigenaar, frequentie, type, uitvoering, bewijs, review, dashboard, export | Iedereen |
| **Geavanceerd (aan per klant)** | SOX key control, COSO-component, assertions, testscript, fraudeoverweging, IPE (completeness/accuracy/validity), bronsysteem | Beursgenoteerd, auditgevoelig, grote organisaties |
| **Later** | Branchesjablonen, koppelingen, advies-AI | Groei |

Het schakelen gebeurt in de instellingen van het bedrijf. Velden van de geavanceerde laag zijn verborgen zolang deze uit staat, maar de data blijft bewaard als de laag later wordt uitgezet.

---

## 6. Functionele uitwerking per scherm

### 6.1 Onboarding (eerste keer)
1. Bedrijfsinformatie (met AI-ondersteuning zoals in FitVisi): naam, branche, grootte, taal, afdelingen, rollen en mensen.
2. Keuze: **A. Bestaand ICF uploaden**, **B. Laten genereren**, **C. Leeg starten**.
3. Optioneel: geavanceerde laag aanzetten.
4. Korte rondleiding.

### 6.2 Import van een bestaand ICF (Excel)
Waar in de tool: in de onboarding (stap 2A) én op het Framework-scherm via "Importeren" (om later aan te vullen).

Stappen:
1. **Upload** .xlsx (of .csv). Maximumgrootte instellen (bijv. 20 MB).
2. **Blad kiezen** (bijv. "Control Framework Allego" of "Service Partner").
3. **Koppelscherm:** herkende kolomkoppen worden automatisch aan velden gekoppeld; de gebruiker kan aanpassen. Voorstel van koppeling per kolom, met voorbeeldwaarden.
4. **Voorbeeldscherm:** de eerste 20 regels zoals ze worden opgeslagen, met waarschuwingen (dubbele nummers, lege eigenaar, onbekende frequentie).
5. **Waardenmapping:** onbekende waarden koppelen aan keuzelijsten (bijv. "Monthly" → maandelijks, "Quarterly" → kwartaal, "Preventive" en "Preventative" → preventief).
6. **Eigenaren koppelen** aan gebruikers (op naam of e-mail); onbekende namen kunnen als "nog toe te wijzen" worden opgeslagen.
7. **Bevestigen en importeren.** Resultaat: rapport met aantal toegevoegd/overgeslagen/fouten, en een downloadbare foutenlijst.
8. **Ongedaan maken:** een import is als geheel terug te draaien zolang er geen uitvoeringen op zijn vastgelegd.

Extra's:
- Importeer ook historie (per maand een X of status) optioneel, als gearchiveerde uitvoering zonder bewijs.
- Herken Allego- en Essent-achtige formaten als voorgedefinieerde mappingprofielen. Test hier mee.
- Behandel Excel als onbetrouwbare invoer: formules niet uitvoeren, cellen schoonmaken, grootte en aantal regels begrenzen.

### 6.3 Framework (risico's en controls)
- Lijst met filters: categorie, eigenaar, frequentie, type, status, zoekterm.
- Groeperen per categorie of per risico.
- Detailscherm: risico, gekoppelde controls, eigenaar, historie.
- Bulk-acties: eigenaar wijzigen, frequentie wijzigen, deactiveren.
- Wijzigingen worden gelogd.

### 6.4 Generatie met AI
- Invoer: bedrijfsinfo, branche, afdelingen, optioneel scope (bijv. alleen financieel en IT).
- Uitvoer: voorgesteld framework (risico's, controls, eigenaar op rol, frequentie).
- **Alles is een concept** dat een mens moet goedkeuren (aanvinken en bewerken) vóór het in het framework komt.
- Taal volgt de bedrijfsinstelling; vertaling op verzoek.
- Gebruikt sjablonen per branche als uitgangspunt wanneer beschikbaar.
- Opnieuw genereren voor een deel (bijv. alleen IT) zonder de rest te overschrijven.
- Logging: welke prompt/versie het voorstel maakte, voor herleidbaarheid.

### 6.5 Jaarplanning
- Rasterweergave zoals Essent: controls × 12 maanden, met kleuren per status.
- Filter per categorie en eigenaar.
- Planning aanpassen door klikken; "verplicht" vs. "gepland" aantal zichtbaar.
- Nieuw jaar: planning kopiëren van vorig jaar.

### 6.6 Mijn taken (uitvoerder)
- Lijst van wat nu uitgevoerd moet worden, met deadline.
- Eén scherm per control: omschrijving, instructie, bewijs uploaden, opmerking, "Afronden".
- Doel: in één minuut klaar.

### 6.7 Review (2e lijn)
- Lijst "te beoordelen".
- Beoordelaar bekijkt bewijs, kiest groen/oranje/rood, voegt opmerking toe, maakt bij oranje/rood een bevinding/actie.
- **Functiescheiding:** uitvoerder kan eigen uitvoering niet beoordelen.
- Na beoordeling: periode wordt vergrendeld (zie §7).

### 6.8 Bevindingen en acties
- Lijst met eigenaar, deadline en status; achterstallige acties in beeld.
- Koppeling naar de control en de uitvoering waaruit ze volgden.

### 6.9 Dashboard
Naar voorbeeld van Essent, met:
- Aantal controls per status per maand (N.V.T., niet gepland, gepland, groen, oranje, rood).
- Totaal en per categorie of discipline.
- Voortgang jaar tot nu toe (uitgevoerd t.o.v. gepland).
- Achterstallige controls en acties.
- Top-risico's met rode controls.
- Met geavanceerde laag: verdeling over COSO-componenten en SOX key-controls.

### 6.10 Export (fraai naar Excel + PDF)
**Excel-export** (met een betrouwbare bibliotheek, bijv. exceljs):
- Opmaak: bedrijfsnaam en logo, koptitels, kleuren per status, vaste kopregel, filters, kolombreedtes, bevroren panelen, afdrukinstellingen.
- Bladen: *Overzicht* (dashboard-cijfers), *Framework*, *Planning* (maandraster met kleuren), *Uitvoering* (met opmerkingen), *Bevindingen*, *Legenda*, *Info* (gegenereerd op, door wie, periode, versie).
- Keuze: periode, categorie, alleen afgeronde, met/zonder opmerkingen.
- Taal volgt keuze bij export (NL of EN).
- Geavanceerde laag: aanvullende kolommen/bladen.
- Het exportbestand moet in Essent- en Allego-achtige indeling te openen zijn, zodat het bruikbaar is voor een auditor die gewend is aan Excel.

**PDF-rapport:** voor een auditpakket met samenvatting, dashboard en bevindingen.

---

## 7. Betrouwbaarheid, auditability en beveiliging

### 7.1 Audit trail
- Elke wijziging aan risico, control, uitvoering, review, bewijs en rechten wordt gelogd (wie, wat, wanneer, oud, nieuw).
- Logboek is niet te wijzigen door gebruikers (alleen toevoegen), en inzichtelijk voor beheerder en auditor.
- Implementatie: database-triggers of server-side functies, zodat het niet omzeild kan worden vanuit de browser.

### 7.2 Vergrendelen van perioden
- Na review is de uitvoering vergrendeld: status, opmerking en bewijs zijn niet meer te wijzigen.
- Heropenen kan alleen door een beheerder met verplichte reden; dit wordt gelogd en zichtbaar in het rapport.

### 7.3 Functiescheiding
- Uitvoerder ≠ reviewer, afgedwongen in de database.
- Beheerders kunnen geen uitvoeringen namens anderen afronden zonder zichtbare markering ("namens").

### 7.4 Rollen en rechten
| Rol | Rechten |
|---|---|
| Beheerder | Alles binnen het bedrijf: gebruikers, framework, instellingen, import/export |
| Controle-eigenaar (uitvoerder) | Eigen controls uitvoeren, bewijs uploaden |
| Reviewer (2e lijn) | Beoordelen, bevindingen maken |
| Auditor | Alleen lezen, inclusief audit trail en export; optioneel tijdelijke toegang met einddatum |
| Directie/Manager | Dashboard en rapporten |
| Platformbeheerder (jij) | Licenties beheren; geen standaardtoegang tot klantdata |

### 7.5 Multi-tenancy (data van klant A nooit zichtbaar voor klant B)
- `tenant_id` op elke tabel.
- **Row Level Security** in de database (Supabase/PostgreSQL) die op `tenant_id` en rol filtert; niet alleen in de schermen.
- Bestanden in opslag in een pad per tenant met toegangsregels.
- Tests: een gebruiker van tenant A mag in geen enkele tabel of bestand data van B zien (automatische test).

### 7.6 Beveiliging
- Versleuteling onderweg (HTTPS) en opgeslagen (database en bestandsopslag).
- Inloggen met e-mail/wachtwoord; optioneel tweestapsverificatie, verplicht voor beheerders (aanbevolen).
- Sessies met time-out; poging-beperking bij inloggen.
- Bestandsupload: type en grootte controleren, virusscan indien mogelijk.
- Back-ups (dagelijks) met geteste herstelprocedure.
- Geheimen (API-sleutels) alleen server-side.

### 7.7 Privacy (AVG)
- Opslag in de EU.
- Verwerkersovereenkomst met klanten; overzicht van subverwerkers (hosting, AI-aanbieder, e-mail).
- Privacyverklaring en algemene voorwaarden in NL en EN.
- Bewaartermijnen instelbaar; verwijderen van een bedrijf of gebruiker op verzoek.
- Voor de AI: duidelijk vastleggen welke gegevens naar de AI-aanbieder gaan (bedrijfsinfo, geen persoonsgegevens waar het niet hoeft) en dat invoer niet voor training wordt gebruikt.

---

## 8. Tweetaligheid (NL/EN)

- **Interface:** alle teksten via een vertaalbestand (sleutels), twee talen volledig. Taalkeuze per gebruiker (in instellingen) met bedrijfsstandaard.
- **Inhoud van het framework** (risico's, controls): voorstel is dat elke tekst in één taal wordt opgeslagen (de taal van het bedrijf), met een **optionele vertaling** per veld (NL/EN). De AI kan de vertaling voorstellen; de gebruiker keurt goed. Zo blijft het simpel en kan een Engelstalige auditor toch mee lezen.
- **Sjablonen** in beide talen.
- **Export** in de gekozen taal.
- **E-mails** in de taal van de ontvanger.
- **Datum- en getalnotatie** volgt taalkeuze.
- **Juridische pagina's en marketing:** NL en EN.
- Test: elke schermtekst heeft een vertaling (automatische controle op ontbrekende sleutels).

*Open punt: bevestig dat "inhoud één taal + optionele vertaling" aansluit bij wat je wilt.*

---

## 9. Licenties (licht)

- Veld `licentie_geldig_tot` per bedrijf; handmatig te verlengen door platformbeheerder.
- Signalering: melding aan beheerder 30 en 7 dagen vóór het verlopen.
- Na verlopen: alleen-lezen (data blijft zichtbaar en exporteerbaar) in plaats van volledige blokkade. Voorstel, ter bespreking.
- Geen Stripe; facturatie buiten de tool per factuur.
- Prijsstructuur en huisstijl nog niet vastgesteld.

---

## 10. Herinneringen en werkdruk

- E-mail naar uitvoerder bij naderende deadline en bij te laat; wekelijkse samenvatting voor beheerder.
- Plaatsvervanger bij afwezigheid.
- Instelbaar: frequentie en aan/uit.
- Taal volgt ontvanger.

---

## 11. Branchesjablonen (fase 4)

- Per branche (bijv. energie, bouw, zorg, handel, dienstverlening, IT) een startframework in NL en EN.
- Gebaseerd op de structuur van de voorbeeldbestanden: financieel (balans, W&V, belasting), proces, IT, entity level.
- Versiebeheer van sjablonen; klant kiest sjabloon bij onboarding en past aan.
- Inhoud wordt inhoudelijk getoetst door een vakexpert (jij of een externe controller) vóór gebruik.

---

## 12. Fasering

| Fase | Inhoud | Resultaat |
|---|---|---|
| **0. Voorbereiding** | Overleg, beslissingen (§15), testbestanden Allego/Essent klaarzetten | Besluiten vastgelegd |
| **1. Fundament** | Datamodel, tenant-scheiding (RLS), rollen, audit trail-basis, i18n-structuur, afdelingen/rollen/mensen overnemen uit FitVisi, licentieveld | Veilige basis |
| **2. Framework & instroom** | Framework-scherm, AI-generatie (concepten + goedkeuring), Excel-import (met mapping), lege start | Bedrijf heeft een framework |
| **3. Uitvoering** | Jaarplanning, Mijn taken, bewijs, review, vergrendelen, bevindingen/acties | ICF draait |
| **4. Inzicht** | Dashboard, Excel-export (fraai), PDF-rapport | Aantoonbaar naar auditor |
| **5. Afronding** | Herinneringen, geavanceerde laag (SOX/COSO), juridische pagina's NL/EN, rondleiding, demodata | Klaar voor pilot |
| **6. Pilot & groei** | Pilotklant, feedbackrondes, branchesjablonen | Eerste betalende klant |

**Prioriteit** (zoals eerder besproken): eerst de kern (generatie met gekoppelde onderdelen) goed laten werken, daarna de rest.

---

## 13. Testplan

- **Functioneel:** per scherm een testscript (aanmaken, wijzigen, verwijderen, filteren).
- **Import:** testbestanden Allego en Essent; foutgevallen (lege regels, dubbele nummers, onbekende waarden, grote bestanden, rare tekens, formules).
- **Rechten:** per rol wat wel en niet mag; functiescheiding; vergrendeling.
- **Tenant-isolatie:** automatische testen op alle tabellen en bestandspaden.
- **Audit trail:** wijzigingen verschijnen compleet; logboek is niet te wijzigen.
- **Export:** opent foutloos in Excel; opmaak klopt; NL/EN.
- **Taal:** geen ontbrekende vertalingen.
- **Prestaties:** 500 controls × 12 maanden blijft vlot (planning en dashboard).
- **Demobedrijf** met gevulde voorbeelddata voor demo's.

---

## 14. Risico's en aandachtspunten

| Risico | Maatregel |
|---|---|
| Te veel velden maakt de tool zwaar | Lagen; geavanceerd standaard uit |
| Verschillende Excelformaten bij import | Mapping + voorbeeldscherm + profielen; handmatig bijstellen |
| AI verzint onjuiste controls | Altijd concept + menselijke goedkeuring; sjablonen door vakexpert getoetst |
| Datalek tussen klanten | RLS + automatische tests + bestandspaden per tenant |
| Auditor vertrouwt tool niet | Audit trail, vergrendelen, functiescheiding, exports die lijken op wat ze kennen |
| Privacy/AI-verwerking | Verwerkersovereenkomst, EU-opslag, minimale gegevens naar AI |
| Licentie verloopt onopgemerkt | Meldingen + alleen-lezen i.p.v. blokkade |
| Wijziging in Lovable breekt bestaande functies | Eerst overleggen, kleine stappen, testen na elke stap |

---

## 15. Besluiten en open punten

**Besloten:**
- Alle soorten bedrijven; één kernmodel met lagen.
- Excel-import van bestaand ICF; bedrijven hoeven niet opnieuw te beginnen.
- Fraaie Excel-export.
- Tool volledig in NL en EN.
- Audit trail en vergrendelen vanaf de eerste versie.
- Data in de EU.
- SOX/COSO als optionele laag.

**Nog te bevestigen / uit te werken:**
1. Frameworkinhoud: één taal + optionele vertaling (voorstel §8)?
2. Na verlopen licentie: alleen-lezen (voorstel) of blokkade?
3. Eerste pilotklant en branche voor de eerste sjablonen.
4. Plaats van import in de flow: onboarding + Framework-scherm (voorstel §6.2); nog even bekijken wat het handigst is in de bestaande app.
5. Huisstijl en prijsstructuur (nog niet beslist).
6. Moeten daily/weekly controls echt per dag/week worden vastgelegd, of volstaat een maandelijkse samenvatting (voorstel)?
7. Welke AI-aanbieder en welke gegevens worden meegestuurd (voor de verwerkersovereenkomst)?
8. Of tweestapsverificatie verplicht wordt voor beheerders.

---

## 16. Werkwijze met Lovable

1. Eerst per fase de wijzigingen **bespreken en goedkeuren** (zoals afgesproken).
2. Per fase een kort bouwverzoek (prompt) opstellen op basis van dit document, met testbestanden als voorbeeld.
3. Na elke stap controleren in de preview en de wijzigingen nalopen.
4. Het bestaande project (Control Hub Pro / CompliMaxx) wordt hernoemd naar ControlVisi; Stripe verwijderen; taalkeuze toevoegen.
5. Dit document is de bron; wijzigingen in besluiten hier bijwerken.

---

## 17. Bijlage – Bronbestanden

- *In Control Framework (ICF) Essent* (.xlsx): bladen Overzicht, Service Partner, Blad1.
- *Integrated Control Framework Allego – focus controls Q1-23* (.xlsx): bladen Control Framework Allego, Invoer, Risk universe Allego level 1-3, Risk universe Allego.

Let op: de bestanden bevatten namen van personen en interne bedrijfsinformatie van derden. Gebruik ze als voorbeeld/testbestand; neem geen echte namen of inhoud over in sjablonen of demodata zonder toestemming.
