export class MainController {
    constructor($timeout, $auth, $state, webDevTec, toastr, Restangular, moment, Pace, Highcharts) {
        'ngInject';
        var vm = this;
        vm.awesomeThings = [];
        vm.classAnimation = '';
        vm.toastr = toastr;
        vm.unit = 1;
        vm.isLoading = true;
        vm.dailyActions = 2;
        vm.weeklyActions = 5;
        vm.isAuthenticated = function () {
            return $auth.isAuthenticated()
        };
        function stopLoading() {
            vm.isLoading = false;
        }

        Pace.on('hide', stopLoading());
        vm.dateRange = {
            startDate: moment().subtract(21, 'days'),
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
                vm.newVisitorsChartConfig.series = [{
                    data: data, name: 'new visitors', dataLabels: {
                        enabled: true
                    }
                }];
                vm.newVisitorsChartConfig.loading = false;
                vm.dailyNewUsers(startDate, endDate);
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.dailyNewUsers = function (startDate, endDate) {
            Restangular.one('daily_new_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD')
                }
            ).then(function (resp) {
                vm.dailyNewUsersData = [];
                for (var i = 0; i < resp.data.length; i++) {
                    var item = resp.data[i];
                    vm.dailyNewUsersData.push([moment(item[1]).valueOf(), parseInt(item[0])])
                }
                var data = angular.copy(vm.dailyNewUsersData);
                vm.newVisitorsChartConfig.series.push({
                    data: data, name: 'New Users', dataLabels: {
                        enabled: true
                    }
                });
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
                vm.growthRateChartConfig.series = [{
                    data: data, name: 'Growth Rate', dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}%'
                    }
                }];
                vm.growthRateChartConfig.options.tooltip = {
                    valueSuffix: '%', crosshairs: true,
                    shared: true
                }
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
                vm.totalUsersChartConfig.options.tooltip = {
                    valueSuffix: '%', crosshairs: true,
                    shared: true
                };
                vm.totalUsersChartConfig.options.title.text = 'Total Users';
                vm.totalUsersChartConfig.series = [{
                    data: data, name: 'new users'
                }];
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
                    vm.bounceRateData.push([moment(item[1]).valueOf(), parseFloat(parseFloat(item[0]).toFixed(2))])
                }
                var data = angular.copy(vm.bounceRateData);
                vm.bounceRateChartConfig = angular.copy(vm.chartConfig);
                vm.bounceRateChartConfig.options.chart.type = 'column';
                vm.bounceRateChartConfig.options.title.text = 'Bounce Rate';
                vm.bounceRateChartConfig.options.tooltip = {
                    valueSuffix: '%', crosshairs: true,
                    shared: true
                }
                vm.bounceRateChartConfig.options.yAxis = {stackLabels: {enabled: true}}
                vm.bounceRateChartConfig.options.plotOptions = {
                    column: {
                        stacking: 'normal'
                    }
                }
                vm.bounceRateChartConfig.options.subtitle.text = 'Visits in which the person left your site from' +
                    ' the entrance page without interacting with the page';
                vm.bounceRateChartConfig.series.push({
                    data: data, name: 'Bounce Rate', dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}%'
                    }
                });
                vm.bounceRateChartConfig.loading = false;
                vm.getConversionRates(startDate, endDate);
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
                vm.bounceRateChartConfig.series.push({
                    data: vm.conversionRateData, name: 'Conversion Rate', dataLabels: {
                        enabled: true,
                        format: '{point.y:.1f}%'
                    }
                });
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
                        format: '{point.y:.2f}'
                    }
                });
                vm.userBySigninClickChartConfig.loading = false;
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
        vm.churnedUsers = function (startDate, endDate) {
            Restangular.one('churned_users').get().then(function (resp) {
                vm.churnedUsersData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    if (i == 0) {
                        vm.churnedUsersData.push({
                            name: item[0],
                            y: parseInt(item[1]),
                            sliced: true,
                            selected: true
                        });
                    } else {
                        vm.churnedUsersData.push([item[0], parseInt(item[1])]);
                    }
                }
                var data = angular.copy(vm.churnedUsersData);
                vm.churnedUsersChartConfig = angular.copy(vm.pieChartConfig);
                vm.churnedUsersChartConfig.series.push({
                    data: data, type: 'pie',
                    name: 'Churned Users in two last month'
                });
                vm.churnedUsersChartConfig.title = {text: "Churned Users in two last month"};
                vm.churnedUsersChartConfig.loading = false;
            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getDailyActiveUsers = function (startDate, endDate, actions) {
            Restangular.one('daily_active_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD'),
                    "dailyActions": actions
                }
            ).then(function (resp) {
                vm.dailyActiveUsersData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    vm.dailyActiveUsersData.push([moment(item[1]).valueOf(), item[0]]);
                }
                var data = angular.copy(vm.dailyActiveUsersData);
                vm.dailyActiveUsersChartConfig = angular.copy(vm.chartConfig);
                vm.dailyActiveUsersChartConfig.series.push({
                    data: data, name: 'Daily Active Users', dataLabels: {
                        enabled: true
                    }
                });
                vm.dailyActiveUsersChartConfig.options.chart.type = null;
                vm.dailyActiveUsersChartConfig.options.title.text = "Daily Active Users";
                vm.dailyActiveUsersChartConfig.loading = false;

            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getDailyActiveUsersGrowth = function (startDate, endDate, actions) {
            Restangular.one('daily_active_users_growth').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD'),
                    'dailyActions': actions
                }
            ).then(function (resp) {
                vm.dailyActiveUsersGrowthData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    vm.dailyActiveUsersGrowthData.push([moment(item[1]).valueOf(), item[0]]);
                }
                var data = angular.copy(vm.dailyActiveUsersGrowthData);
                vm.dailyActiveUsersGrowthChartConfig = angular.copy(vm.chartConfig);
                vm.dailyActiveUsersGrowthChartConfig.series.push({
                    data: data, name: 'Active Users Growth', dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}%'
                    }
                });
                vm.dailyActiveUsersGrowthChartConfig.options.chart.type = null;
                vm.dailyActiveUsersGrowthChartConfig.options.title.text = "Daily Active Users growth";
                vm.dailyActiveUsersGrowthChartConfig.loading = false;
                vm.dailyActiveUsersGrowthChartConfig.options.tooltip = {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<b>{point.y:.2f}%</b> of total<br/>'
                }


            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getWeeklyActiveUsers = function (startDate, endDate, actions) {
            Restangular.one('weekly_active_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD'),
                    "weeklyActions": actions
                }
            ).then(function (resp) {
                vm.weeklyActiveUsersData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    vm.weeklyActiveUsersData.push([moment(item[1]).valueOf(), item[0]]);
                }
                var data = angular.copy(vm.weeklyActiveUsersData);
                vm.weeklyActiveUsersChartConfig = angular.copy(vm.chartConfig);
                vm.weeklyActiveUsersChartConfig.series.push({
                    data: data, name: 'Weekly Active Users', dataLabels: {
                        enabled: true
                    }
                });
                vm.weeklyActiveUsersChartConfig.options.chart.type = null;
                vm.weeklyActiveUsersChartConfig.options.title.text = "Weekly Active and engaged Users";
                vm.weeklyActiveUsersChartConfig.loading = false;

            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        }
        vm.getWeeklyEngagedUsers = function (startDate, endDate, actions) {
            Restangular.one('weekly_engaged_users').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD'),
                    "weeklyActions": actions
                }
            ).then(function (resp) {
                vm.weeklyEngagedUsersData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    vm.weeklyEngagedUsersData.push([moment(item[1]).valueOf(), item[0]]);
                }
                var data = angular.copy(vm.weeklyEngagedUsersData);
                //vm.weeklyEngagedUsersChartConfig = angular.copy(vm.chartConfig);
                vm.weeklyActiveUsersChartConfig.series.push({
                    data: data, name: 'Weekly Engaged Users', dataLabels: {
                        enabled: true
                    }
                });
                //vm.weeklyEngagedUsersChartConfig.options.chart.type = null;
                //vm.weeklyEngagedUsersChartConfig.options.title.text = "Weekly Engaged Users";
                //vm.weeklyEngagedUsersChartConfig.loading = false;

            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        };
        vm.getWeeklyActiveUsersGrowth = function (startDate, endDate, actions) {
            Restangular.one('weekly_active_users_growth').get({
                    "startDate": startDate.format('YYYY-MM-DD'),
                    "endDate": endDate.format('YYYY-MM-DD'),
                    'weeklyActions': actions
                }
            ).then(function (resp) {
                vm.weeklyActiveUsersGrowthData = [];
                for (var i = 0; i < resp.data.length; i += 1) {
                    var item = resp.data[i];
                    vm.weeklyActiveUsersGrowthData.push([moment(item[1]).valueOf(), item[0]]);
                }
                var data = angular.copy(vm.weeklyActiveUsersGrowthData);
                vm.weeklyActiveUsersGrowthChartConfig = angular.copy(vm.chartConfig);
                vm.weeklyActiveUsersGrowthChartConfig.series.push({
                    data: data, name: 'Active Users Growth', dataLabels: {
                        enabled: true,
                        format: '{point.y:.2f}%'
                    }
                });
                vm.weeklyActiveUsersGrowthChartConfig.options.chart.type = null;
                vm.weeklyActiveUsersGrowthChartConfig.options.title.text = "Weekly Active Users growth";
                vm.weeklyActiveUsersGrowthChartConfig.loading = false;
                vm.weeklyActiveUsersGrowthChartConfig.options.tooltip = {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<b>{point.y:.2f}%</b> of total<br/>'
                }


            }).catch(function (e) {
                toastr.error(e.data.message);
            });
        }
        function runAll() {
            vm.getNewVisitors(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getGrowthRate(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getTotalUsers(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getBouncesRates(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getuserBySigninClicks(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.newUsersBySource(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.churnedUsers();
            //vm.dailyNewUsers(vm.dateRange.startDate, vm.dateRange.endDate);
            //vm.getConversionRates(vm.dateRange.startDate, vm.dateRange.endDate);
            vm.getDailyActiveUsers(vm.dateRange.startDate, vm.dateRange.endDate, vm.dailyActions);
            vm.getDailyActiveUsersGrowth(vm.dateRange.startDate, vm.dateRange.endDate, vm.dailyActions);
            vm.getWeeklyActiveUsers(vm.dateRange.startDate, vm.dateRange.endDate, vm.weeklyActions);
            vm.getWeeklyEngagedUsers(vm.dateRange.startDate, vm.dateRange.endDate, vm.weeklyActions);
            vm.getWeeklyActiveUsersGrowth(vm.dateRange.startDate, vm.dateRange.endDate, vm.weeklyActions);
        }

        if (vm.isAuthenticated()) {
            runAll()
        }
        vm.refreshDailyActiveUsers = function (actions) {
            vm.getDailyActiveUsers(vm.dateRange.startDate, vm.dateRange.endDate, actions);
            vm.getDailyActiveUsersGrowth(vm.dateRange.startDate, vm.dateRange.endDate, actions);
        }
        vm.refreshWeeklyActiveUsers = function (actions) {
            vm.getWeeklyActiveUsers(vm.dateRange.startDate, vm.dateRange.endDate, actions);
            vm.getWeeklyEngagedUsers(vm.dateRange.startDate, vm.dateRange.endDate, actions);
            vm.getWeeklyActiveUsersGrowth(vm.dateRange.startDate, vm.dateRange.endDate, actions);
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
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
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
                            format: '<b>{point.name} </b> : {point.percentage:.2f} %',
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
