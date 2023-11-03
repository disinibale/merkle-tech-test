import { TransactionRepositoryDomain } from 'src/domain/repositories/transactions.interface';

export class GetTopTransactionFeature {
  constructor(
    private readonly transactionRepository: TransactionRepositoryDomain,
  ) {}

  async execute(userId: number) {
    return this.transactionRepository.transactions({
      where: {
        OR: [{ senderWallet: { userId } }, { recipientWallet: { userId } }],
      },
      orderBy: {
        amount: 'desc',
      },
      take: 10,
    });
  }
}
