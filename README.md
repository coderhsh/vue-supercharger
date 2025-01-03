# ⚡ Vue Supercharger

Language: **English** | [中文](README.zh-CN.md)

Vue Supercharger is an extension designed to enhance Vue development by improving efficiency and the overall development experience. It automatically detects the Vue version in your workspace and provides corresponding features and snippets for Vue 2 or Vue 3 projects. The extension intelligently adapts to your project's needs, offering the most suitable functionality for your development workflow.

## 🌟 Features

- 💡 **Vue Snippets**: dramatically increase your coding speed and efficiency.

### Vue Snippets :

### <!-- Vue3 Snippets -->

<details open>

<summary style="cursor: pointer">Vue 3 Snippets</summary>

#### `cr` :

```javascript
const foo = ref()
```

#### `cro` :

```javascript
const foo = ref({})
```

#### `cra` :

```javascript
const foo = ref([])
```

#### `onBeforeMount`:

```javascript
onBeforeMount(() => {})
```

#### `onMounted`:

```javascript
onMounted(() => {})
```

#### `onBeforeUpdate`:

```javascript
onBeforeUpdate(() => {})
```

#### `onUpdated`:

```javascript
onUpdated(() => {})
```

#### `onBeforeUnmount`:

```javascript
onBeforeUnmount(() => {})
```

#### `onUnmounted`:

```javascript
onUnmounted(() => {})
```

#### `onActivated`:

```javascript
onActivated(() => {})
```

#### `onDeactivated`:

```javascript
onDeactivated(() => {})
```

#### `comp`:

```javascript
computed(() => {})
```

#### `watch`:

```javascript
watch(foo, (newVal, oldVal) => {})
```

#### `watchEffect`:

```javascript
watchEffect(() => {})
```

#### `defineExpose`:

```javascript
defineExpose({})
```

#### `defineOptions`:

```javascript
defineOptions({})
```

#### `defineProps`:

```javascript
defineProps({})
```

#### `defineEmits`:

```javascript
defineEmits([''])
```

#### `setup`:

```javascript
setup(props){
}
```

#### `provide`:

```javascript
provide('key', value)
```

#### `vue` :

```html
<template>
  <div></div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less"></style>
```

</details>

### <!-- Vue2 Snippets -->

<details open>

<summary style="cursor: pointer">Vue 2 Snippets</summary>

#### `th`:

```javascript
this.
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

<!-- ### 💡 Recommended editor settings:

```
"editor.snippetSuggestions": "top"
``` -->

## 📄 Usage

- In `vue javascript typescript` files, you can directly use the shortcut triggers to insert code snippets.
- The extension automatically selects the appropriate snippets based on the Vue version used in your project.

---

## ⚙️ Configuration

Vue Supercharger automatically switches between Vue versions based on your project, but you can customize the settings to match your preferences.

### Settings

1. Open **Settings** in VSCode.
2. Search for **Vue Supercharger** to modify the configuration options.

---

## 🐛 FAQ

1. **How do I switch Vue version support?**

   Vue Supercharger automatically detects the Vue version in your workspace, so manual switching is usually not required. If the detection is incorrect, you can click on the Vue version in the status bar to switch.

---

<!-- ## 📄 License

[MIT License](LICENSE). -->
