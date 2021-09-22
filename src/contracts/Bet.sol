pragma solidity ^0.5.0;

contract BetFactory {
    string public name = "BetFactory";
    mapping (address => address[]) public deployedBets;
    
    function createBet(address payable player2, address referee, uint256 prize) public {
        Bet newBet = new Bet(msg.sender, player2, referee, prize, address(this));
        deployedBets[msg.sender].push(address(newBet));
    }
    
    function myBets() public view returns (address[] memory) {
        return deployedBets[msg.sender];
    }
    
    function pushBet(address player) public {
        deployedBets[player].push(msg.sender);
    }
}

contract Bet {
    string public name = "Bet";
    
    struct Referee {
        address suggestedBy;
        bool confirmed;
    }
    
    mapping (address => Referee) referees;
    address[] public allReferees;
    address payable[] public invited;
    mapping (address => bool) hasEntered;
    uint256 public prize;
    BetFactory betfactory;
    
    function newReff(address referee) private {
        Referee storage newReferee = referees[referee];
        newReferee.suggestedBy = msg.sender;
        newReferee.confirmed = false;
        allReferees.push(referee);
    }

    constructor(address payable player1, address payable player2, address _referee, uint256 _prize, address betfactoryaddr) payable public {
        require(player1 != _referee && player2 != _referee, "Invalid referee");
        require(player1.balance > _prize, "You do not have enough funds!");
        require(player2.balance > _prize, "Opponent does not have enough funds!");
        newReff(_referee);
        prize = _prize;
        invited.push(player1);
        invited.push(player2);
        betfactory = BetFactory(betfactoryaddr);
        betfactory.pushBet(player2);
    }

    function enter() public payable {
        require(msg.value == prize, "Betting amount must be equal.");
        require(!hasEntered[msg.sender], "You have already entered");
        hasEntered[msg.sender] = true;
    }
    
    function addPlayer(address payable newPlayer) public onlyPlayer {
        require(newPlayer.balance > prize);
        invited.push(newPlayer);
    }

    modifier onlyReferee() {
        require(referees[msg.sender].confirmed, "Only for confirmed referees!");
        _;
    }
    
    modifier onlyPlayer() {
        require(hasEntered[msg.sender], "You must be a player to do this!");
        _;
    }

    function pickWinner(address payable player) public onlyReferee {
        require(!referees[player].confirmed, "You sneaky sneaky");
        require(hasEntered[player], "Player has not entered");
        player.transfer(address(this).balance);
    }
    
    function suggestReferee(address _referee) public onlyPlayer {
        require(msg.sender != _referee, "Cannot suggest self.");
        require(referees[_referee].suggestedBy == address(0), "Referee already exists.");
        newReff(_referee);
    }
    
    function confirmReferee(address _referee) public onlyPlayer {
        require(msg.sender != _referee, "Cannot confirm self.");
        require(!referees[_referee].confirmed, "Referee already confirmed.");
        require(referees[_referee].suggestedBy != msg.sender, "Cannot confirm referee suggested by self.");
        referees[_referee].confirmed = true;
        betfactory.pushBet(_referee);
    }
    
    function getPrize() public view returns (uint256) {
        return address(this).balance;
    }
    
    function getInvited() public view returns (address payable[] memory) {
        return invited;
    }
    
    function getReferees() public view returns (address[] memory) {
        return allReferees;
    }
    
    function isRefereeConfirmed(address _referee) public view returns (bool) {
        return referees[_referee].confirmed;
    }
    
    function hasPlayerEntered(address player) public view returns (bool) {
        return hasEntered[player];
    }
}