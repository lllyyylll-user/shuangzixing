// 关卡1数据
const level1 = {
    obstacles: [
        { width: 60, height: 20, x: 120, y: -20, speed: 1.5 },
        { width: 80, height: 20, x: 40, y: -80, speed: 1.5 },
        { width: 50, height: 20, x: 180, y: -140, speed: 1.5 },
        { width: 70, height: 20, x: 60, y: -200, speed: 1.5 },
        { width: 90, height: 20, x: 20, y: -260, speed: 1.5 },
        { width: 40, height: 20, x: 160, y: -320, speed: 1.5 },
        { width: 85, height: 20, x: 30, y: -380, speed: 1.5 },
        { width: 55, height: 20, x: 140, y: -440, speed: 1.5 },
        { width: 65, height: 20, x: 80, y: -500, speed: 1.5 },
        { width: 75, height: 20, x: 50, y: -560, speed: 1.5 },
        { width: 45, height: 20, x: 170, y: -620, speed: 1.5 },
        { width: 95, height: 20, x: 10, y: -680, speed: 1.5 },
        { width: 50, height: 20, x: 120, y: -740, speed: 1.5 },
        { width: 80, height: 20, x: 60, y: -800, speed: 1.5 },
        { width: 60, height: 20, x: 140, y: -860, speed: 1.5 },
        { width: 70, height: 20, x: 30, y: -920, speed: 1.5 },
        { width: 55, height: 20, x: 160, y: -980, speed: 1.5 },
        { width: 85, height: 20, x: 40, y: -1040, speed: 1.5 },
        { width: 45, height: 20, x: 130, y: -1100, speed: 1.5 },
        { width: 90, height: 20, x: 20, y: -1160, speed: 1.5 },
        { width: 65, height: 20, x: 110, y: -1220, speed: 1.5 },
        { width: 75, height: 20, x: 50, y: -1280, speed: 1.5 },
        { width: 50, height: 20, x: 150, y: -1340, speed: 1.5 },
        { width: 80, height: 20, x: 70, y: -1400, speed: 1.5 },
        { width: 60, height: 20, x: 140, y: -1460, speed: 1.5 },
        { width: 40, height: 20, x: 30, y: -1520, speed: 1.5 },
        { width: 90, height: 20, x: 110, y: -1580, speed: 1.5 },
        { width: 55, height: 20, x: 60, y: -1640, speed: 1.5 },
        { width: 70, height: 20, x: 130, y: -1700, speed: 1.5 },
        { width: 85, height: 20, x: 40, y: -1760, speed: 1.5 }
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
