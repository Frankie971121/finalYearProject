var SmartRentFactory = artifacts.require('SmartRentFactory')

module.exports = function(deployer) {
  deployer.deploy(SmartRentFactory)
}