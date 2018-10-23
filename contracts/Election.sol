pragma solidity ^0.4.24;

contract Election {
	// State Variable
	string public candidate;
	// Constructor
	function Election() public {
		candidate = "Candidate 1";
	}
}