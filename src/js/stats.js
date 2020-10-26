import {getTopStats, getUserStats} from './firebase'
const topList = document.querySelector('.players-list')

getTopStats().then(setStatsHTML);

function setStatsHTML(data) {    
    const statsHTML = `
              <li class="player bg-place">
                <span class="players-number pn-one">1</span>
                ${data[0].name} - ${data[0].score} points
              </li>
              <li class="player bg-place">
                <span class="players-number pn-two">2</span>
                ${data[1].name} - ${data[1].score} points
              </li>
              <li class="player bg-place">
                <span class="players-number pn-three">3</span>
                ${data[2].name} - ${data[2].score} points
              </li>
              <li class="player">
                <span class="players-number">4</span>
                ${data[3].name} - ${data[3].score} points
              </li>
              <li class="player">
                <span class="players-number">5</span>
                ${data[4].name} - ${data[4].score} points
              </li>
              <li class="player">
                <span class="players-number">6</span>
                ${data[5].name} - ${data[5].score} points
              </li>
              <li class="player">
                <span class="players-number">7</span>
                ${data[6].name} - ${data[6].score} points
              </li>
              <li class="player">
                <span class="players-number">8</span>
                ${data[7].name} - ${data[7].score} points
              </li>
              <li class="player">
                <span class="players-number">9</span>
                ${data[8].name} - ${data[8].score} points
              </li>
              <li class="player">
                <span class="players-number">10</span>
                ${data[9].name} - ${data[9].score} points
              </li>
`;
topList.innerHTML = statsHTML;
}
