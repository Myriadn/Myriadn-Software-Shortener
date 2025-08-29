import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Button',
  props: {
    label: { type: String, required: true },
    variant: { type: String, default: 'primary' },
    onClick: { type: Function as () => void, required: false },
  },
  setup(props) {
    const baseClass = 'px-4 py-2 rounded font-semibold transition'
    const variants: Record<string, string> = {
      primary: 'bg-blue-500 text-white hover:bg-blue-600',
      secondary: 'bg-gray-500 text-white hover:bg-gray-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
    }

    return () => (
      <button class={`${baseClass} ${variants[props.variant]}`} onClick={props.onClick}>
        {props.label}
      </button>
    )
  },
})
