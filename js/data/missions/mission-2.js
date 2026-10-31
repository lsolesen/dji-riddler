// js/data/missions/mission-2.js

export const mission2Data = {
    id: 2,
    title: "M2: Den Illegale Våbeninstruktion",
    period: "April 1945",
    banner: "/images/mission-2.jpg",
    desc: "Udenfor siler regnen ned, og dørene til gymnastiksalen er låst. Dækhistorien er et 'håndboldkursus', men på gulvet står kasserne med våben og sprængstof. I skal klargøre en sabotagebombe til nattens togaktion ud fra modstandens hemmelige manual.",
    
    // Hold Skole: Komponenter på arbejdsbordet
    bombAssembly: {
        components: [
            { id: "explosive", name: "Plastisk Sprængstof (Nobel 808)", icon: "🧱", desc: "1 kg formbart plastic-sprængstof til skinnelasken." },
            { id: "magnets", name: "Magnetbeslag", icon: "🧲", desc: "Kraftige hestesko-magneter der fæstner ladningen til jernbaneskinnen." },
            { id: "detonator", name: "No. 27 Fænghætte", icon: "⚡", desc: "Ekstremt stødfølsom tændsats. Må kun monteres i sprængstoffet EFTER magneterne er fastgjort." },
            { id: "pencil_white", name: "Hvid Sprængblyant (2 timer)", icon: "⏱️", desc: "Kemisk forsinkelsesblyant med syreampul mærket med hvid ring." },
            { id: "pencil_red", name: "Rød Sprængblyant (30 min)", icon: "⏱️", desc: "Forsinkelsesblyant med rød ring – til øjeblikkelig flugt." },
            { id: "pencil_green", name: "Grøn Sprængblyant (6 timer)", icon: "⏱️", desc: "Forsinkelsesblyant med grøn ring – til langtidssabotage." }
        ],
        // Den korrekte samlerækkefølge
        correctSteps: [
            "explosive",
            "magnets",
            "detonator",
            "pencil_white"
        ]
    },

    // Hold Modstand: Den britiske SOE-sabotagemanual og togplan
    manual: [
        {
            title: "TRIN 1: FORMENING AF LADNINGEN",
            text: "Start ALTID med at placere det plastiske sprængstof (Nobel 808) i montagebakken, så det passer til skinnens profil."
        },
        {
            title: "TRIN 2: MAGNETMONTERING",
            text: "Magnetbeslaget skal fæstnes på sprængstoffet som andet trin. Rystelserne under magnetmontagen vil detonere en indsat fænghætte!"
        },
        {
            title: "TRIN 3: PRIMÆR TÆNDING",
            text: "Først når magneterne sidder urokkeligt fast, presses No. 27 fænghætten forsigtigt ind i sprængstoffets center."
        },
        {
            title: "TRIN 4: FORSINKELSESVALG (TOGPLANEN)",
            text: "Tyskernes godstog mod nord passerer banen præcis kl. 23:00. Sabotørerne placerer ladningen kl. 21:00. Vælg sprængblyanten med PRÆCIS 2 timers forsinkelse (Rød = 30 min, Hvid = 2 timer, Grøn = 6 timer)."
        }
    ],

    secretSerialCode: "808-V" // Koden der dukker op på fænghætten ved korrekt samling
};