plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.lalmore.toiletfinder"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.lalmore.toiletfinder"
        // minSdk 26 = Android 8.0，可全程使用 adaptive icon 和较新的系统 API
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        viewBinding = true
    }
}

dependencies {
    // AndroidX 基础
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1")

    // 高德地图 SDK 三合一组合包（3D地图 11.3.100 + 定位 11.3.000 + POI搜索 9.8.1）
    // 注意：不要拆成 3dmap/location/search 三个独立依赖——它们各自内嵌了相同的
    // 公共类（如 com.amap.apis.utils.core.api.*），会触发 Duplicate class 编译错误，
    // 高德官方发布此组合包专门解决这个问题（可写进报告的集成细节）
    implementation("com.amap.api:3dmap-location-search:11.3.100_loc11.3.000_sea9.8.1")

    // Room：官方 SQLite ORM，负责评价/收藏厕所的本地数据库存储
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")
}
