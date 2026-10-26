# Guardian chatbot guardrails

Application-level controls, not an AWS-managed Bedrock Guardrails resource.

- Bedrock selects a structured intent, approved action IDs, at most one approved clarifying question, and an optional candidate ID. For operational intents it cannot supply arbitrary advice. For the medical intent, the model supplies 1–4 validated-format educational points totaling at most 90 words, followed by a general-information notice. Medical factuality is guided by instructions, not guaranteed by the structure validator.
- Server-generated response text is limited to 120 words and five bullets. Model/request metadata is shown separately.
- General medical questions are in scope: medicines, symptoms, conditions, treatment options, and general care recommendations. The former blanket clinical refusal is removed. Personalized prescribing, definitive personal diagnosis, unsupported storage thresholds, medicine-usability certification, and guarantees of FrostGate protection remain restricted.
- Canonical network.json records determine power and stock. Client changes cannot promote an outage site or invent facilities. Client reports can restrict availability.
- Storage candidates require positive requested liters, sufficient reported liters, and a recorded product-specific suitability flag. All remain synthetic, potentially stale, manually reported data; the flag is not external clinical validation.
- Citywide/no-location removes all candidates.
- Facility IDs and action IDs are validated. Malformed, invented, or disallowed output is withheld rather than displayed.
- Common email, phone, date/identifier, credential, and prompt-override patterns are blocked before inference. History and incident fields are checked but are not forwarded to the model. Pattern detection cannot catch every form of personal information or malicious input; the frontend also asks users not to enter sensitive data.
- All operational answers label synthetic data and retain pharmacist approval. The chatbot has no tool for messages, transfers, or hardware activation.
- Scope classification is based on medical relevance rather than requiring the literal word medicine. Unrelated questions receive a medical-scope redirection; adding a medical keyword to an unrelated request does not qualify it. Unclear questions receive at most one approved question.
- No validated manufacturer-document retrieval is connected, so the chatbot does not provide product-specific limits or citations.

Tests: python -m unittest discover -s tests -p test_guardrails.py

Latest guarded local preview: http://127.0.0.1:4183/#find
Older previews on 4180/4181/4182 are not this guarded backend.
