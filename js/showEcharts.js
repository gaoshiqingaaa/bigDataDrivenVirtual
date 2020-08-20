var pie = echarts.init(document.getElementById('pie'));
var pie1 = echarts.init(document.getElementById('pie1'));
var line_smooth = echarts.init(document.getElementById('line-smooth'));

var pie_legend_data, pie_series_data
function init_pie() {
    pie_legend_data = [], pie_series_data = []
    for (key in six_best_weight){
        // console.log(six_best_weight);
        pie_legend_data.push(key + '\t' + (six_best_weight[key] <= 1? six_best_weight[key] * 100: six_best_weight[key]) + '%')
        pie_series_data.push({
            'value': (six_best_weight[key] <= 1? six_best_weight[key] * 100: six_best_weight[key]),
            'name': key + '\t' + (six_best_weight[key] <= 1? six_best_weight[key] * 100: six_best_weight[key]) + '%'
        })
    }
    pie_option.legend.data = pie_legend_data
    pie_option.series[0].data = pie_series_data
    pie.setOption(pie_option);
}
var money_info = {}
var line_smooth_legend_data, line_smooth_series_data
var setMoneyFlag = 0
function init_line_smooth(step, total_money) {
    line_smooth_legend_data = [], line_smooth_series_data = []
    $.ajax({
        type: 'POST',
        url: 'http://47.97.205.240:8800/echartsData',
        // url: 'http://127.0.0.1:5000/echartsData',
        data: {
            step: step,
            weight: JSON.stringify(six_best_weight_code),
            total_money: total_money
        },
        success: function(data){
            money_info['total_money'] = data.total_money
            money_info['new_earning'] = data.new_earning
            money_info['new_day'] = data.new_day
            money_info['leiji'] = data.leiji
            money_info['combination'] = data.data[data.data.length - 1]
            localStorage.setItem('leiji', data.leiji)
            if (setMoneyFlag != 0) {
                setMoney()
            }
            setMoneyFlag = 1
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
