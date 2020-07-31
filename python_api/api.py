# -*- coding: utf-8 -*-
"""
Created on Thu Jul 30 15:04:57 2020

@author: 28446
"""

import os
import re
import sys
import matplotlib
import flask as f
from flask_cors import CORS

matplotlib.use('Agg')

# from shutil import copyfile

try:
    from flask_log_request_id import RequestID, current_request_id
except:
    os.system('pip install -i http://mirrors.aliyun.com/pypi/simple/  flask-log-request-id')

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
    res = {'user': log_id, 'safe': '', 'result': '', 'error': '', 'files': []}
    step = f.request.form.get('step')
    codes = f.request.form.get('code')
    if re.findall('cd|remove|rm -rf|pwd|kill|mkdir|system|popen', codes, re.I) != []:
        res['error'] = 'No permission!!!'
        res['safe'] = 'false'
        return res
    res['safe'] = 'true'
    with open(stp_path + step + '.txt', 'w', encoding='utf-8') as stp:
        stp.write(codes)
    all_code = ''
    for i in range(int(step) + 1):
        with open(stp_path + str(i) + '.txt', 'r', encoding='utf-8') as stp:
            stp_cod = stp.read()
            if re.findall('\.plot', stp_cod, re.S) != []:
                stp_cod += "\nplt.savefig('static/%s/%d.png')" % (log_id, i)
            if i == int(step):
                stp_cod = "\nprint('000-000-000-000-000')\n" + stp_cod + "\nprint('000-000-000-000-000')\n"
            all_code += stp_cod
    with open(code_path + 'code.py', 'w', encoding='utf-8') as cod:
        cod.write(all_code)
    temp = sys.stderr
    with open('%serr.log' % code_path, 'w', encoding='utf-8') as err:
        sys.stderr = err
        os.system("python %scode.py >> %sresult.txt" % (code_path, code_path))
        sys.stderr = temp
    with open('%serr.log' % code_path, 'r', encoding='utf-8') as err:
        res['error'] = err.read()
    with open('%sresult.txt' % code_path, 'r', encoding='utf-8') as rest:
        result = rest.read()
        resul = re.findall("000-000-000-000-000\n(.*?)000-000-000-000-000", result, re.S)
        if resul == []:
            result = ''
        else:
            result = resul.pop()
        res['result'] = result
    os.remove('%sresult.txt' % code_path)
    os.remove('%serr.log' % code_path)
    os.remove('%scode.py' % code_path)
    if os.listdir(code_path[:-1]) != []:
        for k in os.listdir(code_path[:-1]):
            res['files'].append(f.url_for('static', filename=log_id + '/' + k))
    return f.jsonify(res)


# app.run(port=5000, debug=True)  # debug模式
app.run(port=5000)

