export const MODE_CLASSIC = 'classic';
export const MODE_IGNORE_WALLS_COLLISION = 'ignoreWallsCollisionMode';

export function getGameMode() {
  const local = localStorage.getItem('mode');
  if (local === MODE_IGNORE_WALLS_COLLISION) {
    return 'arcade';
  }
  return MODE_CLASSIC;
}
