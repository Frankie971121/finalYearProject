const { default: Web3 } = require("web3");

var SmartRentContract = artifacts.require("./SmartRentContract.sol");
var SmartRentFactory = artifacts.require("./SmartRentFactory.sol");


contract('SmartRentFactory', function(accounts) {
    let contractFactory;
    let contractInstance;
    let contractInstanceAddress;
    let eventAddress;

    it('Landlord deploys a smart tenancy contract and assigns tenant', function() {
        return SmartRentFactory.deployed().then(function(instance) {
            contractFactory = instance;
            return contractFactory.createRent('Steve',
                'James',
                accounts[0],
                '2, Timur, Jalan Rock',
                1621351104,    // 18/5/2021
                1629299904,    // 18/8/2021
                100,
                100,
                accounts[1]);
        }).then(function(receipt) {
            assert.equal(receipt.logs[0].event, "NewLease");
            contractInstanceAddress = receipt.logs[0].address;
            eventAddress = new web3.eth.Contract(contractFactory.abi, contractInstanceAddress);
        });
    });

    it('Tenant agree and signs the smart agreement', () => {
        return eventAddress.getPastEvents('NewLease', {
            filter: {tenant: accounts[1]},
            fromBlock: 0,
            toBlock: 'latest'
        }).then((logs) => {
            return logs.map((log) => log.returnValues.contractAddress);
        }).then((address) => {
            return SmartRentContract.at(address[0]).then((instance) => {
                contractInstance = instance;
                return contractInstance.signContract({from: accounts[1]});
            }).then((receipt) => {
                assert.equal(receipt.logs[0].event, "TenantSigned");
            });
        });
    });

    it('Tenant pay security deposit to smart tenancy contract', () => {
        return contractInstance.payDeposit({from: accounts[1], value: 100})
        .then((receipt) => {
            assert.equal(receipt.logs[0].event, "DepositPaid");
        })
    });

    it('Tenant pay rent to smart tenancy contract', () => {
        return contractInstance.payRent({from: accounts[1], value: 10})
        .then((receipt) => {
            assert.equal(receipt.logs[0].event, "RentPaid");
        })
    });

    it('Landlord withdraw rent from smart tenancy contract', () => {
        return contractInstance.withdrawRent({from: accounts[0]})
        .then((receipt) => {
            assert.equal(receipt.logs[0].event, "RentWithdrawn");
        })
    });

    // it('Landlord claim security deposit from smart tenancy contract', () => {
    //     return contractInstance.claimDeposit({from: accounts[0]})
    //     .then((receipt) => {
    //         assert.equal(receipt.logs[0].event, "DepositClaimed");
    //     })
    // });

    it('Tenant withdraw security deposit from smart tenancy contract', () => {
        return contractInstance.withdrawDeposit({from: accounts[1]})
        .then((receipt) => {
            assert.equal(receipt.logs[0].event, "DepositWithdrawn");
        })
    });
})