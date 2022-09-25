import { CustomError } from 'ts-custom-error';
import { uuid } from './uuid';

export class ApiError extends CustomError {
  public readonly id = uuid();
  public readonly internalMessage?: string;
  public readonly externalMessage: string;

  constructor(params: {
    internalMessage?: string; // will be logged internally
    externalMessage: string; // will be relayed to the user
  }) {
    super(params.internalMessage || params.externalMessage);
    this.internalMessage = params.internalMessage;
    this.externalMessage = params.externalMessage;
  }
}

export class MissingArgError extends ApiError {
  public readonly id = uuid();
  constructor(missingField: string) {
    super({
      externalMessage: `Missing field: ${missingField}`,
    });
  }
}

export class CodecError extends ApiError {
  public readonly id = uuid();
  public readonly fields: string[] = [];
  constructor(fields: string[]) {
    super({
      externalMessage: `Bad field: ${fields.join(', ')}`,
    });
    this.fields = fields;
  }
}
