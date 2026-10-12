<template>
  <svg
    class="chapter-loading-book"
    viewBox="0 0 32 28"
    width="64"
    height="56"
    shape-rendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    <path class="book-shadow" d="M2 23h12v2h4v-2h12v2H18v2h-4v-2H2z" />
    <path class="book-cover" d="M0 6h2V4h12v2h4V4h12v2h2v17H18v2h-4v-2H0z" />
    <path
      class="book-paper"
      d="M2 4h2V2h8v2h2v2h1v15h-3v-2H2zM17 6h1V4h2V2h8v2h2v15H20v2h-3z"
    />
    <path class="book-spine" d="M15 6h2v17h-2z" />
    <g class="book-lines">
      <path
        d="M5 7h6v1H5zM5 10h7v1H5zM5 13h6v1H5zM20 7h7v1h-7zM20 10h6v1h-6zM20 13h7v1h-7z"
      />
    </g>
    <g class="book-turning-page">
      <path class="book-paper" d="M17 6h1V4h2V2h8v2h2v15H20v2h-3z" />
      <path class="book-page-edge" d="M28 4h2v15h-2zM20 19h8v2h-8z" />
      <path class="book-lines" d="M20 7h7v1h-7zM20 10h6v1h-6zM20 13h7v1h-7z" />
    </g>
    <g class="book-loading-dots">
      <rect x="10" y="26" width="2" height="2" />
      <rect x="15" y="26" width="2" height="2" />
      <rect x="20" y="26" width="2" height="2" />
    </g>
  </svg>
</template>

<style scoped>
.chapter-loading-book {
  overflow: visible;
  flex-shrink: 0;
}
.book-cover,
.book-loading-dots {
  fill: var(--writer-accent);
}
.book-paper {
  fill: var(--writer-panel);
}
.book-spine,
.book-lines,
.book-page-edge {
  fill: var(--writer-muted);
}
.book-lines {
  opacity: 0.6;
}
.book-shadow {
  fill: var(--writer-text);
  opacity: 0.1;
}
.book-page-edge {
  opacity: 0.25;
}
.book-turning-page {
  transform-origin: 16px 14px;
  animation: chapter-page-turn 1.6s steps(6, end) infinite;
}
.book-loading-dots rect {
  animation: chapter-dot-pulse 1.6s steps(2, end) infinite;
}
.book-loading-dots rect:nth-child(2) {
  animation-delay: 0.2s;
}
.book-loading-dots rect:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes chapter-page-turn {
  0%,
  15% {
    transform: scaleX(1);
  }
  65%,
  85% {
    transform: scaleX(-1);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes chapter-dot-pulse {
  0%,
  100% {
    opacity: 0.25;
  }
  50% {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .book-turning-page,
  .book-loading-dots rect {
    animation: none;
  }
}
</style>
