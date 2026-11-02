// js/views/missions/mission-5.js

export function initMission5(container, char, missionData, onComplete) {
    let state = JSON.parse(localStorage.getItem('vih_m5_state') || JSON.stringify({
        freq: 300,
        gain: 30,
        signalSynced: false,
        rotorValue: 0,
        selectedPostsOrder: [],
        liberationComplete: false
    }));

    container.innerHTML = `
        <div class="briefing-box">
            <h2>${missionData.title}</h2>
            <p class="mission-period">${missionData.period}</p>
            <p>${missionData.desc}</p>
        </div>
        <div class="asymmetric-playfield">
            ${char.team === 'Skole' ? renderSchoolOscilloscope(missionData, state) : renderResistanceJammer(missionData, state)}
        </div>
    `;

    if (char.team === 'Skole') {
        setupSchoolOscilloscopeInteractions(container, char, missionData, state, onComplete);
    } else {
        setupResistanceJammerInteractions(container, char, missionData, state, onComplete);
    }
}

// ==================== HOLD SKOLE: OSCILLOSKOP & BYKORT ====================
function renderSchoolOscilloscope(mission, state) {
    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>📻 JOMSBORG: OSCILLOSKOP & 16MM-ARKIVET</h3>
                <p>1. Lyt til Modstandsholdets pejlerdata og justér frekvens og styrke med skyderne.<br>
                   2. Når budskabet toner igennem, skal du vælge afvæbningsposterne i den rækkefølge, Modstand afkoder.</p>
            </div>

            <!-- FASE 1: LIVE OSCILLOSKOP -->
            <div class="oscilloscope-wrapper">
                <div class="oscilloscope-header">
                    <span>KATODERØRS-INDIKATOR // MODTAGER BØLGEFORM</span>
                    <span class="sync-status-badge ${state.signalSynced ? 'synced' : 'noise'}">
                        ${state.signalSynced ? '● SIGNAL LÅST (LONDON)' : '▲ STØJ & FORVRÆNGNING'}
                    </span>
                </div>

                <div class="oscilloscope-screen" id="scope-screen">
                    <svg class="wave-svg" viewBox="0 0 500 120" preserveAspectRatio="none">
                        <path id="scope-wave-path" d="" fill="none" stroke="#4ade80" stroke-width="3" />
                    </svg>
                    <div class="scope-grid-overlay"></div>
                </div>

                <div class="sliders-controls">
                    <div class="slider-group">
                        <label>Bærefrekvens: <strong id="freq-val">${state.freq}</strong> kHz</label>
                        <input type="range" id="freq-slider" min="200" max="600" step="10" value="${state.freq}" ${state.signalSynced ? 'disabled' : ''}>
                        <small>Mål: Modstand kender frekvensen</small>
                    </div>

                    <div class="slider-group">
                        <label>Forstærkning: <strong id="gain-val">${state.gain}</strong> dB</label>
                        <input type="range" id="gain-slider" min="10" max="100" step="5" value="${state.gain}" ${state.signalSynced ? 'disabled' : ''}>
                        <small>Mål: Gennembryd støjen</small>
                    </div>
                </div>

                <div class="scope-action-bar">
                    <button id="btn-lock-signal" class="btn btn-primary" ${state.signalSynced ? 'disabled' : ''}>
                        ${state.signalSynced ? '✓ FREKVENS LÅST' : 'LÅS FREKVENS PÅ LONDON'}
                    </button>
                </div>
            </div>

            <!-- FASE 2: AFVÆBNINGSPOSTERNE I VEJLE -->
            <div class="city-operations-box ${state.signalSynced ? 'active-phase' : 'locked-phase'}">
                <div class="box-header">
                    <h4>🗺️ AFVÆBNINGSPOSTER I VEJLE (5. MAJ 1945)</h4>
                    <p>Hør Modstandsholdets koderotations-rækkefølge. Klik på de 4 poster i den præcise rækkefølge for at udsende afvæbningsordren.</p>
                </div>

                ${state.signalSynced ? `
                    <div class="posts-selection-grid">
                        ${mission.posts.map(post => {
                            const selectedIndex = state.selectedPostsOrder.indexOf(post.id);
                            const isChosen = selectedIndex !== -1;
                            return `
                                <button class="post-target-card ${isChosen ? 'selected' : ''}" data-post-id="${post.id}">
                                    <div class="post-badge">${post.name}</div>
                                    <p class="post-task">${post.task}</p>
                                    ${isChosen ? `<span class="post-order-tag">Trin ${selectedIndex + 1}</span>` : '<span class="post-prompt">+ Vælg post</span>'}
                                </button>
                            `;
                        }).join('')}
                    </div>

                    <div class="posts-action-bar">
                        <button id="btn-reset-posts" class="btn btn-sm btn-muted" ${state.selectedPostsOrder.length === 0 ? 'disabled' : ''}>Nulstil valg</button>
                        <button id="btn-broadcast-order" class="btn btn-primary" ${state.selectedPostsOrder.length === 4 ? '' : 'disabled'}>
                            UDSEND AFVÆBNINGSORDRE
                        </button>
                    </div>
                ` : `
                    <div class="locked-phase-msg">🔒 Synkronisér radiobølgen ovenfor for at modtage ordren fra London.</div>
                `}
            </div>

            ${state.liberationComplete ? `
                <div class="approved-banner victory fade-in">
                    🎉 DANMARK ER FRIT! DE TYSKE VAGTER NEDLÆGGER VÅBNENE PÅ JOMSBORG OG I VEJLE.
                </div>
            ` : ''}
        </div>
    `;
}

// ==================== HOLD MODSTAND: PEJLER & KODEDREJEBÆNK ====================
function renderResistanceJammer(mission, state) {
    return `
        <div class="dossier-workstation">
            <div class="workstation-header">
                <h3>🧭 RADIOPEJLEREN & KODEDREJEBÆNKEN</h3>
                <p>1. Læs de hemmelige pejledata højt for Skolen, så de kan indstille oscilloskopet.<br>
                   2. Brug kodedrejebænken nedenfor til at beregne og oplæse den rette rækkefølge for afvæbningen i Vejle.</p>
            </div>

            <!-- FASE 1: PEJLEINFORMATION -->
            <div class="hydraulics-calc-box">
                <span class="calc-box-title">📡 PEJLEDATA FOR LONDON-FREKVENSEN:</span>
                <div class="rules-list-compact">
                    <div class="calc-row">
                        <strong>Kanal-frekvens:</strong> <span>${mission.jammerIntel.targetFreqHint}</span>
                    </div>
                    <div class="calc-row">
                        <strong>Tærskel-signal:</strong> <span>${mission.jammerIntel.targetGainHint}</span>
                    </div>
                </div>
            </div>

            <!-- FASE 2: KODEDREJEBÆNK TIL DE 4 POSTER (Altid tilgængelig for Modstand på egen skærm) -->
            <div class="city-operations-box active-phase">
                <div class="box-header">
                    <h4>⚙️ DECHIFRERING AF AFVÆBNINGS-RÆKKEFØLGEN</h4>
                    <p>Drejeskiven afkoder de allieredes prioritering. Læs den hemmelige rækkefølge op for Skolen:</p>
                </div>

                <div class="cipher-disc-console">
                    <div class="cipher-steps-display">
                        <div class="cipher-step-card">
                            <span class="step-num">1. PRIORITET</span>
                            <strong>Vejle Rådhus</strong>
                            <small>Kommandoens centrum</small>
                        </div>
                        <div class="cipher-step-arrow">➔</div>
                        <div class="cipher-step-card">
                            <span class="step-num">2. PRIORITET</span>
                            <strong>Banegården</strong>
                            <small>Skæring af troppetog</small>
                        </div>
                        <div class="cipher-step-arrow">➔</div>
                        <div class="cipher-step-card">
                            <span class="step-num">3. PRIORITET</span>
                            <strong>Vejle Havn</strong>
                            <small>Sikring af depoter</small>
                        </div>
                        <div class="cipher-step-arrow">➔</div>
                        <div class="cipher-step-card">
                            <span class="step-num">4. PRIORITET</span>
                            <strong>Gestapos Skjulested</strong>
                            <small>Redning af arkiverne</small>
                        </div>
                    </div>

                    <p class="room-shout">📢 Fortæl Skolen denne rækkefølge! Når de har sendt ordren, taster du befrielsesbudskabet herunder.</p>
                </div>

                <!-- Endelig bekræftelse -->
                <div class="safe-container">
                    <div class="safe-header">
                        <h4>🇩🇰 BEFRIELSESERKENDELSEN</h4>
                        <p>Tast det historiske råb for at afslutte modstandskampen:</p>
                    </div>
                    <div class="safe-keypad">
                        <input type="text" id="final-liberation-input" placeholder="KODEORD..." class="safe-input" style="width: 250px; text-transform: uppercase;">
                        <button id="btn-confirm-liberation" class="btn btn-primary">UDRÅB FRIHEDEN</button>
                    </div>
                </div>
            </div>

            ${state.liberationComplete ? `
                <div class="approved-banner victory fade-in">
                    🎉 DANMARK ER FRIT! VEJLE HYLDER MODSTANDSFOLKENE FRA DEN JYSKE IDRÆTSSKOLE.
                </div>
            ` : ''}
        </div>
    `;
}

// ==================== INTERAKTIONS-LOGIK ====================
function updateScopeWave(freq, gain, isSynced) {
    const path = document.getElementById('scope-wave-path');
    if (!path) return;

    let points = [];
    const width = 500;
    const height = 120;
    const midY = height / 2;

    const fFactor = (freq / 80);
    const amp = isSynced ? 40 : (gain / 100) * 45;

    for (let x = 0; x <= width; x += 5) {
        const noise = isSynced ? 0 : (Math.sin(x * 0.3) * 12 + Math.cos(x * 0.7) * 8);
        const y = midY + Math.sin(x * 0.05 * fFactor) * amp + noise;
        points.push(`${x},${y.toFixed(1)}`);
    }

    path.setAttribute('d', `M ${points.join(' L ')}`);
    path.setAttribute('stroke', isSynced ? '#4ade80' : '#fce18b');
}

function setupSchoolOscilloscopeInteractions(container, char, mission, state, onComplete) {
    const saveAndRefresh = () => {
        localStorage.setItem('vih_m5_state', JSON.stringify(state));
        initMission5(container, char, mission, onComplete);
    };

    const freqSlider = container.querySelector('#freq-slider');
    const gainSlider = container.querySelector('#gain-slider');
    const freqVal = container.querySelector('#freq-val');
    const gainVal = container.querySelector('#gain-val');

    const handleSliders = () => {
        state.freq = parseInt(freqSlider.value, 10);
        state.gain = parseInt(gainSlider.value, 10);
        freqVal.textContent = state.freq;
        gainVal.textContent = state.gain;

        const isSynced = state.freq === mission.targetFrequency && state.gain === mission.targetGain;
        updateScopeWave(state.freq, state.gain, isSynced);
    };

    if (freqSlider && gainSlider) {
        freqSlider.addEventListener('input', handleSliders);
        gainSlider.addEventListener('input', handleSliders);
        updateScopeWave(state.freq, state.gain, state.signalSynced);
    }

    const lockBtn = container.querySelector('#btn-lock-signal');
    if (lockBtn) {
        lockBtn.addEventListener('click', () => {
            if (state.freq === mission.targetFrequency && state.gain === mission.targetGain) {
                state.signalSynced = true;
                saveAndRefresh();
            } else {
                alert("Radioen skratter vildt! Frekvensen eller styrken rammer ikke præcis det, Modstand pejler (480 kHz / 65 dB).");
            }
        });
    }

    container.querySelectorAll('.post-target-card').forEach(card => {
        card.addEventListener('click', () => {
            const postId = card.getAttribute('data-post-id');
            if (!state.selectedPostsOrder.includes(postId) && state.selectedPostsOrder.length < 4) {
                state.selectedPostsOrder.push(postId);
                saveAndRefresh();
            }
        });
    });

    const resetPostsBtn = container.querySelector('#btn-reset-posts');
    if (resetPostsBtn) {
        resetPostsBtn.addEventListener('click', () => {
            state.selectedPostsOrder = [];
            saveAndRefresh();
        });
    }

    const broadcastBtn = container.querySelector('#btn-broadcast-order');
    if (broadcastBtn) {
        broadcastBtn.addEventListener('click', () => {
            const isOrderCorrect = state.selectedPostsOrder.every(
                (id, index) => id === mission.correctPostOrder[index]
            );

            if (isOrderCorrect) {
                state.liberationComplete = true;
                saveAndRefresh();
                onComplete();
            } else {
                alert("Post-rækkefølgen er usikker! Få Modstandsholdet til at aflæse prioriteterne på kodedrejebænken igen.");
                state.selectedPostsOrder = [];
                saveAndRefresh();
            }
        });
    }

    if (state.liberationComplete) {
        onComplete();
    }
}

function setupResistanceJammerInteractions(container, char, mission, state, onComplete) {
    const saveAndRefresh = () => {
        localStorage.setItem('vih_m5_state', JSON.stringify(state));
        initMission5(container, char, mission, onComplete);
    };

    const confirmBtn = container.querySelector('#btn-confirm-liberation');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const input = container.querySelector('#final-liberation-input').value.trim().toUpperCase();
            if (input === mission.finalPasscode || input === "DANMARK ER FRIT") {
                state.liberationComplete = true;
                saveAndRefresh();
                onComplete();
            } else {
                alert("Udråbet skal være det historiske budskab: DANMARK ER FRIT!");
            }
        });
    }

    if (state.liberationComplete) {
        onComplete();
    }
}