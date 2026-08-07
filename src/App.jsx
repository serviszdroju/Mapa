import { useMemo, useState } from "react";
import {
  PLACES,
  QUEUE_TEMPLATE,
  REGIONS,
  STATUS_META,
  countByStatus,
  getPlacePriority,
  matchesFilters,
} from "./data.js";
import { createPlaceFromForm, emptyForm, queueSummary } from "./serviceState.js";

const logoUrl = `${import.meta.env.BASE_URL}assets/fzz-logo.png`;
const mapFallbackUrl = `${import.meta.env.BASE_URL}assets/map-fallback.jpg`;

function StatusDot({ status, ring = false }) {
  const meta = STATUS_META[status] ?? STATUS_META.ok;
  return <span className={ring ? "status-ring" : "status-dot"} style={{ "--dot": meta.color }} />;
}

function AppHeader({ queue, onSync, onInstall }) {
  const summary = queueSummary(queue);
  return (
    <header className="topbar">
      <div className="brand">
        <img src={logoUrl} alt="FZZ" />
        <div>
          <h1>Terénní Operační Mapa</h1>
          <p>Servisní mapa záložních zdrojů</p>
        </div>
      </div>

      <div className="system-status" aria-label="Stav aplikace">
        <button className="status-pill" type="button" onClick={onSync}>
          <span className="pulse" />
          <strong>Offline režim</strong>
          <span>{summary.total ? `${summary.total} čeká na sync` : "Data k dispozici offline"}</span>
        </button>
        <button className="status-pill" type="button" onClick={onInstall}>
          <span className="cloud-mark">⌁</span>
          <strong>Poslední synchronizace</strong>
          <span>04.08.2026 08:42</span>
        </button>
      </div>

      <div className="account">
        <button className="google-badge" type="button" aria-label="Přihlášený technik">
          <span>G</span>
          <div>
            <strong>Petr Novák</strong>
            <small>ASTIP - Technik</small>
          </div>
        </button>
        <button className="icon-button has-badge" type="button" aria-label="Upozornění">!</button>
        <button className="icon-button" type="button" aria-label="Nápověda">?</button>
      </div>
    </header>
  );
}

function FiltersPanel({
  filters,
  setFilters,
  counts,
  shown,
  onAdd,
  onClear,
  onDownload,
  onFit,
  onHistory,
}) {
  return (
    <aside className="filters-panel">
      <div className="panel-heading">
        <h2>Vyhledávání a filtry</h2>
        <button className="collapse-button" type="button" aria-label="Sbalit filtry">«</button>
      </div>

      <label className="field">
        <span>Hledat</span>
        <input
          value={filters.query}
          onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
          placeholder="Hledat místo, adresu, výrobní číslo, kontakt..."
        />
      </label>

      <div className="inline-hint">
        <span className="mini-link">Hledá bez diakritiky</span>
        <span className="info">i</span>
      </div>

      <label className="field">
        <span>Stav</span>
        <select
          value={filters.status}
          onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
        >
          <option value="all">Vše</option>
          {Object.entries(STATUS_META).map(([key, status]) => (
            <option key={key} value={key}>{status.label}</option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Kraj</span>
        <select
          value={filters.region}
          onChange={(event) => setFilters((current) => ({ ...current, region: event.target.value }))}
        >
          <option value="all">Vše</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </label>

      <div className="field">
        <span>Hlídáme termín sami</span>
        <div className="segmented" role="group" aria-label="Hlídáme termín sami">
          {[
            ["all", "Vše"],
            ["yes", "Ano"],
            ["no", "Ne"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={filters.watched === value ? "active" : ""}
              type="button"
              onClick={() => setFilters((current) => ({ ...current, watched: value }))}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button className="link-button" type="button">Další filtry ›</button>

      <div className="panel-divider" />

      <div className="count-row">
        <div>
          <strong>Zobrazeno míst: {shown}</strong>
          <span>z celkem 256</span>
        </div>
        <button className="refresh" type="button" onClick={onFit} aria-label="Přiblížit na body">↻</button>
      </div>

      <div className="legend">
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <div key={key} className="legend-row">
            <StatusDot status={key} />
            <span>{meta.legend}</span>
            <strong>{counts[key] ?? 0}</strong>
          </div>
        ))}
        <div className="legend-row">
          <StatusDot status="ok" ring />
          <span>Hlídáme sami</span>
          <strong>{counts.watched ?? 0}</strong>
        </div>
      </div>

      <div className="panel-spacer" />

      <div className="filter-actions">
        <button className="secondary wide" type="button" onClick={onFit}>Přiblížit na body</button>
        <button className="secondary wide" type="button" onClick={onDownload}>Stáhnout mapové podklady</button>
        <button className="primary wide" type="button" onClick={onAdd}>Přidat nové místo</button>
        <button className="secondary wide" type="button" onClick={onHistory}>Historie protokolů</button>
        <button className="secondary wide" type="button" onClick={onClear}>Vyčistit filtry</button>
      </div>
    </aside>
  );
}

function MapCanvas({ places, selectedPlaceId, detailOpen, onSelect, onFullscreen, onOpenDetail }) {
  return (
    <section className="map-shell" style={{ "--map-fallback": `url(${mapFallbackUrl})` }} aria-label="Mapa servisních míst">
      <iframe
        title="OpenStreetMap mapa České republiky a Slovenska"
        src="https://www.openstreetmap.org/export/embed.html?bbox=10.5%2C47.5%2C21.2%2C52.2&layer=mapnik"
        loading="lazy"
      />
      <div className="map-overlay" aria-hidden="false">
        <div className="map-controls">
          <button type="button" aria-label="Přiblížit">+</button>
          <button type="button" aria-label="Oddálit">−</button>
          <button type="button" aria-label="Vrstvy">▦</button>
        </div>
        <button className="fullscreen-control" type="button" onClick={onFullscreen}>Celá mapa</button>
        {!detailOpen && (
          <button className="open-detail-fab" type="button" onClick={onOpenDetail}>Otevřít detail</button>
        )}
        {places.map((place) => {
          const source = getPlacePriority(place);
          const selected = selectedPlaceId === place.placeId;
          return (
            <button
              key={place.placeId}
              className={`map-marker ${selected ? "selected" : ""} ${place.groupCount > 1 ? "cluster" : ""}`}
              style={{
                "--x": `${place.x}%`,
                "--y": `${place.y}%`,
                "--color": STATUS_META[source.status].color,
              }}
              type="button"
              onClick={() => onSelect(place.placeId)}
              title={`${place.name}: ${STATUS_META[source.status].label}`}
            >
              {place.groupCount > 1 ? place.groupCount : ""}
              {source.watched && <span className="watch-ring" />}
            </button>
          );
        })}
        <div className="scale">50 km</div>
        <div className="osm-credit">Leaflet | © OpenStreetMap contributors</div>
      </div>
    </section>
  );
}

function DetailDrawer({
  place,
  sourceIndex,
  setSourceIndex,
  onClose,
  onProtocol,
  onPhotos,
  onDocuments,
  onEdit,
  onShowMap,
  onStateAction,
}) {
  const source = place.sources[sourceIndex] ?? place.sources[0];

  return (
    <aside className="detail-drawer">
      <div className="detail-title-row">
        <div>
          <h2>{place.name}</h2>
          <p>{place.address}</p>
        </div>
        <button className="close-button" type="button" onClick={onClose}>×</button>
      </div>

      <div className="source-row">
        <span>Zdroj</span>
        <button type="button" onClick={() => setSourceIndex(Math.max(0, sourceIndex - 1))}>‹</button>
        <strong>{sourceIndex + 1} / {place.sources.length}</strong>
        <button type="button" onClick={() => setSourceIndex(Math.min(place.sources.length - 1, sourceIndex + 1))}>›</button>
      </div>

      <div className="source-select-row">
        <select
          value={sourceIndex}
          onChange={(event) => setSourceIndex(Number(event.target.value))}
        >
          {place.sources.map((item, index) => (
            <option key={item.sourceId} value={index}>{item.name}</option>
          ))}
        </select>
        <button className="square-button" type="button" title="Zkopírovat zdroj">⧉</button>
        <button className="square-button" type="button" title="Přidat další zdroj">+</button>
      </div>

      <div className="date-grid">
        <div className="date-card next">
          <span>Příští plánovaná kontrola</span>
          <strong>{source.nextCheck}</strong>
          <small>{source.days < 0 ? `${Math.abs(source.days)} dní po termínu` : `za ${source.days} dní`}</small>
        </div>
        <div className="date-card last">
          <span>Poslední proběhlá kontrola</span>
          <strong>{source.lastCheck}</strong>
          <small>před 134 dny</small>
        </div>
      </div>

      <dl className="detail-list">
        <div><dt>Název</dt><dd>{source.device}</dd></div>
        <div><dt>Adresa / umístění</dt><dd>{place.address}</dd></div>
        <div><dt>Adresa_GPS</dt><dd>{place.gps}</dd></div>
        <div><dt>Kraj</dt><dd>{place.region}</dd></div>
        <div><dt>Popis zdroje</dt><dd>{source.description}</dd></div>
        <div><dt>Výrobní číslo</dt><dd>{source.serial}</dd></div>
        <div><dt>Kontakt</dt><dd><a href={`tel:${source.contact.replace(/\D/g, "")}`}>{source.contact}</a></dd></div>
        <div><dt>Umístění zdroje</dt><dd>{source.sourceLocation}</dd></div>
        <div><dt>Poznámky</dt><dd>{source.note}</dd></div>
        <div><dt>Perioda kontrol</dt><dd>{source.period}</dd></div>
        <div><dt>Hlídáme sami termín</dt><dd><StatusDot status="ok" ring /> {source.watched ? "Ano" : "Ne"}</dd></div>
        <div><dt>Smlouva</dt><dd><a href="#smlouva">{source.contract}</a></dd></div>
        <div><dt>Cena FZ</dt><dd>{source.price}</dd></div>
        <div><dt>Faktura na</dt><dd>{source.invoiceTo}</dd></div>
        {source.important && <div className="important"><dt>Důležité poznámky</dt><dd>{source.important}</dd></div>}
      </dl>

      <div className="drawer-actions">
        <button className="primary wide" type="button" onClick={onProtocol}>Zahájit protokol servisního zásahu</button>
        <button className="secondary" type="button" onClick={() => onStateAction("Kontrola objednána")}>Kontrola objednána</button>
        <button className="secondary" type="button" onClick={() => onStateAction("Objednaná oprava")}>Objednaná oprava</button>
        <button className="secondary" type="button" onClick={() => onStateAction("Stop Stav")}>Stop Stav</button>
        <button className="secondary" type="button" onClick={onPhotos}>Fotky (2)</button>
        <button className="secondary" type="button" onClick={onDocuments}>Dokumenty (1)</button>
        <button className="secondary" type="button" onClick={onEdit}>Upravit údaje</button>
        <button className="secondary wide" type="button" onClick={onShowMap}>Zobrazit na mapě</button>
      </div>

      <div className="history-strip">
        <h3>Poslední záznamy</h3>
        {place.history.slice(0, 2).map((item) => (
          <p key={`${item.date}-${item.title}`}><strong>{item.date}</strong> {item.title} · {item.technician}</p>
        ))}
      </div>

      <footer className="drawer-footer">
        <span>Vytvořeno: {place.created}</span>
        <span>Upraveno: {place.updated} (Petr Novák)</span>
      </footer>
    </aside>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <section className="modal">
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose}>×</button>
        </header>
        {children}
      </section>
    </div>
  );
}

function AddPlaceModal({ onClose, onSave, form, setForm }) {
  return (
    <Modal title="Přidat nové místo" onClose={onClose}>
      <form className="form-grid" onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}>
        <label>Název<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <label>Adresa / umístění<input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required /></label>
        <label>Kraj<select value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })}>{REGIONS.map((region) => <option key={region}>{region}</option>)}</select></label>
        <label>Popis zdroje<input value={form.device} onChange={(event) => setForm({ ...form, device: event.target.value })} /></label>
        <label>Výrobní číslo<input value={form.serial} onChange={(event) => setForm({ ...form, serial: event.target.value })} /></label>
        <label>Kontakt<input value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} /></label>
        <label>Perioda kontrol<select value={form.period} onChange={(event) => setForm({ ...form, period: event.target.value })}><option>6 měsíců</option><option>12 měsíců</option></select></label>
        <label>Hlídáme sami termín<select value={form.watched} onChange={(event) => setForm({ ...form, watched: event.target.value })}><option value="ano">Ano</option><option value="ne">Ne</option></select></label>
        <p className="form-note">GPS se v produkci dopočítá z adresy nebo ruční volbou bodu na mapě. Tady se založí bezpečný lokální záznam pro nový web.</p>
        <div className="modal-actions">
          <button className="secondary" type="button" onClick={onClose}>Zrušit</button>
          <button className="primary" type="submit">Uložit a otevřít detail</button>
        </div>
      </form>
    </Modal>
  );
}

function ProtocolModal({ place, source, onClose, onSave }) {
  const [reset, setReset] = useState("");
  const [note, setNote] = useState("");
  const disabled = !reset;

  return (
    <Modal title="Protokol / potvrzení o provedené zkoušce" onClose={onClose}>
      <div className="protocol-summary">
        <strong>{place.name}</strong>
        <span>{place.address}</span>
        <span>{source.name} · {source.serial} · {source.period}</span>
      </div>
      <div className="protocol-grid">
        <label>Plomby<select><option>V pořádku</option><option>Poškozené</option><option>Není použito</option></select></label>
        <label>Baterie<select><option>V pořádku</option><option>Doporučena výměna</option><option>Výměna provedena</option></select></label>
        <label>AC měření<input defaultValue="230 V / 50 Hz" /></label>
        <label>DC měření<input defaultValue="54,2 V" /></label>
        <label>Reset diagnostiky<select value={reset} onChange={(event) => setReset(event.target.value)} required><option value="">Vybrat povinnou volbu</option><option>Proveden</option><option>Není dostupné</option><option>Nevyžadováno</option></select></label>
        <label>OOPP<select><option>Použito</option><option>Nevyžadováno</option></select></label>
      </div>
      <label className="textarea-label">Poznámka do protokolu<textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Zjištěné závady, doporučení, dohoda s provozovatelem..." /></label>
      <div className="signature-box">Podpis objednavatele</div>
      <div className="modal-actions">
        <button className="secondary" type="button" onClick={onClose}>Zavřít</button>
        <button className="primary" type="button" disabled={disabled} onClick={() => onSave(note)}>Uložit protokol</button>
      </div>
      {disabled && <p className="form-warning">Pro uložení je povinný výběr resetu diagnostiky.</p>}
    </Modal>
  );
}

function PhotosModal({ place, onClose, onSave }) {
  const [files, setFiles] = useState([]);
  return (
    <Modal title="Fotografie bodu" onClose={onClose}>
      <p className="form-note">{place.name}. Fotografie se v produkci optimalizují, uloží do IndexedDB a synchronizují po návratu online.</p>
      <label className="drop-zone">
        <span>Vybrat fotky z galerie nebo fotoaparátu</span>
        <input type="file" multiple accept="image/*" onChange={(event) => setFiles(Array.from(event.target.files || []))} />
      </label>
      <div className="file-list">
        {files.length ? files.map((file) => <span key={file.name}>{file.name}</span>) : <span>Žádné nové fotografie nevybrány</span>}
      </div>
      <div className="modal-actions">
        <button className="secondary" type="button" onClick={onClose}>Zavřít</button>
        <button className="primary" type="button" onClick={() => onSave(files.length)}>Uložit fotografie</button>
      </div>
    </Modal>
  );
}

function SimpleModal({ title, text, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="form-note">{text}</p>
      <div className="modal-actions">
        <button className="primary" type="button" onClick={onClose}>Rozumím</button>
      </div>
    </Modal>
  );
}

export function App() {
  const [manualPlaces, setManualPlaces] = useState([]);
  const [filters, setFilters] = useState({ query: "", status: "all", region: "all", watched: "all" });
  const [selectedPlaceId, setSelectedPlaceId] = useState("pce-astip");
  const [sourceIndex, setSourceIndex] = useState(0);
  const [detailOpen, setDetailOpen] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState("");
  const [queue, setQueue] = useState(QUEUE_TEMPLATE);
  const [form, setForm] = useState(emptyForm);

  const allPlaces = useMemo(() => [...PLACES, ...manualPlaces], [manualPlaces]);
  const visiblePlaces = useMemo(
    () => allPlaces.filter((place) => matchesFilters(place, filters)),
    [allPlaces, filters],
  );
  const counts = useMemo(() => countByStatus(allPlaces), [allPlaces]);
  const selectedPlace = allPlaces.find((place) => place.placeId === selectedPlaceId) ?? visiblePlaces[0] ?? allPlaces[0];
  const selectedSource = selectedPlace?.sources[sourceIndex] ?? selectedPlace?.sources[0];

  function selectPlace(placeId) {
    setSelectedPlaceId(placeId);
    setSourceIndex(0);
    setDetailOpen(true);
    setToast("Detail místa otevřen z mapy.");
  }

  function resetFilters() {
    setFilters({ query: "", status: "all", region: "all", watched: "all" });
    setToast("Filtry vyčištěny. Poloha mapy a detail zůstávají zachované.");
  }

  function savePlace() {
    const created = createPlaceFromForm(form, manualPlaces.length);
    setManualPlaces((current) => [...current, created]);
    setSelectedPlaceId(created.placeId);
    setSourceIndex(0);
    setDetailOpen(true);
    setQueue((current) => [{ id: `q-${Date.now()}`, type: "misto", label: created.name, state: "pending" }, ...current]);
    setForm(emptyForm);
    setModal(null);
    setToast("Nové místo je uložené lokálně a čeká na synchronizaci.");
  }

  function saveProtocol(note) {
    setQueue((current) => [{ id: `q-${Date.now()}`, type: "protokol", label: `Protokol ${selectedSource.name}`, state: "pending" }, ...current]);
    setModal(null);
    setToast(note ? "Protokol uložen do offline fronty včetně poznámky." : "Protokol uložen do offline fronty.");
  }

  function savePhotos(count) {
    if (count) {
      setQueue((current) => [{ id: `q-${Date.now()}`, type: "foto", label: `${count} fotografií: ${selectedPlace.name}`, state: "pending" }, ...current]);
      setToast(`${count} fotografií připraveno k synchronizaci.`);
    } else {
      setToast("Fotogalerie otevřená bez nových souborů.");
    }
    setModal(null);
  }

  function syncNow() {
    setQueue([]);
    setToast("Synchronizace spuštěna. Fronta je v prototypu vyčištěná.");
  }

  return (
    <main className="app-shell">
      <AppHeader
        queue={queue}
        onSync={syncNow}
        onInstall={() => setToast("Instalace PWA je připravená přes manifest a service worker.")}
      />

      <section className="workspace">
        <FiltersPanel
          filters={filters}
          setFilters={setFilters}
          counts={counts}
          shown={visiblePlaces.length}
          onAdd={() => setModal("add")}
          onClear={resetFilters}
          onDownload={() => setToast("Stažení mapových podkladů je připravené pro offline cache vybraného území.")}
          onFit={() => setToast(`Mapa přiblížena na ${visiblePlaces.length} zobrazených míst.`)}
          onHistory={() => setModal("history")}
        />

        <MapCanvas
          places={visiblePlaces}
          selectedPlaceId={selectedPlace?.placeId}
          detailOpen={detailOpen}
          onSelect={selectPlace}
          onFullscreen={() => setToast("Režim celé mapy je připravený pro mobilní zobrazení.")}
          onOpenDetail={() => {
            setDetailOpen(true);
            setToast("Detail vybraného místa je znovu otevřený.");
          }}
        />

        {detailOpen && selectedPlace && selectedSource && (
          <DetailDrawer
            place={selectedPlace}
            sourceIndex={Math.min(sourceIndex, selectedPlace.sources.length - 1)}
            setSourceIndex={setSourceIndex}
            onClose={() => {
              setDetailOpen(false);
              setToast("Detail zavřený. Z mapy ho znovu otevřete kliknutím na bod.");
            }}
            onProtocol={() => setModal("protocol")}
            onPhotos={() => setModal("photos")}
            onDocuments={() => setModal("documents")}
            onEdit={() => setModal("edit")}
            onShowMap={() => setToast("Bod je zvýrazněný na mapě.")}
            onStateAction={(label) => setToast(`${label}: změna se zapíše jako samostatný stav zdroje.`)}
          />
        )}
      </section>

      {toast && (
        <button className="toast" type="button" onClick={() => setToast("")}>{toast}</button>
      )}

      {modal === "add" && (
        <AddPlaceModal form={form} setForm={setForm} onClose={() => setModal(null)} onSave={savePlace} />
      )}
      {modal === "protocol" && selectedPlace && selectedSource && (
        <ProtocolModal place={selectedPlace} source={selectedSource} onClose={() => setModal(null)} onSave={saveProtocol} />
      )}
      {modal === "photos" && selectedPlace && (
        <PhotosModal place={selectedPlace} onClose={() => setModal(null)} onSave={savePhotos} />
      )}
      {modal === "documents" && (
        <SimpleModal
          title="Doklad provozuschopnosti"
          text="Doklad funkčního stavu i Stop Stav je připravený jako lazy modul. Produkční napojení doplní schválenou RTF/Word šablonu, podpis, vodoznak a serverové odeslání e-mailem."
          onClose={() => setModal(null)}
        />
      )}
      {modal === "edit" && (
        <SimpleModal
          title="Upravit data"
          text="Editace bude zapisovat pouze vybraný zdroj nebo sdílené údaje místa podle placeId/sourceId. Tento frontend už odděluje společná a technická pole."
          onClose={() => setModal(null)}
        />
      )}
      {modal === "history" && (
        <SimpleModal
          title="Historie protokolů"
          text="Hlavní historie je připravená pro oprávněné role. V produkci bude načtená až po kliknutí a stránkovaná podle zdroje, aby nezatěžovala start mapy."
          onClose={() => setModal(null)}
        />
      )}
    </main>
  );
}
