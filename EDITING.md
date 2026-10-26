# Editing the combined website

- dist/index.html: common shell, branding, and navigation.
- dist/style.css: shared visual design and responsive layouts.
- dist/community.js: Guardian’s dataset, medicine finder, shared-network conversion, receiving-volume entry, and Guardian Bedrock chat UI.
- dist/app.js: pharmacy overview, equipment, inventory, storage/maps, transfer workflows, and local records.
- dist/continuity.js: incident conversation, contingency choices, plan rendering, and architecture.
- dist/frostgate.html: complete editable FrostGate console; separate hardware/AI integration.
- server.py: shared local web server, /api/status, /api/plan, and /api/chat.

Edit with Kiro, VS Code, or any text editor; save and refresh. All source is included, with no build step or Node dependency installation required to run the website. The optional frontend test uses Node. Python dependencies enable live Bedrock when configured.

Neither original supplied project was modified. The combined app uses a new browser-storage key to avoid corrupting earlier demos.

- dist/guardian-widget.js: floating ColdChain Guardian chatbot, transcript, minimize/open controls, and shared Bedrock API requests. Workshop access is sign-in protected; no workshop API or credentials were downloaded.

- dist/roles.js and dist/roles.css: persistent presentation role, blur/inert controls, role-switch overlay; includes FrostGate. This is a visual mode switch, not authenticated authorization.
