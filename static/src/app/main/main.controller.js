export class MainController {
    constructor($timeout, $auth, $state, webDevTec, toastr, Restangular, moment) {
        'ngInject';
        var vm = this;
        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.toastr = toastr;
        vm.unit = 1;
        vm.isLoading = true;

        vm.isAuthenticated = function () {
            return $auth.isAuthenticated()
        };

        function stopLoading() {
            vm.isLoading = false;
        }

        Pace.on('hide', stopLoading());
        vm.dateRange = {
            startDate: moment().subtract(29, 'days'),
            endDate: moment().add(1, 'days')
        };
        vm.changeAllChartsUnit = function (unit) {
            vm.newVisitorsChartConfig.series[0]['data'] = (unit == 1) ? vm.newVisitorsData : vm.changeChartUnit(unit, vm.newVisitorsData);
        }
        vm.changeChartUnit = function (unit, data) {
            if (vm.unit == unit) return;
            else vm.unit = unit;
            var result = [];
            var item = data[0];
            for (var i = 0; i < data.length; i++) {
                if (i % unit == 0 && i != 0) {
                    item[0] = data[i][0];
                    result.push(item);
                    item = data[i];
                } else {
                    item[1] += data[i][1];
                }
            }
            return result;
        }

        vm.getNewVisitors = function (startDate, endDate) {
            Restangular.one('new_visitors').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                vm.newVisitorsData = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    vm.newVisitorsData.push([moment(item[1]).valueOf(), parseInt(item[0])])
                }
                var data = angular.copy(vm.newVisitorsData);
                vm.newVisitorsChartConfig = angular.copy(vm.chartConfig);
                vm.newVisitorsChartConfig.options.title.text = 'New Visitors';
                vm.newVisitorsChartConfig.series = [{data: data, name: 'new visitors'}];
                vm.newVisitorsChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getGrowthRate = function (startDate, endDate) {
            Restangular.one('growth_rate').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                vm.growthRateData = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    vm.growthRateData.push([moment(item[1]).valueOf(), item[0]])
                }
                var data = angular.copy(vm.growthRateData);
                vm.growthRateChartConfig = angular.copy(vm.chartConfig);
                vm.growthRateChartConfig.options.chart.type = null;
                vm.growthRateChartConfig.options.title.text = 'Growth Rate';
                vm.growthRateChartConfig.series = [{data: data, name: 'Growth Rate'}];
                vm.growthRateChartConfig.options.tooltip = {valueSuffix: '%'}
                vm.growthRateChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getTotalUsers = function (startDate, endDate) {
            Restangular.one('total_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                vm.totalUsersData = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    vm.totalUsersData.push([moment(item[1]).valueOf(), parseInt(item[0])])
                }
                var data = angular.copy(vm.totalUsersData);
                vm.totalUsersChartConfig = angular.copy(vm.chartConfig);
                vm.totalUsersChartConfig.options.chart.type = null;
                vm.totalUsersChartConfig.options.title.text = 'Total Users';
                vm.totalUsersChartConfig.series = [{data: data, name: 'new users'}];
                vm.totalUsersChartConfig.loading = false;
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
                vm.bounceRateData = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    vm.bounceRateData.push([moment(item[1]).valueOf(), parseInt(item[0])])
                }
                var data = angular.copy(vm.bounceRateData);
                vm.bounceRateChartConfig = angular.copy(vm.chartConfig);
                vm.bounceRateChartConfig.options.chart.type = 'column';
                vm.bounceRateChartConfig.options.title.text = 'Bounce Rate';
                vm.bounceRateChartConfig.options.tooltip = {valueSuffix: '%'}
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
                vm.conversionRateData = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    vm.conversionRateData.push([moment(item[1]).valueOf(), parseFloat(item[0])])
                }
                vm.conversionRateChartConfig = angular.copy(vm.chartConfig);
                vm.conversionRateChartConfig.options.chart.type = 'column';
                vm.conversionRateChartConfig.options.title.text = 'Conversion Rate';
                vm.conversionRateChartConfig.options.subtitle.text = 'Convesion rate (New users/ visitors)';
                vm.conversionRateChartConfig.options.tooltip = {valueSuffix: '%'}
                vm.conversionRateChartConfig.series.push({
                    data: vm.conversionRateData, name: 'Conversion Rate', dataLabels: {
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
                vm.clickByUsersData = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    vm.clickByUsersData.push([moment(item[1]).valueOf(), parseFloat(item[0])])
                }
                var data = angular.copy(vm.clickByUsersData);
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
            Restangular.one('daily_new_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                vm.dailyNewUsersData = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    vm.dailyNewUsersData.push([item[1], parseInt(item[0])])
                }
                var data = angular.copy(vm.dailyNewUsersData);
                vm.weeklyNewUsersChartConfig = angular.copy(vm.chartConfig);
                vm.weeklyNewUsersChartConfig.xAxis.type = 'category';
                vm.weeklyNewUsersChartConfig.options.chart.type = 'column';
                vm.weeklyNewUsersChartConfig.options.title.text = 'Daily new Users';
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
                vm.newUsersBySourceData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    if (i == 0) {
                        vm.newUsersBySourceData.push({
                            name: item[0],
                            y: parseInt(item[1]),
                            sliced: true,
                            selected: true
                        });
                    } else {
                        vm.newUsersBySourceData.push([item[0], parseInt(item[1])]);
                    }
                }
                var data = angular.copy(vm.newUsersBySourceData);
                vm.newUsersBySourceChartConfig = angular.copy(vm.pieChartConfig);
                vm.newUsersBySourceChartConfig.series.push({data: data, type: 'pie', name: 'new users by source'});
                vm.newUsersBySourceChartConfig.title = {text: "New Users by Source"};
                vm.newUsersBySourceChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getActiveUsers = function (startDate, endDate) {
            Restangular.one('active_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                vm.activeUsersData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    vm.activeUsersData.push([moment(item[1]).valueOf(), parseInt(item[0])]);
                }
                var data = angular.copy(vm.activeUsersData);
                vm.activeUsersChartConfig = angular.copy(vm.chartConfig);
                vm.activeUsersChartConfig.series.push({
                    data: data, name: 'Active Users', dataLabels: {
                        enabled: true,
                        color: '#000',
                        align: 'right',
                        format: '{point.y}', // one decimal
                        y: 0, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                });
                vm.activeUsersChartConfig.options.chart.type = null;
                vm.activeUsersChartConfig.options.title.text = "Active Users";
                vm.activeUsersChartConfig.loading = false;

            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getActiveUsers = function (startDate, endDate) {
            Restangular.one('active_users_growth').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                vm.activeUsersGrowthData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    vm.activeUsersGrowthData.push([moment(item[1]).valueOf(), item[0]]);
                }
                var data = angular.copy(vm.activeUsersGrowthData);
                vm.activeUsersGrowthChartConfig = angular.copy(vm.chartConfig);
                vm.activeUsersGrowthChartConfig.series.push({
                    data: data, name: 'Active Users Growth', dataLabels: {
                        enabled: true,
                        color: '#070',
                        align: 'right',
                        format: '{point.y:.2f}%', // one decimal
                        y: 0, // 10 pixels down from the top
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                });
                vm.activeUsersGrowthChartConfig.options.chart.type = null;
                vm.activeUsersGrowthChartConfig.options.title.text = "Active Users growth";
                vm.activeUsersGrowthChartConfig.loading = false;
                vm.activeUsersGrowthChartConfig.options.tooltip = {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat:  '<b>{point.y:.2f}%</b> of total<br/>'
                }


            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        /*
         vm.haveAnalytics = function () {
         var result = true;
         return Restangular.one('accounts').get().then(function (resp) {
         $log.info(resp.data)
         }).catch(function () {
         result = false;
         });

         }
         */
        function runAll() {
            vm.getNewVisitors(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getGrowthRate(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getTotalUsers(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getBouncesRates(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getuserBySigninClicks(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.newUsersBySource(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.weeklyNewUsers(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getConversionRates(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getActiveUsers(vm.dateRange.startDate, vm.dateRange.endDate);
        }

        if (vm.isAuthenticated()) {
            runAll()
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
                    runAll()
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
            //yAxis: {min: 0},
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
