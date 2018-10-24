pragma solidity ^0.4.24;

contract Election {
	// Model a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	// Map accounts that have voted
	mapping(address => bool) public voters;

	// Map id to Candidates to store them
	mapping(uint => Candidate) public candidates;

	// Count the number of candidates
	uint public candidatesCount;

	event votedEvent(
		uint indexed _candidateId
	);

	// Constructor
	constructor() public {
		addCandidate("Candidate 1");
		addCandidate("Candidate 2");
	}

	// Add a new candidate
	function addCandidate(string _name) private {
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	function vote (uint _candidateId) public {
		// require that the voter has not already voted
		require(!voters[msg.sender]);

		// require that the candidate id is valid
		require(_candidateId > 0 && _candidateId <= candidatesCount);

		// record the voter
		voters[msg.sender] = true;

		//update the voteCount
		candidates[_candidateId].voteCount++;

		// call the voted event
		emit votedEvent(_candidateId);

	}
}