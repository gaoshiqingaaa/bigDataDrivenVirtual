var pie = echarts.init(document.getElementById('pie'));
var pie1 = echarts.init(document.getElementById('pie1'));
var line_smooth = echarts.init(document.getElementById('line-smooth'));

var pie_legend_data, pie_series_data
function init_pie() {
    pie_legend_data = [], pie_series_data = []
    for (key in six_best_weight){
        // console.log(six_best_weight);
        pie_legend_data.push(key + '\t' + six_best_weight[key] + '%')
        pie_series_data.push({
            'value': six_best_weight[key],
            'name': key + '\t' + six_best_weight[key] + '%'
        })
    }
    pie_option.legend.data = pie_legend_data
    pie_option.series[0].data = pie_series_data
}

var line_smooth_legend_data, line_smooth_series_data
function init_line_smooth(step) {
    line_smooth_legend_data = [], line_smooth_series_data = []
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8800/echartsData',
        data: {
            step: step,
            weight: JSON.stringify(six_best_weight_code)
        },
        success: function(data){
            line_smooth_option.xAxis.data = data.label
            line_smooth_option.series[0].data = data.data
            line_smooth_option.yAxis.min = data.min - 1
            line_smooth_option.yAxis.max = data.max + 1
            line_smooth.setOption(line_smooth_option)
        }
    
    })

}
var pie_option = {
    tooltip: {
        trigger: 'item',
        formatter: '{b}'
    },
    legend: {
        orient: 'vertical',
        left: 10,
        data: pie_legend_data,
        left: "80%",
        top: "10%",
    },
    series: [
        {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ["5%", "35%"], 
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
            center: ["50%", "38%"], 
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
        // data: ['06-29', '', '', '', 
        //         '06-30', '', '', '', 
        //         '07-01', '', '', '', 
        //         '07-02', '', '', '', 
        //         '07-03', '', '', '', 
        //         '07-04', '', '', '', 
        //         '07-05', '', '', '', ]
        data: []
    },
    yAxis: {
        type: 'value',
        min: -0.77,
        max: 0.77,
        interval: 1,
        splitLine:{
            show:false
        },
        // axisLine: {
        //     show: false
        // }
    },
    series: [{
        data: [],
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
