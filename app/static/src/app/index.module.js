/* global malarkey:false, moment:false, Pace:false, Highcharts:false */

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { GithubContributorService } from '../app/components/githubContributor/githubContributor.service';
import { WebDevTecService } from '../app/components/webDevTec/webDevTec.service';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { MalarkeyDirective } from '../app/components/malarkey/malarkey.directive';
import '../app/on_boarding/onBoarding.module';
import '../app/login/login.module';

angular.module('CRMAnalytics', ['restangular', 'ui.router', 'toastr', 'highcharts-ng','daterangepicker',
    'CRMAnalytics.onBoarding', 'CRMAnalytics.login'])
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('Pace', Pace)
    .constant('Highcharts', Highcharts)
    .config(config)
    .config(routerConfig)
    .run(runBlock)
    .service('githubContributor', GithubContributorService)
    .service('webDevTec', WebDevTecService)
    .controller('MainController', MainController)
    .directive('acmeNavbar', NavbarDirective)
    .directive('acmeMalarkey', MalarkeyDirective);
