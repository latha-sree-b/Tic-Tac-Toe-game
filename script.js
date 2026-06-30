const cells=document.querySelectorAll(".cell");
const statusText=document.getElementById("status");

let board=["","","","","","","","",""];
const human="X";
const ai="O";
let gameActive=true;

let playerScore=0;
let aiScore=0;
let drawScore=0;

const winPatterns=[
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

cells.forEach(cell=>{
    cell.addEventListener("click",humanMove);
});

function humanMove(){
    const index=this.dataset.index;
    if(board[index]!==""||!gameActive) return;

    board[index]=human;
    this.textContent=human;

    if(checkWinner(board,human)){
        statusText.textContent="You Win!";
        gameActive=false;
        playerScore++;
        document.getElementById("playerScore").textContent=playerScore;
        highlightWinner();
        return;
    }

    if(!board.includes("")){
        statusText.textContent="Draw!";
        drawScore++;
        document.getElementById("drawScore").textContent=drawScore;
        return;
    }

    statusText.textContent="AI Thinking...";
    setTimeout(aiMove,300);
}

function aiMove(){
    let bestMove=minimax(board,ai).index;

    board[bestMove]=ai;
    cells[bestMove].textContent=ai;

    if(checkWinner(board,ai)){
        statusText.textContent="AI Wins!";
        gameActive=false;
        aiScore++;
        document.getElementById("aiScore").textContent=aiScore;
        highlightWinner();
        return;
    }

    if(!board.includes("")){
        statusText.textContent="Draw!";
        drawScore++;
        document.getElementById("drawScore").textContent=drawScore;
        return;
    }

    statusText.textContent="Your Turn";
}

function minimax(newBoard,player){
    let spots=newBoard
        .map((spot,index)=>spot===""?index:null)
        .filter(v=>v!==null);

    if(checkWinner(newBoard,human)) return {score:-10};
    if(checkWinner(newBoard,ai)) return {score:10};
    if(spots.length===0) return {score:0};

    let moves=[];

    for(let i=0;i<spots.length;i++){
        let move={};
        move.index=spots[i];
        newBoard[spots[i]]=player;

        if(player===ai){
            move.score=minimax(newBoard,human).score;
        } else {
            move.score=minimax(newBoard,ai).score;
        }

        newBoard[spots[i]]="";
        moves.push(move);
    }

    let bestMove;

    if(player===ai){
        let bestScore=-Infinity;
        for(let i=0;i<moves.length;i++){
            if(moves[i].score>bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    } else {
        let bestScore=Infinity;
        for(let i=0;i<moves.length;i++){
            if(moves[i].score<bestScore){
                bestScore=moves[i].score;
                bestMove=i;
            }
        }
    }

    return moves[bestMove];
}

function checkWinner(board,player){
    return winPatterns.some(pattern =>
        pattern.every(index => board[index]===player)
    );
}

function highlightWinner(){
    winPatterns.forEach(pattern=>{
        if(pattern.every(index=>board[index]===board[pattern[0]] && board[index]!=="")){
            pattern.forEach(index=>{
                cells[index].classList.add("win");
            });
        }
    });
}

function restartGame(){
    board=["","","","","","","","",""];
    gameActive=true;
    statusText.textContent="Your Turn";

    cells.forEach(cell=>{
        cell.textContent="";
        cell.classList.remove("win");
    });
}

