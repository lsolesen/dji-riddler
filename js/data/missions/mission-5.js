// js/data/missions/mission-5.js

export const mission5Data = {
    id: 5,
    title: "M5: Befrielsens Minutter & Afvæbningen",
    period: "4.-5. maj 1945",
    banner: "./images/mission-5.jpg",
    desc: "Klokken er 20:34 den 4. maj 1945. BBC i London sender frihedsbudskabet, men tyskerne forsøger at overdøve frekvensen med støjsendere. I skal tune radiobølgerne ind, modtage overgivelsesordren og koordinere afvæbningen i Vejle, mens stearinlysene tændes i vinduerne.",

    // FASE 1: Radio-synkronisering
    targetFrequency: 480, // kHz
    targetGain: 65,        // dB

    // Hold Modstand: Pejlerens data (skal læses op og matches)
    jammerIntel: {
        targetFreqHint: "Frekvensen for London-særmeldingen ligger på præcis 480 kHz.",
        targetGainHint: "Signalforstærkningen skal tunes op til præcis 65 dB for at gennembryde støjsenderen."
    },

    // FASE 2: De 4 afvæbningsposter i Vejle
    posts: [
        { id: "raadhus", name: "Vejle Rådhus", task: "Hejsning af Dannebrog og sikring af civil administration", code: "7" },
        { id: "bane", name: "Banegården", task: "Afvæbning af de tyske jernbanevagter", code: "4" },
        { id: "havn", name: "Vejle Havn", task: "Sikring af kornlagre og minesprængningsdepoter", code: "9" },
        { id: "gestapo", name: "Gestapos Skjulested", task: "Beslaglæggelse af stikker-kartoteker inden afbrænding", code: "2" }
    ],

    // Korrekt afkodnings-sekvens (Rådhus -> Bane -> Havn -> Gestapo = 7-4-9-2)
    correctPostOrder: ["raadhus", "bane", "havn", "gestapo"],
    finalPasscode: "DANMARK ER FRIT"
};