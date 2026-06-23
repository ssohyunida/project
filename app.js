const floors = {
  1: {
    title: '1F - ABOUT',
    text: 'Park So Hyun · Graphic / Brand / Content Designer',
  },
  2: {
    title: '2F - EXPERIENCE',
    text: 'Service & Personal brand experience highlights',
  },
  3: {
    title: '3F - TOOLS',
    text: 'Photoshop · Figma · Illustrator · InDesign · AI Tools',
  },
  4: {
    title: '4F - PROJECTS',
    text: 'KKOTPICK · noww · RE:ZUL - brief cards',
  },
  5: {
    title: '5F - LETTER',
    text: 'How I found design · Strengths · Aspirations',
  },
};

let currentFloor = null;
let activeFloor = null;
let moving = false;
let doorOpen = false;

const root = document.getElementById('root');

function floorLabel(floor) {
  return floor === 0 || floor === null ? 'FLOOR' : `${floor}F`;
}

function renderContent() {
  if (!doorOpen) return '';

  if (!currentFloor) {
    return `
      <div>
        <h1>WELCOME</h1>
        <p>Press a floor button to enter Park So Hyun's portfolio.</p>
      </div>
    `;
  }

  const floor = floors[currentFloor];
  return `
    <div>
      <h1>${floor.title}</h1>
      <p>${floor.text}</p>
    </div>
  `;
}

function render() {
  root.innerHTML = `
    <div class="scene">
      <div class="elevator-shell">
        <div class="elevator-frame">
          <div class="elevator-inner ${moving ? 'moving' : ''}">
            <div class="ceiling-light"></div>
            <div class="back-wall"></div>
            <div class="arrival-badge" aria-hidden="true">ARRIVED</div>

            <div class="floor-display">
              <div class="label">DISPLAY</div>
              <div class="value">${floorLabel(currentFloor)}</div>
            </div>

            <div class="panel" role="region" aria-label="Elevator panel">
              <div class="panel-title">PANEL</div>
              <div class="button-grid">
                ${[1, 2, 3, 4, 5]
                  .map(
                    (n) => `
                      <button
                        class="floor-btn ${activeFloor === n ? 'active' : ''}"
                        aria-pressed="${activeFloor === n}"
                        data-floor="${n}"
                        ${moving ? 'disabled' : ''}
                      >${n}</button>
                    `,
                  )
                  .join('')}
              </div>
              <button class="open-btn" aria-expanded="${doorOpen}">
                ${doorOpen ? 'CLOSE' : 'OPEN'}
              </button>
            </div>

            <div class="door-viewport">
              <div class="door left ${doorOpen ? 'open' : 'closed'}" aria-hidden="${doorOpen}"></div>
              <div class="door right ${doorOpen ? 'open' : 'closed'}" aria-hidden="${doorOpen}"></div>

              <div class="content ${doorOpen ? 'visible' : ''}">
                ${renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.floor-btn').forEach((button) => {
    button.addEventListener('click', () => selectFloor(Number(button.dataset.floor)));
  });

  document.querySelector('.open-btn').addEventListener('click', toggleDoors);
}

function toggleDoors() {
  if (moving) return;
  doorOpen = !doorOpen;
  render();
}

function selectFloor(targetFloor) {
  if (moving || currentFloor === targetFloor) return;

  moving = true;
  activeFloor = targetFloor;
  doorOpen = false;
  render();

  setTimeout(() => {
    currentFloor = targetFloor;
    activeFloor = null;
    doorOpen = true;
    moving = false;
    render();

    const badge = document.querySelector('.arrival-badge');
    badge.classList.add('show');
    setTimeout(() => badge.classList.remove('show'), 700);
  }, 900);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && doorOpen) {
    doorOpen = false;
    render();
  }
});

render();
