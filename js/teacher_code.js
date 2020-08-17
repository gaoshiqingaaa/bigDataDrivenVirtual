function getRiskAversion() {
    var risk_score = {}
    var risk_aversion = 0
    if (isTeacher)
        risk_score = localStorage.getItem('Grades')
    else
        risk_score = localStorage.getItem('aGrades')
    if (risk_score != null) {
        risk_score = JSON.parse(risk_score).number
        risk_aversion = (84 - risk_score) / (84 - 7) * (6 - 3) + 3
    }
    return risk_aversion.toFixed(2)
}
if (window.location.href.indexOf('teacher') != -1){
    codes = {
        0: `import csv
import numpy as np
import pandas as pd
from pandas import DataFrame, Series
from matplotlib import pyplot as plt

# 这里改成自己本地数据包的位置
PERFIX = './fin_data/'

def get_return(ticker):
    tmp_lst = []
    fname = PERFIX + 'data_'+ticker+'.csv'
# please edit your code here:
# code start

# code end

print(rtn_table.head(10))
`,
    1: "print(rtn_table.mean() * 250) #关于代码的注释\n",
    2: "print(rtn_table.std() * np.sqrt(250))\n",
    3: "print(rtn_table.corr())\n",
    4: `from cvxopt import matrix,solvers

portfolio1 = [0,1,2,4,5] 
portfolio2 = range(6)
cov_mat = rtn_table.cov() * 250
exp_rtn = rtn_table.mean() * 250
    
def cal_efficient_frontier(portfolio):
    
    if len(portfolio) <=2 or len(portfolio) > 6: 
        raise Exception('portfolio必须为长度大于2小于7的list！')
    #print(cov_mat)
    cov_mat1 = cov_mat.iloc[portfolio,portfolio]
    exp_rtn1 = exp_rtn.iloc[portfolio]
    max_rtn = max(exp_rtn1)
    min_rtn = min(exp_rtn1)
    risks = []
    returns = []
    
    for level_rtn in np.linspace(min_rtn, max_rtn, 20):
        sec_num = len(portfolio)
        P = 2 * matrix(cov_mat1.values)
        q = matrix(np.zeros(sec_num))
        G = matrix(np.diag(-1 * np.ones(sec_num)))
        h = matrix(0.0, (sec_num,1))
        A = matrix(np.matrix([np.ones(sec_num),exp_rtn1.values]))
        b = matrix([1.0,level_rtn])
        solvers.options['show_progress'] = False
        sol = solvers.qp(P,q, G, h, A, b)
        risks.append(sol['primal objective'])
        returns.append(level_rtn)
    return np.sqrt(risks), returns
    
    
risk1, return1 = cal_efficient_frontier(portfolio1)
risk2, return2 = cal_efficient_frontier(portfolio2)
`,
    5: `fig = plt.figure(figsize = (14,8))
ax1 = fig.add_subplot(111)
ax1.plot(risk1,return1)
ax1.plot(risk2,return2) 
ax1.set_title('Efficient Frontier', fontsize = 14)
ax1.set_xlabel('Standard Deviation', fontsize = 12)
ax1.set_ylabel('Expected Return', fontsize = 12)
ax1.tick_params(labelsize = 12)
ax1.legend(['portfolio1','portfolio2'], loc = 'best', fontsize = 14)
`,
    6: `risk_aversion = ` + getRiskAversion() + `
P = risk_aversion * matrix(cov_mat.values)
q = -1 * matrix(exp_rtn.values)
G = matrix(np.vstack((np.diag(np.ones(len(exp_rtn))),np.diag(-np.ones(len(exp_rtn))))))
h = matrix(np.array([np.ones(len(exp_rtn)),np.zeros(len(exp_rtn))]).reshape(len(exp_rtn)*2,1))
A = matrix(np.ones(len(exp_rtn)),(1,len(exp_rtn)))
b = matrix([1.0])
solvers.options['show_progress'] = False
sol = solvers.qp(P,q, G, h, A, b)
print(DataFrame(index=exp_rtn.index,data = np.round(sol['x'],2), columns = ['weight']))  # 权重精确到小数点后两位    
`
    }
} else if (window.location.href.indexOf('assets') != -1) {
    risk_score = JSON.parse(localStorage.getItem('aGrades')).number
    risk_aversion = (84 - risk_score) / (84 - 7) * (6 - 3) + 3
    codes = {
        0: `import csv
import numpy as np
import pandas as pd
from pandas import DataFrame, Series
from matplotlib import pyplot as plt

# 这里改成自己本地数据包的位置
PERFIX = './fin_data/'

def get_return(ticker):
    tmp_lst = []
    fname = PERFIX + 'data_'+ticker+'.csv'
# please edit your code here:
# code start

# code end

print(rtn_table.head(10))
`,
        1: '',
        2: '',
        3: 'print(rtn_table.corr())',
        4: '',
        5: '#绘出efficient frontier',
        6: `risk_aversion = ` + getRiskAversion() + `
P = risk_aversion * matrix(cov_mat.values)
q = -1 * matrix(exp_rtn.values)
G = matrix(np.vstack((np.diag(np.ones(len(exp_rtn))),np.diag(-np.ones(len(exp_rtn))))))
h = matrix(np.array([np.ones(len(exp_rtn)),np.zeros(len(exp_rtn))]).reshape(len(exp_rtn)*2,1))
A = matrix(np.ones(len(exp_rtn)),(1,len(exp_rtn)))
b = matrix([1.0])
solvers.options['show_progress'] = False
sol = solvers.qp(P,q, G, h, A, b)
print(DataFrame(index=exp_rtn.index,data = np.round(sol['x'],2), columns = ['weight']))  # 权重精确到小数点后两位    
`
    }
}

var code_in = CodeMirror.fromTextArea(document.getElementById("code-in"), {
    mode: {
        name: 'python'
    },
    scrollbarStyle: 'simple',
    lineNumbers: true,
    theme: "idea",	//设置主题
    // keyMap: "sublime",
    smartIndent: true,
    indentUnit: 4,
    // lineWrapping: true,	//代码折叠
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autofocus: true,
    matchBrackets: true,	//括号匹配
    autoCloseBrackedt: true,
    styleActiveLine: true
});
code_in.setSize('100%','100%'); //宽 高
code_in.setOption('value', codes[0])

var tt
var xishu_html = ''
var six_best_weight = {}
var isTeacher = window.location.href.indexOf('assets') == -1
const name_code = {
    '000300.ZICN': '沪深300',
    '000905.ZICN': '中证500',
    '399006.ZICN': '创业板',
    'SPX.ZIUS': '标普500',
    '000012.ZICN': '上证国债',
    '000013.ZICN': '上证企业债',
}
var step_score = {}
for (i = 0; i < 7; i++) {
    step_score[i] = 0
}

$('.run-code').click(function(){
    code = code_in.getValue().trim()
    if (code == '') {
        html = '<tr style="text-align: center;color: red"><td colspan=7>代码输入不能为空，请先填写代码!</td></tr>'
        $('#result-tbody').html(html)
        return
    } else {
        code += '\n'
    }
    $.ajax({
        type: 'POST',
        url: 'http://47.97.205.240:8800/code',
        // url: 'http://localhost:5000/code',
        data: {
            user: user,
            step: current_page,
            // step: 0, //测试用
            code: code
        },
        success: function(data){
            tt = data
            run_code_clicked[current_page] = true
            result = data.result
            html = ''
            if (data.iserr == 0) {
                step_score[current_page] = 10
                for (i = 0; i < result.length; i++){
                    if (result[i][0].trim() != ''){
                        html += '<tr  style="text-align: center">'
                        if (i==0 && (current_page == 3 || current_page == 6 || current_page == 0)){
                            html += '<td></td>'
                        }
                        for (j = 0; j <result[i].length; j++){
                            if (current_page == 0 && i != 0) {
                                if (j == 0) {
                                    html += '<td>' + result[i][j] + ' ' + result[i][j+1] + '</td>'
                                    continue
                                } else if (j == 1){
                                    continue
                                }
                            }
                            html += '<td>' + result[i][j] + '</td>'
                        }
                        html += '</tr>'
                    }
                }
                html += '<tr style="text-align: center"><td colspan=7>运行完成！</td></tr>'
                if (current_page == 5) {
                    for (i = 0; i < data.files.length; i++) {
                        if (data.files[i] == '/static/' + user + '/5.png') {
                            $('.img_box').css({                            
                                'background': 'url("http://47.97.205.240:8800/static/' + user + '/5.png") no-repeat center top',
                                'background-size': '614px 451px'
                            })
                            layer.open({
                                type: 2,
                                area: ['600px', '370px'], 
                                title: false,
                                closeBtn: 1,
                                shadeClose: true,
                                skin: '',
                                content: '5-run-code.html',
                                btn: ['知道了'],
                                success: function(elem) {
                                    $(".layui-layer-setwin .layui-layer-close2").css({
                                        'right': '3px',
                                        'top': '1px',
                                        'background-position': '30px -32px'
                                    })
                                    $('.layui-layer-setwin a').append('X')
                                    $('.layui-layer-setwin a').css({
                                        'font-size': '27px',
                                        'color': 'white'
                                    })
                                    alertBtnArgs()
                                    $('.layui-layer-iframe').css({'border-radius': '16px'})
                                },
                            });
                            break
                        }
                    }
                }else if (current_page == 3) {
                    xishu_html = html.split('<tr style="text-align: center"><td colspan=7>运行完成！</td></tr>')[0]
                    if (isTeacher) {
                        layer.open({
                            type: 2,
                            area: ['900px', '600px'], 
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            skin: '',
                            content: '4-run-code.html',
                            btn: ['知道了'],
                            success: function(elem) {
                                $(".layui-layer-setwin .layui-layer-close2").css({
                                    'right': '3px',
                                    'top': '1px',
                                    'background-position': '30px -32px'
                                })
                                $('.layui-layer-setwin a').append('X')
                                $('.layui-layer-setwin a').css({
                                    'font-size': '27px',
                                    'color': 'white'
                                })
                                alertBtnArgs()
                                $('.layui-layer-btn').css({
                                    'bottom': '3%',
                                })
                                $('.layui-layer-iframe').css({'border-radius': '21px'})
                            }
                        });
                    }
                } else if (current_page == 6) {
                    for (i=1;i<result.length-2;i++){
                        // if (result[i][1] != 0)
                            six_best_weight[name_code[result[i][0]]] = Math.round(result[i][1] * 100)
                    }
                    init_pie()
                    pie.setOption(pie_option);
                    if (isTeacher) {
                        layer.open({
                            type: 2,
                            area: ['400px', '250px'], 
                            title: false,
                            closeBtn: 1,
                            shadeClose: true,
                            skin: '',
                            content: ['6-run-code.html','no'],
                            btn: ['知道了'],
                            success: function(elem) {
                                $(".layui-layer-setwin .layui-layer-close2").css({
                                    'right': '3px',
                                    'top': '-7px',
                                    'background-position': '30px -32px'
                                })
                                $('.layui-layer-setwin a').append('X')
                                $('.layui-layer-setwin a').css({
                                    'font-size': '27px',
                                    'color': 'white'
                                })
                                $('.layui-layer-iframe').css({'border-radius': '12px'})
                                alertBtnArgs()
                            }
                        });
                    }
                }
            } else if (data.iserr == -1) {
                html += '<tr style="text-align: center;color: red"><td colspan=7>代码输入错误，请重新输入!</td></tr>'
            }
            $('#result-tbody').html(html)
        }   
    })
})