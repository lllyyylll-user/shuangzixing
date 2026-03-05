// 获取Canvas元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏变量
const centerX = canvas.width / 2; // 旋转中心X坐标（可调整）
const centerY = canvas.height / 1.3; // 旋转中心Y坐标（可调整）
const radius = 80; // 旋转半径（适配新的Canvas尺寸）
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
let isColliding = false; // 是否正在碰撞（用于延迟显示游戏结束页面）

// 拖拽相关
let selectedObstacle = null; // 当前选中的障碍物
let isDragging = false; // 是否正在拖拽
let dragOffsetX = 0; // 拖拽偏移量X
let dragOffsetY = 0; // 拖拽偏移量Y

// 碰撞动画相关
let collisionEffect = null; // 碰撞效果对象

// 界面元素
const mainMenu = document.getElementById('mainMenu');
const settings = document.getElementById('settings');
const levelSelect = document.getElementById('levelSelect');
const levelComplete = document.getElementById('levelComplete');
const gameOver = document.getElementById('gameOver');
const menuBtn = document.getElementById('menuBtn');
const speedInputContainer = document.getElementById('speedInputContainer');
const speedInput = document.getElementById('speedInput');
const applySpeedBtn = document.getElementById('applySpeedBtn');

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
    const testLevelBtn = document.getElementById('testLevelBtn');
    const addObstacleBtn = document.getElementById('addObstacleBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const completeBtn = document.getElementById('completeBtn');
    
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
        } else if (e.keyCode === 32 && currentLevel === 3) { // 空格键 - 测试关卡暂停
            e.preventDefault(); // 阻止默认行为，避免触发按钮点击
            isGameRunning = !isGameRunning;
        }
        
        // 暂停时调整选中障碍物大小
        if (!isGameRunning && selectedObstacle) {
            const resizeAmount = 5;
            switch (e.keyCode) {
                case 38: // 上箭头 - 增加高度
                    selectedObstacle.height += resizeAmount;
                    break;
                case 40: // 下箭头 - 减少高度
                    if (selectedObstacle.height > resizeAmount) {
                        selectedObstacle.height -= resizeAmount;
                    }
                    break;
                case 37: // 左箭头 - 减少宽度
                    if (selectedObstacle.width > resizeAmount) {
                        selectedObstacle.width -= resizeAmount;
                    }
                    break;
                case 39: // 右箭头 - 增加宽度
                    selectedObstacle.width += resizeAmount;
                    break;
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        delete keysPressed[e.keyCode];
    });
    
    // 鼠标事件 - 检测点击障碍物
    canvas.addEventListener('mousedown', (e) => {
        if (!isGameRunning) {
            const rect = canvas.getBoundingClientRect();
            // 计算Canvas的缩放比例
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            // 计算鼠标在Canvas坐标系中的坐标
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;
            
            let clickedObstacle = null;
            // 从后往前遍历，确保点击上面的障碍物
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const obstacle = obstacles[i];
                if (mouseX >= obstacle.x && mouseX <= obstacle.x + obstacle.width && 
                    mouseY >= obstacle.y && mouseY <= obstacle.y + obstacle.height) {
                    clickedObstacle = obstacle;
                    break;
                }
            }
            
            if (clickedObstacle) {
                selectedObstacle = clickedObstacle;
                isDragging = true;
                dragOffsetX = mouseX - clickedObstacle.x;
                dragOffsetY = mouseY - clickedObstacle.y;
                // 显示速度输入框并设置当前速度
                speedInputContainer.style.display = 'block';
                speedInput.value = clickedObstacle.speed;
            } else {
                // 点击空白处，取消选中
                selectedObstacle = null;
                isDragging = false;
                // 隐藏速度输入框
                speedInputContainer.style.display = 'none';
            }
        }
    });
    
    // 鼠标事件 - 拖拽障碍物
    canvas.addEventListener('mousemove', (e) => {
        if (!isGameRunning && isDragging && selectedObstacle) {
            const rect = canvas.getBoundingClientRect();
            // 计算Canvas的缩放比例
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            // 计算鼠标在Canvas坐标系中的坐标
            const mouseX = (e.clientX - rect.left) * scaleX;
            const mouseY = (e.clientY - rect.top) * scaleY;
            
            selectedObstacle.x = mouseX - dragOffsetX;
            selectedObstacle.y = mouseY - dragOffsetY;
        }
    });
    
    // 鼠标事件 - 释放障碍物
    canvas.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // 鼠标事件 - 鼠标离开画布
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    // 滚轮事件 - 暂停时上下移动所有障碍物
    canvas.addEventListener('wheel', (e) => {
        if (!isGameRunning) {
            e.preventDefault(); // 阻止默认滚动行为
            const deltaY = e.deltaY > 0 ? 5 : -5; // 向下滚动为正，向上滚动为负
            
            // 移动所有障碍物
            for (let i = 0; i < obstacles.length; i++) {
                obstacles[i].y += deltaY;
            }
        }
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
    
    // 测试关卡按钮事件
    testLevelBtn.addEventListener('click', () => {
        startLevel(3);
    });
    
    // 添加障碍物按钮事件
    addObstacleBtn.addEventListener('click', () => {
        // 在屏幕中间添加一个障碍物
        const obstacle = new Obstacle(100, 20, canvas.width / 2 - 50, 100, 1.5);
        obstacles.push(obstacle);
    });
    
    // 暂停按钮事件
    pauseBtn.addEventListener('click', () => {
        isGameRunning = !isGameRunning;
    });
    
    // 完成按钮事件
    completeBtn.addEventListener('click', () => {
        // 收集所有障碍物的参数
        const obstacleParams = obstacles.map(obstacle => {
            return {
                width: obstacle.width,
                height: obstacle.height,
                x: Math.round(obstacle.x),
                y: Math.round(obstacle.y),
                speed: obstacle.speed
            };
        });
        
        // 生成格式化的字符串
        let formattedParams = 'obstacles: [\n';
        obstacleParams.forEach((obstacle, index) => {
            formattedParams += '         { width: ' + obstacle.width + ', height: ' + obstacle.height + ', x: ' + obstacle.x + ', y: ' + obstacle.y + ', speed: ' + obstacle.speed + ' }';
            if (index < obstacleParams.length - 1) {
                formattedParams += ',';
            }
            formattedParams += '\n';
        });
        formattedParams += '    ]';
        
        // 显示障碍物参数
        console.log('障碍物参数:', formattedParams);
        
        // 创建可复制的文本区域
        const copyArea = document.createElement('textarea');
        copyArea.value = formattedParams;
        copyArea.style.position = 'fixed';
        copyArea.style.left = '-999999px';
        copyArea.style.top = '-999999px';
        document.body.appendChild(copyArea);
        copyArea.select();
        document.execCommand('copy');
        document.body.removeChild(copyArea);
        
        // 显示提示
        alert('障碍物参数已复制到剪贴板！\n\n' + formattedParams);
        
        showLevelComplete();
    });
    
    // 应用速度按钮事件
    applySpeedBtn.addEventListener('click', () => {
        if (selectedObstacle) {
            const newSpeed = parseFloat(speedInput.value);
            if (!isNaN(newSpeed) && newSpeed > 0) {
                selectedObstacle.speed = newSpeed;
            }
        }
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
    
    // 显示所有按钮，以便用户可以选择进入测试关卡
    const addObstacleBtn = document.getElementById('addObstacleBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const completeBtn = document.getElementById('completeBtn');
    const controls = document.querySelector('.controls');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const menuBtn = document.getElementById('menuBtn');
    addObstacleBtn.style.display = 'block';
    pauseBtn.style.display = 'block';
    completeBtn.style.display = 'block';
    controls.style.position = 'relative';
    controls.style.marginTop = '20px';
    controls.style.left = 'auto';
    controls.style.right = 'auto';
    controls.style.bottom = 'auto';
    controls.style.justifyContent = 'center';
    leftBtn.style.position = 'static';
    rightBtn.style.position = 'static';
    menuBtn.style.position = 'static';
    leftBtn.style.transform = 'none';
    rightBtn.style.transform = 'none';
    menuBtn.style.transform = 'none';
    leftBtn.style.flex = '1';
    rightBtn.style.flex = '1';
    menuBtn.style.flex = '1';
    leftBtn.style.width = '80px';
    rightBtn.style.width = '80px';
    menuBtn.style.width = '80px';
    leftBtn.style.height = 'auto';
    rightBtn.style.height = 'auto';
    leftBtn.style.borderRadius = '5px';
    rightBtn.style.borderRadius = '5px';
    leftBtn.style.fontSize = '14px';
    rightBtn.style.fontSize = '14px';
    menuBtn.style.fontSize = '14px';
    leftBtn.style.padding = '2.5px 15px';
    rightBtn.style.padding = '2.5px 15px';
    menuBtn.style.padding = '2.5px 15px';
    leftBtn.style.backgroundColor = '#3498db';
    rightBtn.style.backgroundColor = '#3498db';
    leftBtn.style.order = '1';
    rightBtn.style.order = '2';
    menuBtn.style.order = '3';
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
    // 清空障碍物
    obstacles.length = 0;
    // 隐藏速度输入框
    speedInputContainer.style.display = 'none';
    // 重置选中状态
    selectedObstacle = null;
    isDragging = false;
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

// 创建碰撞效果
function createCollisionEffect(x, y, color) {
    collisionEffect = {
        x: x,
        y: y,
        color: color,
        particles: [],
        startTime: Date.now(),
        duration: 1000 // 碰撞效果持续时间（毫秒）
    };
    
    // 创建粒子
    for (let i = 0; i < 15; i++) {
        collisionEffect.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 4 + 2,
            alpha: 1,
            decay: 0.02
        });
    }
}

// 绘制碰撞效果
function drawCollisionEffect(deltaTime) {
    if (!collisionEffect) return;
    
    // 更新粒子
    for (let i = collisionEffect.particles.length - 1; i >= 0; i--) {
        const particle = collisionEffect.particles[i];
        
        // 更新位置
        particle.x += particle.vx * 60 * deltaTime;
        particle.y += particle.vy * 60 * deltaTime;
        
        // 更新透明度
        particle.alpha -= particle.decay * 60 * deltaTime;
        
        // 绘制粒子
        ctx.fillStyle = `rgba(${collisionEffect.color}, ${particle.alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        
        // 移除透明度为负的粒子
        if (particle.alpha <= 0) {
            collisionEffect.particles.splice(i, 1);
        }
    }
    
    // 检查是否结束
    if (Date.now() - collisionEffect.startTime > collisionEffect.duration || collisionEffect.particles.length === 0) {
        collisionEffect = null;
    }
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
    // 重置碰撞状态
    isColliding = false;
    collisionEffect = null;
    // 重置拖拽状态
    selectedObstacle = null;
    isDragging = false;
    // 隐藏速度输入框
    speedInputContainer.style.display = 'none';
    
    // 根据关卡类型显示或隐藏测试相关按钮
    const addObstacleBtn = document.getElementById('addObstacleBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const completeBtn = document.getElementById('completeBtn');
    const controls = document.querySelector('.controls');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const menuBtn = document.getElementById('menuBtn');
    
    if (currentLevel === 3) { // 测试关卡
        addObstacleBtn.style.display = 'block';
        pauseBtn.style.display = 'block';
        completeBtn.style.display = 'block';
        controls.style.position = 'relative';
        controls.style.marginTop = '20px';
        controls.style.left = 'auto';
        controls.style.right = 'auto';
        controls.style.bottom = 'auto';
        controls.style.justifyContent = 'center';
        leftBtn.style.position = 'static';
        rightBtn.style.position = 'static';
        menuBtn.style.position = 'static';
        leftBtn.style.transform = 'none';
        rightBtn.style.transform = 'none';
        menuBtn.style.transform = 'none';
        leftBtn.style.flex = '1';
        rightBtn.style.flex = '1';
        menuBtn.style.flex = '1';
        leftBtn.style.width = '80px';
        rightBtn.style.width = '80px';
        menuBtn.style.width = '80px';
        leftBtn.style.height = 'auto';
        rightBtn.style.height = 'auto';
        leftBtn.style.borderRadius = '5px';
        rightBtn.style.borderRadius = '5px';
        leftBtn.style.fontSize = '14px';
        rightBtn.style.fontSize = '14px';
        menuBtn.style.fontSize = '14px';
        leftBtn.style.padding = '2.5px 15px';
        rightBtn.style.padding = '2.5px 15px';
        menuBtn.style.padding = '2.5px 15px';
        leftBtn.style.backgroundColor = '#3498db';
        rightBtn.style.backgroundColor = '#3498db';
        leftBtn.style.order = '1';
        rightBtn.style.order = '2';
        menuBtn.style.order = '3';
    } else { // 正常关卡
        addObstacleBtn.style.display = 'none';
        pauseBtn.style.display = 'none';
        completeBtn.style.display = 'none';
        controls.style.position = 'absolute';
        controls.style.marginTop = '0';
        controls.style.left = '20px';
        controls.style.right = '20px';
        controls.style.bottom = '20px';
        controls.style.zIndex = '10';
        leftBtn.style.position = 'absolute';
        rightBtn.style.position = 'absolute';
        menuBtn.style.position = 'absolute';
        leftBtn.style.left = '0';
        rightBtn.style.right = '0';
        menuBtn.style.left = '50%';
        menuBtn.style.transform = 'translateX(-50%)';
        leftBtn.style.width = '60px';
        rightBtn.style.width = '60px';
        menuBtn.style.width = '100px';
        leftBtn.style.height = '60px';
        rightBtn.style.height = '60px';
        leftBtn.style.borderRadius = '50%';
        rightBtn.style.borderRadius = '50%';
        menuBtn.style.borderRadius = '5px';
        leftBtn.style.fontSize = '18px';
        rightBtn.style.fontSize = '18px';
        menuBtn.style.fontSize = '18px';
        leftBtn.style.padding = '0';
        rightBtn.style.padding = '0';
        menuBtn.style.padding = '5px 15px';
        leftBtn.style.backgroundColor = 'rgba(52, 152, 219, 0.8)';
        rightBtn.style.backgroundColor = 'rgba(52, 152, 219, 0.8)';
        menuBtn.style.backgroundColor = '#3498db';
        leftBtn.style.zIndex = '11';
        rightBtn.style.zIndex = '11';
        menuBtn.style.zIndex = '11';
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
        
        // 更新障碍物位置
        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obstacle = obstacles[i];
            
            // 更新障碍物位置
            obstacle.update(deltaTime);
            
            // 检查是否移出屏幕（只在非测试关卡中销毁障碍物）
            if (obstacle.isOffScreen(canvas.height) && currentLevel !== 3) {
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
        
        // 根据时间差更新角度，确保速度与帧率无关
        angle += rotationSpeed * 60 * deltaTime; // 60是目标帧率
    }
    
    // 绘制障碍物（即使游戏停止也要绘制）
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.draw(ctx);
        
        // 为选中的障碍物添加高亮效果
        if (!isGameRunning && selectedObstacle === obstacle) {
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 2;
            ctx.strokeRect(obstacle.x - 2, obstacle.y - 2, obstacle.width + 4, obstacle.height + 4);
        }
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
    
    // 检测碰撞（仅在未碰撞状态且游戏运行时检测）
    if (!isColliding && isGameRunning) {
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];
            // 检测红球与障碍物碰撞
            if (checkCollision(redBallX, redBallY, ballRadius, obstacle)) {
                createCollisionEffect(redBallX, redBallY, '246, 2, 2'); // 红色粒子
                isColliding = true; // 设置碰撞标志
                isGameRunning = false; // 停止游戏运动
                
                // 测试关卡只暂停，不结束游戏
                if (currentLevel !== 3) {
                    // 延迟1秒显示游戏结束页面，让碰撞动画播放完整
                    setTimeout(showGameOver, 1000);
                } else {
                    // 测试关卡只暂停，重置碰撞状态
                    setTimeout(() => {
                        isColliding = false;
                    }, 1000);
                }
                break;
            }
            // 检测蓝球与障碍物碰撞
            if (checkCollision(blueBallX, blueBallY, ballRadius, obstacle)) {
                createCollisionEffect(blueBallX, blueBallY, '0, 28, 255'); // 蓝色粒子
                isColliding = true; // 设置碰撞标志
                isGameRunning = false; // 停止游戏运动
                
                // 测试关卡只暂停，不结束游戏
                if (currentLevel !== 3) {
                    // 延迟1秒显示游戏结束页面，让碰撞动画播放完整
                    setTimeout(showGameOver, 1000);
                } else {
                    // 测试关卡只暂停，重置碰撞状态
                    setTimeout(() => {
                        isColliding = false;
                    }, 1000);
                }
                break;
            }
        }
    }
    
    // 绘制碰撞效果（即使游戏停止也要绘制）
    drawCollisionEffect(deltaTime);
    
    // 绘制关卡信息（即使游戏停止也要绘制）
    if (isGameRunning || isColliding) {
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`关卡: ${currentLevel + 1}/${levels.length}`, 10, 30);
    }
    
    // 循环调用draw函数
    requestAnimationFrame(draw);
}

// 启动游戏
init();
