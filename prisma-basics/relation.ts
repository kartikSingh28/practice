import { prisma } from "./lib/prisma"

async function run() {
  // CREATE: User with Posts
  const user = await prisma.user.create({
    data: {
      name: "Kartik",
      email: "kartik@test.com",
      posts: {
        create: [
          { title: "My First Post", content: "Hello World", published: true },
          { title: "Learning Prisma", content: "Relations", published: false },
        ],
      },
    },
    include: { posts: true },
  })
  console.log("Created user with posts:", user)

  // READ: Get all users with their posts
  const users = await prisma.user.findMany({
    include: { posts: true },
  })
  console.log("All users with posts:", users)

  // UPDATE: Update one post
  const postId = user.posts[0].id
  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: { title: "Updated Title" },
  })
  console.log("Updated post:", updatedPost)

  // DELETE: Delete one post
  const deletedPost = await prisma.post.delete({
    where: { id: postId },
  })
  console.log("Deleted post:", deletedPost)
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
