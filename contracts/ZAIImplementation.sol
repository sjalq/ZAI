pragma solidity 0.5.10;

import "./ZAI.sol";
import "./SafeMath.sol";

library ZAIImplementation
{
    // types
    using SafeMath for uint256;

    // state wrappers
    function data()
        public
        view
        returns (KeyValueStorage)
    {
        address payable _this = address(uint(address(this)));
        return ZAIProxy(_this).proxyData();
    }

    function contractOwner()
        public
        view
        returns (address _contractOwner)
    {
        return data().getAddress("_contractOwner");
    }

    function name()
        public
        view
        returns (string memory _name)
    {
        return data().getString("name");
    }

    function symbol()
        public
        view
        returns (string memory _symbol)
    {
        return data().getString("symbol");
    }

    function decimals()
        public
        view
        returns (uint8 _decimals)
    {
        return uint8(data().getUint("decimals"));
    }

    function totalSupply()
        external
        view
        returns (uint256)
    {
        return data().getUint("totalSupply");
    }

    function setTotalSupply(uint _value)
        private
    {
        return data().setUint("totalSupply", _value);
    }

    function balances(address _owner)
        public
        view
        returns (uint _balance)
    {
        return data().getUint(abi.encode("balances", _owner));
    }

    function setBalance(
            address _owner,
            uint _value)
        private
    {
        return data().setUint(abi.encode("balances", _owner), _value);
    }

    function allowances(
            address _owner,
            address _spender)
        public
        view
        returns (uint _allowance)
    {
        return data().getUint(abi.encode("allowances", _owner, _spender));
    }

    function setAllowance(
            address _owner,
            address _spender,
            uint _value)
        private
    {
        data().setUint(abi.encode("allowances", _owner, _spender), _value);
    }

    // events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    // functions
    function balanceOf(address _account)
        private
        view
        returns (uint256 _balance)
    {
        return balances(_account);
    }

    function transfer(
            address recipient,
            uint256 amount)
        external
        returns (bool _success)
    {
        return privateTransfer(msg.sender, recipient, amount);
    }

    function privateTransfer(
            address _owner,
            address _recipient,
            uint256 _amount)
        private
        returns (bool _success)
    {
        uint senderBalance = balanceOf(_owner);
        require(senderBalance >= _amount, "Insufficient funds");
        uint recipientBalance = balanceOf(_owner);
        setBalance(_owner, senderBalance.sub(_amount));
        setBalance(_recipient, recipientBalance.add(_amount));
        emit Transfer(_owner, _recipient, _amount);
        return true;
    }

    function allowance(
            address _owner,
            address _spender)
        external
        view
        returns (uint256)
    {
        return allowances(_owner, _spender);
    }

    function approve(
            address _spender,
            uint256 _amount)
        external
        returns (bool)
    {
        setAllowance(
            msg.sender,
            _spender,
            _amount);
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    function transferFrom(
            address _owner,
            address _recipient,
            uint256 _amount)
        external
        returns (bool)
    {
        uint allowedBalance = allowances(_owner, msg.sender);
        require(_amount <= allowedBalance, "You are outside of your allowes spending balance");
        privateTransfer(_owner, _recipient, _amount);
        setAllowance(
            _owner,
            msg.sender,
            allowedBalance.sub(_amount));
        return true;
    }
}
