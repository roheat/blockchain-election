var Election = artifacts.require("./Election.sol");

contract ("Election", function(accounts) {
	var electionInstance;

	it("initializes with 2 candidates", function() {
		return Election.deployed().then(function(instance) {
			return instance.candidatesCount();
		}).then(function(count) {
			assert.equal(count, 2);
		});
	});

	it("initializes with correct values", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.candidates(1);
		}).then(function(candidate) {
			assert.equal(candidate[0], 1, "correct id");
			assert.equal(candidate[1], "Candidate 1", "correct name");
			assert.equal(candidate[2], 0, "correct vote count");
			return electionInstance.candidates(2);
		}).then(function(candidate) {
			assert.equal(candidate[0], 2, "correct id");
			assert.equal(candidate[1], "Candidate 2", "correct name");
			assert.equal(candidate[2], 0, "correct vote count");
		});
	});

	it("allows voter to vote", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			candidateId = 1;
			return electionInstance.vote(1, {from: accounts[0]});
		}).then(function(receipt) {
			return electionInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted, "voter marked as voted");
			return electionInstance.candidates(candidateId);
		}).then( function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "voteCount updated successfully");
		});
	});

	it("throws exception for invalid candidates", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			return electionInstance.vote(99, {from: accounts[1]});
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf("revert") >=0, "erorr message contains revert");
			return electionInstance.candidates(1);
		}).then( function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "voteCount did not change for candidate1");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 0, "voteCount did not change for candidate2");
		});
	});

	it("throws exception for double voting", function() {
		return Election.deployed().then(function(instance) {
			electionInstance = instance;
			candidateId = 2;
			electionInstance.vote(candidateId, {from: accounts[1]});
			return electionInstance.candidates(candidateId);
		}).then(function(candidate) {
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "first vote accepted");
			// Vote again
			return electionInstance.vote(candidateId, {from: accounts[1]});
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf("revert") >=0, "erorr message contains revert");
			return electionInstance.candidates(1);
		}).then( function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "candidate1 did not recieve any new votes");
			return electionInstance.candidates(2);
		}).then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 1, "candidate2 did not recieve any new votes");
		});
	});
});