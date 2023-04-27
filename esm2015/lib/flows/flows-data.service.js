import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../storage/storage-persistence.service";
import * as i2 from "./random/random.service";
import * as i3 from "../config/config.provider";
import * as i4 from "../logging/logger.service";
export class FlowsDataService {
    constructor(storagePersistenceService, randomService, configurationProvider, loggerService) {
        this.storagePersistenceService = storagePersistenceService;
        this.randomService = randomService;
        this.configurationProvider = configurationProvider;
        this.loggerService = loggerService;
    }
    createNonce() {
        const nonce = this.randomService.createRandom(40);
        this.setNonce(nonce);
        return nonce;
    }
    setNonce(nonce) {
        this.storagePersistenceService.write('authNonce', nonce);
    }
    getAuthStateControl() {
        return this.storagePersistenceService.read('authStateControl');
    }
    setAuthStateControl(authStateControl) {
        this.storagePersistenceService.write('authStateControl', authStateControl);
    }
    getExistingOrCreateAuthStateControl() {
        let state = this.storagePersistenceService.read('authStateControl');
        if (!state) {
            state = this.randomService.createRandom(40);
            this.storagePersistenceService.write('authStateControl', state);
        }
        return state;
    }
    setSessionState(sessionState) {
        this.storagePersistenceService.write('session_state', sessionState);
    }
    resetStorageFlowData() {
        this.storagePersistenceService.resetStorageFlowData();
    }
    getCodeVerifier() {
        return this.storagePersistenceService.read('codeVerifier');
    }
    createCodeVerifier() {
        const codeVerifier = this.randomService.createRandom(67);
        this.storagePersistenceService.write('codeVerifier', codeVerifier);
        return codeVerifier;
    }
    isSilentRenewRunning() {
        const storageObject = JSON.parse(this.storagePersistenceService.read('storageSilentRenewRunning'));
        if (storageObject) {
            const { silentRenewTimeoutInSeconds } = this.configurationProvider.getOpenIDConfiguration();
            const timeOutInMilliseconds = silentRenewTimeoutInSeconds * 1000;
            const dateOfLaunchedProcessUtc = Date.parse(storageObject.dateOfLaunchedProcessUtc);
            const currentDateUtc = Date.parse(new Date().toISOString());
            const elapsedTimeInMilliseconds = Math.abs(currentDateUtc - dateOfLaunchedProcessUtc);
            const isProbablyStuck = elapsedTimeInMilliseconds > timeOutInMilliseconds;
            if (isProbablyStuck) {
                this.loggerService.logDebug('silent renew process is probably stuck, state will be reset.');
                this.resetSilentRenewRunning();
                return false;
            }
            return storageObject.state === 'running';
        }
        return false;
    }
    setSilentRenewRunning() {
        const storageObject = {
            state: 'running',
            dateOfLaunchedProcessUtc: new Date().toISOString(),
        };
        this.storagePersistenceService.write('storageSilentRenewRunning', JSON.stringify(storageObject));
    }
    resetSilentRenewRunning() {
        this.storagePersistenceService.write('storageSilentRenewRunning', '');
    }
}
FlowsDataService.ɵfac = function FlowsDataService_Factory(t) { return new (t || FlowsDataService)(i0.ɵɵinject(i1.StoragePersistenceService), i0.ɵɵinject(i2.RandomService), i0.ɵɵinject(i3.ConfigurationProvider), i0.ɵɵinject(i4.LoggerService)); };
FlowsDataService.ɵprov = i0.ɵɵdefineInjectable({ token: FlowsDataService, factory: FlowsDataService.ɵfac });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(FlowsDataService, [{
        type: Injectable
    }], function () { return [{ type: i1.StoragePersistenceService }, { type: i2.RandomService }, { type: i3.ConfigurationProvider }, { type: i4.LoggerService }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmxvd3MtZGF0YS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3Byb2plY3RzL2FuZ3VsYXItYXV0aC1vaWRjLWNsaWVudC9zcmMvIiwic291cmNlcyI6WyJsaWIvZmxvd3MvZmxvd3MtZGF0YS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7OztBQU8zQyxNQUFNLE9BQU8sZ0JBQWdCO0lBQzNCLFlBQ1UseUJBQW9ELEVBQ3BELGFBQTRCLEVBQzVCLHFCQUE0QyxFQUM1QyxhQUE0QjtRQUg1Qiw4QkFBeUIsR0FBekIseUJBQXlCLENBQTJCO1FBQ3BELGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQzVCLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBdUI7UUFDNUMsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFDbkMsQ0FBQztJQUVKLFdBQVc7UUFDVCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFhO1FBQ3BCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxtQkFBbUI7UUFDakIsT0FBTyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELG1CQUFtQixDQUFDLGdCQUF3QjtRQUMxQyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUVELG1DQUFtQztRQUNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsZUFBZSxDQUFDLFlBQWlCO1FBQy9CLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxvQkFBb0I7UUFDbEIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDeEQsQ0FBQztJQUVELGVBQWU7UUFDYixPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELGtCQUFrQjtRQUNoQixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUNuRSxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUQsb0JBQW9CO1FBQ2xCLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUM7UUFFbkcsSUFBSSxhQUFhLEVBQUU7WUFDakIsTUFBTSxFQUFFLDJCQUEyQixFQUFFLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDNUYsTUFBTSxxQkFBcUIsR0FBRywyQkFBMkIsR0FBRyxJQUFJLENBQUM7WUFDakUsTUFBTSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3BGLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQzVELE1BQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEdBQUcsd0JBQXdCLENBQUMsQ0FBQztZQUN0RixNQUFNLGVBQWUsR0FBRyx5QkFBeUIsR0FBRyxxQkFBcUIsQ0FBQztZQUUxRSxJQUFJLGVBQWUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsOERBQThELENBQUMsQ0FBQztnQkFDNUYsSUFBSSxDQUFDLHVCQUF1QixFQUFFLENBQUM7Z0JBQy9CLE9BQU8sS0FBSyxDQUFDO2FBQ2Q7WUFFRCxPQUFPLGFBQWEsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO1NBQzFDO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQscUJBQXFCO1FBQ25CLE1BQU0sYUFBYSxHQUFHO1lBQ3BCLEtBQUssRUFBRSxTQUFTO1lBQ2hCLHdCQUF3QixFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFO1NBQ25ELENBQUM7UUFFRixJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLDJCQUEyQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNuRyxDQUFDO0lBRUQsdUJBQXVCO1FBQ3JCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDeEUsQ0FBQzs7Z0ZBdkZVLGdCQUFnQjt3REFBaEIsZ0JBQWdCLFdBQWhCLGdCQUFnQjtrREFBaEIsZ0JBQWdCO2NBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuLi9jb25maWcvY29uZmlnLnByb3ZpZGVyJztcbmltcG9ydCB7IExvZ2dlclNlcnZpY2UgfSBmcm9tICcuLi9sb2dnaW5nL2xvZ2dlci5zZXJ2aWNlJztcbmltcG9ydCB7IFN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UgfSBmcm9tICcuLi9zdG9yYWdlL3N0b3JhZ2UtcGVyc2lzdGVuY2Uuc2VydmljZSc7XG5pbXBvcnQgeyBSYW5kb21TZXJ2aWNlIH0gZnJvbSAnLi9yYW5kb20vcmFuZG9tLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgRmxvd3NEYXRhU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZTogU3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZSxcbiAgICBwcml2YXRlIHJhbmRvbVNlcnZpY2U6IFJhbmRvbVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uUHJvdmlkZXI6IENvbmZpZ3VyYXRpb25Qcm92aWRlcixcbiAgICBwcml2YXRlIGxvZ2dlclNlcnZpY2U6IExvZ2dlclNlcnZpY2VcbiAgKSB7fVxuXG4gIGNyZWF0ZU5vbmNlKCk6IHN0cmluZyB7XG4gICAgY29uc3Qgbm9uY2UgPSB0aGlzLnJhbmRvbVNlcnZpY2UuY3JlYXRlUmFuZG9tKDQwKTtcbiAgICB0aGlzLnNldE5vbmNlKG5vbmNlKTtcbiAgICByZXR1cm4gbm9uY2U7XG4gIH1cblxuICBzZXROb25jZShub25jZTogc3RyaW5nKSB7XG4gICAgdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLndyaXRlKCdhdXRoTm9uY2UnLCBub25jZSk7XG4gIH1cblxuICBnZXRBdXRoU3RhdGVDb250cm9sKCk6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS5yZWFkKCdhdXRoU3RhdGVDb250cm9sJyk7XG4gIH1cblxuICBzZXRBdXRoU3RhdGVDb250cm9sKGF1dGhTdGF0ZUNvbnRyb2w6IHN0cmluZykge1xuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnYXV0aFN0YXRlQ29udHJvbCcsIGF1dGhTdGF0ZUNvbnRyb2wpO1xuICB9XG5cbiAgZ2V0RXhpc3RpbmdPckNyZWF0ZUF1dGhTdGF0ZUNvbnRyb2woKTogYW55IHtcbiAgICBsZXQgc3RhdGUgPSB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVhZCgnYXV0aFN0YXRlQ29udHJvbCcpO1xuICAgIGlmICghc3RhdGUpIHtcbiAgICAgIHN0YXRlID0gdGhpcy5yYW5kb21TZXJ2aWNlLmNyZWF0ZVJhbmRvbSg0MCk7XG4gICAgICB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2Uud3JpdGUoJ2F1dGhTdGF0ZUNvbnRyb2wnLCBzdGF0ZSk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIHNldFNlc3Npb25TdGF0ZShzZXNzaW9uU3RhdGU6IGFueSkge1xuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc2Vzc2lvbl9zdGF0ZScsIHNlc3Npb25TdGF0ZSk7XG4gIH1cblxuICByZXNldFN0b3JhZ2VGbG93RGF0YSgpIHtcbiAgICB0aGlzLnN0b3JhZ2VQZXJzaXN0ZW5jZVNlcnZpY2UucmVzZXRTdG9yYWdlRmxvd0RhdGEoKTtcbiAgfVxuXG4gIGdldENvZGVWZXJpZmllcigpIHtcbiAgICByZXR1cm4gdGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ2NvZGVWZXJpZmllcicpO1xuICB9XG5cbiAgY3JlYXRlQ29kZVZlcmlmaWVyKCkge1xuICAgIGNvbnN0IGNvZGVWZXJpZmllciA9IHRoaXMucmFuZG9tU2VydmljZS5jcmVhdGVSYW5kb20oNjcpO1xuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnY29kZVZlcmlmaWVyJywgY29kZVZlcmlmaWVyKTtcbiAgICByZXR1cm4gY29kZVZlcmlmaWVyO1xuICB9XG5cbiAgaXNTaWxlbnRSZW5ld1J1bm5pbmcoKSB7XG4gICAgY29uc3Qgc3RvcmFnZU9iamVjdCA9IEpTT04ucGFyc2UodGhpcy5zdG9yYWdlUGVyc2lzdGVuY2VTZXJ2aWNlLnJlYWQoJ3N0b3JhZ2VTaWxlbnRSZW5ld1J1bm5pbmcnKSk7XG5cbiAgICBpZiAoc3RvcmFnZU9iamVjdCkge1xuICAgICAgY29uc3QgeyBzaWxlbnRSZW5ld1RpbWVvdXRJblNlY29uZHMgfSA9IHRoaXMuY29uZmlndXJhdGlvblByb3ZpZGVyLmdldE9wZW5JRENvbmZpZ3VyYXRpb24oKTtcbiAgICAgIGNvbnN0IHRpbWVPdXRJbk1pbGxpc2Vjb25kcyA9IHNpbGVudFJlbmV3VGltZW91dEluU2Vjb25kcyAqIDEwMDA7XG4gICAgICBjb25zdCBkYXRlT2ZMYXVuY2hlZFByb2Nlc3NVdGMgPSBEYXRlLnBhcnNlKHN0b3JhZ2VPYmplY3QuZGF0ZU9mTGF1bmNoZWRQcm9jZXNzVXRjKTtcbiAgICAgIGNvbnN0IGN1cnJlbnREYXRlVXRjID0gRGF0ZS5wYXJzZShuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkpO1xuICAgICAgY29uc3QgZWxhcHNlZFRpbWVJbk1pbGxpc2Vjb25kcyA9IE1hdGguYWJzKGN1cnJlbnREYXRlVXRjIC0gZGF0ZU9mTGF1bmNoZWRQcm9jZXNzVXRjKTtcbiAgICAgIGNvbnN0IGlzUHJvYmFibHlTdHVjayA9IGVsYXBzZWRUaW1lSW5NaWxsaXNlY29uZHMgPiB0aW1lT3V0SW5NaWxsaXNlY29uZHM7XG5cbiAgICAgIGlmIChpc1Byb2JhYmx5U3R1Y2spIHtcbiAgICAgICAgdGhpcy5sb2dnZXJTZXJ2aWNlLmxvZ0RlYnVnKCdzaWxlbnQgcmVuZXcgcHJvY2VzcyBpcyBwcm9iYWJseSBzdHVjaywgc3RhdGUgd2lsbCBiZSByZXNldC4nKTtcbiAgICAgICAgdGhpcy5yZXNldFNpbGVudFJlbmV3UnVubmluZygpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzdG9yYWdlT2JqZWN0LnN0YXRlID09PSAncnVubmluZyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc2V0U2lsZW50UmVuZXdSdW5uaW5nKCkge1xuICAgIGNvbnN0IHN0b3JhZ2VPYmplY3QgPSB7XG4gICAgICBzdGF0ZTogJ3J1bm5pbmcnLFxuICAgICAgZGF0ZU9mTGF1bmNoZWRQcm9jZXNzVXRjOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgfTtcblxuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZVNpbGVudFJlbmV3UnVubmluZycsIEpTT04uc3RyaW5naWZ5KHN0b3JhZ2VPYmplY3QpKTtcbiAgfVxuXG4gIHJlc2V0U2lsZW50UmVuZXdSdW5uaW5nKCkge1xuICAgIHRoaXMuc3RvcmFnZVBlcnNpc3RlbmNlU2VydmljZS53cml0ZSgnc3RvcmFnZVNpbGVudFJlbmV3UnVubmluZycsICcnKTtcbiAgfVxufVxuIl19