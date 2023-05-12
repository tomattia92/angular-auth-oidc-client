import { Injectable } from '@angular/core';
import { LogLevel } from './log-level';
import * as i0 from "@angular/core";
import * as i1 from "../config/config.provider";
export class LoggerService {
    constructor(configurationProvider) {
        this.configurationProvider = configurationProvider;
    }
    logError(message, ...args) {
        if (this.loggingIsTurnedOff()) {
            return;
        }
        if (!!args && args.length) {
            console.error(message, ...args);
        }
        else {
            console.error(message);
        }
    }
    logWarning(message, ...args) {
        if (!this.logLevelIsSet()) {
            return;
        }
        if (this.loggingIsTurnedOff()) {
            return;
        }
        if (!this.currentLogLevelIsEqualOrSmallerThan(LogLevel.Warn)) {
            return;
        }
        if (!!args && args.length) {
            console.warn(message, ...args);
        }
        else {
            console.warn(message);
        }
    }
    logDebug(message, ...args) {
        if (!this.logLevelIsSet()) {
            return;
        }
        if (this.loggingIsTurnedOff()) {
            return;
        }
        if (!this.currentLogLevelIsEqualOrSmallerThan(LogLevel.Debug)) {
            return;
        }
        if (!!args && args.length) {
            console.log(message, ...args);
        }
        else {
            console.log(message);
        }
    }
    currentLogLevelIsEqualOrSmallerThan(logLevelToCompare) {
        const { logLevel } = this.configurationProvider.getOpenIDConfiguration() || {};
        return logLevel <= logLevelToCompare;
    }
    logLevelIsSet() {
        const { logLevel } = this.configurationProvider.getOpenIDConfiguration() || {};
        if (logLevel === null) {
            return false;
        }
        if (logLevel === undefined) {
            return false;
        }
        return true;
    }
    loggingIsTurnedOff() {
        const { logLevel } = this.configurationProvider.getOpenIDConfiguration() || {};
        return logLevel === LogLevel.None;
    }
}
LoggerService.ɵfac = function LoggerService_Factory(t) { return new (t || LoggerService)(i0.ɵɵinject(i1.ConfigurationProvider)); };
LoggerService.ɵprov = i0.ɵɵdefineInjectable({ token: LoggerService, factory: LoggerService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(LoggerService, [{
        type: Injectable
    }], function () { return [{ type: i1.ConfigurationProvider }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7O0FBR3ZDLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFlBQW9CLHFCQUE0QztRQUE1QywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO0lBQUcsQ0FBQztJQUVwRSxRQUFRLENBQUMsT0FBWSxFQUFFLEdBQUcsSUFBVztRQUNuQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDakM7YUFBTTtZQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQVksRUFBRSxHQUFHLElBQVc7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN6QixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVELE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLE9BQVksRUFBRSxHQUFHLElBQVc7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN6QixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdELE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDL0I7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRU8sbUNBQW1DLENBQUMsaUJBQTJCO1FBQ3JFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDL0UsT0FBTyxRQUFRLElBQUksaUJBQWlCLENBQUM7SUFDdkMsQ0FBQztJQUVPLGFBQWE7UUFDbkIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUUvRSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDckIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sa0JBQWtCO1FBQ3hCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFL0UsT0FBTyxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQztJQUNwQyxDQUFDOzswRUE5RVUsYUFBYTtxREFBYixhQUFhLFdBQWIsYUFBYTtrREFBYixhQUFhO2NBRHpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xyXG5pbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gJy4vbG9nLWxldmVsJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIExvZ2dlclNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIpIHt9XHJcblxyXG4gIGxvZ0Vycm9yKG1lc3NhZ2U6IGFueSwgLi4uYXJnczogYW55W10pIHtcclxuICAgIGlmICh0aGlzLmxvZ2dpbmdJc1R1cm5lZE9mZigpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISFhcmdzICYmIGFyZ3MubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IobWVzc2FnZSwgLi4uYXJncyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9nV2FybmluZyhtZXNzYWdlOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICBpZiAoIXRoaXMubG9nTGV2ZWxJc1NldCgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5sb2dnaW5nSXNUdXJuZWRPZmYoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmN1cnJlbnRMb2dMZXZlbElzRXF1YWxPclNtYWxsZXJUaGFuKExvZ0xldmVsLldhcm4pKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISFhcmdzICYmIGFyZ3MubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlLCAuLi5hcmdzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvZ0RlYnVnKG1lc3NhZ2U6IGFueSwgLi4uYXJnczogYW55W10pIHtcclxuICAgIGlmICghdGhpcy5sb2dMZXZlbElzU2V0KCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmxvZ2dpbmdJc1R1cm5lZE9mZigpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuY3VycmVudExvZ0xldmVsSXNFcXVhbE9yU21hbGxlclRoYW4oTG9nTGV2ZWwuRGVidWcpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoISFhcmdzICYmIGFyZ3MubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIC4uLmFyZ3MpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2cobWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGN1cnJlbnRMb2dMZXZlbElzRXF1YWxPclNtYWxsZXJUaGFuKGxvZ0xldmVsVG9Db21wYXJlOiBMb2dMZXZlbCkge1xyXG4gICAgY29uc3QgeyBsb2dMZXZlbCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpIHx8IHt9O1xyXG4gICAgcmV0dXJuIGxvZ0xldmVsIDw9IGxvZ0xldmVsVG9Db21wYXJlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2dMZXZlbElzU2V0KCkge1xyXG4gICAgY29uc3QgeyBsb2dMZXZlbCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpIHx8IHt9O1xyXG5cclxuICAgIGlmIChsb2dMZXZlbCA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGxvZ0xldmVsID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2dnaW5nSXNUdXJuZWRPZmYoKSB7XHJcbiAgICBjb25zdCB7IGxvZ0xldmVsIH0gPSB0aGlzLmNvbmZpZ3VyYXRpb25Qcm92aWRlci5nZXRPcGVuSURDb25maWd1cmF0aW9uKCkgfHwge307XHJcblxyXG4gICAgcmV0dXJuIGxvZ0xldmVsID09PSBMb2dMZXZlbC5Ob25lO1xyXG4gIH1cclxufVxyXG4iXX0=