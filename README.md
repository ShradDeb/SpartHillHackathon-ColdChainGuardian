# MedRelay Guardian

A single community medicine and pharmacy emergency website combining ColdChain Guardian v3 with MedRelay Editable Source.

## Run

From this directory:

    python3 -m venv .venv
    .venv/bin/pip install -r requirements.txt
    .venv/bin/python server.py

Open http://127.0.0.1:4180/#dashboard. To change ports, set PORT before starting.

## Combined experience

- Overview: community/pharmacy entry points, equipment inventory, cooler counts, illustrative holdover durations, and eligible storage trip.
- Find medicine: ten service areas and ten synthetic pharmacy records from Guardian; four medicine search examples; powered, in-stock results ranked by modeled travel time.
- Storage network: the same shared pharmacy records, addresses and Google Maps links, relative capacity and separately recorded available liters.
- Incident planner: guided incident intake, five response options, citywide no-location contingency with Hayden’s FrostGate, and optional live Bedrock logistics planning.
- Inventory: Mission Community Pharmacy’s three synthetic refrigerated product lines (43 packages), with demo review and volume fields.
- Transfers: partner acceptance, preparation checklist, departure and arrival/handover; all simulated.
- Incident log and JSON export.
- Architecture: explains current local implementation and proposed AWS hosting.
- FrostGate: supplied console preserved as a separate local page with a MedRelay return link. Its hardware controls and AI setup are independent.

Guardian’s React screen behavior and synthetic dataset have been integrated into MedRelay’s lightweight HTML/JS app rather than running two unrelated frontends or two backend ports. The combined backend is Python; the supplied Guardian Node server is replaced by /api/chat on the same origin.

## Shared capacity model

Guardian supplied receiving capacity as percentages. This is not converted into liters. Storage requests require a pharmacist to enter a volume in the Storage network, sufficient reviewed inventory, reported available power, and then simulated partner acceptance. Percentages remain labeled relative capacity. A storage request does not prove product compatibility or viability.

## AWS

Both MedRelay’s /api/plan and Guardian’s /api/chat use the server-side AWS SDK credential chain and Bedrock Converse API. Configure your event-supported AWS profile/session, AWS_REGION, and BEDROCK_MODEL_ID. No live inference is claimed without a successful call. Errors do not fall back to an unlabeled demo answer. Successful results show a model and AWS request ID.

FrostGate’s AI integration remains separate and is not covered by this backend’s configuration. Embedded literal AWS credentials are cleared in the included HTML. Never publish keys in browser code.

## Limits

All inventory, power status, relative capacities, travel times, equipment holdover, and contacts are fictional or modeled. The source inventory uses medicine names as search examples, not validated storage guidance. No live inventory, clinical verification, authenticated audit record, or real messaging is connected. Nearby pharmacy lookup currently opens Google Maps; the in-app Amazon Location API is blocked by organization policy. User records are saved in browser local storage. Maps links require entered addresses. FrostGate opens in simulation and does not establish medication safety. The local server binds to loopback; do not expose it as a production API.

## Tests

Run `node tests/check-combined.cjs` from the project directory for the frontend integration checks. It covers eight screens, the shared ten-site network, powered results, capacity gating, and citywide exclusion. Browser testing verified the finder-to-storage handoff and volume-entry form. Bedrock chat live inference was verified in the local configured session on October 24, 2026. Credentials are not included in this download.

## Inputs

ColdChain Guardian v3 supplied community search, synthetic pharmacy stock/power/area records, modeled distance behavior, and Guardian assistant concept. MedRelay Editable Source supplied pharmacy operations, incident planning, Google Maps handoff, transfer records, and the FrostGate integration.

## Current-location overview

The overview now has a nearest-pharmacy card. Click **Use my current location**, approve the browser permission, then **Find nearby pharmacies in Google Maps**. Google Maps displays the pharmacies, distances and directions; the app does not scrape those results or invent a pharmacy name. Coordinates stay in page memory until the user opens the Google Maps link; they are never stored or sent to Bedrock. Clearing location removes them from page state.

Amazon Location lookup is implemented at `/api/nearest`, but `geo-places:SearchNearby` in `us-east-1` is explicitly denied by this AWS organization’s service control policy. The user selected Google Maps as the fallback. After an administrator permits that action, change `nearbyProvider` in `dist/nearby.js` to `amazon-location`. It requests pharmacy places within 10 km, ranks returned records by straight-line distance, and optionally asks Bedrock to explain only public venue details. Browser geolocation, rather than Bedrock, supplies physical coordinates. No current power, cooling suitability or acceptance is inferred.

Run backend checks with `python -m unittest discover -s tests -p 'test_*.py'` in an environment with requirements installed.

The overview also accepts a typed pharmacy address, city or ZIP code. Find nearby help creates location-specific pharmacy and hospital-pharmacy Google Maps searches, with emergency/FrostGate links. No individual facility or cooling availability is confirmed inside the app.


Guardian AI now uses Nova Pro (`us.amazon.nova-pro-v1:0`) for nearest-pharmacy questions. The server ranks the website’s canonical synthetic records using the selected demo service area (Mission District by default), excludes sites marked without power, and validates the model’s nearest selection against the first ranked record. Mentioning a supported area in the question overrides the selected area. Distances match the website’s modeled distances, not device geolocation. From Mission District: Castro Health Pharmacy, 1.6 miles, 10 minutes. The overview button sends a fresh Bedrock request; it no longer displays the old QuickMed saved example. Storage suitability and acceptance remain unconfirmed.

Privacy follow-up fix: chatbot transcript history is not sent in API requests or forwarded to Bedrock. Privacy checks examine the latest message and incident text, preventing synthetic phone numbers in earlier assistant responses from blocking later questions.
