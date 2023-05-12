import { POSITIVE_VALIDATION_RESULT } from '../rule';
export const ensureClientId = (passedConfig) => {
    if (!passedConfig.clientId) {
        return {
            result: false,
            messages: ['The clientId is required and missing from your config!'],
            level: 'error',
        };
    }
    return POSITIVE_VALIDATION_RESULT;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5zdXJlLWNsaWVudElkLnJ1bGUuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jb25maWctdmFsaWRhdGlvbi9ydWxlcy9lbnN1cmUtY2xpZW50SWQucnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsMEJBQTBCLEVBQXdCLE1BQU0sU0FBUyxDQUFDO0FBRTNFLE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBRyxDQUFDLFlBQWlDLEVBQXdCLEVBQUU7SUFDeEYsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUU7UUFDMUIsT0FBTztZQUNMLE1BQU0sRUFBRSxLQUFLO1lBQ2IsUUFBUSxFQUFFLENBQUMsd0RBQXdELENBQUM7WUFDcEUsS0FBSyxFQUFFLE9BQU87U0FDZixDQUFDO0tBQ0g7SUFFRCxPQUFPLDBCQUEwQixDQUFDO0FBQ3BDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZW5JZENvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi8uLi9jb25maWcvb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xyXG5pbXBvcnQgeyBQT1NJVElWRV9WQUxJREFUSU9OX1JFU1VMVCwgUnVsZVZhbGlkYXRpb25SZXN1bHQgfSBmcm9tICcuLi9ydWxlJztcclxuXHJcbmV4cG9ydCBjb25zdCBlbnN1cmVDbGllbnRJZCA9IChwYXNzZWRDb25maWc6IE9wZW5JZENvbmZpZ3VyYXRpb24pOiBSdWxlVmFsaWRhdGlvblJlc3VsdCA9PiB7XHJcbiAgaWYgKCFwYXNzZWRDb25maWcuY2xpZW50SWQpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlc3VsdDogZmFsc2UsXHJcbiAgICAgIG1lc3NhZ2VzOiBbJ1RoZSBjbGllbnRJZCBpcyByZXF1aXJlZCBhbmQgbWlzc2luZyBmcm9tIHlvdXIgY29uZmlnISddLFxyXG4gICAgICBsZXZlbDogJ2Vycm9yJyxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICByZXR1cm4gUE9TSVRJVkVfVkFMSURBVElPTl9SRVNVTFQ7XHJcbn07XHJcbiJdfQ==