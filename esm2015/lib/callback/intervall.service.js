import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export class IntervallService {
    constructor(zone) {
        this.zone = zone;
        this.runTokenValidationRunning = null;
    }
    stopPeriodicallTokenCheck() {
        if (this.runTokenValidationRunning) {
            this.runTokenValidationRunning.unsubscribe();
            this.runTokenValidationRunning = null;
        }
    }
    startPeriodicTokenCheck(repeatAfterSeconds) {
        const millisecondsDelayBetweenTokenCheck = repeatAfterSeconds * 1000;
        return new Observable((subscriber) => {
            let intervalId;
            this.zone.runOutsideAngular(() => {
                intervalId = setInterval(() => this.zone.run(() => subscriber.next()), millisecondsDelayBetweenTokenCheck);
            });
            return () => {
                clearInterval(intervalId);
            };
        });
    }
}
IntervallService.ɵfac = function IntervallService_Factory(t) { return new (t || IntervallService)(i0.ɵɵinject(i0.NgZone)); };
IntervallService.ɵprov = i0.ɵɵdefineInjectable({ token: IntervallService, factory: IntervallService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(IntervallService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: i0.NgZone }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWxsLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jYWxsYmFjay9pbnRlcnZhbGwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxVQUFVLEVBQWdCLE1BQU0sTUFBTSxDQUFDOztBQUdoRCxNQUFNLE9BQU8sZ0JBQWdCO0lBRzNCLFlBQW9CLElBQVk7UUFBWixTQUFJLEdBQUosSUFBSSxDQUFRO1FBRmhDLDhCQUF5QixHQUFpQixJQUFJLENBQUM7SUFFWixDQUFDO0lBRXBDLHlCQUF5QjtRQUN2QixJQUFJLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtZQUNsQyxJQUFJLENBQUMseUJBQXlCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDN0MsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQztTQUN2QztJQUNILENBQUM7SUFFRCx1QkFBdUIsQ0FBQyxrQkFBMEI7UUFDaEQsTUFBTSxrQ0FBa0MsR0FBRyxrQkFBa0IsR0FBRyxJQUFJLENBQUM7UUFFckUsT0FBTyxJQUFJLFVBQVUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ25DLElBQUksVUFBVSxDQUFDO1lBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQy9CLFVBQVUsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsa0NBQWtDLENBQUMsQ0FBQztZQUM3RyxDQUFDLENBQUMsQ0FBQztZQUVILE9BQU8sR0FBRyxFQUFFO2dCQUNWLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM1QixDQUFDLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7O2dGQXpCVSxnQkFBZ0I7d0RBQWhCLGdCQUFnQixXQUFoQixnQkFBZ0IsbUJBREgsTUFBTTtrREFDbkIsZ0JBQWdCO2NBRDVCLFVBQVU7ZUFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIEludGVydmFsbFNlcnZpY2Uge1xuICBydW5Ub2tlblZhbGlkYXRpb25SdW5uaW5nOiBTdWJzY3JpcHRpb24gPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgem9uZTogTmdab25lKSB7fVxuXG4gIHN0b3BQZXJpb2RpY2FsbFRva2VuQ2hlY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucnVuVG9rZW5WYWxpZGF0aW9uUnVubmluZykge1xuICAgICAgdGhpcy5ydW5Ub2tlblZhbGlkYXRpb25SdW5uaW5nLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnJ1blRva2VuVmFsaWRhdGlvblJ1bm5pbmcgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0UGVyaW9kaWNUb2tlbkNoZWNrKHJlcGVhdEFmdGVyU2Vjb25kczogbnVtYmVyKSB7XG4gICAgY29uc3QgbWlsbGlzZWNvbmRzRGVsYXlCZXR3ZWVuVG9rZW5DaGVjayA9IHJlcGVhdEFmdGVyU2Vjb25kcyAqIDEwMDA7XG5cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgIGxldCBpbnRlcnZhbElkO1xuICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgaW50ZXJ2YWxJZCA9IHNldEludGVydmFsKCgpID0+IHRoaXMuem9uZS5ydW4oKCkgPT4gc3Vic2NyaWJlci5uZXh0KCkpLCBtaWxsaXNlY29uZHNEZWxheUJldHdlZW5Ub2tlbkNoZWNrKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxufVxuIl19