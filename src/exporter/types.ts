export type ExporterModificators = {
  alias?: (path: string) => string;
  path?: (path: string) => string | string[];
};

export type ExporterTarget = 'tsconfig' | 'jest' | 'webpack' | 'vite' | 'object';
