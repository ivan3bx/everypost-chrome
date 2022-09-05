import { shallowMount } from '@vue/test-utils'
import LoggedIn from '@/view/logged_in.vue'

describe('LoggedIn.vue', () => {
  it('renders default Sign In window', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const wrapper = shallowMount(LoggedIn, {
      attachTo: div
    })

    expect(wrapper.text()).toMatch("Add Bookmark")
    expect(wrapper.text()).toMatch("Related Links")
    expect(div.querySelectorAll("nav > a").length).toEqual(2)
  })
})
