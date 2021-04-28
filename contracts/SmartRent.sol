// Learn more about Solidity here: https://solidity.readthedocs.io

// This statement specifies the compatible compiler versions
pragma solidity >=0.5.0;

// Declare a contract called HelloWorld
contract SmartRent {
    
    event TenantAssigned(address tenantAddress, uint rentAmount, uint rentDeposit);
    event TenantSigned(address tenantAddress);
    event DepositPaid(address tenantAddress, uint rentDeposit);

    address payable landlordAddress;
    
    struct Tenant {
        uint rentAmount;
        uint rentDeposit;
        bool isSigned;
        bool hasPaidDeposit;
        bool initialized;
    }

    Tenant public tenant;
    
    mapping (address => Tenant) public tenantToSigned;
    uint deposit;
    uint startDate;
    uint endDate;
    string roomAddress;

    string name = "Smart Rent";

    modifier landlordOnly() {
        require(msg.sender == landlordAddress);
        _;
    }

    modifier tenantOnly() {
        require(tenantToSigned[msg.sender].initialized == true);
        _;
    }

    modifier hasSigned() {
        require(tenantToSigned[msg.sender].isSigned == true, "Tenant must sign the contract before invoking this functionality");
        _;
    }

    modifier notZeroAddres(address addr){
        require(addr != address(0), "0th address is not allowed!");
        _;
    }

    function setStartDate(uint _startDate) public landlordOnly {
        startDate = _startDate;
    }

    function setEndDate(uint _endDate) public landlordOnly {
        endDate = _endDate;
    }

    function setRoomAddress(string memory _roomAddress) public {
        roomAddress = _roomAddress;
    }

    function assignTenant(address _tenantAddress, uint _rentAmount, uint _rentDeposit)
      external notZeroAddres(_tenantAddress) {
        require(_tenantAddress != landlordAddress, "Landlord is not allowed to be tenant at the same time");
        tenant = Tenant(_rentAmount, _rentDeposit, false, false, true);
        //tenantToSigned[_tenantAddress] = tenant;
        emit TenantAssigned(_tenantAddress, _rentAmount, _rentDeposit);
    }

    function signContract() public {
        require(tenantToSigned[msg.sender].isSigned == false);
        tenantToSigned[msg.sender].isSigned = true;
        emit TenantSigned(msg.sender);
    }

    function payDeposit() external payable tenantOnly {
        require(tenantToSigned[msg.sender].hasPaidDeposit == false);
        deposit += msg.value;
        tenantToSigned[msg.sender].hasPaidDeposit = true;
        emit DepositPaid(msg.sender, msg.value);
    }

    function getName() public view returns (string memory) 
    {
        // Return the storage variable 'name'
        return name;
    }
}