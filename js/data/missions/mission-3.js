// js/data/missions/mission-3.js

export const mission3Data = {
    id: 3,
    title: "M3: Rummet under Ross' Seng",
    period: "April 1945",
    banner: "./images/mission-3.jpg",
    desc: "Gestapo har taget en af modstandens mænd i Vejle. Sprængstoffet i kloakrensningsanlægget må flyttes i nattens mulm og mørke. Svend Aage Thomsen har lavet et hemmeligt rum under gulvet på Jomsborg under Ross Sørensens seng. Tøm kloakken og udløs fjedermekanismen.",
    
    // Hold Skole: Fjedermekanismen under sengen & Hydraulikreglerne for kloakken
    hydraulicsGuide: [
        {
            rule: "REGEL 1: NORDVENTILEN (SKOVEN)",
            calc: "Nordventilen må maksimalt indstilles på et arbejdstryk på 4 Bar for at undgå rørbrud."
        },
        {
            rule: "REGEL 2: SYDVENTILEN (AFLASTNING)",
            calc: "Sydventilen skal indstilles præcis 1 Bar lavere end Nordventilen."
        },
        {
            rule: "REGEL 3: ØSTVENTILEN (FJORDFALD)",
            calc: "Østventilen skal sættes til præcis det dobbelte af differencen mellem Nord og Syd (2 × 1 Bar)."
        }
    ],

    floorPlanks: [
        { id: "anker", symbol: "⚓", name: "Ankeret" },
        { id: "taarn", symbol: "🏰", name: "Tårnet" },
        { id: "moelle", symbol: "⚙️", name: "Møllen" },
        { id: "boelge", symbol: "🌊", name: "Bølgen" }
    ],

    correctPlankSequence: ["anker", "taarn", "moelle", "boelge"],

    // Hold Modstand: De 3 ventiler i kloakken & det hemmelige vers
    correctValves: {
        nord: "4",
        syd: "3",
        oest: "2"
    },

    drainVerse: [
        "1. Først kastes det tunge jern mod fjordens bund.", // Ankeret
        "2. Dernæst knejser vagten over Jomsborg.", // (Tårnet)
        "3. Så knuses kornet af stenens vægt.", //  (Møllen)
        "4. Til sidst skyller vandet over kysten." //  (Bølgen)
    ],

    finalPasscode: "ROSS" // Navnet på eleven der sover oven på sprængstoffet
};