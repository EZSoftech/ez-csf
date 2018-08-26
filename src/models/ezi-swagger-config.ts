export interface EZISwaggerConfig {
    apiBaseUrl: string;
    yamlPath: string;
    controllerPath: string;
    protectedEndpoints?: Array<string>;
    corsEndpoints?: Array<string>;
}
