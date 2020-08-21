import csv
import numpy as np
import pandas as pd
from pandas import DataFrame, Series
from matplotlib import pyplot as plt
from cvxopt import matrix,solvers


# 这里改成自己本地数据包的位置
PERFIX = './fin_data12-19/'


class CalWeight:
    def __init__(self, step, risk_aversion):
        self.risk_aversion = risk_aversion
        if step == 0:
            self.start = '2012-01-01'
            self.end = '2014-12-31'
        elif step == 1:
            self.start = '2012-01-01'
            self.end = '2015-2-28'
        elif step == 2:
            self.start = '2012-01-01'
            self.end = '2015-4-30'
        secIDs = ['000300.ZICN', '000905.ZICN', '399006.ZICN', 'SPX.ZIUS', '000012.ZICN', '000013.ZICN']
        self.rtn_table = DataFrame()
        for secID in secIDs:
            cp = self.get_return(secID)
            cp.name = secID
            self.rtn_table = pd.concat([self.rtn_table, cp], axis=1)
        self.rtn_table.fillna(0, inplace=True)
        self.cov_mat = self.rtn_table.cov() * 250
        self.exp_rtn = self.rtn_table.mean() * 250

    def get_return(self, ticker):
        tmp_lst = []
        fname = PERFIX + 'data_' + ticker + '.csv'
        with open(fname, 'r') as f:
            reader = csv.reader(f)
            for row in reader:
                tmp_lst.append(row)
        df = pd.DataFrame(tmp_lst[1:], columns=tmp_lst[0])
        df['Date'] = pd.to_datetime(df['Date'])
        df = df.set_index("Date")
        df = df[self.start: self.end]
        temp = df['Close'].astype('float64').pct_change().fillna(0.)
        return temp

    def get_weight(self):
        risk_aversion = self.risk_aversion
        P = risk_aversion * matrix(self.cov_mat.values)
        q = -1 * matrix(self.exp_rtn.values)
        G = matrix(np.vstack((np.diag(np.ones(len(self.exp_rtn))), np.diag(-np.ones(len(self.exp_rtn))))))
        h = matrix(np.array([np.ones(len(self.exp_rtn)), np.zeros(len(self.exp_rtn))]).reshape(len(self.exp_rtn) * 2, 1))
        A = matrix(np.ones(len(self.exp_rtn)), (1, len(self.exp_rtn)))
        b = matrix([1.0])
        solvers.options['show_progress'] = False
        sol = solvers.qp(P, q, G, h, A, b)
        return DataFrame(index=self.exp_rtn.index, data=np.round(sol['x'], 2), columns=['weight'])  # 权重精确到小数点后两位
if __name__ == '__main__':

    cal_weight = CalWeight(0, 3)
    result = {s.split()[0]: s.split()[1] for s in str(cal_weight.get_weight()).split('\n')[1:]}