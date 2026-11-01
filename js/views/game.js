// js/views/game.js
import { updateState } from '../app.js';
import { characters, missions } from '../data/index.js';
import { initMission1 } from './missions/mission-1.js';
import { initMission2 } from './missions/mission-2.js';
import { initMission3 } from './missions/mission-3.js';
import { initMission4 } from './missions/mission-4.js';
import { initMission5 } from './missions/mission-5.js';
import { initMission6 } from './missions/mission-6.js';

const missionViews = {
    1: initMission1,
    2: initMission2,
    3: initMission3,
    4: initMission4,
    5: initMission5,
    6: initMission6
};

export function showMission(container, chapter, role) {
    const char = characters[role] || characters['thormod'];
    const mission = missions[chapter];

    const html = `
        <div class="scene-container fade-in">
            <header class="game-header">
                <div class="avatar-badge clickable ${char.team.toLowerCase()}" id="avatar-badge-btn" title="Klik for at skifte identitet">
                    <div class="avatar-circle">
                        <!-- Her er det rigtige avatar-billede tilbage! -->
                        <img src="${char.avatar}" alt="${char.name}" class="avatar-crop ${char.id}">
                    </div>
                    <div class="avatar-meta">
                        <span class="avatar-name">${char.name}</span>
                        <span class="avatar-role">${char.title}</span>
                    </div>
                </div>
                <div class="chapter-stamp">MISSION ${chapter}</div>
            </header>

            <div class="mission-banner">
                <img src="${mission.banner}" alt="${mission.title}" class="mission-img">
            </div>

            <div id="mission-content-mount"></div>

            <div class="action-bar">
                <div></div>
                <button id="next-mission-btn" class="btn btn-primary" style="display: none;">
                    ${chapter === 6 ? 'AFSLUT SPILLET OG VEND TILBAGE TIL START 🏆' : 'GÅ TIL NÆSTE MISSION ➔'}
                </button>
            </div>
        </div>

        <div id="role-modal-overlay" class="modal-overlay" style="display: none;">
            <div class="modal-card">
                <div class="modal-header">
                    <h3>SKIFT IDENTITET</h3>
                    <button id="close-modal-btn" class="modal-close-btn">&times;</button>
                </div>
                <p class="modal-intro">Er du havnet på den forkerte person i forhold til din makker?</p>
                <div class="modal-roles-list">
                    <div class="modal-role-card ${char.id === 'thormod' ? 'active-role' : ''} skole" data-track-id="thormod">
                        <div class="avatar-circle">
                            <img src="${characters.thormod.avatar}" alt="Thormod" class="avatar-crop thormod">
                        </div>
                        <div class="modal-role-meta">
                            <div class="modal-role-name">${characters.thormod.name}</div>
                            <div class="modal-role-title">${characters.thormod.title}</div>
                        </div>
                        ${char.id === 'thormod' ? '<span class="current-label">Aktiv nu</span>' : '<button class="btn btn-sm">Vælg Thormod</button>'}
                    </div>

                    <div class="modal-role-card ${char.id === 'eisfelt' ? 'active-role' : ''} modstand" data-track-id="eisfelt">
                        <div class="avatar-circle">
                            <img src="${characters.eisfelt.avatar}" alt="Eisfeldt" class="avatar-crop eisfelt">
                        </div>
                        <div class="modal-role-meta">
                            <div class="modal-role-name">${characters.eisfelt.name}</div>
                            <div class="modal-role-title">${characters.eisfelt.title}</div>
                        </div>
                        ${char.id === 'eisfelt' ? '<span class="current-label">Aktiv nu</span>' : '<button class="btn btn-sm">Vælg Eisfeldt</button>'}
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    const modal = container.querySelector('#role-modal-overlay');
    const badgeBtn = container.querySelector('#avatar-badge-btn');
    const closeBtn = container.querySelector('#close-modal-btn');

    badgeBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    container.querySelectorAll('.modal-role-card').forEach(card => {
        card.addEventListener('click', () => {
            const trackId = card.getAttribute('data-track-id');
            if (trackId !== role) {
                const newChar = characters[trackId];
                updateState({ role: newChar.id, team: newChar.team });
            } else {
                modal.style.display = 'none';
            }
        });
    });

    const missionMount = container.querySelector('#mission-content-mount');
    const nextBtn = container.querySelector('#next-mission-btn');

    const onMissionComplete = () => {
        nextBtn.style.display = 'inline-block';
        nextBtn.addEventListener('click', () => {
            if (chapter === 6) {
                alert("Tillykke! I har fuldført modstandskampen på Den Jyske Idrætsskole. Dokumentarfilmen 'Flæskestegen' er sikret for eftertiden!");
                import('../app.js').then(module => {
                    module.resetGameStorage();
                });
            } else {
                updateState({ chapter: chapter + 1 });
            }
        }, { once: true });
    };

    const loadMissionView = missionViews[chapter];
    if (loadMissionView) {
        loadMissionView(missionMount, char, mission, onMissionComplete);
    }
}