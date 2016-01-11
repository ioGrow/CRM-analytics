export function runBlock($log,$window, Pace) {
    'ngInject';
    $log.debug('runBlock end');
    Pace.start();
    $window.paceOptions = {
        // Disable the 'elements' source
        elements: false,

        // Only show the progress on regular and ajax-y page navigation,
        // not every request
        restartOnRequestAfter: false,
        ajax: false
    }
}



