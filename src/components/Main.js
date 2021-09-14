import React, { Component } from "react";

class Main extends Component {
  render() {
    return (
      <div id="content" className="mt-3">
        <div className="card mb-4">
          <div className="card-body">
            <form
              className="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                let prize, player, referee;
                prize = this.prize.value.toString();
                prize = window.web3.utils.toWei(prize, "Ether");
                player = this.player.value.toString();
                referee = this.referee.value.toString();
                this.props.createBet(player, referee, prize);
              }}
            >
              <div>
                <label className="float-left">
                  <b>New bet:</b>
                </label>
                <span className="float-right text-muted">
                  Balance:{" "}
                  {window.web3.utils.fromWei(this.props.ethBalance, "Ether")}
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  name="prize"
                  type="text"
                  ref={(prize) => {
                    this.prize = prize;
                  }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">&nbsp;&nbsp;&nbsp; ETH</div>
                </div>
              </div>
              <div className="input-group mb-4">
                <input
                  name="player"
                  type="text"
                  ref={(player) => {
                    this.player = player;
                  }}
                  className="form-control form-control-lg"
                  placeholder="Player Address"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    &nbsp;&nbsp;&nbsp; Player
                  </div>
                </div>
              </div>
              <div className="input-group mb-4">
                <input
                  name="referee"
                  type="text"
                  ref={(referee) => {
                    this.referee = referee;
                  }}
                  className="form-control form-control-lg"
                  placeholder="Referee Address"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    &nbsp;&nbsp;&nbsp; Referee
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
              >
                Create a bet!
              </button>
            </form>
          </div>
        </div>
        <div className="card mb-6">
          <div className="card-body">
            <label className="float-left">
              <b>Bet: </b>
              {this.props.mybets[0]}
            </label>
            <span className="float-right text-muted">
              Entry: {window.web3.utils.fromWei(this.props.prize, "Ether")}
              {" \u039e"}
            </span>
            <br></br>
            <br></br>
            <div>
              Referees:
              <ul>{this.props.referees}</ul>
            </div>
            <br></br>
            <div>
              Invited:
              <ul>{this.props.invited}</ul>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-danger btn-block btn-md"
            onClick={(event) => {
              event.preventDefault();
              this.props.enter();
            }}
          >
            Enter
          </button>
        </div>
      </div>
    );
  }
}

export default Main;
