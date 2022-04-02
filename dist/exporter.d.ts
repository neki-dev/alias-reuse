import { Alias } from "./types";
export interface IExporter {
    forTsconfig: () => object;
    forWebpack: () => object;
    forVite: () => object;
    forJest: () => object;
}
export default function exporter(pathToRoot: string, aliases: Alias[]): IExporter;
