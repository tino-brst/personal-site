-- RenameTable
ALTER TABLE `ArticleLikes` RENAME `UserArticleLikes`;

-- RenameIndex
ALTER TABLE `UserArticleLikes` RENAME INDEX `ArticleLikes_slug_userId_key` TO `UserArticleLikes_slug_userId_key`;