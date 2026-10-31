// js/data/missions/mission-6.js

export const mission6Data = {
    id: 6,
    title: "M6: Fremkaldelsen af »Flæskestegen«",
    period: "5. maj 1945",
    banner: "/images/mission-6.jpg",
    desc: "Befrielsen er en kendsgerning. I mørkekammeret på DJI skal de hemmelige 16mm-filmoptagelser fra kameraet 'Flæskestegen' fremkaldes og klippes sammen, så historien om Jomsborgs modstandsfolk kan dokumenteres for eftertiden.",

    // Hold Skole: Mørkekammerets 4 rå filmnegativer og kemibad
    darkroom: {
        strips: [
            { id: "strip_b", code: "B", label: "Filmstrimmel B", visual: "Mænd i gymnastiksalen samlet om våbenkasser og håndbolde.", trueOrder: 2 },
            { id: "strip_d", code: "D", label: "Filmstrimmel D", visual: "Ambulance (Ford V8) ruller gennem porten med afblændede lygter.", trueOrder: 4 },
            { id: "strip_a", code: "A", label: "Filmstrimmel A", visual: "Tre civilklædte mænd ankommer i forhallen på Jomsborg.", trueOrder: 1 },
            { id: "strip_c", code: "C", label: "Filmstrimmel C", visual: "Løftede gulvbrædder under en seng fyldt med dynamitkasser.", trueOrder: 3 }
        ],
        requiredBathSeconds: 12, // Den korrekte fremkaldertid
        baths: [
            { id: "dev", name: "1. Fremkalderbad (Agfa Rodinal)" },
            { id: "stop", name: "2. Stopbad (Eddikesyre 2%)" },
            { id: "fix", name: "3. Fiksérbad (Natriumtiosulfat)" }
        ]
    },

    // Hold Modstand: Klippebordets tidslinje & kemiske forskrifter
    logbook: [
        {
            stage: "1. AKTION (Efterår 1944)",
            title: "Betjentenes ankomst",
            desc: "De eftersøgte politibetjente skjules under jorden som elever på Jomsborg."
        },
        {
            stage: "2. AKTION (April 1945)",
            title: "Våbeninstruktion under regnvejr",
            desc: "Willy Eisfeldt og sabotørerne underviser i skinneladninger bag lukkede døre i gymnastiksalen."
        },
        {
            stage: "3. AKTION (April 1945)",
            title: "Det hemmelige hulrum",
            desc: "Dynamitten evakueres fra kloakken og stables i bjælkelaget under Ross Sørensens seng."
        },
        {
            stage: "4. AKTION (8. april 1945)",
            title: "Ambulancens redning",
            desc: "Ambulancen med modstandens centrale våben og nødradio reddes 5 minutter før Gestapos razzia."
        }
    ],

    chemicalInstructions: "Agfa 16mm film skal ligge i fremkalderkarret i PRÆCIS 12 sekunder ved 20°C for optimal kontrast.",
    correctFilmOrder: ["strip_a", "strip_b", "strip_c", "strip_d"]
};