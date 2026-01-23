import Link from "next/link";

// Demo data - later will be fetched from Supabase
const news = [
  {
    id: "1",
    title: "Sezóna 2024/2025 zahájena!",
    excerpt: "Nová sezóna Blatské Hokejové Ligy Amatérů byla slavnostně zahájena. Letos se účastní 6 týmů.",
    date: "2025-01-15",
    image: null,
  },
  {
    id: "2",
    title: "HC Blatná posiluje kádr",
    excerpt: "Loňský vítěz ligy HC Blatná oznámil příchod dvou nových hráčů před nadcházející sezónou.",
    date: "2025-01-10",
    image: null,
  },
  {
    id: "3",
    title: "Nové dresy pro všechny týmy",
    excerpt: "Liga představila nové dresy pro všechny zúčastněné týmy v jednotném designu s individuálními barvami.",
    date: "2025-01-05",
    image: null,
  },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {news.map((item) => (
        <article
          key={item.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Image placeholder */}
          <div className="h-48 bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <svg className="w-16 h-16 text-white/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0z"/>
            </svg>
          </div>

          <div className="p-5">
            <time className="text-sm text-secondary">{formatDate(item.date)}</time>
            <h3 className="text-lg font-semibold text-primary mt-2 mb-2">
              {item.title}
            </h3>
            <p className="text-secondary text-sm line-clamp-2">{item.excerpt}</p>
            <Link
              href={`/novinky/${item.id}`}
              className="inline-flex items-center text-accent hover:text-accent-hover font-medium text-sm mt-4"
            >
              Číst více
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
