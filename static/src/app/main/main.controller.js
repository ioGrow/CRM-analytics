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
        vm.isLoading = true;
         function stopLoading () {
            vm.isLoading = false;
        }
        Pace.on('hide', stopLoading());
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
                vm.newVisitorsChartConfig.loading = false;
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
                vm.bounceRateChartConfig.series.push({
                    data: data, name: 'Bounce Rate', dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                });
                vm.bounceRateChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        }
        vm.getConversionRates = function (startDate, endDate) {
            Restangular.one('conversion_rates').get({
                "startDate": startDate.format('YYYY-MM-DD'),
                "endDate": endDate.format('YYYY-MM-DD')
            }).
            then(function (resp) {
                $log.info(resp)
                var data = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    data.push([moment(item[1]).valueOf(), parseFloat(item[0])])
                }
                vm.conversionRateChartConfig = angular.copy(vm.chartConfig);
                vm.conversionRateChartConfig.options.chart.type = 'column';
                vm.conversionRateChartConfig.options.title.text = 'Conversion Rate';
                vm.conversionRateChartConfig.options.subtitle.text = 'Convesion rate (New users/ visitors)';
                vm.conversionRateChartConfig.series.push({
                    data: data, name: 'Conversion Rate', dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                });
                vm.conversionRateChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getuserBySigninClicks = function (startDate, endDate) {
            Restangular.one('click_by_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).
            then(function (resp) {
                $log.info(resp)
                var data = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    data.push([moment(item[1]).valueOf(), parseFloat(item[0])])
                }
                vm.userBySigninClickChartConfig = angular.copy(vm.chartConfig);
                vm.userBySigninClickChartConfig.options.chart.type = 'column';
                vm.userBySigninClickChartConfig.options.title.text = 'Users/sign_in clickers';
                vm.userBySigninClickChartConfig.options.subtitle.text = 'Clicked to sign up to users ratio';
                vm.userBySigninClickChartConfig.series.push({
                    data: data, name: 'Users/sign_in clickers', dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                });
                vm.userBySigninClickChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };

        vm.weeklyNewUsers = function (startDate, endDate) {
            Restangular.one('weekly_new_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                var data = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    data.push([item[1], parseInt(item[0])])
                }
                vm.weeklyNewUsersChartConfig = angular.copy(vm.chartConfig);
                vm.weeklyNewUsersChartConfig.xAxis.type = 'category';
                vm.weeklyNewUsersChartConfig.options.chart.type = 'column';
                vm.weeklyNewUsersChartConfig.options.title.text = 'Weekly new Users';
                vm.weeklyNewUsersChartConfig.series.push({
                    data: data, name: 'Weekly new Users', dataLabels: {
                        enabled: true,
                        rotation: -90,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y:.1f}', // one decimal
                        y: 10, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                });
                vm.weeklyNewUsersChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.newUsersBySource = function (startDate, endDate) {
            Restangular.one('new_users_by_source').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                var data = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    if (i == 0) {
                        data.push({
                            name: item[0],
                            y: parseInt(item[1]),
                            sliced: true,
                            selected: true
                        });
                    } else {
                        data.push([item[0], parseInt(item[1])]);
                    }
                }
                vm.newUsersBySourceChartConfig = angular.copy(vm.pieChartConfig);
                $log.info(data);
                vm.newUsersBySourceChartConfig.series.push({data: data, type: 'pie', name: 'new users by source'});
                vm.newUsersBySourceChartConfig.title = {text: "New Users by Source"};
                vm.newUsersBySourceChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.haveAnalytics = function () {
            var result = true;
            return Restangular.one('accounts').get().then(function (resp) {
                $log.info(resp.data)
            }).catch(function () {
                result = false;
            });

        }
        if (vm.isAuthenticated()) {
            if (vm.haveAnalytics()) {
                vm.getNewVisitors(vm.dateRange.startDate, vm.dateRange.endDate);
                vm.getBouncesRates(vm.dateRange.startDate, vm.dateRange.endDate);
                vm.getuserBySigninClicks(vm.dateRange.startDate, vm.dateRange.endDate);
                vm.newUsersBySource(vm.dateRange.startDate, vm.dateRange.endDate);
                vm.weeklyNewUsers(vm.dateRange.startDate, vm.dateRange.endDate);
                vm.getConversionRates(vm.dateRange.startDate, vm.dateRange.endDate);
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
                    vm.getuserBySigninClicks(vm.dateRange.startDate, vm.dateRange.endDate);
                    vm.newUsersBySource(vm.dateRange.startDate, vm.dateRange.endDate);
                    vm.weeklyNewUsers(vm.dateRange.startDate, vm.dateRange.endDate);
                    vm.getConversionRates(vm.dateRange.startDate, vm.dateRange.endDate);
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
                    zoomType: 'x',
                    //renderTo: 'chart',
                    //margin: 0,
                    width: angular.element("#chart-container").width()
                }, title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                tooltip: {
                    valueDecimals: 2,
                    style: {
                        padding: 10,
                        fontWeight: 'bold'
                    }
                }
            },
            series: [],
            xAxis: {type: 'datetime'},
            yAxis: {min: 0},
            legend: {
                enabled: false
            },
            /*            plotOptions: {
             line: {
             dataLabels: {
             enabled: true
             },
             enableMouseTracking: true
             }
             }*/
            loading: true
        };
        vm.pieChartConfig = {
            options: {
                chart: {
                    type: 'pie',
                    width: angular.element("#chart-container").width(),
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    }
                },
                title: {
                    text: ''
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name} </b> : {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            },
                            useHTML: true
                        }
                    }
                }
            },
            series: [],
            loading: true
        };
        vm.activate($timeout, webDevTec);
        vm.changeGraphsType = function () {
            vm.bounceRateChartConfig.chart.type = 'bar';
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
