// Libraries
import React from "react";
import {inject, observer} from "mobx-react";
import Slider from "react-rangeslider";

import "react-rangeslider/lib/index.css";

@inject("transactions")
@observer
class PriceModal extends React.Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      gasPrice: props.transactions.standardGasPrice,
      timeEstimate: this.estimateTxTime(props.transactions.standardGasPrice)
    };
    this.stdGasPrice = props.transactions.standardGasPrice;
  }

  setPriceAndSend = e => {
    e.preventDefault();
    this.props.transactions.setPriceAndSend(this.state.gasPrice);
  };

  // TODO: Use an external source to estimate tx time
  estimateTxTime = gasPrice => {
    return Math.round((99 - gasPrice) / 2) + " mins";
  };

  handleChange = value => {
    this.setState({
      gasPrice: value,
      timeEstimate: this.estimateTxTime(value)
    });
  };

  render() {
    const { gasPrice } = this.state;
    return (
      <React.Fragment>
        <h2>Set your gas price</h2>
        <p>Gas is used to pay for transactions. A higher gas price results in faster confirmation times.</p>
        <h3>{ gasPrice } Gwei { gasPrice === this.stdGasPrice ? " (Standard)" : "" }</h3>
        {/* <p>~{ this.state.timeEstimate }</p> */}
        <form onSubmit={ this.setPriceAndSend }>
          <input type="hidden" value={ this.state.gasPrice } />
          <div className="horizontal-slider">
            <Slider
              min={1}
              max={99}
              value={gasPrice}
              onChangeStart={this.handleChangeStart}
              onChange={this.handleChange}
              onChangeComplete={this.handleChangeComplete}
              tooltip={false}
            />
            <div style={ {fontSize: "0.9rem", letterSpacing: "0.02rem"} }><div style={ {float: "left"} }>Slow</div><div style={ {float: "right"} }>Fast</div></div>
          </div>

          <div className="align-center" style={ {margin: "6.4rem 0 0", paddingBottom: "3.7rem", userSelect: "none"} }>
            <button className="modal-btn is-secondary" onClick={ this.props.transactions.closePriceModal }>Cancel</button><button className="modal-btn is-primary" type="submit">Confirm</button>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default PriceModal;
