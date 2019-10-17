<script>
export default {
  name: 'RateItem',

  props: {
    index: {
      type: Number,
      default: undefined
    },
    half: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    },
    halfColor: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    }
  },

  methods: {
    handleClick() {
      this.$emit('select', this.index);
    },
    handleHalfClick() {
      this.$emit('select', this.index - 0.5);
    },
    handleMouseEnter() {
      this.$emit('enter', this.index);
    },
    handleHalfEnter() {
      this.$emit('halfenter', this.index);
    }
  },

  render() {
    const {
      half,
      color,
      halfColor,
      iconClass
    } = this;

    return (
      <div class="g-rate-item">
        <i
          class={iconClass}
          style={{
            color: color
          }}
          on-mouseenter={this.handleMouseEnter}
          on-click={this.handleClick}
        />
        {half ? (
          <i
            class={`${iconClass} is-half`}
            style={{
              color: halfColor
            }}
            on-mouseenter={this.handleHalfEnter}
            on-click={this.handleHalfClick}
          />
        ) : null}
      </div>
    );
  }
};
</script>
