import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../config/config.provider";
import * as i2 from "../logging/logger.service";
export class BrowserStorageService {
    constructor(configProvider, loggerService) {
        this.configProvider = configProvider;
        this.loggerService = loggerService;
    }
    read(key) {
        var _a;
        if (!this.hasStorage()) {
            this.loggerService.logDebug(`Wanted to read '${key}' but Storage was undefined`);
            return false;
        }
        const item = (_a = this.getStorage()) === null || _a === void 0 ? void 0 : _a.getItem(key);
        if (!item) {
            this.loggerService.logDebug(`Wanted to read '${key}' but nothing was found`);
            return null;
        }
        return JSON.parse(item);
    }
    write(key, value) {
        if (!this.hasStorage()) {
            this.loggerService.logDebug(`Wanted to write '${key}/${value}' but Storage was falsy`);
            return false;
        }
        const storage = this.getStorage();
        if (!storage) {
            this.loggerService.logDebug(`Wanted to write '${key}/${value}' but Storage was falsy`);
            return false;
        }
        value = value || null;
        storage.setItem(`${key}`, JSON.stringify(value));
        return true;
    }
    remove(key) {
        if (!this.hasStorage()) {
            this.loggerService.logDebug(`Wanted to remove '${key}' but Storage was falsy`);
            return false;
        }
        const storage = this.getStorage();
        if (!storage) {
            this.loggerService.logDebug(`Wanted to write '${key}' but Storage was falsy`);
            return false;
        }
        storage.removeItem(`${key}`);
        return true;
    }
    getStorage() {
        const config = this.configProvider.getOpenIDConfiguration();
        if (!config) {
            return null;
        }
        return config.storage;
    }
    hasStorage() {
        return typeof Storage !== 'undefined';
    }
}
BrowserStorageService.ɵfac = function BrowserStorageService_Factory(t) { return new (t || BrowserStorageService)(i0.ɵɵinject(i1.ConfigurationProvider), i0.ɵɵinject(i2.LoggerService)); };
BrowserStorageService.ɵprov = i0.ɵɵdefineInjectable({ token: BrowserStorageService, factory: BrowserStorageService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BrowserStorageService, [{
        type: Injectable
    }], function () { return [{ type: i1.ConfigurationProvider }, { type: i2.LoggerService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1zdG9yYWdlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9zdG9yYWdlL2Jyb3dzZXItc3RvcmFnZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFNM0MsTUFBTSxPQUFPLHFCQUFxQjtJQUNoQyxZQUFvQixjQUFxQyxFQUFVLGFBQTRCO1FBQTNFLG1CQUFjLEdBQWQsY0FBYyxDQUF1QjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO0lBQUcsQ0FBQztJQUVuRyxJQUFJLENBQUMsR0FBVzs7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLG1CQUFtQixHQUFHLDZCQUE2QixDQUFDLENBQUM7WUFDakYsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELE1BQU0sSUFBSSxTQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsMENBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzdFLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFXLEVBQUUsS0FBVTtRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLG9CQUFvQixHQUFHLElBQUksS0FBSyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLG9CQUFvQixHQUFHLElBQUksS0FBSyx5QkFBeUIsQ0FBQyxDQUFDO1lBQ3ZGLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxLQUFLLEdBQUcsS0FBSyxJQUFJLElBQUksQ0FBQztRQUV0QixPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFXO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMscUJBQXFCLEdBQUcseUJBQXlCLENBQUMsQ0FBQztZQUMvRSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO1lBQzlFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM3QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxVQUFVO1FBQ2hCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM1RCxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBRU8sVUFBVTtRQUNoQixPQUFPLE9BQU8sT0FBTyxLQUFLLFdBQVcsQ0FBQztJQUN4QyxDQUFDOzswRkFoRVUscUJBQXFCOzZEQUFyQixxQkFBcUIsV0FBckIscUJBQXFCO2tEQUFyQixxQkFBcUI7Y0FEakMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4uL2NvbmZpZy9jb25maWcucHJvdmlkZXInO1xuaW1wb3J0IHsgTG9nZ2VyU2VydmljZSB9IGZyb20gJy4uL2xvZ2dpbmcvbG9nZ2VyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQWJzdHJhY3RTZWN1cml0eVN0b3JhZ2UgfSBmcm9tICcuL2Fic3RyYWN0LXNlY3VyaXR5LXN0b3JhZ2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQnJvd3NlclN0b3JhZ2VTZXJ2aWNlIGltcGxlbWVudHMgQWJzdHJhY3RTZWN1cml0eVN0b3JhZ2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbmZpZ1Byb3ZpZGVyOiBDb25maWd1cmF0aW9uUHJvdmlkZXIsIHByaXZhdGUgbG9nZ2VyU2VydmljZTogTG9nZ2VyU2VydmljZSkge31cblxuICByZWFkKGtleTogc3RyaW5nKTogYW55IHtcbiAgICBpZiAoIXRoaXMuaGFzU3RvcmFnZSgpKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYFdhbnRlZCB0byByZWFkICcke2tleX0nIGJ1dCBTdG9yYWdlIHdhcyB1bmRlZmluZWRgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRTdG9yYWdlKCk/LmdldEl0ZW0oa2V5KTtcblxuICAgIGlmICghaXRlbSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBXYW50ZWQgdG8gcmVhZCAnJHtrZXl9JyBidXQgbm90aGluZyB3YXMgZm91bmRgKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBKU09OLnBhcnNlKGl0ZW0pO1xuICB9XG5cbiAgd3JpdGUoa2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuaGFzU3RvcmFnZSgpKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYFdhbnRlZCB0byB3cml0ZSAnJHtrZXl9LyR7dmFsdWV9JyBidXQgU3RvcmFnZSB3YXMgZmFsc3lgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBzdG9yYWdlID0gdGhpcy5nZXRTdG9yYWdlKCk7XG4gICAgaWYgKCFzdG9yYWdlKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYFdhbnRlZCB0byB3cml0ZSAnJHtrZXl9LyR7dmFsdWV9JyBidXQgU3RvcmFnZSB3YXMgZmFsc3lgKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YWx1ZSA9IHZhbHVlIHx8IG51bGw7XG5cbiAgICBzdG9yYWdlLnNldEl0ZW0oYCR7a2V5fWAsIEpTT04uc3RyaW5naWZ5KHZhbHVlKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZW1vdmUoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBpZiAoIXRoaXMuaGFzU3RvcmFnZSgpKSB7XG4gICAgICB0aGlzLmxvZ2dlclNlcnZpY2UubG9nRGVidWcoYFdhbnRlZCB0byByZW1vdmUgJyR7a2V5fScgYnV0IFN0b3JhZ2Ugd2FzIGZhbHN5YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RvcmFnZSA9IHRoaXMuZ2V0U3RvcmFnZSgpO1xuICAgIGlmICghc3RvcmFnZSkge1xuICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKGBXYW50ZWQgdG8gd3JpdGUgJyR7a2V5fScgYnV0IFN0b3JhZ2Ugd2FzIGZhbHN5YCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgc3RvcmFnZS5yZW1vdmVJdGVtKGAke2tleX1gKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U3RvcmFnZSgpIHtcbiAgICBjb25zdCBjb25maWcgPSB0aGlzLmNvbmZpZ1Byb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcbiAgICBpZiAoIWNvbmZpZykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbmZpZy5zdG9yYWdlO1xuICB9XG5cbiAgcHJpdmF0ZSBoYXNTdG9yYWdlKCkge1xuICAgIHJldHVybiB0eXBlb2YgU3RvcmFnZSAhPT0gJ3VuZGVmaW5lZCc7XG4gIH1cbn1cbiJdfQ==