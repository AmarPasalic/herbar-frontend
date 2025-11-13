import { pointsRules } from '../data/achievements';

type ActionKey = 'basic-photo' | 'new-species-student' | 'rare-species';

function getPointsFor(action: ActionKey): number {
    const rule = pointsRules.find(r => r.action === action);
    // Fallbacks to preserve behavior if rules change
    if (!rule) {
        if (action === 'basic-photo') return 10;
        if (action === 'new-species-student') return 50;
        if (action === 'rare-species') return 100;
        return 0;
    }
    return rule.points;
}

export function computePlantSavePoints(options: { isNew?: boolean; isRare?: boolean } = {}): number {
    const base = getPointsFor('basic-photo');
    const bonusNew = options.isNew ? getPointsFor('new-species-student') : 0;
    const bonusRare = options.isRare ? getPointsFor('rare-species') : 0;
    return base + bonusNew + bonusRare;
}

export function computePlantSaveBonusPoints(options: { isNew?: boolean; isRare?: boolean } = {}): number {
    const bonusNew = options.isNew ? getPointsFor('new-species-student') : 0;
    const bonusRare = options.isRare ? getPointsFor('rare-species') : 0;
    return bonusNew + bonusRare;
}

export function getBasicPhotoPoints(): number {
    return getPointsFor('basic-photo');
}

export function getTotalPoints(): number {
    return parseInt(localStorage.getItem('totalPoints') || '0', 10) || 0;
}

export function addPoints(points: number): number {
    const current = getTotalPoints();
    const next = current + points;
    localStorage.setItem('totalPoints', String(next));
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('points:updated', { detail: next }));
    }
    return next;
}
