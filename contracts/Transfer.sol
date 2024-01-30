pragma solidity ^0.5.16;

contract Transfer
{
	function transfer(address payable to)
	external payable
	{
		to.transfer(msg.value);
	}
}