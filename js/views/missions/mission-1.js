// js/views/missions/mission-1.js

export function initMission1(container, char, missionData, onComplete) {
    let state = JSON.parse(localStorage.getItem('vih_m1_puzzle_state') || JSON.stringify({
        allocations: { jensen: null, moller: null, friis: null },
        safeUnlocked: false,
        registryStamped: false
    }));

    container.innerHTML = `
        <div class="briefing-box">
            <h2>${missionData.title}</h2>
            <p class="mission-period">${missionData.period}</p>
            <p>${missionData.desc}</p>
        </div>
        <div class="asymmetric-playfield">
            ${char.team === 'Skole' ? renderSchoolBlueprint(missionData, state) : renderResistancePuzzle(missionData, state)}
        </div>
    `;

    if (char.team === 'Skole') {
        setupSchoolBlueprintInteractions(container, missionData, state, onComplete);
    } else {
        setupResistanceInteractions(container, missionData, state, onComplete);
    }
}

// ==================== HOLD SKOLE: STRUKTURERET PLANTEGNING ====================
function renderSchoolBlueprint(mission, state) {
    const isPuzzleCorrect = checkAllocation(mission.correctAllocation, state.allocations);
    
    // KUN efternavn – ingen afslørende hints!
    const allOfficers = [
        { id: 'jensen', name: 'Jensen' },
        { id: 'moller', name: 'Møller' },
        { id: 'friis', name: 'Friis' }
    ];

    const unassignedOfficers = allOfficers.filter(o => !state.allocations[o.id]);
    const floor1Rooms = mission.rooms.filter(r => r.floor.includes('1. sal'));
    const groundRooms = mission.rooms.filter(r => r.floor.includes('Stueetage'));

    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>🏢 JOMSBORG: PLANTEGNING & ELEVPROTOKOL</h3>
                <p>Modstandsholdet har de hemmelige efterretninger. Træk eller klik en betjent fra forhallen ind i det rette værelse.</p>
            </div>

            <!-- Workbench med fast to-kolonne højde -->
            <div class="blueprint-workbench">
                
                <!-- VENSTRE KOLONNE: FORHALLEN (Matcher højden) -->
                <aside class="staging-sidebar">
                    <div class="staging-header">
                        <span class="staging-title">🏛️ FORHALLEN</span>
                        <small class="staging-sub">Ventende betjente</small>
                    </div>
                    
                    <div class="tokens-tray vertical" id="officer-tray">
                        ${unassignedOfficers.length === 0 ? '<div class="empty-tray-box">✓ Alle er på værelserne</div>' : ''}
                        ${unassignedOfficers.map(o => `
                            <div class="officer-token-vertical" draggable="true" data-officer-id="${o.id}">
                                <div class="token-avatar-circle">👤</div>
                                <span class="token-surname">${o.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </aside>

                <!-- HØJRE KOLONNE: 2x2 PLANTEGNING -->
                <section class="blueprint-main">
                    
                    <!-- 1. SAL -->
                    <div class="blueprint-floor">
                        <div class="blueprint-floor-label">
                            <span class="floor-name">1. SAL</span>
                            <span class="floor-condition">⚠️ Adgang kun via stejl trappe</span>
                        </div>
                        <div class="blueprint-grid-row">
                            ${floor1Rooms.map(r => renderRoomDropZone(r, state, allOfficers)).join('')}
                        </div>
                    </div>

                    <!-- STUEPLAN -->
                    <div class="blueprint-floor">
                        <div class="blueprint-floor-label">
                            <span class="floor-name">STUEPLAN</span>
                            <span class="floor-condition">♿ Ingen trapper (Direkte adgang)</span>
                        </div>
                        <div class="blueprint-grid-row">
                            ${groundRooms.map(r => renderRoomDropZone(r, state, allOfficers)).join('')}
                        </div>
                    </div>

                </section>
            </div>

            <!-- RESULTAT-BOKS / VANDMÆRKE -->
            <div id="school-resolution-box" class="resolution-box ${isPuzzleCorrect ? 'unlocked' : 'locked'}">
                ${isPuzzleCorrect ? `
                    <div class="clue-content fade-in">
                        <h4>🔍 KORREKT FORDELING! VANDMÆRKE AFSLØRET:</h4>
                        <p>Betjentene er i sikkerhed for Gestapo. I bunden af protokollen toner skriften frem:</p>
                        <div class="secret-box">
                            "Koden til Eisfeldts pengeskab er summen af værelserne: 
                            <strong>${state.allocations.jensen} + ${state.allocations.moller} + ${state.allocations.friis} = ${mission.safeCombination}</strong>"
                        </div>
                        <p class="room-shout">📢 Råb talkoden <strong>${mission.safeCombination}</strong> til Modstandsholdet!</p>

                        <div class="final-stamp-auth">
                            <label>Indtast godkendelsesordet fra Modstandens pengeskab for at forsegle:</label>
                            <div class="stamp-input-group">
                                <input type="text" id="final-word-input" placeholder="Kodeord..." ${state.registryStamped ? 'disabled' : ''}>
                                <button id="btn-stamp-registry" class="btn btn-primary" ${state.registryStamped ? 'disabled' : ''}>STEMPEL PROTOKOL</button>
                            </div>
                        </div>
                    </div>
                ` : `
                    <p class="puzzle-hint">⚠️ Placer alle 3 betjente korrekt ifølge efterretningerne for at afsløre koden til Modstandens pengeskab.</p>
                `}
            </div>

            ${state.registryStamped ? `
                <div class="approved-banner fade-in">
                    ✓ ELEVPROTOKOLLEN ER FORSEGLET MED STEMPLET: <strong>${mission.finalSecretWord}</strong>
                </div>
            ` : ''}
        </div>
    `;
}

function renderRoomDropZone(room, state, allOfficers) {
    const occupantId = Object.keys(state.allocations).find(k => state.allocations[k] === room.id);
    const occupant = occupantId ? allOfficers.find(o => o.id === occupantId) : null;

    return `
        <div class="room-blueprint-card dropzone ${occupant ? 'occupied' : 'empty'}" data-room-id="${room.id}">
            <div class="room-top-bar">
                <div class="room-header-text">
                    <div class="room-badge">VÆRELSE ${room.id}</div>
                    <div class="room-view-tag">${room.view}</div>
                </div>
                
                <!-- Rundt ikon i øverste højre hjørne -->
                <div class="room-slot-corner">
                    ${occupant ? `
                        <div class="officer-badge-corner slotted" data-officer-id="${occupant.id}" title="Klik for at fjerne ${occupant.name}">
                            <div class="badge-circle">👤</div>
                            <span class="badge-name">${occupant.name}</span>
                        </div>
                    ` : `
                        <div class="empty-corner-slot" title="Træk eller klik betjent herhen">
                            <span class="slot-plus">+</span>
                        </div>
                    `}
                </div>
            </div>
            
            <p class="room-desc">${room.desc}</p>
        </div>
    `;
}

// ==================== HOLD MODSTAND ====================
function renderResistancePuzzle(mission, state) {
    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>🗂️ POLITIETS EFTERRETNINGSMAPPER // FORTROLIGT</h3>
                <p>Læs betjentenes trusselsvurderinger og krav grundigt op for Skolen, så de kan placere mændene i de sikre værelser.</p>
            </div>

            <div class="dossiers-list">
                ${mission.officers.map(officer => `
                    <div class="officer-dossier-card">
                        <div class="officer-header">
                            <span class="officer-alias">${officer.alias}</span>
                            <span class="threat-tag">${officer.threat}</span>
                        </div>
                        <p class="officer-intel">${officer.intel}</p>
                    </div>
                `).join('')}
            </div>

            <div class="safe-container">
                <div class="safe-header">
                    <h4>🔒 OVERBETJENT EISFELDTS FELT-PENGESKAB</h4>
                    <p>Skolen afslører den 3-cifrede talkode, så snart de har placeret alle 3 mænd korrekt.</p>
                </div>
                
                ${!state.safeUnlocked ? `
                    <div class="safe-keypad">
                        <input type="text" id="safe-code-input" maxlength="3" placeholder="000" class="safe-input">
                        <button id="btn-open-safe" class="btn btn-primary">LÅS OP</button>
                    </div>
                ` : `
                    <div class="safe-opened-box fade-in">
                        <div class="stamp-reveal">
                            <span class="stamp-title">HEMMELIGT MODSTANDS-STEMPEL FUNDET:</span>
                            <div class="big-stamp">${mission.finalSecretWord}</div>
                        </div>
                        <p class="room-shout">📢 Råb kodeordet <strong>${mission.finalSecretWord}</strong> over til Skolen, så de kan forsegle protokollen!</p>
                    </div>
                `}
            </div>
        </div>
    `;
}

// ==================== LOGIK OG INTERAKTION ====================
function checkAllocation(correct, current) {
    return current.friis === correct.friis &&
           current.jensen === correct.jensen &&
           current.moller === correct.moller;
}

function setupSchoolBlueprintInteractions(container, mission, state, onComplete) {
    let selectedOfficerId = null;

    const saveAndRefresh = () => {
        localStorage.setItem('vih_m1_puzzle_state', JSON.stringify(state));
        initMission1(container, { team: 'Skole' }, mission, onComplete);
    };

    // Drag-and-drop & klik på brikker i forhallen
    container.querySelectorAll('.officer-token-vertical').forEach(token => {
        token.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', token.getAttribute('data-officer-id'));
            token.classList.add('dragging');
        });

        token.addEventListener('dragend', () => {
            token.classList.remove('dragging');
        });

        token.addEventListener('click', (e) => {
            e.stopPropagation();
            const officerId = token.getAttribute('data-officer-id');
            container.querySelectorAll('.officer-token-vertical').forEach(t => t.classList.remove('selected-token'));
            selectedOfficerId = officerId;
            token.classList.add('selected-token');
        });
    });

    // Dropzoner (Værelserne)
    container.querySelectorAll('.dropzone').forEach(dropzone => {
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
            const officerId = e.dataTransfer.getData('text/plain');
            const targetRoomId = dropzone.getAttribute('data-room-id');

            if (officerId && targetRoomId) {
                assignOfficerToRoom(officerId, targetRoomId);
            }
        });

        dropzone.addEventListener('click', () => {
            if (selectedOfficerId) {
                const targetRoomId = dropzone.getAttribute('data-room-id');
                assignOfficerToRoom(selectedOfficerId, targetRoomId);
                selectedOfficerId = null;
            }
        });
    });

    // Klik på placeret betjent i værelsets hjørne for at fjerne vedkommende
    container.querySelectorAll('.officer-badge-corner.slotted').forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            const officerId = badge.getAttribute('data-officer-id');
            state.allocations[officerId] = null;
            saveAndRefresh();
        });
    });

    function assignOfficerToRoom(officerId, roomId) {
        Object.keys(state.allocations).forEach(k => {
            if (state.allocations[k] === roomId) state.allocations[k] = null;
        });
        state.allocations[officerId] = roomId;
        saveAndRefresh();
    }

    const stampBtn = container.querySelector('#btn-stamp-registry');
    if (stampBtn) {
        stampBtn.addEventListener('click', () => {
            const input = container.querySelector('#final-word-input');
            if (input.value.trim().toUpperCase() === mission.finalSecretWord) {
                state.registryStamped = true;
                localStorage.setItem('vih_m1_puzzle_state', JSON.stringify(state));
                initMission1(container, { team: 'Skole' }, mission, onComplete);
                onComplete();
            } else {
                alert("Forkert godkendelsesord! Få Modstandsholdet til at kigge i pengeskabet.");
                input.value = '';
            }
        });
    }

    if (state.registryStamped) {
        onComplete();
    }
}

function setupResistanceInteractions(container, mission, state, onComplete) {
    const openSafeBtn = container.querySelector('#btn-open-safe');
    if (openSafeBtn) {
        openSafeBtn.addEventListener('click', () => {
            const input = container.querySelector('#safe-code-input');
            if (input.value.trim() === mission.safeCombination) {
                state.safeUnlocked = true;
                localStorage.setItem('vih_m1_puzzle_state', JSON.stringify(state));
                initMission1(container, { team: 'Modstand' }, mission, onComplete);
            } else {
                alert("Forkert kode til pengeskabet! Få Skolen til at tjekke værelsessummen igen.");
                input.value = '';
            }
        });
    }

    if (state.safeUnlocked) {
        onComplete();
    }
}