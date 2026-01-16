import {prisma} from "./lib/prisma";

async function run(){
    //create ->create table using defined schema

    const user =await prisma.user.create({  //INSERT INTO "User"(name,email) VALUES('Kartik','k@gmail.com');

        data:{
            name:"Kartik",
            email:"k@gmail.com",
        },
    })
    console.log("Created:",user);
    //select  == findmany


    const users =await prisma.user.findMany()  //SELECT * FROM "User";

    console.log("All users",users);


    //update==update

    const updatedUser = await prisma.user.update({  //UPDATE "User" SET name='Annie' WHERE id = user.id;

    where: { id: user.id },
    data: { name: "Annie" },
  })
  console.log("Updated",updatedUser);


  //delete==delete

  const deletedUser =await prisma.user.delete({
    where:{id:user.id},
  })
  console.log("Deleted",deletedUser);



}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
