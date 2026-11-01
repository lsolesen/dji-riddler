// js/views/roles.js
import { updateState } from '../app.js';
import { characters } from '../data/characters.js';

export function showRoleChooser(container) {
    const html = `
        <div class="scene-container fade-in">
            <header class="vintage-header">
                <h2>VÆLG DIT PERSPEKTIV</h2>
                <p>Spillet spilles på to skærme i tæt samarbejde. Aftal hvem der tager hvem:</p>
            </header>

            <div class="visual-wrapper">
                <img src="./images/role-chooser.jpg" alt="Thormod Petersen og Willy Eisfeldt 1944" class="role-chooser-img">
            </div>

            <div class="tracks-selection-grid">
                <!-- Person 1: Thormod Petersen -->
                <div class="track-card skole-track" id="card-thormod">
                    <div class="track-header">
                        <span class="track-device-tag">SKÆRM 1 // VENSTRE</span>
                        <h3>${characters.thormod.name}</h3>
                        <small class="track-names">${characters.thormod.title}</small>
                    </div>
                    <p class="track-desc">
                        ${characters.thormod.description}
                    </p>
                    <div class="track-focus-box">
                        <strong>Historisk netværk:</strong> ${characters.thormod.network}.<br>
                        <strong>Fokus i opgaverne:</strong> Bygningen, værelserne, gulvrummene under sengen og 16mm-mørkekammeret.
                    </div>
                    <button class="btn btn-primary btn-large btn-choose-track" data-track="thormod">
                        SPIL SOM THORMOD ➔
                    </button>
                </div>

                <!-- Person 2: Willy Eisfeldt -->
                <div class="track-card modstand-track" id="card-eisfelt">
                    <div class="track-header">
                        <span class="track-device-tag">SKÆRM 2 // HØJRE</span>
                        <h3>${characters.eisfelt.name}</h3>
                        <small class="track-names">${characters.eisfelt.title}</small>
                    </div>
                    <p class="track-desc">
                        ${characters.eisfelt.description}
                    </p>
                    <div class="track-focus-box">
                        <strong>Historisk netværk:</strong> ${characters.eisfelt.network}.<br>
                        <strong>Fokus i opgaverne:</strong> Gestapo-efterretninger, SOE-bombemanualer, radiobølger og kodeord.
                    </div>
                    <button class="btn btn-primary btn-large btn-choose-track" data-track="eisfelt">
                        SPIL SOM EISFELDT ➔
                    </button>
                </div>
            </div>

            <div class="action-bar" style="justify-content: center; margin-top: 20px;">
                <button id="back-btn" class="btn btn-muted">Tilbage til start</button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.btn-choose-track').forEach(btn => {
        btn.addEventListener('click', () => {
            const trackId = btn.getAttribute('data-track');
            const chosen = characters[trackId];
            updateState({
                role: chosen.id,
                team: chosen.team,
                chapter: 1
            });
        });
    });

    document.getElementById('back-btn').addEventListener('click', () => {
        updateState({ chapter: 0, role: null, team: null });
    });
}