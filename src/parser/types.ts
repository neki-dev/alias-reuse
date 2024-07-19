export type ParserModificators = {
  alias?: (payload: ParserPayload) => string;
  path?: (payload: ParserPayload) => string;
};

export type ParserPayload = {
  alias: string
  path: string
};

