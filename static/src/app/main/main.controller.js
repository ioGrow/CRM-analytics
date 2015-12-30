export class MainController {
    constructor($timeout, $auth, $state, $log, webDevTec, toastr, Restangular, moment) {
        'ngInject';
        var vm = this;
        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.toastr = toastr;
        vm.isAuthenticated = function () {
            return $auth.isAuthenticated()
        };
        vm.dateRange = {
            startDate: moment().subtract(29, 'days'),
            endDate: moment().add(1, 'days')
        };

        vm.getNewVisitors = function (startDate, endDate) {
            Restangular.one('new_visitors').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                var data = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    data.push([moment(item[1]).valueOf(), parseInt(item[0])])
                }
                vm.newVisitorsChartConfig = angular.copy(vm.chartConfig);
                vm.newVisitorsChartConfig.options.title.text = 'New Visitors';
                vm.newVisitorsChartConfig.series = [{data: data, name: 'new visitors'}];
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getBouncesRates = function (startDate, endDate) {
            Restangular.one('bounce_rate').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                var data = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    data.push([moment(item[1]).valueOf(), parseInt(item[0])])
                }
                vm.bounceRateChartConfig = angular.copy(vm.chartConfig);
                vm.bounceRateChartConfig.options.chart.type = 'column';
                vm.bounceRateChartConfig.options.title.text = 'Bounce Rate';
                vm.bounceRateChartConfig.options.subtitle.text = 'Visits in which the person left your site from' +
                    ' the entrance page without interacting with the page';
                vm.bounceRateChartConfig.series.push({data: data, name: 'Bounce Rate'});
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.haveAnalytics = function(){
            return Restangular.one('accounts').get().then(function (resp) {
                $log.info(resp.data);
            }).catch(function(){

            });
        }
        if (vm.isAuthenticated()) {
            if (vm.haveAnalytics()) {
                vm.getNewVisitors(vm.dateRange.startDate, vm.dateRange.endDate);
                vm.getBouncesRates(vm.dateRange.startDate, vm.dateRange.endDate);
            }

        }

        vm.dataPickerOptions = {
            ranges: {
                'Last 7 Days': [moment().subtract(6, 'days'), moment().add(1, 'days')],
                'Last 30 Days': [moment().subtract(29, 'days'), moment().add(1, 'days')],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            eventHandlers: {
                'apply.daterangepicker': function () {
                    vm.getNewVisitors(vm.dateRange.startDate, vm.dateRange.endDate);
                    vm.getBouncesRates(vm.dateRange.startDate, vm.dateRange.endDate);
                }
            },
            opens: 'center',
            format: 'YYYY-MM-DD',
            startDate: vm.dateRange.startDate,
            endDate: vm.dateRange.endDate

        };

        vm.chartConfig = {
            options: {
                chart: {
                    type: 'areaspline',
                    zoomType: 'x'
                }, title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                tooltip: {
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            series: [],
            xAxis: {type: 'datetime'},
            yAxis: {min: 0},
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: true
                }
            }
        };
        vm.activate($timeout, webDevTec);
        vm.changeGraphsType = function () {
            vm.bounceRateChartConfig.chart.type = 'bar';
        };
        vm.login = function () {
            $auth.login(vm.user)
                .then(function () {
                    toastr.success('You have successfully signed in');
                    $state.go('home');
                })
                .catch(function (response) {
                    toastr.error(response.data.message, response.status);
                });
        };
        vm.authenticate = function (provider) {
            $auth.authenticate(provider)
                .then(function () {
                    toastr.success('You have successfully signed in with ' + provider);
                    $state.go('onBoarding');
                })
                .catch(function (response) {
                    toastr.error(response.data.message);
                });
        };
    }

    activate($timeout, webDevTec) {
        this.getWebDevTec(webDevTec);
        $timeout(() => {
            this.classAnimation = 'rubberBand';
        }, 4000);
    }

    getWebDevTec(webDevTec) {
        this.awesomeThings = webDevTec.getTec();

        angular.forEach(this.awesomeThings, (awesomeThing) => {
            awesomeThing.rank = Math.random();
        });
    }

    showToastr() {
        this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular"' +
            ' target="_blank"><b>generator-gulp-angular</b></a>');
        this.classAnimation = '';
    }

}
