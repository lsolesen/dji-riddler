// js/views/missions/mission-3.js

export function initMission3(container, char, missionData, onComplete) {
    let state = JSON.parse(localStorage.getItem('vih_m3_state') || JSON.stringify({
        valves: { nord: '1', oest: '1', syd: '1' },
        sewerDrained: false,
        plankSequence: [],
        trapdoorOpen: false,
        roomSealed: false
    }));

    container.innerHTML = `
        <div class="briefing-box">
            <h2>${missionData.title}</h2>
            <p class="mission-period">${missionData.period}</p>
            <p>${missionData.desc}</p>
        </div>
        <div class="asymmetric-playfield">
            ${char.team === 'Skole' ? renderSchoolFloor(missionData, state) : renderResistanceSewer(missionData, state)}
        </div>
    `;

    if (char.team === 'Skole') {
        setupSchoolFloorInteractions(container, char, missionData, state, onComplete);
    } else {
        setupResistanceSewerInteractions(container, char, missionData, state, onComplete);
    }
}

// ==================== HOLD SKOLE: GULVET UNDER ROSS' SENG ====================
function renderSchoolFloor(mission, state) {
    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>🛏️ SOVESALEN PÅ JOMSBORG // UNDER ROSS' SENG</h3>
                <p>1. Læs først hydraulikreglerne op for Modstand, så de kan tømme kloakken.<br>
                   2. Hør bagefter verset fra skaktens bund og tryk på gulvplankerne i den rette sekvens.</p>
            </div>

            <!-- Del 1: Hydraulik-vejledningen til Modstandsholdet -->
            <div class="hydraulics-calc-box">
                <span class="calc-box-title">📐 FORSTANDERENS RØRBEREGNING FOR KLOAKKEN:</span>
                <div class="rules-list-compact">
                    ${mission.hydraulicsGuide.map(g => `
                        <div class="calc-row">
                            <strong>${g.rule}:</strong> <span>${g.calc}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Del 2: Fjedermekanismen i gulvet -->
            <div class="trapdoor-mechanism-wrapper">
                <div class="mechanism-header">
                    <span>GULVBRÆDDER UNDER SENGEBUNDEN:</span>
                    <button id="btn-reset-planks" class="btn btn-sm btn-muted" ${state.plankSequence.length === 0 ? 'disabled' : ''}>Nulstil tryk</button>
                </div>

                <div class="planks-grid">
                    ${mission.floorPlanks.map(plank => {
                        const stepIndex = state.plankSequence.indexOf(plank.id);
                        const isPressed = stepIndex !== -1;
                        return `
                            <button class="plank-btn ${isPressed ? 'pressed' : ''}" data-plank-id="${plank.id}">
                                <div class="plank-symbol">${plank.symbol}</div>
                                <span class="plank-name">${plank.name}</span>
                                ${isPressed ? `<span class="step-badge">Trin ${stepIndex + 1}</span>` : ''}
                            </button>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Resultatfelt når lugen fjedrer op -->
            <div class="resolution-box ${state.trapdoorOpen ? 'unlocked' : 'locked'}">
                ${state.trapdoorOpen ? `
                    <div class="clue-content fade-in">
                        <h4>✓ KLIK! FJEDERLÅSEN SPRANG OP:</h4>
                        <p>Under Ross' seng åbner der sig et dybt hulrum i bjælkelaget. Kasserne med dynamit stables hurtigt på plads.</p>
                        
                        <div class="secret-box text-center">
                            DEPOT-KODENAVN: <strong class="big-code">${mission.finalPasscode}</strong>
                        </div>

                        <p class="room-shout">📢 Råb kodenavnet <strong>${mission.finalPasscode}</strong> til Modstandsholdet for at forsegle depotet!</p>
                    </div>
                ` : `
                    <p class="puzzle-hint">⚠️ Få verset fra bunden af den tømte kloakskakt hos Modstand for at trykke på de 4 planker i den korrekte rækkefølge.</p>
                `}
            </div>

            ${state.trapdoorOpen || state.roomSealed ? `
                <div class="approved-banner fade-in">
                    ✓ GULVBRÆDDERNE ER ÅBNET OG FORSEGLEDE. ROSS SOVER TRYGT PÅ 100 KG SPRÆNGSTOF.
                </div>
            ` : ''}
        </div>
    `;
}

// ==================== HOLD MODSTAND: KLOAKRENSNINGSANLÆGGET ====================
function renderResistanceSewer(mission, state) {
    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>💧 KLOAKRENSNINGSANLÆGGET ØST FOR SKOLEN</h3>
                <p>Spørg Skolen om de hydrauliske trykregler. Indstil de 3 ventiler præcist for at pumpe vandet væk fra dynamitkammeret.</p>
            </div>

            <!-- De 3 trykventiler -->
            <div class="valves-control-console">
                <div class="valves-row">
                    ${['nord', 'oest', 'syd'].map(vId => {
                        const labels = { nord: 'Nordventil (Skoven)', oest: 'Østventil (Fjorden)', syd: 'Sydventil (Aflastning)' };
                        return `
                            <div class="valve-station">
                                <span class="valve-label">${labels[vId]}</span>
                                <div class="valve-meter-display">${state.valves[vId]} Bar</div>
                                <div class="valve-buttons">
                                    <button class="btn btn-sm btn-valve-adjust" data-valve="${vId}" data-delta="-1" ${state.valves[vId] <= 1 ? 'disabled' : ''}>-</button>
                                    <button class="btn btn-sm btn-valve-adjust" data-valve="${vId}" data-delta="1" ${state.valves[vId] >= 5 ? 'disabled' : ''}>+</button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="valve-action-bar">
                    <button id="btn-drain-sewer" class="btn btn-primary" ${state.sewerDrained ? 'disabled' : ''}>
                        ${state.sewerDrained ? 'SKAKTEN ER TØMT' : 'AKTIVÉR UDPUMPNING'}
                    </button>
                </div>
            </div>

            <!-- Tømt skakt: Det hemmelige vers -->
            <div class="sewer-drain-result ${state.sewerDrained ? 'drained' : 'flooded'}">
                ${state.sewerDrained ? `
                    <div class="drained-content fade-in">
                        <h4>📜 MESSINGPLADE AFSLØRET PÅ SKAKTENS BUND:</h4>
                        <p class="verse-sub">Læs dette vers op for Skolen, så de ved, hvilke gulvplanker der skal trykkes ned:</p>
                        
                        <div class="secret-verse-box">
                            ${mission.drainVerse.map(line => `<div class="verse-line">${line}</div>`).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="flooded-placeholder">
                        🌊 Vandstanden i skakten er for høj. Indstil de 3 ventiler ud fra Skolens beregninger.
                    </div>
                `}
            </div>

            <!-- Forsegling af depotet med kode fra sengen -->
            <div class="safe-container" style="margin-top: 20px;">
                <div class="safe-header">
                    <h4>🔒 ENDELIG FORSEGLING AF SPRÆNGSTOFDEPOTET</h4>
                    <p>Skolen afslører kodenavnet, når fjedermekanismen under Ross' seng er udløst.</p>
                </div>

                ${!state.roomSealed ? `
                    <div class="safe-keypad">
                        <input type="text" id="passcode-input" placeholder="KODENAVN" class="safe-input" style="width: 170px; text-transform: uppercase;">
                        <button id="btn-seal-room" class="btn btn-primary">FORSEGL DEPOT</button>
                    </div>
                ` : `
                    <div class="safe-opened-box fade-in">
                        <div class="stamp-reveal">
                            <span class="stamp-title">DEPOT FLYTTET OG FORSEGLT:</span>
                            <div class="big-stamp" style="color: #4ade80; border-color: #4ade80;">DEPOT SIKRET</div>
                        </div>
                        <p class="room-shout">✓ Sprængstoffet er skjult under sengen. Gestapo finder ingenting i kloakken!</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// ==================== LOGIK OG INTERAKTION ====================
function checkValves(correct, current) {
    return current.nord === correct.nord &&
           current.oest === correct.oest &&
           current.syd === correct.syd;
}

function setupSchoolFloorInteractions(container, char, mission, state, onComplete) {
    const saveAndRefresh = () => {
        localStorage.setItem('vih_m3_state', JSON.stringify(state));
        initMission3(container, char, mission, onComplete);
    };

    // Nulstil tryk på planker
    const resetBtn = container.querySelector('#btn-reset-planks');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state.plankSequence = [];
            state.trapdoorOpen = false;
            saveAndRefresh();
        });
    }

    // Klik på de 4 planker
    container.querySelectorAll('.plank-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const plankId = btn.getAttribute('data-plank-id');

            if (!state.plankSequence.includes(plankId) && state.plankSequence.length < 4) {
                state.plankSequence.push(plankId);

                if (state.plankSequence.length === 4) {
                    const isSequenceCorrect = state.plankSequence.every(
                        (id, idx) => id === mission.correctPlankSequence[idx]
                    );

                    if (isSequenceCorrect) {
                        state.trapdoorOpen = true;
                    } else {
                        alert("KLIK-KLAK! Fjedermekanismen smækkede tilbage. Rækkefølgen var forkert – prøv igen!");
                        state.plankSequence = [];
                    }
                }
                saveAndRefresh();
            }
        });
    });

    // RETTET: Thormod kan komme videre så snart lugen er åbnet!
    if (state.trapdoorOpen || state.roomSealed) {
        onComplete();
    }
}

function setupResistanceSewerInteractions(container, char, mission, state, onComplete) {
    const saveAndRefresh = () => {
        localStorage.setItem('vih_m3_state', JSON.stringify(state));
        initMission3(container, char, mission, onComplete);
    };

    // Ventil-justering (+ / -)
    container.querySelectorAll('.btn-valve-adjust').forEach(btn => {
        btn.addEventListener('click', () => {
            const valve = btn.getAttribute('data-valve');
            const delta = parseInt(btn.getAttribute('data-delta'), 10);
            let val = parseInt(state.valves[valve], 10) + delta;
            if (val >= 1 && val <= 5) {
                state.valves[valve] = val.toString();
                saveAndRefresh();
            }
        });
    });

    // Udpumpnings-knap
    const drainBtn = container.querySelector('#btn-drain-sewer');
    if (drainBtn) {
        drainBtn.addEventListener('click', () => {
            if (checkValves(mission.correctValves, state.valves)) {
                state.sewerDrained = true;
                saveAndRefresh();
            } else {
                alert("Pumperne slår fra med et hyl! Rørtrykket er forkert. Hør Skolens regler igen.");
            }
        });
    }

    // Forseglings-knap
    const sealBtn = container.querySelector('#btn-seal-room');
    if (sealBtn) {
        sealBtn.addEventListener('click', () => {
            const input = container.querySelector('#passcode-input');
            if (input.value.trim().toUpperCase() === mission.finalPasscode) {
                state.roomSealed = true;
                saveAndRefresh();
                onComplete();
            } else {
                alert("Forkert kodenavn! Få Skolen til at aflæse navnet nede i det åbne gulvrum.");
                input.value = '';
            }
        });
    }

    if (state.roomSealed) {
        onComplete();
    }
}