# ControlVisi – Gespreksverslag ICF

Datum: 7 oktober 2026

---

## 1. Aanleiding
Je werkt aan de tool **ControlVisi** en hebt twee voorbeelden van een In Control Framework (ICF) gedeeld: van **Allego** en **Essent** (servicepartner). Je zag hier iets moois/unieks in de markt in en wilde weten wat een ICF is en hoe je dat in de tool neerzet.

## 2. Wat ik zag in de bestanden
- **Allego:** 332 controls, 251 risico's, ~66 kolommen. Risicogedreven en volledig: risk universe in 3 niveaus, assertions, SOX-key controls, COSO-componenten, uitvoering per maand, review 2e lijn.
- **Essent:** 97 controls in 22 categorieën. Praktisch en uitvoeringsgedreven: jaarplanning per maand, aparte testronde met status en commentaar, statussen (N.V.T., niet gepland, gepland, groen, oranje, rood) en een dashboard met aantallen per maand en categorie.

## 3. Uitleg: wat is een ICF
Een ICF toont dat een organisatie haar risico's beheerst. De keten: risico → control → eigenaar en frequentie → uitvoering met bewijs → review → uitkomst (groen/oranje/rood) → bevinding en actie.

## 4. Eerste voorstel voor ControlVisi
- Datamodel: risico, control (koppeling met risico's), planning, uitvoering/test, bevinding/actie, afdeling en rol.
- Schermen: framework, jaarplanning, mijn taken, review, dashboard, export.
- Onderscheidend: AI-generatie van een framework uit bedrijfsinfo, sjablonen per branche, herinneringen, eenvoud (Allego heeft ~60 kolommen; wij tonen per scherm alleen wat nodig is).
- Fasering: (1) risico's/controls/eigenaren met generatie, (2) planning en uitvoering, (3) review/bevindingen/dashboard, (4) templates en export.

## 5. Jouw antwoorden en keuzes (ronde 1)
- Doelgroep: **alle soorten bedrijven** (geen keuze tussen servicepartners en bedrijven zelf).
- SOX en COSO: akkoord om mee te nemen; je vroeg wat daar speciaal aan is.

## 6. Uitleg SOX en COSO
- **SOX:** Amerikaanse wet (2002) voor beursgenoteerde bedrijven; "key controls" worden jaarlijks door de accountant getest, met testscript. Bij Allego: 161 van 219 ingevulde controls zijn key.
- **COSO:** raamwerk met vijf componenten (control environment, risk assessment, control activities, information & communication, monitoring). Elke control krijgt een component, zodat zichtbaar is of het framework in balans is.

## 7. Voorstel dat daaruit volgde
- Eén kernmodel met **lagen**: Basis (iedereen) en Geavanceerd (SOX, COSO, assertions, testscripts), aan te zetten per klant.
- Succesvol implementeren: eerst de generatie goed krijgen, een pilotklant, **Excel-import** van een bestaand ICF, uitvoering lichtgewicht, daarna dashboard, rapport, templates en SOX/COSO.

## 8. Jouw reactie (ronde 2)
- Voorstel ziet er goed uit.
- Je wilde weten welke andere dingen nodig zijn voor een succesvolle, praktische en betrouwbare implementatie.

## 9. Aanvullende punten die ik noemde
1. Betrouwbaarheid van bewijs: audit trail, vergrendelen van afgesloten perioden, bewijs bewaren, functiescheiding.
2. Rollen en rechten, multi-tenancy (data van klant A nooit zichtbaar voor klant B, afgedwongen in de database).
3. Import/export.
4. Werkdruk: herinneringen, plaatsvervangers, nieuw jaar kopiëren.
5. AI-generatie veilig: alles is een concept dat een mens goedkeurt.
6. Privacy en juridisch (AVG, verwerkersovereenkomst, EU-opslag, NL/EN voorwaarden).
7. Licenties zonder Stripe: geldig tot een datum plus handmatig verlengen, met signalering.
8. Testen en uitrollen: demodata, pilot, rondleiding.

Vragen die ik stelde: audit trail/vergrendelen vanaf het begin? Tweetalige inhoud of alleen schermen? Data in de EU?

## 10. Jouw antwoorden (ronde 3)
- **Import van bestaand ICF:** ja, bedrijven moeten niet opnieuw beginnen. Plaats in de flow nog even bekijken waar handig; de voorbeelden gebruiken we als basis, eventueel met toevoegingen en opmerkingen.
- **Export naar Excel:** fraai, mogelijk.
- **Taal:** de tool kan volledig in het Engels én in het Nederlands worden gebruikt.
- **Audit trail/vergrendelen en EU-opslag:** ja.
- Je vroeg om: (1) volledige documentatie in een uitgebreid md-bestand, en (2) onze gesprekken in een los md-bestand.

## 11. Opgeleverd
- `ControlVisi_ICF_Implementatiedocument.md`: volledige uitwerking en implementatieplan.
- `ControlVisi_Gespreksverslag.md`: dit verslag.

## 12. Open punten (ook in het implementatiedocument)
1. Frameworkinhoud: één taal + optionele vertaling per veld?
2. Na verlopen licentie: alleen-lezen of blokkade?
3. Eerste pilotklant en branche.
4. Plaats van de import in de flow.
5. Huisstijl en prijsstructuur.
6. Daily/weekly controls: per dag/week vastleggen of maandelijks samenvatten?
7. AI-aanbieder en welke gegevens worden meegestuurd.
8. Tweestapsverificatie verplicht voor beheerders?

## 13. Afspraken
- Eerst overleggen, dan pas wijzigen in Lovable.
- Eerst de kern (generatie met gekoppelde onderdelen) goed krijgen, daarna de rest.
- Nog niets aangepast in Lovable.
