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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7O0FBR3ZDLE1BQU0sT0FBTyxhQUFhO0lBQ3hCLFlBQW9CLHFCQUE0QztRQUE1QywwQkFBcUIsR0FBckIscUJBQXFCLENBQXVCO0lBQUcsQ0FBQztJQUVwRSxRQUFRLENBQUMsT0FBWSxFQUFFLEdBQUcsSUFBVztRQUNuQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDakM7YUFBTTtZQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDeEI7SUFDSCxDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQVksRUFBRSxHQUFHLElBQVc7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN6QixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVELE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsUUFBUSxDQUFDLE9BQVksRUFBRSxHQUFHLElBQVc7UUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN6QixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxFQUFFO1lBQzdCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzdELE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7U0FDL0I7YUFBTTtZQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRU8sbUNBQW1DLENBQUMsaUJBQTJCO1FBQ3JFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFDL0UsT0FBTyxRQUFRLElBQUksaUJBQWlCLENBQUM7SUFDdkMsQ0FBQztJQUVPLGFBQWE7UUFDbkIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUUvRSxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDckIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtZQUMxQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sa0JBQWtCO1FBQ3hCLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFFL0UsT0FBTyxRQUFRLEtBQUssUUFBUSxDQUFDLElBQUksQ0FBQztJQUNwQyxDQUFDOzswRUE5RVUsYUFBYTtxREFBYixhQUFhLFdBQWIsYUFBYTtrREFBYixhQUFhO2NBRHpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSAnLi9sb2ctbGV2ZWwnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTG9nZ2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29uZmlndXJhdGlvblByb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIpIHt9XG5cbiAgbG9nRXJyb3IobWVzc2FnZTogYW55LCAuLi5hcmdzOiBhbnlbXSkge1xuICAgIGlmICh0aGlzLmxvZ2dpbmdJc1R1cm5lZE9mZigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCEhYXJncyAmJiBhcmdzLmxlbmd0aCkge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlLCAuLi5hcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBsb2dXYXJuaW5nKG1lc3NhZ2U6IGFueSwgLi4uYXJnczogYW55W10pIHtcbiAgICBpZiAoIXRoaXMubG9nTGV2ZWxJc1NldCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubG9nZ2luZ0lzVHVybmVkT2ZmKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY3VycmVudExvZ0xldmVsSXNFcXVhbE9yU21hbGxlclRoYW4oTG9nTGV2ZWwuV2FybikpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoISFhcmdzICYmIGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLndhcm4obWVzc2FnZSwgLi4uYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybihtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBsb2dEZWJ1ZyhtZXNzYWdlOiBhbnksIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgaWYgKCF0aGlzLmxvZ0xldmVsSXNTZXQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxvZ2dpbmdJc1R1cm5lZE9mZigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmN1cnJlbnRMb2dMZXZlbElzRXF1YWxPclNtYWxsZXJUaGFuKExvZ0xldmVsLkRlYnVnKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghIWFyZ3MgJiYgYXJncy5sZW5ndGgpIHtcbiAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UsIC4uLmFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhtZXNzYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGN1cnJlbnRMb2dMZXZlbElzRXF1YWxPclNtYWxsZXJUaGFuKGxvZ0xldmVsVG9Db21wYXJlOiBMb2dMZXZlbCkge1xuICAgIGNvbnN0IHsgbG9nTGV2ZWwgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKSB8fCB7fTtcbiAgICByZXR1cm4gbG9nTGV2ZWwgPD0gbG9nTGV2ZWxUb0NvbXBhcmU7XG4gIH1cblxuICBwcml2YXRlIGxvZ0xldmVsSXNTZXQoKSB7XG4gICAgY29uc3QgeyBsb2dMZXZlbCB9ID0gdGhpcy5jb25maWd1cmF0aW9uUHJvdmlkZXIuZ2V0T3BlbklEQ29uZmlndXJhdGlvbigpIHx8IHt9O1xuXG4gICAgaWYgKGxvZ0xldmVsID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGxvZ0xldmVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgbG9nZ2luZ0lzVHVybmVkT2ZmKCkge1xuICAgIGNvbnN0IHsgbG9nTGV2ZWwgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKSB8fCB7fTtcblxuICAgIHJldHVybiBsb2dMZXZlbCA9PT0gTG9nTGV2ZWwuTm9uZTtcbiAgfVxufVxuIl19