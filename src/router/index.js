import { createRouter, createWebHistory } from "vue-router";
import SalesPage from "@/pages/SalesPage.vue";
import OrdersPage from "@/pages/OrdersPage.vue";
import StocksPage from "@/pages/StocksPage.vue";
import IncomesPage from "@/pages/IncomesPage.vue";

const routes = [
  { path: "/", redirect: "/sales" },
  { path: "/sales", component: SalesPage },
  { path: "/orders", component: OrdersPage },
  { path: "/stocks", component: StocksPage },
  { path: "/incomes", component: IncomesPage },
  { path: "/:pathMatch(.*)*", redirect: "/sales" },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
