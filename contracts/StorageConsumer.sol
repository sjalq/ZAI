pragma solidity ^0.5.0;

import "./KeyValueStorage.sol";
import "./StorageStateful.sol";

contract StorageConsumer is StorageStateful 
{
    constructor(KeyValueStorage storage_)
        public
    {
        _storage = storage_;
    }
}
