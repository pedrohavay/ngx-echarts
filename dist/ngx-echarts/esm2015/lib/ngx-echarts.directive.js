import { __decorate, __param } from "tslib";
import { AfterViewInit, Directive, DoCheck, ElementRef, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, InjectionToken, Inject, } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { ChangeFilter } from './change-filter';
export const NGX_ECHARTS_CONFIG = new InjectionToken('NGX_ECHARTS_CONFIG');
let NgxEchartsDirective = class NgxEchartsDirective {
    constructor(config, el, ngZone) {
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
            const bypass_config = config;
            this.echarts = bypass_config[0].echarts();
        }
    }
    ngOnChanges(changes) {
        const filter = ChangeFilter.of(changes);
        filter.notFirstAndEmpty('options').subscribe((opt) => this.onOptionsChange(opt));
        filter.notFirstAndEmpty('merge').subscribe((opt) => this.setOption(opt));
        filter.has('loading').subscribe((v) => this.toggleLoading(!!v));
        filter.notFirst('theme').subscribe(() => this.refreshChart());
    }
    ngOnInit() {
        this.resizeSub = fromEvent(window, 'resize')
            .pipe(debounceTime(50))
            .subscribe(() => {
            if (this.autoResize && window.innerWidth !== this.currentWindowWidth) {
                this.currentWindowWidth = window.innerWidth;
                this.currentOffsetWidth = this.el.nativeElement.offsetWidth;
                this.currentOffsetHeight = this.el.nativeElement.offsetHeight;
                this.resize();
            }
        });
    }
    ngOnDestroy() {
        if (this.resizeSub) {
            this.resizeSub.unsubscribe();
        }
        this.dispose();
    }
    ngDoCheck() {
        // No heavy work in DoCheck!
        if (this.chart && this.autoResize) {
            const offsetWidth = this.el.nativeElement.offsetWidth;
            const offsetHeight = this.el.nativeElement.offsetHeight;
            if (this.currentOffsetWidth !== offsetWidth || this.currentOffsetHeight !== offsetHeight) {
                this.currentOffsetWidth = offsetWidth;
                this.currentOffsetHeight = offsetHeight;
                this.resize();
            }
        }
    }
    ngAfterViewInit() {
        setTimeout(() => this.initChart());
    }
    dispose() {
        if (this.chart) {
            this.chart.dispose();
            this.chart = null;
        }
    }
    resize() {
        if (this.chart) {
            this.chart.resize();
        }
    }
    toggleLoading(loading) {
        if (this.chart) {
            loading
                ? this.chart.showLoading(this.loadingType, this.loadingOpts)
                : this.chart.hideLoading();
        }
    }
    setOption(option, opts) {
        if (this.chart) {
            this.chart.setOption(option, opts);
        }
    }
    refreshChart() {
        this.dispose();
        this.initChart();
    }
    createChart() {
        this.currentWindowWidth = window.innerWidth;
        this.currentOffsetWidth = this.el.nativeElement.offsetWidth;
        this.currentOffsetHeight = this.el.nativeElement.offsetHeight;
        const dom = this.el.nativeElement;
        if (window && window.getComputedStyle) {
            const prop = window.getComputedStyle(dom, null).getPropertyValue('height');
            if ((!prop || prop === '0px') && (!dom.style.height || dom.style.height === '0px')) {
                dom.style.height = '400px';
            }
        }
        return this.ngZone.runOutsideAngular(() => this.echarts.init(dom, this.theme, this.initOpts));
    }
    initChart() {
        this.onOptionsChange(this.options);
        if (this.merge && this.chart) {
            this.setOption(this.merge);
        }
    }
    onOptionsChange(opt) {
        if (opt) {
            if (!this.chart) {
                this.chart = this.createChart();
                this.chartInit.emit(this.chart);
            }
            this.chart.setOption(this.options, true);
        }
    }
    // allows to lazily bind to only those events that are requested through the `@Output` by parent components
    // see https://stackoverflow.com/questions/51787972/optimal-reentering-the-ngzone-from-eventemitter-event for more info
    createLazyEvent(eventName) {
        return this.chartInit.pipe(switchMap((chart) => new Observable((observer) => {
            chart.on(eventName, (data) => this.ngZone.run(() => observer.next(data)));
            return () => chart.off(eventName);
        })));
    }
};
NgxEchartsDirective.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [NGX_ECHARTS_CONFIG,] }] },
    { type: ElementRef },
    { type: NgZone }
];
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
export { NgxEchartsDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVjaGFydHMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVjaGFydHMvIiwic291cmNlcyI6WyJsaWIvbmd4LWVjaGFydHMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsYUFBYSxFQUNiLFNBQVMsRUFDVCxPQUFPLEVBQ1AsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBQ1QsTUFBTSxFQUNOLE1BQU0sRUFDTixhQUFhLEVBQ2IsY0FBYyxFQUNkLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBZ0IsTUFBTSxNQUFNLENBQUM7QUFDM0QsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFLL0MsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxjQUFjLENBQW1CLG9CQUFvQixDQUFDLENBQUM7QUFNN0YsSUFBYSxtQkFBbUIsR0FBaEMsTUFBYSxtQkFBbUI7SUE4RDlCLFlBQzhCLE1BQXdCLEVBQzVDLEVBQWMsRUFDZCxNQUFjO1FBRGQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLFdBQU0sR0FBTixNQUFNLENBQVE7UUF0RGYsZUFBVSxHQUFHLElBQUksQ0FBQztRQUNsQixnQkFBVyxHQUFHLFNBQVMsQ0FBQztRQUdqQyxxQkFBcUI7UUFDWCxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUU5Qyx1QkFBdUI7UUFDYixlQUFVLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzQyxrQkFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDakQsbUJBQWMsR0FBRyxJQUFJLENBQUMs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ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIERpcmVjdGl2ZSxcbiAgRG9DaGVjayxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgQ2hhbmdlRmlsdGVyIH0gZnJvbSAnLi9jaGFuZ2UtZmlsdGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBOZ3hFY2hhcnRzQ29uZmlnIHtcbiAgZWNoYXJ0czogYW55O1xufVxuZXhwb3J0IGNvbnN0IE5HWF9FQ0hBUlRTX0NPTkZJRyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxOZ3hFY2hhcnRzQ29uZmlnPignTkdYX0VDSEFSVFNfQ09ORklHJyk7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2VjaGFydHMsIFtlY2hhcnRzXScsXG4gIGV4cG9ydEFzOiAnZWNoYXJ0cycsXG59KVxuZXhwb3J0IGNsYXNzIE5neEVjaGFydHNEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBEb0NoZWNrLCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgb3B0aW9uczogYW55O1xuICBASW5wdXQoKSB0aGVtZTogc3RyaW5nO1xuICBASW5wdXQoKSBsb2FkaW5nOiBib29sZWFuO1xuICBASW5wdXQoKSBpbml0T3B0czoge1xuICAgIGRldmljZVBpeGVsUmF0aW8/OiBudW1iZXI7XG4gICAgcmVuZGVyZXI/OiBzdHJpbmc7XG4gICAgd2lkdGg/OiBudW1iZXIgfCBzdHJpbmc7XG4gICAgaGVpZ2h0PzogbnVtYmVyIHwgc3RyaW5nO1xuICB9O1xuICBASW5wdXQoKSBtZXJnZTogYW55O1xuICBASW5wdXQoKSBhdXRvUmVzaXplID0gdHJ1ZTtcbiAgQElucHV0KCkgbG9hZGluZ1R5cGUgPSAnZGVmYXVsdCc7XG4gIEBJbnB1dCgpIGxvYWRpbmdPcHRzOiBvYmplY3Q7XG5cbiAgLy8gbmd4LWVjaGFydHMgZXZlbnRzXG4gIEBPdXRwdXQoKSBjaGFydEluaXQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvLyBlY2hhcnRzIG1vdXNlIGV2ZW50c1xuICBAT3V0cHV0KCkgY2hhcnRDbGljayA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdjbGljaycpO1xuICBAT3V0cHV0KCkgY2hhcnREYmxDbGljayA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdkYmxjbGljaycpO1xuICBAT3V0cHV0KCkgY2hhcnRNb3VzZURvd24gPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbW91c2Vkb3duJyk7XG4gIEBPdXRwdXQoKSBjaGFydE1vdXNlTW92ZSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdtb3VzZW1vdmUnKTtcbiAgQE91dHB1dCgpIGNoYXJ0TW91c2VVcCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdtb3VzZXVwJyk7XG4gIEBPdXRwdXQoKSBjaGFydE1vdXNlT3ZlciA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdtb3VzZW92ZXInKTtcbiAgQE91dHB1dCgpIGNoYXJ0TW91c2VPdXQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbW91c2VvdXQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0R2xvYmFsT3V0ID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2dsb2JhbG91dCcpO1xuICBAT3V0cHV0KCkgY2hhcnRDb250ZXh0TWVudSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdjb250ZXh0bWVudScpO1xuXG4gIC8vIGVjaGFydHMgbW91c2UgZXZlbnRzXG4gIEBPdXRwdXQoKSBjaGFydExlZ2VuZFNlbGVjdENoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbGVnZW5kc2VsZWN0Y2hhbmdlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRMZWdlbmRTZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdsZWdlbmRzZWxlY3RlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRMZWdlbmRVbnNlbGVjdGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2xlZ2VuZHVuc2VsZWN0ZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0TGVnZW5kU2Nyb2xsID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2xlZ2VuZHNjcm9sbCcpO1xuICBAT3V0cHV0KCkgY2hhcnREYXRhWm9vbSA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdkYXRhem9vbScpO1xuICBAT3V0cHV0KCkgY2hhcnREYXRhUmFuZ2VTZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdkYXRhcmFuZ2VzZWxlY3RlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRUaW1lbGluZUNoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgndGltZWxpbmVjaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydFRpbWVsaW5lUGxheUNoYW5nZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgndGltZWxpbmVwbGF5Y2hhbmdlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRSZXN0b3JlID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3Jlc3RvcmUnKTtcbiAgQE91dHB1dCgpIGNoYXJ0RGF0YVZpZXdDaGFuZ2VkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2RhdGF2aWV3Y2hhbmdlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRNYWdpY1R5cGVDaGFuZ2VkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ21hZ2ljdHlwZWNoYW5nZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0UGllU2VsZWN0Q2hhbmdlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdwaWVzZWxlY3RjaGFuZ2VkJyk7XG4gIEBPdXRwdXQoKSBjaGFydFBpZVNlbGVjdGVkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3BpZXNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydFBpZVVuc2VsZWN0ZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgncGlldW5zZWxlY3RlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRNYXBTZWxlY3RDaGFuZ2VkID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ21hcHNlbGVjdGNoYW5nZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0TWFwU2VsZWN0ZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnbWFwc2VsZWN0ZWQnKTtcbiAgQE91dHB1dCgpIGNoYXJ0TWFwVW5zZWxlY3RlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdtYXB1bnNlbGVjdGVkJyk7XG4gIEBPdXRwdXQoKSBjaGFydEF4aXNBcmVhU2VsZWN0ZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnYXhpc2FyZWFzZWxlY3RlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRGb2N1c05vZGVBZGphY2VuY3kgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnZm9jdXNub2RlYWRqYWNlbmN5Jyk7XG4gIEBPdXRwdXQoKSBjaGFydFVuZm9jdXNOb2RlQWRqYWNlbmN5ID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ3VuZm9jdXNub2RlYWRqYWNlbmN5Jyk7XG4gIEBPdXRwdXQoKSBjaGFydEJydXNoID0gdGhpcy5jcmVhdGVMYXp5RXZlbnQoJ2JydXNoJyk7XG4gIEBPdXRwdXQoKSBjaGFydEJydXNoU2VsZWN0ZWQgPSB0aGlzLmNyZWF0ZUxhenlFdmVudCgnYnJ1c2hzZWxlY3RlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRSZW5kZXJlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdyZW5kZXJlZCcpO1xuICBAT3V0cHV0KCkgY2hhcnRGaW5pc2hlZCA9IHRoaXMuY3JlYXRlTGF6eUV2ZW50KCdmaW5pc2hlZCcpO1xuXG4gIHByaXZhdGUgY2hhcnQ6IGFueTtcbiAgcHJpdmF0ZSBlY2hhcnRzOiBhbnk7XG4gIHByaXZhdGUgY3VycmVudE9mZnNldFdpZHRoID0gMDtcbiAgcHJpdmF0ZSBjdXJyZW50T2Zmc2V0SGVpZ2h0ID0gMDtcbiAgcHJpdmF0ZSBjdXJyZW50V2luZG93V2lkdGg6IG51bWJlcjtcbiAgcHJpdmF0ZSByZXNpemVTdWI6IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KE5HWF9FQ0hBUlRTX0NPTkZJRykgY29uZmlnOiBOZ3hFY2hhcnRzQ29uZmlnLFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZVxuICApIHtcbiAgICBpZiAodHlwZW9mIChjb25maWcpID09PSBcIm9iamVjdFwiKSB7XG4gICAgICB0aGlzLmVjaGFydHMgPSBjb25maWcuZWNoYXJ0cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBieXBhc3NfY29uZmlnOiBhbnkgPSBjb25maWc7XG5cbiAgICAgIHRoaXMuZWNoYXJ0cyA9IGJ5cGFzc19jb25maWdbMF0uZWNoYXJ0cygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBjb25zdCBmaWx0ZXIgPSBDaGFuZ2VGaWx0ZXIub2YoY2hhbmdlcyk7XG4gICAgZmlsdGVyLm5vdEZpcnN0QW5kRW1wdHk8YW55Pignb3B0aW9ucycpLnN1YnNjcmliZSgob3B0KSA9PiB0aGlzLm9uT3B0aW9uc0NoYW5nZShvcHQpKTtcbiAgICBmaWx0ZXIubm90Rmlyc3RBbmRFbXB0eTxhbnk+KCdtZXJnZScpLnN1YnNjcmliZSgob3B0KSA9PiB0aGlzLnNldE9wdGlvbihvcHQpKTtcbiAgICBmaWx0ZXIuaGFzPGJvb2xlYW4+KCdsb2FkaW5nJykuc3Vic2NyaWJlKCh2KSA9PiB0aGlzLnRvZ2dsZUxvYWRpbmcoISF2KSk7XG4gICAgZmlsdGVyLm5vdEZpcnN0PHN0cmluZz4oJ3RoZW1lJykuc3Vic2NyaWJlKCgpID0+IHRoaXMucmVmcmVzaENoYXJ0KCkpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5yZXNpemVTdWIgPSBmcm9tRXZlbnQod2luZG93LCAncmVzaXplJylcbiAgICAgIC5waXBlKGRlYm91bmNlVGltZSg1MCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1Jlc2l6ZSAmJiB3aW5kb3cuaW5uZXJXaWR0aCAhPT0gdGhpcy5jdXJyZW50V2luZG93V2lkdGgpIHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRXaW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIHRoaXMuY3VycmVudE9mZnNldFdpZHRoID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICAgIHRoaXMuY3VycmVudE9mZnNldEhlaWdodCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgdGhpcy5yZXNpemUoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5yZXNpemVTdWIpIHtcbiAgICAgIHRoaXMucmVzaXplU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuZGlzcG9zZSgpO1xuICB9XG5cbiAgbmdEb0NoZWNrKCkge1xuICAgIC8vIE5vIGhlYXZ5IHdvcmsgaW4gRG9DaGVjayFcbiAgICBpZiAodGhpcy5jaGFydCAmJiB0aGlzLmF1dG9SZXNpemUpIHtcbiAgICAgIGNvbnN0IG9mZnNldFdpZHRoID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgY29uc3Qgb2Zmc2V0SGVpZ2h0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudE9mZnNldFdpZHRoICE9PSBvZmZzZXRXaWR0aCB8fCB0aGlzLmN1cnJlbnRPZmZzZXRIZWlnaHQgIT09IG9mZnNldEhlaWdodCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXRXaWR0aCA9IG9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLmN1cnJlbnRPZmZzZXRIZWlnaHQgPSBvZmZzZXRIZWlnaHQ7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5pbml0Q2hhcnQoKSk7XG4gIH1cblxuICBwcml2YXRlIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgIHRoaXMuY2hhcnQuZGlzcG9zZSgpO1xuICAgICAgdGhpcy5jaGFydCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNpemUoKSB7XG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgIHRoaXMuY2hhcnQucmVzaXplKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVMb2FkaW5nKGxvYWRpbmc6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgbG9hZGluZ1xuICAgICAgICA/IHRoaXMuY2hhcnQuc2hvd0xvYWRpbmcodGhpcy5sb2FkaW5nVHlwZSwgdGhpcy5sb2FkaW5nT3B0cylcbiAgICAgICAgOiB0aGlzLmNoYXJ0LmhpZGVMb2FkaW5nKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRPcHRpb24ob3B0aW9uOiBhbnksIG9wdHM/OiBhbnkpIHtcbiAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgdGhpcy5jaGFydC5zZXRPcHRpb24ob3B0aW9uLCBvcHRzKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlZnJlc2hDaGFydCgpIHtcbiAgICB0aGlzLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmluaXRDaGFydCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVDaGFydCgpIHtcbiAgICB0aGlzLmN1cnJlbnRXaW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuY3VycmVudE9mZnNldFdpZHRoID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgIHRoaXMuY3VycmVudE9mZnNldEhlaWdodCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgY29uc3QgZG9tID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuXG4gICAgaWYgKHdpbmRvdyAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgY29uc3QgcHJvcCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnaGVpZ2h0Jyk7XG4gICAgICBpZiAoKCFwcm9wIHx8IHByb3AgPT09ICcwcHgnKSAmJiAoIWRvbS5zdHlsZS5oZWlnaHQgfHwgZG9tLnN0eWxlLmhlaWdodCA9PT0gJzBweCcpKSB7XG4gICAgICAgIGRvbS5zdHlsZS5oZWlnaHQgPSAnNDAwcHgnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB0aGlzLmVjaGFydHMuaW5pdChkb20sIHRoaXMudGhlbWUsIHRoaXMuaW5pdE9wdHMpKTtcbiAgfVxuXG4gIHByaXZhdGUgaW5pdENoYXJ0KCkge1xuICAgIHRoaXMub25PcHRpb25zQ2hhbmdlKHRoaXMub3B0aW9ucyk7XG5cbiAgICBpZiAodGhpcy5tZXJnZSAmJiB0aGlzLmNoYXJ0KSB7XG4gICAgICB0aGlzLnNldE9wdGlvbih0aGlzLm1lcmdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uT3B0aW9uc0NoYW5nZShvcHQ6IGFueSkge1xuICAgIGlmIChvcHQpIHtcbiAgICAgIGlmICghdGhpcy5jaGFydCkge1xuICAgICAgICB0aGlzLmNoYXJ0ID0gdGhpcy5jcmVhdGVDaGFydCgpO1xuICAgICAgICB0aGlzLmNoYXJ0SW5pdC5lbWl0KHRoaXMuY2hhcnQpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNoYXJ0LnNldE9wdGlvbih0aGlzLm9wdGlvbnMsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGFsbG93cyB0byBsYXppbHkgYmluZCB0byBvbmx5IHRob3NlIGV2ZW50cyB0aGF0IGFyZSByZXF1ZXN0ZWQgdGhyb3VnaCB0aGUgYEBPdXRwdXRgIGJ5IHBhcmVudCBjb21wb25lbnRzXG4gIC8vIHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy81MTc4Nzk3Mi9vcHRpbWFsLXJlZW50ZXJpbmctdGhlLW5nem9uZS1mcm9tLWV2ZW50ZW1pdHRlci1ldmVudCBmb3IgbW9yZSBpbmZvXG4gIHByaXZhdGUgY3JlYXRlTGF6eUV2ZW50PFQ+KGV2ZW50TmFtZTogc3RyaW5nKTogRXZlbnRFbWl0dGVyPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5jaGFydEluaXQucGlwZShcbiAgICAgIHN3aXRjaE1hcChcbiAgICAgICAgKGNoYXJ0OiBhbnkpID0+XG4gICAgICAgICAgbmV3IE9ic2VydmFibGUoKG9ic2VydmVyKSA9PiB7XG4gICAgICAgICAgICBjaGFydC5vbihldmVudE5hbWUsIChkYXRhOiBUKSA9PiB0aGlzLm5nWm9uZS5ydW4oKCkgPT4gb2JzZXJ2ZXIubmV4dChkYXRhKSkpO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IGNoYXJ0Lm9mZihldmVudE5hbWUpO1xuICAgICAgICAgIH0pLFxuICAgICAgKSxcbiAgICApIGFzIEV2ZW50RW1pdHRlcjxUPjtcbiAgfVxufVxuIl19