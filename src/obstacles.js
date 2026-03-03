// 矩形障碍物类
class Obstacle {
    constructor(width, height, x, y, speed) {
        this.width = width;   // 障碍物宽度
        this.height = height; // 障碍物高度
        this.x = x;           // 障碍物x坐标
        this.y = y;           // 障碍物y坐标
        this.speed = speed;   // 向下移动速度
    }
    
    // 更新障碍物位置
    update(deltaTime) {
        this.y += this.speed * 60 * deltaTime; // 根据时间差调整速度
    }
    
    // 绘制障碍物
    draw(ctx) {
        ctx.fillStyle = '#888'; // 障碍物颜色
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    // 检查是否移出屏幕
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight;
    }
}

// 关卡数据 - 从单独的文件加载
const levels = [
    window.level1 || [], // 关卡1
    window.level2 || [], // 关卡2
    window.level3 || []  // 关卡3
];

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Obstacle, levels };
} else if (typeof window !== 'undefined') {
    window.Obstacle = Obstacle;
    window.levels = levels;
}
