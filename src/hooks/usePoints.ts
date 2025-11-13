import { useEffect, useState } from 'react';
import { getTotalPoints } from '../utils/points';

export function usePoints() {
    const [points, setPoints] = useState<number>(() => getTotalPoints());

    useEffect(() => {
        const handler = (e: Event) => {
            if ((e as CustomEvent).detail != null) {
                setPoints((e as CustomEvent<number>).detail);
            } else {
                setPoints(getTotalPoints());
            }
        };
        window.addEventListener('points:updated', handler as EventListener);
        // Sync across tabs or external changes
        const storageHandler = (ev: StorageEvent) => {
            if (ev.key === 'totalPoints') setPoints(getTotalPoints());
        };
        window.addEventListener('storage', storageHandler);
        return () => {
            window.removeEventListener('points:updated', handler as EventListener);
            window.removeEventListener('storage', storageHandler);
        };
    }, []);

    return points;
}
