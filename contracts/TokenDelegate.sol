pragma solidity ^0.5.0;

import "SafeMath.sol";
import "./TokenLib.sol";
import "./StorageStateful.sol";

contract TokenDelegate is StorageStateful
{
    using SafeMath for uint256;

    function transfer(address to, uint256 value)
        public
        returns (bool)
    {
        require(value <= TokenLib.getBalance(_storage, msg.sender), "Cannot send more tokens than you have");

        subBalance(msg.sender, value);
        addBalance(to, value);
        return true;
    }

    function balanceOf(address owner)
        public
        view
        returns (uint256 balance)
    {
        return TokenLib.getBalance(_storage, owner);
    }

    function totalSupply()
        public
        view
        returns (uint256)
    {
        return _storage.getUint("totalSupply");
    }

    function addSupply(uint256 amount)
        internal
    {
        _storage.setUint("totalSupply", totalSupply().add(amount));
    }

    function addBalance(address balanceHolder, uint256 amount)
        internal
    {
        setBalance(balanceHolder, TokenLib.getBalance(_storage, balanceHolder).add(amount));
    }

    function subBalance(address balanceHolder, uint256 amount)
        internal
    {
        setBalance(balanceHolder, TokenLib.getBalance(_storage, balanceHolder).sub(amount));
    }

    function setBalance(address balanceHolder, uint256 amount)
        internal
    {
        _storage.setUint(keccak256(abi.encodePacked(balanceHolder)), amount);
    }
}
