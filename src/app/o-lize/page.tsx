import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-4">O lize BHLA</h1>
          <p className="text-xl text-secondary max-w-2xl mx-auto italic">
            &ldquo;Je to šílený, ale nemůžu bez toho být&rdquo;
          </p>
        </div>

        {/* What is BHLA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Co je BHLA?</h2>
          <p className="text-secondary leading-relaxed mb-4">
            Blatská Hokejová Liga Amatérů (BHLA) je amatérská hokejová soutěž pro nadšence ledního hokeje
            z Blatné a širokého okolí. Liga vznikla z lásky k hokeji a touhy hrát tento krásný sport
            bez ohledu na věk či výkonnostní úroveň.
          </p>
          <p className="text-secondary leading-relaxed">
            BHLA sdružuje hráče, kteří milují hokej a chtějí si zahrát v přátelské, ale zároveň
            soutěživé atmosféře. Naším cílem je umožnit každému, kdo má chuť, aby si zahrál hokej
            na dobré úrovni.
          </p>
        </div>

        {/* History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Historie ligy</h2>
          <div className="space-y-4 text-secondary leading-relaxed">
            <p>
              BHLA byla založena v roce 2008 skupinou hokejových nadšenců, kteří se rozhodli vytvořit
              pravidelnou soutěž pro amatérské hráče. Od té doby liga nepřetržitě funguje a každoročně
              přináší napínavé zápasy a skvělou atmosféru.
            </p>
            <p>
              Za dobu své existence liga prošla mnoha změnami - měnily se týmy, hráči přicházeli a
              odcházeli, ale jedno zůstalo stejné: vášeň pro hokej a přátelství mezi hráči.
            </p>
            <p>
              V archivu najdete kompletní statistiky od sezóny 2008/09 až po současnost, včetně
              kanadského bodování, střelců a brankářů.
            </p>
          </div>
        </div>

        {/* How to Join */}
        <div className="bg-accent/10 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Jak se přidat?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-primary mb-2">Kontaktuj nás</h3>
              <p className="text-secondary text-sm">
                Napiš nám přes kontaktní formulář nebo přímo na email. Řekni nám o sobě a svých
                hokejových zkušenostech.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-primary mb-2">Přijď na trénink</h3>
              <p className="text-secondary text-sm">
                Domluvíme se na termínu, kdy můžeš přijít a vyzkoušet si, jak to u nás chodí.
                Žádné závazky, jen hokej.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-primary mb-2">Připoj se k týmu</h3>
              <p className="text-secondary text-sm">
                Pokud ti to sedne, najdeš si tým a můžeš začít hrát pravidelně v naší lize.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/kontakt"
              className="inline-block bg-accent hover:bg-accent-hover text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Chci se přidat
            </Link>
          </div>
        </div>

        {/* Format */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Formát soutěže</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-primary mb-2">Základní část</h3>
              <ul className="text-secondary space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Každý s každým (dvoukolově)
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Zápasy o víkendech
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Hraje se v Soběslavi a Veselí
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Bodování</h3>
              <ul className="text-secondary space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Výhra: 3 body
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Výhra v prodloužení/nájezdech: 2 body
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Prohra v prodloužení/nájezdech: 1 bod
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Prohra: 0 bodů
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-primary mb-6">Časté otázky</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-primary mb-2">Musím mít vlastní výstroj?</h3>
              <p className="text-secondary">
                Ano, každý hráč si nosí vlastní hokejovou výstroj včetně bruslí, helmy a holí.
                Pokud něco nemáš, můžeme ti pomoct sehnat nebo půjčit.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Kolik stojí účast v lize?</h3>
              <p className="text-secondary">
                Účastnický poplatek se liší podle sezóny a pokrývá náklady na led a organizaci.
                Konkrétní částku ti sdělíme při přihlášení.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Jaká je věková hranice?</h3>
              <p className="text-secondary">
                Liga je otevřená hráčům od 18 let. Horní věková hranice není - hrají u nás
                hráči různého věku, od dvacátníků po padesátníky.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Co když neumím moc bruslit?</h3>
              <p className="text-secondary">
                Základy bruslení a ovládání puku bys měl zvládat, ale nemusíš být profík.
                Důležité je nadšení a chuť se zlepšovat. Přijď se podívat a uvidíš sám.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
