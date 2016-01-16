/**
 * Created by Khalid GHIBOUB on 12/28/2015 AD.
 */

import { OnBoardingController } from './controllers/onBoarding.controller';

angular.module('CRMAnalytics.onBoarding', ['restangular', 'ui.router', 'toastr', 'satellizer', 'highcharts-ng'])
    .config(routerConfig)
    .controller('OnBoardingController', OnBoardingController);


function routerConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('onBoarding', {
            url: '/on_boarding',
            templateUrl: 'app/on_boarding/views/on_boarding.html',
            controller: 'OnBoardingController',
            controllerAs: 'boarding'
        });
}
