export function NavbarDirective() {
    'ngInject';

    let directive = {
        restrict: 'E',
        templateUrl: 'app/components/navbar/navbar.html',
        scope: {
            creationDate: '='
        },
        controller: NavbarController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

class NavbarController {
    constructor(moment, $auth) {
        'ngInject';

        // "this.creation" is available by directive option "bindToController: true"
        this.relativeDate = moment(this.creationDate).fromNow();
        this.isAuthenticated = function () {
            return $auth.isAuthenticated();
        };
        this.logout = function () {
            return $auth.logout();
        };
    }
}
