/**
 * Created by Khalid GHIBOUB on 12/28/2015 AD.
 */
export class OnBoardingController {
    constructor(Restangular, $state, $scope, toastr) {
        'ngInject';

        Restangular.one('properties').get().then(function (result) {
            $scope.properties = result.properties;
            var id = Object.keys(result.properties[0].profiles)[0]
            $scope.selectedProfile = {
                'id': id
            }
        }).catch(function (error) {
            toastr.error(error.data.message);
            $state.go('home')
        });
        $scope.selectProperty = function () {
            var params = {profile_id: $scope.selectedProfile.id};
            var baseProfiles = Restangular.all('properties');
            baseProfiles.post(params).then(function () {
                $state.go('home');
            });
        };
    }

}
