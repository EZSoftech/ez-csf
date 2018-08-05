export interface EZServerConfig {
    port: number | undefined;
    swagger: {
        apiBaseUrl: string;
        yamlPath: string;
        controllerPath: string;
        protectedEndpoints?: Array<string>;
        corsEndpoints?: Array<string>;
    };
}
