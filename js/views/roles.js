// js/views/roles.js
import { updateState } from '../app.js';
import { characters } from '../data/characters.js';

export function showRoleChooser(container) {
    const html = `
        <div class="scene-container fade-in">
            <header class="vintage-header">
                <h2>VÆLG DIT SPILLESPORET</h2>
                <p>Spillet kræver to skærme. Aftal hvem der tager hvilket spor:</p>
            </header>

            <div class="visual-wrapper">
                <img src="/images/role-chooser.jpg" alt="Den Jyske Idrætsskole 1944" class="role-chooser-img">
            </div>

            <div class="tracks-selection-grid">
                <!-- Spor 1: Skole -->
                <div class="track-card skole-track" id="card-skole">
                    <div class="track-header">
                        <span class="track-device-tag">SKÆRM 1</span>
                        <h3>🏢 SKOLEHOLDET</h3>
                        <small class="track-names">Svend Aage Thomsen & Thormod Petersen</small>
                    </div>
                    <p class="track-desc">
                        ${characters.skole.description}
                    </p>
                    <div class="track-focus-box">
                        <strong>Dit fokus:</strong> Bygningens hemmeligheder, plantegninger, fjedermekanismer og arbejdsborde.
                    </div>
                    <button class="btn btn-primary btn-large btn-choose-track" data-track="skole">
                        VÆLG SKOLEHOLDET ➔
                    </button>
                </div>

                <!-- Spor 2: Modstand -->
                <div class="track-card modstand-track" id="card-modstand">
                    <div class="track-header">
                        <span class="track-device-tag">SKÆRM 2</span>
                        <h3>🕶️ MODSTANDSHOLDET</h3>
                        <small class="track-names">Willy Eisfeldt & Holger Dencker</small>
                    </div>
                    <p class="track-desc">
                        ${characters.modstand.description}
                    </p>
                    <div class="track-focus-box">
                        <strong>Dit fokus:</strong> Hemmelige efterretninger, SOE-instrukser, felt-radioer og kodeord.
                    </div>
                    <button class="btn btn-primary btn-large btn-choose-track" data-track="modstand">
                        VÆLG MODSTANDSHOLDET ➔
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