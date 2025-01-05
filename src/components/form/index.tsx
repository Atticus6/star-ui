export const A = defineComponent({
  name: 'A',
  setup() {
    const a = ref(0)

    return () => <div onClick={() => a.value++}>{a.value}</div>
  },
})
