/**
 * 组件由 VK 进行了二次封装
 * 在这里设置默认配置
 * 完整的配置文档: https://www.tiny.cloud/docs/tinymce/latest/editor-important-options
 */
const config = {
	// 使用的插件列表（插件需要在 static/plugs/tinymce/plugins/ 目录存在才行）
	plugins: [
		'advlist',
		'autolink',
		//'autosave', // 这个自动保存草稿体验不好
		'code',
		'codesample',
		'directionality',
		'emoticons',
		'fullscreen',
		'image',
		'images',
		'insertdatetime',
		'link',
		'lists',
		'media',
		'nonbreaking',
		'preview',
		'save',
		'searchreplace',
		'table',
		'visualblocks',
		'visualchars',
		'wordcount'
	],
	// 工具栏
	toolbar: [
		'bold italic underline strikethrough alignleft aligncenter alignright outdent indent blockquote undo redo removeformat subscript superscript',
		'hr bullist numlist image images media link table insertdatetime forecolor backcolor codesample code preview fullscreen'
	],
	// 菜单栏
	menubar: "file edit insert view format table tools",
	body_class: "panel-body",
	object_resizing: false,
	end_container_on_empty_block: true,
	powerpaste_word_import: "clean",
	code_dialog_height: 450,
	code_dialog_width: 1000,
	advlist_bullet_styles: "square",
	advlist_number_styles: "default",
	default_link_target: "_blank",
	font_size_formats: "12px 13px 14px 15px 16px 18px 20px 24px 36px 48px",
	line_height_formats: "1 1.2 1.5 1.6 1.8 2 2.4",
	link_title: false,
	branding: false,
	nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
	image_advtab: false,
	insertdatetime_element: false,
	insertdatetime_formats: ["%H:%M:%S", "%H时%M分%S秒", "%Y-%m-%d", "%Y年%m月%d日", "%Y-%m-%d %H:%M:%S", "%Y年%m月%d日 %H时%M分%S秒"],
	file_picker_types: "file image media",
	// autosave_ask_before_unload: false, // 当关闭或跳转URL时，弹出提示框提醒用户仍未保存变更内容。默认开启提示。
	// autosave_interval: "30s", // 自动存稿的世界间隔 只支持秒为单位
	// autosave_prefix: "tinymce-autosave-{path}{query}-{id}-",
	// autosave_restore_when_empty: true,
	// autosave_retention: "30m",
	object_resizing: true, // 启用图片拖动调整大小
	resize_img_proportional: true, // 图片保持比例缩放
	// 代码示例插件文档：https://www.tiny.cloud/docs/tinymce/latest/codesample/
	codesample_languages: [
		{ text: 'UniApp', value: 'markup' },
		{ text: 'Vue', value: 'markup' },
		{ text: 'HTML/XML', value: 'markup' },
		{ text: 'JavaScript', value: 'javascript' },
		{ text: 'CSS', value: 'css' },
		{ text: 'Java', value: 'java' },
		{ text: 'PHP', value: 'php' },
		{ text: 'Python', value: 'python' },
		{ text: 'Ruby', value: 'ruby' },
		{ text: 'C', value: 'c' },
		{ text: 'C#', value: 'csharp' },
		{ text: 'C++', value: 'cpp' }
	],
	codesample_global_prismjs: true,
	mobile: {
		menubar: true,
		toolbar_mode: "floating"
	},
};
export default config
