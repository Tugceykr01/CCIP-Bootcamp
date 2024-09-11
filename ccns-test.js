const { expect } = require("chai");

describe("CCIP Cross-Chain Name Service Tests", function () {
  let ccipSimulator, registerContract, receiverContract, lookupContract;
  let aliceEOA;

  before(async function () {

    const CCIPLocalSimulator = await ethers.getContractFactory("CCIPLocalSimulator");
    ccipSimulator = await CCIPLocalSimulator.deploy();
    await ccipSimulator.deployed();

    const routerAddress = await ccipSimulator.configuration();

    const CrossChainNameServiceRegister = await ethers.getContractFactory("CrossChainNameServiceRegister");
    registerContract = await CrossChainNameServiceRegister.deploy(routerAddress);
    await registerContract.deployed();

    const CrossChainNameServiceReceiver = await ethers.getContractFactory("CrossChainNameServiceReceiver");
    receiverContract = await CrossChainNameServiceReceiver.deploy(routerAddress);
    await receiverContract.deployed();

    const CrossChainNameServiceLookup = await ethers.getContractFactory("CrossChainNameServiceLookup");
    lookupContract = await CrossChainNameServiceLookup.deploy(routerAddress);
    await lookupContract.deployed();

    aliceEOA = "0x1234567890123456789012345678901234567890";
  });

  it("should enable chain on register and receiver contracts", async function () {
  
    await registerContract.enableChain(1);
    await receiverContract.enableChain(1);
  });

  it("should set cross chain name service addresses", async function () {
    
    await lookupContract.setCrossChainNameServiceAddress(registerContract.address);
    await lookupContract.setCrossChainNameServiceAddress(receiverContract.address);
  });

  it("should register and lookup a domain name", async function () {
    await registerContract.register("alice.ccns", aliceEOA);
    const lookupAddress = await lookupContract.lookup("alice.ccns");
    expect(lookupAddress).to.equal(aliceEOA);
  });
});
