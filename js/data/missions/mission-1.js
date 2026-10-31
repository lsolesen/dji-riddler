// js/data/missions/mission-1.js

export const mission1Data = {
    id: 1,
    title: "M1: Indskrivningen under Jorden",
    period: "Efterår 1944",
    banner: "./images/mission-1.jpg",
    desc: "3 underjordiske politibetjente er ankommet til Jomsborg i civil. De må placeres på værelserne med det samme efter strenge sikkerhedskrav, inden Gestapos kontrollør ankommer.",
    
    // Hold Skole: Plantegning over værelserne på Jomsborg
    rooms: [
        {
            id: "101",
            floor: "Stueetage",
            view: "Gårdspladsen",
            desc: "Stueplan. Store vinduer direkte mod den befærdede gårdsplads og hovedporten. Ingen trapper."
        },
        {
            id: "104",
            floor: "Stueetage",
            view: "Skoven",
            desc: "Stueplan. Diskret bagdør med direkte udgang til skovbrynet bag skolen. Ingen trapper."
        },
        {
            id: "202",
            floor: "1. sal",
            view: "Vest (Skovsiden)",
            desc: "1. sal ad stejl trappe. Vender mod vest. Har inspektionslem til loftet og den murede skorsten."
        },
        {
            id: "205",
            floor: "1. sal",
            view: "Øst (Fjordsiden)",
            desc: "1. sal ad stejl trappe. Store panoramavinduer mod øst mod Vejle Fjord, hvor tyskerne patruljerer."
        }
    ],

    // Korrekt værelsesfordeling for Skolen
    correctAllocation: {
        friis: "101",   // Kan ikke gå på trapper, må gerne ses hvis alibi holder
        jensen: "104",  // Eftersøgt - skal have bagdør til skov, må IKKE ses fra gården
        moller: "202"   // Radiooperatør - skal have tag/skorsten, må IKKE vende mod øst (lyttepost)
    },

    // Hold Modstand: Efterretningsmapper
    officers: [
        {
            id: "jensen",
            alias: "Betjent Hans Jensen",
            threat: "HØJ MISTANKEOBSERVATION",
            intel: "Eftersøgt af Gestapo med vellignende foto. Må under INGEN omstændigheder have udsyn til gårdspladsen, hvor tyske kurerer færdes. Kræver direkte flugtvej ud i skoven."
        },
        {
            id: "moller",
            alias: "Betjent Karl Møller",
            threat: "SPECIALUDSTYR MEDBRAGT",
            intel: "Medbringer en hemmelig engelsk radiomodtager med lang trådantenne. Skal have adgang til tag eller høj skorsten for signal. Må IKKE placeres mod øst pga. tyskernes pejlevogne ved fjorden."
        },
        {
            id: "friis",
            alias: "Betjent Poul Friis",
            threat: "FYSISK BEGRÆNSNING",
            intel: "Hårdt såret med skud i højre knæ under flugten fra Odense. Kan overhovedet IKKE gå på trapper. Hans dækidentitet som civil elev er til gengæld stensikker."
        }
    ],

    safeCombination: "407",       // 101 + 104 + 202
    finalSecretWord: "MODSTAND"   // Koden fundet i pengeskabet
};