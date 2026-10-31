// js/views/missions/mission-6.js

export function initMission6(container, char, missionData, onComplete) {
    let state = JSON.parse(localStorage.getItem('vih_m6_state') || JSON.stringify({
        bathTimer: 0,
        stripsDeveloped: false,
        cutOrder: [],
        filmProjected: false
    }));

    container.innerHTML = `
        <div class="briefing-box">
            <h2>${missionData.title}</h2>
            <p class="mission-period">${missionData.period}</p>
            <p>${missionData.desc}</p>
        </div>
        <div class="asymmetric-playfield">
            ${char.team === 'Skole' ? renderSchoolDarkroom(missionData, state) : renderResistanceEditingTable(missionData, state)}
        </div>
    `;

    if (char.team === 'Skole') {
        setupSchoolDarkroomInteractions(container, missionData, state, onComplete);
    } else {
        setupResistanceEditingInteractions(container, missionData, state, onComplete);
    }
}

// ==================== HOLD SKOLE: MØRKEKAMMERET ====================
function renderSchoolDarkroom(mission, state) {
    return `
        <div class="dossier-workstation darkroom-theme">
            <div class="workstation-header">
                <h3>🔴 MØRKEKAMMERET: FREMKALDELSE AF »FLÆSKESTEGEN«</h3>
                <p>1. Få fremkaldertiden fra Modstand og start det kemiske bad.<br>
                   2. Beskriv de fremkaldte optagelser, så Modstand kan angive den historiske klipningssekvens.</p>
            </div>

            <!-- FASE 1: KEMISKE FREMKALDERKAR -->
            <div class="chemical-station-box">
                <span class="station-title">🧪 AGFA 16MM KEMIKALIEKAR (20°C):</span>
                
                <div class="chemical-trays-grid">
                    ${mission.darkroom.baths.map(b => `
                        <div class="tray-card">
                            <span class="tray-name">${b.name}</span>
                            <div class="tray-liquid"></div>
                        </div>
                    `).join('')}
                </div>

                <div class="timer-control-panel">
                    <span class="timer-label">Eksponeringstid i fremkalder:</span>
                    <div class="timer-display" id="bath-timer-display">${state.bathTimer} sekunder</div>
                    
                    ${!state.stripsDeveloped ? `
                        <div class="timer-btn-row">
                            <button class="btn btn-sm" id="btn-timer-sub">- 2s</button>
                            <button class="btn btn-sm" id="btn-timer-add">+ 2s</button>
                            <button class="btn btn-primary" id="btn-run-bath">DØB FILMSTRIMLERNE</button>
                        </div>
                    ` : '<span class="developed-status-badge">✓ STRIMLERNE ER FREMKALDT OG SKYLLET</span>'}
                </div>
            </div>

            <!-- FASE 2: DE FREMKALDT NEGATIVER -->
            <div class="film-strips-viewer ${state.stripsDeveloped ? 'visible' : 'hidden-stage'}">
                <div class="viewer-header">
                    <h4>🎞️ DE FREMKALDT 16MM FILMSTRIMLER</h4>
                    <p>Læs beskrivelserne højt for Modstandsholdet, så de kan koble dem til deres logbog:</p>
                </div>

                <div class="strips-grid">
                    ${mission.darkroom.strips.map(s => `
                        <div class="strip-item-card">
                            <div class="strip-header">
                                <span class="strip-tag">${s.label}</span>
                                <span class="sprocket-holes">▪ ▪ ▪ ▪ ▪</span>
                            </div>
                            <p class="strip-visual-desc">"${s.visual}"</p>
                        </div>
                    `).join('')}
                </div>

                <p class="room-shout">📢 Fortæl Modstand hvad du ser på strimlerne, så de kan fastlægge klipningsrækkefølgen!</p>
            </div>

            <!-- FASE 3: KLIPNING & PROJEKTION -->
            <div class="projector-mount-box ${state.stripsDeveloped ? 'visible' : 'hidden-stage'}">
                <div class="projector-header">
                    <span>16MM FREMVISER (SIEMENS 2000):</span>
                </div>

                ${!state.filmProjected ? `
                    <div class="projector-slot-display">
                        <p class="projector-prompt">Afventer at Modstandsholdet godkender montagen på klippebordet...</p>
                        <button id="btn-start-projector" class="btn btn-primary btn-large">TÆND PROJEKTORLAMPEN 📽️</button>
                    </div>
                ` : renderEpilogueScreen()}
            </div>
        </div>
    `;
}

// ==================== HOLD MODSTAND: KLIPPEBORDET ====================
function renderResistanceEditingTable(mission, state) {
    const isOrderCorrect = state.cutOrder.length === 4 && 
        state.cutOrder.every((id, idx) => id === mission.correctFilmOrder[idx]);

    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>✂️ KLIPPEBORDET & MODSTANDSBEVÆGELSENS LOGBOG</h3>
                <p>1. Oplys Skolen om den præcise fremkaldertid ud fra Agfa-manualen.<br>
                   2. Hør hvad Skolen ser på de 4 filmstrimler, og saml dem i den historiske rækkefølge.</p>
            </div>

            <!-- FASE 1: KEMISKE VÆRDIER -->
            <div class="hydraulics-calc-box">
                <span class="calc-box-title">📖 AGFA LABORATORIE-FORSKRIFT:</span>
                <p class="chem-instruction-text">${mission.chemicalInstructions}</p>
                <p class="room-shout">📢 Fortæl Skolen at fremkaldertiden skal være præcis <strong>12 sekunder</strong>!</p>
            </div>

            <!-- FASE 2: HISTORISK LOGBOG & KLIPPE-MONTAGE -->
            <div class="editing-console-wrapper">
                <div class="logbook-timeline">
                    <h4>📅 MODSTANDENS HISTORISKE TIDSREVUE:</h4>
                    <div class="log-entries-list">
                        ${mission.logbook.map(entry => `
                            <div class="log-entry-item">
                                <span class="entry-stage">${entry.stage}</span>
                                <strong class="entry-title">${entry.title}</strong>
                                <small class="entry-desc">${entry.desc}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Klippebordets monteringsrække -->
                <div class="splicing-bench">
                    <h4>MONTAGE AF DOKUMENTARFILMEN:</h4>
                    <p class="splice-hint">Klik på filmstrimlerne i den kronologiske rækkefølge ud fra logbogen:</p>

                    <div class="splicing-buttons-grid">
                        ${mission.darkroom.strips.map(s => {
                            const chosenIndex = state.cutOrder.indexOf(s.id);
                            const isChosen = chosenIndex !== -1;
                            return `
                                <button class="btn btn-splice ${isChosen ? 'spliced' : ''}" data-strip-id="${s.id}">
                                    <strong>${s.label}</strong>${isChosen ? `<span class="splice-tag">Del ${chosenIndex + 1}</span>` : '<small>+ Klip ind</small>'}
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <div class="splicing-action-bar">
                        <button id="btn-reset-splicing" class="btn btn-sm btn-muted" ${state.cutOrder.length === 0 ? 'disabled' : ''}>Nulstil klip</button>
                        <button id="btn-lock-splicing" class="btn btn-primary" ${state.cutOrder.length === 4 ? '' : 'disabled'}>
                            GODKEND HISTORISK MONTAGE
                        </button>
                    </div>
                </div>
            </div>

            ${state.filmProjected ? renderEpilogueScreen() : ''}
        </div>
    `;
}

// ==================== EPILOG-VISNING NÅR FILMEN STARTER ====================
function renderEpilogueScreen() {
    return `
        <div class="epilogue-theatre-card fade-in">
            <div class="film-flicker-header">
                <span class="projector-indicator">● 16MM FREMVISER KØRER: »FLÆSKESTEGEN« (1944-1945)</span>
            </div>
            
            <div class="epilogue-body">
                <h3>DEN JYSKE IDRÆTSSKOLES MODSTANDSFOLK</h3>
                <p>Optagelserne ruller over lærredet i mørket: De hemmelige elever på Jomsborg, sprængstofferne under Ross' seng, håndboldkursets våbeninstruktion og ambulancen med den illegale radiosender.</p>
                
                <div class="hero-roster">
                    <div class="hero-card">
                        <strong>Svend Aage Thomsen</strong>
                        <small>Forstanderen der risikerede hele skolen for at beskytte det danske politi og modstandskampen.</small>
                    </div>
                    <div class="hero-card">
                        <strong>Thormod Petersen</strong>
                        <small>Eleven der holdt gemmestederne hemmelige og bevarede historien for eftertiden.</small>
                    </div>
                    <div class="hero-card">
                        <strong>Willy Eisfeldt</strong>
                        <small>Overbetjenten der ledede den underjordiske politigruppe fra Jomsborgs kældre.</small>
                    </div>
                    <div class="hero-card">
                        <strong>Holger Dencker</strong>
                        <small>Kompagnichefen og sabotøren der sikrede byens forsyninger og våbendepoter.</small>
                    </div>
                </div>

                <div class="final-words">
                    <em>»De risikerede alt bag en facade af gymnastik, håndbold og højskoleliv. Friheden blev vundet i fællesskab.«</em>
                </div>
            </div>
        </div>
    `;
}

// ==================== INTERAKTIONS-LOGIK ====================
function setupSchoolDarkroomInteractions(container, mission, state, onComplete) {
    const saveAndRefresh = () => {
        localStorage.setItem('vih_m6_state', JSON.stringify(state));
        initMission6(container, { team: 'Skole' }, mission, onComplete);
    };

    // Timer knapper
    const addBtn = container.querySelector('#btn-timer-add');
    const subBtn = container.querySelector('#btn-timer-sub');
    const runBtn = container.querySelector('#btn-run-bath');

    if (addBtn && subBtn) {
        addBtn.addEventListener('click', () => {
            state.bathTimer += 2;
            saveAndRefresh();
        });
        subBtn.addEventListener('click', () => {
            if (state.bathTimer >= 2) state.bathTimer -= 2;
            saveAndRefresh();
        });
    }

    if (runBtn) {
        runBtn.addEventListener('click', () => {
            if (state.bathTimer === mission.darkroom.requiredBathSeconds) {
                state.stripsDeveloped = true;
                saveAndRefresh();
            } else {
                alert("Emulsionen tager skade! Tjek badetiden med Modstandsholdets Agfa-instruktion (skal være 12 sekunder).");
            }
        });
    }

    // Tænd projektor
    const startProjBtn = container.querySelector('#btn-start-projector');
    if (startProjBtn) {
        startProjBtn.addEventListener('click', () => {
            state.filmProjected = true;
            saveAndRefresh();
            onComplete();
        });
    }

    if (state.filmProjected) {
        onComplete();
    }
}

function setupResistanceEditingInteractions(container, mission, state, onComplete) {
    const saveAndRefresh = () => {
        localStorage.setItem('vih_m6_state', JSON.stringify(state));
        initMission6(container, { team: 'Modstand' }, mission, onComplete);
    };

    // Klippebord knapper
    container.querySelectorAll('.btn-splice').forEach(btn => {
        btn.addEventListener('click', () => {
            const stripId = btn.getAttribute('data-strip-id');
            if (!state.cutOrder.includes(stripId) && state.cutOrder.length < 4) {
                state.cutOrder.push(stripId);
                saveAndRefresh();
            }
        });
    });

    const resetBtn = container.querySelector('#btn-reset-splicing');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state.cutOrder = [];
            saveAndRefresh();
        });
    }

    const lockBtn = container.querySelector('#btn-lock-splicing');
    if (lockBtn) {
        lockBtn.addEventListener('click', () => {
            const isOrderCorrect = state.cutOrder.length === 4 && 
                state.cutOrder.every((id, idx) => id === mission.correctFilmOrder[idx]);

            if (isOrderCorrect) {
                state.filmProjected = true;
                saveAndRefresh();
                onComplete();
            } else {
                alert("Filmens scener springer i tid! Sammenhold Skolens billedbeskrivelser med aktionerne i logbogen (Efterår 1944 -> April 1945 -> Ross' seng -> Ambulancen).");
                state.cutOrder = [];
                saveAndRefresh();
            }
        });
    }

    if (state.filmProjected) {
        onComplete();
    }
}