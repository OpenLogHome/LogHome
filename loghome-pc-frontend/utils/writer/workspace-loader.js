let workspacePromise;

// Intent preloading and the editor route share one request. A failed load can retry.
export function loadWriterWorkspace() {
  if (!workspacePromise) {
    workspacePromise = import(/* webpackChunkName: "writer-workspace" */ "~/components/write/WriterWorkspace.vue")
      .catch((error) => {
        workspacePromise = null;
        throw error;
      });
  }
  return workspacePromise;
}

export function preloadWriterWorkspace() {
  return loadWriterWorkspace().catch(() => {});
}
