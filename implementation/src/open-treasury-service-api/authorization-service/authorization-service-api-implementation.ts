import { LoginStatusResponse, LoginStatus, OpenTreasuryUser } from '@opentreasury/opentreasury-service-api';
import { OpenTreasuryAuthorizationServiceApi } from './authorization-service-api.js';
import { isTokenExpiringSoon } from '../../utils/utils.js';
import { PAGE_REQUEST_1000 } from '../../utils/constants.js';
import { ApiAuthorizationStatus, ApiOpenPlatformApi, ApiSearchQueryBuilder } from '../../api-types.js';
import { OpenTreasuryUserServiceApiImplementation } from '../entity-services/user-service-api/OpenTreasuryUserServiceApiImplementation.js';

export class OpenTreasuryAuthorizationServiceApiImplementation implements OpenTreasuryAuthorizationServiceApi {
    private _actualLoggedUser: OpenTreasuryUser | undefined;
    private _securityGroupId: string = '';
    private _userService?: OpenTreasuryUserServiceApiImplementation;

    constructor(private readonly _openPlatformApi: ApiOpenPlatformApi) {}

    async login(username: string, password: string): Promise<LoginStatusResponse> {
        const result = (await this._openPlatformApi.AuthorizationService.login(username, password)).status as string;

        return await this.handleSuccessLogin(username, result);
    }

    logout(): LoginStatus {
        this._openPlatformApi.AuthorizationService.logout();
        localStorage.removeItem('AUTH-PRINCIPAL');
        this._actualLoggedUser = undefined;
        return LoginStatus.UNAUTHORIZED;
    }

    async tryAuthorization(): Promise<LoginStatusResponse> {
        const result = this._openPlatformApi.AuthorizationService.tryLogin();

        if (result.status == ApiAuthorizationStatus.AUTHORIZED) {
            return await this.handleSuccessLogin(result.username, result.status);
        }
        return {
            status: LoginStatus.UNAUTHORIZED,
        };
    }

    isAuthenticated(): LoginStatus {
        const result = this._openPlatformApi.AuthorizationService.tryLogin();
        return result.status === 1 ? LoginStatus.AUTHORIZED : LoginStatus.UNAUTHORIZED;
    }

    setTokenExpirationCallback(logoutCallback: () => void): void {
        // Add response interceptor
        this._openPlatformApi.Axios.interceptors.response.use(
            (response) => {
                // If response is successful, just return it
                return response;
            },
            (error) => {
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('AUTH-PRINCIPAL');
                    logoutCallback();
                }
                return Promise.reject(error);
            },
        );

        // Before any request, check token expiration
        this._openPlatformApi.Axios.interceptors.request.use((config) => {
            if (isTokenExpiringSoon()) {
                localStorage.removeItem('AUTH-PRINCIPAL');
                logoutCallback();
            }
            return config;
        });
    }

    private async handleSuccessLogin(username: string, status: string | number): Promise<LoginStatusResponse> {
        await this.fetchSecurityGroup();
        await this.setActualLoggedUser(username);

        return {
            status: status == '1' ? LoginStatus.AUTHORIZED : LoginStatus.UNAUTHORIZED,
            user: this._actualLoggedUser,
        };
    }

    private async fetchSecurityGroup(): Promise<void> {
        const securityGroups = await this._openPlatformApi.AuthorizationService.securityGroups.getAll(
            new ApiSearchQueryBuilder().build(),
            PAGE_REQUEST_1000,
        );

        this._securityGroupId = securityGroups.content[0].id;
    }

    private async setActualLoggedUser(username: string) {
        this._actualLoggedUser = (await this._userService.fetchAll())?.find((u) => u.username === username);
    }

    setUserService(userService: OpenTreasuryUserServiceApiImplementation) {
        this._userService = userService;
    }
}
