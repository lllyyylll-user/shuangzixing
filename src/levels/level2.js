// 关卡2数据
const level2 = {
    obstacles: [
        { width: 50, height: 20, x: 30, y: -20, speed: 2 },
        { width: 70, height: 20, x: 150, y: -150, speed: 2 },
        { width: 90, height: 20, x: 80, y: -250, speed: 2 },
        { width: 60, height: 20, x: 120, y: -350, speed: 2 }
    ],
    stars: {
        count: 60,
        minSize: 0.5,
        maxSize: 2.5,
        minSpeed: 0.8,
        maxSpeed: 1.8
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = level2;
} else if (typeof window !== 'undefined') {
    window.level2 = level2;
}
