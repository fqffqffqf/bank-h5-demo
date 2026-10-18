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
  styleUrl: `./app.scss`,
  templateUrl: './app.html',
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