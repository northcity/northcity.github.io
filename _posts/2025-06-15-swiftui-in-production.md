---
layout: post
title: "SwiftUI 实战：从入门到独立开发"
subtitle: "写给想用 SwiftUI 做产品的开发者"
date: 2025-06-15
author: "北城"
header-img: "img/common/home-bg.jpg"
tags:
  - SwiftUI
  - iOS开发
  - 技术
catalog: true
---

## 为什么选择 SwiftUI

2019 年 SwiftUI 发布时，我还在观望。2021 年开始在新项目中使用，现在所有新功能都用 SwiftUI 开发。

**选择 SwiftUI 的理由：**

1. **开发效率高**：声明式 UI 让布局代码减少 50% 以上
2. **预览功能强大**：实时预览节省大量调试时间
3. **跨平台**：iOS、iPadOS、macOS、watchOS 一套代码
4. **未来趋势**：苹果明确的战略方向

## 适合 SwiftUI 的场景

### ✅ 推荐使用

- 新项目、新功能
- 设置页面、表单
- 简单的列表和详情
- watchOS 应用
- Widget

### ⚠️ 谨慎使用

- 复杂的自定义手势
- 需要精确控制动画的场景
- 老系统兼容（iOS 13-14）

## 核心概念

### 1. 状态管理

```swift
// @State - 视图内部状态
@State private var isLoading = false

// @Binding - 父子视图传递
@Binding var selectedTab: Int

// @StateObject - 可观察对象（创建）
@StateObject var viewModel = ViewModel()

// @ObservedObject - 可观察对象（传入）
@ObservedObject var viewModel: ViewModel

// @EnvironmentObject - 全局状态
@EnvironmentObject var appState: AppState
```

### 2. 视图组合

SwiftUI 的核心思想是组合而非继承：

```swift
struct ContentView: View {
    var body: some View {
        VStack {
            HeaderView()
            ContentList()
            FooterView()
        }
    }
}
```

### 3. 修饰符链

```swift
Text("Hello")
    .font(.title)
    .foregroundColor(.primary)
    .padding()
    .background(Color.gray.opacity(0.1))
    .cornerRadius(10)
```

## 实战技巧

### 1. 合理拆分视图

```swift
// ❌ 不好：一个巨大的 body
var body: some View {
    // 200 行代码...
}

// ✅ 好：拆分成小组件
var body: some View {
    VStack {
        headerSection
        contentSection
        footerSection
    }
}

private var headerSection: some View {
    // ...
}
```

### 2. 善用 ViewBuilder

```swift
@ViewBuilder
func makeContent(for state: State) -> some View {
    switch state {
    case .loading:
        ProgressView()
    case .loaded(let data):
        DataView(data: data)
    case .error(let error):
        ErrorView(error: error)
    }
}
```

### 3. 自定义修饰符

```swift
struct CardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.white)
            .cornerRadius(12)
            .shadow(radius: 4)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardModifier())
    }
}

// 使用
Text("Hello").cardStyle()
```

## 性能优化

### 1. 避免不必要的重绘

```swift
// ❌ 整个视图重绘
struct ParentView: View {
    @State var count = 0
    
    var body: some View {
        VStack {
            Text("Count: \(count)")
            ExpensiveView() // 每次都重绘
        }
    }
}

// ✅ 使用 EquatableView
struct ExpensiveView: View, Equatable {
    static func == (lhs: Self, rhs: Self) -> Bool { true }
    // ...
}
```

### 2. 懒加载列表

```swift
// ❌ 一次性加载所有
List(items) { item in
    ItemView(item: item)
}

// ✅ 懒加载
LazyVStack {
    ForEach(items) { item in
        ItemView(item: item)
    }
}
```

## 与 UIKit 混合使用

实际项目中，经常需要混合使用：

```swift
// 在 SwiftUI 中使用 UIKit
struct MapView: UIViewRepresentable {
    func makeUIView(context: Context) -> MKMapView {
        MKMapView()
    }
    
    func updateUIView(_ uiView: MKMapView, context: Context) {
        // 更新逻辑
    }
}

// 在 UIKit 中使用 SwiftUI
let hostingController = UIHostingController(rootView: SwiftUIView())
```

## 我的项目结构

```
App/
├── App.swift
├── Features/
│   ├── Home/
│   │   ├── HomeView.swift
│   │   ├── HomeViewModel.swift
│   │   └── Components/
│   ├── Settings/
│   └── ...
├── Core/
│   ├── Models/
│   ├── Services/
│   └── Extensions/
└── Resources/
```

## 推荐资源

1. [官方文档](https://developer.apple.com/documentation/swiftui)
2. [Hacking with Swift](https://www.hackingwithswift.com/quick-start/swiftui)
3. [SwiftUI Lab](https://swiftui-lab.com)
4. [WWDC 视频](https://developer.apple.com/videos/)

## 总结

SwiftUI 已经足够成熟，可以用于生产环境。

关键是：
1. 理解其声明式的思想
2. 知道什么时候该用 UIKit
3. 持续关注新版本的改进

作为独立开发者，SwiftUI 能显著提高开发效率，值得投入学习。
