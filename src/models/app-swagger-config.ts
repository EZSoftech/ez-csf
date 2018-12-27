export interface AppSwaggerConfig {
    apiBaseUrl: string;
    yamlPath: string;
    controllerPath: string;
    protectedEndpoints?: Array<string>;
    corsEndpoints?: Array<string>;
}
