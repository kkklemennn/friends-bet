import React, { Component } from "react";
import Web3 from "web3";
import BetFactory from "../abis/BetFactory.json";
import Bet from "../abis/Bet.json";
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    let ethBalance = await web3.eth.getBalance(accounts[0]);
    this.setState({ account: accounts[0], ethBalance: ethBalance.toString() });

    const networkId = await web3.eth.net.getId();

    // Load BetFactory
    const betFactoryData = BetFactory.networks[networkId];
    if (betFactoryData) {
      const betFactory = new web3.eth.Contract(
        BetFactory.abi,
        betFactoryData.address
      );
      this.setState({ betFactory });
      var mybets = await betFactory.methods.myBets().call();
      this.setState({ mybets: mybets });
    } else {
      window.alert("BetFactory contract not deployed to detected network.");
    }

    // Load Bet data
    const betOnNet = Bet.networks[networkId];
    if (betOnNet) {
      var betData = {};
      const bet = new web3.eth.Contract(Bet.abi, mybets[0]);
      this.setState({ bet });

      //Get prize
      var prizeData = await bet.methods.prize().call();
      betData[mybets[0]] = prizeData;
      this.setState({ prize: prizeData });

      // Get referees
      let refereeData = await bet.methods.getReferees().call();
      this.setState({ referees: refereeData });

      // Get players
      let invitedData = await bet.methods.getInvited().call();
      this.setState({ invitedData: invitedData });
    } else {
      window.alert("Bet contract not deployed to detected network.");
    }
    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  createBet = (player, referee, prize) => {
    this.setState({ loading: true });
    this.state.betFactory.methods
      .createBet(player, referee, prize)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  confirmReferee = (referee) => {
    this.setState({ loading: true });
    this.state.bet.methods
      .confirmReferee(referee)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  enter = () => {
    this.setState({ loading: true });
    this.state.bet.methods
      .enter()
      .send({ from: this.state.account, value: this.state.prize })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  addPlayer = (player) => {
    this.setState({ loading: true });
    this.state.bet.methods
      .addPlayer(player)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  suggestReferee = (newreferee) => {
    this.setState({ loading: true });
    this.state.bet.methods
      .suggestReferee(newreferee)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  isRefereeConfirmed = async (referee) => {
    let rez = await this.state.bet.methods.isRefereeConfirmed(referee).call();
    return rez;
  };

  hasPlayerEntered = async (player) => {
    let rez = await this.state.bet.methods.hasPlayerEntered(player).call();
    return rez;
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      ethBalance: "0",
      mybets: [],
      invitedData: [],
      referees: [],
      prize: "0",
      loading: true,
      betData: {},
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = (
        <Main
          account={this.state.account}
          ethBalance={this.state.ethBalance}
          mybets={this.state.mybets}
          invitedData={this.state.invitedData}
          referees={this.state.referees}
          prize={this.state.prize}
          createBet={this.createBet}
          enter={this.enter}
          confirmReferee={this.confirmReferee}
          addPlayer={this.addPlayer}
          suggestReferee={this.suggestReferee}
          isRefereeConfirmed={this.isRefereeConfirmed}
          hasPlayerEntered={this.hasPlayerEntered}
        />
      );
    }

    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                <a target="_blank" rel="noopener noreferrer"></a>

                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
