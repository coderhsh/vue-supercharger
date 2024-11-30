1.非法值检测
workspace.onDidChangeConfiguration((e) => {
if (e.affectsConfiguration('vue-supercharger')) {
const vueSelection = workspace.getConfiguration('vue-supercharger').get<string>('vueSelection', 'auto');
if (!['vue2', 'vue3', 'both', 'none', 'auto'].includes(vueSelection)) {
window.showWarningMessage(
'检测到不兼容的 Vue 配置，已重置为默认值。',
'了解更多'
).then(() => {
workspace.getConfiguration('vue-supercharger').update('vueSelection', 'auto', ConfigurationTarget.Workspace);
});
}
}
});

2.研究 volar 和 Vue 3 Support - All In One 代码仓库中的 package.json 实现只在 vue 的 template 下生效的代码片段

3.研究如何支持 prefix 是一个数组
