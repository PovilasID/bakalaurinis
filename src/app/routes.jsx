import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';

import HomeIndex from './components/index_home';
import UserLogin from './components/user/login';
import UserLogout from './components/user/logout';
import UserRegister from './components/user/register';
import UserProfile from './components/user/profile';
import Dashboard from './components/user/dashboard';
import ResetPassword from './components/user/reset_password';
import PEFDetails from './components/user/pef_details';
import DoctorsDashboard from './components/user/doctors_dashboard';
import requireAuth from './utils/authenticated';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomeIndex} />
        <Route path="/login" component={UserLogin} />
        <Route path="/logout" component={UserLogout} />
        <Route path="/register" component={UserRegister} />
        <Route path="/reset" component={ResetPassword} />
        <Route path="/profile" component={UserProfile} onEnter={requireAuth} />
        <Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
        <Route path="/doctors_dashboard" component={DoctorsDashboard} onEnter={requireAuth} />
        <Route path="/pef/:userId/:pefId" component={PEFDetails} onEnter={requireAuth} />

    </Route>

);
