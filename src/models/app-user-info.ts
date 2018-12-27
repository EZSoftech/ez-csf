export interface AppUserInfo {
    id: number;
    username: string;
    emailId: string;
}

export interface AppUserRole {
    name: string;
    permissions: Array<AppPermission>;
}

export interface AppPermission {
    name: string;
}
