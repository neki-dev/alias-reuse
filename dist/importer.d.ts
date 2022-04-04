import { IExporter } from './exporter';
declare type CustomAliases = {
    [from: string]: string;
};
interface IImporter {
    fromObject: (object: CustomAliases) => IExporter;
    fromTsconfig: (pathToConfig?: string) => IExporter;
    fromWebpack: (pathToConfig?: string) => IExporter;
    fromVite: (pathToConfig?: string) => IExporter;
}
export default function importer(pathToRoot: string): IImporter;
export {};
