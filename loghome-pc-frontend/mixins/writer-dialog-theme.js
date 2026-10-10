// Element UI appends dialogs to body, so they need explicit workspace theme tokens.
export default {
  computed: {
    writerDialogClass() {
      const theme =
        (this.preferences && this.preferences.theme) || this.theme || "light";
      return `writer-dialog theme-${theme}`;
    },
  },
  methods: {
    writerMessage(type, message) {
      return this.$message({
        type,
        message,
        customClass: this.writerDialogClass.replace(
          "writer-dialog",
          "writer-notice"
        ),
      });
    },
    writerConfirm(message, title, options = {}) {
      return this.$confirm(message, title, {
        ...options,
        customClass: this.writerDialogClass,
      });
    },
    writerPrompt(message, title, options = {}) {
      return this.$prompt(message, title, {
        ...options,
        customClass: this.writerDialogClass,
      });
    },
  },
};
