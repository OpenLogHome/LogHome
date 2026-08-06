# AISHELL-3 model notice

`vits-icefall-zh-aishell3` is a multi-speaker Mandarin VITS model distributed
through the official sherpa-onnx TTS model release. It was trained on the
AISHELL-3 corpus.

- Upstream archive: <https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-icefall-zh-aishell3.tar.bz2>
- AISHELL-3 corpus: <https://www.openslr.org/93/>
- Corpus license: Apache License 2.0
- Speakers exposed by the model: 174
- Sample rate: 8,000 Hz

The Android installer extracts only the model, lexicon, token table, and the
phone/date/number normalization FST files used by LogHome. The upstream
archive remains byte-for-byte unchanged for reproducible verification.
