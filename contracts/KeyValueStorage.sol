pragma solidity ^0.5.0;


contract KeyValueStorage
{
    mapping(address => mapping(bytes32 => uint256)) public uints;
    mapping(address => mapping(bytes32 => address)) public addresses;
    mapping(address => mapping(bytes32 => bool)) public bools;
    mapping(address => mapping(bytes32 => string)) public strings;
    mapping(address => mapping(bytes32 => bytes)) byteses;

    /**** Get Methods ***********/

    function getAddress(bytes memory _key)
        public
        view
        returns (address _result)
    {
        return addresses[msg.sender][keccak256(_key)];
    }

    function getUint(bytes memory _key)
        public
        view
        returns (uint _result)
    {
        return uints[msg.sender][keccak256(_key)];
    }

    function getBool(bytes memory _key)
        public
        view
        returns (bool _result)
    {
        return bools[msg.sender][keccak256(_key)];
    }

    function getString(bytes memory _key)
        public
        view
        returns (string memory _result)
    {
        return strings[msg.sender][keccak256(_key)];
    }

    function getBytes(bytes memory _key)
        public
        view
        returns (bytes memory _result)
    {
        return byteses[msg.sender][keccak256(_key)];
    }

    /**** Set Methods ***********/

    function setAddress(bytes memory _key, address _value)
        public
    {
        addresses[msg.sender][keccak256(_key)] = _value;
    }

    function setUint(bytes memory _key, uint _value)
    public
    {
        uints[msg.sender][keccak256(_key)] = _value;
    }

    function setBool(bytes memory _key, bool _value)
        public
    {
         bools[msg.sender][keccak256(_key)] = _value;
    }

    function setString(bytes memory _key, string memory _value)
    public
    {
        strings[msg.sender][keccak256(_key)] = _value;
    }

    function setBytes(bytes memory _key, bytes memory _value)
        public
    {
         byteses[msg.sender][keccak256(_key)] = _value;
    }

    /**** Delete Methods ***********/

    function deleteAddress(bytes memory _key)
        public
    {
        delete addresses[msg.sender][keccak256(_key)];
    }

    function deleteUint(bytes memory _key)
        public
    {
        delete uints[msg.sender][keccak256(_key)];
    }

    function deleteBool(bytes memory _key)
        public
    {
        delete bools[msg.sender][keccak256(_key)];
    }

    function deleteStrings(bytes memory _key)
        public
    {
        delete strings[msg.sender][keccak256(_key)];
    }

    function deleteBytes(bytes memory _key)
        public
    {
        delete byteses[msg.sender][keccak256(_key)];
    }
}
