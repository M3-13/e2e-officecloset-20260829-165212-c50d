export default function ImpressumPage() {
  return (
    <section className="page">
      <header className="page-header">
        <h1>Impressum</h1>
        <p className="page-subtitle">
          Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz).
        </p>
      </header>

      <div className="card">
        <h2>Betreiber der Anwendung</h2>
        <p>
          Glamour Garderobe
          <br />
          [Name des Betreibers]
          <br />
          [Straße und Hausnummer]
          <br />
          [PLZ und Ort]
          <br />
          [Land]
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: <a href="mailto:kontakt@example.com">kontakt@example.com</a>
          <br />
          Telefon: [Telefonnummer]
        </p>

        <h2>Verantwortlich für den Inhalt</h2>
        <p>
          Verantwortlich für die Inhalte dieser Anwendung gemäß § 18 Abs. 2 MStV
          ist der oben genannte Betreiber.
        </p>
      </div>

      <div className="card">
        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Anwendung wurden mit größter Sorgfalt erstellt. Für
          die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
          jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß
          § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den
          allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
          Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
          gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
          forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>

        <h2>Haftung für Links</h2>
        <p>
          Diese Anwendung enthält möglicherweise Links zu externen Websites
          Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können
          wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
          Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
          Betreiber der Seiten verantwortlich.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch den Betreiber erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem Urheberrecht. Die Vervielfältigung, Bearbeitung,
          Verbreitung und jede Art der Verwertung außerhalb der Grenzen des
          Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
          Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für
          den privaten, nicht kommerziellen Gebrauch gestattet.
        </p>

        <h2>Streitbeilegung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit. Diese Plattform ist nicht
          Bestandteil dieser Anwendung; wir sind nicht verpflichtet und nicht
          bereit, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </div>
    </section>
  );
}
