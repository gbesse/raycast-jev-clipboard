# Jev Clipboard Router for Raycast

Turn clipboard noise into one explicit next action: **do now**, **schedule**, **archive**, or **review deeply**. The command reads at most 2,000 characters, makes a deterministic local fixture decision, shows the reason, and only replaces the clipboard after a user action.

## Why it can spread

- a two-second, universally relatable workflow;
- visible before/after output that demos cleanly in a GIF;
- four finite routes instead of an unbounded agent prompt;
- local-first `v0.1.0`: no credentials, network request, or background mutation.

## Install for development

```bash
npm install
npm run dev
```

Build and test:

```bash
npm test
npm run build
```

The repository is structured for a future Raycast Store submission. Store publication requires the maintainer’s Raycast account and review workflow.

MIT licensed. Contributions are welcome.

## Lossless routed output / Sortie sans perte / Salida sin pérdidas

EN: The 2,000-character preview no longer determines copied output. Routing preserves the complete original clipboard text, including whitespace, while classification remains a bounded offline fixture. Replace Clipboard checks the current text against the reviewed snapshot and refuses a changed clipboard. Copy Routed Text still copies the reviewed snapshot explicitly. The OS can change clipboard contents between checking and writing; this is no atomic clipboard lock. Raycast host behavior remains unverified outside pure-core tests and extension build.

FR : L’aperçu de 2 000 caractères ne détermine plus la sortie copiée. Le routage conserve le texte original complet, espaces inclus ; la classification reste une fixture locale bornée. Remplacer vérifie le texte courant contre l’instantané et refuse un presse-papiers modifié. Copier copie explicitement l’instantané revu. Le système peut modifier le presse-papiers entre lecture et écriture : pas de verrou atomique. Le comportement hôte Raycast reste non vérifié hors tests du cœur et build.

ES: La vista de 2 000 caracteres ya no determina la salida copiada. Conserva texto original completo, incluidos espacios; clasificación sigue siendo fixture local limitada. Reemplazar compara contenido actual con instantánea y rechaza cambios. Copiar copia explícitamente la instantánea revisada. El sistema puede cambiar contenido entre comprobar y escribir: no es bloqueo atómico. Comportamiento Raycast sin verificar fuera de pruebas del núcleo y build.


FR : La limite de prévisualisation reste 2 000 unités UTF-16, mais peut être réduite d’une unité pour ne pas couper une paire de substitution Unicode valide. Le texte complet exporté reste inchangé. Les quatre routes exportées sont immuables. Tests hors ligne ; aucune lecture ou écriture du presse-papiers réel ni exécution de l’hôte Raycast.

EN: Preview remains capped at 2,000 UTF16 code units but may use one fewer to avoid splitting a valid Unicode surrogate pair. Full exported text remains unchanged. The four exported route entries are immutable. Offline tests; no real clipboard reads/writes or Raycast host execution.

ES: La vista previa mantiene un máximo de 2.000 unidades UTF16, con una menos si evita cortar un par Unicode válido. El texto exportado completo no cambia. Las cuatro rutas exportadas son inmutables. Pruebas sin conexión; sin leer/escribir portapapeles real ni ejecutar Raycast.
