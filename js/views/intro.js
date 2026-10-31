// js/views/intro.js
import { updateState, resetGame } from '../app.js';
import { missions } from '../data/index.js';

export function showIntro(container) {
    const introData = missions[0];

    container.innerHTML = `
        <div class="scene-container fade-in">
            <header class="vintage-header">
                <h1>THE RIDDLER</h1>
                <p class="subtitle">Den Jyske Idrætsskole & Modstandskampen 1944–1945</p>
            </header>

            <div class="visual-wrapper">
                <img src="/images/role-chooser.jpg" alt="Den Jyske Idrætsskole 1944" class="role-chooser-img">
            </div>

            <section class="briefing-box">
                <h2>${introData.title}</h2>
                <p>${introData.desc}</p>
                <div class="secret-box" style="margin-top: 15px;">
                    <strong>Samarbejdsregel:</strong> Dette spil spilles i to spor (Skole og Modstand). I må ikke kigge på hinandens skærme – al koordinering foregår ved at tale sammen!
                </div>
            </section>

            <div class="action-bar" style="justify-content: center; gap: 15px;">
                <button id="btn-start-game" class="btn btn-primary btn-large">START MISSIONEN ➔</button>
            </div>
        </div>
    `;

    document.getElementById('btn-start-game').addEventListener('click', () => {
        resetGame(); // Nulstiller tidligere gemt spildata
        updateState({ chapter: 1, role: null, team: null }); // Sender spillerne direkte til rollevalg
    });
}