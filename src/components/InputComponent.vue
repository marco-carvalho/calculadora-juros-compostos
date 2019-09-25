<template lang="pug">
div
  label.block.font-bold {{label}}:
  input.h-6.border-b.w-full(
    :value="value"
    class="focus:outline-none"
    :class="disabled ? 'bg-gray-300 border-red-500' : 'border-green-500'"
    @input="$emit('input', $event.target.value)"
    :disabled="disabled"
    :type="type"
    :placeholder="placeholder"
  )
</template>

<script>
export default {
  props: {
    label: String,
    value: Number,
    disabled: Boolean,
    type: String,
    placeholder: String,
  }
}
</script>