import HomePage from './components/home/index.jsx';
import NotFoundPage from './containers/layouts/NotFoundPage';
import PanelRightPage from './containers/layouts/PanelRightPage';

import ProfileShow from './components/profiles/show';
import ProfileIndex from './components/profiles/index';
import ProfileCreate from './components/profiles/create';
import ProfileUpdate from './components/profiles/update';

import CourseShow from './components/courses/show';
import CourseIndex from './components/courses/index';
import CourseCreate from './components/courses/create';
import CourseUpdate from './components/courses/update';

import FacultyShow from './components/faculties/show';
import FacultyIndex from './components/faculties/index';


import Login from './components/users/Login';
import LoginJwt from './components/users/LoginJwt';
import SignUp from './components/users/SignUp';
import Verification from './components/users/Verification';


export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/login/',
    component: Login,
  },
  {
    path: '/sign_up/',
    component: SignUp,
  },
  {
    path: '/verification/:email',
    component: Verification,
  },
  {
    path: '/login_jwt/:token',
    component: LoginJwt,
  },
  {
    path: '/panel-right/',
    component: PanelRightPage,
  },

  {
    path: '/profiles/',
    component: ProfileIndex,
  },
  {
    path: '/profiles/:profileId/edit',
    component: ProfileUpdate,
  },
  {
    path: '/profiles/new',
    component: ProfileCreate,
  },
  {
    path: '/profiles/:profileId',
    component: ProfileShow,
  },


  {
    path: '/courses/',
    component: CourseIndex,
  },
  {
    path: '/courses/:courseId/edit',
    component: CourseUpdate,
  },
  {
    path: '/courses/new',
    component: CourseCreate,
  },
  {
    path: '/courses/:courseId',
    component: CourseShow,
  },

  {
    path: '/faculties/',
    component: FacultyIndex,
  },
  {
    path: '/faculties/:facultyId',
    component: FacultyShow,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];
