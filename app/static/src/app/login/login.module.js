/**
 * Created by Khalid GHIBOUB on 12/28/2015 AD.
 */

import { LoginController } from './controllers/login.controller';
import { LoginService } from './login.service';

angular.module('CRMAnalytics.login', ['restangular', 'ui.router', 'toastr', 'satellizer'])
    .config(routerConfig)
    .config(config)
    .controller('LoginController', LoginController)
    .service('login', LoginService);


function routerConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/views/login.html',
            controller: 'LoginController',
            controllerAs: 'login'
        });
}

export function config($logProvider, $authProvider) {
    'ngInject';
    $authProvider.google({
        clientId: '54646190950-4a0vuan4eerv99ro226trhsl93mmh65r.apps.googleusercontent.com',
        requiredUrlParams: ['scope', 'approval_prompt', 'access_type'],
        scope: ['https://www.googleapis.com/auth/plus.me',
            'https://www.googleapis.com/auth/analytics',
            'https://www.googleapis.com/auth/analytics.edit',
            'https://www.googleapis.com/auth/analytics.manage.users',
            'https://www.googleapis.com/auth/analytics.manage.users.readonly',
            'https://www.googleapis.com/auth/analytics.provision',
            'https://www.googleapis.com/auth/analytics.readonly',
            'https://www.googleapis.com/auth/userinfo.email'],
        scopePrefix: '',
        approvalPrompt: 'force',
        accessType: 'offline'
    });
}
