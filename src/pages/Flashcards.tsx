import { useMemo, useState } from "react";
import { Brain, RefreshCcw } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { flashcards } from "@/data/flashcards";
import { usePreferences } from "@/contexts/PreferencesContext";

const Flashcards = () => {
  const { t } = usePreferences();
  const [searchTerm, setSearchTerm] = useState("");
  const [topic, setTopic] = useState("__ALL__");
  const [revealedCard, setRevealedCard] = useState<string | null>(null);

  const topics = useMemo(
    () => [
      { value: "__ALL__", label: t.allTopics },
      ...Array.from(new Set(flashcards.map((card) => card.topic))).map((item) => ({
        value: item,
        label: item,
      })),
    ],
    [t.allTopics]
  );

  const filteredCards = flashcards.filter((card) => {
    const matchesTopic = topic === "__ALL__" || card.topic === topic;
    const normalizedSearch = searchTerm.toLowerCase();
    const matchesSearch =
      card.question.toLowerCase().includes(normalizedSearch) ||
      card.answer.toLowerCase().includes(normalizedSearch) ||
      card.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

    return matchesTopic && matchesSearch;
  });

  const toggleCard = (id: string) => {
    setRevealedCard((current) => (current === id ? null : id));
  };

  const resetFilters = () => {
    setTopic("__ALL__");
    setSearchTerm("");
    setRevealedCard(null);
  };

  return (
    <AppLayout title={t.flashcardsTitle} subtitle={t.flashcardsSubtitle}>
      <section className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={t.searchFlashcards}
            className="bg-card"
          />
          <Button variant="outline" onClick={resetFilters} className="md:w-auto">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <div className="hidden md:flex items-center justify-end text-sm text-muted-foreground">
            {filteredCards.length} / {flashcards.length} cards
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant={item.value === topic ? "default" : "outline"}
              onClick={() => {
                setTopic(item.value);
                setRevealedCard(null);
              }}
              className="rounded-full"
            >
              {item.label}
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {filteredCards.map((card) => {
          const isRevealed = revealedCard === card.id;
          return (
            <article
              key={card.id}
              className={`rounded-2xl border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover cursor-pointer ${
                isRevealed ? "ring-2 ring-primary/60" : ""
              }`}
              onClick={() => toggleCard(card.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.topic}</p>
                  <h3 className="text-lg font-semibold text-card-foreground">{card.question}</h3>
                </div>
                <Brain className="text-primary" size={24} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {card.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                {isRevealed ? card.answer : t.tapToReveal}
              </div>
            </article>
          );
        })}
        {filteredCards.length === 0 && (
          <div className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
            No cards match the current filters.
          </div>
        )}
      </section>
    </AppLayout>
  );
};

export default Flashcards;
