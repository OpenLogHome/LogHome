<template>
  <svg class="manga-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
    :fill="isFilled ? 'currentColor' : 'none'" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true" focusable="false">
    <path v-for="(path, index) in iconPaths" :key="index" :d="path" />
    <circle v-if="name === 'settings'" cx="12" cy="12" r="3.2" />
  </svg>
</template>
<script>
const icons = {
  back: ['m15 18-6-6 6-6'], next: ['m9 18 6-6-6-6'], previous: ['m15 18-6-6 6-6'],
  add: ['M12 5v14', 'M5 12h14'], close: ['M18 6 6 18', 'M6 6l12 12'],
  edit: ['M14.5 5.5 18.5 9.5', 'M4 20l4.5-1 10-10a2.8 2.8 0 0 0-4-4l-10 10z'],
  book: ['M3 5a2 2 0 0 1 2-2h7v17H5a2 2 0 0 0-2 2V5z', 'M21 5a2 2 0 0 0-2-2h-7v17h7a2 2 0 0 1 2 2V5z'],
  image: ['M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z', 'M3 17l5-5 4 4 3-3 6 6', 'M16.5 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'],
  upload: ['M12 16V4', 'm7 9 5-5 5 5', 'M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3'],
  settings: ['M10 2h4l.6 2.4 1.2.5 2.1-1.3 2.8 2.8-1.3 2.1.5 1.2L22 10v4l-2.4.6-.5 1.2 1.3 2.1-2.8 2.8-2.1-1.3-1.2.5L14 22h-4l-.6-2.4-1.2-.5-2.1 1.3-2.8-2.8 1.3-2.1-.5-1.2L2 14v-4l2.4-.6.5-1.2-1.3-2.1 2.8-2.8 2.1 1.3 1.2-.5z'],
  preview: ['M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  star: ['m12 2.5 3 6.2 6.8 1-4.9 4.8 1.2 6.8-6.1-3.2-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1z'],
  starFilled: ['m12 2.5 3 6.2 6.8 1-4.9 4.8 1.2 6.8-6.1-3.2-6.1 3.2 1.2-6.8-4.9-4.8 6.8-1z'],
  sort: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  drag: ['M9 5h.01', 'M15 5h.01', 'M9 12h.01', 'M15 12h.01', 'M9 19h.01', 'M15 19h.01'],
  trash: ['M4 7h16', 'M9 7V4h6v3', 'M6 7l1 14h10l1-14', 'M10 11v6', 'M14 11v6'],
  swap: ['M3 7h17', 'm16 3 4 4-4 4', 'M21 17H4', 'm8 13-4 4 4 4'],
  retry: ['M20 11a8 8 0 1 0-2.2 6.5', 'M20 5v6h-6'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  zoom: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'm17 17 5 5', 'M8 11h6', 'M11 8v6'],
  check: ['m4 12 5 5L20 6'], lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 1 1 8 0v4'],
  users: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M4 21v-2a8 8 0 0 1 16 0v2', 'M18 5a3 3 0 0 1 0 6'],
  palette: ['M12 2a10 10 0 1 0 0 20h2a2 2 0 0 0 1-3.7 2 2 0 0 1 .9-3.8H18A4 4 0 0 0 22 10 9 9 0 0 0 12 2z', 'M6 11h.01', 'M9 6h.01', 'M15 6h.01'],
  comment: ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  danmu: ['M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z', 'M8 9.5h8', 'M8 12.5h5'],
  heart: ['M20.8 5.6a5.4 5.4 0 0 0-7.7 0L12 6.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-7.7a5.4 5.4 0 0 0 0-7.7z'],
  heartFilled: ['M20.8 5.6a5.4 5.4 0 0 0-7.7 0L12 6.7l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 21l8.8-7.7a5.4 5.4 0 0 0 0-7.7z'],
};
export default {
  name: 'MangaIcon',
  props: { name: { type: String, required: true } },
  computed: {
    iconPaths() { return icons[this.name] || icons.image; },
    isFilled() { return this.name === 'starFilled' || this.name === 'heartFilled'; },
  },
};
</script>
<style scoped>
.manga-icon { display: inline-block; width: 1.1em; height: 1.1em; flex: none; vertical-align: -0.16em; }
</style>
