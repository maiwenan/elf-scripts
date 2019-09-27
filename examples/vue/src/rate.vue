<script>
import RateItem from './rate-item.vue';

export default {
  name: 'Rate',

  props: {
    allowClear: {
      type: Boolean,
      default: true
    },
    allowHalf: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 5
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Number,
      default: 0
    },
    lowScore: {
      type: Number,
      default: 2
    },
    highScore: {
      type: Number,
      default: 4
    },
    colors: {
      type: Array,
      default() {
        return ['#fadb14', '#fadb14', '#fadb14'];
      }
    },
    voidColor: {
      type: String,
      default: '#c6d1de'
    },
    disabledVoidColor: {
      type: String,
      default: '#c6d1de'
    },
    iconClasses: {
      type: Array,
      default() {
        return ['g-icon-star-fill', 'g-icon-star-fill', 'g-icon-star-fill'];
      }
    },
    voidIconClass: {
      type: String,
      default: 'g-icon-star-fill'
    },
    disabledVoidIconClass: {
      type: String,
      default: 'g-icon-star-fill'
    },
    showText: {
      type: Boolean,
      default: false
    },
    textColor: {
      type: String,
      default: '#1f2d3d'
    },
    texts: {
      type: Array,
      default() {
        return ['极差', '失望', '一般', '满意', '惊喜'];
      }
    }
  },

  data() {
    return {
      current: this.value,
      hoverIndex: -1,
      halfHoverIndex: -1
    };
  },

  methods: {
    handleSelect(index) {
      if (this.disabled) {
        return;
      }
      if (this.allowClear && this.current === index) {
        this.current = 0;
      } else {
        this.current = index;
      }
      this.$emit('input', this.current);
      this.$emit('change', this.current);
    },

    handleEnter(index) {
      if (this.disabled) {
        return;
      }
      this.hoverIndex = index;
      this.halfHoverIndex = -1;
    },

    handleHalfEnter(index) {
      if (this.disabled) {
        return;
      }
      this.hoverIndex = -1;
      this.halfHoverIndex = index;
    },

    handleMouseLeave() {
      if (this.disabled) {
        return;
      }
      this.hoverIndex = -1;
      this.halfHoverIndex = -1;
    },

    renderItems() {
      const {
        current,
        hoverIndex,
        halfHoverIndex,

        disabled,
        count,
        allowHalf,
        lowScore,
        highScore,
        colors,
        voidColor,
        disabledVoidColor,
        iconClasses,
        voidIconClass,
        disabledVoidIconClass
      } = this;
      let items = [];

      for (let i = 1; i <= count; i++) {
        const isActive = i <= current;
        const level = i <= lowScore ? 0 : (i >= highScore ? 2 : 1);
        let iconClass = disabled ? disabledVoidIconClass : voidIconClass;
        let inactiveColor = disabled ? disabledVoidColor : voidColor;
        let color = inactiveColor;
        let halfColor = inactiveColor;

        if (isActive) {
          iconClass = iconClasses[level];
          color = colors[level];
        }
        if (Math.ceil(current) >= i) {
          halfColor = colors[level];
        }

        if (i <= hoverIndex || i < halfHoverIndex) {
          color = colors[level];
        } else if (hoverIndex !== -1 || halfHoverIndex !== -1) {
          color = inactiveColor;
        }

        if (i <= hoverIndex || i <= halfHoverIndex) {
          halfColor = colors[level];
        } else if (hoverIndex !== -1 || halfHoverIndex !== -1) {
          halfColor = inactiveColor;
        }

        items.push((
          <RateItem
            key={i}
            index={i}
            half={allowHalf}
            active={isActive}
            iconClass={iconClass}
            color={color}
            halfColor={halfColor}
            on-enter={this.handleEnter}
            on-halfenter={this.handleHalfEnter}
            on-select={this.handleSelect}
          />
        ));
      }

      return items;
    }
  },

  render() {
    const {
      disabled,
      showText,
      textColor,
      texts
    } = this;
    const items = this.renderItems();
    const text = texts[Math.ceil(this.current) - 1];
    const children = this.$slots.default;

    return (
      <div class={`g-rate ${disabled ? 'is-disabled' : ''}`}>
        <div
          class="g-rate-list"
          on-mouseleave={this.handleMouseLeave}
        >
          {items}
        </div>
        {showText ? (
          <div
            class="g-rate-text"
            style={{
              color: textColor
            }}
          >{children || text}</div>
        ) : null}
      </div>
    );
  }
};
</script>
