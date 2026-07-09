#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
export JAVA_HOME="$HOME/jdks/jdk-17/Contents/Home"
export ANDROID_HOME="$HOME/Android"
export PATH="$ANDROID_HOME/platform-tools:$JAVA_HOME/bin:$PATH"

APK="$SCRIPT_DIR/app/build/outputs/apk/debug/app-debug.apk"
PACKAGE="top.codesocean.loghome"
ACTIVITY=".android.SplashActivity"

echo "Building debug APK..."
(cd "$SCRIPT_DIR" && ./gradlew assembleDebug)

echo "Installing $APK ..."
adb install -r "$APK"

echo "Launching app..."
adb shell am start -n "$PACKAGE/$ACTIVITY"

echo "Done. Showing logcat (Ctrl+C to stop)..."
adb logcat -c && adb logcat -v time *:W
