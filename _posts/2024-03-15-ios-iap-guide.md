---
layout: post
title: "iOS 内购（IAP）完整指南：从接入到上线"
subtitle: "独立开发者必备的 App Store 内购知识"
date: 2024-03-15
author: "北城"
header-img: "img/common/home-bg.jpg"
tags:
  - iOS开发
  - 内购
  - 技术
catalog: true
---

## 前言

内购（In-App Purchase）是 iOS 应用变现的核心方式。

这篇文章整理了我做内购的经验，希望帮你少踩坑。

## 内购类型

### 1. 消耗型（Consumable）

用户可以多次购买，用完即消耗。

**适合场景：**
- 游戏金币
- 虚拟礼物
- 次数包

### 2. 非消耗型（Non-Consumable）

用户只需购买一次，永久拥有。

**适合场景：**
- 解锁高级功能
- 去广告
- 主题包

### 3. 自动续期订阅（Auto-Renewable Subscription）

定期自动续费，苹果抽成逐年降低。

**适合场景：**
- 会员服务
- 持续更新的内容
- 云服务

### 4. 非自动续期订阅（Non-Renewing Subscription）

有期限但不自动续费。

**适合场景：**
- 赛季通行证
- 限时服务

## 接入流程

### 1. App Store Connect 配置

```
App Store Connect -> App -> 功能 -> App 内购买项目
```

创建内购项目需要：
- 产品 ID（唯一标识）
- 显示名称
- 描述
- 价格等级

### 2. 代码实现

使用 StoreKit 2（推荐 iOS 15+）：

```swift
import StoreKit

class StoreManager: ObservableObject {
    @Published var products: [Product] = []
    
    func loadProducts() async {
        do {
            products = try await Product.products(for: [
                "com.app.premium.monthly",
                "com.app.premium.yearly"
            ])
        } catch {
            print("Failed to load products: \(error)")
        }
    }
    
    func purchase(_ product: Product) async throws -> Transaction? {
        let result = try await product.purchase()
        
        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await transaction.finish()
            return transaction
        case .userCancelled, .pending:
            return nil
        @unknown default:
            return nil
        }
    }
    
    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw StoreError.failedVerification
        case .verified(let safe):
            return safe
        }
    }
}
```

### 3. 恢复购买

必须提供恢复购买功能：

```swift
func restorePurchases() async {
    for await result in Transaction.currentEntitlements {
        if case .verified(let transaction) = result {
            // 恢复用户权益
            await updatePurchasedState(transaction)
        }
    }
}
```

### 4. 服务端验证（可选但推荐）

对于重要的购买，建议在服务端验证：

```swift
// 获取收据数据
guard let receiptURL = Bundle.main.appStoreReceiptURL,
      let receiptData = try? Data(contentsOf: receiptURL) else {
    return
}

let receiptString = receiptData.base64EncodedString()
// 发送到你的服务器验证
```

## 审核注意事项

### 1. 必须提供恢复购买

设置页面要有"恢复购买"按钮。

### 2. 订阅要说明清楚

- 订阅周期
- 价格
- 取消方式
- 自动续费说明

### 3. 不能引导外部支付

不能在 App 内引导用户通过其他方式支付。

### 4. 沙盒测试

提交审核前要在沙盒环境充分测试。

## 常见问题

### Q: 苹果抽成多少？

- 第一年：30%
- 订阅第二年起：15%
- 小企业计划（年收入 < 100 万美元）：15%

### Q: 用户取消订阅怎么办？

取消后，用户仍可使用到当前订阅期结束。

```swift
// 检查订阅状态
for await result in Transaction.currentEntitlements {
    if case .verified(let transaction) = result {
        if transaction.expirationDate ?? Date() > Date() {
            // 订阅有效
        }
    }
}
```

### Q: 如何处理退款？

苹果会通过 App Store Server Notifications 通知你。

## 提高转化率的技巧

### 1. 提供试用期

```swift
// StoreKit 2 自动处理试用期
if let subscription = product.subscription {
    if subscription.introductoryOffer != nil {
        // 显示试用期信息
    }
}
```

### 2. 在合适的时机展示

用户体验到价值后再引导付费。

### 3. 清晰展示价值

对比免费版和付费版的差异。

### 4. 提供多个选项

年付通常比月付转化率高（因为更划算）。

## 我的数据参考

以闪念为例：

| 指标 | 数值 |
|------|------|
| 付费转化率 | 3% |
| 年付 vs 月付 | 7:3 |
| 续费率 | 65% |
| ARPU | ¥45 |

## 总结

内购接入不复杂，但细节很多。

核心原则：
1. 给用户真正的价值
2. 充分测试
3. 遵守苹果的规则
4. 持续优化转化率

祝你变现顺利！
