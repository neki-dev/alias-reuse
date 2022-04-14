import { Alias } from './types';
export interface IExporter {
    toObject: () => object;
    toTsconfig: () => object;
    toWebpack: () => object;
    toVite: () => object;
    toJest: () => object;
}
export default function exporter(pathToRoot: string, aliases: Alias[]): IExporter;
