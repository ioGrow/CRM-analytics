export function config($logProvider, toastrConfig, $authProvider) {
    'ngInject';
    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
    $authProvider.google({
        clientId: '54646190950-4a0vuan4eerv99ro226trhsl93mmh65r.apps.googleusercontent.com',
        requiredUrlParams: ['scope','approval_prompt', 'access_type'],
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
