// 关卡3数据
const level3 = {
    obstacles: [
        { width: 40, height: 20, x: 20, y: -20, speed: 2.5 },
        { width: 80, height: 20, x: 180, y: -120, speed: 2.5 },
        { width: 70, height: 20, x: 50, y: -220, speed: 2.5 },
        { width: 90, height: 20, x: 100, y: -320, speed: 2.5 },
        { width: 50, height: 20, x: 150, y: -420, speed: 2.5 }
    ],
    stars: {
        count: 70,
        minSize: 0.5,
        maxSize: 2.5,
        minSpeed: 1.0,
        maxSpeed: 2.0
    }
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = level3;
} else if (typeof window !== 'undefined') {
    window.level3 = level3;
}
