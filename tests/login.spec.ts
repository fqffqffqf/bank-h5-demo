import { test, expect } from '@playwright/test';

test.describe('手机银行登录 E2E 测试', () => {
  
  // 每个测试用例执行前，统一访问本地开发服务器
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200');
  });

  test('测试 199 号段拦截', async ({ page }) => {
    const phoneInput = page.getByTestId('phone-input');
    
    // 1. 输入 199 号段手机号
    await phoneInput.fill('19912345678');
    
    // 2. 按 Tab 键离开输入框，触发 Angular 的 touched 状态
    await phoneInput.press('Tab');
    
    // 3. 断言页面出现拦截提示
    await expect(page.getByText('暂不支持199号段')).toBeVisible();
  });

  test('测试正常登录', async ({ page }) => {
    const phoneInput = page.getByTestId('phone-input');
    const codeInput = page.getByTestId('code-input');
    const loginBtn = page.getByTestId('login-btn');

    // 1. 清空手机号并输入正常手机号
    await phoneInput.clear();
    await phoneInput.fill('13800138000');
    
    // 2. 输入验证码
    await codeInput.fill('123456');
    
    // 3. 点击登录按钮
    await loginBtn.click();
    
    // 👇 4. 补充断言：校验登录成功提示是否渲染并可见
    await expect(page.getByTestId('login-success-msg')).toBeVisible();
    
    // 可选：您也可以进一步断言其文本内容是否完全匹配
    // await expect(page.getByTestId('login-success-msg')).toHaveText('登录成功，正在跳转...');
  });

});