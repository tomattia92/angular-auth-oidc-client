import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';
import { EventTypes } from '../public-events/event-types';
import * as i0 from "@angular/core";
import * as i1 from "../storage/storage-persistence.service";
import * as i2 from "../logging/logger.service";
import * as i3 from "./existing-iframe.service";
import * as i4 from "../public-events/public-events.service";
import * as i5 from "../config/config.provider";
const IFRAME_FOR_CHECK_SESSION_IDENTIFIER = 'myiFrameForCheckSession';
// http://openid.net/specs/openid-connect-session-1_0-ID4.html
export class CheckSessionService {
    constructor(storagePersistenceService, loggerService, iFrameService, eventService, configurationProvider, zone) {
        this.storagePersistenceService = storagePersistenceService;
        this.loggerService = loggerService;
        this.iFrameService = iFrameService;
        this.eventService = eventService;
        this.configurationProvider = configurationProvider;
        this.zone = zone;
        this.checkSessionReceived = false;
        this.lastIFrameRefresh = 0;
        this.outstandingMessages = 0;
        this.heartBeatInterval = 3000;
        this.iframeRefreshInterval = 60000;
        this.checkSessionChangedInternal$ = new BehaviorSubject(false);
    }
    get checkSessionChanged$() {
        return this.checkSessionChangedInternal$.asObservable();
    }
    isCheckSessionConfigured() {
        const { startCheckSession } = this.configurationProvider.getOpenIDConfiguration();
        return startCheckSession;
    }
    start() {
        if (!!this.scheduledHeartBeatRunning) {
            return;
        }
        const { clientId } = this.configurationProvider.getOpenIDConfiguration();
        this.pollServerSession(clientId);
    }
    stop() {
        if (!this.scheduledHeartBeatRunning) {
            return;
        }
        this.clearScheduledHeartBeat();
        this.checkSessionReceived = false;
    }
    serverStateChanged() {
        const { startCheckSession } = this.configurationProvider.getOpenIDConfiguration();
        return startCheckSession && this.checkSessionReceived;
    }
    getExistingIframe() {
        return this.iFrameService.getExistingIFrame(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
    }
    init() {
        if (this.lastIFrameRefresh + this.iframeRefreshInterval > Date.now()) {
            return of(undefined);
        }
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        if (!authWellKnownEndPoints) {
            this.loggerService.logWarning('init check session: authWellKnownEndpoints is undefined. Returning.');
            return of();
        }
        const existingIframe = this.getOrCreateIframe();
        const checkSessionIframe = authWellKnownEndPoints.checkSessionIframe;
        if (checkSessionIframe) {
            existingIframe.contentWindow.location.replace(checkSessionIframe);
        }
        else {
            this.loggerService.logWarning('init check session: checkSessionIframe is not configured to run');
        }
        return new Observable((observer) => {
            existingIframe.onload = () => {
                this.lastIFrameRefresh = Date.now();
                observer.next();
                observer.complete();
            };
        });
    }
    pollServerSession(clientId) {
        this.outstandingMessages = 0;
        const pollServerSessionRecur = () => {
            this.init()
                .pipe(take(1))
                .subscribe(() => {
                var _a;
                const existingIframe = this.getExistingIframe();
                if (existingIframe && clientId) {
                    this.loggerService.logDebug(existingIframe);
                    const sessionState = this.storagePersistenceService.read('session_state');
                    const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
                    if (sessionState && (authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.checkSessionIframe)) {
                        const iframeOrigin = (_a = new URL(authWellKnownEndPoints.checkSessionIframe)) === null || _a === void 0 ? void 0 : _a.origin;
                        this.outstandingMessages++;
                        existingIframe.contentWindow.postMessage(clientId + ' ' + sessionState, iframeOrigin);
                    }
                    else {
                        this.loggerService.logDebug(`OidcSecurityCheckSession pollServerSession session_state is '${sessionState}'`);
                        this.loggerService.logDebug(`AuthWellKnownEndPoints is '${JSON.stringify(authWellKnownEndPoints)}'`);
                        this.checkSessionChangedInternal$.next(true);
                    }
                }
                else {
                    this.loggerService.logWarning('OidcSecurityCheckSession pollServerSession checkSession IFrame does not exist');
                    this.loggerService.logDebug(clientId);
                    this.loggerService.logDebug(existingIframe);
                }
                // after sending three messages with no response, fail.
                if (this.outstandingMessages > 3) {
                    this.loggerService.logError(`OidcSecurityCheckSession not receiving check session response messages.
                            Outstanding messages: ${this.outstandingMessages}. Server unreachable?`);
                }
                this.zone.runOutsideAngular(() => {
                    this.scheduledHeartBeatRunning = setTimeout(() => this.zone.run(pollServerSessionRecur), this.heartBeatInterval);
                });
            });
        };
        pollServerSessionRecur();
    }
    clearScheduledHeartBeat() {
        clearTimeout(this.scheduledHeartBeatRunning);
        this.scheduledHeartBeatRunning = null;
    }
    messageHandler(e) {
        var _a;
        const existingIFrame = this.getExistingIframe();
        const authWellKnownEndPoints = this.storagePersistenceService.read('authWellKnownEndPoints');
        const startsWith = !!((_a = authWellKnownEndPoints === null || authWellKnownEndPoints === void 0 ? void 0 : authWellKnownEndPoints.checkSessionIframe) === null || _a === void 0 ? void 0 : _a.startsWith(e.origin));
        this.outstandingMessages = 0;
        if (existingIFrame && startsWith && e.source === existingIFrame.contentWindow) {
            if (e.data === 'error') {
                this.loggerService.logWarning('error from checksession messageHandler');
            }
            else if (e.data === 'changed') {
                this.loggerService.logDebug(e);
                this.checkSessionReceived = true;
                this.eventService.fireEvent(EventTypes.CheckSessionReceived, e.data);
                this.checkSessionChangedInternal$.next(true);
            }
            else {
                this.eventService.fireEvent(EventTypes.CheckSessionReceived, e.data);
                this.loggerService.logDebug(e.data + ' from checksession messageHandler');
            }
        }
    }
    bindMessageEventToIframe() {
        const iframeMessageEvent = this.messageHandler.bind(this);
        window.addEventListener('message', iframeMessageEvent, false);
    }
    getOrCreateIframe() {
        const existingIframe = this.getExistingIframe();
        if (!existingIframe) {
            const frame = this.iFrameService.addIFrameToWindowBody(IFRAME_FOR_CHECK_SESSION_IDENTIFIER);
            this.bindMessageEventToIframe();
            return frame;
        }
        return existingIframe;
    }
}
CheckSessionService.ɵfac = function CheckSessionService_Factory(t) { return new (t || CheckSessionService)(i0.ɵɵinject(i1.StoragePersistenceService), i0.ɵɵinject(i2.LoggerService), i0.ɵɵinject(i3.IFrameService), i0.ɵɵinject(i4.PublicEventsService), i0.ɵɵinject(i5.ConfigurationProvider), i0.ɵɵinject(i0.NgZone)); };
CheckSessionService.ɵprov = i0.ɵɵdefineInjectable({ token: CheckSessionService, factory: CheckSessionService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(CheckSessionService, [{
        type: Injectable
    }], function () { return [{ type: i1.StoragePersistenceService }, { type: i2.LoggerService }, { type: i3.IFrameService }, { type: i4.PublicEventsService }, { type: i5.ConfigurationProvider }, { type: i0.NgZone }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stc2Vzc2lvbi5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvaWZyYW1lL2NoZWNrLXNlc3Npb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ25ELE9BQU8sRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHdEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDhCQUE4QixDQUFDOzs7Ozs7O0FBSzFELE1BQU0sbUNBQW1DLEdBQUcseUJBQXlCLENBQUM7QUFFdEUsOERBQThEO0FBRzlELE1BQU0sT0FBTyxtQkFBbUI7SUFhOUIsWUFDVSx5QkFBb0QsRUFDcEQsYUFBNEIsRUFDNUIsYUFBNEIsRUFDNUIsWUFBaUMsRUFDakMscUJBQTRDLEVBQzVDLElBQVk7UUFMWiw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO1FBQ3BELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLGlCQUFZLEdBQVosWUFBWSxDQUFxQjtRQUNqQywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO1FBQzVDLFNBQUksR0FBSixJQUFJLENBQVE7UUFsQmQseUJBQW9CLEdBQUcsS0FBSyxDQUFDO1FBRTdCLHNCQUFpQixHQUFHLENBQUMsQ0FBQztRQUN0Qix3QkFBbUIsR0FBRyxDQUFDLENBQUM7UUFDeEIsc0JBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLDBCQUFxQixHQUFHLEtBQUssQ0FBQztRQUM5QixpQ0FBNEIsR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztJQWF4RSxDQUFDO0lBWEos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QUNkO1FBRUQsT0FBTyxjQUFjLENBQUM7SUFDeEIsQ0FBQzs7c0ZBeEtVLG1CQUFtQjsyREFBbkIsbUJBQW1CLFdBQW5CLG1CQUFtQjtrREFBbkIsbUJBQW1CO2NBRC9CLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IEV2ZW50VHlwZXMgfSBmcm9tICcuLi9wdWJsaWMtZXZlbnRzL2V2ZW50LXR5cGVzJztcbmltcG9ydCB7IFB1YmxpY0V2ZW50c1NlcnZpY2UgfSBmcm9tICcuLi9wdWJsaWMtZXZlbnRzL3B1YmxpYy1ldmVudHMuc2VydmljZSc7XG5pbXBvcnQgeyBTdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlIH0gZnJvbSAnLi4vc3RvcmFnZS9zdG9yYWdlLXBlcnNpc3RlbmNlLnNlcnZpY2UnO1xuaW1wb3J0IHsgSUZyYW1lU2VydmljZSB9IGZyb20gJy4vZXhpc3RpbmctaWZyYW1lLnNlcnZpY2UnO1xuXG5jb25zdCBJRlJBTUVfRk9SX0NIRUNLX1NFU1NJT05fSURFTlRJRklFUiA9ICdteWlGcmFtZUZvckNoZWNrU2Vzc2lvbic7XG5cbi8vIGh0dHA6Ly9vcGVuaWQubmV0L3NwZWNzL29wZW5pZC1jb25uZWN0LXNlc3Npb24tMV8wLUlENC5odG1sXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDaGVja1Nlc3Npb25TZXJ2aWNlIHtcbiAgcHJpdmF0ZSBjaGVja1Nlc3Npb25SZWNlaXZlZCA9IGZhbHNlO1xuICBwcml2YXRlIHNjaGVkdWxlZEhlYXJ0QmVhdFJ1bm5pbmc6IGFueTtcbiAgcHJpdmF0ZSBsYXN0SUZyYW1lUmVmcmVzaCA9IDA7XG4gIHByaXZhdGUgb3V0c3RhbmRpbmdNZXNzYWdlcyA9IDA7XG4gIHByaXZhdGUgaGVhcnRCZWF0SW50ZXJ2YWwgPSAzMDAwO1xuICBwcml2YXRlIGlmcmFtZVJlZnJlc2hJbnRlcnZhbCA9IDYwMDAwO1xuICBwcml2YXRlIGNoZWNrU2Vzc2lvbkNoYW5nZWRJbnRlcm5hbCQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PGJvb2xlYW4+KGZhbHNlKTtcblxuICBnZXQgY2hlY2tTZXNzaW9uQ2hhbmdlZCQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZEludGVybmFsJC5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcbiAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBpRnJhbWVTZXJ2aWNlOiBJRnJhbWVTZXJ2aWNlLFxuICAgIHByaXZhdGUgZXZlbnRTZXJ2aWNlOiBQdWJsaWNFdmVudHNTZXJ2aWNlLFxuICAgIHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIsXG4gICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmVcbiAgKSB7fVxuXG4gIGlzQ2hlY2tTZXNzaW9uQ29uZmlndXJlZCgpIHtcbiAgICBjb25zdCB7IHN0YXJ0Q2hlY2tTZXNzaW9uIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCk7XG4gICAgcmV0dXJuIHN0YXJ0Q2hlY2tTZXNzaW9uO1xuICB9XG5cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgaWYgKCEhdGhpcy5zY2hlZHVsZWRIZWFydEJlYXRSdW5uaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBjbGllbnRJZCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuICAgIHRoaXMucG9sbFNlcnZlclNlc3Npb24oY2xpZW50SWQpO1xuICB9XG5cbiAgc3RvcCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0UnVubmluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXJTY2hlZHVsZWRIZWFydEJlYXQoKTtcbiAgICB0aGlzLmNoZWNrU2Vzc2lvblJlY2VpdmVkID0gZmFsc2U7XG4gIH1cblxuICBzZXJ2ZXJTdGF0ZUNoYW5nZWQoKSB7XG4gICAgY29uc3QgeyBzdGFydENoZWNrU2Vzc2lvbiB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpO1xuICAgIHJldHVybiBzdGFydENoZWNrU2Vzc2lvbiAmJiB0aGlzLmNoZWNrU2Vzc2lvblJlY2VpdmVkO1xuICB9XG5cbiAgZ2V0RXhpc3RpbmdJZnJhbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaUZyYW1lU2VydmljZS5nZXRFeGlzdGluZ0lGcmFtZShJRlJBTUVfRk9SX0NIRUNLX1NFU1NJT05fSURFTlRJRklFUik7XG4gIH1cblxuICBwcml2YXRlIGluaXQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAodGhpcy5sYXN0SUZyYW1lUmVmcmVzaCArIHRoaXMuaWZyYW1lUmVmcmVzaEludGVydmFsID4gRGF0ZS5ub3coKSkge1xuICAgICAgcmV0dXJuIG9mKHVuZGVmaW5lZCk7XG4gICAgfVxuXG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG5cbiAgICBpZiAoIWF1dGhXZWxsS25vd25FbmRQb2ludHMpIHtcbiAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdpbml0IGNoZWNrIHNlc3Npb246IGF1dGhXZWxsS25vd25FbmRwb2ludHMgaXMgdW5kZWZpbmVkLiBSZXR1cm5pbmcuJyk7XG4gICAgICByZXR1cm4gb2YoKTtcbiAgICB9XG5cbiAgICBjb25zdCBleGlzdGluZ0lmcmFtZSA9IHRoaXMuZ2V0T3JDcmVhdGVJZnJhbWUoKTtcbiAgICBjb25zdCBjaGVja1Nlc3Npb25JZnJhbWUgPSBhdXRoV2VsbEtub3duRW5kUG9pbnRzLmNoZWNrU2Vzc2lvbklmcmFtZTtcblxuICAgIGlmIChjaGVja1Nlc3Npb25JZnJhbWUpIHtcbiAgICAgIGV4aXN0aW5nSWZyYW1lLmNvbnRlbnRXaW5kb3cubG9jYXRpb24ucmVwbGFjZShjaGVja1Nlc3Npb25JZnJhbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnaW5pdCBjaGVjayBzZXNzaW9uOiBjaGVja1Nlc3Npb25JZnJhbWUgaXMgbm90IGNvbmZpZ3VyZWQgdG8gcnVuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgZXhpc3RpbmdJZnJhbWUub25sb2FkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLmxhc3RJRnJhbWVSZWZyZXNoID0gRGF0ZS5ub3coKTtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xuICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgcG9sbFNlcnZlclNlc3Npb24oY2xpZW50SWQ6IHN0cmluZykge1xuICAgIHRoaXMub3V0c3RhbmRpbmdNZXNzYWdlcyA9IDA7XG4gICAgY29uc3QgcG9sbFNlcnZlclNlc3Npb25SZWN1ciA9ICgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCgpXG4gICAgICAgIC5waXBlKHRha2UoMSkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nSWZyYW1lID0gdGhpcy5nZXRFeGlzdGluZ0lmcmFtZSgpO1xuICAgICAgICAgIGlmIChleGlzdGluZ0lmcmFtZSAmJiBjbGllbnRJZCkge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGV4aXN0aW5nSWZyYW1lKTtcbiAgICAgICAgICAgIGNvbnN0IHNlc3Npb25TdGF0ZSA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdzZXNzaW9uX3N0YXRlJyk7XG4gICAgICAgICAgICBjb25zdCBhdXRoV2VsbEtub3duRW5kUG9pbnRzID0gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2F1dGhXZWxsS25vd25FbmRQb2ludHMnKTtcblxuICAgICAgICAgICAgaWYgKHNlc3Npb25TdGF0ZSAmJiBhdXRoV2VsbEtub3duRW5kUG9pbnRzPy5jaGVja1Nlc3Npb25JZnJhbWUpIHtcbiAgICAgICAgICAgICAgY29uc3QgaWZyYW1lT3JpZ2luID0gbmV3IFVSTChhdXRoV2VsbEtub3duRW5kUG9pbnRzLmNoZWNrU2Vzc2lvbklmcmFtZSk/Lm9yaWdpbjtcbiAgICAgICAgICAgICAgdGhpcy5vdXRzdGFuZGluZ01lc3NhZ2VzKys7XG4gICAgICAgICAgICAgIGV4aXN0aW5nSWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoY2xpZW50SWQgKyAnICcgKyBzZXNzaW9uU3RhdGUsIGlmcmFtZU9yaWdpbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYE9pZGNTZWN1cml0eUNoZWNrU2Vzc2lvbiBwb2xsU2VydmVyU2Vzc2lvbiBzZXNzaW9uX3N0YXRlIGlzICcke3Nlc3Npb25TdGF0ZX0nYCk7XG4gICAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhgQXV0aFdlbGxLbm93bkVuZFBvaW50cyBpcyAnJHtKU09OLnN0cmluZ2lmeShhdXRoV2VsbEtub3duRW5kUG9pbnRzKX0nYCk7XG4gICAgICAgICAgICAgIHRoaXMuY2hlY2tTZXNzaW9uQ2hhbmdlZEludGVybmFsJC5uZXh0KHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nV2FybmluZygnT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIHBvbGxTZXJ2ZXJTZXNzaW9uIGNoZWNrU2Vzc2lvbiBJRnJhbWUgZG9lcyBub3QgZXhpc3QnKTtcbiAgICAgICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dEZWJ1ZyhjbGllbnRJZCk7XG4gICAgICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoZXhpc3RpbmdJZnJhbWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGFmdGVyIHNlbmRpbmcgdGhyZWUgbWVzc2FnZXMgd2l0aCBubyByZXNwb25zZSwgZmFpbC5cbiAgICAgICAgICBpZiAodGhpcy5vdXRzdGFuZGluZ01lc3NhZ2VzID4gMykge1xuICAgICAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0Vycm9yKFxuICAgICAgICAgICAgICBgT2lkY1NlY3VyaXR5Q2hlY2tTZXNzaW9uIG5vdCByZWNlaXZpbmcgY2hlY2sgc2Vzc2lvbiByZXNwb25zZSBtZXNzYWdlcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPdXRzdGFuZGluZyBtZXNzYWdlczogJHt0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXN9LiBTZXJ2ZXIgdW5yZWFjaGFibGU/YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zY2hlZHVsZWRIZWFydEJlYXRSdW5uaW5nID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnpvbmUucnVuKHBvbGxTZXJ2ZXJTZXNzaW9uUmVjdXIpLCB0aGlzLmhlYXJ0QmVhdEludGVydmFsKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHBvbGxTZXJ2ZXJTZXNzaW9uUmVjdXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJTY2hlZHVsZWRIZWFydEJlYXQoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuc2NoZWR1bGVkSGVhcnRCZWF0UnVubmluZyk7XG4gICAgdGhpcy5zY2hlZHVsZWRIZWFydEJlYXRSdW5uaW5nID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgbWVzc2FnZUhhbmRsZXIoZTogYW55KSB7XG4gICAgY29uc3QgZXhpc3RpbmdJRnJhbWUgPSB0aGlzLmdldEV4aXN0aW5nSWZyYW1lKCk7XG4gICAgY29uc3QgYXV0aFdlbGxLbm93bkVuZFBvaW50cyA9IHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoV2VsbEtub3duRW5kUG9pbnRzJyk7XG4gICAgY29uc3Qgc3RhcnRzV2l0aCA9ICEhYXV0aFdlbGxLbm93bkVuZFBvaW50cz8uY2hlY2tTZXNzaW9uSWZyYW1lPy5zdGFydHNXaXRoKGUub3JpZ2luKTtcbiAgICB0aGlzLm91dHN0YW5kaW5nTWVzc2FnZXMgPSAwO1xuICAgIGlmIChleGlzdGluZ0lGcmFtZSAmJiBzdGFydHNXaXRoICYmIGUuc291cmNlID09PSBleGlzdGluZ0lGcmFtZS5jb250ZW50V2luZG93KSB7XG4gICAgICBpZiAoZS5kYXRhID09PSAnZXJyb3InKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyU2VydmljZS5sb2dXYXJuaW5nKCdlcnJvciBmcm9tIGNoZWNrc2Vzc2lvbiBtZXNzYWdlSGFuZGxlcicpO1xuICAgICAgfSBlbHNlIGlmIChlLmRhdGEgPT09ICdjaGFuZ2VkJykge1xuICAgICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoZSk7XG4gICAgICAgIHRoaXMuY2hlY2tTZXNzaW9uUmVjZWl2ZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLmV2ZW50U2VydmljZS5maXJlRXZlbnQoRXZlbnRUeXBlcy5DaGVja1Nlc3Npb25SZWNlaXZlZCwgZS5kYXRhKTtcbiAgICAgICAgdGhpcy5jaGVja1Nlc3Npb25DaGFuZ2VkSW50ZXJuYWwkLm5leHQodHJ1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV2ZW50U2VydmljZS5maXJlRXZlbnQoRXZlbnRUeXBlcy5DaGVja1Nlc3Npb25SZWNlaXZlZCwgZS5kYXRhKTtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGUuZGF0YSArICcgZnJvbSBjaGVja3Nlc3Npb24gbWVzc2FnZUhhbmRsZXInKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGJpbmRNZXNzYWdlRXZlbnRUb0lmcmFtZSgpIHtcbiAgICBjb25zdCBpZnJhbWVNZXNzYWdlRXZlbnQgPSB0aGlzLm1lc3NhZ2VIYW5kbGVyLmJpbmQodGhpcyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBpZnJhbWVNZXNzYWdlRXZlbnQsIGZhbHNlKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0T3JDcmVhdGVJZnJhbWUoKSB7XG4gICAgY29uc3QgZXhpc3RpbmdJZnJhbWUgPSB0aGlzLmdldEV4aXN0aW5nSWZyYW1lKCk7XG5cbiAgICBpZiAoIWV4aXN0aW5nSWZyYW1lKSB7XG4gICAgICBjb25zdCBmcmFtZSA9IHRoaXMuaUZyYW1lU2VydmljZS5hZGRJRnJhbWVUb1dpbmRvd0JvZHkoSUZSQU1FX0ZPUl9DSEVDS19TRVNTSU9OX0lERU5USUZJRVIpO1xuICAgICAgdGhpcy5iaW5kTWVzc2FnZUV2ZW50VG9JZnJhbWUoKTtcbiAgICAgIHJldHVybiBmcmFtZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZXhpc3RpbmdJZnJhbWU7XG4gIH1cbn1cbiJdfQ==