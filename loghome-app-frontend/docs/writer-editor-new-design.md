# Writer Editor New Design

## Goal

Build a new chapter editor that is fully compatible with the current chapter writing flow while replacing the editing core with a more maintainable document model. This first version does not include realtime collaboration or AI writing, but it must leave a clean path for both.

## Scope

In scope:

- Replace `uni-app <editor>` with a richer editing core.
- Keep existing chapter load, autosave, local backup, cloud writer history, publish, schedule publish, and conflict resolution flows.
- Keep the current persisted chapter content format:
  - `[{ type: "text", value: string }, { type: "image", img: string }]`
- Keep the current backend API contract:
  - `GET /essays/get_article_writer`
  - `POST /essays/sync_article_writer_from_reader`
  - `POST /essays/upload_article_writer`
  - `POST /essays/modify_article`
  - `GET /essays/get_article_history`

Out of scope for this phase:

- Realtime collaborative editing
- Comment threads / review suggestions
- AI rewrite / completion / outline generation
- Backend schema changes

## Existing Constraints

The current writer flow is larger than a text editor. The editor page owns:

- Title editing
- Rich content editing
- Fast save and slow save
- Local Dexie backup
- Cloud `articles_writer` history
- Version conflict selection
- Publish and schedule publish
- Theme and typography settings
- Image upload
- Writing task reporting
- iframe communication

The legacy `content` field is consumed directly by reader pages, history pages, and text counting logic. That means the new editor cannot switch persistence formats yet.

## Core Decision

Use Tiptap as the editor core.

Why:

- It is built on ProseMirror, so it has a strong document model and extension system.
- It is better suited than the current `uni-app <editor>` for future collaboration, annotations, suggestion mode, and AI insertion points.
- It supports Vue 2 through `@tiptap/vue-2`, which matches the current frontend stack.

## Compatibility Strategy

The new editor keeps two layers:

1. Editor document layer
   - Tiptap document JSON
   - Internal editing state
2. Persistence compatibility layer
   - Convert between Tiptap doc and legacy chapter `content`

This allows the new editor UI and core to evolve without forcing backend or reader-side migration now.

## Page Architecture

### `chapterEditorNew.vue`

Responsibilities:

- Page shell and layout
- Theme / typography settings
- Editor toolbar actions
- Publish / schedule publish actions
- Local autosave timer orchestration
- Conflict dialog integration

### `lib/writerEditorLegacyAdapter.js`

Responsibilities:

- Parse legacy content safely
- Convert legacy blocks to Tiptap doc
- Convert Tiptap doc back to legacy blocks
- Count text / image metrics
- Apply the current auto-formatting rules in a format-agnostic way

This isolates the migration seam. Future collaboration and AI features should work against the Tiptap document layer, not against the legacy serialized format.

## Data Model

### Legacy persisted content

```json
[
  { "type": "text", "value": "段落文本" },
  { "type": "image", "img": "https://..." }
]
```

### Tiptap document

Initial supported nodes:

- `doc`
- `paragraph`
- `text`
- `hardBreak`
- `image`

This keeps the editing model close to current behavior while moving onto a stronger core.

## Initialization Flow

1. Read `chapterId` and writer settings.
2. Load latest writer draft from `/essays/get_article_writer`.
3. Load local Dexie history for the same chapter.
4. If local and cloud versions diverge:
   - show conflict dialog
   - keep either local or cloud version
   - force-save the chosen result back to local and cloud
5. Convert chosen legacy content into Tiptap doc.
6. Create editor instance.
7. Start autosave timers.

## Save Model

Keep the current save semantics.

### Fast save

- Trigger after user stops typing for about 1 second
- Update latest local fast-save snapshot
- Update latest `articles_writer` row using `is_fast_save = true`

### Slow save

- Trigger when leaving the page or after enough structural changes
- Insert a new local history snapshot
- Insert a new `articles_writer` history row

### Publish

- Continue to use `POST /essays/modify_article`
- Continue to publish legacy `content`

## Autosave and History Rules

Reuse the existing behavior as much as possible:

- Dexie remains the local durability layer
- `articles_writer` remains the cloud working-history layer
- Published chapter content remains the reader truth source

The new page should not change these persistence semantics in phase 1.

## Formatting Rules

The current editor has one important authoring affordance: normalize paragraphs and optionally insert blank lines between paragraphs. The new editor keeps that behavior by applying formatting on the legacy block representation, then reloading the editor content from the formatted result.

## Future Collaboration Path

This phase prepares the future path in three ways:

- The editor now has a structured document core.
- Legacy serialization is isolated behind an adapter.
- Page logic can later be split into:
  - editor core
  - persistence service
  - collaboration service
  - AI suggestion service

Planned next schema additions after phase 1:

- `revision_id`
- `base_revision_id`
- separate comment / suggestion / presence models
- optional Tiptap JSON persistence beside legacy content

## Risks

- Tiptap is effectively an H5-first editor in this project. The first rollout should be validated on the actual target runtimes before replacing the current page.
- Current reader-side rendering still only understands plain text blocks and images, so rich formatting must remain constrained for now.
- The current autosave logic is page-owned and duplicated. This is acceptable for phase 1, but should be extracted next.

## Rollout Plan

1. Add `chapterEditorNew.vue` alongside the old page.
2. Keep the old page as fallback.
3. Validate load, save, history, publish, schedule publish, image upload, and conflict handling.
4. Switch entry points after acceptance.
5. Extract persistence logic into shared service before collaboration or AI work starts.
