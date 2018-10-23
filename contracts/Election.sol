pragma solidity ^0.4.24;

contract Election {
	// Model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	// Map id to Candidates to store them
	mapping(uint => Candidate) public candidates;

	// Count the number of candidates
	uint public candidatesCount;

	// Constructor
	function Election() public {
		addCandidate("Candidate 1");
		addCandidate("Candidate 2");
	}

	// Add a new candidate
	function addCandidate(string _name) private {
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

}