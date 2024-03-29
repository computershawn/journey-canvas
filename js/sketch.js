const setComp = (
  compParams,
  frameSlider,
  balanceSlider,
  diffSlider,
) => {
  if (animationMode === 1) {
    frameSlider.value = compParams.storedCycleFrame;
    currentCycleFrame = compParams.storedCycleFrame % durationFrames;
  }

  balanceSlider.value = compParams.storedBalance;
  balance = compParams.storedBalance / 100;

  diffSlider.value = compParams.storedDiff;
  diff = mapTo(compParams.storedDiff, 0, 100, 1, 8);
};

const buildSelectMenu = (shouldSetComp = false) => {
  const comps = getAllComps();
  const container = document.querySelector('#dropdown-container');
  if (comps.length) {
    const frameSlider = document.querySelector('#frame-number');
    const balanceSlider = document.querySelector('#balance');
    const diffSlider = document.querySelector('#diff');

    if (shouldSetComp) {
      const params = getComp(comps[0]);
      setComp(params, frameSlider, balanceSlider, diffSlider);
    }

    // Remove existing options from dropdown
    const compSelect = document.querySelector('#comp-select');
    while (compSelect.firstChild) {
      compSelect.removeChild(compSelect.firstChild);
    }

    // Add options to dropdown
    comps.forEach((comp, index) => {
      const option = document.createElement('div');
      option.classList.add('item');
      if (index === 0 && shouldSetComp) {
        option.classList.add('active');
      }

      const loadBtn = document.createElement('div');
      loadBtn.classList.add('load-btn');
      loadBtn.innerText = `comp ${index + 1}`;
      loadBtn.addEventListener('click', () => {
        const params = getComp(comp);
        setComp(params, frameSlider, balanceSlider, diffSlider);
        const csp = params.curveSetPoints;
        bezi = new BeziSpline(csp, (val) => console.log(val));
        resetBezier();
        styleDropdown(index);
      });

      const removeBtn = document.createElement('div');
      removeBtn.classList.add('remove');
      removeBtn.innerText = '✕';
      removeBtn.addEventListener('click', () => {
        removeComp(comp.id);
        container.dispatchEvent(new Event('look', {
          'bubbles': true,
          'cancelable': false,
        }));
      });

      option.appendChild(loadBtn);
      option.appendChild(removeBtn);
      compSelect.appendChild(option);
    });
    container.style.display = 'inline-block';
  } else {
    container.style.display = 'none';
  }
}

function setupSketch(pathOption = 0) {
  initPalette().then((data) => {
    allColors = data;
    palette = pickPalette(data);
  });

  for (let j = 0; j < 2 * maxTicks; j++) {
    const i = Math.floor(Math.random(numColors));
    tickSequence.push(i);
  }

  // Instantiate Bezier curve object
  const existingComps = getAllComps();
  const csp = existingComps.length
    ? getComp(existingComps[0])?.curveSetPoints
    : null;
  bezi = new BeziSpline(csp, (newPoints) => {
    // The logic in the callback will re-render
    // the fan whenever the bezier is modified
    fan.resetPoints(newPoints);
    fan.update(frameCount);
    if (showFan) {
      fan.render();
    }
  });

  let pts;
  switch(pathOption) {
    case 0: 
      pts = getStraightPath();
      break;
    case 1:
      const circleRadius = 160; // 600;
      // pts = getArcPoints(0.25 * Math.PI, numLoops, circleRadius, wd / 2, 260);
      pts = getArcPoints(2 * Math.PI, numLoops, circleRadius, wd / 2, ht / 2 - circleRadius);
      break;
    case 2:
    default:
      pts = bezi.getBezierSplinePoints(numLoops);
  }

  fan = new Fan(pts);
  fan.update(frameCount);

  // Finally, render the visuals  
  if (showBezier) {
    bezi.render();
  }
  
  if (showFan) {
    fan.render();
  }
}

function setupUI() {
  // Set up UI Controls
  const frameSlider = document.querySelector('#frame-number');
  const balanceSlider = document.querySelector('#balance');
  const diffSlider = document.querySelector('#diff');

  frameSlider.addEventListener('input', (e) => {
    const num = e.target.value;
    goToFrameNumber(num);
  });

  balanceSlider.addEventListener('input', (e) => {
    const num = e.target.value;
    balance = num / 100;
  });

  diffSlider.addEventListener('input', (e) => {
    diff = mapTo(e.target.value, 0, 100, 1, 8);
  });

  buildSelectMenu(true);

  const animModeBtn = document.querySelector('#animation-mode');
  animModeBtn.addEventListener('click', () => {
    if (animationMode === 0) {
      animationMode = 1;
      animModeBtn.innerHTML = 'play';
    } else {
      animationMode = 0;
      animModeBtn.innerHTML = 'pause';
    }
  });

  const showPathBtn = document.querySelector('#show-path');
  showPathBtn.addEventListener('click', () => {
    if (!showBezier) {
      showBezier = true;
      showPathBtn.innerHTML = '⚫ path';
    } else {
      showBezier = false;
      showPathBtn.innerHTML = '⚪ path';
    }
  });

  const showGeomBtn = document.querySelector('#show-geom');
  showGeomBtn.addEventListener('click', () => {
    if (!showFan) {
      showFan = true;
      showGeomBtn.innerHTML = '⚫ geom';
    } else {
      showFan = false;
      showGeomBtn.innerHTML = '⚪ geom';
    }
  });

  const showParticlesBtn = document.querySelector('#show-particles');
  showParticlesBtn.addEventListener('click', () => {
    if (!showParticles) {
      showParticles = true;
      showParticlesBtn.innerHTML = '⚫ particles';
    } else {
      showParticles = false;
      showParticlesBtn.innerHTML = '⚪ particles';
    }
  });

  const showColorBtn = document.querySelector('#show-color');
  showColorBtn.addEventListener('click', () => {
    if (!showColor) {
      showColor = true;
      showColorBtn.innerHTML = '⚫ colors';
      document.querySelector('#change-palette').disabled = false;
    } else {
      showColor = false;
      showColorBtn.innerHTML = '⚪ colors';
      document.querySelector('#change-palette').disabled = true;
    }
  });

  const showBackgroundBtn = document.querySelector('#show-background');
  showBackgroundBtn.addEventListener('click', () => {
    if (!showBackground) {
      showBackground = true;
      showBackgroundBtn.innerHTML = '⚫ background';
      changeBackgroundBtn.disabled = false;
    } else {
      showBackground = false;
      showBackgroundBtn.innerHTML = '⚪ background';
      changeBackgroundBtn.disabled = true;
    }
  });

  const changeBackgroundBtn = document.querySelector('#change-background');
  changeBackgroundBtn.addEventListener('click', () => {
    bgIndex += 1;
    if (bgIndex === numColors) {
      bgIndex = 0;
      showBackground = false;
      showBackgroundBtn.innerHTML = '⚪ background';
      changeBackgroundBtn.disabled = true;
    }
  });

  const saveCompBtn = document.querySelector('#save-comp');
  saveCompBtn.addEventListener('click', () => {
    animationMode = 1;
    const numComps = saveComp();
    buildSelectMenu();
    styleDropdown(numComps - 1);
  });

  const downloadBtn = document.querySelector('#download-comp');
  downloadBtn.addEventListener('click', () => {
    animationMode = 1;
    const timestamp = round(Date.now() / 1000);
    const filename = `journey-${timestamp}`;
    saveCanvas(filename, 'png');
  });

  const loadPaletteBtn = document.querySelector('#change-palette');
  loadPaletteBtn.addEventListener('click', () => {
    if (allColors.length) {
      palette = pickPalette(allColors);
    }
  });
}


function getStraightPath() {
  const temp = [];
  const sp = 2;
  for (let j = 0; j < numLoops; j++) {
    const w = (numLoops - 1) * sp;
    const xOffset = cX - w / 2;
    const vec = {x: xOffset + j * sp, y: cY};
    temp.push(vec);
  }

  return temp;
}


