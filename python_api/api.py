# -*- coding: utf-8 -*-
"""
Created on Tue Jul 28 10:51:43 2020

@author: 28446
"""

import flask as f
import os
import sys
import re

app = f.Flask(__name__)
if 'static' not in os.listdir(app.root_path):
    os.system('mkdir static')


@app.route('/', methods=['POST'])
def code():
    res = {'safe': '', 'result': '', 'error': '', 'files': []}
    temp = sys.stdout
    i = f.request.args.get('id')
    if i not in os.listdir('static'):
        os.system('mkdir static\%s' % i)
    cod = f.request.form.get('code')
    if re.findall('cd|remove|rm -rf|ls|pwd|kill', cod, re.I) != []:
        res['safe'] = 'false'
        return res
    res['safe'] = 'true'
    try:
        with open('static/' + i + '/log.txt', 'w', encoding='utf-8') as log:
            sys.stdout = log
            exec(cod)
    except Exception as e:
        with open('static/' + i + '/log.txt', 'r', encoding='utf-8') as log:
            res['result'] = log.read()
        res['error'] = str(e)
    sys.stdout = temp
    os.remove('static/' + i + '/log.txt')
    if os.listdir('static/' + i) != []:
        for k in os.listdir('static/' + i):
            res['files'].append(f.url_for('static', filename=i + '/' + k))
    return f.jsonify(res)


@app.route('/upload', methods=['POST'])
def upload():  # 上传文件
    i = f.request.args.get('id')
    upload_file = f.request.files['touch']
    if upload_file:
        upload_file.save(os.path.join('static', i, upload_file.filename))
        return f.jsonify({'state': 'success'})
    else:
        return f.jsonify({'state': 'failed'})


@app.route('/delete')
def dele():  # 删除文件
    try:
        i = f.request.args.get('id')
        filena = f.request.args.get('file_name')
        os.remove('static/' + i + '/' + filena)
        return f.jsonify({'state': 'success'})
    except:
        return f.jsonify({'state': 'error'})


app.run('0.0.0.0', port=5000)
