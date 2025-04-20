console.log("Windows XP Desktop loaded!");

const clickSound = document.getElementById("click-sound");
const openSound = document.getElementById("open-sound");
const closeSound = document.getElementById("close-sound");

function play(sound) {
  sound.currentTime = 0;
  sound.play();
}

window.addEventListener('DOMContentLoaded', () => {
    const bootSound = document.getElementById('boot-sound');
    play(bootSound);
  });
  

interact('.draggable').draggable({
    allowFrom: '.drag-handle',
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
  
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }
  });
  
  const icons = document.querySelectorAll('.desktop-icon');
  const windows = document.querySelectorAll('.xp-window');
  
  icons.forEach(icon => {
    icon.addEventListener('dblclick', () => {
        const app = icon.getAttribute('data-app');
        const win = document.getElementById(`${app}-window`);
        if (win) {
          win.style.display = 'block';
          bringToFront(win);
          play(openSound);
        }
    });
  });
  
  // Close buttons
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.xp-window').style.display = 'none';
        play(closeSound);
    });
  });
  
  // Bring window to front on click
  let zIndexCounter = 10;
  function bringToFront(win) {
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
  }
  
  windows.forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win));
  });

  interact('.xp-window').resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        let { x, y } = event.target.dataset;
  
        x = parseFloat(x) || 0;
        y = parseFloat(y) || 0;
  
        // Update size
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          height: `${event.rect.height}px`,
          transform: `translate(${x + event.deltaRect.left}px, ${y + event.deltaRect.top}px)`
        });
  
        // Update data attributes
        event.target.dataset.x = x + event.deltaRect.left;
        event.target.dataset.y = y + event.deltaRect.top;
      }
    },
    modifiers: [
      interact.modifiers.restrictSize({
        min: { width: 200, height: 150 }
      })
    ]
  });
  
const startButton = document.querySelector('.start-button');
const startMenu = document.getElementById('start-menu');
  
// Toggle Start Menu
startButton.addEventListener('click', () => {
    startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    play(clickSound);
});
  
  // Click menu item to open app
document.querySelectorAll('.start-items li').forEach(item => {
    item.addEventListener('click', () => {
      const app = item.getAttribute('data-app');
      if (app) {
        const win = document.getElementById(`${app}-window`);
        if (win) {
          win.style.display = 'block';
          bringToFront(win);
          addToTaskbar(app);
          play(openSound);
        }
      }
      startMenu.style.display = 'none';
    });
});


function addToTaskbar(appId) {
    const taskbar = document.querySelector('.taskbar-apps');
    if (document.getElementById(`task-${appId}`)) return; // already exists
  
    const btn = document.createElement('div');
    btn.classList.add('taskbar-button');
    btn.textContent = appId.replace('-', ' ').toUpperCase();
    btn.id = `task-${appId}`;
  
    btn.addEventListener('click', () => {
      const win = document.getElementById(`${appId}-window`);
      if (!win) return;
  
      if (win.style.display === 'none') {
        win.style.display = 'block';
        bringToFront(win);
      } else {
        win.style.display = 'none';
      }
  
      play(clickSound);
    });
  
    taskbar.appendChild(btn);
  }
  
document.getElementById('shutdown').addEventListener('click', () => {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('shutdown-modal').style.display = 'flex';
    play(clickSound);
});
  

document.getElementById('shutdown-confirm').addEventListener('click', () => {
    // Optional: Play shutdown sound before fade
    play(closeSound);
    
    document.body.innerHTML = `
      <div style="background: black; color: white; font-size: 24px; display: flex; align-items: center; justify-content: center; height: 100vh;">
        Thank you for visiting!
      </div>
    `;
  });
  
  document.getElementById('shutdown-cancel').addEventListener('click', () => {
    document.getElementById('shutdown-modal').style.display = 'none';
    play(clickSound);
  });
  