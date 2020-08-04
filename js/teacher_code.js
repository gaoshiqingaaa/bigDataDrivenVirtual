var version = '# version: Python3\n\n'
var codeAreaTip = "# please edit your code here:\n"
var codeStart = '# code start \n\t\n'
var codeEnd = '# code end \n\n'
var codeTip = "'''\nThis function is the entry of this program\n'''\n"
var code = 'def solution():\n\tpass'
var initValue = version + codeAreaTip + codeStart + codeEnd + codeTip + code

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
    6: `risk_aversion = 3
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
        6: `risk_aversion = 3
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
code_in.setSize('100%','570px'); //宽 高
code_in.setOption('value', codes[0])
// code_in.on('keypress', function() {
//     code_in.showHint()
// })

// var code_out = CodeMirror.fromTextArea(document.getElementById("code-out"), {
//     mode: {
//         name: 'python'
//     },
//     lineNumbers: true,
//     theme: "idea",	//设置主题
//     // lineWrapping: true,	//代码折叠
//     foldGutter: true,
//     gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
//     matchBrackets: true,	//括号匹配
//     readOnly: true,        //只读
//     scrollbarStyle: 'simple',
// });
// code_out.setSize('100%','570px'); //宽 高 570
var tt
var xishu_html
var six_best_weight = {}
$('.run-code').click(function(){
    $.ajax({
        type: 'POST',
        url: 'http://47.97.205.240:8800/code',
        // url: 'http://localhost:5000/code',
        data: {
            user: user,
            step: current_page,
            // step: 0, //测试用
            code: code_in.getValue().trim() + '\n'
        },
        success: function(data){
            tt = data
            result = data.result
            html = ''
            for (i = 0; i < result.length; i++){
                if (result[i][0].trim() != ''){
                    html += '<tr>'
                    if (i==0 && (current_page == 3 || current_page == 6)){
                        html += '<td></td>'
                    }
                    for (j = 0; j <result[i].length; j++){
                        html += '<td>' + result[i][j] + '</td>'
                    }
                    html += '</tr>'
                }
            }
            if (current_page == 3)
                xishu_html = html
            html += '<tr><td>运行完成！</td></tr>'
            $('#result-tbody').html(html)
            if (current_page == 5) {
                for (i = 0; i < data.files.length; i++) {
                    if (data.files[i] == '/static/' + user + '/5.png') {
                        $('.img_box').css({                            
                            'background': 'url("http://47.97.205.240:8800/static/' + user + '/5.png") no-repeat center top',
                            'background-size': 'cover'
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
                                $('.layui-layer-btn').css({'padding-right': '46%'})
                            }
                        });
                    }
                }
            }else if (current_page == 3) {
                tt = data.result
                layer.open({
                    type: 2,
                    area: ['900px', '570px'], 
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
                        $('.layui-layer-btn').css({'padding-right': '46%'})
                    }
                });
            } else if (current_page == 6) {
                for (i=1;i<result.length-2;i++){
                    if (result[i][1] != 0)
                        six_best_weight[result[i][0]] = result[i][1]
                }
                // for (i=1;i<7;i++){
                //     temp = result[i].split(' ')
                //     if (temp[temp.length-1] != 0)
                //         six_best_weight[temp[0]] = temp[temp.length-1]
                // }
                init_pie()
                pie.setOption(pie_option);
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
                        $('.layui-layer-btn').css({'padding-right': '39%'})
                    }
                });
            }
        }   
    })
})