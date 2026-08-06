#!/usr/bin/env python3
"""Remove a baked checkerboard background from a pixel-art badge PNG."""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image


def flood_component(mask: np.ndarray, seeds: list[int], diagonals: bool = False) -> np.ndarray:
    """Return the mask component reachable from the supplied flat-index seeds."""
    height, width = mask.shape
    mask_flat = mask.reshape(-1)
    visited = np.zeros(mask_flat.size, dtype=np.uint8)
    queue: deque[int] = deque()

    for seed in seeds:
        if mask_flat[seed] and not visited[seed]:
            visited[seed] = 1
            queue.append(seed)

    while queue:
        index = queue.popleft()
        row, column = divmod(index, width)
        neighbours = []
        if row > 0:
            neighbours.append(index - width)
        if row + 1 < height:
            neighbours.append(index + width)
        if column > 0:
            neighbours.append(index - 1)
        if column + 1 < width:
            neighbours.append(index + 1)
        if diagonals:
            if row > 0 and column > 0:
                neighbours.append(index - width - 1)
            if row > 0 and column + 1 < width:
                neighbours.append(index - width + 1)
            if row + 1 < height and column > 0:
                neighbours.append(index + width - 1)
            if row + 1 < height and column + 1 < width:
                neighbours.append(index + width + 1)

        for neighbour in neighbours:
            if mask_flat[neighbour] and not visited[neighbour]:
                visited[neighbour] = 1
                queue.append(neighbour)

    return visited.reshape(height, width).astype(bool)


def extract_badge(source: Path, output: Path, size: int, brightness: int) -> None:
    image = Image.open(source).convert("RGB")
    rgb = np.asarray(image, dtype=np.uint8)
    height, width = rgb.shape[:2]

    channel_spread = rgb.max(axis=2).astype(np.int16) - rgb.min(axis=2).astype(np.int16)
    luminance = rgb.mean(axis=2)
    background_candidate = (channel_spread <= 18) & (luminance >= brightness)

    border_seeds = []
    border_seeds.extend(range(width))
    border_seeds.extend(range((height - 1) * width, height * width))
    border_seeds.extend(row * width for row in range(1, height - 1))
    border_seeds.extend(row * width + width - 1 for row in range(1, height - 1))
    connected_background = flood_component(background_candidate, border_seeds)

    foreground_candidate = ~connected_background
    centre = (height // 2) * width + (width // 2)
    if not foreground_candidate.reshape(-1)[centre]:
        raise RuntimeError("The image centre was classified as background; adjust the threshold.")

    badge_mask = flood_component(foreground_candidate, [centre], diagonals=True)
    rows, columns = np.where(badge_mask)
    if not len(rows):
        raise RuntimeError("No foreground badge was found.")

    rgba = np.zeros((height, width, 4), dtype=np.uint8)
    rgba[badge_mask, :3] = rgb[badge_mask]
    rgba[badge_mask, 3] = 255
    extracted = Image.fromarray(rgba, "RGBA")

    left, right = int(columns.min()), int(columns.max()) + 1
    top, bottom = int(rows.min()), int(rows.max()) + 1
    cropped = extracted.crop((left, top, right, bottom))

    usable_size = round(size * 0.9)
    scale = min(usable_size / cropped.width, usable_size / cropped.height)
    resized_size = (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale)))
    resized = cropped.resize(resized_size, Image.Resampling.NEAREST)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    offset = ((size - resized.width) // 2, (size - resized.height) // 2)
    canvas.alpha_composite(resized, offset)

    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, optimize=True)
    coverage = float(np.count_nonzero(np.asarray(canvas)[:, :, 3])) / (size * size)
    print(
        f"saved {output} ({size}x{size}, alpha coverage {coverage:.1%}, "
        f"source bounds {right-left}x{bottom-top})"
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--size", type=int, default=256)
    parser.add_argument("--brightness", type=int, default=180)
    args = parser.parse_args()
    extract_badge(args.source, args.output, args.size, args.brightness)


if __name__ == "__main__":
    main()
