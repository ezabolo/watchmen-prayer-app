import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import CurrentCampaigns from "@/components/CurrentCampaigns";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Prayer Watchman | Global Prayer Community</title>
        <meta name="description" content="Join the Prayer Watchman global network - recruiting, training, and activating intercessors around the world to stand watch in prayer for global transformation." />
      </Helmet>
      
      <div className="w-full">
        <Hero />
        <Mission />
      </div>
    </>
  );
}
