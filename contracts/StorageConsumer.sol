pragma solidity ^0.5.0;

import "./KeyValueStorage.sol";
import "./StorageStateful.sol";

contract StorageConsumer is StorageStateful
{
    KeyValueStorage public data;

    constructor(KeyValueStorage _data)
        public
    {
        data = _data;
    }
}
