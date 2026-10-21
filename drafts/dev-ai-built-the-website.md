---
title: "AI Built the Website. What Can We Actually Claim Is Finished?"
published: false
tags: ai, webdev, programming, productivity
---

Imagine an AI agent generates a company website.

The pages look convincing. Navigation works. The copy is polished. There is a contact form, and when you press **Submit**, a success message appears.

What has actually been completed?

That question is becoming more important because AI can make visible completeness arrive very early. A project that once looked obviously unfinished can now acquire a professional interface, plausible business logic, database code, deployment configuration, documentation, and presentation material in a short time.

That is real progress. It can also make different claims look more similar than they really are.

The useful question is not **“Did AI build it?”**

It is:

> **What has the result actually been shown to do?**

## A working interface and a working business process are different claims

Take the contact form.

A browser test might establish that:

- the fields accept input;
- validation runs;
- the button responds;
- a success message appears.

That is evidence that the interface works.

It does **not**, by itself, establish that the enquiry reached the intended mailbox, CRM, ticket queue, database, or business process.

Both versions can be useful.

A visual prototype may only need the first version. A production company website may need the second.

The mistake is not stopping at a prototype. The mistake is silently changing the claim from **“the interaction is demonstrated”** to **“the business workflow is complete.”**

## I find it useful to separate three kinds of capability

### 1. Tool capability

Can the AI produce the artefact or perform the task?

For modern agents, this can be surprisingly broad: application code, reports, presentations, integrations, tests, deployments, customer responses, data analysis, and more.

### 2. Job substance

Does the result contain what this particular job actually requires?

That might include real business rules, the correct environment, actual integrations, client-specific constraints, data, security requirements, acceptance criteria, or operating assumptions.

An AI system can contribute to this substance too. The point is not that a human must supply it. The point is that the substance needs to be **established rather than inferred from how finished the output looks**.

### 3. Delivery capability

Can the organisation repeatedly verify, operate, support, correct, and stand behind the result?

A successful generation is evidence of generation capability. It is not automatically evidence of ongoing delivery capability.

Again, that does not mean more people must be added to the process. Evaluation and operation can be human, AI, automated, or hybrid. What matters is whether the required capability exists.

## “Finished” depends on the claim you are making

These statements sound similar, but they require different evidence:

1. **We have a direction.**
2. **We have a convincing prototype.**
3. **We implemented the required workflow.**
4. **We have a deliverable that meets the acceptance criteria.**
5. **We have a service we can operate and support.**

Evidence for statement 2 does not automatically support statement 5.

But the reverse mistake is possible too: a team can keep adding engineering after the result is already sufficient for its intended use.

Suppose an internal team needs a small one-off tool to transform a known CSV file into another format. The input is controlled, the output can be checked deterministically, no sensitive data leaves the environment, and nobody is promising long-term support.

If an AI-generated tool passes those checks, **it may already be finished enough**.

Adding a database, account system, observability platform, support process, and extensive architecture would not make the decision more responsible. It might simply add cost.

The standard should therefore be proportional to the intended use.

> **Some generated results are sufficient. Some are not. The evidence and consequence determine which claim you can make.**

## Human review is not the definition of verification

Another easy shortcut is to say: “AI can generate it, but a human must provide the judgement.”

I do not think that is a reliable rule.

Humans make good and bad decisions. AI systems make good and bad decisions. Automated checks can outperform either one for some precisely defined conditions.

For example:

- a schema validator may be the best check that a JSON response has the required structure;
- a test suite may be the best check that a known behaviour still works;
- a specialist may be needed where contextual interpretation matters;
- an AI evaluator may be useful for a large set of qualitative cases;
- a named person may need to approve something because they hold the legal or organisational authority to do so.

Those are different reasons.

**Judgement, authority, and accountability should not be collapsed into one thing.**

The question is not “where do we insert a human?” It is “what assurance is appropriate for this consequence?”

## Count the whole job

AI can reduce generation time dramatically, but generation is not always the whole unit of work.

The complete workflow may also contain:

- specification and context preparation;
- verification;
- correction and retries;
- integration;
- deployment;
- failure handling;
- support and maintenance.

Sometimes AI reduces the whole total. Sometimes it moves work from drafting to checking. Sometimes the generated result is good enough that very little additional work remains.

So instead of asking only:

> “How long did the AI take?”

I prefer:

> **“What did the complete acceptable outcome cost us?”**

That also helps with business claims. Faster output can create capacity without immediately creating cash savings. A cheap API call can support a profitable service, or an expensive model can still be economical if the outcome is valuable enough. The relevant unit is the whole delivered outcome, not the model call in isolation.

## Five questions I would ask before calling an AI-built result finished

1. **What exactly has been demonstrated?**
2. **What did the system know from supplied requirements, and what did it have to infer?**
3. **What counts as acceptable for the intended use?**
4. **What remains in verification, integration, operation, or support?**
5. **What evidence would justify the next decision?**

The last question matters because the answer may be **“nothing more—ship it.”**

Responsible use of AI should not mean inventing extra process whenever AI was involved. It should mean matching the claim and the assurance to the actual job.

AI is making production cheaper and visible completeness faster. That is useful.

It also means we need to become more precise about what “done” means.

---

This article is part of **[AI Output to Value](https://milleleaf.github.io/ai-output-to-value/)**, an [AlreadyOpen](https://github.com/milleleaf) project exploring AI-assisted work, evidence, accountability, and business value. The longer guide keeps claim-level evidence and review status visible so the framework can be challenged and corrected.

**AI assistance disclosure:** AI tools were used during research, drafting, restructuring, and review of this article. I reviewed the argument and am responsible for the published version. When publishing on DEV, I will also select DEV's **AI-Assisted** disclosure setting.
