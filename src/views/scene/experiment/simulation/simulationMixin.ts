import { ref, onBeforeUnmount } from "vue"

import { dispose } from "./methods/common/initScene"

export function simulationMixin() {
  onBeforeUnmount(() => {
    dispose()
  })
}
