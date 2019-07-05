// Libraries
import React, {Component} from "react";
import {inject, observer} from "mobx-react";

// Utils
import {printNumber, WAD, fromWei, toWei} from "../utils/helpers";

@inject("system")
@inject("dialog")
@observer
export default class CupInfoMobile extends Component {
  ratio = cup => {
    if (cup && cup.ratio) {
      return (
        this.props.system.tub.off === false
        ?
          cup.ratio.lt(0)
          ?
            null
          :
            cup.ratio.gt(0) && cup.ratio.toNumber() !== Infinity
            ?
              toWei(cup.ratio)
            :
            null
        :
        null
      );
    }
  }

  ratioColor = ratio => {
    const adjustedRatio = parseFloat(ratio) / 10000000000000000;
    if (adjustedRatio && this.props.cupId) {
      return adjustedRatio < 200
        ? ((adjustedRatio < 150) ? {color: "#C0392B"} : {color: "#FBAE17"})
        : ""
    }
  }

  liqPrice = cup => {
    if (cup && cup.liq_price) {
      return (
        this.props.system.tub.off === true || (cup.liq_price && cup.liq_price.eq(0))
        ?
        null
        :
          cup.liq_price && cup.liq_price.gte(0)
          ?
            cup.liq_price
          :
          null
      );
    }
  }

  cupHeader = () => {
    return (
      <div>
        <h2
          className="inline-headline"
          style={{color: "#ffffff", maxWidth: "fit-content"}}
        >
          CDP #{this.props.cupId}
        </h2>
        <a
          className="text-btn right mobile-a-button"
          href="#action"
          data-method="shut"
          data-cup={ this.props.cupId }
          disabled={ !this.props.actions.shut.active }
          onClick={ this.props.dialog.handleOpenDialog }
          style={{ ...this.props.buttonStyle, marginLeft: "7px" }}
        >
          Close
        </a>
        <a
          className="text-btn right mobile-a-button"
          href="#action"
          data-method="give"
          data-cup={ this.props.cupId }
          disabled={ !this.props.actions.free.active }
          onClick={ this.props.dialog.handleOpenDialog }
          style={{ ...this.props.buttonStyle }}
        >
          Move
        </a>
      </div>
    );
  }

  render() {
    let cup;
    const stabilityFee = printNumber(
      toWei(fromWei(this.props.system.tub.fee)
      .pow(60 * 60 * 24 * 365))
      .times(100)
      .minus(toWei(100)), 1, true, true
    );
    if (this.props.cupId) {
      cup = this.props.system.tub.cups[this.props.cupId];
    }
    const liqPrice = this.props.liqPrice
      ? this.props.liqPrice
      : this.liqPrice(cup);
    const ratio = this.props.ratio
      ? this.props.ratio
      : this.ratio(cup);
    const ratioColor = this.ratioColor(ratio);

    return (
      <div id="CupInfoMobile">
        {
          cup ? this.cupHeader() : <div></div>
        }
        <div className="col" style={{marginBottom: "30px"}}>
          <div>
            <h3 className="typo-cm typo-bold inline-headline">
              Collateralization
            </h3>
            <div className="typo-cm right">
              <span style={{...ratioColor}}>
                {
                  ratio && typeof ratio !== "string"
                    ? printNumber(ratio.times(100))
                    : "--"
                }%
              </span>
            </div>
          </div>
          <div>
            <h3 className="typo-cm typo-bold inline-headline">
              Minimum ratio
            </h3>
            <div className="typo-cm right">
              { printNumber(this.props.system.tub.mat.times(100)) }%
            </div>
          </div>
          <div>
            <h3 className="typo-cm typo-bold inline-headline">
              Liquidation price (ETH/USD)
            </h3>
            <div className="typo-cm right">
              {
                liqPrice && typeof liqPrice !== "string"
                  ? printNumber(liqPrice)
                  : "--"
              } USD
            </div>
          </div>
          <div>
            <h3 className="typo-cm typo-bold inline-headline">
              Current price (ETH/USD)
            </h3>
            <div className="typo-cm right">
              { printNumber(this.props.system.pip.val) } USD
            </div>
          </div>
          <div>
            <h3 className="typo-cm typo-bold inline-headline">
              Liquidation penalty
            </h3>
            <div className="typo-cm right">
              { printNumber(this.props.system.tub.axe.minus(WAD).times(100)) }%
            </div>
          </div>
          <div>
            <h3 className="typo-cm  typo-bold inline-headline">
              Stability fee
            </h3>
            <div className="typo-cm right">{ stabilityFee }%</div>
          </div>
        </div>
      </div>
    );
  }
}
