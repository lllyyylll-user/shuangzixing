// 关卡1数据
const level1 = {
    obstacles: [
         { width: 200, height: 20, x: 2, y: 0, speed: 1.5 },
         { width: 290, height: 20, x: 135, y: -171, speed: 1.5 },
         { width: 215, height: 20, x: 3, y: -303, speed: 1.5 },
         { width: 235, height: 20, x: 140, y: -466, speed: 1.5 },
         { width: 195, height: 20, x: 3, y: -609, speed: 1.5 },
         { width: 230, height: 20, x: 130, y: -764, speed: 1.5 },
         { width: 210, height: 20, x: 2, y: -908, speed: 1.5 },
         { width: 70, height: 115, x: 7, y: -1234, speed: 1.5 },
         { width: 75, height: 110, x: 283, y: -1231, speed: 1.5 },
         { width: 100, height: 105, x: 132, y: -1231, speed: 1.5 },
         { width: 205, height: 20, x: 153, y: -1505, speed: 1.5 },
         { width: 100, height: 20, x: 271, y: -1391, speed: 1.5 },
         { width: 200, height: 20, x: 7, y: -1392, speed: 1.5 },
         { width: 80, height: 20, x: 5, y: -1510, speed: 1.5 },
         { width: 70, height: 20, x: 149, y: -1189, speed: 1.5 },
         { width: 210, height: 20, x: 149, y: -1036, speed: 1.5 }
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
