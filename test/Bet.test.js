const { assert } = require("chai");

const BetFactory = artifacts.require("BetFactory");
const Bet = artifacts.require("Bet");

require("chai")
  .use(require("chai-as-promised"))
  .should();

contract("BetFactory", ([player1, player2, referee, player3]) => {
  let betFactory, bet;

  before(async () => {
    betFactory = await BetFactory.new();

    await betFactory.createBet(
      player2,
      referee,
      web3.utils.toWei("1", "ether")
    );
    const betAddress = await betFactory.myBets();
    bet = await Bet.at(betAddress[0]);
  });

  describe("BetFactory", async () => {
    it("has a name", async () => {
      const name = await betFactory.name();
      assert.equal(name, "BetFactory");
    });
  });

  describe("Bet", async () => {
    it("player enters", async () => {
      const name = await bet.name();
      assert.equal(name, "Bet", "name ok");
      await bet.enter({
        from: player1,
        value: web3.utils.toWei("1", "ether"),
      });
      let entered = await bet.hasPlayerEntered(player1);
      assert.equal(entered.toString(), "true");
    });

    it("confirms referee", async () => {
      try {
        await bet.confirmReferee(referee, { from: player2 });
        assert.fail("Should not confirm");
      } catch (err) {
        assert.include(
          err.message,
          "revert",
          "You must be a player to do this!"
        );
      }
      await bet.enter({
        from: player2,
        value: web3.utils.toWei("1", "ether"),
      });
      await bet.confirmReferee(referee, { from: player2 });
      const confirmed = await bet.isRefereeConfirmed(referee);
      assert.equal(confirmed.toString(), "true");
    });

    it("adds a player", async () => {
      await bet.addPlayer(player3);
      let entered = await bet.hasPlayerEntered(player3);
      assert.equal(entered.toString(), "false");
      await bet.enter({
        from: player3,
        value: web3.utils.toWei("1", "ether"),
      });
      entered = await bet.hasPlayerEntered(player3);
      assert.equal(entered.toString(), "true");
    });

    it("prize ok", async () => {
      let prize = await bet.getPrize();
      assert.equal(prize.toString(), web3.utils.toWei("3", "ether"));
    });

    it("picks winner", async () => {
      const initialBalance = await web3.eth.getBalance(player2);
      await bet.pickWinner(player2, { from: referee });
      const finalBalance = await web3.eth.getBalance(player2);
      const difference = finalBalance - initialBalance;

      assert.isAtLeast(
        Number(difference),
        Number(web3.utils.toWei("2.8", "ether"))
      );
    });
  });
});
