import { shallowMount } from '@vue/test-utils'
import Popup from '@/view/popup.vue'

describe('Popup.vue', () => {
  it('renders default Sign In window', () => {
    const msg = 'Sign In'
    const wrapper = shallowMount(Popup, {
      props: { msg }
    })
    console.log(wrapper.text())
    expect(wrapper.text()).toMatch(msg)
  })
})
