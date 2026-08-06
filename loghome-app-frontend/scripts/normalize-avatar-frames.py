#!/usr/bin/env python3
"""Normalize avatar-frame assets so their visible artwork fills the canvas."""

from pathlib import Path
from PIL import Image, ImageSequence


ROOT = Path(__file__).resolve().parents[1] / "static" / "avatar-frames"
THUMBNAILS = ROOT / "thumbnails"
OUTPUT_SIZE = 512
THUMBNAIL_SIZE = 256
VISIBLE_SIZE = 448


def alpha_union_bbox(frames):
    bbox = None
    for frame in frames:
        current = frame.getchannel("A").getbbox()
        if not current:
            continue
        if bbox is None:
            bbox = current
        else:
            bbox = (
                min(bbox[0], current[0]),
                min(bbox[1], current[1]),
                max(bbox[2], current[2]),
                max(bbox[3], current[3]),
            )
    return bbox


def normalized_frame(frame, bbox):
    left, top, right, bottom = bbox
    visible_span = max(right - left, bottom - top)
    scale = VISIBLE_SIZE / visible_span
    resized = frame.resize(
        (round(frame.width * scale), round(frame.height * scale)),
        Image.Resampling.LANCZOS,
    )
    center_x = (left + right) / 2 * scale
    center_y = (top + bottom) / 2 * scale
    paste_x = round(OUTPUT_SIZE / 2 - center_x)
    paste_y = round(OUTPUT_SIZE / 2 - center_y)
    canvas = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0, 0))
    canvas.paste(resized, (paste_x, paste_y))
    return canvas


def save_animated(path, frames, bbox, durations, loop):
    normalized = [normalized_frame(frame, bbox) for frame in frames]
    normalized[0].save(
        path,
        save_all=True,
        append_images=normalized[1:],
        duration=durations,
        loop=loop,
        disposal=2,
        optimize=False,
    )
    return normalized[0]


def save_static(path, frame, bbox):
    normalized = normalized_frame(frame, bbox)
    normalized.save(path, format="PNG", optimize=True)
    return normalized


def save_thumbnail(frame, target):
    thumbnail = frame.resize(
        (THUMBNAIL_SIZE, THUMBNAIL_SIZE),
        Image.Resampling.LANCZOS,
    )
    thumbnail.save(target, format="WEBP", lossless=True, method=6)


def normalize(path):
    with Image.open(path) as source:
        frames = [frame.convert("RGBA") for frame in ImageSequence.Iterator(source)]
        durations = [frame.info.get("duration", source.info.get("duration", 100)) for frame in ImageSequence.Iterator(source)]
        loop = source.info.get("loop", 0)

    bbox = alpha_union_bbox(frames)
    if not bbox:
        raise ValueError(f"No visible pixels in {path}")
    if len(frames) > 1:
        first_frame = save_animated(path, frames, bbox, durations, loop)
    else:
        first_frame = save_static(path, frames[0], bbox)

    save_thumbnail(first_frame, THUMBNAILS / f"{path.stem}.webp")


def main():
    paths = sorted(
        [*ROOT.glob("*.png"), *ROOT.glob("*.gif")],
        key=lambda path: int(path.stem),
    )
    if len(paths) != 25:
        raise RuntimeError(f"Expected 25 avatar frames, found {len(paths)}")
    THUMBNAILS.mkdir(parents=True, exist_ok=True)
    for path in paths:
        normalize(path)
    print(f"Normalized {len(paths)} avatar frames and thumbnails.")


if __name__ == "__main__":
    main()
