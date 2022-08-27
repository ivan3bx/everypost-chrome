import '../assets/styles.css'
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import Popup from "../view/popup.vue";
import Actions from "../view/actions.vue";

const routes = [
  { path: '/actions', component: Actions },
  { path: "/", component: Popup },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

//
// Initialize popup contents based on logged-in state
//
if (chrome.storage) {
  //
  // This only runs in context of chrome extension
  //
  chrome.storage.local.get({ logged_in: false }, (data) => {
    const component = data.logged_in ? Actions : Popup
    createApp(component).use(router).mount("#app")
  })
} else {
  //
  // Debugging component in normal web context
  //
  createApp(Popup).use(router).mount("#app")
}
