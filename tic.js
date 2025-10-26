const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const playerEl = document.getElementById('player');
const restartBtn = document.getElementById('restart');

let board = Array(9).fill(null);
let current = 'X';
let running = true;

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function init(){
  boardEl.innerHTML = '';
  board.forEach((_,i)=> createCell(i));
  updateStatus();
  running = true;
}

function createCell(index){
  const btn = document.createElement('button');
  btn.className = 'cell';
  btn.setAttribute('data-index', index);
  btn.addEventListener('click', onClickCell);
  boardEl.appendChild(btn);
}

function onClickCell(e){
  const idx = Number(e.currentTarget.dataset.index);
  if(!running || board[idx]) return;
  board[idx] = current;
  render();
  const winner = checkWin();
  if(winner){
    statusEl.innerHTML = `Pemenang: <strong>${winner}</strong>`;
    running = false;
    highlightWinning(winner);
    return;
  }
  if(board.every(Boolean)){
    statusEl.textContent = 'Seri!';
    running = false;
    return;
  }
  current = current === 'X' ? 'O' : 'X';
  updateStatus();
}

function render(){
  board.forEach((val,i)=>{
    const cell = boardEl.querySelector(`[data-index="${i}"]`);
    cell.textContent = val ?? '';
    cell.classList.toggle('x', val==='X');
    cell.classList.toggle('o', val==='O');
  });
}

function updateStatus(){
  playerEl.textContent = current;
}

function checkWin(){
  for(const combo of wins){
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      return board[a];
    }
  }
  return null;
}

function highlightWinning(player){
  for(const combo of wins){
    const [a,b,c] = combo;
    if(board[a]===player && board[b]===player && board[c]===player){
      [a,b,c].forEach(i=>{
        const cell = boardEl.querySelector(`[data-index="${i}"]`);
        if(cell) cell.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
      });
      break;
    }
  }
}

restartBtn.addEventListener('click', ()=>{
  board = Array(9).fill(null);
  current = 'X';
  init();
});

init();