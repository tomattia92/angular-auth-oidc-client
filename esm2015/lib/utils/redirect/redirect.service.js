import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as i0 from "@angular/core";
export class RedirectService {
    constructor(doc) {
        this.doc = doc;
    }
    redirectTo(url) {
        this.doc.location.href = url;
    }
}
RedirectService.ɵfac = function RedirectService_Factory(t) { return new (t || RedirectService)(i0.ɵɵinject(DOCUMENT)); };
RedirectService.ɵprov = i0.ɵɵdefineInjectable({ token: RedirectService, factory: RedirectService.ɵfac, providedIn: 'root' });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(RedirectService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], function () { return [{ type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }]; }, null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXJlY3Quc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWF1dGgtb2lkYy1jbGllbnQvc3JjLyIsInNvdXJjZXMiOlsibGliL3V0aWxzL3JlZGlyZWN0L3JlZGlyZWN0LnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOztBQUduRCxNQUFNLE9BQU8sZUFBZTtJQUMxQixZQUErQyxHQUFRO1FBQVIsUUFBRyxHQUFILEdBQUcsQ0FBSztJQUFHLENBQUM7SUFFM0QsVUFBVSxDQUFDLEdBQUc7UUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQy9CLENBQUM7OzhFQUxVLGVBQWUsY0FDTixRQUFRO3VEQURqQixlQUFlLFdBQWYsZUFBZSxtQkFERixNQUFNO2tEQUNuQixlQUFlO2NBRDNCLFVBQVU7ZUFBQyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7O3NCQUVuQixNQUFNO3VCQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBSZWRpcmVjdFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIHJlYWRvbmx5IGRvYzogYW55KSB7fVxuXG4gIHJlZGlyZWN0VG8odXJsKSB7XG4gICAgdGhpcy5kb2MubG9jYXRpb24uaHJlZiA9IHVybDtcbiAgfVxufVxuIl19