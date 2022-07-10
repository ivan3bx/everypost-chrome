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


// replace this with a lookup to some endpoint (everypost.in/api/auth_status)
// which returns 200 if user is authenticated, or 403/404 if not.
//
// render the authentication popup if != 200, otherwise return the root "success" modal
chrome.storage.local.get({ logged_in: false }, (data) => {
  const component = data.logged_in ? Actions : Popup
  createApp(component).use(router).mount("#app")
})

