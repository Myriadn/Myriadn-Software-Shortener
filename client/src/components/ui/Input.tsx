import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Input',
  props: {
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const onInput = (e: Event) => {
      const target = e.target as HTMLInputElement
      emit('update:modelValue', target.value)
    }

    return () => (
      <input
        type={props.type}
        placeholder={props.placeholder}
        value={props.modelValue}
        onInput={onInput}
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
      />
    )
  },
})
