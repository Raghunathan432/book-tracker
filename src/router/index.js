import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home'
import CreateBookRecord from '../components/CreateBookRecord'
import EditRecord from '../components/EditRecord'
import SignIn from '../components/Signin'
import Changelog from '../components/Changelog'
import PageNotFound from '../components/PageNotFound'

Vue.use(VueRouter)

const routes = [
  
  {
    path: '/home',
    name: 'Home',
    component: Home,
  },
  {
    path: '/',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/createRecord',
    name: 'CreateBookRecord',
    component: CreateBookRecord,
  },
  {
    path: '/edit',
    name: 'EditRecord',
    component: EditRecord,
  },
  {
    path: '/changelog',
    name: 'Changelog',
    component: Changelog
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound

  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
