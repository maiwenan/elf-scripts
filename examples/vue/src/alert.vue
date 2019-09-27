<template>
  <transition name="gs-zoom-in-top">
    <div
      :class="{
        'gs-alert': true,
        [`gs-alert-${type}`]: !!type,
        'has-desc': desc || $slots.desc
      }"
      v-if="show"
    >
      <div class="gs-alert-icon" v-if="showIcon" :class='{"gs-alert-icon-top": !!desc}'>
        <slot name="icon">
          <gs-icon :name="icon"></gs-icon>
        </slot>
      </div>
      <div class="gs-alert-content">
        <div class="gs-alert-title" v-if="title || $slots.default">
          <slot>{{title}}</slot>
        </div>
        <div class="gs-alert-desc" v-if="desc || $slots.desc">
          <slot name="desc">{{desc}}</slot>
        </div>
        <div
          class="gs-alert-close"
          v-if="closable"
          @click="close"
        >
          <slot name="close">
            {{closeText}}
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'GsAlert',
  props: {
    title: String,
    type: {
      type: String,
      default: 'info'
    },
    desc: String,
    closeText: String,
    closable: {
      type: Boolean,
      default: true
    },
    icon: {
      type: String,
      default() {
        const iconMap = {
          info: 'info-circle',
          success: 'check-circle',
          error: 'close-circle',
          warning: 'exclamation-circle'
        };

        return iconMap[this.type];
      }
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: true
    };
  },
  methods: {
    close(event) {
      this.show = false;
      this.$emit('close', event);
    }
  }
};
</script>
