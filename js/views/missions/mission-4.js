// js/views/missions/mission-4.js

export function initMission4(container, char, missionData, onComplete) {
    let state = JSON.parse(localStorage.getItem('vih_m4_state') || JSON.stringify({
        selectedRoutes: { 1: null, 2: null, 3: null },
        routeCleared: false,
        activeRadioChannel: null,
        activeFuses: [],
        gateUnlocked: false
    }));

    container.innerHTML = `
        <div class="briefing-box">
            <h2>${missionData.title}</h2>
            <p class="mission-period">${missionData.period}</p>
            <p>${missionData.desc}</p>
        </div>
        <div class="asymmetric-playfield">
            ${char.team === 'Modstand' ? renderAmbulanceDashboard(missionData, state) : renderTowerObservation(missionData, state)}
        </div>
    `;

    if (char.team === 'Modstand') {
        setupAmbulanceInteractions(container, missionData, state, onComplete);
    } else {
        setupTowerInteractions(container, missionData, state, onComplete);
    }
}

// ==================== HOLD MODSTAND: AMBULANCENS INSTRUMENTBRÆT ====================
function renderAmbulanceDashboard(mission, state) {
    const isRouteOk = state.selectedRoutes[1] === 'A' && state.selectedRoutes[2] === 'C' && state.selectedRoutes[3] === 'B';
    const activeFreq = mission.radioFrequencies.find(f => f.channel === state.activeRadioChannel);

    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>🚑 FORD V8 AMBULANCE // BAG RATTET</h3>
                <p>Beskriv vejforholdene for Skolen. Hør hvor patruljerne er, og vælg de 3 sikre rute-etaper for at nå frem til Jomsborg.</p>
            </div>

            <!-- FASE 1: Rutevælger i ambulancen -->
            <div class="route-navigator-box">
                <span class="box-section-title">🗺️ RUTENAVIGATION GENNEM VEJLE:</span>
                <div class="stages-grid">
                    ${mission.routes.map(r => `
                        <div class="stage-card">
                            <span class="stage-tag">${r.title}</span>
                            <div class="stage-options">
                                ${r.resistanceChoices.map(c => `
                                    <button class="route-btn ${state.selectedRoutes[r.stage] === c.id ? 'active' : ''}" 
                                            data-stage="${r.stage}" data-choice="${c.id}" ${state.routeCleared ? 'disabled' : ''}>
                                        <strong>${c.name}</strong>
                                        <small>${c.note}</small>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="stage-action-bar">
                    <button id="btn-confirm-route" class="btn btn-primary" ${state.routeCleared ? 'disabled' : ''}>
                        ${state.routeCleared ? '✓ ANKOMMET TIL JOMSBORG' : 'KØR DEN VALGTE RUTE'}
                    </button>
                </div>
            </div>

            <!-- FASE 2: Nødradioen i ambulancen -->
            <div class="radio-receiver-console ${state.routeCleared ? 'active-phase' : 'locked-phase'}">
                <div class="console-header">
                    <h4>📻 DEN ENGELSKE NØDRADIO I AMBULANCEN</h4>
                    <p>Skolen melder hvilken frekvens (i kHz) nødkanalen sender på. Indstil kanalen for at opsnappe de første 2 cifre af portkoden.</p>
                </div>

                ${state.routeCleared ? `
                    <div class="radio-tuning-panel">
                        <div class="channel-buttons">
                            ${mission.radioFrequencies.map(f => `
                                <button class="btn btn-channel ${state.activeRadioChannel === f.channel ? 'active' : ''}" data-channel="${f.channel}">
                                    ${f.channel} (${f.freq})
                                </button>
                            `).join('')}
                        </div>

                        <div class="radio-screen">
                            <span class="screen-label">OPSNAPPET SIGNAL:</span>
                            <div class="screen-digits">${activeFreq ? activeFreq.digits : '--'}</div>
                            <small class="screen-hint">${activeFreq ? '✓ Første halvdel af portkoden' : 'Vælg kanal ud fra Skolens pejling'}</small>
                        </div>
                    </div>
                    
                    <p class="room-shout">📢 Fortæl Skolen cifrene <strong>${activeFreq ? activeFreq.digits : '??'}</strong>. Få deres 2 cifre for at samle den fulde 4-cifrede portkode!</p>

                    <!-- Portlås felt -->
                    <div class="gate-lock-input-group">
                        <input type="text" id="final-gate-input" maxlength="4" placeholder="4 cifre" class="safe-input" style="width: 160px;">
                        <button id="btn-unlock-gate" class="btn btn-primary">LÅS PORTEN OP</button>
                    </div>
                ` : `
                    <div class="locked-phase-msg">🔒 Vælg den sikre rute først for at nå frem til Jomsborg.</div>
                `}
            </div>

            ${state.gateUnlocked ? `
                <div class="approved-banner fade-in">
                    ✓ BOMMEN FLYVER OP! AMBULANCEN ER INDE I SIKKERHED 5 MINUTTER FØR GESTAPO.
                </div>
            ` : ''}
        </div>
    `;
}

// ==================== HOLD SKOLE: TÅRNET PÅ JOMSBORG ====================
function renderTowerObservation(mission, state) {
    const isRouteOk = state.selectedRoutes[1] === 'A' && state.selectedRoutes[2] === 'C' && state.selectedRoutes[3] === 'B';
    const totalVolts = state.activeFuses.reduce((sum, id) => {
        const f = mission.fuses.find(x => x.id === id);
        return sum + (f ? f.volts : 0);
    }, 0);
    const isRelayCorrect = totalVolts === 45;

    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>🔭 TÅRNET PÅ JOMSBORG // KIKKERT-UDKIGSPOST</h3>
                <p>Hør hvilke veje ambulancen kan vælge. Kig i kikkerten efter Gestapo-patruljer, og vælg de 3 sikre etaper sammen med ambulancen.</p>
            </div>

            <!-- FASE 1: Observation af Gestapo -->
            <div class="route-navigator-box">
                <span class="box-section-title">👁️ KIKKERT-OBSERVATION AF TYSKE PATRULJER:</span>
                <div class="stages-grid">
                    ${mission.routes.map(r => `
                        <div class="stage-card">
                            <span class="stage-tag">${r.title}</span>
                            <div class="stage-options">
                                ${r.schoolIntel.map(c => `
                                    <button class="route-btn ${state.selectedRoutes[r.stage] === c.id ? 'active' : ''}" 
                                            data-stage="${r.stage}" data-choice="${c.id}" ${state.routeCleared ? 'disabled' : ''}>
                                        <strong>${c.name}</strong>
                                        <small class="${c.status.includes('FRI') ? 'status-free' : 'status-danger'}">${c.status}</small>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="stage-action-bar">
                    <button id="btn-confirm-route" class="btn btn-primary" ${state.routeCleared ? 'disabled' : ''}>
                        ${state.routeCleared ? '✓ AMBULANCEN SES VED LÅGEN' : 'BEKRÆFT SIKKER KØRERUTE'}
                    </button>
                </div>
            </div>

            <!-- FASE 2: Portens Relæ-tavle i tårnet -->
            <div class="radio-receiver-console ${state.routeCleared ? 'active-phase' : 'locked-phase'}">
                <div class="console-header">
                    <h4>⚡ PORT-RELÆETS KONTROLTAVLE</h4>
                    <p>1. Fortæl Modstand at nødradioens pejlefrekvens er <strong>120 kHz</strong>.<br>
                       2. Kobl relæ-sikringerne så voltmeteret rammer præcis <strong>45 Volt</strong> for at få dine 2 cifre.</p>
                </div>

                ${state.routeCleared ? `
                    <div class="relay-panel">
                        <div class="fuses-selector">
                            ${mission.fuses.map(fuse => {
                                const isActive = state.activeFuses.includes(fuse.id);
                                return `
                                    <button class="fuse-toggle-btn ${isActive ? 'active' : ''}" data-fuse-id="${fuse.id}">
                                        <span class="fuse-icon">🔌</span>
                                        <span class="fuse-label">${fuse.label}</span>
                                    </button>
                                `;
                            }).join('')}
                        </div>

                        <div class="voltmeter-display">
                            <span class="meter-label">AKTUEL SPÆNDING:</span>
                            <div class="meter-number ${isRelayCorrect ? 'correct' : ''}">${totalVolts} V</div>
                            <small class="meter-hint">${isRelayCorrect ? '✓ MÅL RAMT (45V)!' : 'Kobl sikringer til 45V'}</small>
                        </div>
                    </div>

                    ${isRelayCorrect ? `
                        <div class="relay-unlocked-reveal fade-in">
                            <span>RELÆET SLÅR TIL! DINE TO CIFRE ER:</span>
                            <strong class="relay-digits">45</strong>
                        </div>
                    ` : ''}

                    <p class="room-shout">📢 Fortæl Modstand dine cifre <strong>${isRelayCorrect ? '45' : '??'}</strong>. Få deres 2 cifre og åbn porten!</p>

                    <!-- Portlås felt -->
                    <div class="gate-lock-input-group">
                        <input type="text" id="final-gate-input" maxlength="4" placeholder="4 cifre" class="safe-input" style="width: 160px;">
                        <button id="btn-unlock-gate" class="btn btn-primary">LÅS PORTEN OP</button>
                    </div>
                ` : `
                    <div class="locked-phase-msg">🔒 Led ambulancen sikkert frem til skolen først.</div>
                `}
            </div>

            ${state.gateUnlocked ? `
                <div class="approved-banner fade-in">
                    ✓ BOMMEN FLYVER OP! AMBULANCEN ER INDE I SIKKERHED 5 MINUTTER FØR GESTAPO.
                </div>
            ` : ''}
        </div>
    `;
}

// ==================== INTERAKTIONS-LOGIK ====================
function setupAmbulanceInteractions(container, mission, state, onComplete) {
    const saveAndRefresh = () => {
        localStorage.setItem('vih_m4_state', JSON.stringify(state));
        initMission4(container, { team: 'Modstand' }, mission, onComplete);
    };

    // Vælg rute-knapper
    container.querySelectorAll('.route-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const stage = btn.getAttribute('data-stage');
            const choice = btn.getAttribute('data-choice');
            state.selectedRoutes[stage] = choice;
            saveAndRefresh();
        });
    });

    // Bekræft rute
    const confirmRouteBtn = container.querySelector('#btn-confirm-route');
    if (confirmRouteBtn) {
        confirmRouteBtn.addEventListener('click', () => {
            if (state.selectedRoutes[1] === 'A' && state.selectedRoutes[2] === 'C' && state.selectedRoutes[3] === 'B') {
                state.routeCleared = true;
                saveAndRefresh();
            } else {
                alert("BLOKADE! Tyske patruljer spærrer vejen. Sammenhold observationerne fra tårnet med vejvalgene.");
            }
        });
    }

    // Radio-frekvens knapper
    container.querySelectorAll('.btn-channel').forEach(btn => {
        btn.addEventListener('click', () => {
            state.activeRadioChannel = btn.getAttribute('data-channel');
            saveAndRefresh();
        });
    });

    // Port-oplåsning
    const unlockBtn = container.querySelector('#btn-unlock-gate');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            const val = container.querySelector('#final-gate-input').value.trim();
            if (val === mission.finalGateCode) {
                state.gateUnlocked = true;
                saveAndRefresh();
                onComplete();
            } else {
                alert("Forkert portkode! Kombinér ambulancens radiocifre (19) og tårnets relæcifre (45).");
            }
        });
    }

    if (state.gateUnlocked) {
        onComplete();
    }
}

function setupTowerInteractions(container, mission, state, onComplete) {
    const saveAndRefresh = () => {
        localStorage.setItem('vih_m4_state', JSON.stringify(state));
        initMission4(container, { team: 'Skole' }, mission, onComplete);
    };

    // Vælg rute-knapper
    container.querySelectorAll('.route-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const stage = btn.getAttribute('data-stage');
            const choice = btn.getAttribute('data-choice');
            state.selectedRoutes[stage] = choice;
            saveAndRefresh();
        });
    });

    // Bekræft rute
    const confirmRouteBtn = container.querySelector('#btn-confirm-route');
    if (confirmRouteBtn) {
        confirmRouteBtn.addEventListener('click', () => {
            if (state.selectedRoutes[1] === 'A' && state.selectedRoutes[2] === 'C' && state.selectedRoutes[3] === 'B') {
                state.routeCleared = true;
                saveAndRefresh();
            } else {
                alert("BLOKADE! Tyske patruljer spærrer vejen. Undgå Gestapos projektører og pejlevogne.");
            }
        });
    }

    // Sikrings-knapper
    container.querySelectorAll('.fuse-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const fuseId = btn.getAttribute('data-fuse-id');
            if (state.activeFuses.includes(fuseId)) {
                state.activeFuses = state.activeFuses.filter(id => id !== fuseId);
            } else {
                state.activeFuses.push(fuseId);
            }
            saveAndRefresh();
        });
    });

    // Port-oplåsning
    const unlockBtn = container.querySelector('#btn-unlock-gate');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            const val = container.querySelector('#final-gate-input').value.trim();
            if (val === mission.finalGateCode) {
                state.gateUnlocked = true;
                saveAndRefresh();
                onComplete();
            } else {
                alert("Forkert portkode! Kombinér ambulancens radiocifre (19) og tårnets relæcifre (45).");
            }
        });
    }

    if (state.gateUnlocked) {
        onComplete();
    }
}