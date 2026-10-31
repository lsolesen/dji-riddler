// js/data/index.js
import { characters } from './characters.js';
import { mission0 } from './missions/mission-0.js';
import { mission1Data } from './missions/mission-1.js';
import { mission2Data } from './missions/mission-2.js';
import { mission3Data } from './missions/mission-3.js';
import { mission4Data } from './missions/mission-4.js';
import { mission5Data } from './missions/mission-5.js';
import { mission6Data } from './missions/mission-6.js'; // <-- Tilføjet

export { characters };

export const missions = {
    0: mission0,
    1: mission1Data,
    2: mission2Data,
    3: mission3Data,
    4: mission4Data,
    5: mission5Data,
    6: mission6Data // <-- Tilføjet
};