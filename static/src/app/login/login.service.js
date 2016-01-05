/**
 * Created by Khalid GHIBOUB on 12/31/2015 AD.
 */
export class LoginService {
    constructor($auth, $state, toastr) {
        'ngInject';
        this.$auth = $auth;
        this.toastr = toastr;
        this.$state = $state;
    }

    authenticate(provider) {
        var vm = this;
        vm.$auth.authenticate(provider)
            .then(function () {
                vm.toastr.success('You have successfully signed in with ' + provider);
                vm.$state.go('onBoarding');
            })
            .catch(function (response) {
                vm.toastr.error(response.data.message);
            });
    }

}
