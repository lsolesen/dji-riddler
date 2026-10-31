// js/views/missions/mission-2.js

export function initMission2(container, char, missionData, onComplete) {
    let state = JSON.parse(localStorage.getItem('vih_m2_sabotage_state') || JSON.stringify({
        assemblyQueue: [], // Rækkefølgen af indsatte komponent-id'er
        radioUnlocked: false
    }));

    container.innerHTML = `
        <div class="briefing-box">
            <h2>${missionData.title}</h2>
            <p class="mission-period">${missionData.period}</p>
            <p>${missionData.desc}</p>
        </div>
        <div class="asymmetric-playfield">
            ${char.team === 'Skole' ? renderSchoolWorkbench(missionData, state) : renderResistanceManual(missionData, state)}
        </div>
    `;

    if (char.team === 'Skole') {
        setupSchoolWorkbenchInteractions(container, missionData, state, onComplete);
    } else {
        setupResistanceRadioInteractions(container, missionData, state, onComplete);
    }
}

// ==================== HOLD SKOLE: ARBEJDSBORDET ====================
function renderSchoolWorkbench(mission, state) {
    const isCorrect = checkAssembly(mission.bombAssembly.correctSteps, state.assemblyQueue);
    
    // Find tilgængelige komponenter i ammunitionskassen
    const availableComponents = mission.bombAssembly.components.filter(
        c => !state.assemblyQueue.includes(c.id)
    );

    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>💣 ARBEJDSBORDET: APTERING AF SABOTAGEBOMBE</h3>
                <p>Hør Modstandsholdets sikkerhedsforskrifter og togtider. Træk eller klik delene over på arbejdsbænken i den korrekte rækkefølge.</p>
            </div>

            <div class="workbench-layout">
                
                <!-- VENSTRE: AMMUNITIONSKASSEN -->
                <aside class="parts-crate-sidebar">
                    <div class="crate-header">
                        <span class="crate-title">📦 AMMUNITIONSKASSE</span>
                        <small class="crate-sub">Tilgængelige dele</small>
                    </div>

                    <div class="parts-tray" id="parts-tray">
                        ${availableComponents.length === 0 ? '<div class="empty-crate-msg">Kassen er tom – alle dele er i brug</div>' : ''}
                        ${availableComponents.map(c => `
                            <div class="part-token" draggable="true" data-part-id="${c.id}">
                                <div class="part-icon">${c.icon}</div>
                                <div class="part-info">
                                    <strong class="part-name">${c.name}</strong>
                                    <small class="part-desc">${c.desc}</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </aside>

                <!-- HØJRE: SELVE SAMLEBÆNKEN (4 PLADSER) -->
                <section class="assembly-table-area">
                    <div class="assembly-header-bar">
                        <span>LADNINGENS APTERINGS-RÆKKEFØLGE:</span>
                        <button id="btn-reset-assembly" class="btn btn-sm btn-muted" ${state.assemblyQueue.length === 0 ? 'disabled' : ''}>Tøm bænken</button>
                    </div>

                    <div class="assembly-slots-grid dropzone" id="assembly-dropzone">
                        ${[0, 1, 2, 3].map(slotIndex => {
                            const partId = state.assemblyQueue[slotIndex];
                            const part = partId ? mission.bombAssembly.components.find(c => c.id === partId) : null;
                            return `
                                <div class="assembly-slot ${part ? 'filled' : 'empty'}">
                                    <div class="slot-num">TRIN ${slotIndex + 1}</div>
                                    ${part ? `
                                        <div class="slotted-part fade-in">
                                            <div class="slotted-icon">${part.icon}</div>
                                            <div class="slotted-name">${part.name}</div>
                                        </div>
                                    ` : `
                                        <div class="slot-empty-prompt">+ Afventer næste del</div>
                                    `}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </section>
            </div>

            <!-- Resultatfelt / Afsløring af seriekoden på fænghætten -->
            <div class="resolution-box ${isCorrect ? 'unlocked' : 'locked'}">
                ${isCorrect ? `
                    <div class="clue-content fade-in">
                        <h4>✓ BOMBEN ER KORREKT APTERET OG SIKRET!</h4>
                        <p>Plastisk sprængstof og magneter slutter tæt om skinnen, og tidsblyanten er armeret. På fænghættens kobberkrave ses indgraveringen:</p>
                        
                        <div class="secret-box text-center">
                            FÆNGHÆTTENS SERIEKODE: <strong class="big-code">${mission.secretSerialCode}</strong>
                        </div>

                        <p class="room-shout">📢 Råb seriekoden <strong>${mission.secretSerialCode}</strong> til Modstandsholdet, så de kan godkende ladningen til nattens aktion!</p>
                    </div>
                ` : `
                    <p class="puzzle-hint">⚠️ Følg den britiske SOE-manual og den korrekte togtid nøje for at aptere ladningen uden fare for tidlig sprængning.</p>
                `}
            </div>
        </div>
    `;
}

// ==================== HOLD MODSTAND: SOE-MANUALEN & FELT-RADIOEN ====================
function renderResistanceManual(mission, state) {
    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>📖 BRITISK SOE-SABOTAGEMANUAL // VEJLE AFDELING</h3>
                <p>Læs de 4 sikkerhedstrin grundigt op for Skolen. Beregn forsinkelsestiden ud fra togtiden, så bomben samles fejlfrit.</p>
            </div>

            <div class="manual-rules-list">
                ${mission.manual.map(m => `
                    <div class="manual-rule-card">
                        <div class="rule-title">${m.title}</div>
                        <p class="rule-text">${m.text}</p>
                    </div>
                `).join('')}
            </div>

            <!-- Felt-radio til bekræftelse af sprængladningen -->
            <div class="safe-container">
                <div class="safe-header">
                    <h4>📻 GODKENDELSE AF LADNING TIL TIRSBÆK-AKTIONEN</h4>
                    <p>Skolen afslører seriekoden på fænghætten, så snart ladningen er sikkert apteret.</p>
                </div>

                ${!state.radioUnlocked ? `
                    <div class="safe-keypad">
                        <input type="text" id="radio-code-input" placeholder="SERIEKODE" class="safe-input" style="width: 190px; text-transform: uppercase;">
                        <button id="btn-tune-radio" class="btn btn-primary">GODKEND LADNING</button>
                    </div>
                ` : `
                    <div class="safe-opened-box fade-in">
                        <div class="stamp-reveal">
                            <span class="stamp-title">LADNING GODKENDT AF KOMPAGNICHETEN:</span>
                            <div class="big-stamp" style="color: #4ade80; border-color: #4ade80;">KLAR TIL AKTION</div>
                        </div>
                        <p class="room-shout">✓ Bomben med 2 timers forsinkelse er klar til jernbanesabotagen. Våbenkurset er godkendt!</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// ==================== LOGIK OG INTERAKTION ====================
function checkAssembly(correctSteps, currentSteps) {
    if (currentSteps.length !== correctSteps.length) return false;
    return currentSteps.every((val, index) => val === correctSteps[index]);
}

function setupSchoolWorkbenchInteractions(container, mission, state, onComplete) {
    let selectedPartId = null;

    const saveAndRefresh = () => {
        localStorage.setItem('vih_m2_sabotage_state', JSON.stringify(state));
        initMission2(container, { team: 'Skole' }, mission, onComplete);
    };

    // Tøm bænken-knap
    const resetBtn = container.querySelector('#btn-reset-assembly');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state.assemblyQueue = [];
            saveAndRefresh();
        });
    }

    // Drag-and-drop & klik på dele i kassen
    container.querySelectorAll('.part-token').forEach(token => {
        token.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', token.getAttribute('data-part-id'));
            token.classList.add('dragging');
        });

        token.addEventListener('dragend', () => {
            token.classList.remove('dragging');
        });

        token.addEventListener('click', () => {
            const partId = token.getAttribute('data-part-id');
            container.querySelectorAll('.part-token').forEach(t => t.classList.remove('selected-token'));
            selectedPartId = partId;
            token.classList.add('selected-token');

            // Hurtig-tilføj ved klik hvis der er ledig plads
            if (state.assemblyQueue.length < 4) {
                state.assemblyQueue.push(partId);
                saveAndRefresh();
            }
        });
    });

    // Dropzone på samlebænken
    const dropzone = container.querySelector('#assembly-dropzone');
    if (dropzone) {
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('drag-over');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('drag-over');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('drag-over');
            const partId = e.dataTransfer.getData('text/plain');

            if (partId && state.assemblyQueue.length < 4 && !state.assemblyQueue.includes(partId)) {
                state.assemblyQueue.push(partId);
                saveAndRefresh();
            }
        });
    }

    if (checkAssembly(mission.bombAssembly.correctSteps, state.assemblyQueue)) {
        onComplete();
    }
}

function setupResistanceRadioInteractions(container, mission, state, onComplete) {
    const tuneBtn = container.querySelector('#btn-tune-radio');
    if (tuneBtn) {
        tuneBtn.addEventListener('click', () => {
            const input = container.querySelector('#radio-code-input');
            if (input.value.trim().toUpperCase() === mission.secretSerialCode) {
                state.radioUnlocked = true;
                localStorage.setItem('vih_m2_sabotage_state', JSON.stringify(state));
                initMission2(container, { team: 'Modstand' }, mission, onComplete);
                onComplete();
            } else {
                alert("Forkert seriekode! Få Skoleholdet til at tjekke samlingen og sprængblyanten igen.");
                input.value = '';
            }
        });
    }

    if (state.radioUnlocked) {
        onComplete();
    }
}