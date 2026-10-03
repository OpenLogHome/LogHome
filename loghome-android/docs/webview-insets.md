# WebView system navigation and keyboard insets

The Activity draws edge to edge at the top, but reserves the bottom system
navigation area outside the WebView. This protects every H5 page, including
older bundled pages that do not implement bottom safe-area padding.

`WebViewBottomInsets.viewportBottom` chooses the larger of the navigation and
keyboard bottom insets. Both are measured from the window's bottom edge and
must not be added together. Navigation size is read ignoring visibility so a
temporary system-bar visibility change cannot remove the reserved space from
ordinary pages. The reader explicitly disables navigation reservation through
`setNavigationBarVisible(false)`; the keyboard still reserves space.

Since Android already consumes that space, the injected bridge reports zero
remaining `navigationBarHeight`, and both `--loghome-native-safe-bottom` and
`--loghome-safe-bottom` are zero. H5 must not add the same navigation padding
again. Top safe-area handling remains in H5. Browser-only H5 is unaffected.

Insets are synchronized after document loading, warm WebView route changes,
Activity resume, and explicit system-bar visibility changes. The native audio
player also moves above the reserved bottom area.

Validation:

```sh
./gradlew testDebugUnitTest assembleDebug
```

On a device, check the last chapter/add buttons and fixed store actions with
three-button and gesture navigation; open and close the keyboard; switch
between full-screen reading and ordinary pages; return from the background;
and repeat with preloaded routes. Full-screen reading may temporarily be
overlaid by system bars revealed with an edge swipe, as intended by Android.
