# friends-bet

This is my first dApp project. A simple webapp escrow service built on Ethereum.

This dApp will be shortly available for testing on Rinkeby and/or Goerli Test Net.

## Usage

The idea is simple:

1. Create a bet
   - Set entry price, opponent and a referee
2. Enter the bet and wait for other players to enter aswell.
3. You or other players that have also entered can now invite new players to join or suggest different referees.
4. Confirm a referee suggested by another player or wait for some player to confirm your suggested referee.
5. Wait for the winner to be picked by the referee.

## Possible further improvements

- Use Chainlink as an Oracle to get API calls (e.g. from sports results website) to build a fully decentralized escrow service independent from referees.
- Each created bet could be tokenized as an NFT and sellable to other accounts in order to be even more decentralized.

## Tools used

- Truffle
- Ganache
- Mocha/Chai
