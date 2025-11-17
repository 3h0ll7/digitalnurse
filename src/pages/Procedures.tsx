import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronRight } from "lucide-react";
import { procedures, additionalProcedures } from "@/data/procedures";
import { useNavigate } from "react-router-dom";

const Procedures = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const allProcedures = [...procedures, ...additionalProcedures];
  
  const filteredProcedures = allProcedures.filter(proc =>
    proc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const categories = Array.from(new Set(allProcedures.map(p => p.category)));
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const displayProcedures = selectedCategory === "All" 
    ? filteredProcedures 
    : filteredProcedures.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <h1 className="text-2xl font-bold">Nursing Procedures</h1>
      </header>

      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search procedures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {displayProcedures.map((procedure) => (
            <div
              key={procedure.id}
              onClick={() => navigate(`/procedure/${procedure.id}`)}
              className="bg-card p-4 rounded-xl shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-primary mb-1">
                    {procedure.category}
                  </div>
                  <h3 className="font-bold text-card-foreground mb-1">
                    {procedure.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {procedure.description}
                  </p>
                </div>
                <ChevronRight className="text-muted-foreground ml-2 flex-shrink-0" size={20} />
              </div>
            </div>
          ))}
        </div>

        {displayProcedures.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No procedures found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Procedures;
