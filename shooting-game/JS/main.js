
// 캔버스 세팅
let canvas;    // 변수 선언
let ctx;       // 변수 선언
canvas = document.createElement("canvas"); //createElement로 canvas 생성
ctx = canvas.getContext("2d"); // getContext 2d 파일로 생성
canvas.width = 400; // canvas의 가로값 지정
canvas.height = 700; // canvas의 세로값 지정
document.body.appendChild(canvas); // body에 appendChild로 canvas 생성


// 이미지 파일들 불러오기
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver = false // true이면 게임 끝 , false 이면 게임이 계속 진행
let score = 0; // 점수 초기값


// 우주선 좌표
let spaceshipX = canvas.width/2-22
let spaceshipY = canvas.height-40

// 총알 좌표
let bulletList = []; // 총알들을 저장하는 리스트
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() { // init x, y 값을 우주선 x,y 값으로 초기화
        this.x = spaceshipX + 12;
        this.y = spaceshipY;
        this.alive = true // true면 살아있는 총알 false면 죽은 총알
        bulletList.push(this);
    };
    this.update = function() {
        this.y -= 7;
    }

    this.checkHit = function () {
        for(let i = 0; i < enemyList.length; i++) {
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x+40) {
                // 총알이 죽게됨 적군의 우주선이 없어짐, 점수 획득
                score++;
                this.alive = false // 죽은 총알
                enemyList.splice(i,1); // splice 리스트에서 하나를 없앤다
            }
        }
    }
}

function generateRandomValue(min,max) {
    let randomNum = Math.floor(Math.random()*(max-min+1))+min
    return randomNum
}


let enemyList = []; // 적군을 리스트에 저장
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.y =  0
        this.x = generateRandomValue(0,canvas.width-48)
        enemyList.push(this);
    }
    this.update = function() {
        this.y += 3; // 적군의 속도 조절

        if(this.y >= canvas.height-26) {
            gameOver = true;
        }
    }
}

let keysDown = {}; // 객체로 event.key 값 저장
function setupkeyboardListener() {
    document.addEventListener("keydown", function(event){
        keysDown[event.key] = true; // 키르 눌렀을 때 키 값 저장
    });
    document.addEventListener("keyup",function(event) {
        delete keysDown[event.key] // 키를 떼었을 때 키값 삭제

        if(event.key == " ") {
            createBullet(); // 총알 생성 함수
        }
    })
}

function createBullet() {
    let b = new Bullet(); // new 키워드는 Bullet이라는 함수를 새로 하나 더 만든다 그것을 b 라는 변수에 저장
    b.init();
}

function createEnemy() {
    const interval = setInterval(function(){
        let e = new Enemy()
        e.init()
    },1000)
}

function update() {
    // 우주선의 오른쪽 이동
    if( "ArrowRight" in keysDown) {
        spaceshipX += 4; // 우주선의 속도
    } // rigth
    
    // 우주선의 왼쪽 이동
    if( "ArrowLeft" in keysDown) {
        spaceshipX -= 4; // 우주선의 속도
    } // left

    // 캔버스 x좌표 왼쪽 , 오른쪽 넘어가지 않음
    if(spaceshipX <= 0) {
        spaceshipX = 0;
    }
    if(spaceshipX >= canvas.width - 40) {
        spaceshipX = canvas.width - 40;
    }

    // 총알의 y좌표 업데이트 함수
    for(let i=0;i<bulletList.length;i++) {
        if(bulletList[i].alive) {
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    // 적군이 내려오게 하는 함수
    for(let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }
}

// 이미지 불러오는 함수
function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = "images/background.gif";
    
    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png";

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png";

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png";

    gameOverImage = new Image();
    gameOverImage.src = "images/gameover.png";
}

// 캔버스에 그리는 함수
function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY, 40, 40);
    ctx.fillText(`Score:${score}`, 20, 25);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial"
    for(let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {
            ctx.drawImage(spaceshipImage, bulletList[i].x,bulletList[i].y);    
        }
    }

    for(let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x,enemyList[i].y);
    }
}

// render 함수를 계속 싫행 시켜주는 함수
function main() {
    if(!gameOver) {
        update(); // 좌표값을 업데이트
        render(); // 그려주기
        requestAnimationFrame(main); // frame을 계속 호출해서 보여주는 메소드
    } else {
        ctx.drawImage(gameOverImage, 20, 80, 370, 370);
    }
}



loadImage();
setupkeyboardListener();
createEnemy();
main();
