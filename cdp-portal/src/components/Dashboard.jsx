// Libraries
import React from "react";
import {inject, observer} from "mobx-react";
import checkIsMobile from "ismobilejs";

// Components
import Cup from "./Cup";
import LegacyCupsAlert from "./LegacyCupsAlert";
import CupMobile from "./CupMobile";

@inject("system")
@observer
class Dashboard extends React.Component {
  render() {
    const cupId = this.props.system.tub.cupId ? this.props.system.tub.cupId : Object.keys(this.props.system.tub.cups)[0];
    return (
      <div>
        <LegacyCupsAlert setOpenMigrate={ this.props.setOpenMigrate } />
        {
          checkIsMobile.any
            ? <CupMobile cupId={ cupId } />
            : <Cup cupId={ cupId } /> 
        }
      </div>
    )
  }
}

export default Dashboard;
