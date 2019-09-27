### 基本用法

::: demo
```html
<template>
  <div class="demo-page">
    <div class="demo-block">
      <strong>基本</strong>
      <rate v-model="value" />
    </div>

    <div class="demo-block">
      <strong>半星</strong>
      <rate
        v-model="halfValue"
        allow-half
      />
    </div>

    <div class="demo-block">
      <strong>只读</strong>
      <rate
        v-model="disabledValue"
        disabled
      />
    </div>

    <div class="demo-block">
      <strong>显示文案</strong>
      <rate
        v-model="textValue"
        show-text
      />
    </div>

    <div class="demo-block">
      <strong>自定义文案</strong>
      <rate
        v-model="textValue"
        show-text
      >{{ textValue }} 分</rate>
    </div>
  </div>
</template>
```
```js
<script>
export default {
  data() {
    return {
      value: 3,
      halfValue: 2.5,
      disabledValue: 3,
      textValue: 4
    };
  },

  computed: {

  }
};
</script>
```
:::

<script>
export default {
  data() {
    return {
      value: 3,
      halfValue: 2.5,
      disabledValue: 3,
      textValue: 4
    };
  },

  computed: {

  }
};
</script>


### Rate props

| 参数   | 说明  | 类型  | 可选值  | 默认值  |
|----------|---------|---------|-----------|-----------|
| value | 当前分数，可使用 v-model 绑定 | Number  | - | 0 |
| allow-clear | 是否允许再次点击后清除 | Boolean  | - | true |
| allow-half | 是否允许半选 | Boolean  | - | false |
| count | 星星的总数 | Number  | - | 5 |
| disabled | 是否只读 | Boolean | - | false |
| low-score | 低分数段和中等分数段的临界值，小于或等于该值的属于低分段 | Number  | - | 2 |
| high-score | 高分数段和中等分数段的临界值，大于或等于该值的属于高分段 | Number  | - | 4 |
| colors | 图标项的颜色数组，共有 3 个元素，为 3 个分段所对应的颜色 | Array | - | ['#fadb14', '#fadb14', '#fadb14'] |
| void-color | 未选中图标的颜色 | String | - | #c6d1de |
| disabled-void-color | 只读状态下，未选中图标的颜色 | String | - | #c6d1de |
| icon-classes | 图标的类名数组，共有 3 个元素，为 3 个分段所对应的类名 | Array | - | ['g-icon-star-fill', 'g-icon-star-fill', 'g-icon-star-fill'] |
| void-icon-class | 未选中图标的类名 | String | - | g-icon-star-fill |
| disabled-void-icon-class | 只读状态下，未选中图标的类名 | String | - | g-icon-star-fill |
| show-text | 是否显示文案 | Boolean | - | false |
| text-color | 文案的颜色值 | String | - | #1f2d3d |
| texts | 文案数组，对应于分数值 | Array | - | ['极差', '失望', '一般', '满意', '惊喜'] |


### Rate events
| 事件名称   | 说明  | 回调参数  |
|----------|---------|---------|
| change | 评分改变时的回调 | 返回分数作为参数 |

### Rate slot
| name   | 说明  |
|----------|---------|
| 无 | 自定义文案的显示 |
