// Stores
import DialogStore from "./Dialog";
import NetworkStore from "./Network";
import ProfileStore from "./Profile";
import SystemStore from "./System";
import TransactionsStore from "./Transactions";
import ContentStore from "./Content";

// Utils
import * as blockchain from "../utils/blockchain";
import * as daisystem from "../utils/dai-system";
import {isAddress} from "../utils/helpers";

// Settings
import * as settings from "../settings";

class RootStore {
  constructor() {
    this.dialog = new DialogStore(this);
    this.network = new NetworkStore(this);
    this.profile = new ProfileStore(this);
    this.system = new SystemStore(this);
    this.transactions = new TransactionsStore(this);
    this.content = new ContentStore(this);

    this.interval = null;
    this.intervalAggregatedValues = null;
  }

  setVariablesInterval = () => {
    if (!this.interval) {
      this.interval = setInterval(() => {
        console.debug("Running variables interval");
        this.transactions.setStandardGasPrice();
        this.transactions.checkPendingTransactions();
      }, 10000);
    }

    if (!this.intervalAggregatedValues) {
      this.intervalAggregatedValues = setInterval(() => {
        console.debug("Running setAggregatedValues interval");
        this.system.setAggregatedValues();
      }, 5000);
    }
  }

  _loadContracts = () => {
    daisystem.getContracts(settings.chain[this.network.network].proxyRegistry, this.network.defaultAccount).then(r => {
      if (r && r[0] && r[1] && isAddress(r[1][0]) && isAddress(r[1][1])) {
        const block = r[0].toNumber();
        // Make the contracts addresses load a bit more flexible, just checking the node request is bringing data no older than 5 blocks
        if (block > this.transactions.latestBlock - 5) {
          this.transactions.setLatestBlock(block);
          // Set profile proxy and system contracts
          this.profile.setProxy(r[2]);
          this.system.init(r[1][0], r[1][1], r[1][2], r[1][3], r[1][4], r[1][5], r[1][6], r[1][7], r[1][8], r[1][9], r[1][10], r[1][11]);
          this.network.stopLoadingAddress();
          this.transactions.setStandardGasPrice();

          this.setVariablesInterval();
        } else {
          console.debug(`Error loading contracts (latest block ${this.transactions.latestBlock}, request one: ${block}, trying again...`);
          this.transactions.addAmountCheck();
          setTimeout(this._loadContracts, 2000);
        }
      } else {
        console.debug("Error loading contracts, trying again...");
        this.transactions.addAmountCheck();
        setTimeout(this._loadContracts, 2000);
      }
    }, () => {
      console.debug("Error loading contracts, trying again...");
      setTimeout(this._loadContracts, 2000);
    });
  }

  loadContracts = () => {
    if (this.network.network && !this.network.stopIntervals) {
      blockchain.resetFilters(true);
      if (typeof this.interval !== "undefined") clearInterval(this.interval);
      this.dialog.reset();
      this.system.reset();
      this.transactions.reset();

      // Check actual block number from 3 different requests (workaround to try to avoid outdated nodes behind load balancer)
      const blockPromises = [];
      for (let i = 0; i < 3; i++) {
        blockPromises.push(blockchain.getBlockNumber());
      }

      Promise.all(blockPromises).then(r => {
        r.forEach(block => this.transactions.setLatestBlock(block)); // Will set the maximum value

        blockchain.loadObject("proxyregistry", settings.chain[this.network.network].proxyRegistry, "proxyRegistry");
        blockchain.loadObject("saivaluesaggregator", settings.chain[this.network.network].saiValuesAggregator, "saiValuesAggregator");

        this._loadContracts();
      })
    }
  }
}

const store = new RootStore();
export default store;
