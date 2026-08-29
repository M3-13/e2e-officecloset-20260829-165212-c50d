import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <section className="page">
      <header className="page-header">
        <h1>Datenschutzerklärung</h1>
        <p className="page-subtitle">
          Informationen zur Verarbeitung personenbezogener Daten.
        </p>
      </header>

      <div className="card">
        <h2>Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung im Sinne der
          Datenschutz-Grundverordnung (DSGVO) ist der Betreiber der Anwendung
          Glamour Garderobe. Die Kontaktdaten entnehmen Sie bitte dem{" "}
          <Link to="/impressum">Impressum</Link>.
        </p>

        <h2>Allgemeine Hinweise</h2>
        <p>
          Der Schutz Ihrer persönlichen Daten hat für uns einen hohen
          Stellenwert. Wir behandeln Ihre personenbezogenen Daten vertraulich
          und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser
          Datenschutzerklärung.
        </p>
      </div>

      <div className="card">
        <h2>Datenverarbeitung im Einzelnen</h2>

        <h3>Registrierung und Anmeldung (E-Mail-Adresse)</h3>
        <p>
          Zur Erstellung und Nutzung eines Kontos verarbeiten wir Ihre
          E-Mail-Adresse. Sie dient als eindeutiger Benutzername für die
          Anmeldung sowie gegebenenfalls zur Kommunikation mit Ihnen. Die
          Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfüllung).
        </p>

        <h3>Passwort</h3>
        <p>
          Ihr Passwort wird niemals im Klartext gespeichert. Stattdessen wird
          ausschließlich ein kryptografischer Hashwert Ihres Passworts
          gespeichert, der mit einem Algorithmus-Präfix des verwendeten
          Hash-Verfahrens versehen ist. Eine Rückrechnung auf das Klartext-
          Passwort ist aus dem gespeicherten Wert nicht möglich.
        </p>

        <h3>Hochgeladene Bilder</h3>
        <p>
          Wenn Sie Kleidungsstücke mit einem Bild anlegen, wird dieses Bild auf
          unseren Servern gespeichert und ausschließlich zur Anzeige in Ihrer
          persönlichen Garderobe und Ihren Outfits verwendet. Die Bilder sind
          für andere Nutzer nicht sichtbar und werden nicht zu Werbezwecken
          verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfüllung).
        </p>

        <h3>Speicherdauer</h3>
        <p>
          Ihre personenbezogenen Daten werden nur so lange gespeichert, wie dies
          für die Bereitstellung der Anwendung erforderlich ist oder wie Sie Ihr
          Konto bestehen lassen. Nach Löschung Ihres Kontos werden Ihre Daten
          vollständig entfernt.
        </p>
      </div>

      <div className="card">
        <h2>Löschung Ihres Kontos</h2>
        <p>
          Sie können Ihr Konto jederzeit selbst in der Anwendung löschen. Dabei
          werden alle mit Ihrem Konto verbundenen Daten vollständig und
          unwiderruflich gelöscht, einschließlich Ihrer E-Mail-Adresse, Ihres
          Passwort-Hashs, Ihrer Garderobe, Ihrer gespeicherten Outfits sowie
          aller von Ihnen hochgeladenen Bilder. Nach der Löschung sind diese
          Daten nicht mehr abrufbar.
        </p>
      </div>

      <div className="card">
        <h2>Externe Ressourcen und Einwilligung</h2>
        <p>
          Diese Anwendung lädt standardmäßig keine Ressourcen von
          Drittanbietern (wie externe Schriften, Skripte oder Analyse-Tools).
          Sollten externe Ressourcen eingesetzt werden, werden diese erst
          geladen, nachdem Sie hierzu Ihre ausdrückliche Einwilligung erteilt
          haben. Ohne Ihre Einwilligung werden keine Verbindungen zu
          Drittservern hergestellt.
        </p>
      </div>

      <div className="card">
        <h2>Ihre Rechte</h2>
        <p>Im Rahmen der geltenden gesetzlichen Bestimmungen haben Sie das Recht:</p>
        <ul>
          <li>auf Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO),</li>
          <li>auf Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
          <li>auf Löschung Ihrer Daten (Art. 17 DSGVO),</li>
          <li>auf Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
          <li>auf Datenübertragbarkeit (Art. 20 DSGVO) sowie</li>
          <li>auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte genügt eine E-Mail an die im Impressum
          genannte Kontaktadresse. Zudem haben Sie das Recht, sich bei einer
          Datenschutz-Aufsichtsbehörde zu beschweren.
        </p>
      </div>
    </section>
  );
}
