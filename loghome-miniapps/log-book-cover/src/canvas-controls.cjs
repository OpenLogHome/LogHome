// Shared by the new-project dialog and the editor's Size panel.
function canvasControls(h,format) {
  return {
    props:['width','height','error'], emits:['change','reset'],
    render() {
      const field=(key,label)=>h('label',{class:'book-size-field'},[
        h('span',null,label+'（px）'),h('input',{type:'number',inputmode:'numeric',min:format.MIN_SIDE,max:format.MAX_SIDE,step:1,
          value:this[key],'aria-label':'画布'+label,'aria-invalid':!!this.error,
          onInput:event=>this.$emit('change',{width:this.width,height:this.height,[key]:event.target.value})})
      ]);
      return h('section',{class:'book-canvas-controls','aria-label':'画布尺寸'},[
        h('div',{class:'book-size-heading'},[h('strong',null,'画布尺寸'),h('button',{type:'button',onClick:()=>this.$emit('reset')},'书籍默认 · 2×')]),
        h('div',{class:'book-size-fields'},[field('width','宽度'),field('height','高度')]),
        h('p',{class:this.error?'book-size-error':'book-size-hint',role:this.error?'alert':undefined},
          this.error || `默认 998 × 1292 px · 可自定义 ${format.MIN_SIDE}–${format.MAX_SIDE} px`)
      ]);
    }
  };
}
module.exports = canvasControls;
