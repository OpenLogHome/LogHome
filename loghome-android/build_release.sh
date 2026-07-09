#!/bin/bash
# **dont forget to change version in app/build.gradle**
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
./gradlew assembleRelease
