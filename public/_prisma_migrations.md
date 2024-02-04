classDiagram
direction BT
class Attachment {
   smallint size
   varchar(10) format
   datetime(3) createdAt
   datetime(3) updatedAt
   datetime(3) deletedAt
   int postId
   longblob data
   int id
}
class Post {
   varchar(191) title
   text content
   datetime(3) createdAt
   datetime(3) updatedAt
   datetime(3) deletedAt
   int authorId
   int parentPostId
   varchar(191) homepageUrl
   int id
}
class User {
   varchar(191) email
   varchar(191) username
   varchar(191) name
   datetime(3) createdAt
   datetime(3) updatedAt
   datetime(3) deletedAt
   varchar(72) password
   int id
}
class _prisma_migrations {
   varchar(64) checksum
   datetime(3) finished_at
   varchar(255) migration_name
   text logs
   datetime(3) rolled_back_at
   datetime(3) started_at
   int unsigned applied_steps_count
   varchar(36) id
}

Attachment  -->  Post : postId:id
Post  -->  Post : parentPostId:id
Post  -->  User : authorId:id
