import { getTopStats, getUserStats } from './firebase';
import refs from './refs';
import { getGameMode } from './snake/modes';

export async function setStatsHTML() {
  const mode = getGameMode();
  const data = await getTopStats(mode);
  const statsHTML = data.map((e, i) => {
    if (i === 0) {
      return `<li class="player bg-place"><span class="players-number pn-one">${
        i + 1
      }</span>${e.name} - ${e.score} points</li>`;
    } else if (i === 1) {
      return `<li class="player bg-place"><span class="players-number pn-two">${
        i + 1
      }</span>${e.name} - ${e.score} points</li>`;
    } else if (i === 2) {
      return `<li class="player bg-place"><span class="players-number pn-three">${
        i + 1
      }</span>${e.name} - ${e.score} points</li>`;
    } else {
      return `<li class="player"><span class="players-number">${i + 1}</span>${
        e.name
      } - ${e.score} points </li>`;
    }
  });
  
  refs.topList.innerHTML = statsHTML.join(' ');
}
