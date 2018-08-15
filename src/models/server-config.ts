export interface EZServerConfig {
    port: number | undefined;
    swagger: {
        apiBaseUrl: string;
        yamlPath: string;
        controllerPath: string;
        protectedEndpoints?: Array<string>;
        corsEndpoints?: Array<string>;
    };
    db: {
        host: string;
        user: string;
        password: string;
        database: string;
    };
}
