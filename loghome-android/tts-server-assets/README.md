# LogHome TTS server assets

The Android app keeps the sherpa-onnx native runtime inside the APK and
downloads versioned voice-model packages on demand. Every package is pinned by
its exact byte length and SHA-256 digest. Multiple visible voices can share one
downloaded multi-speaker package.

## Files to upload

- `../tts-server-assets-upload-v1.zip` — Chaowen, already uploaded
- `vits-icefall-zh-aishell3.tar.bz2` — lightweight 174-speaker Mandarin pack

Keep every file byte-for-byte unchanged. Checksums, sizes, selected speaker
IDs, and licenses are recorded in `manifest-v2.json`.

Current uploaded Chaowen resource:

`https://storage.codesocean.top/api/resource/download/178564613831492`

Current uploaded AISHELL-3 resource:

`https://storage.codesocean.top/api/resource/download/178598531385082`

## Example deployment

```bash
rsync -av \
  ../tts-server-assets-upload-v1.zip \
  ./vits-icefall-zh-aishell3.tar.bz2 \
  user@example.com:/var/www/downloads/tts/
```

Example nginx location:

```nginx
location /tts/ {
    alias /var/www/downloads/tts/;
    add_header Cache-Control "public, max-age=31536000, immutable";
    types {
        application/zip zip;
        application/x-bzip2 bz2;
    }
}
```

Nginx static-file serving supports byte ranges by default. Do not disable
`Range`/`Accept-Ranges`, because the app resumes interrupted downloads.

Verify the deployed files against `manifest-v2.json`:

```bash
curl -L https://downloads.example.com/tts/tts-server-assets-upload-v1.zip \
  | shasum -a 256
curl -L https://downloads.example.com/tts/vits-icefall-zh-aishell3.tar.bz2 \
  | shasum -a 256
```

Build the app against the uploaded directory:

```bash
./gradlew assembleRelease \
  -PloghomeTtsChaowenModelUrl=https://downloads.example.com/tts/tts-server-assets-upload-v1.zip \
  -PloghomeTtsAishell3ModelUrl=https://downloads.example.com/tts/vits-icefall-zh-aishell3.tar.bz2
```

The equivalent environment variables are:

- `LOGHOME_TTS_CHAOWEN_MODEL_URL`
- `LOGHOME_TTS_AISHELL3_MODEL_URL`

## Local Android integration test

Start a local file server in this directory:

```bash
python3 -m http.server 8765 --bind 0.0.0.0
```

Then run the large model test against the Android emulator:

```bash
./gradlew connectedDebugAndroidTest \
  -PloghomeTtsAishell3ModelUrl=http://10.0.2.2:8765/vits-icefall-zh-aishell3.tar.bz2 \
  -Pandroid.testInstrumentationRunnerArguments.class=top.codesocean.loghome.android.audio.SherpaMultiVoiceIntegrationTest
```

The large test skips automatically unless its model URL points to the emulator
host (`10.0.2.2`) so routine CI does not download the model.
