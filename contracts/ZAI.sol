pragma solidity ^0.5.0;

import "./StorageConsumer.sol";
import "./Proxy.sol";
import "./DetailedToken.sol";
import "./KeyValueStorage.sol";

contract ZAI is Migratable, StorageConsumer, Proxy, DetailedToken {

    constructor(KeyValueStorage storage_)
        public
        StorageConsumer(storage_)
    {
        // set some immutable state
        name = "ZAI";
        symbol = "ZAI";
        decimals = 18;

        // set token owner in the key-value store
        storage_.setAddress("owner", msg.sender);
    }

}
