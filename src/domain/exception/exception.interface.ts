export interface IFormatExceptionMessage {
  message: string;
  errorCode?: number;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): void;
  internalServerErrorException(data?: IFormatExceptionMessage): void;
  forbiddenException(data?: IFormatExceptionMessage): void;
  unauthorizedException(data?: IFormatExceptionMessage): void;
  conflictException(data?: IFormatExceptionMessage): void;
}
