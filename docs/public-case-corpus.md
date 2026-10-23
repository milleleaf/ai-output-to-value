# Public case corpus

Support for which claim a published result can carry lives in [`data/public-case-corpus.yml`](../data/public-case-corpus.yml).

A row is one published result. The population is the population named in that source. The decision is the decision that source is reporting. The row records the claim that wording asserts and the claim the registered evidence can support, with the locator, source version, measure, comparison, cost boundary, and qualification.

A coded row evaluates that written record against the registered source. It is not an audit of the organisation, the measurement, or the people behind the paper. It is not a Claim Gate `PASS`.

## Why a reader session cannot do this job

One session with one person is one observation. Representativeness needs a defined population, a list of who belongs to it, a draw from that list, and a record of who was left out. A role — sponsor, manager, client representative, budget holder — describes a seat. It does not create a sampling frame.

The eight questions remain a way to read a row. They are not an examination that one reader passes on behalf of anyone else.

## Inclusion

A row may enter the corpus only when all of the following are already true:

1. The source is registered under `data/` with a stable id, scope, and limitations.
2. The claim is registered under `data/` with that `source_id`, a `source_version`, a locator, a relevant finding, and a qualification.
3. The row copies that evidence entry. The corpus does not introduce a second wording of the finding.
4. `population` is the registered source scope, copied as written.
5. `measure` and `comparison` are phrases that already appear in the registered scope, finding, or qualification. Where the registered text does not record a comparison or a cost boundary, the field is the sentence `not recorded in the registered source or claim text`.
6. The row is `supported` or `qualified`. Illustrative teaching samples stay in `toolkit/samples/` and are not rows.
7. `supported_claim` is `definition-only` or one of `01-access`, `02-output`, `03-deliverable`, `04-capability`, `05-outcome`, `06-value`. It is not a higher level than `asserted_claim`.
8. An outcome row lists `04-capability` and `06-value` under `does_not_support`. A definition-only row lists `05-outcome` and `06-value` under `does_not_support`.

`definition-only` means the source names a measure or a method and does not report that a result changed.

## What the first rows cover

The first rows are the measured studies already named for release review, plus the DORA metric definition:

- METR's early-2025 developer trial;
- the GitHub Copilot HTTP-server experiment;
- Noy and Zhang's writing experiment;
- Dell'Acqua and colleagues' consulting experiment;
- Brynjolfsson, Li and Raymond's customer-support study;
- DORA's five software-delivery metric definitions.

Each measured-study row supports an Outcome for the measure and population in that source. The registered text does not record the full cost, risk, and alternatives a Value claim requires, so those rows do not support Value. The DORA row records metric definitions. It does not record that a delivery measure changed, and it does not record AI ROI.

## Adding a further public source

Register the source and the claim first, with a locator you have inspected. Then add the row.

Suitable later sources include the Stanford AI Index, the AI Incident Database, the OECD AI Incidents Monitor, and published firm or developer surveys. A survey row codes the claim the publication asserts. A respondent's statement that value was achieved is industry research about what was said. It becomes a supported Value row only when the same source records the measure, the comparison, and the cost boundary.

An incident row can support a reported Operating-capability or harm case for that event. One case does not establish how often the event happens.

## Teaching samples

Fictional `claim.json` records under `toolkit/samples/` show how the gate behaves. They are illustrative. They stay out of this corpus.
