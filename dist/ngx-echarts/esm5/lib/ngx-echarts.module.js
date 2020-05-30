import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { NgxEchartsDirective, NGX_ECHARTS_CONFIG } from './ngx-echarts.directive';
var NgxEchartsModule = /** @class */ (function () {
    function NgxEchartsModule() {
    }
    NgxEchartsModule_1 = NgxEchartsModule;
    NgxEchartsModule.forRoot = function (config) {
        return {
            ngModule: NgxEchartsModule_1,
            providers: [{ provide: NGX_ECHARTS_CONFIG, useValue: config }],
        };
    };
    NgxEchartsModule.forChild = function () {
        return {
            ngModule: NgxEchartsModule_1,
        };
    };
    var NgxEchartsModule_1;
    NgxEchartsModule = NgxEchartsModule_1 = __decorate([
        NgModule({
            imports: [],
            declarations: [NgxEchartsDirective],
            exports: [NgxEchartsDirective]
        })
    ], NgxEchartsModule);
    return NgxEchartsModule;
}());
export { NgxEchartsModule };
export { NgxEchartsDirective };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWVjaGFydHMubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LWVjaGFydHMvIiwic291cmNlcyI6WyJsaWIvbmd4LWVjaGFydHMubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQW9CLGtCQUFrQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFPcEc7SUFBQTtJQVlBLENBQUM7eUJBWlksZ0JBQWdCO0lBQ3BCLHdCQUFPLEdBQWQsVUFBZSxNQUF3QjtRQUNyQyxPQUFPO1lBQ0wsUUFBUSxFQUFFLGtCQUFnQjtZQUMxQixTQUFTLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7U0FDL0QsQ0FBQztJQUNKLENBQUM7SUFDTSx5QkFBUSxHQUFmO1FBQ0UsT0FBTztZQUNMLFFBQVEsRUFBRSxrQkFBZ0I7U0FDM0IsQ0FBQztJQUNKLENBQUM7O0lBWFUsZ0JBQWdCO1FBTDVCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRSxFQUFFO1lBQ1gsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7WUFDbkMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7U0FDL0IsQ0FBQztPQUNXLGdCQUFnQixDQVk1QjtJQUFELHVCQUFDO0NBQUEsQUFaRCxJQVlDO1NBWlksZ0JBQWdCO0FBYzdCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5neEVjaGFydHNEaXJlY3RpdmUsIE5neEVjaGFydHNDb25maWcsIE5HWF9FQ0hBUlRTX0NPTkZJRyB9IGZyb20gJy4vbmd4LWVjaGFydHMuZGlyZWN0aXZlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW10sXG4gIGRlY2xhcmF0aW9uczogW05neEVjaGFydHNEaXJlY3RpdmVdLFxuICBleHBvcnRzOiBbTmd4RWNoYXJ0c0RpcmVjdGl2ZV1cbn0pXG5leHBvcnQgY2xhc3MgTmd4RWNoYXJ0c01vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KGNvbmZpZzogTmd4RWNoYXJ0c0NvbmZpZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmd4RWNoYXJ0c01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW3sgcHJvdmlkZTogTkdYX0VDSEFSVFNfQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnIH1dLFxuICAgIH07XG4gIH1cbiAgc3RhdGljIGZvckNoaWxkKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogTmd4RWNoYXJ0c01vZHVsZSxcbiAgICB9O1xuICB9XG59XG5cbmV4cG9ydCB7IE5neEVjaGFydHNEaXJlY3RpdmUgfTtcbiJdfQ==