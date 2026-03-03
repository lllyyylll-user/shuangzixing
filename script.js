// 获取Canvas元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏变量
const centerX = canvas.width / 2; // 旋转中心X坐标（可调整）
const centerY = canvas.height / 2; // 旋转中心Y坐标（可调整）
const radius = 100; // 旋转半径（适配新的Canvas尺寸）
const ballRadius = 10; // 球的半径
const baseSpeed = 0.05; // 基础旋转速度（可统一修改）
const trailLength = 7; // 拖尾长度（可调整，值越大拖尾越长）
let angle = 0; // 初始角度
let rotationSpeed = 0; // 旋转速度
let keysPressed = {}; // 跟踪按键状态
let leftBtnPressed = false; // 左按钮状态
let rightBtnPressed = false; // 右按钮状态
let leftPressTime = 0; // 左按钮按下时间
let rightPressTime = 0; // 右按钮按下时间

// 星空背景
const stars = [];
const starCount = 50; // 星星数量

// 初始化星空
for (let i = 0; i < starCount; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 1 + 0.5
    });
}

// 初始化游戏
function init() {
    // 初始状态不旋转
    rotationSpeed = 0;
    
    // 绘制游戏
    draw();
    
    // 绑定按钮事件
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    
    // 左按钮事件
    leftBtn.addEventListener('mousedown', () => {
        leftBtnPressed = true;
        leftPressTime = Date.now(); // 记录按下时间
    });
    
    leftBtn.addEventListener('mouseup', () => {
        leftBtnPressed = false;
    });
    
    leftBtn.addEventListener('mouseleave', () => {
        leftBtnPressed = false;
    });
    
    // 左按钮触摸事件
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 阻止默认行为
        leftBtnPressed = true;
        leftPressTime = Date.now(); // 记录按下时间
    });
    
    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault(); // 阻止默认行为
        leftBtnPressed = false;
    });
    
    // 右按钮事件
    rightBtn.addEventListener('mousedown', () => {
        rightBtnPressed = true;
        rightPressTime = Date.now(); // 记录按下时间
    });
    
    rightBtn.addEventListener('mouseup', () => {
        rightBtnPressed = false;
    });
    
    rightBtn.addEventListener('mouseleave', () => {
        rightBtnPressed = false;
    });
    
    // 右按钮触摸事件
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 阻止默认行为
        rightBtnPressed = true;
        rightPressTime = Date.now(); // 记录按下时间
    });
    
    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault(); // 阻止默认行为
        rightBtnPressed = false;
    });
    
    // 键盘事件
    document.addEventListener('keydown', (e) => {
        keysPressed[e.keyCode] = true;
        if (e.keyCode === 37) { // 左箭头键
            leftPressTime = Date.now(); // 记录按下时间
        } else if (e.keyCode === 39) { // 右箭头键
            rightPressTime = Date.now(); // 记录按下时间
        }
    });
    
    document.addEventListener('keyup', (e) => {
        delete keysPressed[e.keyCode];
    });
}

// 绘制函数
function draw() {
    // 绘制星空背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新并绘制星星
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // 更新星星位置（向下移动）
        star.y += star.speed;
        
        // 星星移出屏幕后重新放置到顶部
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        
        // 绘制星星
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    
    // 根据按键和按钮状态更新旋转速度
    let leftInput = keysPressed[37] || leftBtnPressed;
    let rightInput = keysPressed[39] || rightBtnPressed;
    
    if (leftInput && rightInput) { // 同时按左右
        // 根据按下时间判断，使用最新按下的方向
        if (leftPressTime > rightPressTime) {
            rotationSpeed = -baseSpeed; // 逆时针旋转
        } else {
            rotationSpeed = baseSpeed; // 顺时针旋转
        }
    } else if (leftInput) { // 只按左
        rotationSpeed = -baseSpeed; // 逆时针旋转
    } else if (rightInput) { // 只按右
        rotationSpeed = baseSpeed; // 顺时针旋转
    } else { // 都没按
        rotationSpeed = 0; // 停止旋转
    }
    
    // 计算红球位置
    const redBallX = centerX + Math.cos(angle) * radius;
    const redBallY = centerY + Math.sin(angle) * radius;
    
    // 计算蓝球位置（与红球相差180度）
    const blueBallX = centerX + Math.cos(angle + Math.PI) * radius;
    const blueBallY = centerY + Math.sin(angle + Math.PI) * radius;
    
    // 绘制红球合成拖尾（旋转+向下）
    for (let i = 0; i < trailLength; i++) {
        const trailAlpha = 0.1 * (trailLength - i);
        const trailAngle = angle - i * rotationSpeed * 2;
        const trailX = centerX + Math.cos(trailAngle) * radius;
        const trailY = centerY + Math.sin(trailAngle) * radius + i * 5; // 向下偏移
        ctx.fillStyle = `rgba(246, 2, 2, ${trailAlpha})`;
        ctx.beginPath();
        ctx.arc(trailX, trailY, ballRadius - i * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    
    // 绘制蓝球合成拖尾（旋转+向下）
    for (let i = 0; i < trailLength; i++) {
        const trailAlpha = 0.1 * (trailLength - i);
        const trailAngle = angle + Math.PI - i * rotationSpeed * 2;
        const trailX = centerX + Math.cos(trailAngle) * radius;
        const trailY = centerY + Math.sin(trailAngle) * radius + i * 5; // 向下偏移
        ctx.fillStyle = `rgba(0, 28, 255, ${trailAlpha})`;
        ctx.beginPath();
        ctx.arc(trailX, trailY, ballRadius - i * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    
    // 绘制红球
    ctx.beginPath();
    ctx.arc(redBallX, redBallY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#f60202';
    ctx.fill();
    ctx.closePath();
    
    // 绘制蓝球
    ctx.beginPath();
    ctx.arc(blueBallX, blueBallY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#001cff';
    ctx.fill();
    ctx.closePath();
    
    // 更新角度
    angle += rotationSpeed;
    
    // 循环调用draw函数
    requestAnimationFrame(draw);
}

// 启动游戏
init();
