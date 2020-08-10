var pie = echarts.init(document.getElementById('pie'));
var pie1 = echarts.init(document.getElementById('pie1'));
var line_smooth = echarts.init(document.getElementById('line-smooth'));

var pie_legend_data = [], pie_series_data = []
function init_pie() {
    for (key in six_best_weight){
        console.log(six_best_weight);
        pie_legend_data.push(key + '\t' + six_best_weight[key] + '%')
        pie_series_data.push({
            'value': six_best_weight[key],
            'name': key + '\t' + six_best_weight[key] + '%'
        })
    }
}

var pie_option = {
    tooltip: {
        trigger: 'item',
        formatter: '{b}'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: pie_legend_data
    },
    series: [
        {
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
                    fontSize: '15',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: pie_series_data
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

line_smooth.setOption(line_smooth_option)

   
