export interface User {
    id?: string;
    username?: string;
    realName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    defaultSecurityGroup?: string;
    securityGroupAccesses?: Array<{
        securityGroup: string;
        groupAccessLevels: {
            operation: 'WRITE';
        };
    }>;
    blocked?: boolean;
    blockedReason?: string;
    applicationRoles?: Array<string>;
}
