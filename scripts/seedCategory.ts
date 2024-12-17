const {PrismaClient} = require("@prisma/client")

const database= new PrismaClient();

async function main(){
    try {
        await database.category.createMany({
            data:[
                {name:"Software Service"},
                {name:"sports"},
                {name:"fitness"},
                {name:"finance"},
                {name:"music"},
            ]
        });
        console.log("success");
        
    } catch (error) {
        console.log("error seeding the databse categories" , error)
    }finally{
        await database.$disconnect
    }
}

main()