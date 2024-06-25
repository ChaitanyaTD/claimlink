import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Dashboardcontainer from "../pages/Dashboardcontainer";
import Dispensers from "../pages/Dispensers";
import CreateDispensers from "../components/dispensers/CreateDispenser";
import DispenserSetup from "../components/dispensers/DispenserSetup";
import CreateDispenser from "../components/dispensers/CreateDispenser";
import CampaignSetup from "../components/claimlink/CampaignSetup";
import ClaimPattern from "../components/claimlink/ClaimPattern";
import DistributionPage from "../components/claimlink/DistributionPage";
import Minter from "../pages/Minter";
import SelectContractType from "../components/minter/SelectContractType";
import CollectionSetup from "../components/minter/CollectionSetup";
import AddToken from "../components/minter/AddToken";
import AddTokenHome from "../components/minter/AddTokenHome";
import CompaignSetup from "../components/minter/CompaignSetup";

const approutes = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/claim-link",
    element: (
      <Dashboard>
        <Dashboardcontainer />
      </Dashboard>
    ),
  },
  {
    path: "/dispensers",
    element: (
      <Dashboard>
        <Dispensers />
      </Dashboard>
    ),
  },
  {
    path: "/dispensers/create-dispenser",
    element: (
      <Dashboard>
        <CreateDispenser />
      </Dashboard>
    ),
  },
  {
    path: "/dispensers/dispenser-setup",
    element: (
      <Dashboard>
        <DispenserSetup />
      </Dashboard>
    ),
  },
  {
    path: "/campaign-setup",
    element: (
      <Dashboard>
        <CampaignSetup />
        </Dashboard>
    ),
  },{
    path: "/minter",
    element: (
      <Dashboard headerText="Minter" menubar={false}>
        <Minter />
      </Dashboard>
    ),
  },
  {
    path: "/claim-pattern",
    element: (
      <Dashboard>
        <ClaimPattern />
        </Dashboard>
    ),
  },{
    path: "/minter/new-contract",
    element: (
      <Dashboard>
        <SelectContractType />
      </Dashboard>
    ),
  },
  {
    path: "/distribution",
    element: (
      <Dashboard>
        <DistributionPage />
        </Dashboard>
    ),
  },{
    path: "/minter/new-contract/collection-setup",
    element: (
      <Dashboard>
        <CollectionSetup />
      </Dashboard>
    ),
  },
  {
    path: "/minter/new-contract/token-home",
    element: (
      <Dashboard>
        <AddTokenHome />
      </Dashboard>
    ),
  },
  {
    path: "/minter/new-contract/token-home/add-token",
    element: (
      <Dashboard>
        <AddToken />
      </Dashboard>
    ),
  },
  {
    path: "/minter/new-contract/token-home/campaign-setup",
    element: (
      <Dashboard headerText="Test campaign" menubar={false}>
        <CompaignSetup />
      </Dashboard>
    ),
  },
]);

export default approutes;
