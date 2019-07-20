pragma solidity ^0.5.0;

import "./KeyValueStorage.sol";

contract ZAIProxy
{
    KeyValueStorage public proxyData;

    address public owner;
    address public implementation;

    event LogOwnerChanged(address indexed previousOwner, address indexed newOwner);
    event LogUpgraded(address indexed implementation);

    constructor(address _owner, KeyValueStorage _proxyData, address _implementation)
        public
    {
        // assign the owner address
        owner = _owner;
        emit LogOwnerChanged(address(0), owner);

        // assign the implementation library
        implementation = _implementation;
        emit LogUpgraded(implementation);

        // assign proxyData
        proxyData = _proxyData;

        // set some immutable state
        proxyData.setString(abi.encode("name"), "ZAI StableCoin for ZAR");
        proxyData.setString(abi.encode("symbol"), "ZAI");
        proxyData.setUint(abi.encode("decimals"), 18);
    }

    modifier onlyOwner()
    {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }

    function changeOwner(address newOwner)
        public
        onlyOwner
    {
        emit LogOwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    function upgradeTo(address _implementation)
        public
        onlyOwner
    {
        require(implementation != _implementation, "Cannot upgrade to the same implementation");
        implementation = _implementation;
        emit LogUpgraded(implementation);
    }

    function ()
        external
        payable
    {
        address _implementation = implementation;
        require(_implementation != address(0), "Implementation is unassigned");
        bytes memory data = msg.data;

        assembly {
            let result := delegatecall(gas, _implementation, add(data, 0x20), mload(data), 0, 0)
            let size := returndatasize
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }
}