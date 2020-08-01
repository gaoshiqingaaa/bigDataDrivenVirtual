var pie = echarts.init(document.getElementById('pie'));
var line_smooth = echarts.init(document.getElementById('line-smooth'));
var pie_option = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: ['创业板', '中证500', '标普500']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '30',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {value: 0.65, name: '创业板'},
                {value: 0.25, name: '中证500'},
                {value: 0.13, name: '标普500'},
            ]
        }
    ]
};
var line_smooth_option = {
    xAxis: {
        type: 'category',
        data: ['06-29', '', '', '', 
                '06-30', '', '', '', 
                '07-01', '', '', '', 
                '07-02', '', '', '', 
                '07-03', '', '', '', 
                '07-04', '', '', '', 
                '07-05', '', '', '', ]
    },
    yAxis: {
        type: 'value',
        min: -0.77,
        max: 0.77,
        interval: 0.5,
        splitLine:{
            show:false
        },
        // axisLine: {
        //     show: false
        // }
    },
    series: [{
        data: [-0.17, 0.2, 0.05, -0.04,
               -0.16, -0.05, -0.2, 0.25, 
               0.23, 0.25, 0.244, 0.34,
               0.24, 0.23, 0.22, 0.2,
               0.55, 0.25, -0.23, 0.1,
               0.23, 0, -0.15, -0.2, 
               0, 0.1, 0.2, 0.3],
        type: 'line',
        smooth: true,
        emphasis: {
            label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
            }
        },
    }]
};

    // 使用刚指定的配置项和数据显示图表。
pie.setOption(pie_option);
line_smooth.setOption(line_smooth_option)

   
