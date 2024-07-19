import { Record } from "../record";
import { ExporterTarget } from "./types";
export declare class Exporter {
    readonly records: Record[];
    private pathToRoot;
    constructor(pathToRoot: string);
    at(pathToRoot: string): this;
    addRecord(from: string, to: string): void;
    private export;
    for(target: ExporterTarget): {};
}
