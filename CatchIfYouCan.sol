// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CatchIfYouCan {
    mapping(address => uint256) public mindScores;

    event WinRecorded(address indexed player, uint256 newScore);

    // Record a win with given score (e.g., number of stages survived)
    function recordWin(uint256 score) external {
        require(score > 0, "Score must be positive");
        mindScores[msg.sender] += score;
        emit WinRecorded(msg.sender, mindScores[msg.sender]);
    }

    // Fetch caller's total mind score
    function getMyScore() external view returns (uint256) {
        return mindScores[msg.sender];
    }

    // Fetch any player's score (optional view function for leaderboard later)
    function getScore(address player) external view returns (uint256) {
        return mindScores[player];
    }
}
