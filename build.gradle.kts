// 根构建脚本：声明整个项目使用的插件及版本
// AGP 8.7.3 + Gradle 8.9 + Kotlin 2.0.21 是 2024 底~2025 年广泛验证的稳定组合
plugins {
    id("com.android.application") version "8.7.3" apply false
    id("org.jetbrains.kotlin.android") version "2.0.21" apply false
    // KSP：Kotlin 符号处理器，Room 用它在外编译期生成数据库实现代码
    id("com.google.devtools.ksp") version "2.0.21-1.0.28" apply false
}
