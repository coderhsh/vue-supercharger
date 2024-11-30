# ⚡ Vue Supercharger

Language: **中文** | [English](README.md)

自动检测当前工作区 Vue 版本，为 Vue 2 与 Vue 3 项目智能匹配功能及精准注入代码片段，提升开发效率，优化开发体验

## 🌟 特性(功能)

💡 **Vue 代码片段** : 大幅提升你的编码速度。

#### Vue 代码片段 :

### <!-- Vue3 Snippets -->

<details open>

<summary style="cursor: pointer">Vue 3 代码片段</summary>

#### `cr⇥` | `ref⇥`:

```javascript
const foo = ref()
```

#### `cro⇥` :

```javascript
const foo = ref({})
```

#### `cra⇥` :

```javascript
const foo = ref([])
```

#### `vue⇥` :

```html
<template>
  <div></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less"></style>
```

#### `vFor⇥`:

```html
v-for="(item, index) in items" :key="index"
```

#### `setup⇥`:

```javascript
setup(props){
}
```

#### `onBeforeMount⇥`:

```javascript
onBeforeMount(() => {})
```

#### `onMounted⇥`:

```javascript
onMounted(() => {})
```

#### `onBeforeUpdate⇥`:

```javascript
onBeforeUpdate(() => {})
```

#### `onUpdated⇥`:

```javascript
onUpdated(() => {})
```

#### `onBeforeUnmount⇥`:

```javascript
onBeforeUnmount(() => {})
```

#### `onUnmounted⇥`:

```javascript
onUnmounted(() => {})
```

#### `onActivated⇥`:

```javascript
onActivated(() => {})
```

#### `onDeactivated⇥`:

```javascript
onDeactivated(() => {})
```

#### `comp⇥`:

```javascript
computed(() => {})
```

#### `watch⇥`:

```javascript
watch(foo, (newVal, oldVal) => {})
```

#### `watchEffect⇥`:

```javascript
watchEffect(() => {})
```

#### `defineExpose⇥`:

```javascript
defineExpose({})
```

#### `defineOptions⇥`:

```javascript
defineOptions({})
```

#### `defineProps⇥`:

```javascript
defineProps({})
```

#### `defineEmits⇥`:

```javascript
defineEmits([''])
```

#### `provide⇥`:

```javascript
provide('key', value)
```

</details>

### <!-- Vue2 Snippets -->

<details open>

<summary style="cursor: pointer">Vue 2 代码片段</summary>

#### `th⇥`:

```javascript
this.
```

#### `beforeCreate`

```javascript
  beforeCreate(){},
```

#### `created`

```javascript
  created(){},
```

#### `beforeMount`

```javascript
  beforeMount(){},
```

#### `mounted`

```javascript
  mounted(){},
```

#### `beforeUpdate`

```javascript
  beforeUpdate(){},
```

#### `updated`

```javascript
  updated(){},
```

#### `beforeDestroy`

```javascript
  beforeDestroy(){},
```

#### `destroyed`

```javascript
  destroyed(){},
```

#### `activated`

```javascript
  activated(){},
```

#### `deactivated`

```javascript
  deactivated(){},
```

#### `methods`

```javascript
methods: {
},
```

#### `props`

```javascript
props: {
},
```

#### `computed`

```javascript
computed: {
},
```

#### `components`

```javascript
components: {
},
```

#### `watch`

```javascript
watch: {
},
```

#### `filters`

```javascript
filters: {
},
```

#### `directives`

```javascript
directives: {
},
```

#### `vue`

```javascript
<template>
  <div></div>
</template>

<script>
export default {
  name: '',
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped lang="less"></style>

```

</details>

<!-- ### 💡 推荐编辑器设置:

```
"editor.snippetSuggestions": "top"
``` -->

## 📄 使用说明:

- 在`vue javascript typescript`文件中，你可以直接使用快捷触发器来插入代码片段。
- 扩展会根据项目中使用的 Vue 版本自动选择适当的代码片段。

---

## ⚙️ 配置:

Vue Supercharger 会根据你的项目在不同的 Vue 版本之间进行切换，但你可以自行设置以匹配你的偏好。

### 设置

1. 打开 vscode 设置.
2. 搜索 Vue Supercharger 从而修改配置选项.

---

## 🐛 常见问题

1. **我如何切换 Vue 版本支持功能?**

   Vue Supercharger 自动检测项目中的 Vue 版本，因此无需手动切换。

---

<!-- ## 📄 许可证

[MIT License](LICENSE). -->
