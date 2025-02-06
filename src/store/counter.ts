import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(100)
  const doubleCount = computed(() => count.value * 2)
  const changeCountAction = (newCount: number) => {
    count.value = newCount
  }
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment, changeCountAction }
})
