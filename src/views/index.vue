<!-- Author: qht -->
<!-- Date: 2025-03-16 -->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import {
    ElRow,
    ElCol,
    ElCard,
    ElStatistic,
    ElButton,
    ElProgress
} from 'element-plus'
import {
    UserFilled,
    Coin,
    DataLine,
    Operation
} from '@element-plus/icons-vue'
import { useResizeObserver } from '@vueuse/core'

// 统计卡片数据
const statsData = ref([
    { title: '注册用户', value: 24567, unit: '人', icon: UserFilled, trend: 'up', rate: 12.5 },
    { title: '碳积分总量', value: 1568924, unit: '分', icon: Coin, trend: 'up', rate: 8.3 },
    { title: '减排总量', value: 158.7, unit: '吨', icon: DataLine, trend: 'down', rate: 4.2 },
    { title: '活动参与率', value: 78.5, unit: '%', icon: Operation, trend: 'up', rate: 5.6 }
])

// 图表容器引用
const lineChartRef = ref(null)
const pieChartRef = ref(null)
const barChartRef = ref(null)
let lineChart, pieChart, barChart

// 图表颜色配置
const chartColors = [
    '#2d8cf0', '#19be6b', '#ff9900', '#ed4014',
    '#5cadff', '#2db7f5', '#d87a80', '#8d98b3'
]

// 初始化折线图
const initLineChart = () => {
    lineChart = echarts.init(lineChartRef.value)
    const option = {
        color: chartColors,
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: '#e4e7ed',
            borderWidth: 1,
            textStyle: { color: '#606266' }
        },
        grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
            axisLine: { lineStyle: { color: '#dcdfe6' } },
            axisTick: { show: false }
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#f0f2f5' } }
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1550],
            type: 'line',
            smooth: true,
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(45,140,240,0.6)' },
                    { offset: 1, color: 'rgba(45,140,240,0.05)' }
                ])
            },
            itemStyle: { color: '#2d8cf0', borderWidth: 3 },
            lineStyle: { width: 3 }
        }]
    }
    lineChart.setOption(option)
}

// 初始化饼图
const initPieChart = () => {
    pieChart = echarts.init(pieChartRef.value)
    const option = {
        color: chartColors,
        tooltip: { trigger: 'item' },
        legend: {
            orient: 'vertical',
            left: 'left',
            textStyle: { color: '#606266' }
        },
        series: [{
            type: 'pie',
            radius: ['45%', '70%'],
            avoidLabelOverlap: false,
            label: { show: false },
            emphasis: {
                label: { show: true, fontSize: 16 }
            },
            data: [
                { value: 1048, name: '绿色出行' },
                { value: 735, name: '节能减耗' },
                { value: 580, name: '资源回收' },
                { value: 484, name: '低碳消费' }
            ],
            itemStyle: {
                borderRadius: 6,
                borderColor: '#fff',
                borderWidth: 2,
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.1)'
            }
        }]
    }
    pieChart.setOption(option)
}

// 初始化柱状图
const initBarChart = () => {
    barChart = echarts.init(barChartRef.value)
    const option = {
        color: chartColors,
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        grid: { left: '3%', right: '4%', bottom: '8%', containLabel: true },
        xAxis: {
            type: 'category',
            data: ['华东', '华南', '华北', '西南', '西北'],
            axisTick: { show: false },
            axisLine: { lineStyle: { color: '#dcdfe6' } }
        },
        yAxis: {
            type: 'value',
            splitLine: { lineStyle: { color: '#f0f2f5' } }
        },
        series: [{
            data: [120, 200, 150, 80, 70],
            type: 'bar',
            barWidth: '40%',
            itemStyle: {
                borderRadius: [6, 6, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#2d8cf0' },
                    { offset: 1, color: '#57a3f3' }
                ]),
                shadowColor: 'rgba(45,140,240,0.3)',
                shadowBlur: 8
            }
        }]
    }
    barChart.setOption(option)
}

// 自适应调整图表
const resizeCharts = () => {
    lineChart?.resize()
    pieChart?.resize()
    barChart?.resize()
}

// 生命周期钩子
onMounted(() => {
    initLineChart()
    initPieChart()
    initBarChart()
    window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCharts)
    lineChart?.dispose()
    pieChart?.dispose()
    barChart?.dispose()
})
</script>

<template>
    <div class="dashboard-container">
        <el-row :gutter="20" class="mb-4">
            <el-col v-for="(item, index) in statsData" :key="index" :xs="24" :sm="12" :md="6">
                <el-card class="stats-card" shadow="hover">
                    <div class="card-header">
                        <component :is="item.icon" class="card-icon" :size="24" />
                        <div class="trend-indicator" :class="item.trend">
                            {{ item.trend === 'up' ? '↑' : '↓' }} {{ item.rate }}%
                        </div>
                    </div>
                    <el-statistic :title="item.title" :value="item.value" :precision="item.unit === '%' ? 1 : 0"
                        :suffix="item.unit" class="statistic-value" />
                    <el-progress :percentage="item.value" :stroke-width="2"
                        :color="item.trend === 'up' ? '#19be6b' : '#ed4014'" class="progress-bar" />
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :span="24" class="mb-4">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-title">
                            <el-icon :size="20" class="mr-2">
                                <DataLine />
                            </el-icon>
                            月度减排趋势分析
                        </div>
                        <el-button type="primary" size="small" @click="resizeCharts" class="refresh-btn">
                            <el-icon :size="16" class="mr-1">
                                <Refresh />
                            </el-icon>
                            刷新数据
                        </el-button>
                    </template>
                    <div ref="lineChartRef" class="chart-container"></div>
                </el-card>
            </el-col>

            <el-col :md="12" class="mb-4">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-title">
                            <el-icon :size="20" class="mr-2">
                                <PieChart />
                            </el-icon>
                            减排类型分布
                        </div>
                    </template>
                    <div ref="pieChartRef" class="chart-container"></div>
                </el-card>
            </el-col>

            <el-col :md="12" class="mb-4">
                <el-card class="chart-card">
                    <template #header>
                        <div class="card-title">
                            <el-icon :size="20" class="mr-2">
                                <Histogram />
                            </el-icon>
                            区域减排对比
                        </div>
                    </template>
                    <div ref="barChartRef" class="chart-container"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
    --base-spacing: 16px;
    padding: var(--base-spacing);
    background: #f5f7fa;

    .stats-card {
        position: relative;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-bottom: var(--base-spacing);
        min-height: 180px;

        .card-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 12px;

            .card-icon {
                width: 48px;
                height: 48px;
                padding: 8px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(45, 140, 240, 0.1);
                transition: background 0.3s;

                :deep(svg) {
                    width: 24px !important;
                    height: 24px !important;
                    transition: transform 0.3s;
                    color: #2d8cf0;
                }
            }

            .trend-indicator {
                font-size: 12px;
                padding: 4px 12px;
                border-radius: 16px;
                line-height: 1.2;
                backdrop-filter: blur(4px);

                &.up {
                    background: rgba(25, 190, 107, 0.12);
                    color: #19be6b;
                }

                &.down {
                    background: rgba(237, 64, 20, 0.12);
                    color: #ed4014;
                }
            }
        }

        .statistic-value {
            :deep(.el-statistic__content) {
                font-size: 20px;
                font-weight: 500;
                color: #303133;
                margin-top: 8px;
            }
        }

        .progress-bar {
            :deep(.el-progress-bar) {
                padding-right: 48px;
            }

            :deep(.el-progress__text) {
                font-size: 11px;
                letter-spacing: -0.5px;
            }
        }

        &:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 16px rgba(25, 190, 107, 0.12);

            .card-icon :deep(svg) {
                transform: scale(1.1);
            }
        }
    }

    .chart-card {
        border-radius: 12px;
        overflow: hidden;

        :deep(.el-card__header) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            border-bottom: 1px solid #e4e7ed;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(8px);

            .card-title {
                font-size: 14px;
                font-weight: 600;
                color: #303133;
                letter-spacing: 0.5px;
                display: flex;
                align-items: center;

                .el-icon {
                    margin-right: 8px;

                    :deep(svg) {
                        width: 20px !important;
                        height: 20px !important;
                    }
                }
            }
        }

        .chart-container {
            height: 380px;
            padding: 8px;
        }

        .refresh-btn {
            padding: 6px 12px;

            :deep(.el-icon) {
                vertical-align: -2px;
            }
        }
    }
}
</style>