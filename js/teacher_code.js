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

# 这里是数据包的位置
PERFIX = 'fin_data/'
# 这个方法接受数据集的部分名称，并且将数据集文件数据转换为dataframe对象
def get_return(ticker):
    tmp_lst = []
    fname = PERFIX + 'data_'+ticker+'.csv'
    with open(fname, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            tmp_lst.append(row)
    df = pd.DataFrame(tmp_lst[1:], columns=tmp_lst[0]) 
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.set_index("Date")
    #print(df)
    temp = df['Close'].astype('float64').pct_change().fillna(0.)
    return temp

# 程序开始，指定数据集文件，并创建一个空的DataFrame对象
secIDs = ['000300.ZICN','000905.ZICN','399006.ZICN','SPX.ZIUS','000012.ZICN','000013.ZICN']   
rtn_table = DataFrame()
# 依次处理数据集文件，将所有数据集文件整合拼接在一起
for secID in secIDs:
    # 请补全代码

    # 结束
    
rtn_table.fillna(0,inplace = True)

# 显示前十行数据
rtn_table.head(10)
`,
    1: `# 请补全代码

# 结束
`,
    2: `# 请补全代码

# 结束
`,
    3: `# 请补全代码

# 结束`,
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
    
    # 请补全代码




    # 结束
    
    
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
    6: `risk_aversion = 3
P = risk_aversion * matrix(cov_mat.values)
q = -1 * matrix(exp_rtn.values)
G = matrix(np.vstack((np.diag(np.ones(len(exp_rtn))),np.diag(-np.ones(len(exp_rtn))))))
h = matrix(np.array([np.ones(len(exp_rtn)),np.zeros(len(exp_rtn))]).reshape(len(exp_rtn)*2,1))
A = matrix(np.ones(len(exp_rtn)),(1,len(exp_rtn)))
b = matrix([1.0])
solvers.options['show_progress'] = False
sol = solvers.qp(P,q, G, h, A, b)
DataFrame(index=exp_rtn.index,data = np.round(sol['x'],2), columns = ['weight'])  # 权重精确到小数点后两位    
`
    }
} else if (window.location.href.indexOf('assets') != -1) {
    risk_score = localStorage.getItem('aGrades') == null? 3: JSON.parse(localStorage.getItem('aGrades')).number
    risk_aversion = (84 - risk_score) / (84 - 7) * (6 - 3) + 3
    codes = {
        0: `import csv
import numpy as np
import pandas as pd
from pandas import DataFrame, Series
from matplotlib import pyplot as plt

# 这里是数据包的位置
PERFIX = 'fin_data/'
# 这个方法接受数据集的部分名称，并且将数据集文件数据转换为dataframe对象
def get_return(ticker):
    tmp_lst = []
    fname = PERFIX + 'data_'+ticker+'.csv'
    with open(fname, 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            tmp_lst.append(row)
    df = pd.DataFrame(tmp_lst[1:], columns=tmp_lst[0]) 
    df['Date'] = pd.to_datetime(df['Date'])
    df = df.set_index("Date")
    #print(df)
    temp = df['Close'].astype('float64').pct_change().fillna(0.)
    return temp

    # 请补全代码
    
    
    
    
    
    

    # 结束
`,
        1: `# 请补全代码

# 结束`,
        2: `# 请补全代码

# 结束
        `,
        3: `# 请补全代码

# 结束`,
        4: `from cvxopt import matrix,solvers
# 请补全代码    














# 结束 `,
        5: `# 请补全代码    














# 结束 `,
        6: `risk_aversion = ` + getRiskAversion() + `
# 请补全代码








# 结束`
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
var six_best_weight_code = {}
var isTeacher = window.location.href.indexOf('assets') == -1
const name_code = {
    '000300.ZICN': '沪深300',
    '000905.ZICN': '中证500',
    '399006.ZICN': '创业板',
    'SPX.ZIUS': '标普500',
    '000012.ZICN': '上证国债',
    '000013.ZICN': '上证企业债',
}
var name_code_reverse = {}
for (var o in name_code) {
    name_code_reverse[name_code[o]] = o
}
var step_score = {}
for (i = 0; i < 7; i++) {
    step_score[i] = 0
}
function isInputEmpty(code) {
    if (isTeacher) {
        if (current_page == 5 || current_page == 6) {
            return false
        }
    }
    flag = true
    lines = code.split('\n')
    for (i = 0; i< lines.length; i++) {
        if (lines[i].trim() != '' && !lines[i].trim().startsWith('#') && codes[current_page].indexOf(lines[i].trim()) == -1) {
            flag = false
        } 
    }
    return flag
}

$('.run-code').click(function(){
    code = code_in.getValue().trim()
    if (isInputEmpty(code)) {
        errorAlert('代码输入不能为空，请先填写代码!')
        return
    } else {
        code += '\n'
    }
    $.ajax({
        type: 'POST',
        url: 'http://47.97.205.240:8800/code',
        // url: 'http://127.0.0.1:8800/code',
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
                if (!isTeacher) {
                    if (current_page == 5){
                        step_score[current_page] = 5
                    } else {
                        step_score[current_page] = 10
                    }
                }
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
                    if (isTeacher) {
                        btn = ['知道了']
                    } else {
                        btn = ['确定']
                    }
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
                                btn: btn,
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
                                        'bottom': '4%',
                                    })
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
                            six_best_weight_code [result[i][0]] = result[i][1]
                    }
                    init_pie()
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
            }
            $('#result-tbody').html(html)
            if (data.iserr == -1) {
                errorAlert('代码输入错误，请重新输入!')
            }
        }   
    })
})

function errorAlert(msg) {
    layer.msg(msg, {
            time: 1500,
            success: function() {
                $('.layui-layer-content').css({
                    'background-color': 'rgba(51, 51, 51, .9)'
                })
            }
        });
}