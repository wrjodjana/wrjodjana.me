---
title: Does the npm registry stop an agent from installing the wrong package?
date: 2026-08-25
---

# Hypothesis

While researching how agents decide which package to install, I found another issue which was that agents would install packages from memory. However, this could be wrong in three different ways:

- It does not exist on `npm`
- It exists but the package is deprecated
- It is the old name of a package that moved

In a general sense, agents are only able to pick from what they can see. A shelf is any source that can put a package name in front of the agent, and the npm registry is one shelf. So my question is: with purely just memory, **how often does the agent write a wrong name?** My hypothesis is that opening the registry shelf brings that number down, because the agent can check a name against the registry before it installs it.

# Setup

**Independent Variable:** Agent's network egress, which is either just the model API or both the model API and `registry.npmjs.org`.

**Dependent Variable:** Wrong-name rate, which is out of all trials, how many times the first package name the agent tried to install was wrong. The first name means the first one passed to `npm install` in a Bash call or the first one added to `package.json`, whichever comes first in the transcript.

**Constant Variable(s):**

- AI model, `claude-opus-5`, since the model is the memory under test
- Docker image pinned by digest, with `node` v22.23.2 and `npm` 10.9.8
- The agent, Claude Code 2.1.241, with auto-updates, telemetry and error reporting turned off
- `WebSearch` and `WebFetch` turned off in every arm
- A new container for each run, hence no npm cache, no `node_modules` and no session history
- Same starting app with no `CLAUDE.md` or `AGENTS.md` files
- `TZ=UTC`, and npm fund, audit and update-notifier off

These are **EXTREMELY** important, because they make sure the memory arms really cannot see the registry. A fresh container means nothing from an earlier install can leak "knowledge" into the next one. `WebSearch` and `WebFetch`, the two tools Claude Code uses to search and read the web, already run on the model's side rather than inside the container, so the firewall can never see them, and leaving them on would mean a memory arm is not really memory.

Real users do not all type the same prompt or start from the same app, so instead of removing that variation, I decided on balancing it, which means every arm sees the same prompts and the same starting app the same number of times.

# Experiment

**An arm is one version of the experiment**, and the only thing that changes between different arms is the network. We add a firewall rule (`iptables allow-list`) inside the container that lists the hosts the agent has outbound access to and drops everything else.

| Arm      | Things reached                     |
| -------- | ---------------------------------- |
| Memory A | Only model API                     |
| Memory B | Only model API                     |
| Registry | Model API and `registry.npmjs.org` |

Memory A and Memory B are **identical on purpose**. Two arms with the same setup should give the same answer, so if they disagree, something is leaking; if they agree, I can trust the setup and pool them into a single memory arm.

Every trial starts from the same bare Express app (one dependency, `express`) and gets one prompt, a simple task like "add tests for the server". The prompt bank has 10 of these: 6 are tasks in an area where a package got renamed or deprecated, and 4 are in areas where nothing changed, so the agent isn't always walking into a trap. The run covers all 10 prompts, with 50 trials per arm, so **150 trials in total**.

Before the agent starts, the runner also tries to reach `registry.npmjs.org` from inside the container. If that request goes through when it shouldn't, the firewall isn't doing its job, so the trial fails and stays out of the results.

After the trials complete, every name the agents tried is checked against the registry from the host. The results of this would return either 4 things: `missing`, `deprecated`, `renamed` or `ok`. **A trial's outcome only comes from its first attempt.**

# Results

**All 150 trials ran clean**, the registry was blocked in every memory trial and open in every registry trial and when Memory A and Memory B did install something, they picked the same names from the same prompts. Two registry trials could not reach the registry because of a network issue, got thrown out before the agent started and reran.

However, based on the results there was basically almost nothing to measure as **only 46 of the 150 trials installed anything at all**, and every single first name was accurate:

| Arm      | Trials with an install | Wrong first name |
| -------- | ---------------------- | ---------------- |
| Memory A | 16 of 50               | 0                |
| Memory B | 14 of 50               | 0                |
| Registry | 16 of 50               | 0                |

After looking deeper into the agent tracing, I found out 3 reasons why this happened:

1. **Model already knows every rename in my list** and all of them moved before the model's training cutoff, so it had the new names.
2. **The registry arm never looked at the shelf**: only 5 of 50 registry trials did the agent run `npm view` before its first install.
3. **Most prompts never produced an install**, instead everything else was hand-written: config parsing, request logging, rate limiting.

# Conclusion

My conclusion is very simple: **this experiment was accurate and there were no trials that were imprecise**. However, we now know that agent harnesses can quickly double-check which package they were planning to install, which is a positive note. On the negative side, we are **not seeing enough of the agent looking into shelves** (aka the registry), but rather figuring things out the old-fashioned way. I want to continue experimenting with this second idea and see how we can improve agents installing specific dev tool packages.
