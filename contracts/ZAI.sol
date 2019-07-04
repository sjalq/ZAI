pragma solidity ^0.5.0;

import "./StorageConsumer.sol";
import "./Proxy.sol";
import "./DetailedToken.sol";
import "./KeyValueStorage.sol";
import "./ERC20Burnable.sol";
import "./ERC20Mintable.sol";



contract ZAI is StorageConsumer, Proxy, DetailedToken, ERC20Burnable, ERC20Mintable {

    constructor(KeyValueStorage storage_)
        public
        StorageConsumer(storage_)
    {
        // set some immutable state
        name = "ZAI StableCoin for ZAR";
        symbol = "ZAI";
        decimals = 18;

        // set token owner in the key-value store
        storage_.setAddress("owner", msg.sender);
    }

}
