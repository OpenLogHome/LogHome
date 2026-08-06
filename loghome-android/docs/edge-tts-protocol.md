# Embedded Edge TTS protocol

The Android implementation is aligned with `rany2/edge-tts` 7.2.8 and talks
directly to the Microsoft Edge read-aloud WebSocket endpoint. It does not
require Python, Microsoft Edge, an API key, or a LogHome proxy service.

## Update checklist

When Edge changes the protocol, compare the current upstream files below:

- `src/edge_tts/constants.py`
- `src/edge_tts/drm.py`
- `src/edge_tts/communicate.py`

Then update `EDGE_TTS_PROTOCOL_VERSION`, `EDGE_TTS_CHROMIUM_VERSION`, the
trusted client token if it changed, request headers, and frame parsing in:

- `EdgeTtsProtocol.kt`
- `EdgeOnlineTtsEngine.kt`

Run the deterministic protocol tests and the real Android service test:

```bash
./gradlew testDebugUnitTest
./gradlew connectedDebugAndroidTest \
  -Pandroid.testInstrumentationRunnerArguments.class=top.codesocean.loghome.android.audio.EdgeTtsIntegrationTest
```

Upstream: <https://github.com/rany2/edge-tts>

The Edge read-aloud endpoint is an online consumer service rather than a
versioned public API. Keep the offline fallback enabled.
