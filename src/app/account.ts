import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// 定义数据的类型
export interface Transaction {
  id: number;
  type: string;
  amount: number;
  date: string;
}

@Injectable({
  providedIn: 'root'
})

export class AccountService {

  constructor() { }

  getTransactions(): Observable<Transaction[]> {
    const mockData: Transaction[] = [
      { id: 1, type: '工资入账', amount: 12000.00, date: '2026-10-01' },
      { id: 2, type: '转账支出', amount: -3500.00, date: '2026-10-03' },
      { id: 3, type: '理财赎回', amount: 8000.00, date: '2026-10-05' }
    ];

    // 模拟 1 秒钟的网络延迟后返回数据
    return of(mockData).pipe(delay(1000));
  } 
}