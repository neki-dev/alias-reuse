import { Exporter } from '../exporter';
export declare class Parser {
    private pathToConfig;
    /**
     * Read aliases from custom object.
     *
     * @param {Object} config - Custom object
     */
    from(config: Record<string, string>): Exporter;
    /**
     * Read aliases from config file.
     *
     * @param {string} filePath - Path to one of config file
     */
    from(filePath: string): Exporter;
    private parse;
}
