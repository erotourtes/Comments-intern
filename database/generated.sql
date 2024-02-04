-- CreateTable
CREATE TABLE `Attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `size` SMALLINT NOT NULL,
    `format` VARCHAR(10) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `postId` INTEGER NOT NULL,
    `data` LONGBLOB NOT NULL,

    INDEX `Attachment_postId_fkey`(`postId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `authorId` INTEGER NULL,
    `parentPostId` INTEGER NULL,
    `homepageUrl` VARCHAR(191) NULL,

    INDEX `Post_authorId_fkey`(`authorId` ASC),
    INDEX `Post_parentPostId_fkey`(`parentPostId` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `password` VARCHAR(72) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email` ASC),
    UNIQUE INDEX `User_username_key`(`username` ASC),
    PRIMARY KEY (`id` ASC)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attachment` ADD CONSTRAINT `Attachment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_parentPostId_fkey` FOREIGN KEY (`parentPostId`) REFERENCES `Post`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

