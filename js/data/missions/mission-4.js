// js/data/missions/mission-4.js

export const mission4Data = {
    id: 4,
    title: "M4: Ambulancen og Razziaen i Vejle",
    period: "8. april 1945",
    banner: "/images/mission-4.jpg",
    desc: "12 modstandsmænd er arresteret i Vejle. Gestapo er på vej mod det centrale våbendepot. Modstandsbevægelsen har rekvireret en ambulance (Ford V8) og læsset alle våben og en illegal radiosender ombord. I har under 15 minutter til at navigere ambulancen uden om patruljerne og åbne porten til Jomsborg, 5 minutter før Gestapo rammer skjulestedet.",
    
    // FASE 1: De 3 rute-etaper
    routes: [
        {
            stage: 1,
            title: "Etape 1: Ud af Vejle bymidte",
            // Modstand ser vejforhold
            resistanceChoices: [
                { id: "A", name: "Strandgade", note: "Lange brosten – ryster kasserne, men god fart." },
                { id: "B", name: "Havnepromenaden", note: "Spærret af tyske jernbanesveller." },
                { id: "C", name: "Koldingvej", note: "Åben asfalt, men tæt på Gestapos hovedkvarter." }
            ],
            // Skole ser Gestapo-patruljer fra tårnet
            schoolIntel: [
                { id: "A", name: "Strandgade", status: "FRI: Ingen patruljer observeret." },
                { id: "B", name: "Havnepromenaden", status: "SPÆRRET: Fast tysk maskingeværrede." },
                { id: "C", name: "Koldingvej", status: "FARE: 2 Gestapo-vogne med projektører." }
            ],
            safeChoice: "A"
        },
        {
            stage: 2,
            title: "Etape 2: Forbi Nørremarken",
            resistanceChoices: [
                { id: "A", name: "Hovedlandevejen", note: "Bred vej, men ingen træer til dække." },
                { id: "B", name: "Grusgraven", note: "Ujævn sti, risiko for punkteret dæk." },
                { id: "C", name: "Skovbrynet", note: "Mørk grusvej beskyttet af tætte bøgetræer." }
            ],
            schoolIntel: [
                { id: "A", name: "Hovedlandevejen", status: "FARE: Tysk mobil pejlevogn patruljerer." },
                { id: "B", name: "Grusgraven", status: "FARE: Tyske vagtposter med hunde." },
                { id: "C", name: "Skovbrynet", status: "FRI: Helt mørklagt, ingen tyske projektører." }
            ],
            safeChoice: "C"
        },
        {
            stage: 3,
            title: "Etape 3: Indkørslen til Jomsborg",
            resistanceChoices: [
                { id: "A", name: "Hovedporten", note: "Direkte vej til gårdspladsen, men godt oplyst." },
                { id: "B", name: "Østporten (v. Kloakken)", note: "Bagvej ved renseanlægget, fuldstændig i skygge." },
                { id: "C", name: "Køkkenvejen", note: "Blokeret af landbrugsmaskiner." }
            ],
            schoolIntel: [
                { id: "A", name: "Hovedporten", status: "FARE: Gestapo-forfølgere ses i horisonten." },
                { id: "B", name: "Østporten (v. Kloakken)", status: "FRI: Thomsen og Thormod står klar med afblændet lygte." },
                { id: "C", name: "Køkkenvejen", status: "SPÆRRET: Ufremkommelig." }
            ],
            safeChoice: "B"
        }
    ],

    // FASE 2: Gåde til port-koden (Delt 50/50 mellem holdene)
    // Modstands del: Indstil nødradioen til kanal 120 kHz -> Giver cifrene "19"
    radioFrequencies: [
        { channel: "Kanal 1", freq: "80 kHz", digits: "52" },
        { channel: "Kanal 2", freq: "120 kHz", digits: "19" }, // Korrekt
        { channel: "Kanal 3", freq: "160 kHz", digits: "88" }
    ],

    // Skoles del: Relæ-sikringer der skal summe til præcis 45 Volt -> Giver cifrene "45"
    fuses: [
        { id: "fuse1", volts: 15, label: "Sikring A (15V)" },
        { id: "fuse2", volts: 30, label: "Sikring B (30V)" },
        { id: "fuse3", volts: 20, label: "Sikring C (20V)" }
    ],

    finalGateCode: "1945" // 19 (fra Modstand) + 45 (fra Skole)
};