# Documentation playbook

## Inputs
Goal, constraints, repository state, and expected artifact.

## Stages
repo-explorer → requirements-checker → technical-writer → command/link verification

## Required artifacts
Plan, changed files or research notes, checks, and a final verification report.

## Decision gates
Do not advance when required evidence, permissions, or acceptance criteria are missing. Record the blocker and escalation owner.

## Failure handling
Preserve the failure output, avoid repeating an unchanged approach, and return to the earliest stage whose assumption is unsupported.

## Completion
All required stages have accepted outputs, relevant checks pass, and unresolved risk is explicitly reported.
