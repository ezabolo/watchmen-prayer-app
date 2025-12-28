import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function GlobalStats() {
  const stats = [
    { label: "Registered Watchmen", value: "12,483" },
    { label: "Countries Represented", value: "142" },
    { label: "Hours Prayed", value: "865,219" },
    { label: "Active Prayer Campaigns", value: "527" }
  ];
  
  return (
    <section className="py-12 bg-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-primary-200 tracking-wide uppercase">Global Impact</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Prayer Watchman Around the World
          </p>
        </div>
        
        <div className="mt-10 flex flex-wrap justify-center">
          {stats.map((stat, index) => (
            <div key={index} className="w-full md:w-1/4 p-4 text-center">
              <p className="text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 text-lg font-medium text-primary-200">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild variant="secondary" className="bg-white text-primary-700 hover:bg-gray-50">
            <Link to="/prayer-space">
              View Global Prayer Map
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
