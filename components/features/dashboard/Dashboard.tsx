import { Welcome } from "./Welcome";
import { QuickGuide } from "./QuickGuide";
import { QuickLinks } from "./QuickLinks";
import { Recent } from "./Recent";

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <Welcome />
      <QuickGuide />
      <QuickLinks />
      <Recent />
    </div>
  );
};