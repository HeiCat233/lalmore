# 高德地图 SDK 官方混淆规则（启用 minifyEnabled 后必须保留，否则地图白屏）
-keep class com.amap.api.** {*;}
-keep class com.autonavi.** {*;}
-dontwarn com.amap.api.**
-dontwarn com.autonavi.**

# Room 实体类保留字段名（便于排查数据库问题）
-keepnames class com.lalmore.toiletfinder.data.** { *; }
