# ControlVisi – Verslag van het gesprek en de besluiten

**Datum:** dinsdag 6 oktober 2026, ongeveer 19:25 tot 21:55 (Amsterdam)
**Deelnemers:** Luuk en Claude
**Doel van dit bestand:** vastleggen wat we hebben besproken, wat Claude heeft gevonden, wat we hebben besloten en wat nog open staat. Het hoort bij de specificatie `controlvisi-specificatie.md`.

> **Let op:** dit is een **reconstructie en samenvatting**, geen letterlijk transcript. Alle inhoudelijke bevindingen, voorstellen, vragen en antwoorden zijn opgenomen; formuleringen zijn ingekort. Antwoorden van Luuk zijn zo letterlijk mogelijk overgenomen (met kleine spellingcorrecties).

**Belangrijkste afspraak:** er is in de hele sessie **niets in Lovable aangepast of uitgevoerd**. Alles was lezen, analyseren en overleggen. Claude heeft de twee Lovable-projecten alleen gelezen (en één read-only telling in de database van het oude project gedaan).

---

## Inhoud

1. Samenvatting in één oogopslag
2. Ronde 1: analyse van "Control Hub Pro"
3. Ronde 2: nieuwe wensen en eerste voorstel
4. Ronde 3: antwoorden en uitgewerkt plan
5. Ronde 4: onderdelen van FitVisi meenemen
6. Ronde 5: eerst de kern
7. Ronde 6: frameworks, beoordeling en uitwerking
8. Ronde 7: de twee bestanden
9. Besluitenlogboek
10. Voorstellen van Claude die Luuk nog moet bevestigen
11. Open punten
12. Wat Claude niet heeft gecontroleerd
13. Feiten en referenties uit het onderzoek
14. Volgende stappen

---

## 1. Samenvatting in één oogopslag

- **Uitgangspunt:** de bestaande Lovable-tool "Control Hub Pro" (merknaam CompliMaxx) wordt omgebouwd tot **ControlVisi**, een derde tool in de familie naast FlowVisi en FitVisi.
- **Wat de tool doet:** van een procesbeschrijving een compleet control-pakket genereren (processtappen, RACI, risico's, controls, testplannen, evidence, framework-dekking, gaps, score).
- **Wat verandert:** Stripe verdwijnt (betalen per factuur, licentie handmatig), er komen organisaties met rechten, afdelingen, rollen & personen en bedrijfsinformatie met AI (uit FitVisi), de generatie wordt in 4 stappen met een controlemoment opnieuw gebouwd, scores en gaps worden berekend, er komt een kleine frameworkbibliotheek (16 frameworks in drie lagen) en de tool wordt tweetalig (NL/EN).
- **Volgorde:** eerst de kern (fase 1 basis, fase 2 motor, fase 3 scherm), daarna frameworks (fase 4) en afronding (fase 5).
- **Nog open:** prijsstructuur, huisstijl, een aantal voorstellen van Claude ter bevestiging, wie de specialist-review doet, en juridische en e-mailpunten.

---

## 2. Ronde 1: analyse van "Control Hub Pro"

### Wat Luuk vroeg
> "Ik wil graag dat je Project Control Hub Pro gaat bekijken. Bekijk deze in Lovable. Niks aanpassen, alleen analyseren: wat doet deze tool en hoe werkt dit."

### Wat Claude deed
Claude zocht in de Lovable-workspace "Luuk's Lovable" (12 projecten; Pro-plan), vond het project **Control Hub Pro** (id `00b3137f-2b42-4dbd-bccb-452f8bf8d010`; gemaakt 19 nov 2025, laatst bewerkt 19 nov 2025, gepubliceerd en publiek) en las projectgegevens, de bestandslijst, de belangrijkste pagina's, de datatypes, de edge functions en twee van de zeven migraties. De live app is niet doorgeklikt; alleen de screenshot van de landingspagina is bekeken.

### Wat de tool is
Het product heet in de app **CompliMaxx**: een "Integrated Control – Compliance – Audit Platform". Je beschrijft een proces in gewone tekst, kiest frameworks, en de AI genereert in één keer een compleet audit-pakket (ongeveer tien documenttypen: procesflows, RACI, risico's, controls, risico-control-mapping, key controls, control objectives, framework-mappings, gaps, testplannen, evidence-checklist, audit readiness score). Doelgroep: internal audit, risk en compliance.

### Hoe het werkt
1. Inloggen via Supabase Auth; een profiel met plan, maandlimiet en gebruikte packages.
2. Generate-pagina: frameworks kiezen (beperkt door plan), procesbeschrijving plakken; de edge function `generate-documentation` roept Gemini 2.5 Pro aan via de Lovable AI Gateway met een strak JSON-schema (function calling) en slaat het resultaat op in aparte tabellen onder één project.
3. Projects en Project Detail: pakket in drie tabs (Internal Control, Compliance, Audit); dashboard met gebruik, aantal projecten en recente activiteit (realtime).
4. Betalen via Stripe met drie functions (`create-checkout`, `customer-portal`, `check-subscription`); `check-subscription` zoekt de klant op e-mail en zet plan en limiet in het profiel.
5. Prijzen (op de landing): Free trial (3 dagen, 5 packages), Starter 29/maand, Pro 79/maand, Enterprise 199/maand.
6. Gegevensscheiding via Row Level Security: alle tabellen koppelen via `project_id` aan de eigenaar.

### Wat opviel (bevindingen)
**Beveiliging**
- `generate-documentation` vertrouwt het `userId` uit de request-body en schrijft met de service-role key. Er zat geen controle van de ingelogde gebruiker in (of JWT-verificatie in `config.toml` aanstaat is niet gecontroleerd). Gevolg: iedereen kon mogelijk AI-kosten veroorzaken en projecten onder andermans account aanmaken.
- De eerste migratie liet gebruikers hun eigen profiel updaten zonder kolombeperking (plan en limiet wijzigbaar). De teller van gebruikte packages werd in de browser opgehoogd.

**Bugs en inconsistenties**
- `key_controls` staat alleen prioriteiten Critical/High/Medium toe, maar de AI mag ook Low genereren: de insert faalt stil omdat de fout niet gecontroleerd wordt.
- Na genereren wordt genavigeerd naar `/project/:id`, terwijl de route `/projects/:id` is.
- Evidence telt alleen mee bij status "Provided"; die status bestaat niet (database: Missing/Collected/Reviewed; AI: Obtained). De score is een clientformule die NaN geeft bij 0 evidence-items.
- Twee mapping-tabellen (`risk_control_mapping` en `risk_control_mapping_new`): de AI schrijft naar de oude, de coverage zit in de nieuwe.
- Het plan "trial" bestaat in code maar niet in het oorspronkelijke check-constraint.
- De prompt zegt "specializing in automotive manufacturing controls", terwijl het product generiek bedoeld is.
- Knoppen Edit, Regenerate, Export en Add Row op de detailpagina zijn placeholders; bewerken op de Generate-pagina blijft alleen lokaal.

**Inhoud en positionering**
- Landing noemt "3-day trial", prijssectie "14-day free trial"; prijzen in euro op de landing en in dollar in de losse prijscomponent; Starter heeft 10 packages in Stripe/pricing, maar 5 in de dashboardlogica.
- "Score: 94" op de landing is statisch demo-materiaal; "Mapped to 96 frameworks" wordt beweerd; © 2024 in de footer.

### Eindoordeel van Claude
Een bruikbaar prototype met een duidelijke kernwaarde (van procestekst naar audit-pakket), op MVP-niveau; betalen, beveiliging en scoreberekening zijn niet af. Voor productie eerst de authenticatie op de generate-function en de profiel-RLS dichtzetten.

**Claude bood aan** om de rest van de migraties en Stripe-functions door te lopen, of de tool af te zetten tegen FlowVisi.

---

## 3. Ronde 2: nieuwe wensen en eerste voorstel

### Wat Luuk wilde
> "Betalen via Stripe enzo volledig weghalen. Er wordt betaald door middel van factuur, zelfde als bij FitVisi. Daarnaast kan je kijken of de features en de core generate-pagina goed werken, kijken hoe te verbeteren, nauwkeuriger en duidelijker te maken, zodat bedrijven ook echt wat aan de tool hebben. Ik wil taal in Nederlands en Engels, aan te passen in instellingen. Overleggen. Niks aanpassen en uitvoeren in Lovable."

### Wat Claude deed
Claude las het geheugen over FitVisi (gekozen pricing en factuurflow: klant toont interesse, krijgt factuur, maakt account, licentie wordt gekoppeld) en schreef een eerste voorstel zonder iets uit te voeren.

### Het voorstel
**1. Stripe weg, betalen op factuur.**
- Verwijderen: de drie Stripe-functions, de Stripe-secret, alle upgrade-/checkoutknoppen, het betaalgedeelte in Settings.
- Vervangen door: interesseformulier op de prijspagina; plan en licentie op het profiel, handmatig toegekend na betaling; een melding "Je licentie is nog niet actief".
- Combineren met de beveiligingsfix, omdat gebruikers anders zelf hun plan konden wijzigen.

**2. Generate-pagina nauwkeuriger en bruikbaarder.**
- Nauwkeurigheid: betere input (korte intake i.p.v. één tekstvak), generatie in stappen, framework-eisen uit een echte bibliotheek, scores in code, validatie na generatie.
- Duidelijkheid: management summary, procesflow als diagram, RACI als matrix, risico-heatmap, status per item, bewerkbaar en per sectie opnieuw te genereren, export naar Word/Excel/PDF, label "AI-concept".
- Bestaande bugs meenemen.

**3. NL/EN.** Taalkeuze in Settings, opgeslagen in het profiel; alle schermteksten in vertaalbestanden (nu een mix van Nederlands en Engels); de gekozen taal gaat ook mee naar de AI; een bestaand pakket wordt niet automatisch vertaald.

**Voorgestelde volgorde:** fundament, generatie, resultaat, export.

### Vragen van Claude
1. Licenties handmatig door Luuk, of een beheerpagina?
2. Taalbereik: alleen de app, of ook landing en juridische pagina's?
3. Doelgroep: mkb of groot bedrijf?
4. Prijzen: bestaande plannen of één plan zoals FitVisi?

---

## 4. Ronde 3: antwoorden en uitgewerkt plan

### Antwoorden van Luuk
1. **Handmatig.**
2. **Beide** (app én marketing/juridisch) in het Engels en Nederlands.
3. **Meer richting grote bedrijven, maar de tool moet niet complex worden. Dat is ook wel de kracht. De juiste dingen en niet te uitgebreid, maar wel de generatie enzo voor deze bedrijven.**
4. **Weet ik nog niet.**
> "Laten we het uitgebreid uitwerken samen."

### Uitgewerkt plan van Claude
**Uitgangspunt: minder, maar juist.** Het pakket wordt kleiner: risico's ± 6–12, controls ± 10–20, key controls 20–30%, evidence alleen voor key controls (2–3 per key control). Gaps worden niet meer verzonnen maar afgeleid: een eis uit het gekozen framework waar geen control aan gekoppeld is. "Control Objectives" als apart onderdeel vervalt (dubbel met framework-mapping). Zes onderdelen: Samenvatting, Proces & RACI, Risico's & Controls, Testen & Evidence, Compliance, Export.

**Generatie in 4 stappen met 1 controlemoment:** (1) intake, (2) procesbegrip met controlemoment waarop de gebruiker bevestigt of aanpast (grootste winst voor nauwkeurigheid), (3) risico's, controls, key controls, testplannen en evidence met correcte verwijzingen, (4) framework-dekking en gaps uit de bibliotheek plus een berekende score.

**Readiness-score** berekend uit data (dekking, volledigheid, risico's zonder control, evidence bij key controls, open gaps), met uitleg per onderdeel.

**Eén scherm voor het resultaat:** de dubbele weergave (Generate vs ProjectDetail) wordt één projectpagina met bewerken, status per item en per sectie opnieuw genereren.

**Frameworks:** eerlijk en klein beginnen (6–8 echte), eisen als clausulenummer plus korte omschrijving in eigen woorden (ISO-teksten zijn beschermd), "96 frameworks" van de site halen, inhoud laten controleren door een professional.

**Licenties en factuur:** licentietabellen, handmatige toekenning, platform-admin-rol in aparte tabel, interesseformulier in een tabel.

**Taal:** NL/EN in Settings, hele app, landing en juridische pagina's; AI genereert in gekozen taal.

**Volgorde:** (1) Stripe eruit, licenties, admin-rol, beveiligingsfixes, NL/EN; (2) generatie; (3) bewerken, regenereren, samenvatting; (4) export.

### Vragen van Claude
1. Meerdere gebruikers per bedrijf (organisaties met uitgenodigde gebruikers)? Dat is een grotere ingreep maar voor deze doelgroep haast onmisbaar.
2. Verkleinen van het pakket akkoord?
3. Startlijst van 6–8 frameworks (ISO 27001, COSO, SOX, GDPR/AVG, SOC 2, NIS2, DORA) akkoord?
4. Naam: CompliMaxx of een nieuwe naam (het Claude-project heet "controlvisi")?
5. Prijzen: als aanknopingspunt de FitVisi-structuur (bandbreedtes op FTE, jaarprijs eerst).

---

## 5. Ronde 4: onderdelen van FitVisi meenemen

### Wat Luuk zei
> "Ja, ControlVisi komt het te heten."
> "Kan je kijken welke onderdelen meenemen van FitVisi naar ControlVisi? Ik dacht aan afdelingen + rollen-tab + bedrijfsinformatie met AI. Welke nog meer? Alleen lezen, niks aanpassen."

### Wat Claude deed
Claude las het FitVisi-project ("Strategic Compass AI", id `6c9cca5d-b613-49ab-9487-6cad0a3b6d4d`), alleen lezen: projectkennis, `AGENTS.md`, `App.tsx`, licentiecomponenten (`LicenseSettings`, `InterestDialog`), `AdminLicenties`, `lib/pricing.ts`, `DepartmentsManager`, `RolesPeopleManager`, de instellingen (gebruikers en rechten, uitnodigingen, beveiliging, data-export, account verwijderen), `BedrijfsgegevensSettings`, `CompanyDocuments`, `InfoChecklist`, `OnboardingCompanyForm`, `ScopeSettings`, `StaleAnalysisBanner`, `AddToActionsButton`, `AIBadge`, `fitReport.ts` en de gedeelde AI-module `fitContext.ts`. Ook een read-only telling in de database van het oude project (zie §13).

### Wat FitVisi al had (belangrijkste ontdekkingen)
- Een volledig **organisatiemodel**: organisaties, leden met rollen admin/editor/viewer, uitnodigingen met e-mail, een garantie dat er altijd minstens één beheerder overblijft.
- Een **licentiesysteem op factuur**: interesseformulier via een beveiligde RPC (honeypot en rate-limit), licentiecodes die klanten zelf koppelen, automatisch koppelen via e-maildomein, platformbeheer via een aparte `platform_admins`-tabel, een admin-pagina, verlengingen en opzeggen.
- **AI-architectuurregels** in de projectkennis: alle AI via één edge function met een `task`, gestructureerde output, validatie achteraf, een nieuwe AI-run vervangt alleen items die `ai_generated` en niet `user_edited` zijn, edge functions werken met het JWT van de gebruiker (nooit de service role), alle rekenconstanten op één plek.
- Een gedocumenteerde les: grenzen als `minItems`/`maxItems` maken het AI-schema te complex en de aanroep faalt; de grenzen gaan in de beschrijving en de code dwingt ze af.
- Bedrijfsinformatie met AI: bedrijfsgegevens, website scannen, bedrijfscontext (ook inspreken), documenten uploaden met AI-samenvatting, en een checklist die ontbrekende informatie meegeeft aan de AI.

### Het advies van Claude
**Jouw drie onderdelen**
- **Afdelingen** (boom tot drie niveaus): levert bij ControlVisi het meeste op, omdat rollen en eigenaren nu vrije tekst zijn die de AI verzint.
- **Rollen & Personen** (rol, naam, afdeling, gekoppeld account): hier komen RACI, control owner, risk owner, gap owner en test owner vandaan; later "Mijn werk".
- **Bedrijfsinformatie met AI**: categorieën voor ControlVisi aanpassen naar beleid, procesbeschrijvingen, risicoregister, auditrapporten, systeemlandschap, bestaande controls.

**Wat Claude daar nog aan toevoegde (in volgorde van belang)**
1. Organisaties, gebruikers en rechten.
2. Het licentiesysteem op factuur (lichte versie eerst).
3. De AI-regels uit FitVisi (inclusief de les over het schema).
4. Acties: een gap wordt met één knop een actie met eigenaar en deadline (ControlVisi heeft al ongebruikte tabellen `issues` en `remediation_tasks`).
5. Juridisch en AI-transparantie (verwerkersovereenkomst, subverwerkers, AI-transparantiepagina, `security.txt`, AI-label), nodig voor grote klanten.
6. Export en gegevensbeheer (rapportpagina, branding, data-export, account verwijderen).
7. Gebruikservaring: auto-save, onboarding, ErrorBoundary, "analyse loopt achter"-melding.
8. Berekende scores met tests.
9. Website en huisstijl.

**Niet meenemen:** de hele FIT-methodiek (Focus, Inrichting, Transitie, FIT-score, FITCheck-enquêtes, externe analyse, waardeketen, organogram, processtructuur-boom, scope/terminologie, nachtelijke engine). De AI-assistent kan later, maar is niet nodig voor de kern.

**Praktische aanpak:** Lovable kan geen onderdelen tussen projecten kopiëren behalve het hele project remixen (dat neemt alle FIT-onderdelen mee). Daarom: per onderdeel beschrijven wat Lovable in ControlVisi moet bouwen met FitVisi-bestanden als voorbeeld; eerst de projectkennis neerzetten.

**Feiten over de uitgangssituatie:** er staat in CompliMaxx maar **1 profiel en 11 projecten** (testwerk van Luuk), dus ombouwen naar organisaties is een schone start. De **97 frameworks** zijn alleen namen, zonder eisen.

**NL/EN is nieuw werk:** FitVisi is zover Claude kon zien volledig Nederlands zonder vertaalstructuur. Daarom eerst het vertaalraamwerk bouwen in ControlVisi en onderdelen daarna met vertaalsleutels overnemen.

### Vragen van Claude
1. Huisstijl: zelfde look als FitVisi of eigen kleur binnen de familie?
2. Licenties: lichte versie of inclusief opzeggen en verlengingsfacturen?
3. Prijsstructuur zoals FitVisi?
4. Volgorde: fundament eerst, dan generatie?

---

## 6. Ronde 5: eerst de kern

### Antwoorden van Luuk
- **Huisstijl:** "weet ik nog niet wat ik doen" (nog niet bepaald).
- **Licentie:** "geldig tot en handmatig verlengen".
- **Prijsstructuur:** "weet ik nog niet".
- **Volgorde:** "ik wil eerst dat de hele generatie goed werkt met alle onderdelen die hieraan zijn gekoppeld, bijvoorbeeld rollen + afdelingen, bedrijfsinformatie AI enzovoort. Dus eerst de kern van de tool goed laten werken."
> "Niks aanpassen, eerst overleggen."

### Het kernplan van Claude
**Wat bij de kern hoort:** organisatie en rechten, bedrijfsinformatie, afdelingen en rollen, de generatiemotor en de resultaatpagina. **Daarna:** export, acties, licentie (geldig tot), uitnodigen, juridische pagina's en huisstijl.

**Stap A. Fundament:** alles per organisatie met rechten admin/editor/viewer vanaf het begin (nu goedkoop, later pijnlijk); Stripe volledig weg (in de kern nog geen licentiecontrole); edge functions met de inlog van de gebruiker i.p.v. service role; naam ControlVisi; huisstijl ongemoeid; alleen het vertaalraamwerk nu, nieuwe schermen er meteen op.

**Stap B. Bedrijfsinformatie:** bedrijfsgegevens, website-scan, bedrijfscontext, documenten met AI-samenvatting, checklist met categorieën voor ControlVisi.

**Stap C. Afdelingen en rollen:** afdelingsboom, rollen met naam en afdeling, optioneel gekoppeld account.

**Stap D. Generatiemotor:** gedeelde bedrijfscontext bij elke stap; vier stappen; **eigenaren komen alleen uit jouw rollen** (past er geen rol, dan "nog toe te wijzen" of een rolvoorstel dat met één klik wordt geaccepteerd); gaps en score berekend; gebruikerswerk nooit overschreven; kleine echte frameworkbibliotheek (start: ISO 27001, COSO/SOX, AVG); AI-aanroep versimpeld volgens de FitVisi-les.

**Stap E. Generatiescherm en resultaat:** korte intake, voortgangsscherm per stap, controlemoment na stap 1, daarna één resultaatpagina met bewerken, status per item en per sectie opnieuw genereren.

**Toetsing:** drie echte testprocessen (maandafsluiting, inkoop-tot-betaling, toegangsbeheer IT) met controles per pakket (elk risico minstens één control, elke control een eigenaar uit de rollen, elke gap herleidbaar tot een eis, aantallen binnen bandbreedte, geen lege secties, herhaalbare score) plus inhoudelijke beoordeling. Claude benadrukte dat iemand met audit- of compliance-ervaring de praktische bruikbaarheid moet zien.

**Modelkeuze meten:** FitVisi gebruikt de snelle Gemini Flash, ControlVisi nu de zwaardere Pro; bij opdeling in stappen kan Flash volstaan en is goedkoper; dat wordt op de testset gemeten.

### Vragen van Claude
1. Oude testprojecten (11): verwijderen of eerst bewaren?
2. Frameworks: ISO 27001, COSO/SOX en AVG als eerste drie akkoord?
3. Wie beoordeelt de inhoud van de testpakketten?
4. Checkpoints: Luuk kijkt na A+B+C (basis) en na D (motor) voordat Claude doorgaat naar E.

---

## 7. Ronde 6: frameworks, beoordeling en uitwerking

### Antwoorden van Luuk
- "Ja, oude testprojecten verwijderen."
- "Frameworks: welke zijn nog meer relevant, misschien meer mee beginnen: 10–20 meest relevante."
- "Beoordeling: kan jij dit doen?"
- "Ja" (op de checkpoints na fase 1 en 2).
- "Verder uitwerken, alles."
- "Nog niks in Lovable doen."

### Wat Claude uitwerkte

**Frameworks: 16 in drie lagen**
- **Laag 1 (kern):** COSO Internal Control (2013), ISO/IEC 27001:2022, AVG/GDPR.
- **Laag 2 (veelgevraagd):** SOX 404, ISAE 3402/SOC 1, SOC 2, NIS2, DORA, Nederlandse Corporate Governance Code.
- **Laag 3 (aanvullend):** COSO ERM (2017), ISO 31000, COBIT 2019, NIST CSF 2.0, ISO 22301, ISO 9001, CSRD/ESRS.
- Later mogelijk: PCI DSS, ISO 37301, EU AI Act.
- Bibliotheek: per framework 10–40 eisen op domeinniveau, met referentienummer, titel en korte omschrijving in eigen woorden, in NL en EN, als data met versie en status concept/gecontroleerd; klanten zien alleen gecontroleerde frameworks; maximaal drie per pakket.
- Bij NIS2 (Nederlandse implementatie), CSRD (reikwijdte versoepeld) en DORA controleert Claude de actuele stand bij officiële bronnen vóór vastleggen, omdat Claudes kennis tot eind juni 2026 loopt en dit de snelst verouderende onderwerpen zijn.

**Beoordeling: ja, met grenzen**
- *Claude doet:* automatische controles, inhoudelijk lezen van de gegenereerde pakketten van de testset (concreetheid, dubbelingen, realisme, aansluiting op het risico, koppelingen aan framework-eisen), de frameworkbibliotheek toetsen aan primaire bronnen (EUR-Lex, officiële sites). Een bijeffect: de generator draait op Gemini en Claude beoordeelt als een ander model, dus Claude beoordeelt niet eigen werk.
- *Claude kan niet:* niet tekenen als professional; gelicentieerde ISO-teksten niet woord voor woord vergelijken; niet weten of een control past bij het echte bedrijf van een klant. Advies: voor "audit-ready"-claims één audit- of compliancespecialist de kernframeworks en één voorbeeldpakket laten doorlopen. Tot die tijd blijft het label "AI-concept, laat controleren door een professional".

**Datamodel (hoofdlijnen)**
- Organisatie: organisaties, leden met rol, profielen met taalvoorkeur.
- Stamgegevens: afdelingen (boom), rollen & personen, bedrijfsinstellingen, bedrijfsdocumenten met AI-samenvatting.
- Frameworks: frameworks en `framework_requirements` (versie, status, tweetalig).
- Pakket: projecten gekoppeld aan organisatie en afdeling, plus alle onderdelen. RACI en control owners verwijzen naar een rol uit de stamgegevens; controls naar een processtap; gaps naar een framework-eis.
- Elk AI-item: `ai_generated`, `user_edited` en een status (voorstel / concept / gecontroleerd / goedgekeurd).
- Voortgang: een tabel met generatiestappen (status, fout, hervatten).
- Later: licentie (geldig tot, status) en platform-admin.

**De generatie, stap voor stap**
1. Intake (titel, beschrijving, afdeling, procesverantwoordelijke, systemen, frameworks max. 3, optioneel documenten).
2. Proces en RACI (8–15 stappen; rollen uit stamgegevens; nieuwe rollen als voorstel; **controlemoment**).
3. Risico's en controls (6–12 risico's, 10–20 controls; elk risico minimaal één control; elke control een eigenaar en processtap; risicoscore door de code).
4. Key controls, testplannen en evidence (alleen bij key controls).
5. Compliance: per framework mappen op de eisen met dekking en onderbouwing; **gaps zijn de eisen met geen of gedeeltelijke dekking**; daarna de berekende score.
- Technisch: nummers (R-001, C-001) wijst de code toe via tijdelijke sleutels van de AI; eenvoudig schema zonder minItems/maxItems; de code valideert en kapt af; per stap meten of het snelle model volstaat.

**Score in twee getallen**
- **Ontwerpscore** (direct beschikbaar): hoe compleet en consistent het pakket is. Wegingen: dekking van framework-eisen 40, volledigheid van controls 25, risicodekking 20, kwaliteit van testplannen 15.
- **Audit readiness** (groeit met gebruik): ontwerpscore aangevuld met evidence en open gaps. Een nieuw pakket scoort hier terecht laag, in plaats van de nep-score 94 uit de demo.
- Drempels: 80+ audit-klaar, 60–79 verbeteren, onder 60 significante gaps. (In de specificatie is het laatste label aangepast naar "In opbouw".)

**Toetsen:** drie testprocessen met 1–3 frameworks; automatische controles (geen lege secties, geen risico zonder control, geen control zonder eigenaar uit de rollen of zonder processtap, elke gap herleidbaar, herhaalbare score); daarna Claude's inhoudelijke leesbeoordeling.

**Bouwvolgorde:** Fase 1 basis → controle Luuk → Fase 2 motor → controle Luuk → Fase 3 scherm → Fase 4 frameworks (laag 2, daarna laag 3, in porties van 3–4 met beoordeling) → Fase 5 afronden (export, acties, licentie, juridische pagina's, marketing en vertaling, huisstijl).

### Vragen van Claude
1. Akkoord met de 16 frameworks in drie lagen en maximaal drie per pakket?
2. Akkoord met twee scores (ontwerpscore en audit readiness)?
3. Zal Claude alles uitschrijven in één document in de stijl van de FitVisi-specificatie (dat ook de projectkennis voor ControlVisi in Lovable wordt)?

---

## 8. Ronde 7: de twee bestanden

### Antwoorden van Luuk
- "Ja." (16 frameworks in drie lagen, max. 3 per pakket)
- "Ja." (twee scores)
- > "Werk alles wat ik wil hebben voor implementatie voor de tool. Maak ook een bestand waar we alles hebben besproken, dus ons gesprek. Dus 2 uitgebreide bestanden md graag."

### Resultaat
1. **`controlvisi-specificatie.md`**: de volledige implementatiespecificatie (product, besluiten, architectuurregels, fases 1–5 met datamodel, generatiepijplijn, rekenlogica, validatie, schermen, beveiliging, testen, beoordeling, risico's, open punten, en bijlagen: projectkennis voor Lovable, werkpakketten, frameworkregister, informatiechecklist, testset en fixtures, mapping oude → nieuwe tabellen, rekenconstanten, woordenlijst).
2. **`controlvisi-gesprek-en-besluiten.md`**: dit verslag.

Nog niets in Lovable uitgevoerd.

---

## 9. Besluitenlogboek

| Nr | Besluit | Wanneer |
|---|---|---|
| D-01 | Naam: **ControlVisi** | Ronde 4 |
| D-02 | Stripe en alle betaalfunctionaliteit verdwijnen; betalen per factuur (zoals FitVisi) | Ronde 2 |
| D-03 | Licenties handmatig toegekend | Ronde 3 |
| D-04 | Licentie in de lichte vorm: geldig tot + handmatig verlengen | Ronde 5 |
| D-05 | Doelgroep grotere bedrijven; tool simpel houden | Ronde 3 |
| D-06 | NL/EN, instelbaar in Instellingen, voor app én marketing/juridische pagina's | Ronde 2 en 3 |
| D-07 | Eerst de kern (generatie met rollen, afdelingen, bedrijfsinformatie), daarna de rest | Ronde 5 |
| D-08 | Overnemen uit FitVisi: Afdelingen, Rollen & Personen, Bedrijfsinformatie met AI, plus Claude's aanvullingen (organisaties/rechten, licentieraamwerk licht, AI-regels, AI-label, auto-save, tests) | Ronde 4 |
| D-09 | FIT-methodiek wordt niet overgenomen | Ronde 4 |
| D-10 | Alles per organisatie met rechten admin/editor/viewer | Ronde 5 (via fasering) |
| D-11 | Kleiner pakket: geen Control Objectives, minder volume, evidence alleen voor key controls | Ronde 3 en 6 |
| D-12 | Generatie in 4 AI-stappen met controlemoment na stap 1 | Ronde 5 en 6 |
| D-13 | 16 frameworks in drie lagen; max. 3 per pakket | Ronde 6 en 7 |
| D-14 | Twee scores: ontwerpscore en audit readiness, berekend in code | Ronde 6 en 7 |
| D-15 | De 11 testprojecten worden verwijderd bij de omzetting | Ronde 6 |
| D-16 | Claude doet de beoordeling van de uitkomst (met de grenzen uit §7); specialist-review geadviseerd vóór externe claims | Ronde 6 |
| D-17 | Controlemomenten voor Luuk na fase 1 en na fase 2 (en daarna per fase) | Ronde 6 |
| D-18 | Niets in Lovable uitvoeren tot uitdrukkelijke go | Alle rondes |

---

## 10. Voorstellen van Claude die Luuk nog moet bevestigen

Deze staan in de specificatie als **[VOORSTEL]**; ze zijn niet expliciet besproken.

| Nr | Voorstel | Reden |
|---|---|---|
| V-01 | De AI krijgt rolnamen en afdelingen, maar geen persoonsnamen | Privacy (AVG); minder risico bij subverwerkers |
| V-02 | Persoonsnaam bij een rol is optioneel (in FitVisi verplicht) | Rol kan bestaan zonder persoon; past bij rolvoorstellen |
| V-03 | Publieke site in fase 1 minimaal veiligstellen (naam, prijzen en checkout eruit, valse claims eruit) | De site blijft online terwijl Stripe verdwijnt |
| V-04 | Bij verlopen licentie: lezen en exporteren blijven, genereren blokkeren | Gebruikersvriendelijk en afdwingbaar |
| V-05 | Serverside rate-limit op generatie (start: 20 per organisatie per dag) | Beperkt misbruik en kosten |
| V-06 | Residuele risicoscore: AI stelt residuele kans/impact voor, code begrenst en rekent; zonder control blijft het inherent | Deterministisch, geen verzonnen scores |
| V-07 | Per framework-eis een "in scope / buiten scope"-oordeel; alleen in-scope eisen tellen voor dekking en gaps | Voorkomt dat niet-relevante eisen als gap verschijnen |
| V-08 | Klein beheerscherm voor frameworkstatus (concept/gecontroleerd) in fase 4 | Vrijgave door Luuk of specialist |
| V-09 | Statusniveaus per item: voorstel / concept / gecontroleerd / goedgekeurd | Reviewproces zichtbaar maken |
| V-10 | Data-export en account verwijderen uiterlijk vóór de eerste externe klant | AVG |

---

## 11. Open punten

| Nr | Open punt | Wanneer nodig |
|---|---|---|
| O-01 | **Prijsstructuur** (als startpunt: FitVisi-structuur met eigen bedragen) | Vóór publieke prijzen (fase 5) |
| O-02 | **Huisstijl** (FitVisi-look of eigen kleur binnen de familie) en een nieuw logo | Vóór fase 5 |
| O-03 | Bevestiging van voorstellen V-01 t/m V-10 | Vóór fase 1 |
| O-04 | Wie voert de specialist-review uit? | Vóór externe claims over "audit-ready" |
| O-05 | E-mailprovider en afzenderdomein voor uitnodigingen | Fase 5 |
| O-06 | Juridische controle van privacy, voorwaarden en verwerkersovereenkomst | Fase 5 |
| O-07 | AI-gateway: dataverwerking, training en regio (subverwerkers) | Vóór verwerkersovereenkomst |
| O-08 | Exacte lijst van ondersteunde documenttypen (uit FitVisi `extractDocumentText`) | Fase 1 |
| O-09 | Domeinnaam en merkcontrole van ControlVisi | Vóór lancering |
| O-10 | Of de 11 testprojecten eerst als JSON bewaard worden (besluit is: verwijderen) | Voor fase 1 |
| O-11 | Marge voor reproduceerbaarheid van de score in de testset (start ± 5 punten) | Fase 2 |

---

## 12. Wat Claude niet heeft gecontroleerd

- Vijf van de zeven migraties van het oude project en `supabase/config.toml` (JWT-instelling per functie); de functions `create-checkout` en `customer-portal`. De beveiligingsbevindingen zijn dus afgeleid uit de code die wel is gelezen, met enkele [VERIFIEREN]-punten.
- De live app is niet doorgeklikt (alleen een screenshot van de landingspagina).
- Van FitVisi zijn gelezen: projectkennis, `AGENTS.md`, `App.tsx`, licentie-, afdelingen-, rollen-, instellingen- en bedrijfsinformatiecomponenten, `fitContext.ts` en andere genoemde bestanden. **Niet gelezen:** de functions `fit-ai`, `scan-website`, `send-invite` en de FitVisi-migraties (alleen de bestandsnamen), `useFitData`, `extractDocumentText`, en de juridische pagina's. De ontwerpkeuzes voor die onderdelen zijn gebaseerd op de projectkennis en de gelezen bestanden en moeten bij de bouw tegen de echte code geverifieerd worden.
- De frameworkinhoud (eisen per framework) is nog niet vastgelegd of tegen officiële bronnen gecontroleerd; kennis loopt tot eind juni 2026.
- De actuele limieten van edge-function-time-outs en de dataverwerking bij de AI-gateway zijn niet nagegaan.
- Er zijn geen toetsingen uitgevoerd op generatiekwaliteit; er is nog geen testset gedraaid.

---

## 13. Feiten en referenties uit het onderzoek

**Lovable-workspace:** "Luuk's Lovable" (id `XgW865M3gibwQyEFs7p5`), Pro-plan, Luuk is owner, 12 projecten.

**Projecten in de workspace (naam en laatst bewerkt):** flowvisi (5 okt 2026), Strategic Compass AI = FitVisi (5 okt 2026), Remix of flowvisi (24 sep 2026, niet gepubliceerd), RideSwipe Navigator, Audit Genie, CompliMAX Collaboration Suite, Strategy Compass, **Control Hub Pro** (19 nov 2025), Policy Flow AI, ControlWise AI, ControlDoc AI, Control Doc AI.

**Control Hub Pro / CompliMaxx**
- Project-id `00b3137f-2b42-4dbd-bccb-452f8bf8d010`; gepubliceerd, publiek; laatste commit `668279ed…`.
- Stack: React/Vite/TypeScript/Tailwind/shadcn, Supabase, Lovable AI Gateway (Gemini 2.5 Pro), Stripe.
- Edge functions: `generate-documentation`, `check-subscription`, `create-checkout`, `customer-portal`.
- Tabellen: assessments, audit_readiness_scores, control_objectives, controls, evidence_items, framework_mappings, frameworks, gaps, issues, key_controls, process_flows, profiles, project_frameworks, projects, raci_entries, remediation_tasks, risk_control_mapping, risk_control_mapping_new, risks, test_plans; functie `can_create_project`.
- Database-telling (read-only): **1 profiel, 11 projecten, 97 frameworks (alleen namen), 1 plan.**
- Prijzen in de code: Starter 29, Pro 79, Enterprise 199 (per maand); landing: euro; losse prijscomponent: dollar.
- Landing: 96 frameworks, 10 documenttypen, demo-score 94, 3-daagse trial.

**FitVisi (Strategic Compass AI)**
- Project-id `6c9cca5d-b613-49ab-9487-6cad0a3b6d4d`; gepubliceerd, publiek; laatst bewerkt 5 okt 2026.
- Pagina's o.a.: Dashboard, Onboarding, Focus, Inrichting, Transitie, Risicos, FITCheck, Rapport, Instellingen, AdminLicenties, AIAssistent, FitActies, Handleiding, Support, Updates, juridische pagina's, AITransparantie, Verwerkersovereenkomst, Subverwerkers, Opzeggen.
- Prijsstructuur (uit `lib/pricing.ts`, alles excl. btw): één plan; banden op FTE binnen de scope: 1–100 (€499 per maand bij jaarlijks / €624 maandelijks), 101–250 (€899 / €1.124), 251–500 (€1.499 / €1.874), 500+ op offerte; jaarlijks 20% voordeliger; onbeperkt aantal gebruikers. **Dit is de basis voor een eventuele ControlVisi-structuur, maar de bedragen voor ControlVisi zijn nog niet bepaald.**
- Licentie: code-formaat `FV-XXXX-XXXX-XXXX`; betaling altijd vooraf per factuur; jaarabonnement automatisch verlengd met 12 maanden tenzij één maand voor einde opgezegd; maand-abonnement maandelijks opzegbaar; na opzegging 30 dagen om data-export op te vragen.
- Regels in `AGENTS.md`: prijsbanden alleen in `src/lib/pricing.ts`; licentieaanvragen uitsluitend via RPC `submit_license_request`; `organizations.license_id` wijzigt alleen via `claim_license`, `handle_new_user` of platformbeheer; platformbeheer via `platform_admins` en `is_platform_admin()`; nooit rollen op profiel of organisatie.
- FitVisi-projectkennis: zie §5 van dit verslag en Bijlage A van de specificatie voor de overgenomen regels.

**Eerdere informatie uit het geheugen (relevant gebleken):** FitVisi gebruikt factuurbetaling zonder Stripe (klant toont interesse, krijgt factuur, maakt account, licentie wordt gekoppeld), met jaarprijs eerst en maandprijs duurder.

---

## 14. Volgende stappen

1. **Luuk leest en keurt de specificatie goed** (en reageert op de voorstellen V-01 t/m V-10 en de open punten waar nodig).
2. Bij een **go**: Claude begint met WP 1.0 (projectkennis in het ControlVisi-project) en daarna fase 1, werkpakket voor werkpakket, met controle na elk pakket. De 11 testprojecten worden pas verwijderd bij WP 1.1; Luuk kan daarvoor nog aangeven of een JSON-export gewenst is.
3. Na fase 1: **controlemoment** voor Luuk. Daarna fase 2 (motor) met testset en beoordeling, en weer een controlemoment.
4. Parallel beslissen door Luuk, zodra het uitkomt: huisstijl, prijsstructuur, specialist-review, juridische controle.

*Einde verslag.*
