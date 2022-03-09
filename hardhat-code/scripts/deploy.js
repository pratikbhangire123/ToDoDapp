const {ethers} = require("hardhat");

async function main() {

    const toDoListContract = await ethers.getContractFactory("ToDoList");

    const deployedToDoListContract = await toDoListContract.deploy();

    await deployedToDoListContract.deployed();

    console.log("ToDoList Contract Address:", deployedToDoListContract.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });