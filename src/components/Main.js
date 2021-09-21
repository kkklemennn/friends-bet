import React, { Component } from "react";

class Main extends Component {
  async componentDidMount() {
    // Preparing refferees
    this.reffs = [];
    for (var i = 0; i < this.props.referees.length; i++) {
      let reff = this.props.referees[i];
      let confirmed = await this.props.isRefereeConfirmed(reff);
      var code;
      if (confirmed) {
        code = (
          <li key={reff}>
            <label id="float-left">
              <b>{reff}</b>
            </label>
          </li>
        );
      } else {
        code = (
          <li key={reff}>
            <label id="float-left">{reff}</label>
            <span className="float-right">
              <button
                type="submit"
                className="btn btn-link btn-block btn-sm"
                onClick={(event) => {
                  event.preventDefault();
                  this.props.confirmReferee(reff);
                }}
              >
                Confirm
              </button>
            </span>
          </li>
        );
      }
      this.reffs.push(code);
    }
    this.setState(this.reffs);

    // Preparing invited players
    this.invited = [];
    for (var i = 0; i < this.props.invitedData.length; i++) {
      let inv = this.props.invitedData[i];
      let entered = await this.props.hasPlayerEntered(inv);
      var code;
      if (entered) {
        code = (
          <li key={inv}>
            <label id="float-left">
              <b>{inv}</b>
            </label>
          </li>
        );
      } else {
        code = (
          <li key={inv}>
            <label id="float-left">{inv}</label>
          </li>
        );
      }
      this.invited.push(code);
    }
    this.setState(this.invited);

    // Preparing buttons
    if (await this.props.hasPlayerEntered(this.props.account)) {
      this.enterButton = (
        <button className="btn btn-secondary btn-block btn-md">
          You have already entered!
        </button>
      );

      this.inviteButton = (
        <form
          className="mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            let newplayer;
            newplayer = this.newplayer.value.toString();
            this.props.addPlayer(newplayer);
          }}
        >
          <div className="input-group mb-4">
            <input
              name="newplayer"
              type="text"
              ref={(newplayer) => {
                this.newplayer = newplayer;
              }}
              className="form-control form-control-lg"
              placeholder="Invite a new player"
              required
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-sm"
                >
                  Invite
                </button>
              </div>
            </div>
          </div>
        </form>
      );

      this.suggestButton = (
        <form
          className="mb-3"
          onSubmit={(event) => {
            event.preventDefault();
            let newreferee;
            newreferee = this.newreferee.value.toString();
            this.props.suggestReferee(newreferee);
          }}
        >
          <div className="input-group mb-4">
            <input
              name="newreferee"
              type="text"
              ref={(newreferee) => {
                this.newreferee = newreferee;
              }}
              className="form-control form-control-lg"
              placeholder="Suggest a referee"
              required
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-sm"
                >
                  Suggest
                </button>
              </div>
            </div>
          </div>
        </form>
      );
    } else {
      this.enterButton = (
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
      );

      this.inviteButton = (
        <form className="mb-3">
          <div className="input-group mb-4">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Enter the bet to invite a player"
              readOnly="readOnly"
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <button
                  className="btn btn-secondary btn-block btn-sm"
                  disabled={true}
                >
                  Invite
                </button>
              </div>
            </div>
          </div>
        </form>
      );

      this.suggestButton = (
        <form className="mb-3">
          <div className="input-group mb-4">
            <input
              name="newreferee"
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter the bet to suggest a referee"
              readOnly="readOnly"
            />
            <div className="input-group-append">
              <div className="input-group-text">
                <button
                  type="submit"
                  className="btn btn-secondary btn-block btn-sm"
                  disabled={true}
                >
                  Suggest
                </button>
              </div>
            </div>
          </div>
        </form>
      );
    }

    this.setState(this.enterButton);
    this.setState(this.inviteButton);
    this.setState(this.suggestButton);
  }

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
                  {parseFloat(
                    window.web3.utils.fromWei(this.props.ethBalance, "Ether")
                  ).toFixed(4)}
                  {" \u039e"}
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
              <ul>{this.reffs}</ul>
            </div>
            <br></br>
            <div>
              Invited:
              <ul>{this.invited}</ul>
            </div>
          </div>
          {this.enterButton}
          <br></br>
          {this.inviteButton}
          {this.suggestButton}
        </div>
      </div>
    );
  }
}

export default Main;
