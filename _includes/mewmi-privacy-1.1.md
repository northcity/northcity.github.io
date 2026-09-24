## 中文版本 {#zh-cn}

### 1. 适用范围

本政策适用于 NorthCity 提供的猫猫收集器（Mewmi）iOS 应用及其支持页面，说明我们如何处理你在使用私人收藏、可选 iCloud 同步和“猫猫地图”公开分享功能时提供的信息。

Mewmi 不集成广告 SDK，不进行跨 App 跟踪，也不出售用户数据。

### 2. 我们处理的信息

#### 2.1 私人收藏

你选择或拍摄的照片、猫咪档案、相遇记录、地址和备注默认保存在你的设备上，仅用于生成和管理私人猫卡、贴纸、足迹和统计。

如果你主动开启 iCloud 同步，相关私人数据会存储在与你的 Apple ID 关联的 Apple iCloud 容器中，用于你自己的设备间同步。它们不会因为开启同步而出现在公开猫猫地图。

#### 2.2 猫猫地图公开投稿

只有在你主动开启分享并确认社区规则后，Mewmi 才会向 Apple CloudKit Public Database 上传以下信息：

- 经裁剪、重新编码并移除 EXIF 的猫咪展示图片、缩略图和地图贴纸；
- 你填写的公开猫咪名称和随机生成的公共猫 ID；
- 相遇日期，精度仅到“日”；
- 由设备端先模糊处理的约 600 米区域、城市或行政区级标签和地图网格；
- 投稿版本、图片摘要、规则版本和客户端版本；
- CloudKit 为权限控制、撤回、防滥用及审核所需的用户记录标识。该标识不会作为作者资料展示给其他用户。

地图会先经过人工审核，审核通过后才对其他用户展示。

#### 2.3 我们不会上传到公开数据库的信息

公开猫猫地图不会上传：

- 精确 GPS 坐标；
- 街道门牌或完整地址；
- 私人备注；
- 未裁剪的原始照片；
- 照片中的 EXIF 或其他原始元数据；
- 你的姓名、电子邮箱或公开作者主页。

为了在设备端生成模糊区域，系统可能先向 Mewmi 提供精确位置；该精确位置只在设备本机处理，不写入猫猫地图 Public Database。

#### 2.4 举报与安全

当你举报公开内容时，我们会处理目标投稿、固定举报原因、时间、规则版本及 CloudKit 权限控制所需的信息。举报记录不会向其他普通用户公开，用于内容审核、防滥用和安全处理。

### 3. 权限使用

- 相机：拍摄猫咪照片并制作猫卡或贴纸。
- 照片：选择猫咪照片；在你主动操作时保存分享图片。
- 使用期间的位置：记录私人相遇地点、在地图中显示当前位置，并在公开投稿前在设备端生成模糊区域。
- 始终允许的位置（可选）：在你开启地理围栏提醒后，在到达常收集猫咪的区域时提供提醒。
- 通知（可选）：发送你主动开启的提醒。
- iCloud：同步你选择同步的私人数据，以及提交、修改或撤回猫猫地图投稿。

拒绝权限只会影响依赖该权限的功能。你可以随时在 iOS“设置”中修改权限。

### 4. 使用目的

我们仅将上述信息用于：

- 提供私人收藏、贴纸、地图和同步功能；
- 审核、展示和撤回公开投稿；
- 处理举报、封禁滥用账号和保障服务安全；
- 排查用户主动反馈的问题；
- 履行法律义务。

我们不将这些信息用于第三方广告、跨 App 跟踪或向数据经纪商出售。

### 5. 服务提供方

Mewmi 使用 Apple 提供的 iCloud 和 CloudKit 存储、同步及传输数据。Apple 对相关基础设施的处理受 Apple 自身条款与隐私政策约束。Mewmi 不集成第三方广告或行为分析服务。

### 6. 数据保留与删除

- 私人本地数据：保留至你在 App 内删除相关内容、清空数据或删除 App。
- 私人 iCloud 数据：保留至你关闭并清理同步数据，或通过相关删除功能移除。
- 公开投稿：保留至你撤回或删除关联猫咪、投稿被审核下架，或服务不再需要该内容。
- 举报与限制记录：在处理安全事件、防止重复滥用和履行法律义务所需的合理期限内保留。

撤回请求在联网时提交给 CloudKit。离线操作会进入本机队列，并在网络恢复后重试。删除后，Apple 基础设施中的备份或缓存副本可能按其正常周期消失。

### 7. 你的选择与权利

你可以：

- 不开启猫猫地图分享，继续只使用私人收藏；
- 在发布前选择公开名称和照片；
- 在“设置 → 我的地图分享”查看状态并撤回单条投稿；
- 删除猫咪或清空全部数据，并在联网后撤回关联投稿；
- 举报不适宜的公开内容；
- 通过下方联系方式提出访问、更正、删除或隐私问题。

猫猫地图不建立公开作者主页。投稿依赖 iCloud 权限标识，但浏览公开地图不要求创建 Mewmi 账号。

### 8. 未成年人

Mewmi 并非专门面向儿童设计。未成年人应在父母或监护人指导下使用，不应公开提交包含个人身份、家庭住址、学校或其他敏感信息的内容。

### 9. 安全与内容审核

我们采用数据最小化、位置模糊、照片重新编码、先审后展示、固定原因举报、权限隔离和远程关闭投稿等措施降低风险。任何存储或传输方式都无法保证绝对安全。

### 10. 政策更新

当产品功能、数据处理方式或法律要求发生变化时，我们会更新本政策及“最后更新”日期。重大变化可能通过 App 更新说明、应用内提示或支持页面告知。

### 11. 联系我们

- 电子邮箱：[506343891@qq.com](mailto:506343891@qq.com)
- 支持页面：[Mewmi 支持](https://www.northcity.top/mewmi-support/)

## English Version {#en}

### 1. Scope

This policy applies to the Mewmi iOS app and its support pages provided by NorthCity. It explains how information is handled when you use private collections, optional iCloud sync, and the public Cat World Map.

Mewmi does not integrate advertising SDKs, perform cross-app tracking, or sell user data.

### 2. Information We Process

#### 2.1 Private collections

Photos you select or capture, cat profiles, encounter records, addresses, and notes are stored on your device by default and are used to create and manage private Cat Cards, stickers, footprints, and statistics.

If you enable iCloud sync, related private data is stored in an Apple iCloud container associated with your Apple ID so it can sync across your devices. Enabling private sync does not publish that data to the Cat World Map.

#### 2.2 Public Cat World Map submissions

Only after you choose to share and accept the community rules does Mewmi upload the following to the Apple CloudKit Public Database:

- A cropped and re-encoded cat display image, thumbnail, and map sticker with EXIF removed;
- The public cat name you provide and a generated public cat ID;
- The encounter date at day-level precision;
- An on-device blurred area of approximately 600 metres, a city or district-level label, and map grid identifiers;
- Submission revision, image digest, rules version, and client version; and
- A CloudKit user record identifier used for access control, withdrawal, abuse prevention, and moderation. It is not displayed to other users as author information.

Submissions are reviewed by a person before they become visible to other users.

#### 2.3 Information not uploaded to the public database

The public Cat World Map does not upload precise GPS coordinates, street addresses, private notes, uncropped original photos, photo EXIF metadata, your name or email address, or a public author profile.

The operating system may provide a precise location to Mewmi so the app can create a blurred area on the device. That precise location remains on the device and is not written to the Cat World Map Public Database.

#### 2.4 Reports and safety

When you report public content, we process the target submission, a fixed report reason, time, rules version, and information needed for CloudKit access control. Reports are not readable by other ordinary users and are used for moderation, abuse prevention, and safety.

### 3. Permissions

Mewmi may request camera, photo library, location while in use, optional always-on location for geofence reminders, notifications, and iCloud access. Each permission is used only for the feature described in the system prompt. You can change permissions in iOS Settings at any time.

### 4. Purposes

We process information only to provide private collection, sticker, map, and sync features; review, display, and withdraw public submissions; process reports and prevent abuse; respond to user-requested support; and comply with legal obligations.

We do not use this information for third-party advertising, cross-app tracking, or sale to data brokers.

### 5. Service Provider

Mewmi uses Apple iCloud and CloudKit to store, sync, and transmit data. Apple’s processing of its infrastructure is governed by Apple’s own terms and privacy policy. Mewmi does not integrate third-party advertising or behavioural analytics services.

### 6. Retention and Deletion

Private local data remains until you delete it, clear app data, or remove the app. Private iCloud data remains until you remove it through the relevant sync or deletion controls. Public submissions remain until you withdraw them, delete the associated cat, the submission is removed through moderation, or the service no longer needs the content.

Withdrawal requests are sent to CloudKit when online. Offline actions are queued on the device and retried when connectivity returns. Backup or cached copies in Apple infrastructure may expire according to Apple’s normal retention cycle.

Report and restriction records may be retained for a reasonable period needed to resolve safety issues, prevent repeat abuse, and meet legal obligations.

### 7. Your Choices and Rights

You can keep the Cat World Map sharing option off, choose the public photo and name before submitting, review and withdraw individual shares in Settings → My Map Shares, delete a cat or all data and withdraw associated shares when online, report unsuitable public content, and contact us about access, correction, deletion, or privacy questions.

Browsing the public map does not require a Mewmi account. Submitting, editing, and withdrawing content requires iCloud access control.

### 8. Children

Mewmi is not specifically directed to children. Minors should use it with guidance from a parent or guardian and should not submit content containing personal identity, home, school, or other sensitive information.

### 9. Security and Moderation

We use data minimisation, location blurring, photo re-encoding, pre-publication human review, fixed-reason reporting, access isolation, and remote publication controls to reduce risk. No storage or transmission method can guarantee absolute security.

### 10. Changes

We may update this policy when the product, data practices, or legal requirements change. We will update the date above and may provide notice through release notes, in-app messaging, or the support site.

### 11. Contact

- Email: [506343891@qq.com](mailto:506343891@qq.com)
- Support: [Mewmi Support](https://www.northcity.top/mewmi-support/)
