# ControlVisi – Functionele en technische specificatie v1.0

**Status:** concept ter goedkeuring. Er is nog niets in Lovable aangepast of uitgevoerd.
**Datum:** 6 oktober 2026
**Eigenaar:** Luuk
**Bron-project (Lovable):** "Control Hub Pro" (merk nu: CompliMaxx), project-id `00b3137f-2b42-4dbd-bccb-452f8bf8d010`
**Referentie-project (alleen lezen):** FitVisi / "Strategic Compass AI", project-id `6c9cca5d-b613-49ab-9487-6cad0a3b6d4d`

---

## 0. Leeswijzer

Dit document beschrijft alles wat nodig is om de bestaande tool (CompliMaxx) om te bouwen tot **ControlVisi**: een simpele, betrouwbare tool die voor grotere organisaties een compleet control-pakket genereert (proces, RACI, risico's, controls, testplannen, evidence, framework-dekking, gaps en score), in het Nederlands of Engels.

Markeringen die in het hele document worden gebruikt:

| Markering | Betekenis |
|---|---|
| **[BESLOTEN]** | Luuk heeft dit expliciet besloten of bevestigd in het gesprek |
| **[VOORSTEL]** | Door Claude ingevuld om het document compleet te maken, **niet** expliciet besproken. Moet nog bevestigd worden |
| **[OPEN]** | Nog geen besluit; er is een voorstel of een vraag |
| **[VERIFIEREN]** | Feit dat voor de uitvoering gecontroleerd moet worden bij een officiële bron |

Het gespreksverslag staat in het bestand `controlvisi-gesprek-en-besluiten.md`. Dit document is de *uitkomst*, dat verslag is de *weg ernaartoe*.

**Hoe dit document gebruikt wordt bij de uitvoering:**
1. Bijlage A (projectkennis) wordt als eerste in het ControlVisi-project in Lovable gezet, zodat de regels bij elke aanpassing meegaan.
2. Daarna wordt per fase gewerkt aan de werkpakketten uit Bijlage B, met na elke fase een controlemoment door Luuk.
3. Er wordt niets in Lovable uitgevoerd zonder uitdrukkelijke "go" van Luuk.

---

## 1. Product

### 1.1 Wat is ControlVisi
ControlVisi is een zelfstandige SaaS-tool die van een korte procesbeschrijving een compleet, herleidbaar control-pakket maakt voor interne beheersing, compliance en audit. [BESLOTEN: naam ControlVisi, naast FlowVisi en FitVisi]

### 1.2 Doelgroep
Grotere organisaties (compliance, risk, internal control, internal audit, finance-controllers, IT-security). De tool moet **niet complex** worden; "de juiste dingen, niet te uitgebreid" is juist de kracht, maar de generatie moet wel diepgang hebben die voor deze bedrijven werkt. [BESLOTEN]

### 1.3 Kernbelofte
> Van procesbeschrijving naar een controleerbaar control-pakket dat past bij jouw organisatie, jouw rollen en jouw frameworks, in Nederlands of Engels.

### 1.4 Ontwerpprincipes
1. **Simpel boven compleet.** Liever 12 goede controls dan 30 algemene.
2. **Herleidbaar.** Elk risico heeft een control, elke control een eigenaar (een echte rol) en een processtap, elke gap een framework-eis.
3. **Geen verzonnen feiten.** Ontbreekt informatie, dan benoemt de tool dat in plaats van te gokken.
4. **Berekend wat berekend kan worden.** Scores, risicoratings, nummering en gaps komen uit code, niet uit de AI.
5. **Gebruikerswerk is heilig.** Een nieuwe AI-run overschrijft nooit wat een gebruiker heeft aangepast of goedgekeurd.
6. **AI is herkenbaar en een concept.** Elk AI-resultaat heeft een AI-label en de melding dat het door een professional gecontroleerd moet worden.
7. **Tweetalig vanaf de basis.** Nederlands en Engels, instelbaar in Instellingen. [BESLOTEN]
8. **Eerst de kern.** Generatie met rollen, afdelingen en bedrijfsinformatie moet goed werken voordat export, licenties en marketing aan bod komen. [BESLOTEN]

### 1.4a Terminologie in de interface
| Intern (code/database) | Nederlands | Engels |
|---|---|---|
| project | Controlpakket | Control package |
| process_step | Processtap | Process step |
| RACI | RACI-matrix | RACI matrix |
| RCM | Risico- en controlmatrix | Risk and control matrix |
| key control | Key control | Key control |
| gap | Gap | Gap |
| evidence | Bewijsstuk | Evidence |

### 1.5 Wat ControlVisi niet is (in v1)
- Geen procesvisualisatie-tool (dat is FlowVisi) en geen strategie/FIT-tool (dat is FitVisi). **Geen technische koppeling, geen gedeelde database, geen "naar FlowVisi"-knoppen.** Conceptueel wel op één lijn. [BESLOTEN voor FitVisi/FlowVisi; geldt ook hier]
- Geen betaalmodule (Stripe vervalt, betaling per factuur). [BESLOTEN]
- Geen volledige GRC-suite met workflows, audit trail en dashboards over meerdere entiteiten.

---

## 2. Uitgangssituatie (CompliMaxx / Control Hub Pro)

### 2.1 Stack
React + Vite + TypeScript + Tailwind + shadcn/ui, Supabase (database, auth, edge functions), AI via de Lovable AI Gateway (nu `google/gemini-2.5-pro`), Stripe voor betalingen. Laatst bewerkt 19 nov 2025, gepubliceerd (publiek).

### 2.2 Wat er nu is
- **Pagina's:** Landing, Features, Pricing, GetStarted, About, Bedrijf, OverOns, Contact, Auth, Dashboard, Generate, Projects, ProjectDetail, Settings, vier juridische pagina's.
- **Edge functions:** `generate-documentation`, `check-subscription`, `create-checkout`, `customer-portal`.
- **Tabellen:** profiles, projects, frameworks, project_frameworks, process_flows, raci_entries, risks, controls, risk_control_mapping, risk_control_mapping_new, key_controls, control_objectives, framework_mappings, gaps, test_plans, evidence_items, assessments, audit_readiness_scores, issues, remediation_tasks. Functie: `can_create_project`.
- **Data:** 1 profiel, 11 projecten (testwerk van Luuk), 97 frameworks (alleen namen, zonder eisen).

### 2.3 Bevindingen die in de ombouw opgelost moeten worden
| Nr | Bevinding | Opgelost in |
|---|---|---|
| B-01 | `generate-documentation` controleert de ingelogde gebruiker niet, neemt `userId` uit de request-body en schrijft met de service-role key | Fase 2 (nieuwe functies met JWT) |
| B-02 | Eerste migratie laat gebruikers hun eigen profiel updaten zonder kolombeperking (plan en limieten wijzigbaar). Latere migraties zijn niet allemaal gelezen [VERIFIEREN] | Fase 1 (plankolommen verdwijnen) |
| B-03 | Gebruiksteller wordt in de browser opgehoogd | Fase 1/2 (vervalt; serverside rate-limit) |
| B-04 | `key_controls.testing_priority` staat alleen Critical/High/Medium toe, de AI mag ook Low; de insert faalt stil omdat de fout niet gecontroleerd wordt | Fase 2 |
| B-05 | Na genereren wordt genavigeerd naar `/project/:id`, de route is `/projects/:id` | Fase 3 |
| B-06 | Evidence telt alleen mee bij status "Provided"; die status bestaat niet (DB: Missing/Collected/Reviewed, AI: Obtained) | Fase 2 (eenduidige statussen) |
| B-07 | Score op de detailpagina is een clientformule die NaN geeft bij 0 evidence-items | Fase 2 (berekende score) |
| B-08 | Twee mapping-tabellen: AI schrijft naar de oude, coverage zit in de nieuwe | Fase 2 (één tabel) |
| B-09 | AI verzint rollen en eigenaren als vrije tekst; prompt is vastgeklonken op "automotive manufacturing" | Fase 2 |
| B-10 | Twee verschillende resultaatweergaven (Generate: 5 tabs; ProjectDetail: 3 tabs) | Fase 3 (één weergave) |
| B-11 | Bewerken is alleen lokaal; Edit/Regenerate/Export/Add Row zijn placeholders | Fase 3/5 |
| B-12 | Het AI-schema gebruikt `minItems`/`maxItems`/`pattern`/`minLength`. FitVisi documenteert dat zulke grenzen het schema bij de gateway te complex maken [VERIFIEREN of dit hier ook speelt] | Fase 2 |
| B-13 | Marketing: 3-daagse vs 14-daagse trial, $ vs €, Starter 10 vs 5 packages, "96 frameworks", demo-score 94, © 2024 | Fase 1 (minimaal veiligstellen), Fase 5 (volledig) |
| B-14 | Dashboardlimieten (5/25) komen niet overeen met `check-subscription` (10/25) | Vervalt met plannen |
| B-15 | Plan "trial" bestaat in code maar niet in het oorspronkelijke check-constraint | Vervalt met plannen |
| B-16 | `issues` en `remediation_tasks` bestaan maar worden nergens gebruikt; export wordt beloofd maar bestaat niet | Fase 5 (acties, export) |
| B-17 | Gaps worden door de AI verzonnen (15–25) in plaats van afgeleid uit niet-gedekte framework-eisen | Fase 2 |
| B-18 | Risicocategorie: DB-constraint (Operational/Compliance/Financial/IT) wijkt af van AI-enum (incl. Strategic/Reputational) [VERIFIEREN of latere migratie dit rechtzette] | Fase 2 |

Wat ik **niet** heb gelezen: vijf van de zeven migraties, `supabase/config.toml` (JWT-instelling per functie), `create-checkout` en `customer-portal`, en de live app is niet doorgeklikt (alleen screenshot van de landingspagina gezien).

---

## 3. Besluitenlogboek

| Nr | Besluit | Status |
|---|---|---|
| D-01 | Het product heet **ControlVisi** | BESLOTEN |
| D-02 | Stripe en alle betaalfunctionaliteit verdwijnen volledig; betalen per factuur, zoals bij FitVisi | BESLOTEN |
| D-03 | Licenties handmatig toegekend door Luuk (geen self-service) | BESLOTEN |
| D-04 | Licentie in de lichte vorm: **geldig tot + handmatig verlengen** (geen automatische verlenging/opzegmodule) | BESLOTEN |
| D-05 | Doelgroep: grotere bedrijven; tool blijft simpel | BESLOTEN |
| D-06 | NL en EN, instelbaar in Instellingen; voor de app **én** de marketing- en juridische pagina's | BESLOTEN |
| D-07 | Eerst de kern (generatie met alle gekoppelde onderdelen), daarna de rest | BESLOTEN |
| D-08 | Overnemen uit FitVisi: Afdelingen, Rollen & Personen, Bedrijfsinformatie met AI; plus organisaties/rechten, licentieraamwerk, AI-architectuurregels, AI-label/transparantie, auto-save/onboarding, berekende scores met tests | BESLOTEN (kern) / VOORSTEL (details) |
| D-09 | FIT-methodiek (Focus, Inrichting, Transitie, FITCheck, externe analyse, waardeketen, organogram, processtructuur-boom, scope/terminologie, nachtelijke engine) wordt **niet** overgenomen | BESLOTEN |
| D-10 | Alles wordt per **organisatie** opgeslagen met rechten admin/editor/viewer | VOORSTEL, door Luuk goedgekeurd in de fasering |
| D-11 | Het pakket wordt kleiner: geen aparte Control Objectives, minder volume, evidence alleen voor key controls | BESLOTEN |
| D-12 | Generatie in 4 AI-stappen met een controlemoment na stap 1 | BESLOTEN |
| D-13 | Frameworkbibliotheek: **16 frameworks in drie lagen**, maximaal 3 per pakket | BESLOTEN |
| D-14 | Scores: twee getallen (ontwerpscore en audit readiness), berekend in code | BESLOTEN |
| D-15 | De 11 testprojecten worden bij de omzetting **verwijderd** | BESLOTEN |
| D-16 | Beoordeling van de uitkomst gebeurt door Claude (met de grenzen uit §14); specialist-review wordt geadviseerd vóór externe claims | BESLOTEN (Claude doet de beoordeling) |
| D-17 | Controlemomenten voor Luuk: na fase 1 en na fase 2, daarna na elke volgende fase | BESLOTEN |
| D-18 | Er wordt niets in Lovable aangepast of uitgevoerd tot uitdrukkelijke go | BESLOTEN |
| D-19 | Prijsstructuur | OPEN |
| D-20 | Huisstijl (FitVisi-look of eigen kleur binnen de Visi-familie) | OPEN |

**Voorstellen van Claude die niet expliciet zijn besproken** (alle te bevestigen vóór uitvoering):

| Nr | Voorstel |
|---|---|
| V-01 | De AI krijgt **rolnamen en afdelingen**, maar **geen persoonsnamen** in de prompt (privacy) |
| V-02 | Persoonsnaam bij een rol is **optioneel** (in FitVisi verplicht), zodat een rol kan bestaan zonder persoon |
| V-03 | Publieke site wordt in fase 1 minimaal veiliggesteld (naam, prijzen en checkout-knoppen eruit, valse claims eruit) |
| V-04 | Bij een verlopen licentie: lezen en exporteren blijven mogelijk, genereren wordt geblokkeerd |
| V-05 | Serverside rate-limit op generatie (startwaarde 20 pakketten per organisatie per dag) |
| V-06 | Residuele risicoscore: AI stelt residuele kans/impact voor, code begrenst en rekent |
| V-07 | Per requirement een "in scope / buiten scope"-oordeel; alleen in-scope eisen tellen mee voor dekking en gaps |
| V-08 | Een klein beheerscherm voor frameworkstatus (concept/gecontroleerd) in fase 4 |
| V-09 | Statusniveaus per item: voorstel / concept / gecontroleerd / goedgekeurd |
| V-10 | Data-export en account verwijderen uiterlijk vóór de eerste externe klant |

---

## 4. Architectuurregels

Deze regels gelden voor elke wijziging. Ze zijn overgenomen uit de FitVisi-projectkennis en aangevuld voor ControlVisi. De kopieerbare versie staat in **Bijlage A**.

| Nr | Regel |
|---|---|
| AR-01 | Alle AI loopt via edge functions met een `task`-parameter; output altijd via function calling (gestructureerd), nooit vrije tekst parsen |
| AR-02 | Edge functions gebruiken het **JWT van de gebruiker** en controleren lidmaatschap van de organisatie. **Nooit de service role** voor gebruikersverzoeken |
| AR-03 | Elke nieuwe tabel heeft `organization_id` (cascade), RLS aan, leden lezen (`is_organization_member`), admin/editor schrijven (`get_user_org_role`), viewers schrijven niets en starten geen AI. `updated_at`-trigger |
| AR-04 | Het AI-schema blijft eenvoudig: geen `minItems`/`maxItems`/`minimum`/`maximum`/`pattern`/`minLength`. Grenzen staan in de beschrijving; de code valideert, begrenst en kapt af |
| AR-05 | De AI geeft **tijdelijke sleutels** (s1, r1, c1); de **code** kent nummers (P-001, R-001, C-001, KC-001, EV-001, GAP-001) toe en lost verwijzingen op |
| AR-06 | Een nieuwe AI-run vervangt alleen items met `ai_generated = true`, `user_edited = false` en status `proposal`/`draft`. Gebruikerswerk wordt nooit overschreven |
| AR-07 | AI verzint geen feiten. Ontbrekende gegevens worden expliciet benoemd (aandachtspunt), niet ingevuld |
| AR-08 | Eigenaren (RACI, controls, risico's, evidence, gaps) komen uit `org_roles`. Past geen rol, dan een **voorgestelde rol** die de gebruiker accepteert, wijzigt of afwijst |
| AR-09 | Scores, ratings, nummering, dekking-percentages en gaps zijn **berekend**. Rekenconstanten (wegingen, drempels, grenzen) staan op één plek: `supabase/functions/_shared/cvConstants.ts` (met een kopie/export voor de frontend), en worden getest |
| AR-10 | Enumwaarden worden taalneutraal opgeslagen (`preventive`, `quarterly`) en in de UI vertaald |
| AR-11 | Alle UI-teksten via vertaalsleutels (nl + en). Een test controleert dat beide talen dezelfde sleutels hebben |
| AR-12 | AI-uitkomsten krijgen het AI-label; elk pakket toont "AI-concept, laat controleren door een professional" |
| AR-13 | Database-wijzigingen **altijd** via de migratietool van Lovable Cloud, zodat ze echt op de live database lopen. Geen handmatige migratiebestanden zonder uitvoering |
| AR-14 | Geen persoonsnamen in AI-prompts (V-01); documenten en bedrijfscontext bevatten wel mogelijk persoonsgegevens, zie §11 |
| AR-15 | Elke AI-stap is los herhaalbaar (idempotent) en logt in `generation_runs` (status, model, fout, waarschuwingen, gebruik) |

---

## 5. Fasering en afhankelijkheden

```
Fase 1  Basis        → Organisatie, rechten, opruimen, taal, bedrijfsinformatie, afdelingen, rollen
   ↓  [controlemoment Luuk]
Fase 2  Motor        → Frameworkbibliotheek (laag 1), datamodel pakket, 4-staps generatie, scores, testset, beoordeling
   ↓  [controlemoment Luuk]
Fase 3  Scherm       → Intake, voortgang, controlemoment, één resultaatpagina, bewerken, status, per sectie opnieuw genereren
   ↓  [controlemoment Luuk]
Fase 4  Frameworks   → Laag 2, daarna laag 3, in porties van 3–4 met beoordeling
   ↓
Fase 5  Afronden     → Export, acties, licentie (geldig tot), uitnodigen, juridische pagina's, marketing + vertaling, huisstijl
```

Afhankelijkheden: de generatie (fase 2) leunt op organisatie, bedrijfsinformatie, afdelingen en rollen (fase 1). Het scherm (fase 3) leunt op de motor (fase 2). Frameworks laag 2 en 3 vragen alleen de bibliotheek, geen nieuw schermwerk.

---

## 6. Fase 1 – Basis

### 6.1 Opruimen
**Verwijderen:**
- Edge functions `create-checkout`, `customer-portal`, `check-subscription` (uit de code **en** van de live omgeving).
- Alle Stripe-verwijzingen in de frontend: knoppen "Start Free Trial"/"Upgrade", Settings-betaalgedeelte, "Manage Plan" op het dashboard.
- Plankolommen en -logica: `profiles.plan`, `packages_limit`, `packages_used_this_month`, `trial_*`, `usage_reset_date`, `max_users`; functie `can_create_project`; planafhankelijke frameworktoegang in de UI.
- Testdata: alle 11 projecten en alles wat eraan hangt. [BESLOTEN D-15]
- Oude tabellen worden vervangen door het nieuwe schema (§6.2 en §7.2). Mapping oud → nieuw in Bijlage F.

**Handmatig door Luuk (Lovable verwijdert dit niet vanzelf):** het geheim `STRIPE_SECRET_KEY` uit de Cloud-secrets halen en, als er een Stripe-account is, producten/klanten daar opruimen.

**Veiligstellen vóór verwijderen (optioneel):** een JSON-export van de 11 testprojecten, mocht Luuk ze later als voorbeeldprocessen willen gebruiken (bijvoorbeeld voor de testset in Bijlage E).

### 6.2 Organisatie en rechten

**Tabellen (fase 1):**
```
organizations
  id uuid pk, name text, sector text, organization_type text (profit|non_profit|overheid|anders),
  employee_count numeric, locations text, website text, description text,
  created_at, updated_at

organization_members
  id, organization_id fk, user_id fk(auth.users), role text (admin|editor|viewer), joined_at
  unique(organization_id, user_id)

profiles
  id uuid pk = auth.users.id, full_name text, email text, language text default 'nl' (nl|en),
  created_at, updated_at

organization_settings
  organization_id pk fk, company_context text, preferences jsonb default '{}', updated_at

platform_admins
  user_id pk fk(auth.users)

licenses   (tabel nu aanmaken, schermen in fase 5)
  id, organization_id fk unique, status text (active|expired|suspended), valid_until date,
  note text, created_at, updated_at
```

**Functies (security definer, vaste `search_path`, execute alleen voor ingelogde gebruikers; patroon uit FitVisi-migratie `harden_security_definer_functions`):**
- `is_organization_member(org uuid) returns boolean`
- `get_user_org_role(org uuid) returns text`
- `is_platform_admin() returns boolean`
- `create_organization(name text) returns uuid`: maakt organisatie + lidmaatschap als admin voor de ingelogde gebruiker; weigert als de gebruiker al een organisatie heeft (v1: één organisatie per gebruiker in de UI, tabellen laten meer toe).
- Trigger "laatste admin": een organisatie houdt altijd minimaal één admin; wijzigen/verwijderen van de laatste admin wordt geweigerd met een duidelijke melding.
- `handle_new_user`: maakt een profiel bij registratie (taal uit browservoorkeur, anders `nl`).

**RLS-patroon** (voor alle organisatietabellen):
- SELECT: `is_organization_member(organization_id)`
- INSERT/UPDATE/DELETE: `get_user_org_role(organization_id) in ('admin','editor')`
- Beheer van leden, organisatieinstellingen die iedereen raken en licenties: alleen `admin` (licenties: alleen `platform_admin`).
- Viewers: alleen lezen; kunnen geen AI starten (de edge function controleert de rol).

**Onboarding:** na registratie en bevestiging van het e-mailadres:
1. Stap 1: organisatienaam (+ taalkeuze, standaard uit browser).
2. Stap 2: bedrijfsgegevens (sector, FTE, website, korte beschrijving) met de knop "Lees website met AI" (§6.4).
3. Stap 3: afdelingen en rollen (optioneel; zonder rollen stelt de generatie ze voor, zie §7.5). Vanuit hier door naar "Maak je eerste controlpakket".
Auto-save, waarschuwing bij weggaan met niet-opgeslagen wijzigingen.

**Uitnodigen van collega's:** tabel `invitations` en e-mailverzending komen in fase 5. In fase 1 werkt een organisatie met één admin; de ledenlijst is read-only zichtbaar.

### 6.3 Taal (i18n)
- Bibliotheek: `react-i18next` (of gelijkwaardig). Namespaces: `common`, `auth`, `onboarding`, `settings`, `projects`, `generate`, `result`, `errors`, `legal` (later), `marketing` (fase 5).
- Standaardtaal **Nederlands**; voor niet-ingelogde bezoekers browserdetectie met fallback `nl`; voor ingelogde gebruikers `profiles.language`, gesynchroniseerd met localStorage zodat er geen flits is.
- **Instellen:** Instellingen → Profiel → Taal (NL/EN), direct van kracht, opgeslagen in het profiel.
- Datums, getallen, valuta via `Intl` op basis van de gekozen taal.
- Enumwaarden en statussen worden vertaald via sleutels (bijvoorbeeld `enums.control_type.preventive`).
- **Een test controleert** dat `nl` en `en` dezelfde sleutels hebben en dat er geen lege waarden zijn. Hardgecodeerde zichtbare tekst in nieuwe componenten is niet toegestaan.
- **Taal van AI-inhoud:** het pakket krijgt `projects.language` (standaard de UI-taal bij het aanmaken). De AI schrijft alle tekst in die taal. Codes (R-001) en enumsleutels blijven taalneutraal. Later wisselen van UI-taal vertaalt een bestaand pakket **niet** automatisch; de UI meldt dat duidelijk (vertalen van pakketten is een mogelijke latere functie).
- Frameworkeisen zijn tweetalig opgeslagen (§7.1), dus de dekking-weergave volgt de pakkettaal.
- Marketing- en juridische pagina's krijgen in fase 5 beide talen. [BESLOTEN D-06]

### 6.4 Bedrijfsinformatie met AI
Overgenomen uit FitVisi (`BedrijfsgegevensSettings`, `CompanyDocuments`, `InfoChecklist`, `scan-website`, `documentDigest`, `buildOrgContext`), aangepast voor ControlVisi.

**a) Bedrijfsgegevens** (op `organizations`): naam, sector (keuzelijst, uitbreidbaar), type organisatie, aantal FTE, locaties, website, beschrijving.

**b) Website scannen met AI** (edge function `scan-website`):
- Leest de homepage en de belangrijkste pagina's (over ons, diensten/producten, missie, nieuws, vacatures, compliance/certificeringen), max. 8 pagina's.
- Levert een profiel: samenvatting, beschrijving, sector, producten/diensten, doelgroepen, strategische signalen en, voor ControlVisi toegevoegd, **genoemde certificeringen/keurmerken** en **genoemde systemen/leveranciers**.
- Gebruiker kiest wat overgenomen wordt (beschrijving, sector, toevoegen aan context); niets wordt bewaard zonder opslaan.
- **Veiligheid (SSRF):** alleen `http(s)`; blokkeer localhost, privé-IP-bereiken en link-local adressen (ook na redirects); maximale responsegrootte en time-out per pagina; geen cookies/authenticatie meesturen; ingelogde gebruiker met rol admin/editor vereist.

**c) Bedrijfscontext:** vrije tekst (`organization_settings.company_context`), ook in te spreken (spraak-naar-tekst zoals FitVisi). Maximum 30.000 tekens in de AI-context.

**d) Documenten:**
- Upload van beleidsstukken, procesbeschrijvingen, risicoregisters, auditrapporten, enzovoort; meerdere bestanden tegelijk, tot 50 MB per bestand, **dezelfde bestandstypen als FitVisi** (zie `extractDocumentText` daar; [VERIFIEREN] exacte lijst vóór bouw).
- Tekstextractie gebeurt in de browser; het bestand gaat in een **privé storage-bucket** `organization-documents` (pad `{organization_id}/{document_id}/{bestandsnaam}`, RLS op organisatie).
- Tabel `organization_documents`: `id, organization_id, file_name, storage_path, size_bytes, extracted_text, text_length, ai_summary, created_by, created_at`.
- Na upload maakt de AI een **samenvatting per document** (`task: document_digest`), gericht op wat voor control-pakketten relevant is: beleidsregels, bestaande controls, rollen en bevoegdheden, systemen, eerdere bevindingen, genoemde frameworks.
- Verwijderen van een document haalt het ook uit toekomstige context.
- Budgetten voor de AI-context staan op één plek (startwaarden: maximaal 10 documenten, ± 40.000 tekens totaal, samenvatting heeft voorrang boven ruwe tekst). Te tunen in fase 2.

**e) Informatie-checklist:** categorieën die de gebruiker aanvinkt als "geüpload/aangeleverd" (lijst in Bijlage D). De categorieën die niet zijn aangevinkt gaan als blok **"Ontbrekende bedrijfsinformatie"** mee naar de AI met de instructie: *vul hier niets in op basis van aannames; benoem het als ontbrekend en adviseer welke documenten nodig zijn.* Zichtbaar als voortgangsbalk "x van y categorieën compleet". Wordt opgeslagen in `organization_settings.preferences.info_checklist`.

### 6.5 Afdelingen
Overgenomen uit FitVisi `DepartmentsManager`.
```
departments
  id, organization_id fk, name text not null, description text, color text default '#3b82f6',
  parent_id uuid fk(departments) null, sort_order int, created_at, updated_at
```
- Boom tot **drie niveaus** (hoofdafdeling → subafdeling → sub-subafdeling). De database/trigger of de server weigert dieper en weigert lussen.
- Verwijderen van een afdeling verwijdert de subafdelingen; gekoppelde rollen blijven bestaan zonder afdeling (`department_id = null`); een duidelijke bevestiging toont het aantal.
- Weergave: kaarten per hoofdafdeling met kleur, aantal rollen, subafdelingen met toevoegen/bewerken/verwijderen.

### 6.6 Rollen & Personen
Overgenomen uit FitVisi `RolesPeopleManager`, aangepast.
```
org_roles
  id, organization_id fk, role text not null (functie, bv. "Financieel Controller"),
  person_name text null (V-02), department_id fk null, user_id fk(auth.users) null,
  is_active boolean default true, created_by_ai boolean default false, created_at, updated_at
```
- Tabel met zoeken op rol, naam en afdeling. Rollen kunnen **gearchiveerd** worden; verwijderen kan alleen als de rol nergens in een pakket gebruikt wordt (anders archiveren).
- Een rol kan aan een account van een organisatielid gekoppeld worden; die persoon krijgt later "Mijn werk" (fase 5: mijn controls, mijn evidence, mijn gaps).
- **Deze tabel is de enige bron voor eigenaren in een pakket** (AR-08).
- **Voorgestelde rollen:** bij generatie kan de AI rollen voorstellen die nog niet bestaan; gebruiker accepteert (maakt `org_roles`-rij met `created_by_ai = true`), wijst toe aan een bestaande rol of wijst af (zie §7.5, stap 2).
- **Privacy [VOORSTEL V-01]:** alleen `role` en afdeling gaan naar de AI, `person_name` niet.

### 6.7 Navigatie en Instellingen
Hoofdnavigatie: Dashboard, Controlpakketten, Instellingen.
Instellingen (tabs): **Profiel** (naam, taal, wachtwoord) · **Bedrijfsgegevens** · **Bedrijfsinformatie (AI)** (context, documenten, checklist) · **Afdelingen** · **Rollen & Personen** · **Gebruikers** (read-only lijst in fase 1) · **Beveiliging & gegevens** (placeholder; export en account verwijderen in fase 5). Rolafhankelijk: viewers zien alles read-only.

### 6.8 Naamswijziging en publieke site veiligstellen [VOORSTEL V-03]
De publieke site blijft online terwijl Stripe verdwijnt. Minimaal in fase 1:
- Naam CompliMaxx → ControlVisi (logo/tekst-niveau; volledige huisstijl blijft [OPEN]).
- Checkout- en "Start Free Trial"-knoppen vervangen door "Neem contact op" (mailto of contactformulier), prijzen verwijderen (prijsstructuur is [OPEN]).
- Onjuiste claims verwijderen: "96 frameworks", "14-day trial", "Score: 94", © 2024, $/€-verwarring.
Volledige herschrijving en vertaling van de marketingpagina's volgt in fase 5.

### 6.9 Acceptatiecriteria fase 1
- [ ] Geen Stripe-code, -functions of -knoppen meer; geen verwijzing naar plannen of packages in de UI.
- [ ] Testprojecten en oude tabellen zijn weg; het bestaande profiel van Luuk werkt en kan via onboarding een organisatie aanmaken.
- [ ] Een nieuwe gebruiker kan registreren, een organisatie aanmaken en doorlopen tot afdelingen/rollen. RLS is getest: gebruiker A ziet nooit data van organisatie B; viewer kan niet schrijven.
- [ ] De laatste admin kan niet worden verwijderd of gedegradeerd.
- [ ] Taalkeuze NL/EN werkt in alle nieuwe schermen en blijft bewaard; vertaalsleuteltest is groen.
- [ ] Website-scan, context, documentupload met samenvatting en checklist werken; SSRF-bescherming is getest (localhost/privé-IP wordt geweigerd).
- [ ] Afdelingen (max. 3 niveaus, geen lussen) en rollen (zoeken, archiveren, koppelen aan account) werken.
- [ ] Geen edge function die voor gebruikersverzoeken de service role gebruikt.
- [ ] Publieke site bevat geen prijzen, checkout of onjuiste claims meer.

---

## 7. Fase 2 – Motor (generatie)

### 7.1 Frameworkbibliotheek

**Tabellen:**
```
frameworks
  id, key text unique (bv. 'coso-ic-2013'), name text, category text, layer int (1|2|3),
  version_label text, status text (draft|reviewed), source_notes text, reviewed_at, sort_order

framework_requirements
  id, framework_id fk, ref text (stabiel, bv. 'COSO-P10'), domain text,
  title_nl text, title_en text, description_nl text, description_en text, sort_order
  unique(framework_id, ref)
```
- `frameworks` en `framework_requirements` zijn **globale data** (niet per organisatie); alle ingelogde gebruikers lezen alleen frameworks met `status = 'reviewed'`; `platform_admin` leest en schrijft alles. De 97 bestaande namen worden vervangen.
- **Granulariteit:** niveau van principe/categorie/artikelgroep, 10–40 eisen per framework. Beschrijvingen in eigen woorden (ISO-teksten zijn beschermd; geen woordelijke overname).
- **Maximaal 3 frameworks per pakket** (afdwingen in UI en server). [BESLOTEN]
- Seeding via migraties met `status = 'draft'`; pas na review en beoordeling op `reviewed` (zie §9 en §14).

**De 16 frameworks in drie lagen** [BESLOTEN D-13]:

| Laag | Framework |
|---|---|
| 1 (kern) | COSO Internal Control (2013) · ISO/IEC 27001:2022 · AVG/GDPR |
| 2 (veelgevraagd) | SOX 404 · ISAE 3402 / SOC 1 · SOC 2 · NIS2 · DORA · Nederlandse Corporate Governance Code |
| 3 (aanvullend) | COSO ERM (2017) · ISO 31000 · COBIT 2019 · NIST CSF 2.0 · ISO 22301 · ISO 9001 · CSRD/ESRS |

Later mogelijk: PCI DSS, ISO 37301, EU AI Act. Bronnen en [VERIFIEREN]-punten per framework: Bijlage C.

### 7.2 Datamodel van het pakket
Alle tabellen hebben `organization_id` (voor RLS), `project_id`, `created_at`, `updated_at`, `created_by`, `updated_by`. AI-items hebben bovendien `ai_generated boolean`, `user_edited boolean`, `status text (proposal|draft|reviewed|approved)`.

```
projects
  id, organization_id, title, description (procesbeschrijving), process_domain text
  (finance|procurement|it|hr|sales|operations|legal_compliance|other),
  department_id fk null, owner_role_id fk(org_roles) null, systems text[] default '{}',
  language text (nl|en), status text (draft|generating|ready|failed),
  process_confirmed_at timestamptz null, created_by, created_at, updated_at

project_frameworks (project_id, framework_id)  -- max 3 per project (server check)

generation_runs
  id, project_id, step text (process|risks_controls|testing|compliance),
  framework_id null (alleen bij compliance), status text (pending|running|done|failed|awaiting_confirmation),
  attempt int, model text, started_at, finished_at, error_code text, error_message text,
  warnings jsonb default '[]', usage jsonb  -- tokens, duur

process_steps
  id, project_id, code text (P-001), sequence int, title text, description text,
  responsible_role_id fk null, responsible_proposed_title text null,
  category text, inputs text, outputs text, systems text,
  is_decision_point bool, is_approval_required bool, risk_hotspot bool, + AI/status velden

raci_entries
  id, project_id, step_id fk, role_id fk null, role_proposed_title text null,
  responsibility text (R|A|C|I)
  -- regel: per stap minimaal één R en precies één A

risks
  id, project_id, code text (R-001), description text,
  category text (operational|financial|compliance|it|strategic|reputational),
  owner_role_id null, owner_proposed_title null,
  likelihood int 1-5, impact int 1-5, inherent_score int, inherent_rating text,
  residual_likelihood int, residual_impact int, residual_score int, residual_rating text,
  + AI/status velden

risk_steps (risk_id, step_id)               -- bij welke processtap(pen) hoort het risico

controls
  id, project_id, code text (C-001), description text,
  control_type text (preventive|detective|corrective),
  automation_level text (manual|semi_automated|fully_automated),
  frequency text (continuous|daily|weekly|monthly|quarterly|annual|ad_hoc),
  owner_role_id null, owner_proposed_title null, step_id fk null,
  is_key boolean default false, key_code text null (KC-001), key_rationale text,
  testing_priority text (critical|high|medium|low), + AI/status velden

risk_controls (risk_id, control_id, coverage text (strong|moderate|weak))   -- één mapping-tabel

test_plans    -- één per key control
  id, project_id, control_id fk unique, code text (TP-001), purpose text,
  approach text (inquiry|observation|inspection|reperformance|analytical),
  population text, sample_method text (random|judgmental|stratified|full), sample_size int,
  frequency text, test_owner_role_id null, steps text, success_criteria text,
  exception_criteria text, evidence_required text, + AI/status velden

evidence_items
  id, project_id, control_id fk, code text (EV-001), description text,
  item_type text (document|report|screenshot|log|email|approval|certificate),
  mandatory boolean, status text (missing|in_progress|obtained|reviewed),
  owner_role_id null, due_date date null, + AI velden

requirement_scope   -- per pakket: is een eis relevant voor dit proces?
  id, project_id, requirement_id fk, in_scope boolean, reason text,
  decided_by text (ai|user)

control_requirements   -- mapping controls ↔ eisen
  id, project_id, control_id fk, requirement_id fk, coverage text (full|partial), rationale text

gaps    -- AFGELEID, niet verzonnen: in-scope eis zonder (volledige) dekking
  id, project_id, code text (GAP-001), requirement_id fk,
  coverage_state text (none|partial), priority text (critical|high|medium|low),
  recommended_action text, owner_role_id null, due_date null,
  status text (open|in_progress|closed|accepted)

project_scores
  id, project_id, design_score int, readiness_score int, components jsonb, created_at
  -- snapshot per berekening; laatste is de actuele (trend later)
```

**Statuswaarden** zijn overal taalneutrale sleutels (AR-10). De oude kolomwaarden ("Provided", "Collected", "Obtained") verdwijnen: evidence gebruikt `missing → in_progress → obtained → reviewed`.

**Indexen** op `(organization_id)`, `(project_id)` en alle foreign keys. **Cascade:** verwijderen van een project verwijdert alles eronder.

### 7.3 Generatiepijplijn

De generatie bestaat uit een **intake** (geen AI) en **vier AI-stappen**. Elke stap is een eigen aanroep van de edge function `cv-ai` met `task`, zodat een mislukte stap de voorgaande niet kost en elke stap hervat kan worden. De client (of een server-orchestrator) draait de stappen sequentieel en toont voortgang.

```
Intake (gebruiker) → [1] process → ▶ controlemoment ◀ → [2] risks_controls → [3] testing → [4] compliance (per framework)
```

**Edge functions:**
| Functie | Tasks |
|---|---|
| `cv-ai` | `document_digest`, `generate_process`, `generate_risks_controls`, `generate_testing`, `generate_compliance`, `regenerate_section`, `suggest_roles` |
| `scan-website` | website lezen en profiel maken |
| `delete-account` | (fase 5) |
| `send-invite` | (fase 5) |

**Gedeelde modules** (`supabase/functions/_shared/`): `cvContext.ts` (authorize, buildOrgContext, callStructuredAI, simplifySchema, foutafhandeling; patroon uit FitVisi `fitContext.ts`), `cvSchemas.ts`, `cvScores.ts`, `cvValidation.ts`, `cvConstants.ts`.

**Algemene aanroepcontroles (elke task):** ingelogd (JWT), lid van de organisatie, rol admin/editor, project behoort tot de organisatie, geen andere run actief voor dit project, rate-limit niet overschreden (V-05). Fouten worden teruggegeven als begrijpelijke melding met `error_code` (429 AI-limiet, 402 tegoed op, 502 geen bruikbaar antwoord).

#### 7.3.1 Bedrijfscontext (voor elke stap)
`buildOrgContext` bouwt één leesbare tekst met secties:
1. **Organisatie**: naam, sector, type, FTE, locaties, website, beschrijving.
2. **Bedrijfscontext** (max. 30.000 tekens).
3. **Bedrijfsdocumenten**: AI-samenvattingen (budget uit §6.4d).
4. **Ontbrekende bedrijfsinformatie** (uit de checklist, met de "niet invullen"-instructie).
5. **Afdelingen** (boom, namen) en **rollen** (functienaam + afdeling + korte sleutel `ro1…ron`; **geen persoonsnamen** [V-01]).
6. **Pakketintake**: titel, procesbeschrijving, domein, afdeling, procesverantwoordelijke (rol), systemen, taal.
7. **Vorige stappen** (bevestigde processtappen, risico's en controls) voor zover relevant voor de huidige stap.
8. **Frameworkeisen** (alleen stap 4): `ref`, titel en beschrijving in de pakkettaal.

#### 7.3.2 Basis-systeemprompt (voor alle stappen)
```
Je bent een ervaren internal-control- en auditspecialist voor grote organisaties (Big Four-niveau).
Je schrijft alle tekst in de gevraagde taal ({language}). Codes en sleutels blijf je in het Engels.

Regels:
1. Verzin geen feiten over de organisatie. Gebruik alleen wat in de context staat. Ontbreekt iets, benoem
   het in het veld "attention_points" en vul niet in op aannames.
2. Eigenaren en rollen kies je uitsluitend uit de lijst met rollen (sleutel ro1…ron). Past geen enkele rol,
   gebruik dan "NEW:<functienaam>" en leg kort uit waarom. Verzin geen namen van personen.
3. Gebruik tijdelijke sleutels (s1, r1, c1…) om onderdelen aan elkaar te koppelen. Verzin geen nummers.
4. Wees concreet en toetsbaar: een control beschrijft wie wat wanneer controleert en hoe vaak, met welk
   systeem of bewijs. Vermijd algemeenheden zoals "er is een beleid".
5. Houd je aan de aantallen in de opdracht. Liever minder en goed dan veel en algemeen.
6. Geef geen juridisch advies; je levert een concept dat door een professional wordt gecontroleerd.
```

#### 7.3.3 Stap 1 – `generate_process` (proces en RACI)
- **Doel:** de procesbeschrijving omzetten in 8–15 processtappen met RACI.
- **Invoer:** context (§7.3.1 secties 1–6).
- **Uitvoer (schema, eenvoudig):**
  - `steps[]`: `key` (s1…), `title`, `description`, `responsible_role` (ro-sleutel of `NEW:…`), `category`, `inputs`, `outputs`, `systems`, `is_decision_point`, `is_approval_required`, `risk_hotspot`.
  - `raci[]`: `step_key`, `role` (ro-sleutel of `NEW:…`), `responsibility` (R|A|C|I).
  - `proposed_roles[]`: `title`, `suggested_department`, `reason`.
  - `attention_points[]`: tekst (bijvoorbeeld "systemen niet beschreven").
- **Code na ontvangst:** nummering P-001…, rol-sleutels oplossen naar `org_roles`; `NEW:` → `*_proposed_title` en een lijst voorstellen; validatie (§7.6); opslaan met `ai_generated = true`.
- **Controlemoment:** de run krijgt status `awaiting_confirmation`. De gebruiker bekijkt en bewerkt de processtappen en RACI, en handelt de **rolvoorstellen** af (accepteren → nieuwe `org_roles`-rij met `created_by_ai = true`; koppelen aan een bestaande rol; afwijzen → eigenaar blijft leeg met melding). Pas na "Bevestigen" wordt `projects.process_confirmed_at` gezet en kan stap 2 starten.

#### 7.3.4 Stap 2 – `generate_risks_controls`
- **Doel:** 6–12 risico's en 10–20 controls met koppelingen.
- **Invoer:** context + bevestigde processtappen en RACI.
- **Uitvoer:**
  - `risks[]`: `key`, `description`, `category`, `owner_role`, `likelihood` (1–5), `impact` (1–5), `residual_likelihood`, `residual_impact`, `step_keys[]`.
  - `controls[]`: `key`, `description`, `control_type`, `automation_level`, `frequency`, `owner_role`, `step_key`, `links[]` (`risk_key`, `coverage`: strong|moderate|weak).
  - `proposed_roles[]`, `attention_points[]`.
- **Regels in de prompt:** elk risico minimaal één control; een control kan meerdere risico's dekken (liever dan 3–7 controls per risico, zoals de oude opzet eiste); voor risico's met hoge inherente score minimaal twee controls van verschillend type (preventief én detectief) waar zinvol.
- **Code:** nummering R-001/C-001; scores en ratings berekend (§7.4); residuele waarden begrensd (V-06); `risk_controls` aangemaakt; validatie.

#### 7.3.5 Stap 3 – `generate_testing` (key controls, testplannen, evidence)
- **Doel:** key controls kiezen en testplannen en evidence ontwerpen, **alleen** voor key controls.
- **Invoer:** context + processtappen, risico's, controls.
- **Uitvoer:** `key_controls[]` (`control_key`, `rationale`, `testing_priority`), `test_plans[]` (`control_key`, `purpose`, `approach`, `population`, `sample_method`, `sample_size`, `frequency`, `test_owner`, `steps`, `success_criteria`, `exception_criteria`, `evidence_required`), `evidence[]` (`control_key`, `description`, `item_type`, `mandatory`, `owner_role`).
- **Code:** key controls begrensd op 20–30% van de controls (minimaal 3); KC-nummers; één testplan per key control (ontbrekende worden gemeld, niet verzonnen); 2–3 evidence-items per key control; EV-nummers; standaardstatus `missing`.

#### 7.3.6 Stap 4 – `generate_compliance` (per framework)
- **Doel:** per gekozen framework de eisen beoordelen op relevantie en dekking.
- **Invoer:** context + controls (code, omschrijving, type, stap, risico's) + **alle eisen van dat framework** (`ref`, titel, beschrijving).
- **Uitvoer per eis:** `ref`, `in_scope` (boolean), `scope_reason`, `coverage` (full|partial|none), `control_keys[]`, `rationale`, en voor in-scope eisen met `none`/`partial`: `recommended_action`, `priority`.
- **Code:** controleert dat **elke eis** van het framework in de uitvoer staat (ontbrekende eisen worden als `in_scope = true, coverage = none` gemarkeerd en aan het resultaat gemeld, of er volgt één gerichte herhaling); schrijft `requirement_scope`, `control_requirements`; **leidt de gaps af** (§7.5) en nummert GAP-001; berekent de scores (§7.4).
- **Eén aanroep per framework** (maximaal drie), zodat elke aanroep klein blijft.

### 7.4 Rekenlogica (alles in `cvConstants.ts` en `cvScores.ts`, met unit-tests)

**Risicoscore:** `score = kans × impact` (1–25).
**Rating:** 1–4 `low` · 5–9 `medium` · 10–15 `high` · 16–25 `critical`.
**Residueel [V-06]:** de AI stelt `residual_likelihood` en `residual_impact` voor; de code begrenst ze op ≤ de inherente waarde en op minimaal 1. **Een risico zonder gekoppelde control houdt de inherente score als residuele score.**

**Ontwerpscore (0–100)** = gewogen som van vier onderdelen:
| Onderdeel | Gewicht | Berekening |
|---|---|---|
| Dekking van framework-eisen | 40 | (volledig + 0,5 × gedeeltelijk) / aantal in-scope eisen |
| Volledigheid van controls | 25 | aandeel controls met eigenaar, type, frequentie, automatiseringsniveau, processtap én ≥ 1 gekoppeld risico |
| Risicodekking | 20 | per risico: 1 bij ≥ 1 control (bij hoog/kritiek: 1 bij ≥ 2 controls met ≥ 2 verschillende types, anders 0,5); 0 zonder control; gemiddelde over risico's |
| Kwaliteit van testplannen | 15 | aandeel key controls met compleet testplan én ≥ 2 evidence-items |
Zijn er **geen frameworks gekozen**, dan wordt het gewicht van "dekking" evenredig over de andere drie verdeeld.

**Audit readiness (0–100):**
`readiness = 0,5 × ontwerpscore + 0,3 × evidence-voortgang + 0,2 × gap-afhandeling`
- *Evidence-voortgang* = aandeel **verplichte** evidence-items met status `obtained` of `reviewed` (× 100).
- *Gap-afhandeling* = 1 − (gewogen open gaps / gewogen alle gaps); weging: critical 4, high 3, medium 2, low 1; gaps met status `closed` of `accepted` tellen als afgehandeld. Zonder gaps: 100 voor dit onderdeel.
- Een **nieuw** pakket scoort hier terecht laag omdat er nog geen evidence is; de interface legt dat uit ("bouw evidence op om audit-klaar te worden").

**Drempels/labels:** ≥ 80 **Audit-klaar** · 60–79 **Bijna** · < 60 **In opbouw**. (Eerder voorgesteld als "significante gaps"; "In opbouw" is passender voor een nieuw pakket.)

**Aantallen** (afgedwongen met bandbreedtes): processtappen 8–15 (harde max 20) · risico's 6–12 (max 15) · controls 10–20 (max 25) · key controls 20–30% (min 3) · evidence 2–3 per key control.

**Tests (vitest):** gewogen scores met bekende invoer (inclusief randgevallen: 0 evidence, 0 gaps, geen frameworks, 0 controls), ratinggrenzen, residuele begrenzing, key-control-percentage, nummering, RACI-regel (één A per stap).

### 7.5 Gaps en rolvoorstellen

**Gaps (afgeleid) [B-17 opgelost]:** een gap is een **in-scope eis** met `coverage_state` `none` of `partial`. De AI levert alleen de *aanbevolen actie* en *prioriteit*; het bestaan van de gap volgt uit de dekking. Elke gap verwijst naar een `framework_requirement`. De gebruiker kan een eis op "buiten scope" zetten (met reden) of een gap op `accepted` zetten; beide worden vastgelegd en tellen in de score als afgehandeld/niet-meetellend.

**Rolvoorstellen (AR-08):** `NEW:<functienaam>` uit de AI-uitvoer wordt een voorstel. Op het controlemoment (en bij latere stappen in een samenvattend blok) kiest de gebruiker per voorstel: **accepteren** (rol aanmaken + automatisch aan alle items koppelen), **koppelen aan bestaande rol** (selectielijst), of **afwijzen**. Zolang een voorstel openstaat toont het item "Nog toe te wijzen: <titel>".

### 7.6 Validatie

Na elke stap draait `cvValidation.ts`. Uitkomst: een lijst `warnings` (opgeslagen bij de run en getoond in de samenvatting) en een lijst `blocking`. Bij blokkerende fouten volgt **één** automatische herstelronde (gerichte AI-aanroep voor alleen het ontbrekende, bijvoorbeeld controls voor risico's zonder control); blijft het fout, dan wordt het als waarschuwing zichtbaar gemaakt, niet verborgen.

| Nr | Regel | Ernst |
|---|---|---|
| V-C01 | Aantal items binnen de bandbreedte; onder het minimum → herhaling, boven harde max → afkappen op laagste prioriteit | blokkerend/waarschuwing |
| V-C02 | Alle enumwaarden geldig; ongeldige waarden worden naar een standaard gebracht en gemeld | waarschuwing |
| V-C03 | Alle `*_key`-verwijzingen bestaan; weesverwijzingen worden verwijderd en gemeld | waarschuwing |
| V-C04 | Elke processtap heeft minimaal één R en precies één A in de RACI | blokkerend |
| V-C05 | Elk risico heeft minimaal één control | blokkerend |
| V-C06 | Elke control heeft een eigenaar (rol of openstaand voorstel) | waarschuwing |
| V-C07 | Elke control is gekoppeld aan een processtap en minimaal één risico | waarschuwing |
| V-C08 | Kans/impact binnen 1–5; residuele waarden ≤ inherent | automatisch gecorrigeerd |
| V-C09 | Key controls tussen 20–30% (min 3); elk key control heeft een testplan en 2–3 evidence-items | blokkerend (herstel) |
| V-C10 | Elke eis van het gekozen framework komt in de uitvoer voor | blokkerend (herstel) |
| V-C11 | Elke gap verwijst naar een bestaande eis; geen gap voor out-of-scope eisen | structureel |
| V-C12 | Geen dubbele controls (vergelijkbare omschrijving, zelfde stap en eigenaar) | waarschuwing |
| V-C13 | Teksten zijn in de gevraagde taal (eenvoudige taaldetectie) | waarschuwing |
| V-C14 | Geen persoonsnamen in de uitvoer (alleen rollen) | waarschuwing |

### 7.7 Regenereren en gebruikerswerk

- **Regel (AR-06):** een run vervangt alleen items met `ai_generated = true`, `user_edited = false` en status `proposal` of `draft`. Items die de gebruiker aanpaste (`user_edited = true`) of op `reviewed`/`approved` zette, blijven staan; nieuwe items worden toegevoegd.
- Een bewerking door de gebruiker zet `user_edited = true` en legt `updated_by` vast.
- **Voorbeeld:** "Risico's en controls opnieuw genereren" toont vooraf: "X items worden vervangen, Y blijven staan (aangepast of goedgekeurd)".
- **Afhankelijkheid/verouderd (staleness):** wijzigt de gebruiker stappen of RACI *na* het genereren van risico's/controls, of wijzigt de rolbasis (rollen, afdelingen), dan toont het pakket een melding "Deze onderdelen lopen achter op je gegevens" met de knop "Opnieuw genereren" (patroon uit FitVisi `StaleAnalysisBanner`). Berekend door `updated_at` van upstream-data te vergelijken met `finished_at` van de run.

### 7.8 Modelkeuze en kosten
Het model staat op één plek in `cvConstants.ts` per taak. **Startpunt:** snel model (`google/gemini-2.5-flash`, zoals FitVisi) voor `document_digest`, `generate_process` en `generate_compliance`; zwaar model (`google/gemini-2.5-pro`) wordt vergeleken voor `generate_risks_controls` en `generate_testing`. Welk model per stap de beste kosten/kwaliteit geeft, wordt in de testset **gemeten** (§14), niet aangenomen. Temperatuur 0,3. Gebruik (tokens, duur) wordt per run gelogd. Schema's zonder grenzen (AR-04).

### 7.9 Acceptatiecriteria fase 2
- [ ] Frameworkbibliotheek laag 1 (COSO, ISO 27001, AVG) staat in de database met `status = draft`; na beoordeling `reviewed`.
- [ ] Het volledige datamodel is aangemaakt met RLS; testen tonen isolatie tussen organisaties.
- [ ] De vier stappen werken end-to-end voor de drie testprocessen (Bijlage E), ook hervatten na een mislukte stap.
- [ ] Alle validatieregels zijn geïmplementeerd en getest; scores zijn deterministisch (zelfde data, zelfde score).
- [ ] Unit-tests voor `cvScores`, `cvValidation` en nummering zijn groen.
- [ ] Beoordelingsrapport per testpakket (§14) voldoet aan de drempels.
- [ ] Geen enkele functie gebruikt de service role voor gebruikersverzoeken; viewers kunnen geen generatie starten.
- [ ] Modelkeuze per stap is vastgelegd met meetgegevens.

---

## 8. Fase 3 – Scherm

### 8.1 Routes
| Route | Pagina |
|---|---|
| `/dashboard` | Overzicht (aantal pakketten, gemiddelde readiness, open gaps, recente pakketten) |
| `/projects` | Lijst met controlpakketten (zoeken, filter op afdeling/status) |
| `/projects/new` | Intake |
| `/projects/:id/generate` | Voortgang en controlemoment |
| `/projects/:id` | Resultaat (één weergave, tabs) |
| `/settings` | Instellingen (tabs uit §6.7) |

### 8.2 Intake (`/projects/new`)
Velden: titel (verplicht), procesbeschrijving (verplicht, ≥ 200 tekens aanbevolen met teller en hulptekst), procesdomein, afdeling (uit afdelingen), procesverantwoordelijke (uit rollen, optioneel), systemen (tags), frameworks (1–3, alleen `reviewed`, met uitleg per framework), taal (standaard UI-taal). Boven in het formulier: een **volledigheidsindicator** voor bedrijfsinformatie ("je bedrijfsinformatie is 4 van 10 categorieën compleet, een rijkere context geeft een nauwkeuriger pakket") met link naar Instellingen. Zonder rollen/afdelingen toont het formulier een neutrale hint dat de AI ze zal voorstellen (geen blokkade).

### 8.3 Voortgang (`/projects/:id/generate`)
Een stepper met de stappen: *Proces & RACI → Controlemoment → Risico's & controls → Testen & evidence → Compliance (per framework)*. Per stap status (wachtend/bezig/klaar/mislukt), duur en, bij falen, een begrijpelijke melding met "Opnieuw proberen" voor alleen die stap. Annuleren stopt na de lopende stap; reeds opgeslagen stappen blijven bewaard.

### 8.4 Controlemoment
Na stap 1: een bewerkbaar overzicht van processtappen en RACI (inline wijzigen, toevoegen, verwijderen, volgorde), een blok **Rolvoorstellen** (accepteren / koppelen / afwijzen), de **aandachtspunten** van de AI (bijvoorbeeld ontbrekende informatie) en de knop "Bevestigen en doorgaan". Zonder bevestiging gaat de generatie niet door.

### 8.5 Resultaatpagina (`/projects/:id`) – één weergave
Header: titel, afdeling, frameworks, status, AI-label met uitleg, taalbadge. Knoppen: opnieuw genereren (per sectie), export (fase 5).

**Tab 1 Samenvatting:** de twee scores met uitleg per onderdeel ("wat ontbreekt"), aantal items per type, top-5 risico's, aantal open gaps per prioriteit, **validatiewaarschuwingen** uit de generatie, **ontbrekende bedrijfsinformatie** die de kwaliteit raakt, en "x van y items beoordeeld" (reviewvoortgang).

**Tab 2 Proces & RACI:** processtappen als geordende lijst met markeringen (beslispunt, goedkeuring, risicohotspot); RACI als **matrix** (stappen × rollen, cellen R/A/C/I bewerkbaar) met waarschuwing bij ontbrekende A. (Een visueel stroomdiagram is een mogelijke latere uitbreiding.)

**Tab 3 Risico's & Controls:** RCM-tabel (risico → gekoppelde controls) met filters (categorie, eigenaar, rating, status), **5×5 heatmap** (inherent naast residueel), per control: type, automatisering, frequentie, eigenaar, processtap, key-markering.

**Tab 4 Testen & Evidence:** key controls met testplankaart (aanpak, populatie, steekproef, stappen, succes-/uitzonderingscriteria) en bijbehorende evidence-lijst met status, eigenaar en vervaldatum (bewerkbaar). Bijwerken van evidence herberekent de readiness.

**Tab 5 Compliance:** per framework een dekkingsbalk; tabel van eisen (ref, titel, in scope-schakelaar, dekking, gekoppelde controls, motivatie); lijst van **gaps** met aanbevolen actie, prioriteit, eigenaar, status (open/in uitvoering/gesloten/geaccepteerd).

### 8.6 Bewerken, status en auto-save
- Elk item kan inline of in een zijpaneel bewerkt worden; wijzigingen worden automatisch opgeslagen (indicator "opgeslagen"), met waarschuwing bij verlaten van het scherm met openstaande wijzigingen.
- Een bewerking zet `user_edited = true`. Status per item: voorstel → concept → gecontroleerd → goedgekeurd (V-09), met bulkactie "markeer alle zichtbare items als gecontroleerd".
- Viewers zien alles read-only. Editors/admins bewerken.
- **Regenereren per sectie** (Proces, Risico's & controls, Testen & evidence, Compliance per framework) met de bevestiging uit §7.7.

### 8.7 Algemene UX-eisen
Lege toestanden met uitleg en een eerste actie; laadtoestanden; foutafhandeling met `ErrorBoundary`; toegankelijkheid (labels, toetsenbord, voldoende contrast); tabellen scrollbaar op smalle schermen; alle teksten via vertaalsleutels; AI-label bij elke AI-uitkomst.

### 8.8 Acceptatiecriteria fase 3
- [ ] Een gebruiker kan zonder uitleg van intake naar een compleet pakket komen, inclusief het controlemoment en rolvoorstellen.
- [ ] Er is één resultaatpagina (geen dubbele weergave); alle tabs tonen echte, bewerkbare data.
- [ ] Bewerken blijft bewaard en overleeft opnieuw genereren (AR-06); de bevestiging toont correcte aantallen.
- [ ] De verouderd-melding verschijnt wanneer upstream-data wijzigt.
- [ ] Viewer kan niets wijzigen of starten; gebruiker A ziet nooit pakketten van organisatie B.
- [ ] NL en EN werken in alle schermen; geen hardgecodeerde teksten.
- [ ] De drie testprocessen zijn volledig doorlopen via de interface.

---

## 9. Fase 4 – Frameworks uitbreiden

**Werkwijze per portie van 3–4 frameworks (laag 2, daarna laag 3):**
1. **Onderzoek:** actuele bron raadplegen (Bijlage C), zeker bij NIS2, DORA en CSRD/ESRS, die snel veranderen [VERIFIEREN].
2. **Concept-seed:** eisen (10–40) in NL en EN als migratie met `status = draft` en `source_notes` (bron, versie, datum geraadpleegd).
3. **Beoordeling door Claude** (§14): consistentie, ontbrekende kernonderwerpen, dubbelingen, kwaliteit van de Nederlandse en Engelse formulering.
4. **Test:** minimaal één testproces met dit framework; controle van dekking, scope-oordelen en gaps.
5. **Vrijgave:** `status = reviewed` door Luuk (of door een specialist), via een klein beheerscherm voor platform-admins (V-08) of vooralsnog via de database.
6. **Release-notitie** (bijvoorbeeld op de Updates-pagina in fase 5).

Er wordt per framework vastgelegd welke versie van de bron is gebruikt, zodat later bijwerken mogelijk is (`framework.version_label`).

---

## 10. Fase 5 – Afronden

### 10.1 Export
- **Word (.docx):** titelpagina (organisatie, afdeling, datum, AI-concept-disclaimer), samenvatting en scores, proces + RACI, RCM, key controls en testplannen, evidence-checklist, compliance-dekking en gaps.
- **Excel (.xlsx):** tabbladen RCM, RACI, Controls, Testplannen, Evidence, Gaps, Framework-dekking.
- **PDF** later. Taal volgt de pakkettaal. Logo van de organisatie (branding) op de titelpagina.
- Implementatie via een skill/bibliotheek aan clientzijde of een edge function; keuze bij bouw.

### 10.2 Acties
Een gap, een ontbrekend bewijsstuk of een control kan met één knop een **actie** worden (patroon uit FitVisi `AddToActionsButton` met dubbelingherkenning).
```
actions
  id, organization_id, project_id, source_type (gap|evidence|control|manual), source_id,
  title, description, priority (critical|high|medium|low), owner_role_id null, due_date null,
  status (open|in_progress|done|cancelled), created_by, created_at, updated_at
```
Pagina "Acties" met filters; op het dashboard "Mijn werk" voor gebruikers die aan een rol gekoppeld zijn. Vervangt de ongebruikte `issues`/`remediation_tasks`.

### 10.3 Licentie (lichte vorm) [BESLOTEN D-04]
- Tabel `licenses` (uit fase 1): `status`, `valid_until`, `note`.
- **Platformbeheer** (alleen `platform_admins`): lijst van organisaties met licentiestatus; **geldig tot** wijzigen; knoppen "+12 maanden" en "+1 maand" (handmatig verlengen); status actief/verlopen/opgeschort.
- Gebruikersgedrag: banner bij verloopdatum binnen 30 dagen en bij verlopen. **Bij verlopen [V-04]:** lezen en exporteren blijven, genereren wordt geblokkeerd. Effectieve status = `expired` zodra `valid_until` verstreken is, ook als `status` nog `active` is (zoals FitVisi `effectiveStatus`).
- Geen interessedialoog, licentiecodes, e-maildomeinkoppeling of verlengingsfacturen in v1. Aanvragen lopen via het contactformulier/e-mail; Luuk maakt de factuur buiten de tool en zet de licentie.

### 10.4 Gebruikers uitnodigen
Tabel `invitations` (e-mail, rol, status, verloopt, token), edge function `send-invite` met e-mailverzending [OPEN: e-mailprovider, bijvoorbeeld Resend, en afzenderdomein], acceptatiepagina `/accept-invite`, beheer in Instellingen → Gebruikers (rol wijzigen, verwijderen, uitnodiging intrekken); de laatste-admin-regel blijft gelden.

### 10.5 Juridisch en vertrouwen (voor grote klanten)
Pagina's in NL en EN: Privacy, Voorwaarden, Cookies, Security, Acceptable use, **Verwerkersovereenkomst**, **Subverwerkers**, **AI-transparantie**, `security.txt`. De teksten worden uit FitVisi als basis genomen, aangepast voor ControlVisi en **juridisch gecontroleerd** voordat ze live gaan. [OPEN]

### 10.6 Gegevensbeheer
Data-export (JSON) van alle organisatiegegevens en **account/organisatie verwijderen** (edge function `delete-account`); beide uiterlijk vóór de eerste externe klant [V-10].

### 10.7 Marketing, vertaling en huisstijl
Landing, Features, Voor wie, Handleiding, Support, Updates, Contact: opnieuw geschreven op basis van wat de tool echt doet, in NL en EN. **Huisstijl [OPEN D-20]:** FitVisi-look (blauw, Inter, afgeronde kaarten) of een eigen kleur binnen de Visi-familie; wordt beslist voor het begin van fase 5. Prijzen verschijnen pas als de prijsstructuur [OPEN D-19] bepaald is; als startpunt dient de FitVisi-structuur (één plan, banden op aantal FTE, jaarprijs eerst, onbeperkt gebruikers), met eigen bedragen.

### 10.8 Acceptatiecriteria fase 5
- [ ] Word- en Excel-export van een testpakket zijn inhoudelijk compleet en in de pakkettaal.
- [ ] Acties kunnen vanuit gaps, evidence en controls worden aangemaakt zonder dubbelingen.
- [ ] Een platform-admin kan "geldig tot" wijzigen en handmatig verlengen; verlopen blokkeert genereren maar niet lezen/exporteren.
- [ ] Uitnodigen werkt end-to-end; laatste-admin-regel behouden.
- [ ] Juridische pagina's staan live in beide talen, juridisch gecontroleerd.
- [ ] Data-export en account verwijderen werken en zijn getest.
- [ ] Marketingpagina's bevatten alleen claims die waar zijn (inclusief het werkelijke aantal frameworks).

---

## 11. Beveiliging en privacy

| Nr | Eis |
|---|---|
| S-01 | RLS aan op alle tabellen met gebruikers-/organisatiegegevens; alle policies getest met twee organisaties |
| S-02 | Edge functions: JWT-controle + lidmaatschap + rol; geen service role voor gebruikersverzoeken; CORS beperkt tot de eigen domeinen waar mogelijk |
| S-03 | Beheerrollen (platform-admin) staan in een aparte tabel, nooit op profiel of organisatie; licentiegegevens zijn alleen door platform-admins te wijzigen (trigger/RLS) |
| S-04 | `security definer`-functies met vaste `search_path` en beperkte execute-rechten |
| S-05 | Storage: privé-bucket per pad `{organization_id}/…` met policies op lidmaatschap; maximale bestandsgrootte afdwingen |
| S-06 | Website-scan met SSRF-bescherming (§6.4b) |
| S-07 | Server-side rate-limit op AI-aanroepen per organisatie (V-05); `ai_usage`-log per task |
| S-08 | Geen secrets in de frontend; verwijderde Stripe-sleutel is ingetrokken |
| S-09 | Wachtwoordbeleid minimaal 8 tekens, controle van het huidige wachtwoord bij wijzigen, e-mailverificatie bij registratie |
| S-10 | Logging van generatie-runs zonder inhoud van documenten of persoonsgegevens in logs |

**Privacy (AVG):**
- Persoonsnamen bij rollen blijven buiten AI-prompts (V-01). Documenten en bedrijfscontext kunnen toch persoonsgegevens bevatten; de gebruiker krijgt hierover een waarschuwing bij uploaden ("upload geen onnodige persoonsgegevens").
- **Subverwerkers/AI:** AI-aanroepen lopen via de Lovable AI Gateway naar een model van Google (Gemini). Of en hoe aangeleverde data voor training gebruikt wordt, en in welke regio data wordt verwerkt en opgeslagen (Supabase-regio), moet worden nagegaan in de actuele voorwaarden [VERIFIEREN] voordat de verwerkersovereenkomst en subverwerkerslijst worden gepubliceerd.
- Bewaartermijn en verwijdering: bij account/organisatie verwijderen worden alle data, documenten en storage-bestanden verwijderd (fase 5).
- AI-transparantie: AI-label bij AI-uitkomsten en een publieke AI-transparantiepagina.

---

## 12. Kwaliteit en testen

**Automatisch (vitest):** `cvScores` (alle formules en randgevallen), `cvValidation` (alle regels), nummering en verwijzingsresolutie, regenereerregel (AR-06), i18n-sleutelpariteit, afdelingenboom (max. 3 niveaus, geen lussen), laatste-admin-regel (databasetest of SQL-script).
**Integratie:** RLS-tests met twee organisaties en drie rollen; end-to-end script voor de generatie (zoals `fitcheck-e2e.mjs` in FitVisi).
**Inhoudelijk:** de testset met beoordeling (§14 en Bijlage E).
**Regressie:** de testset wordt opnieuw gedraaid bij wijziging van prompts, modellen of schema's.

---

## 13. Buiten scope (v1) en later

Niet in v1: AI-assistent (chat over het pakket), import van bestaande RCM/Excel, visueel stroomdiagram, control self-assessment-enquêtes, versiegeschiedenis/audit trail per item (kolommen `created_by`/`updated_by` zijn er al), vertalen van een bestaand pakket, SSO, API, meerdere organisaties per gebruiker in de UI, PCI DSS/ISO 37301/EU AI Act, automatische licentieverlenging en opzegmodule.

---

## 14. Beoordeling van de uitkomst

**Wie:** Claude beoordeelt (Luuk heeft hiermee ingestemd). De generator draait op een ander model (Gemini), dus Claude beoordeelt niet eigen werk.

**Wat Claude doet:**
1. Draait de **automatische controles** (§7.6) op elk testpakket.
2. **Leest de inhoud** en scoort elk testpakket op de rubric hieronder.
3. Beoordeelt de **frameworkbibliotheek** tegen primaire bronnen (EUR-Lex, officiële sites van standaardenorganisaties) en rapporteert twijfelpunten.
4. Schrijft per run een **beoordelingsrapport** (markdown): scores, voorbeelden van goede/slechte items, aanbevelingen voor prompt/schema-aanpassingen.

**Rubric (schaal 1–5):** specificiteit en toetsbaarheid van controls · realisme voor het type organisatie · aansluiting control ↔ risico · aannemelijkheid van eigenaren · afwezigheid van dubbelingen · juistheid van framework-mapping en scope-oordelen · kwaliteit van de gaps en aanbevolen acties · taalkwaliteit (NL en EN). **Slagen:** gemiddeld ≥ 4,0 en geen dimensie lager dan 3.

**Wat Claude niet kan:**
- Niet tekenen als professional; geen vervanging voor een audit- of compliancespecialist.
- Geen woord-voor-woord vergelijking met gelicentieerde ISO-teksten.
- Niet beoordelen of een control past bij de feitelijke werkwijze van een specifieke klant.

**Advies:** laat vóór externe claims over "audit-ready" één audit- of compliancespecialist de kernframeworks en één voorbeeldpakket doorlopen. Tot die tijd blijft het label "AI-concept, laat controleren door een professional" op elk pakket. [OPEN: wie dit wordt]

---

## 15. Aannames en risico's

| Nr | Punt |
|---|---|
| R-01 | Edge-function time-outs begrenzen de duur van één AI-stap; daarom zijn stappen klein (compliance per framework). De actuele limiet moet bij bouw gecontroleerd worden [VERIFIEREN] |
| R-02 | AI-schemagrenzen kunnen aanroepen laten falen (B-12); schema's blijven eenvoudig |
| R-03 | Kwaliteit van de uitkomst hangt af van de bedrijfsinformatie; de checklist en de "ontbreekt"-blokken beperken gokken, maar niet volledig |
| R-04 | Regelgeving (NIS2/Cyberbeveiligingswet, DORA, CSRD/ESRS) verandert snel; per release bronnen verifiëren |
| R-05 | Modelkosten en -limieten van de AI-gateway kunnen wijzigen; modelkeuze en rate-limit staan centraal |
| R-06 | Juridische teksten en de AVG-positie zijn niet gecontroleerd; juridische review is nodig |
| R-07 | Prijsstructuur en huisstijl zijn nog open; de bouw is zo opgezet dat ze later zonder herbouw ingevuld kunnen worden (limieten/prijzen staan in data/constanten, huisstijl in thema) |

---

## 16. Open punten

| Nr | Open punt | Wanneer nodig |
|---|---|---|
| O-01 | Prijsstructuur | vóór publieke prijzen (fase 5) |
| O-02 | Huisstijl | vóór fase 5 (en voor een nieuw logo) |
| O-03 | Bevestiging van alle voorstellen V-01 t/m V-10 | vóór fase 1 |
| O-04 | Wie voert de specialist-review uit | vóór externe claims |
| O-05 | E-mailprovider en afzenderdomein voor uitnodigingen | fase 5 |
| O-06 | Juridische controle van de teksten (privacy, verwerkersovereenkomst, voorwaarden) | fase 5 |
| O-07 | AI-gateway: dataverwerking, training, regio (subverwerkers) | vóór verwerkersovereenkomst |
| O-08 | Exacte lijst ondersteunde documenttypen (overnemen uit FitVisi) | fase 1 |
| O-09 | Domeinnaam en naamcontrole van ControlVisi (merk/domein beschikbaar?) | vóór lancering |

---

# Bijlagen

## Bijlage A – Projectkennis voor ControlVisi (kopieerbaar naar Lovable)

```
# ControlVisi – projectkennis

ControlVisi is een zelfstandige SaaS-tool die van een procesbeschrijving een control-pakket genereert
(processtappen, RACI, risico's, controls, key controls, testplannen, evidence, framework-dekking, gaps, score).
ControlVisi is een ANDER product dan FlowVisi en FitVisi: nooit een technische koppeling, geen "naar FlowVisi/FitVisi"-
knoppen, geen gedeelde database. Wel dezelfde begrippen.

## Taal en stijl
- UI in Nederlands en Engels (instelbaar in Instellingen, opgeslagen in profiles.language). Standaard Nederlands.
- Alle zichtbare tekst via vertaalsleutels (nl + en). Geen hardgecodeerde zichtbare tekst. Een test bewaakt dat beide talen dezelfde sleutels hebben.
- AI-inhoud wordt geschreven in de taal van het pakket (projects.language). Codes en enumsleutels blijven taalneutraal.
- AI-content altijd herkenbaar met een AI-label en de melding "AI-concept, laat controleren door een professional".
- Huisstijl: nog niet bepaald. Geen eigen kleurkeuzes invoeren zonder opdracht.

## Principes
- Simpel boven compleet. Liever 12 goede controls dan 30 algemene.
- Herleidbaar: elk risico heeft een control, elke control een eigenaar (rol) en een processtap, elke gap een framework-eis.
- AI verzint geen feiten. Ontbrekende data = expliciet aandachtspunt, niet invullen.
- Berekend wat berekend kan: scores, ratings, nummering, dekking en gaps komen uit code, niet uit de AI.

## Generatie
- Intake + 4 AI-stappen: process → (controlemoment, gebruiker bevestigt) → risks_controls → testing → compliance (per framework, max 3).
- Aantallen: processtappen 8–15, risico's 6–12, controls 10–20, key controls 20–30% (min 3), evidence 2–3 per key control, testplan per key control.
- Alle AI loopt via edge function cv-ai met een task. Output via function calling (gestructureerd). Nooit vrije tekst parsen.
- AI-schema's blijven eenvoudig: GEEN minItems/maxItems/minimum/maximum/pattern/minLength. Grenzen staan in de beschrijving; de code valideert, begrenst en kapt af.
- De AI gebruikt tijdelijke sleutels (s1, r1, c1). De code kent nummers toe (P-001, R-001, C-001, KC-001, TP-001, EV-001, GAP-001) en lost verwijzingen op.
- Eigenaren komen uitsluitend uit org_roles (sleutels ro1…). Past geen rol: "NEW:<functienaam>" = voorstel dat de gebruiker accepteert, koppelt of afwijst.
- Persoonsnamen gaan nooit naar de AI; alleen rolnamen en afdelingen.
- Na ontvangst AI-output: aantallen, enums en verwijzingen opnieuw valideren; ontbrekende onderdelen melden (warnings), niet stil invullen.
- Een nieuwe AI-run vervangt ALLEEN items met ai_generated = true, user_edited = false en status proposal/draft. Gebruikerswerk nooit overschrijven.
- Gaps zijn AFGELEID: een in-scope framework-eis zonder (volledige) dekking. De AI levert alleen aanbevolen actie en prioriteit.
- Een framework is alleen zichtbaar voor gebruikers als frameworks.status = 'reviewed'. Maximaal 3 frameworks per pakket.

## Rekenregels (één plek: supabase/functions/_shared/cvConstants.ts, getest)
- Risicoscore = kans × impact. Rating: 1–4 low, 5–9 medium, 10–15 high, 16–25 critical.
- Residueel: AI stelt voor, code begrenst (≤ inherent); zonder control = inherente score.
- Ontwerpscore (0–100): dekking 40, volledigheid controls 25, risicodekking 20, testplan-kwaliteit 15.
- Audit readiness: 0,5 × ontwerpscore + 0,3 × evidence-voortgang + 0,2 × gap-afhandeling. Labels: ≥80 audit-klaar, 60–79 bijna, <60 in opbouw.

## Techniek-afspraken
- Alle tabellen: organization_id (cascade), RLS aan, leden lezen (is_organization_member), admin/editor schrijven (get_user_org_role), viewers lezen alleen en starten geen AI. updated_at-trigger.
- Edge functions gebruiken het JWT van de gebruiker, nooit de service role voor gebruikersverzoeken. Controleer altijd lidmaatschap en rol.
- Beheer via platform_admins + is_platform_admin(); nooit rollen op profiel of organisatie. Een organisatie houdt altijd minstens één admin.
- Enumwaarden taalneutraal opgeslagen (preventive, quarterly), in de UI vertaald.
- Rekenconstanten, modelkeuze per task, AI-budgetten en limieten staan op één plek.
- Database-wijzigingen ALTIJD via de migratietool van Lovable Cloud, zodat ze echt op de live database worden uitgevoerd. Geen migratiebestanden met de hand toevoegen zonder ze uit te voeren.
- Website-scan: alleen http(s), blokkeer localhost en privé-IP-bereiken (ook na redirects), limieten op grootte en tijd.
- Licentie (lichte vorm): status + valid_until, alleen door platform-admins te wijzigen. Geen Stripe, geen betaalmodule; betaling per factuur buiten de tool.
- Auto-save waar mogelijk; waarschuw bij verlaten met niet-opgeslagen wijzigingen.

## Bron
De volledige specificatie is "ControlVisi – Functionele en technische specificatie v1.0". Bij twijfel: volg die specificatie.
```

---

## Bijlage B – Werkpakketten per fase (uitvoeringsvolgorde voor Lovable)

Elke regel is één afgebakende opdracht aan Lovable. Na elk werkpakket controleert Claude de uitkomst; Luuk beslist bij de controlemomenten.

### Fase 1 – Basis
| WP | Inhoud | Hangt af van | Klaar als |
|---|---|---|---|
| 1.0 | Projectkennis (Bijlage A) in ControlVisi zetten; optioneel JSON-export van de testprojecten | goedkeuring Luuk | Projectkennis staat; export (indien gewenst) opgeslagen |
| 1.1 | Opruimen: Stripe-functions en -UI, plankolommen, testprojecten, oude tabellen | 1.0 | Geen Stripe-resten; database leeg op profiel na; build slaagt |
| 1.2 | Schema fase 1 via migratietool: organizations, members, profiles, settings, platform_admins, licenses, functies, triggers, RLS | 1.1 | RLS-test met twee organisaties slaagt; laatste-admin-regel werkt |
| 1.3 | Registratie, onboarding, organisatie aanmaken, beschermde routes, rolafhankelijke UI | 1.2 | Nieuwe gebruiker komt tot en met stap 3 van de onboarding |
| 1.4 | i18n-raamwerk, taalinstelling, vertaalsleuteltest | 1.3 | NL/EN wisselen werkt en blijft bewaard |
| 1.5 | Instellingen-shell + Profiel + Bedrijfsgegevens | 1.4 | Opslaan met auto-save; viewers read-only |
| 1.6 | Bedrijfsinformatie: scan-website, context (+ spraak), documenten (bucket, extractie, samenvatting), checklist | 1.5 | Alle vier onderdelen werken; SSRF-test slaagt |
| 1.7 | Afdelingen (boom) en Rollen & Personen | 1.5 | Max. 3 niveaus, geen lussen; archiveren/koppelen werkt |
| 1.8 | Publieke site veiligstellen en rename | 1.1 | Geen prijzen/checkout/onjuiste claims; naam ControlVisi |
| 1.9 | Tests en acceptatie fase 1 (§6.9) | 1.1–1.8 | Alle vinkjes groen → **controlemoment Luuk** |

### Fase 2 – Motor
| WP | Inhoud | Hangt af van | Klaar als |
|---|---|---|---|
| 2.1 | Schema frameworks + framework_requirements; seed laag 1 (draft) | 1.9 | Seeds staan; RLS op status |
| 2.2 | Schema pakket (§7.2) incl. RLS, indexen, triggers | 1.9 | Isolatietest slaagt |
| 2.3 | Shared modules: cvConstants, cvScores, cvValidation, cvSchemas, cvContext + unit-tests | 2.2 | Tests groen |
| 2.4 | `cv-ai` tasks: document_digest, generate_process | 2.3 | Stap 1 werkt voor testproces |
| 2.5 | Tasks: generate_risks_controls, generate_testing | 2.4 | Stap 2–3 werken; validatie actief |
| 2.6 | Task generate_compliance (per framework) + gap-afleiding + scoreberekening | 2.1, 2.5 | Gaps afgeleid; scores deterministisch |
| 2.7 | Orkestratie, hervatten, rate-limit, generation_runs | 2.6 | Mislukte stap te hervatten |
| 2.8 | Testset draaien (Bijlage E) + beoordeling door Claude + modelmeting | 2.7 | Rapporten voldoen aan drempels |
| 2.9 | Afstellen (prompts/schema/model) en acceptatie fase 2 (§7.9) | 2.8 | → **controlemoment Luuk** |

### Fase 3 – Scherm
| WP | Inhoud | Klaar als |
|---|---|---|
| 3.1 | Intake | Pakket kan worden aangemaakt met validatie |
| 3.2 | Voortgang + controlemoment + rolvoorstellen | Stappen zichtbaar; hervatten werkt |
| 3.3 | Resultaatshell + Samenvatting | Scores en waarschuwingen tonen |
| 3.4 | Proces & RACI (matrix) | Bewerken en A-regel-waarschuwing |
| 3.5 | Risico's & Controls (RCM, heatmap, filters) | Alle filters werken |
| 3.6 | Testen & Evidence | Evidence-status herberekent score |
| 3.7 | Compliance (dekking, scope-schakelaar, gaps) | Scope-wijziging herberekent gaps |
| 3.8 | Bewerken, status, regenereren per sectie, verouderd-melding, auto-save | AR-06 aantoonbaar |
| 3.9 | Dashboard en lijst | Aantallen kloppen |
| 3.10 | Acceptatie fase 3 (§8.8) | → **controlemoment Luuk** |

### Fase 4 – Frameworks
Per portie (laag 2: SOX 404, ISAE 3402/SOC 1, SOC 2, NIS2, DORA, NL Corporate Governance Code; laag 3: COSO ERM, ISO 31000, COBIT 2019, NIST CSF 2.0, ISO 22301, ISO 9001, CSRD/ESRS): onderzoek → seed (draft) → beoordeling → test → vrijgave. Voorgestelde porties: **A** SOX + ISAE 3402 + SOC 2 · **B** NIS2 + DORA + NL CG Code · **C** COSO ERM + ISO 31000 + COBIT · **D** NIST CSF + ISO 22301 + ISO 9001 + CSRD/ESRS.

### Fase 5 – Afronden
5.1 Export (Word/Excel) · 5.2 Acties · 5.3 Licentiebeheer (geldig tot) · 5.4 Uitnodigen · 5.5 Juridische pagina's NL/EN · 5.6 Data-export en account verwijderen · 5.7 Huisstijl · 5.8 Marketing en vertaling · 5.9 Prijzen (na besluit) · 5.10 Eindacceptatie (§10.8).

---

## Bijlage C – Frameworkregister

Granulariteit en indicatie van aantal eisen; bronnen om bij het vastleggen te raadplegen. Alle eisen worden in eigen woorden geformuleerd. Punten met [VERIFIEREN] moeten bij de uitvoering bij de officiële bron gecontroleerd worden; mijn kennis loopt tot eind juni 2026.

| # | Framework | Laag | Natuurlijke granulariteit | Indicatie eisen | Bronnen / verifiëren |
|---|---|---|---|---|---|
| 1 | COSO Internal Control – Integrated Framework (2013) | 1 | 5 componenten, 17 principes | 17 | COSO (coso.org) |
| 2 | ISO/IEC 27001:2022 | 1 | Clausules 4–10 en Annex A-thema's (organisatorisch, personen, fysiek, technologisch) | ~25–35 | ISO (alleen eigen formulering, norm is beschermd) |
| 3 | AVG/GDPR (Verordening 2016/679) | 1 | Beginselen en kernartikelen (o.a. 5, 6, 24, 25, 28, 30, 32, 33, 35) | ~25 | EUR-Lex; Autoriteit Persoonsgegevens |
| 4 | SOX 404 | 2 | Managementbeoordeling interne beheersing over financiële verslaggeving, ICFR-onderwerpen | ~15 | SEC; PCAOB (AS 2201) |
| 5 | ISAE 3402 / SOC 1 | 2 | Beschrijving systeem, controldoelstellingen, ontwerp en werking | ~15 | IAASB; NBA |
| 6 | SOC 2 | 2 | Trust Services Criteria (security, beschikbaarheid, verwerkingsintegriteit, vertrouwelijkheid, privacy) | ~30 | AICPA |
| 7 | NIS2 (Richtlijn 2022/2555) | 2 | Artikel 21-maatregelen, governance, meldplicht | ~15 | EUR-Lex; Nederlandse implementatie (Cyberbeveiligingswet) [VERIFIEREN stand van wetgeving] |
| 8 | DORA (Verordening 2022/2554) | 2 | Vijf pijlers: ICT-risicobeheer, incidenten, weerbaarheidstesten, derde partijen, informatie-uitwisseling | ~25 | EUR-Lex; relevante RTS/ITS [VERIFIEREN] |
| 9 | Nederlandse Corporate Governance Code | 2 | Principes en best practice-bepalingen over risicobeheer en interne beheersing | ~20 | Monitoring Commissie Corporate Governance Code [VERIFIEREN actuele versie] |
| 10 | COSO ERM (2017) | 3 | 5 componenten, 20 principes | 20 | COSO |
| 11 | ISO 31000 | 3 | Principes, kader, proces | ~15 | ISO (eigen formulering) |
| 12 | COBIT 2019 | 3 | Selectie relevante governance- en managementdoelstellingen | ~30 | ISACA |
| 13 | NIST CSF 2.0 | 3 | 6 functies, ~22 categorieën | ~22 | NIST |
| 14 | ISO 22301 | 3 | Bedrijfscontinuïteitsmanagement | ~15 | ISO (eigen formulering) |
| 15 | ISO 9001 | 3 | Kwaliteitsmanagement, clausules 4–10 | ~20 | ISO (eigen formulering) |
| 16 | CSRD / ESRS | 3 | Rapportagevereisten en datapunten op hoofdlijn | ~20 | EUR-Lex (Richtlijn 2022/2464, ESRS-verordening 2023/2772) [VERIFIEREN: recente vereenvoudigingen en wijzigingen in reikwijdte] |

---

## Bijlage D – Informatie-checklist (categorieën voor "Bedrijfsinformatie")

Elke categorie heeft in de UI een korte hint. Niet aangevinkte categorieën gaan als "ontbrekende bedrijfsinformatie" naar de AI.

| Nr | Categorie | Hint |
|---|---|---|
| 1 | Beleid en procedures | Bijvoorbeeld informatiebeveiliging, inkoop, financiële administratie, bevoegdheden |
| 2 | Procesbeschrijvingen en werkinstructies | Flowcharts, handboeken, SOP's |
| 3 | Risicoregister en risicoanalyses | Bestaand register, risicoappetijt, risicobeoordelingen |
| 4 | Bestaande controls en control-raamwerk | Eerdere RCM's, control-bibliotheek, testresultaten |
| 5 | Eerdere audit- en assurancerapporten | Intern, extern, ISAE/SOC-rapporten, management letters |
| 6 | Systeemlandschap | Applicaties, ERP, koppelingen, toegangsbeheer, IT-architectuur |
| 7 | Organisatiestructuur en bevoegdheden | Organogram, autorisatiematrix, functiescheiding |
| 8 | Compliance-verplichtingen en certificeringen | Welke wetten, normen en keurmerken gelden |
| 9 | Incidenten en bevindingen | Incidentlog, issues, openstaande bevindingen |
| 10 | Uitbesteding en leveranciers | Kritieke leveranciers, SLA's, verwerkersovereenkomsten |

---

## Bijlage E – Testset en fixtures

**Doel:** reproduceerbare toetsing van de generatie. De fixture is **fictief**; gebruik geen echte klantgegevens.

### E.1 Fictieve organisatie "Voorbeeld Industrie B.V."
- Sector industrie/maakindustrie, ± 800 FTE, locaties Eindhoven en Rotterdam, type profit.
- **Afdelingen:** Finance (→ Financial Accounting, Controlling, Treasury) · Inkoop (→ Strategisch inkoop, Operationeel inkoop) · IT (→ Infrastructuur, Applicaties, Security) · HR · Operations · Compliance & Risk.
- **Rollen (functienamen, zonder persoonsnamen):** CFO · Financieel Controller · Accountant Financial Accounting · Treasury Manager · Hoofd Inkoop · Inkoper · Crediteurenadministrateur · CIO · IT Security Officer · IT Beheerder · HR Manager · Compliance Officer · Risk Manager · Operations Manager · Interne Auditor.
- **Bedrijfscontext (fixture):** korte beschrijving, ERP-landschap (één ERP voor finance en inkoop), bestaande IT-beleidsdocumenten, geen risicoregister op afdelingsniveau. Checklist: categorieën 1, 6, 7 aangevinkt; de rest niet (om het "ontbreekt"-gedrag te testen).

### E.2 Drie testprocessen
| # | Proces | Procesbeschrijving (kern) | Frameworks |
|---|---|---|---|
| T1 | Maandafsluiting | Finance verzamelt boekingen, controllers keuren memoriaalboekingen goed, afstemming grootboek en subadministraties, afsluiting en rapportage aan de CFO | COSO + SOX 404 |
| T2 | Inkoop-tot-betaling | Aanvraag, goedkeuring, bestelling, goederenontvangst, factuurverwerking (drieweegse match), betaling, leveranciersstamgegevens | COSO + ISAE 3402 |
| T3 | Toegangsbeheer IT | Aanvragen en goedkeuren van toegang, uitgifte, periodieke review van rechten, in- en uitdiensttreding, bevoorrechte accounts | ISO 27001 + SOC 2 |

Elke processbeschrijving wordt uitgeschreven in 150–300 woorden in NL **en** in EN (6 testruns per modelvariant).

### E.3 Procedure
1. Draai elk proces met elke modelvariant (zie §7.8) in beide talen.
2. Draai de automatische controles (§7.6); alle blokkerende regels moeten na de herstelronde slagen.
3. Claude beoordeelt de inhoud met de rubric (§14) en schrijft per run een rapport.
4. Herhaal bij elke promptwijziging; vergelijk scores en kosten.
5. Reproduceerbaarheid: dezelfde invoer tweemaal draaien; scores moeten binnen een afgesproken marge liggen (start: ± 5 punten ontwerpscore; marge nog te bevestigen).

### E.4 Verwachte uitkomsten (steekproef, geen letterlijke tekst)
- T1: controls rond goedkeuring memoriaalboekingen, afstemming grootboek/subadministraties, functiescheiding, cut-off; eigenaren uit Finance-rollen.
- T2: drieweegse match, functiescheiding aanvraag/goedkeuring/betaling, wijziging leveranciersstamgegevens, betalingsrun-autorisatie.
- T3: toegangsaanvraag en -goedkeuring, periodieke access review, joiner/mover/leaver, bevoorrechte accounts, logging.
Als de AI voor een proces rollen mist (bijvoorbeeld "Service Desk"), moet dat als rolvoorstel verschijnen, niet als verzonnen persoonsnaam.

---

## Bijlage F – Mapping oude tabellen → nieuw schema

| Oude tabel | Nieuwe tabel | Opmerking |
|---|---|---|
| profiles | profiles + organizations + organization_members | Plan-/limietkolommen vervallen; bedrijfsgegevens naar organizations |
| projects | projects | Krijgt organization_id, afdeling, domein, taal, status |
| frameworks | frameworks (+ framework_requirements) | 97 namen vervangen door gecontroleerde bibliotheek |
| project_frameworks | project_frameworks | Maximaal 3 per project |
| process_flows | process_steps | Rol als verwijzing; code P-### door code toegekend |
| raci_entries | raci_entries | Verwijst naar stap-id en rol-id; A-regel |
| risks | risks | Rating/score berekend; residuele kans/impact; categorieën uitgebreid |
| controls | controls | `is_key` en key-velden hier; eigenaar als rol; processtap |
| risk_control_mapping + risk_control_mapping_new | risk_controls | Eén tabel met coverage |
| key_controls | (velden in controls) | Geen aparte tabel |
| control_objectives | (vervalt) | Overlapt met framework-eisen |
| framework_mappings | control_requirements + requirement_scope | Verwijst naar echte eisen |
| gaps | gaps | Afgeleid uit eisen |
| test_plans | test_plans | Eén per key control |
| evidence_items | evidence_items | Eenduidige statussen |
| assessments | (vervalt in v1) | D&I-/OE-beoordeling kan later terugkomen |
| audit_readiness_scores | project_scores | Berekend, geen AI-tekst |
| issues, remediation_tasks | actions (fase 5) | Eén eenvoudige actiemodule |
| (nieuw) | organizations, organization_members, organization_settings, organization_documents, departments, org_roles, platform_admins, licenses, generation_runs, requirement_scope, control_requirements, project_scores, actions, ai_usage | |

---

## Bijlage G – Rekenconstanten (startwaarden voor `cvConstants.ts`)

```
RISK_SCALE            = 1..5 (kans en impact)
RATING_BANDS          = low 1–4 · medium 5–9 · high 10–15 · critical 16–25
COUNTS                = steps 8–15 (max 20) · risks 6–12 (max 15) · controls 10–20 (max 25)
KEY_CONTROL_SHARE     = 20–30% (min 3)
EVIDENCE_PER_KEY      = 2–3
DESIGN_WEIGHTS        = coverage 40 · completeness 25 · riskCoverage 20 · testing 15
READINESS_WEIGHTS     = design 0.5 · evidence 0.3 · gaps 0.2
GAP_WEIGHTS           = critical 4 · high 3 · medium 2 · low 1
LABEL_THRESHOLDS      = audit_ready ≥ 80 · almost 60–79 · in_progress < 60
MAX_FRAMEWORKS        = 3
CONTEXT_BUDGETS       = company_context 30.000 tekens · documenten max 10 / ± 40.000 tekens
RATE_LIMIT            = 20 generaties per organisatie per dag (startwaarde)
SCAN_LIMITS           = max 8 pagina's · timeouts en maximale grootte per pagina
MODEL_PER_TASK        = te bepalen via meting (start: flash voor digest/process/compliance; pro vergelijken voor risks_controls/testing)
TEMPERATURE           = 0.3
```

---

## Bijlage H – Woordenlijst

| Term | Betekenis |
|---|---|
| RACI | Responsible (uitvoerder), Accountable (eindverantwoordelijke, precies één), Consulted, Informed |
| RCM | Risk and Control Matrix: koppeling van risico's aan beheersmaatregelen |
| Control | Beheersmaatregel die een risico beperkt (preventief, detectief of corrigerend) |
| Key control | Control die cruciaal is voor de beheersing en prioriteit krijgt bij testen |
| Testplan | Beschrijving van hoe een key control wordt getest (aanpak, steekproef, stappen, criteria) |
| Evidence | Bewijsstuk dat een control werkt (document, rapport, log, goedkeuring) |
| Framework-eis | Een onderdeel van een norm of wet waaraan een control kan bijdragen |
| Dekking | Mate waarin controls een eis afdekken: volledig, gedeeltelijk, geen |
| Gap | In-scope eis zonder (volledige) dekking |
| Ontwerpscore | Score voor de volledigheid en consistentie van het pakket (0–100) |
| Audit readiness | Score voor de mate waarin het pakket aantoonbaar auditklaar is, inclusief evidence en gaps (0–100) |
| Rolvoorstel | Door de AI voorgestelde functie die nog niet bestaat; gebruiker accepteert of wijst af |
| AI-concept | Door AI gemaakt resultaat dat een professional moet controleren |
