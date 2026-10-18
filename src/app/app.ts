import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
// 👇 注意这里，引入的是刚生成的 account 文件
import { AccountService, Transaction } from './account'; 

// 1. 抽离为独立的、可复用的自定义校验器
export const unsupported199Validator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.value && control.value.startsWith('199')) {
    return { unsupported199: true };
  }
  return null;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule],
  // 2. 将内联样式抽离到组件的 styles 中
  styles: [`
    .error-text {
      color: red;
      font-size: 12px;
    }
  `],
  template: `
    <h2>手机银行登录</h2>
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
      <label>手机号</label>
      <input formControlName="phone" data-testid="phone-input" placeholder="请输入手机号" />
      
      @if (loginForm.get('phone')?.invalid && loginForm.get('phone')?.touched) {
        @if (loginForm.get('phone')?.hasError('unsupported199')) {
          <div class="error-text">暂不支持199号段</div>
        } @else {
          <div class="error-text">请输入11位手机号</div>
        }
      }

      @if (loginSuccess) {
      <div style="color: green; margin-top: 10px;" data-testid="login-success-msg">登录成功，正在跳转...</div>
      }

      <label>验证码</label>
      <input formControlName="code" data-testid="code-input" placeholder="请输入6位验证码" />
      @if (loginForm.get('code')?.invalid && loginForm.get('code')?.touched) {
        <div class="error-text">验证码必须为6位数字</div>
      }

      <button type="submit" data-testid="login-btn" [disabled]="loginForm.invalid">登录</button>
    </form>

    <hr />
    <h3>最近交易</h3>
    
    @if (loading) {
      <div>加载中...</div>
    } @else {
      @if (transactions.length === 0) {
        <div>暂无交易</div>
      } @else {
        <ul>
          @for (t of transactions; track t.id) {
            <li data-testid="transaction-item">
              {{ t.type }} - {{ t.amount }} - {{ t.date }}
            </li>
          }
        </ul>
      }
    }
  `,
})
export class App implements OnInit {
  loginForm = new FormGroup({
    phone: new FormControl('', [
      Validators.required, 
      Validators.pattern(/^1\d{10}$/),
      // 3. 直接引用抽离的校验器函数
      unsupported199Validator 
    ]),
    code: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
  });

  transactions: Transaction[] = [];
  loading = false;

  constructor(private accountService: AccountService) {} 

  ngOnInit() {
    this.loading = true;
    
    this.accountService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('获取数据失败', err);
        this.loading = false;
      }
    });
  }


  loginSuccess = false;

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('登录数据', this.loginForm.value);
      this.loginSuccess = true; // 👈 加这一行
    }
  }
}