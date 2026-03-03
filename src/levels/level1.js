// 关卡1数据
const level1 = {
    obstacles: [
        { width: 80, height: 20, x: 50, y: -20, speed: 1.5 },
        { width: 60, height: 20, x: 180, y: -100, speed: 1.5 },
        { width: 100, height: 20, x: 20, y: -200, speed: 1.5 }
    ],
    stars: {
        count: 50,
        minSize: 0.5,
        maxSize: 2.5,
        minSpeed: 0.5,
        maxSpeed: 1.5
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = level1;
} else if (typeof window !== 'undefined') {
    window.level1 = level1;
}
