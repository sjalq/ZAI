// Libraries
import React from "react";
import {Link} from "react-router-dom";
import DocumentTitle from "react-document-title";
import checkIsMobile from "ismobilejs";

// Components
import Menu from "./Menu";

class Help extends React.Component {
  columnFormatting = () => {
    return checkIsMobile.any
      ? "col col-extra-padding"
      : "col col-2 col-extra-padding";
  }

  columnStyle = () => {
    return checkIsMobile.any
      ? { marginTop: "-120px" }
      : { paddingLeft: "2.5em" }
  }

  render() {
    return (
      <DocumentTitle title="CDP Portal: Help">
        <div className="full-width-page">
          <div className="wrapper">
            {
              <Menu page="help" />
            }
            <main className="main-column fullwidth help-page">
              <div>
                <header className="col">
                  <h1 className="typo-h1">Help</h1>
                </header>
                <div className="row">
                  <div className={this.columnFormatting()}>
                    <h2 className="typo-h2 ">FAQ</h2>
                    <h3 className="typo-h3 typo-white">First steps</h3>
                    <ul className="typo-cl bullets">
                      <li><Link to="/help/what-is-a-collateralized-debt-position-cdp">What is a Collateralized Debt Position (CDP)?</Link></li>
                      <li><Link to="/help/what-is-the-best-way-to-lower-my-risk-of-liquidation">What is the best way to lower my risk of liquidation?</Link></li>
                      <li><Link to="/help/what-is-the-stability-fee">What is the Stability Fee?</Link></li>
                      <li><Link to="/help/when-do-i-have-to-pay-the-stability-fee">When do I have to pay the Stability Fee?</Link></li>
                      <li><Link to="/help/what-is-peth">What is PETH?</Link></li>
                      <li><Link to="/help/how-do-i-get-mkr-tokens">How do I get MKR tokens?</Link></li>
                    </ul>
                  </div>
                  <div className={this.columnFormatting()} style={ this.columnStyle() }>
                    <h2 className="typo-h2">&nbsp;</h2>
                    <h3 className="typo-h3 typo-white">Most asked questions</h3>
                    <ul className="typo-cl bullets">
                      <li><Link to="/help/how-does-the-avatar-work">How does the avatar work?</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default Help;
