// 获取Canvas元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏变量
const centerX = canvas.width / 2; // 旋转中心X坐标（可调整）
const centerY = canvas.height / 1.3; // 旋转中心Y坐标（可调整）
const radius = 100; // 旋转半径（适配新的Canvas尺寸）
const ballRadius = 15; // 球的半径
const baseSpeed = 0.05; // 基础旋转速度（可统一修改）
const trailLength = 7; // 拖尾长度（可调整，值越大拖尾越长）
let angle = 0; // 初始角度
let rotationSpeed = 0; // 旋转速度
let keysPressed = {}; // 跟踪按键状态
let leftBtnPressed = false; // 左按钮状态
let rightBtnPressed = false; // 右按钮状态
let leftPressTime = 0; // 左按钮按下时间
let rightPressTime = 0; // 右按钮按下时间
let lastTime = Date.now(); // 上一帧的时间戳

// 障碍物相关
const obstacles = []; // 障碍物数组
let currentLevel = 0; // 当前关卡
let levelProgress = 0; // 关卡进度（已通过的障碍物数量）

// 游戏状态
let isGameRunning = false; // 游戏是否在运行

// 界面元素
const mainMenu = document.getElementById('mainMenu');
const settings = document.getElementById('settings');
const levelSelect = document.getElementById('levelSelect');
const levelComplete = document.getElementById('levelComplete');
const gameOver = document.getElementById('gameOver');
const menuBtn = document.getElementById('menuBtn');

// 按钮元素
const startBtn = document.getElementById('startBtn');
const settingsBtn = document.getElementById('settingsBtn');
const levelSelectBtn = document.getElementById('levelSelectBtn');
const backFromSettingsBtn = document.getElementById('backFromSettingsBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const backToMainFromGameOverBtn = document.getElementById('backToMainFromGameOverBtn');

// 星空背景
const stars = [];



// 初始化游戏
function init() {
    // 初始状态不旋转
    rotationSpeed = 0;
    
    // 初始化默认星空
    initStars({
        count: 50,
        minSize: 0.5,
        maxSize: 2.5,
        minSpeed: 0.5,
        maxSpeed: 1.5
    });
    
    // 初始化界面显示
    showMainMenu();
    
    // 绘制游戏
    draw();
    
    // 绑定按钮事件
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const level1Btn = document.getElementById('level1Btn');
    const level2Btn = document.getElementById('level2Btn');
    const level3Btn = document.getElementById('level3Btn');
    
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
    
    // 主菜单按钮事件
    startBtn.addEventListener('click', () => {
        startLevel(0); // 从第一关开始
    });
    
    settingsBtn.addEventListener('click', () => {
        showSettings();
    });
    
    levelSelectBtn.addEventListener('click', () => {
        showLevelSelect();
    });
    
    // 设置页面按钮事件
    backFromSettingsBtn.addEventListener('click', () => {
        showMainMenu();
    });
    
    // 关卡选择按钮事件
    level1Btn.addEventListener('click', () => {
        startLevel(0);
    });
    
    level2Btn.addEventListener('click', () => {
        startLevel(1);
    });
    
    level3Btn.addEventListener('click', () => {
        startLevel(2);
    });
    
    // 菜单按钮事件
    menuBtn.addEventListener('click', () => {
        showMainMenu();
        // 清空障碍物
        obstacles.length = 0;
    });
    
    // 通关界面按钮事件
    playAgainBtn.addEventListener('click', () => {
        startLevel(currentLevel);
    });
    
    nextLevelBtn.addEventListener('click', () => {
        const nextLevel = currentLevel + 1;
        if (nextLevel < levels.length) {
            startLevel(nextLevel);
        } else {
            // 所有关卡完成，返回主菜单
            showMainMenu();
        }
    });
    
    backToMainBtn.addEventListener('click', () => {
        showMainMenu();
    });
    
    // 游戏结束界面按钮事件
    tryAgainBtn.addEventListener('click', () => {
        startLevel(currentLevel);
    });
    
    backToMainFromGameOverBtn.addEventListener('click', () => {
        showMainMenu();
    });
}

// 显示主菜单
function showMainMenu() {
    // 隐藏所有界面
    hideAllMenus();
    // 显示主菜单
    mainMenu.style.display = 'flex';
    // 暂停游戏
    isGameRunning = false;
}

// 显示设置页面
function showSettings() {
    // 隐藏所有界面
    hideAllMenus();
    // 显示设置页面
    settings.style.display = 'flex';
    // 暂停游戏
    isGameRunning = false;
}

// 显示关卡选择界面
function showLevelSelect() {
    // 隐藏所有界面
    hideAllMenus();
    // 显示关卡选择界面
    levelSelect.style.display = 'flex';
    // 暂停游戏
    isGameRunning = false;
}

// 隐藏所有菜单
function hideAllMenus() {
    mainMenu.style.display = 'none';
    settings.style.display = 'none';
    levelSelect.style.display = 'none';
    levelComplete.style.display = 'none';
    gameOver.style.display = 'none';
}

// 显示通关提示
function showLevelComplete() {
    levelComplete.style.display = 'flex';
    // 暂停游戏
    isGameRunning = false;
}

// 显示游戏结束
function showGameOver() {
    gameOver.style.display = 'flex';
    // 暂停游戏
    isGameRunning = false;
}

// 初始化星空
function initStars(starConfig) {
    // 清空现有星星
    stars.length = 0;
    
    // 根据配置创建星星
    const count = starConfig.count || 50;
    const minSize = starConfig.minSize || 0.5;
    const maxSize = starConfig.maxSize || 2.5;
    const minSpeed = starConfig.minSpeed || 0.5;
    const maxSpeed = starConfig.maxSpeed || 1.5;
    
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * (maxSize - minSize) + minSize,
            speed: Math.random() * (maxSpeed - minSpeed) + minSpeed
        });
    }
}

// 检测碰撞
function checkCollision(ballX, ballY, ballRadius, obstacle) {
    // 计算小球与障碍物中心的距离
    const closestX = Math.max(obstacle.x, Math.min(ballX, obstacle.x + obstacle.width));
    const closestY = Math.max(obstacle.y, Math.min(ballY, obstacle.y + obstacle.height));
    
    // 计算距离的平方
    const distanceSquared = (ballX - closestX) ** 2 + (ballY - closestY) ** 2;
    
    // 检查距离是否小于小球半径的平方
    return distanceSquared <= ballRadius ** 2;
}

// 开始指定关卡
function startLevel(levelIndex) {
    // 设置当前关卡
    currentLevel = levelIndex;
    levelProgress = 0;
    // 清空障碍物
    obstacles.length = 0;
    // 隐藏所有菜单
    hideAllMenus();
    // 初始化星空
    if (levels[currentLevel] && levels[currentLevel].stars) {
        initStars(levels[currentLevel].stars);
    }
    // 开始游戏
    isGameRunning = true;
}

// 绘制函数
function draw() {
    // 计算时间差
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1000; // 转换为秒
    lastTime = currentTime;
    
    // 绘制星空背景
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新并绘制星星
    for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        
        // 更新星星位置（向下移动）
        star.y += star.speed * 60 * deltaTime; // 根据时间差调整速度
        
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
    
    // 游戏运行时执行游戏逻辑
    if (isGameRunning) {
        // 关卡障碍物生成逻辑
        if (obstacles.length === 0 && currentLevel < levels.length) {
            // 加载当前关卡的障碍物
            const levelData = levels[currentLevel];
            if (levelData && levelData.obstacles) {
                const levelObstacles = levelData.obstacles;
                for (let i = 0; i < levelObstacles.length; i++) {
                    const obsData = levelObstacles[i];
                    const obstacle = new Obstacle(obsData.width, obsData.height, obsData.x, obsData.y, obsData.speed);
                    obstacles.push(obstacle);
                }
            }
        }
        
        // 更新和绘制障碍物
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];
            
            // 更新障碍物位置
            obstacle.update(deltaTime);
            
            // 绘制障碍物
            obstacle.draw(ctx);
            
            // 检查是否移出屏幕
            if (obstacle.isOffScreen(canvas.height)) {
                // 从数组中移除
                obstacles.splice(i, 1);
                
                // 增加关卡进度
                levelProgress++;
                
                // 检查是否完成当前关卡
                if (obstacles.length === 0) {
                    // 显示通关提示
                    showLevelComplete();
                }
            }
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
        
        // 检测碰撞
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            // 检测红球与障碍物碰撞
            if (checkCollision(redBallX, redBallY, ballRadius, obstacle)) {
                showGameOver();
                break;
            }
            // 检测蓝球与障碍物碰撞
            if (checkCollision(blueBallX, blueBallY, ballRadius, obstacle)) {
                showGameOver();
                break;
            }
        }
        
        // 绘制关卡信息
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`关卡: ${currentLevel + 1}/${levels.length}`, 10, 30);
        
        // 根据时间差更新角度，确保速度与帧率无关
        angle += rotationSpeed * 60 * deltaTime; // 60是目标帧率
    }
    
    // 循环调用draw函数
    requestAnimationFrame(draw);
}

// 启动游戏
init();
