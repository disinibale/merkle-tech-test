-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_recipientWalletId_fkey";

-- DropForeignKey
ALTER TABLE "Transactions" DROP CONSTRAINT "Transactions_senderWalletId_fkey";

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_senderWalletId_fkey" FOREIGN KEY ("senderWalletId") REFERENCES "Wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_recipientWalletId_fkey" FOREIGN KEY ("recipientWalletId") REFERENCES "Wallets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
