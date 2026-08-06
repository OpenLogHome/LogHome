# sherpa-onnx Android runtime

The native libraries in `arm64-v8a` come from the official
`sherpa-onnx-v1.13.4-android.tar.bz2` release artifact:

https://github.com/k2-fsa/sherpa-onnx/releases/download/v1.13.4/sherpa-onnx-v1.13.4-android.tar.bz2

Archive SHA-256:
`7983fc3de23f6e64148f2fb05fa94a2efaa8c0516cc1573383dc5c7d4d2a43b0`

Included files:

- `libonnxruntime.so`: `994848008526a934dfb579ac773b00e5867929234852b061005d45aacaee9533`
- `libsherpa-onnx-jni.so`: `a79ff75fbe1c3813cc239037b458a7828298a90a5b77f5314056508eefdf72bc`

The Kotlin JNI wrapper is copied from the matching `v1.13.4` tag. Licenses are
included under `app/src/main/assets/licenses`.
