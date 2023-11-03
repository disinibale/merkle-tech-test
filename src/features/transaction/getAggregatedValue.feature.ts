import { TransactionRepositoryDomain } from 'src/domain/repositories/transactions.interface';

export class GetAggregatedValueFeature {
  constructor(
    private readonly transactionRepository: TransactionRepositoryDomain,
  ) {}

  async execute(userId: number) {
    const result = await this.transactionRepository.transactionGroup(userId);

    if (result) return result;

    return [];
  }
}
