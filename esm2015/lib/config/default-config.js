import { LogLevel } from '../logging/log-level';
export const DEFAULT_CONFIG = {
    stsServer: 'https://please_set',
    authWellknownEndpoint: '',
    redirectUrl: 'https://please_set',
    clientId: 'please_set',
    responseType: 'code',
    scope: 'openid email profile',
    hdParam: '',
    postLogoutRedirectUri: 'https://please_set',
    startCheckSession: false,
    silentRenew: false,
    silentRenewUrl: 'https://please_set',
    silentRenewTimeoutInSeconds: 20,
    renewTimeBeforeTokenExpiresInSeconds: 0,
    useRefreshToken: false,
    usePushedAuthorisationRequests: false,
    ignoreNonceAfterRefresh: false,
    postLoginRoute: '/',
    forbiddenRoute: '/forbidden',
    unauthorizedRoute: '/unauthorized',
    autoUserinfo: true,
    autoCleanStateAfterAuthentication: true,
    triggerAuthorizationResultEvent: false,
    logLevel: LogLevel.Warn,
    issValidationOff: false,
    historyCleanupOff: false,
    maxIdTokenIatOffsetAllowedInSeconds: 120,
    disableIatOffsetValidation: false,
    storage: typeof Storage !== 'undefined' ? sessionStorage : null,
    customParams: {},
    customParamsRefreshToken: {},
    customParamsEndSession: {},
    eagerLoadAuthWellKnownEndpoints: true,
    disableRefreshIdTokenAuthTimeValidation: false,
    tokenRefreshInSeconds: 4,
    refreshTokenRetryInSeconds: 3,
    ngswBypass: false,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdC1jb25maWcuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci1hdXRoLW9pZGMtY2xpZW50L3NyYy8iLCJzb3VyY2VzIjpbImxpYi9jb25maWcvZGVmYXVsdC1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBR2hELE1BQU0sQ0FBQyxNQUFNLGNBQWMsR0FBd0I7SUFDakQsU0FBUyxFQUFFLG9CQUFvQjtJQUMvQixxQkFBcUIsRUFBRSxFQUFFO0lBQ3pCLFdBQVcsRUFBRSxvQkFBb0I7SUFDakMsUUFBUSxFQUFFLFlBQVk7SUFDdEIsWUFBWSxFQUFFLE1BQU07SUFDcEIsS0FBSyxFQUFFLHNCQUFzQjtJQUM3QixPQUFPLEVBQUUsRUFBRTtJQUNYLHFCQUFxQixFQUFFLG9CQUFvQjtJQUMzQyxpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLGNBQWMsRUFBRSxvQkFBb0I7SUFDcEMsMkJBQTJCLEVBQUUsRUFBRTtJQUMvQixvQ0FBb0MsRUFBRSxDQUFDO0lBQ3ZDLGVBQWUsRUFBRSxLQUFLO0lBQ3RCLDhCQUE4QixFQUFFLEtBQUs7SUFDckMsdUJBQXVCLEVBQUUsS0FBSztJQUM5QixjQUFjLEVBQUUsR0FBRztJQUNuQixjQUFjLEVBQUUsWUFBWTtJQUM1QixpQkFBaUIsRUFBRSxlQUFlO0lBQ2xDLFlBQVksRUFBRSxJQUFJO0lBQ2xCLGlDQUFpQyxFQUFFLElBQUk7SUFDdkMsK0JBQStCLEVBQUUsS0FBSztJQUN0QyxRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUk7SUFDdkIsZ0JBQWdCLEVBQUUsS0FBSztJQUN2QixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLG1DQUFtQyxFQUFFLEdBQUc7SUFDeEMsMEJBQTBCLEVBQUUsS0FBSztJQUNqQyxPQUFPLEVBQUUsT0FBTyxPQUFPLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUk7SUFDL0QsWUFBWSxFQUFFLEVBQUU7SUFDaEIsd0JBQXdCLEVBQUUsRUFBRTtJQUM1QixzQkFBc0IsRUFBRSxFQUFFO0lBQzFCLCtCQUErQixFQUFFLElBQUk7SUFDckMsdUNBQXVDLEVBQUUsS0FBSztJQUM5QyxxQkFBcUIsRUFBRSxDQUFDO0lBQ3hCLDBCQUEwQixFQUFFLENBQUM7SUFDN0IsVUFBVSxFQUFFLEtBQUs7Q0FDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSAnLi4vbG9nZ2luZy9sb2ctbGV2ZWwnO1xuaW1wb3J0IHsgT3BlbklkQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vb3BlbmlkLWNvbmZpZ3VyYXRpb24nO1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DT05GSUc6IE9wZW5JZENvbmZpZ3VyYXRpb24gPSB7XG4gIHN0c1NlcnZlcjogJ2h0dHBzOi8vcGxlYXNlX3NldCcsXG4gIGF1dGhXZWxsa25vd25FbmRwb2ludDogJycsXG4gIHJlZGlyZWN0VXJsOiAnaHR0cHM6Ly9wbGVhc2Vfc2V0JyxcbiAgY2xpZW50SWQ6ICdwbGVhc2Vfc2V0JyxcbiAgcmVzcG9uc2VUeXBlOiAnY29kZScsXG4gIHNjb3BlOiAnb3BlbmlkIGVtYWlsIHByb2ZpbGUnLFxuICBoZFBhcmFtOiAnJyxcbiAgcG9zdExvZ291dFJlZGlyZWN0VXJpOiAnaHR0cHM6Ly9wbGVhc2Vfc2V0JyxcbiAgc3RhcnRDaGVja1Nlc3Npb246IGZhbHNlLFxuICBzaWxlbnRSZW5ldzogZmFsc2UsXG4gIHNpbGVudFJlbmV3VXJsOiAnaHR0cHM6Ly9wbGVhc2Vfc2V0JyxcbiAgc2lsZW50UmVuZXdUaW1lb3V0SW5TZWNvbmRzOiAyMCxcbiAgcmVuZXdUaW1lQmVmb3JlVG9rZW5FeHBpcmVzSW5TZWNvbmRzOiAwLFxuICB1c2VSZWZyZXNoVG9rZW46IGZhbHNlLFxuICB1c2VQdXNoZWRBdXRob3Jpc2F0aW9uUmVxdWVzdHM6IGZhbHNlLFxuICBpZ25vcmVOb25jZUFmdGVyUmVmcmVzaDogZmFsc2UsXG4gIHBvc3RMb2dpblJvdXRlOiAnLycsXG4gIGZvcmJpZGRlblJvdXRlOiAnL2ZvcmJpZGRlbicsXG4gIHVuYXV0aG9yaXplZFJvdXRlOiAnL3VuYXV0aG9yaXplZCcsXG4gIGF1dG9Vc2VyaW5mbzogdHJ1ZSxcbiAgYXV0b0NsZWFuU3RhdGVBZnRlckF1dGhlbnRpY2F0aW9uOiB0cnVlLFxuICB0cmlnZ2VyQXV0aG9yaXphdGlvblJlc3VsdEV2ZW50OiBmYWxzZSxcbiAgbG9nTGV2ZWw6IExvZ0xldmVsLldhcm4sXG4gIGlzc1ZhbGlkYXRpb25PZmY6IGZhbHNlLFxuICBoaXN0b3J5Q2xlYW51cE9mZjogZmFsc2UsXG4gIG1heElkVG9rZW5JYXRPZmZzZXRBbGxvd2VkSW5TZWNvbmRzOiAxMjAsXG4gIGRpc2FibGVJYXRPZmZzZXRWYWxpZGF0aW9uOiBmYWxzZSxcbiAgc3RvcmFnZTogdHlwZW9mIFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnID8gc2Vzc2lvblN0b3JhZ2UgOiBudWxsLFxuICBjdXN0b21QYXJhbXM6IHt9LFxuICBjdXN0b21QYXJhbXNSZWZyZXNoVG9rZW46IHt9LFxuICBjdXN0b21QYXJhbXNFbmRTZXNzaW9uOiB7fSxcbiAgZWFnZXJMb2FkQXV0aFdlbGxLbm93bkVuZHBvaW50czogdHJ1ZSxcbiAgZGlzYWJsZVJlZnJlc2hJZFRva2VuQXV0aFRpbWVWYWxpZGF0aW9uOiBmYWxzZSxcbiAgdG9rZW5SZWZyZXNoSW5TZWNvbmRzOiA0LFxuICByZWZyZXNoVG9rZW5SZXRyeUluU2Vjb25kczogMyxcbiAgbmdzd0J5cGFzczogZmFsc2UsXG59O1xuIl19