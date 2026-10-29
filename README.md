# AI Skills Library

A simple, portable collection of Agent Skills for Codex, Claude Code, Gemini CLI, OpenCode, and other compatible clients. Each skill is a folder containing a `SKILL.md` with YAML metadata and task instructions.

Freebuff is supported as well. Its CLI discovers the same shared `.agents/skills`
and `.claude/skills` locations, so a global link to this library makes the
skills available without a second copy.

## Categories

- **Core:** focused repository, product, implementation, research, review, and Git procedures.
- **Orchestration:** routes skills and coordinates complete workflow playbooks.
- **Grind:** challenges ideas and persists through bounded implementation blockers.

## Examples

```text
Use idea-grinder to challenge this product idea.
Use skill-router to decide which skills are needed for this task.
Use workflow-coordinator to plan a complete feature delivery.
Use execution-grinder when implementation is blocked.
```

## Layout

Canonical skills live under `skills/<category>/<skill-name>/SKILL.md`. The generated `.agents/skills` and `.claude/skills` directories provide client-compatible views. References, templates, examples, playbooks, and scripts are loaded only when needed.

## Validate

```bash
node scripts/build-index.mjs
node scripts/validate-skills.mjs
node scripts/check-links.mjs
node scripts/check-evaluation.mjs
node scripts/export-agent-views.mjs
```

The project uses original instructions and links to public standards. See `sources.json` before adapting public material.

## Freebuff

Install Freebuff, then run it inside a project:

```bash
npm install -g freebuff
cd your-project
freebuff
```

The shared user-level skills are discovered automatically. Start a new Freebuff
session after adding or changing a skill.
