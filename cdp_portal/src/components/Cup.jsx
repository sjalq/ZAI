// Libraries
import React from "react";
import {inject, observer} from "mobx-react";

// Components
import CupHistory from "./CupHistory";
import TooltipHint from "./TooltipHint";

// Utils
import {WAD, printNumber, wmul, fromWei, toWei} from "../utils/helpers";

@inject("profile")
@inject("system")
@inject("dialog")
@observer
class Cup extends React.Component {
  componentDidMount() {
    TooltipHint.rebuildTooltips();
  }
  render() {
    const cup = this.props.system.tub.cups[this.props.cupId];

    const actions = {
      lock: {
              active: this.props.system.tub.off === false && this.props.system.eth.myBalance && this.props.system.eth.myBalance.gt(0),
              helper: "Add collateral to a CDP"
            },
      free: {
              active: this.props.system.pip.val.gt(0) && cup.ink.gt(0) && cup.safe && (this.props.system.tub.off === false || cup.art.eq(0)),
              helper: "Remove collateral from a CDP"
            },
      draw: {
              active: this.props.system.pip.val.gt(0) && this.props.system.tub.off === false && cup.ink.gt(0) && cup.safe,
              helper: "Create Dai against a CDP"
            },
      wipe: {
              active: this.props.system.tub.off === false && cup.art.gt(0),
              helper: "Use Dai to cancel CDP debt"
            },
      shut: {
              active: this.props.system.pip.val.gt(0) && this.props.system.tub.off === false,
              helper: "Close a CDP - Wipe all debt, Free all collateral, and delete the CDP"
            },
      give: {
              active: this.props.system.tub.off === false,
              helper: "Transfer CDP ownership"
            }
    };
    return (
      <React.Fragment>
        <header className="col">
          <h1 className="typo-h1 inline-headline dashboard-headline">CDP Portal <span className="typo-c">My collateralized debt position #{ this.props.cupId }</span></h1>
        </header>
        <div className="cup-top-right-buttons">
          <a href="#action" data-method="give" data-cup={ this.props.cupId } disabled={ !actions.free.give } onClick={ this.props.dialog.handleOpenDialog }>
            <svg height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
              <path d="m2.01604172 15.3504964 1.18250996-5.1208637c.04667802-.2179091.23339012-.3891234.46678025-.42025327l6.61272017-.68485714c.1867121-.01556494.1867121-.29573377 0-.32686364l-6.61272017-.63816235c-.23339013-.01556493-.42010223-.18677922-.46678025-.40468831l-1.18250996-5.10530497c-.10891539-.43581819.35786485-.79381092.76240774-.59146692l12.92981284 6.47501865c.3889836.20234416.3889836.76268182 0 .96502598l-12.92981284 6.44388317c-.40454289.2023442-.87132313-.1556493-.76240774-.5914675z" fill="none" stroke="#9aa3ad"/>
            </svg>
            <span>MOVE CDP</span>
          </a>
          <a href="#action" data-method="shut" data-cup={ this.props.cupId } disabled={ !actions.free.shut } onClick={ this.props.dialog.handleOpenDialog }>
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd" stroke="#9aa3ad" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 1)"><path d="m0 3.5h1.55555556 12.44444444"/><path d="m12.25 3.15v11.025c0 .8698485-.6715729 1.575-1.5 1.575h-7.5c-.82842712 0-1.5-.7051515-1.5-1.575v-11.025m2.25 0v-1.575c0-.86984848.67157288-1.575 1.5-1.575h3c.82842712 0 1.5.70515152 1.5 1.575v1.575"/><path d="m5.25 7v4.375"/><path d="m8.75 7v4.375"/></g>
            </svg>
            <span>CLOSE CDP</span>
          </a>
        </div>
        <div className="row cup-price-information">
          <div className="col col-2">
            <div style={ {marginBottom: "1rem"}}>
              <h3 className="typo-cxl inline-headline">Liquidation price (ETH/USD)</h3>
              <TooltipHint tipKey="liquidation-price" />
              <div className="value typo-cxl right strong-text">
                {
                  this.props.system.tub.off === true || (cup.liq_price && cup.liq_price.eq(0))
                  ?
                    "-"
                  :
                    cup.liq_price && cup.liq_price.gte(0)
                    ?
                      <span>{ printNumber(cup.liq_price) }<span className="unit">USD</span></span>
                    :
                      "Loading..."
                }
              </div>
            </div>
            <div>
              <h3 className="typo-cm inline-headline">Current price information (ETH/USD)</h3>
              <TooltipHint tipKey="current-price-information" />
              <div className="value typo-cm right">
                {
                  this.props.system.pip.val.gte(0)
                  ?
                    <span>{ printNumber(this.props.system.pip.val) }<span className="unit">USD</span></span>
                  :
                    "Loading..."
                }
              </div>
            </div>
            <div className="clearfix">
              <h3 className="typo-cm inline-headline">Liquidation penalty</h3>
              <TooltipHint tipKey="liquidation-penalty" />
              <div className="value typo-cm right">
                {
                  this.props.system.tub.axe.gte(0)
                  ?
                    <span>{ printNumber(this.props.system.tub.axe.minus(WAD).times(100)) }<span className="unit">%</span></span>
                  :
                    "Loading..."
                }
              </div>
            </div>
          </div>
          <div className="col col-2">
            <div style={ {marginBottom: "1rem"}}>
              <h3 className="typo-cxl inline-headline">Collateralization ratio</h3>
              <TooltipHint tipKey="collateralization-ratio" />
              <div className="value typo-cxl right strong-text">
                {
                  this.props.system.tub.off === false
                  ?
                    cup.ratio.lt(0)
                    ?
                      "Loading..."
                    :
                      cup.ratio.gt(0) && cup.ratio.toNumber() !== Infinity
                      ?
                        <span className={ cup.ratio.lt(2) ? (cup.ratio.lt(1.5) ? "text-red" : "text-yellow") : "" }>
                          { printNumber(toWei(cup.ratio).times(100)) }<span className="unit">%</span>
                        </span>
                      :
                        "-"
                  :
                    "-"
                }
              </div>
            </div>
            <div>
              <h3 className="typo-cm inline-headline">Minimum ratio</h3>
              <TooltipHint tipKey="minimum-ratio" />
              <div className="value typo-cm right">
                {
                  this.props.system.tub.mat.gte(0)
                  ?
                    <span>
                      { printNumber(this.props.system.tub.mat.times(100)) }<span className="unit">%</span>
                    </span>
                  :
                    "Loading..."
                }
              </div>
            </div>
            <div className="clearfix">
              <h3 className="typo-cm inline-headline">Stability fee</h3>
              <TooltipHint tipKey="stability-fee" />
              <div className="value typo-cm right">
                {
                  this.props.system.tub.fee && this.props.system.tub.fee.gt(0)
                  ?
                    <span>
                      { printNumber(toWei(fromWei(this.props.system.tub.fee).pow(60 * 60 * 24 * 365)).times(100).minus(toWei(100)), 3, true, true) }<span className="unit">%</span>
                    </span>
                  :
                    "Loading..."
                }
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col col-2">
            <h3 className="typo-cl inline-headline">ETH collateral</h3>

            <div className="inner-row">
              <h4 className="typo-c inline-headline">Deposited</h4>
              <div className="right">
                <button className="text-btn disable-on-dialog" style={ {minWidth: "8rem" } } disabled={ !actions.lock.active } data-method="lock" data-cup={ this.props.cupId } onClick={ this.props.dialog.handleOpenDialog }>Deposit</button>
              </div>
              <div className="right align-right" style={ {marginRight: "1rem"} }>
                {
                  cup.ink.gte(0) && this.props.system.tub.per.gte(0) && this.props.system.pip.val.gte(0)
                  ?
                    <React.Fragment>
                      <div className="value block typo-cl">
                        { printNumber(wmul(cup.ink, this.props.system.tub.per)) }<span className="unit">ETH</span>
                      </div>
                      <div className="value block typo-c" style={ {lineHeight: "1rem"} }>
                        { printNumber(cup.ink) }<span className="unit">PETH</span>
                        <span className="separator">&nbsp;|&nbsp;</span>
                        { printNumber(wmul(wmul(cup.ink, this.props.system.tub.per), this.props.system.pip.val)) }<span className="unit">USD</span>
                      </div>
                    </React.Fragment>
                  :
                    "Loading..."
                }
              </div>
            </div>
            <div className="inner-row">
              <h4 className="typo-c inline-headline" style={ {maxWidth: "8rem" } }>
                Max. available to withdraw
                <TooltipHint tipKey="max-available-to-withdraw" />
              </h4>
              <div className="right">
                <button className="text-btn disable-on-dialog" style={ {minWidth: "8rem" } } disabled={ !actions.free.active } data-method="free" data-cup={ this.props.cupId } onClick={ this.props.dialog.handleOpenDialog }>Withdraw</button>
              </div>
              {
                this.props.system.tub.off === false
                ?
                  cup.avail_skr.gte(0) && this.props.system.tub.per.gte(0) && this.props.system.pip.val.gte(0)
                  ?
                    <div className="right align-right" style={ {marginRight: "1rem"} }>
                      <div className="value block typo-cl">
                        { printNumber(wmul(cup.avail_skr, this.props.system.tub.per)) }<span className="unit">ETH</span>
                      </div>
                      <div className="value block typo-c" style={ {lineHeight: "1rem"} }>
                        { printNumber(cup.avail_skr) }<span className="unit">PETH</span>
                        <span className="separator">&nbsp;|&nbsp;</span>
                        { printNumber(wmul(wmul(cup.avail_skr, this.props.system.tub.per), this.props.system.pip.val)) }<span className="unit">USD</span>
                      </div>
                    </div>
                  :
                    "Loading..."
                :
                  "-"
              }
            </div>
          </div>
          <div className="col col-2">
            <h3 className="typo-cl inline-headline">DAI position</h3>
            <div className="inner-row">
              <h4 className="typo-c inline-headline">Generated</h4>
              <div className="right">
                <button className="text-btn disable-on-dialog" style={ {minWidth: "8rem" } } disabled={ !actions.wipe.active } data-method="wipe" data-cup={ this.props.cupId } onClick={ this.props.dialog.handleOpenDialog }>Pay Back</button>
              </div>
              <div className="right align-right" style={ {marginRight: "1rem"} }>
                {
                  this.props.system.tab(cup).gte(0) && this.props.system.vox.par.gte(0)
                  ?
                    <React.Fragment>
                      <div className="value block typo-cl">
                        { printNumber(this.props.system.tab(cup)) }<span className="unit">DAI</span>
                      </div>
                      <div className="value block typo-c" style={ {lineHeight: "1rem"} }>
                        { printNumber(wmul(this.props.system.tab(cup), this.props.system.vox.par)) }<span className="unit">USD</span>
                      </div>
                    </React.Fragment>
                  :
                    "Loading..."
                }
              </div>
            </div>
            <div className="inner-row">
              <h4 className="typo-c inline-headline">
                Max. available to generate
                <TooltipHint tipKey="max-available-to-generate" />
              </h4>
              <div className="right">
                <button className="text-btn disable-on-dialog" style={ {minWidth: "8rem" } } disabled={ !actions.draw.active } data-method="draw" data-cup={ this.props.cupId } onClick={ this.props.dialog.handleOpenDialog }>Generate</button>
              </div>
              {
                this.props.system.tub.off === false
                ?
                  <div className="right align-right" style={ {marginRight: "1rem"} }>
                    {
                      cup.avail_dai.gte(0) && this.props.system.vox.par.gte(0)
                      ?
                        <React.Fragment>
                          <div className="value block typo-cl">
                            { printNumber(cup.avail_dai) }<span className="unit">DAI</span>
                          </div>
                          <div className="value block typo-c" style={ {lineHeight: "1rem"} }>
                            { printNumber(wmul(cup.avail_dai, this.props.system.vox.par)) }<span className="unit">USD</span>
                          </div>
                        </React.Fragment>
                      :
                        "Loading..."
                    }
                  </div>
                :
                  "-"
              }
            </div>
          </div>
        </div>
        <CupHistory history={ cup.history } />
      </React.Fragment>
    )
  }
}

export default Cup;
