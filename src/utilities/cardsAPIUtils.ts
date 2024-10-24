import Settings from '../settings.json';

/**
 * Utility to get the full cardsAPI version from the settings.json
 * @returns the cardsAPI version as a string
 */
export function getCardsAPIVersion(): string {
    return `${Settings.cardsMajorVersionNumber}.${Settings.cardsMinorVersionNumber}.${Settings.cardsFixesVersionNumber}`;
}