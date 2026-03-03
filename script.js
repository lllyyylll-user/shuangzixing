// 获取Canvas元素和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏变量
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 150; // 旋转半径
const ballRadius = 20; // 球的半径
let angle = 0; // 初始角度
let rotationSpeed = 0; // 旋转速度

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
        rotationSpeed = -0.02; // 逆时针旋转
    });
    
    leftBtn.addEventListener('mouseup', () => {
        rotationSpeed = 0; // 停止旋转
    });
    
    leftBtn.addEventListener('mouseleave', () => {
        rotationSpeed = 0; // 停止旋转
    });
    
    // 左按钮触摸事件
    leftBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 阻止默认行为
        rotationSpeed = -0.02; // 逆时针旋转
    });
    
    leftBtn.addEventListener('touchend', (e) => {
        e.preventDefault(); // 阻止默认行为
        rotationSpeed = 0; // 停止旋转
    });
    
    // 右按钮事件
    rightBtn.addEventListener('mousedown', () => {
        rotationSpeed = 0.02; // 顺时针旋转
    });
    
    rightBtn.addEventListener('mouseup', () => {
        rotationSpeed = 0; // 停止旋转
    });
    
    rightBtn.addEventListener('mouseleave', () => {
        rotationSpeed = 0; // 停止旋转
    });
    
    // 右按钮触摸事件
    rightBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 阻止默认行为
        rotationSpeed = 0.02; // 顺时针旋转
    });
    
    rightBtn.addEventListener('touchend', (e) => {
        e.preventDefault(); // 阻止默认行为
        rotationSpeed = 0; // 停止旋转
    });
}

// 绘制函数
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制中心
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
    
    // 计算红球位置
    const redBallX = centerX + Math.cos(angle) * radius;
    const redBallY = centerY + Math.sin(angle) * radius;
    
    // 计算蓝球位置（与红球相差180度）
    const blueBallX = centerX + Math.cos(angle + Math.PI) * radius;
    const blueBallY = centerY + Math.sin(angle + Math.PI) * radius;
    
    // 绘制红球
    ctx.beginPath();
    ctx.arc(redBallX, redBallY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff0000';
    ctx.fill();
    ctx.closePath();
    
    // 绘制蓝球
    ctx.beginPath();
    ctx.arc(blueBallX, blueBallY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0000ff';
    ctx.fill();
    ctx.closePath();
    
    // 更新角度
    angle += rotationSpeed;
    
    // 循环调用draw函数
    requestAnimationFrame(draw);
}

// 启动游戏
init();
