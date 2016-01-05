/**
 * Created by Khalid GHIBOUB on 12/28/2015 AD.
 */
export class LoginController {
    constructor(login) {
        'ngInject';
        var vm = this;
        vm.authenticate = function (provider) {
            login.authenticate(provider);
        };
    }

}
