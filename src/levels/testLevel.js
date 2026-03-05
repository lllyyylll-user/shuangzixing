// 测试关卡数据
const testLevel = {
    obstacles: [], // 初始无障碍物
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
    module.exports = testLevel;
} else if (typeof window !== 'undefined') {
    window.testLevel = testLevel;
}