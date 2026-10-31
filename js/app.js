// js/app.js
import { showIntro } from './views/intro.js';
import { showRoleChooser } from './views/roles.js';
import { showMission } from './views/game.js';

const defaultState = {
    chapter: 0,   // 0 = Prolog/Intro, 1-6 = Missioner
    role: null,    // thomsen, thormod, eisfelt, dencker
    team: null     // Skole, Modstand
};

export let gameState = JSON.parse(localStorage.getItem('vih_game_state')) || { ...defaultState };

export function updateState(newState) {
    gameState = { ...gameState, ...newState };
    localStorage.setItem('vih_game_state', JSON.stringify(gameState));
    render();
}

// Rydder alle gåders fremskridt
export function resetGameStorage() {
    for (let i = 1; i <= 6; i++) {
        localStorage.removeItem(`vih_m${i}_state`);
        localStorage.removeItem(`vih_m${i}_puzzle_state`);
        localStorage.removeItem(`vih_m${i}_sabotage_state`);
        localStorage.removeItem(`vih_m${i}_progress`);
    }
    updateState({ ...defaultState });
}

// Eksporteres også under navnet 'resetGame' så intro.js finder den
export const resetGame = resetGameStorage;

export function render() {
    const app = document.getElementById('app');
    if (!app) return;

    // Rute 1: Prolog / Forside
    if (gameState.chapter === 0) {
        showIntro(app);
        return;
    }

    // Rute 2: Vælg Rolle
    if (!gameState.role) {
        showRoleChooser(app);
        return;
    }

    // Rute 3: Aktiv Mission (1-6)
    if (gameState.chapter >= 1 && gameState.chapter <= 6) {
        showMission(app, gameState.chapter, gameState.role);
        return;
    }

    resetGameStorage();
}

document.addEventListener('DOMContentLoaded', () => {
    render();
});