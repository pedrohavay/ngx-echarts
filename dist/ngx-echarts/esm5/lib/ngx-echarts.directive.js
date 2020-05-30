import { __decorate, __param } from "tslib";
import { AfterViewInit, Directive, DoCheck, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, InjectionToken, Inject, } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ChangeFilter } from './change-filter';
export var NGX_ECHARTS_CONFIG = new InjectionToken('NGX_ECHARTS_CONFIG');
var NgxEchartsDirective = /** @class */ (function () {
    function NgxEchartsDirective(config, el, ngZone) {
        this.el = el;
        this.ngZone = ngZone;
        this.autoResize = true;
        this.loadingType = 'default';
        // ngx-echarts events
        this.chartInit = new EventEmitter();
        // echarts mouse events
        this.chartClick = this.createLazyEvent('click');
        this.chartDblClick = this.createLazyEvent('dblclick');
        this.chartMouseDown = this.createLazyEvent('mousedown');
        this.chartMouseMove = this.createLazyEvent('mousemove');
        this.chartMouseUp = this.createLazyEvent('mouseup');
        this.chartMouseOver = this.createLazyEvent('mouseover');
        this.chartMouseOut = this.createLazyEvent('mouseout');
        this.chartGlobalOut = this.createLazyEvent('globalout');
        this.chartContextMenu = this.createLazyEvent('contextmenu');
        // echarts mouse events
        this.chartLegendSelectChanged = this.createLazyEvent('legendselectchanged');
        this.chartLegendSelected = this.createLazyEvent('legendselected');
        this.chartLegendUnselected = this.createLazyEvent('legendunselected');
        this.chartLegendScroll = this.createLazyEvent('legendscroll');
        this.chartDataZoom = this.createLazyEvent('datazoom');
        this.chartDataRangeSelected = this.createLazyEvent('datarangeselected');
        this.chartTimelineChanged = this.createLazyEvent('timelinechanged');
        this.chartTimelinePlayChanged = this.createLazyEvent('timelineplaychanged');
        this.chartRestore = this.createLazyEvent('restore');
        this.chartDataViewChanged = this.createLazyEvent('dataviewchanged');
        this.chartMagicTypeChanged = this.createLazyEvent('magictypechanged');
        this.chartPieSelectChanged = this.createLazyEvent('pieselectchanged');
        this.chartPieSelected = this.createLazyEvent('pieselected');
        this.chartPieUnselected = this.createLazyEvent('pieunselected');
        this.chartMapSelectChanged = this.createLazyEvent('mapselectchanged');
        this.chartMapSelected = this.createLazyEvent('mapselected');
        this.chartMapUnselected = this.createLazyEvent('mapunselected');
        this.chartAxisAreaSelected = this.createLazyEvent('axisareaselected');
        this.chartFocusNodeAdjacency = this.createLazyEvent('focusnodeadjacency');
        this.chartUnfocusNodeAdjacency = this.createLazyEvent('unfocusnodeadjacency');
        this.chartBrush = this.createLazyEvent('brush');
        this.chartBrushSelected = this.createLazyEvent('brushselected');
        this.chartRendered = this.createLazyEvent('rendered');
        this.chartFinished = this.createLazyEvent('finished');
        this.currentOffsetWidth = 0;
        this.currentOffsetHeight = 0;
        if (typeof (config) === "object") {
            this.echarts = config.echarts();
        }
        else {
            var bypass_config = config;
            this.echarts = bypass_config[0].echarts();
        }
    }
    NgxEchartsDirective.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var filter = ChangeFilter.of(changes);
        filter.notFirstAndEmpty('options').subscribe(function (opt) { return _this.onOptionsChange(opt); });
        filter.notFirstAndEmpty('merge').subscribe(function (opt) { return _this.setOption(opt); });
        filter.has('loading').subscribe(function (v) { return _this.toggleLoading(!!v); });
        filter.notFirst('theme').subscribe(function () { return _this.refreshChart(); });
    };
    NgxEchartsDirective.prototype.ngOnInit = function () {
        var _this = this;
        this.resizeSub = fromEvent(window, 'resize')
            .pipe(debounceTime(50))
            .subscribe(function () {
            if (_this.autoResize && window.innerWidth !== _this.currentWindowWidth) {
                _this.currentWindowWidth = window.innerWidth;
                _this.currentOffsetWidth = _this.el.nativeElement.offsetWidth;
                _this.currentOffsetHeight = _this.el.nativeElement.offsetHeight;
                _this.resize();
            }
        });
    };
    NgxEchartsDirective.prototype.ngOnDestroy = function () {
        if (this.resizeSub) {
            this.resizeSub.unsubscribe();
        }
        this.dispose();
    };
    NgxEchartsDirective.prototype.ngDoCheck = function () {
        // No heavy work in DoCheck!
        if (this.chart && this.autoResize) {
            var offsetWidth = this.el.nativeElement.offsetWidth;
            var offsetHeight = this.el.nativeElement.offsetHeight;
            if (this.currentOffsetWidth !== offsetWidth || this.currentOffsetHeight !== offsetHeight) {
                this.currentOffsetWidth = offsetWidth;
                this.currentOffsetHeight = offsetHeight;
                this.resize();
            }
        }
    };
    NgxEchartsDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        setTimeout(function () { return _this.initChart(); });
    };
    NgxEchartsDirective.prototype.dispose = function () {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
        }
    };
    NgxEchartsDirective.prototype.resize = function () {
        if (this.chart) {
            this.chart.resize();
        }
    };
    NgxEchartsDirective.prototype.toggleLoading = function (loading) {
        if (this.chart) {
            loading
                ? this.chart.showLoading(this.loadingType, this.loadingOpts)
                : this.chart.hideLoading();
        }
    };
    NgxEchartsDirective.prototype.setOption = function (option, opts) {
        if (this.chart) {
            this.chart.setOption(option, opts);
        }
    };
    NgxEchartsDirective.prototype.refreshChart = function () {
        this.dispose();
        this.initChart();
    };
    NgxEchartsDirective.prototype.createChart = function () {
        var _this = this;
        this.currentWindowWidth = window.innerWidth;
        this.currentOffsetWidth = this.el.nativeElement.offsetWidth;
        this.currentOffsetHeight = this.el.nativeElement.offsetHeight;
        var dom = this.el.nativeElement;
        if (window && window.getComputedStyle) {
            var prop = window.getComputedStyle(dom, null).getPropertyValue('height');
            if ((!prop || prop === '0px') && (!dom.style.height || dom.style.height === '0px')) {
                dom.style.height = '400px';
            }
        }
        return this.ngZone.runOutsideAngular(function () { return _this.echarts.init(dom, _this.theme, _this.initOpts); });
    };
    NgxEchartsDirective.prototype.initChart = function () {
        this.onOptionsChange(this.options);
        if (this.merge && this.chart) {
            this.setOption(this.merge);
        }
    };
    NgxEchartsDirective.prototype.onOptionsChange = function (opt) {
        if (opt) {
            if (!this.chart) {
                this.chart = this.createChart();
                this.chartInit.emit(this.chart);
            }
            this.chart.setOption(this.options, true);
        }
    };
    // allows to lazily bind to only those events that are requested through the `@Output` by parent components
    // see https://stackoverflow.com/questions/51787972/optimal-reentering-the-ngzone-from-eventemitter-event for more info
    NgxEchartsDirective.prototype.createLazyEvent = function (eventName) {
        var _this = this;
        return this.chartInit.pipe(switchMap(function (chart) {
            return new Observable(function (observer) {
                chart.on(eventName, function (data) { return _this.ngZone.run(function () { return observer.next(data); }); });
                return function () { return chart.off(eventName); };
            });
        }));
    };
    NgxEchartsDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [NGX_ECHARTS_CONFIG,] }] },
        { type: ElementRef },
        { type: NgZone }
    ]; };
    __decorate([
        Input()
    ], NgxEchartsDirective.prototype, "options", void 0);
    __decorate([
        Input()
    ], NgxEchartsDirective.prototype, "theme", void 0);
    __decorate([
        Input()
    ], NgxEchartsDirective.prototype, "loading", void 0);
    __decorate([
        Input()
    ], NgxEchartsDirective.prototype, "initOpts", void 0);
    __decorate([
        Input()
    ], NgxEchartsDirective.prototype, "merge", void 0);
    __decorate([
        Input()
    ], NgxEchartsDirective.prototype, "autoResize", void 0);
    __decorate([
        Input()
    ], NgxEchartsDirective.prototype, "loadingType", void 0);
    __decorate([
        Input()
    ], NgxEchartsDirective.prototype, "loadingOpts", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartInit", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartClick", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartDblClick", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMouseDown", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMouseMove", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMouseUp", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMouseOver", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMouseOut", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartGlobalOut", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartContextMenu", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartLegendSelectChanged", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartLegendSelected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartLegendUnselected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartLegendScroll", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartDataZoom", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartDataRangeSelected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartTimelineChanged", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartTimelinePlayChanged", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartRestore", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartDataViewChanged", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMagicTypeChanged", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartPieSelectChanged", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartPieSelected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartPieUnselected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMapSelectChanged", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMapSelected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartMapUnselected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartAxisAreaSelected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartFocusNodeAdjacency", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartUnfocusNodeAdjacency", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartBrush", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartBrushSelected", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartRendered", void 0);
    __decorate([
        Output()
    ], NgxEchartsDirective.prototype, "chartFinished", void 0);
    NgxEchartsDirective = __decorate([
        Directive({
            selector: 'echarts, [echarts]',
            exportAs: 'echarts',
        }),
        __param(0, Inject(NGX_ECHARTS_CONFIG))
    ], NgxEchartsDirective);
    return NgxEchartsDirective;
}());
export { NgxEchartsDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVjaGFydHMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVjaGFydHMvIiwic291cmNlcyI6WyJsaWIvbmd4LWVjaGFydHMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLFNBQVMsRUFDVCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixhQUFhLEVBQ2IsY0FBYyxFQUNkLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFLL0MsTUFBTSxDQUFDLElBQU0sa0JBQWtCLEdBQUcsSUFBSSxjQUFjLENBQW1CLG9CQUFvQixDQUFDLENBQUM7QUFNN0Y7SUE4REUsNkJBQzhCLE1BQXdCLEVBQzVDLEVBQWMsRUFDZCxNQUFjO1FBRGQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLFdBQU0sR0FBTixNQUFNLENBQVE7UUF0RGYsZUFBVSxHQUFHLElBQUksQ0FBQztRQUNsQixnQkFBVyxHQUFHLFNBQVMsQ0FBQztRQUdqQyxxQkFBcUI7UUFDWCxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUU5Qyx1QkFBdUI7UUFDYixlQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxrQkFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakQsbUJBQWMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ25E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QUFtQjtRQUovQixTQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsb0JBQW9CO1lBQzlCLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQUM7UUFnRUcsV0FBQSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtPQS9EbEIsbUJBQW1CLENBME0vQjtJQUFELDBCQUFDO0NBQUEsQUExTUQsSUEwTUM7U0ExTVksbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgSW5qZWN0aW9uVG9rZW4sXG4gIEluamVjdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBmcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBzd2l0Y2hNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDaGFuZ2VGaWx0ZXIgfSBmcm9tICcuL2NoYW5nZS1maWx0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIE5neEVjaGFydHNDb25maWcge1xuICBlY2hhcnRzOiBhbnk7XG59XG5leHBvcnQgY29uc3QgTkdYX0VDSEFSVFNfQ09ORklHID0gbmV3IEluamVjdGlvblRva2VuPE5neEVjaGFydHNDb25maWc+KCdOR1hfRUNIQVJUU19DT05GSUcnKTtcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZWNoYXJ0cywgW2VjaGFydHNdJyxcbiAgZXhwb3J0QXM6ICdlY2hhcnRzJyxcbn0pXG5leHBvcnQgY2xhc3MgTmd4RWNoYXJ0c0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIERvQ2hlY2ssIEFmdGVyVmlld0luaXQge1xuICBASW5wdXQoKSBvcHRpb25zOiBhbnk7XG4gIEBJbnB1dCgpIHRoZW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGxvYWRpbmc6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGluaXRPcHRzOiB7XG4gICAgZGV2aWNlUGl4ZWxSYXRpbz86IG51bWJlcjtcbiAgICByZW5kZXJlcj86IHN0cmluZztcbiAgICB3aWR0aD86IG51bWJlciB8IHN0cmluZztcbiAgICBoZWlnaHQ/OiBudW1iZXIgfCBzdHJpbmc7XG4gIH07XG4gIEBJbnB1dCgpIG1lcmdlOiBhbnk7XG4gIEBJbnB1dCgpIGF1dG9SZXNpemUgPSB0cnVlO1xuICBASW5wdXQoKSBsb2FkaW5nVHlwZSA9ICdkZWZhdWx0JztcbiAgQElucHV0KCkgbG9hZGluZ09wdHM6IG9iamVjdDtcblxuICAvLyBuZ3gtZWNoYXJ0cyBldmVudHNcbiAgQE91dHB1dCgpIGNoYXJ0SW5pdCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8vIGVjaGFydHMgbW91c2UgZXZlbnRzXG4gIEBPdXRwdXQoKSBjaGFydENsaWNrID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2NsaWNrJyk7XG4gIEBPdXRwdXQoKSBjaGFydERibENsaWNrID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2RibGNsaWNrJyk7XG4gIEBPdXRwdXQoKSBjaGFydE1vdXNlRG93biA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdtb3VzZWRvd24nKTtcbiAgQE91dHB1dCgpIGNoYXJ0TW91c2VNb3ZlID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ21vdXNlbW92ZScpO1xuICBAT3V0cHV0KCkgY2hhcnRNb3VzZVVwID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ21vdXNldXAnKTtcbiAgQE91dHB1dCgpIGNoYXJ0TW91c2VPdmVyID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ21vdXNlb3ZlcicpO1xuICBAT3V0cHV0KCkgY2hhcnRNb3VzZU91dCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdtb3VzZW91dCcpO1xuICBAT3V0cHV0KCkgY2hhcnRHbG9iYWxPdXQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnZ2xvYmFsb3V0Jyk7XG4gIEBPdXRwdXQoKSBjaGFydENvbnRleHRNZW51ID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2NvbnRleHRtZW51Jyk7XG5cbiAgLy8gZWNoYXJ0cyBtb3VzZSBldmVudHNcbiAgQE91dHB1dCgpIGNoYXJ0TGVnZW5kU2VsZWN0Q2hhbmdlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdsZWdlbmRzZWxlY3RjaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydExlZ2VuZFNlbGVjdGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2xlZ2VuZHNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydExlZ2VuZFVuc2VsZWN0ZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbGVnZW5kdW5zZWxlY3RlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRMZWdlbmRTY3JvbGwgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbGVnZW5kc2Nyb2xsJyk7XG4gIEBPdXRwdXQoKSBjaGFydERhdGFab29tID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2RhdGF6b29tJyk7XG4gIEBPdXRwdXQoKSBjaGFydERhdGFSYW5nZVNlbGVjdGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2RhdGFyYW5nZXNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydFRpbWVsaW5lQ2hhbmdlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCd0aW1lbGluZWNoYW5nZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0VGltZWxpbmVQbGF5Q2hhbmdlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCd0aW1lbGluZXBsYXljaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydFJlc3RvcmUgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgncmVzdG9yZScpO1xuICBAT3V0cHV0KCkgY2hhcnREYXRhVmlld0NoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnZGF0YXZpZXdjaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydE1hZ2ljVHlwZUNoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbWFnaWN0eXBlY2hhbmdlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRQaWVTZWxlY3RDaGFuZ2VkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3BpZXNlbGVjdGNoYW5nZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0UGllU2VsZWN0ZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgncGllc2VsZWN0ZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0UGllVW5zZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdwaWV1bnNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydE1hcFNlbGVjdENoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbWFwc2VsZWN0Y2hhbmdlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRNYXBTZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdtYXBzZWxlY3RlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRNYXBVbnNlbGVjdGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ21hcHVuc2VsZWN0ZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0QXhpc0FyZWFTZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdheGlzYXJlYXNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydEZvY3VzTm9kZUFkamFjZW5jeSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdmb2N1c25vZGVhZGphY2VuY3knKTtcbiAgQE91dHB1dCgpIGNoYXJ0VW5mb2N1c05vZGVBZGphY2VuY3kgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgndW5mb2N1c25vZGVhZGphY2VuY3knKTtcbiAgQE91dHB1dCgpIGNoYXJ0QnJ1c2ggPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnYnJ1c2gnKTtcbiAgQE91dHB1dCgpIGNoYXJ0QnJ1c2hTZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdicnVzaHNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydFJlbmRlcmVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3JlbmRlcmVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydEZpbmlzaGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2ZpbmlzaGVkJyk7XG5cbiAgcHJpdmF0ZSBjaGFydDogYW55O1xuICBwcml2YXRlIGVjaGFydHM6IGFueTtcbiAgcHJpdmF0ZSBjdXJyZW50T2Zmc2V0V2lkdGggPSAwO1xuICBwcml2YXRlIGN1cnJlbnRPZmZzZXRIZWlnaHQgPSAwO1xuICBwcml2YXRlIGN1cnJlbnRXaW5kb3dXaWR0aDogbnVtYmVyO1xuICBwcml2YXRlIHJlc2l6ZVN1YjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoTkdYX0VDSEFSVFNfQ09ORklHKSBjb25maWc6IE5neEVjaGFydHNDb25maWcsXG4gICAgcHJpdmF0ZSBlbDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lXG4gICkge1xuICAgIGlmICh0eXBlb2YgKGNvbmZpZykgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHRoaXMuZWNoYXJ0cyA9IGNvbmZpZy5lY2hhcnRzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGJ5cGFzc19jb25maWc6IGFueSA9IGNvbmZpZztcblxuICAgICAgdGhpcy5lY2hhcnRzID0gYnlwYXNzX2NvbmZpZ1swXS5lY2hhcnRzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IGZpbHRlciA9IENoYW5nZUZpbHRlci5vZihjaGFuZ2VzKTtcbiAgICBmaWx0ZXIubm90Rmlyc3RBbmRFbXB0eTxhbnk+KCdvcHRpb25zJykuc3Vic2NyaWJlKChvcHQpID0+IHRoaXMub25PcHRpb25zQ2hhbmdlKG9wdCkpO1xuICAgIGZpbHRlci5ub3RGaXJzdEFuZEVtcHR5PGFueT4oJ21lcmdlJykuc3Vic2NyaWJlKChvcHQpID0+IHRoaXMuc2V0T3B0aW9uKG9wdCkpO1xuICAgIGZpbHRlci5oYXM8Ym9vbGVhbj4oJ2xvYWRpbmcnKS5zdWJzY3JpYmUoKHYpID0+IHRoaXMudG9nZ2xlTG9hZGluZyghIXYpKTtcbiAgICBmaWx0ZXIubm90Rmlyc3Q8c3RyaW5nPigndGhlbWUnKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZWZyZXNoQ2hhcnQoKSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnJlc2l6ZVN1YiA9IGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKVxuICAgICAgLnBpcGUoZGVib3VuY2VUaW1lKDUwKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5hdXRvUmVzaXplICYmIHdpbmRvdy5pbm5lcldpZHRoICE9PSB0aGlzLmN1cnJlbnRXaW5kb3dXaWR0aCkge1xuICAgICAgICAgIHRoaXMuY3VycmVudFdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgdGhpcy5jdXJyZW50T2Zmc2V0V2lkdGggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgdGhpcy5jdXJyZW50T2Zmc2V0SGVpZ2h0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnJlc2l6ZVN1Yikge1xuICAgICAgdGhpcy5yZXNpemVTdWIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgdGhpcy5kaXNwb3NlKCk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKSB7XG4gICAgLy8gTm8gaGVhdnkgd29yayBpbiBEb0NoZWNrIVxuICAgIGlmICh0aGlzLmNoYXJ0ICYmIHRoaXMuYXV0b1Jlc2l6ZSkge1xuICAgICAgY29uc3Qgb2Zmc2V0V2lkdGggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICBjb25zdCBvZmZzZXRIZWlnaHQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50T2Zmc2V0V2lkdGggIT09IG9mZnNldFdpZHRoIHx8IHRoaXMuY3VycmVudE9mZnNldEhlaWdodCAhPT0gb2Zmc2V0SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuY3VycmVudE9mZnNldFdpZHRoID0gb2Zmc2V0V2lkdGg7XG4gICAgICAgIHRoaXMuY3VycmVudE9mZnNldEhlaWdodCA9IG9mZnNldEhlaWdodDtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmluaXRDaGFydCgpKTtcbiAgfVxuXG4gIHByaXZhdGUgZGlzcG9zZSgpIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5kaXNwb3NlKCk7XG4gICAgICB0aGlzLmNoYXJ0ID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlc2l6ZSgpIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5yZXNpemUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRvZ2dsZUxvYWRpbmcobG9hZGluZzogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICBsb2FkaW5nXG4gICAgICAgID8gdGhpcy5jaGFydC5zaG93TG9hZGluZyh0aGlzLmxvYWRpbmdUeXBlLCB0aGlzLmxvYWRpbmdPcHRzKVxuICAgICAgICA6IHRoaXMuY2hhcnQuaGlkZUxvYWRpbmcoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldE9wdGlvbihvcHRpb246IGFueSwgb3B0cz86IGFueSkge1xuICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICB0aGlzLmNoYXJ0LnNldE9wdGlvbihvcHRpb24sIG9wdHMpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVmcmVzaENoYXJ0KCkge1xuICAgIHRoaXMuZGlzcG9zZSgpO1xuICAgIHRoaXMuaW5pdENoYXJ0KCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUNoYXJ0KCkge1xuICAgIHRoaXMuY3VycmVudFdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5jdXJyZW50T2Zmc2V0V2lkdGggPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgdGhpcy5jdXJyZW50T2Zmc2V0SGVpZ2h0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBkb20gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAod2luZG93ICYmIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICBjb25zdCBwcm9wID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZG9tLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCdoZWlnaHQnKTtcbiAgICAgIGlmICgoIXByb3AgfHwgcHJvcCA9PT0gJzBweCcpICYmICghZG9tLnN0eWxlLmhlaWdodCB8fCBkb20uc3R5bGUuaGVpZ2h0ID09PSAnMHB4JykpIHtcbiAgICAgICAgZG9tLnN0eWxlLmhlaWdodCA9ICc0MDBweCc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHRoaXMuZWNoYXJ0cy5pbml0KGRvbSwgdGhpcy50aGVtZSwgdGhpcy5pbml0T3B0cykpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0Q2hhcnQoKSB7XG4gICAgdGhpcy5vbk9wdGlvbnNDaGFuZ2UodGhpcy5vcHRpb25zKTtcblxuICAgIGlmICh0aGlzLm1lcmdlICYmIHRoaXMuY2hhcnQpIHtcbiAgICAgIHRoaXMuc2V0T3B0aW9uKHRoaXMubWVyZ2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25PcHRpb25zQ2hhbmdlKG9wdDogYW55KSB7XG4gICAgaWYgKG9wdCkge1xuICAgICAgaWYgKCF0aGlzLmNoYXJ0KSB7XG4gICAgICAgIHRoaXMuY2hhcnQgPSB0aGlzLmNyZWF0ZUNoYXJ0KCk7XG4gICAgICAgIHRoaXMuY2hhcnRJbml0LmVtaXQodGhpcy5jaGFydCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY2hhcnQuc2V0T3B0aW9uKHRoaXMub3B0aW9ucywgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gYWxsb3dzIHRvIGxhemlseSBiaW5kIHRvIG9ubHkgdGhvc2UgZXZlbnRzIHRoYXQgYXJlIHJlcXVlc3RlZCB0aHJvdWdoIHRoZSBgQE91dHB1dGAgYnkgcGFyZW50IGNvbXBvbmVudHNcbiAgLy8gc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzUxNzg3OTcyL29wdGltYWwtcmVlbnRlcmluZy10aGUtbmd6b25lLWZyb20tZXZlbnRlbWl0dGVyLWV2ZW50IGZvciBtb3JlIGluZm9cbiAgcHJpdmF0ZSBjcmVhdGVMYXp5RXZlbnQ8VD4oZXZlbnROYW1lOiBzdHJpbmcpOiBFdmVudEVtaXR0ZXI8VD4ge1xuICAgIHJldHVybiB0aGlzLmNoYXJ0SW5pdC5waXBlKFxuICAgICAgc3dpdGNoTWFwKFxuICAgICAgICAoY2hhcnQ6IGFueSkgPT5cbiAgICAgICAgICBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcbiAgICAgICAgICAgIGNoYXJ0Lm9uKGV2ZW50TmFtZSwgKGRhdGE6IFQpID0+IHRoaXMubmdab25lLnJ1bigoKSA9PiBvYnNlcnZlci5uZXh0KGRhdGEpKSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4gY2hhcnQub2ZmKGV2ZW50TmFtZSk7XG4gICAgICAgICAgfSksXG4gICAgICApLFxuICAgICkgYXMgRXZlbnRFbWl0dGVyPFQ+O1xuICB9XG59XG4iXX0=