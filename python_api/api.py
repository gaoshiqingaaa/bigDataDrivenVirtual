# -*- coding: utf-8 -*-
"""
Created on Thu Jul 30 15:04:57 2020

@author: 28446
"""

import os
import re
import flask as f
import subprocess
import matplotlib
from flask_cors import CORS
from PIL import Image, ImageFont, ImageDraw
from flask_log_request_id import RequestID, current_request_id
from json import loads,dump, load
from run_code import CalWeight
import base64

matplotlib.use('Agg')

# if 'static' not in os.listdir('./'):
#     os.mkdir('static')
# if 'step' not in os.listdir('./'):
#     os.mkdir('step')


def txt2image(txt, log_id, step):
    txt_list = txt.split('\n')
    font = ImageFont.truetype("SIMKAI.TTF", 18)
    im = Image.new("RGB", (800, 25 * len(txt_list)), (255, 255, 255))
    dr = ImageDraw.Draw(im)
    hight = 0
    for k in txt_list:
        dr.text((0, hight), k, font=font, fill="black")
        hight += 20
    im.save('static/' + log_id + '_ima/' + step + '.jpg')
    return 'static/' + log_id + '_ima/' + step + '.jpg'


app = f.Flask(__name__)
RequestID(app)


# 跨域访问
@app.after_request
def af_request(resp):
    resp = f.make_response(resp)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET,POST'
    resp.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return resp


CORS(app, supports_credentials=True)


@app.route('/', methods=['get'])
def user_id():
    log_id = f.request.args.get('user')
    user = 'admin'
    if log_id in ['', 'vister', None]:
        log_id = str(current_request_id())
        user = 'vister'
    return f.jsonify({'user': log_id, 'type': user})


@app.route('/code', methods=['POST'])
def code():
    log_id = f.request.form.get('user')
    if log_id not in os.listdir('static'):
        os.mkdir('static/' + log_id)
    if log_id not in os.listdir('step'):
        os.mkdir('step/' + log_id)
    stp_path = 'step/' + log_id + '/'
    code_path = 'static/' + log_id + '/'
    res = {'user': log_id, 'safe': '', 'result': [], 'result_list': '', 'files': [], 'iserr': '0'}
    step = f.request.form.get('step')
    codes = f.request.form.get('code')
    if re.findall('cd|remove|rm -rf|pwd|kill|mkdir|system|popen', codes, re.I) != []:
        res['error'] = 'No permission!!!'
        res['safe'] = 'false'
        return res
    res['safe'] = 'true'
    with open(stp_path + step + '.py', 'w', encoding='utf-8') as stp:
        stp.write(codes)
    all_code = "import pandas as pd\n" \
               "pd.set_option('display.max_columns', None)\n" \
               "#pd.set_option('display.max_rows', None)\n" \
               "pd.set_option('display.width', 5000)\n"
    # 导入pandas
    # 设置显示所有列
    # 设置显示所有行（未启用）（删去开头的#可开启）
    for i in range(int(step) + 1):
        if str(i) + '.py' not in os.listdir(stp_path[:-1]):
            e = open(stp_path + str(i) + '.py', 'w', encoding='utf-8')
            e.close()
        with open(stp_path + str(i) + '.py', 'r', encoding='utf-8') as stp:
            stp_cod = stp.read()
            if re.findall('\.plot', stp_cod, re.S) != []:
                stp_cod += "\nplt.savefig('static/%s/%d.png')" % (log_id, i)
            if i == int(step):
                stp_cod = "\nprint('000-000-000-000-000')\n" + stp_cod
            all_code += stp_cod
    with open(stp_path + 'code.py', 'w', encoding='utf-8') as cod:
        cod.write(all_code)
    cmd = ["python", "%scode.py" % stp_path]
    subprc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output = subprc.communicate()
    result = output[0].decode().replace('\r', '').split('000-000-000-000-000\n')[-1]
    err = output[1].decode().replace('\r', '')
    if err != '':
        res['iserr'] = '-1'
        err = err.split('\n')[-2]
    res['result_list'] = result + '\n' + err
    with open('%s%s.txt' % (stp_path, step), 'w', encoding='utf-8') as rst:
        rst.write(res['result_list'])
    end_result = [b.split(' ') for b in result.split('\n')]
    for m in end_result:
        while '' in m:
            m.remove('')
    while [] in end_result:
        end_result[end_result.index([])] = ['']
    end_result.append([err])
    res['result'] = end_result
    if os.listdir(code_path[:-1]) != []:
        for k in os.listdir(code_path[:-1]):
            res['files'].append(f.url_for('static', filename=log_id + '/' + k))
    return f.jsonify(res)


@app.route('/delete', methods=['POST'])
def delete_img():
    log_id = f.request.form.get('user')
    if re.findall(r'cd |remove |rm -rf|pwd |kill |mkdir |system |popen ', log_id, re.I):
        print(re.findall(r'cd|remove|rm -rf|pwd|kill|mkdir|system|popen', log_id, re.I))
        result_code = -1
    else:
        result_code = os.system('rm -f static/{}/*'.format(log_id))
    return str(result_code)


@app.route('/result', methods=['POST'])
def get_result():
    log_id = f.request.form.get('user')
    stp_path = 'step/' + log_id
    name_code = {
        '0': '资产大类数据准备',
        '1': '计算年化收益率',
        '2': '计算年化标准差',
        '3': '相关性系数矩阵',
        '4': '构建组合的Effcient Frontier',
        '5': '计算资产配置权重',
        '6': '半年后总收益',
    }
    with open('step_score/' + log_id + '/step_score.json', 'r') as fp:
        step_score = load(fp)
    file_list = os.listdir(stp_path)
    file_list.remove('code.py')
    file_list = sorted(file_list)
    image_path = 'static/' + log_id + '_ima'
    if log_id + '_ima' not in os.listdir('static'):
        os.mkdir(image_path)
    result = {'datas': [], 'image': []}
    datas = []
    for i in range(len(file_list) // 2):
        if i <= 5:
            data = {'name': '', 'code': '', 'print': '', 'grade': ''}
            data['name'] = name_code[str(i)]
            if i == 5:  # 画图步骤不需要 i += 1
                i += 1
            data['grade'] = step_score[str(i)]
            with open(stp_path + '/' + str(i) + '.py', 'r', encoding='utf-8') as stp_code:
                path = txt2image(stp_code.read(), log_id, str(i) + '.py')
                with open(path, 'rb') as fp:
                    data['code'] = 'data:image/jpg;base64,' + str(base64.b64encode(fp.read()))[2: -1]
            with open(stp_path + '/' + str(i) + '.txt', 'r', encoding='utf-8') as stp_print:
                pri = stp_print.read()
                path = txt2image(pri, log_id, str(i) + '.txt')
                with open(path, 'rb') as fp:
                    data['print'] = 'data:image/jpg;base64,' + str(base64.b64encode(fp.read()))[2: -1]
        elif i == 6:
            data = {'name': name_code[str(i)], 'leiji': step_score['leiji']}
        datas.append(data)
    result['datas'] = datas
    code_path = 'static/' + log_id
    ima_list = os.listdir(code_path)
    if ima_list != []:
        for i in ima_list:
            m = i.split('.')[0]
            result['image'].append(f.url_for('static', filename=log_id + '/' + i))
    return f.jsonify(result)


@app.route('/sendStepScore', methods=['POST'])
def send_step_score():
    log_id = f.request.form.get('user')
    step_score = f.request.form.get('step_score')
    if log_id not in os.listdir('step_score'):
        os.mkdir('step_score/' + log_id)
    with open('step_score/' + log_id + '/step_score.json', 'w') as fp:
        dump(loads(step_score), fp)
    return '1'


@app.route('/echartsData', methods=['POST'])
def echarts_data():
    weight = loads(f.request.form.get('weight'))
    step = int(f.request.form.get('step'))
    total_money = float(f.request.form.get('total_money'))
    temp = initData()
    if step == 0:
        rtn_table = temp[757: 780]
    elif step == 1:
        rtn_table = temp[800: 821]
    else:
        rtn_table = temp[842: 865]
    flag = True
    data = None
    for key, value in weight.items():
        if flag:
            data = rtn_table[key] * float(value)
            flag = False
        else:
            data += rtn_table[key] * float(value)
    data = [round(i * 100, 2) for i in list(data.values)]
    label = [str(a).split(' ')[0] for a in rtn_table._stat_axis.values.tolist()]
    new_earning = 0
    for d in data:
        new_earning = total_money * d / 100
        total_money += new_earning
    result = {
        'label': label,
        'data': data,
        'max': round(max(data), 2),
        'min': round(min(data), 2),
        'total_money': round(total_money, 2),
        'new_day': label[-1],
        'new_earning': round(new_earning, 2),
        'leiji': round(total_money - 100000, 2)
    }
    return f.jsonify(result)


@app.route('/weight', methods=['POST'])
def weight():
    name_code = {
        '000300.ZICN': '沪深300',
        '000905.ZICN': '中证500',
        '399006.ZICN': '创业板',
        'SPX.ZIUS': '标普500',
        '000012.ZICN': '上证国债',
        '000013.ZICN': '上证企业债',
    }
    step = int(f.request.form.get('step'))
    risk = float(f.request.form.get('risk'))
    cal_weight = CalWeight(step, risk)
    result = {name_code[s.split()[0]]: s.split()[1] for s in str(cal_weight.get_weight()).split('\n')[1:]}
    return f.jsonify(result)


def initData():
    import csv
    import numpy as np
    import pandas as pd
    from pandas import DataFrame, Series
    from matplotlib import pyplot as plt

    # 这里改成自己本地数据包的位置
    PERFIX = './fin_data12-19/'

    def get_return(ticker):
        tmp_lst = []
        fname = PERFIX + 'data_' + ticker + '.csv'
        with open(fname, 'r') as f:
            reader = csv.reader(f)
            for row in reader:
                tmp_lst.append(row)
        df = pd.DataFrame(tmp_lst[1:], columns=tmp_lst[0])
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.set_index("Date")
        # print(df)
        temp = df['Close'].astype('float64').pct_change().fillna(0.)
        return temp;

    secIDs = ['000300.ZICN', '000905.ZICN', '399006.ZICN', 'SPX.ZIUS', '000012.ZICN', '000013.ZICN']
    rtn_table = DataFrame()

    for secID in secIDs:
        cp = get_return(secID)
        cp.name = secID
        rtn_table = pd.concat([rtn_table, cp], axis=1)

    rtn_table.fillna(0, inplace=True)

    return rtn_table


if __name__ == '__main__':
    app.run('172.16.250.100', port=8800)