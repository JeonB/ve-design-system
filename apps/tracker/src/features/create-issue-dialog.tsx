import { useState, type FormEvent } from "react";
import { Button, Dialog, Field, Input, Select, Stack, Textarea } from "@ve/ui";
import {
  ISSUE_TYPES,
  PRIORITIES,
  isIssueType,
  isPriority,
  validateSummary,
  type CreateIssueInput,
  type IssueType,
  type Priority
} from "../domain/issue.types";
import { priorityLabel, typeLabel } from "../domain/labels";

type CreateIssueDialogProps = {
  open: boolean;
  hint?: string;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: CreateIssueInput) => void;
};

export function CreateIssueDialog({ open, hint = "New work starts in To Do.", onOpenChange, onCreate }: CreateIssueDialogProps) {
  const [type, setType] = useState<IssueType>("story");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [summaryError, setSummaryError] = useState<string | null>(null);

  function reset() {
    setType("story");
    setSummary("");
    setDescription("");
    setPriority("medium");
    setSummaryError(null);
  }

  function handleOpenChange(next: boolean) {
    if (next) {
      reset();
    }
    onOpenChange(next);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = validateSummary(summary);
    if (error) {
      setSummaryError(error);
      return;
    }
    onCreate({ type, summary, description, priority });
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content>
        <Dialog.Close />
        <Dialog.Header>
          <Dialog.Title>Create issue</Dialog.Title>
          <Dialog.Description>{hint}</Dialog.Description>
        </Dialog.Header>
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Field>
              <Field.Label>Type</Field.Label>
              <Select
                name="type"
                value={type}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isIssueType(next)) {
                    setType(next);
                  }
                }}
              >
                {ISSUE_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {typeLabel(option)}
                  </option>
                ))}
              </Select>
            </Field>
            <Field invalid={Boolean(summaryError)} required>
              <Field.Label>Summary</Field.Label>
              <Input
                name="summary"
                value={summary}
                onChange={(event) => {
                  setSummary(event.target.value);
                  setSummaryError(null);
                }}
              />
              {summaryError ? <Field.Error>{summaryError}</Field.Error> : null}
            </Field>
            <Field>
              <Field.Label>Description</Field.Label>
              <Textarea
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
            <Field>
              <Field.Label>Priority</Field.Label>
              <Select
                name="priority"
                value={priority}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isPriority(next)) {
                    setPriority(next);
                  }
                }}
              >
                {PRIORITIES.map((option) => (
                  <option key={option} value={option}>
                    {priorityLabel(option)}
                  </option>
                ))}
              </Select>
            </Field>
            <Dialog.Footer>
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </Dialog.Footer>
          </Stack>
        </form>
      </Dialog.Content>
    </Dialog>
  );
}
