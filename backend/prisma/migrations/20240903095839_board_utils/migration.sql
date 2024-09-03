/*
  Warnings:

  - The primary key for the `Board` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UsersOnBoards` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatToMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `content` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdAt` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boardId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BoardInvite" DROP CONSTRAINT "BoardInvite_boardId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_boardId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnBoards" DROP CONSTRAINT "UsersOnBoards_boardId_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMessage" DROP CONSTRAINT "_ChatToMessage_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatToMessage" DROP CONSTRAINT "_ChatToMessage_B_fkey";

-- AlterTable
ALTER TABLE "Board" DROP CONSTRAINT "Board_pkey",
ADD COLUMN     "content" BYTEA NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Board_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Board_id_seq";

-- AlterTable
ALTER TABLE "BoardInvite" ALTER COLUMN "boardId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "boardId" TEXT NOT NULL,
ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UsersOnBoards" DROP CONSTRAINT "UsersOnBoards_pkey",
ALTER COLUMN "boardId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UsersOnBoards_pkey" PRIMARY KEY ("userId", "boardId");

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "_ChatToMessage";

-- AddForeignKey
ALTER TABLE "UsersOnBoards" ADD CONSTRAINT "UsersOnBoards_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoardInvite" ADD CONSTRAINT "BoardInvite_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
