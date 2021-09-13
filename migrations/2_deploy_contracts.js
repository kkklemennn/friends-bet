// CODE FOR DEPLOYING BET FACTORY

const BetFactory = artifacts.require("BetFactory");

module.exports = async function(deployer, network, accounts) {
  // Deploy Factory
  await deployer.deploy(BetFactory);
  const betFactory = await BetFactory.deployed();
};
