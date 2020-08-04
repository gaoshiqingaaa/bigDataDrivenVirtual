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
from flask_log_request_id import RequestID, current_request_id

matplotlib.use('Agg')

if 'static' not in os.listdir('./'):
    os.mkdir('static')
if 'step' not in os.listdir('./'):
    os.mkdir('step')

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
    res = {'user': log_id, 'safe': '', 'result': [], 'files': []}
    step = f.request.form.get('step')
    codes = f.request.form.get('code')
    if re.findall('cd|remove|rm -rf|pwd|kill|mkdir|system|popen', codes, re.I) != []:
        res['error'] = 'No permission!!!'
        res['safe'] = 'false'
        return res
    res['safe'] = 'true'
    with open(stp_path + step + '.txt', 'w', encoding='utf-8') as stp:
        stp.write(codes)
    all_code = "import pandas as pd\n" \
               "pd.set_option('display.max_columns', None)\n" \
               "#pd.set_option('display.max_rows', None)\n" \
               "pd.set_option('display.width', 5000)"
    # 导入pandas
    # 设置显示所有列
    # 设置显示所有行（未启用）（删去开头的#可开启）
    for i in range(int(step) + 1):
        with open(stp_path + str(i) + '.txt', 'r', encoding='utf-8') as stp:
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
        err = err.split('\n')[-2]
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


app.run('172.16.250.100', port=8800)
