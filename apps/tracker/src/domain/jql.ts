import type { Issue, TrackerData } from "./issue.types";
import { ISSUE_STATUSES, isIssueStatus, isIssueType, isPriority, PRIORITIES } from "./issue.types";
import { priorityLabel, statusLabel, typeLabel } from "./labels";

type CmpOp = "=" | "!=" | "~" | "!~" | ">" | ">=" | "<" | "<=";

type Value = string | number | { fn: "currentUser" };

type Expr =
  | { kind: "cmp"; field: string; op: CmpOp; value: Value }
  | { kind: "in"; field: string; values: Value[]; negate: boolean }
  | { kind: "empty"; field: string; negate: boolean }
  | { kind: "and"; left: Expr; right: Expr }
  | { kind: "or"; left: Expr; right: Expr }
  | { kind: "not"; expr: Expr };

type Order = { field: string; direction: "asc" | "desc" };

type Tok =
  | { t: "id"; v: string }
  | { t: "str"; v: string }
  | { t: "num"; v: number }
  | { t: "op"; v: CmpOp }
  | { t: "lp" }
  | { t: "rp" }
  | { t: "comma" };

const FIELDS = new Set([
  "project",
  "key",
  "summary",
  "description",
  "text",
  "status",
  "type",
  "priority",
  "assignee",
  "reporter",
  "labels",
  "sprint",
  "storypoints",
  "parent"
]);

const ORDER_FIELDS = new Set(["updated", "created", "key", "summary", "priority", "status", "storypoints", "rank"]);

const OPS: Array<{ raw: string; op: CmpOp }> = [
  { raw: "!=", op: "!=" },
  { raw: "!~", op: "!~" },
  { raw: ">=", op: ">=" },
  { raw: "<=", op: "<=" },
  { raw: "=", op: "=" },
  { raw: "~", op: "~" },
  { raw: ">", op: ">" },
  { raw: "<", op: "<" }
];

class JqlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JqlError";
  }
}

function tokenize(source: string): Tok[] {
  const tokens: Tok[] = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (char === undefined) {
      break;
    }
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }
    if (char === "(") {
      tokens.push({ t: "lp" });
      index += 1;
      continue;
    }
    if (char === ")") {
      tokens.push({ t: "rp" });
      index += 1;
      continue;
    }
    if (char === ",") {
      tokens.push({ t: "comma" });
      index += 1;
      continue;
    }
    if (char === '"') {
      let cursor = index + 1;
      let value = "";
      while (cursor < source.length && source[cursor] !== '"') {
        const current = source[cursor];
        if (current === "\\" && cursor + 1 < source.length) {
          value += source[cursor + 1] ?? "";
          cursor += 2;
          continue;
        }
        value += current ?? "";
        cursor += 1;
      }
      if (source[cursor] !== '"') {
        throw new JqlError("Unclosed string.");
      }
      tokens.push({ t: "str", v: value });
      index = cursor + 1;
      continue;
    }
    const matched = OPS.find((item) => source.startsWith(item.raw, index));
    if (matched) {
      tokens.push({ t: "op", v: matched.op });
      index += matched.raw.length;
      continue;
    }
    if (/[0-9-]/.test(char)) {
      const number = /^-?\d+(\.\d+)?/.exec(source.slice(index));
      if (number) {
        tokens.push({ t: "num", v: Number(number[0]) });
        index += number[0].length;
        continue;
      }
    }
    if (/[A-Za-z_]/.test(char)) {
      const word = /^[A-Za-z_][A-Za-z0-9_-]*/.exec(source.slice(index));
      if (word) {
        tokens.push({ t: "id", v: word[0] });
        index += word[0].length;
        continue;
      }
    }
    throw new JqlError(`Unexpected "${char}".`);
  }
  return tokens;
}

class Parser {
  private index = 0;

  constructor(private readonly tokens: Tok[]) {}

  parse(): { where: Expr | null; order: Order[] } {
    if (this.tokens.length === 0) {
      throw new JqlError("JQL is empty.");
    }
    const where = this.isKeyword("order") ? null : this.parseOr();
    const order = this.parseOrder();
    if (this.peek()) {
      throw new JqlError("Unexpected trailing tokens.");
    }
    return { where, order };
  }

  private parseOr(): Expr {
    let left = this.parseAnd();
    while (this.eatKeyword("or")) {
      left = { kind: "or", left, right: this.parseAnd() };
    }
    return left;
  }

  private parseAnd(): Expr {
    let left = this.parseNot();
    while (this.eatKeyword("and")) {
      left = { kind: "and", left, right: this.parseNot() };
    }
    return left;
  }

  private parseNot(): Expr {
    if (this.eatKeyword("not")) {
      return { kind: "not", expr: this.parseNot() };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): Expr {
    if (this.eatToken("lp")) {
      const expr = this.parseOr();
      this.expectToken("rp", "Expected ).");
      return expr;
    }
    return this.parseClause();
  }

  private parseClause(): Expr {
    const field = this.expectField();
    if (this.eatKeyword("is")) {
      const negate = this.eatKeyword("not");
      this.expectKeyword("empty", "Expected EMPTY.");
      return { kind: "empty", field, negate };
    }
    if (this.eatKeyword("not")) {
      this.expectKeyword("in", "Expected IN.");
      return { kind: "in", field, values: this.parseList(), negate: true };
    }
    if (this.eatKeyword("in")) {
      return { kind: "in", field, values: this.parseList(), negate: false };
    }
    const op = this.expectOp();
    return { kind: "cmp", field, op, value: this.parseValue() };
  }

  private parseList(): Value[] {
    this.expectToken("lp", "Expected (.");
    const values: Value[] = [];
    values.push(this.parseValue());
    while (this.eatToken("comma")) {
      values.push(this.parseValue());
    }
    this.expectToken("rp", "Expected ).");
    return values;
  }

  private parseValue(): Value {
    const token = this.peek();
    if (!token) {
      throw new JqlError("Expected a value.");
    }
    if (token.t === "str" || token.t === "num") {
      this.index += 1;
      return token.v;
    }
    if (token.t === "id" && token.v.toLowerCase() === "currentuser") {
      this.index += 1;
      this.expectToken("lp", "Expected ( after currentUser.");
      this.expectToken("rp", "Expected ) after currentUser.");
      return { fn: "currentUser" };
    }
    if (token.t === "id") {
      this.index += 1;
      return token.v;
    }
    throw new JqlError("Expected a value.");
  }

  private parseOrder(): Order[] {
    if (!this.eatKeyword("order")) {
      return [];
    }
    this.expectKeyword("by", "Expected BY.");
    const order: Order[] = [];
    order.push(this.parseOrderItem());
    while (this.eatToken("comma")) {
      order.push(this.parseOrderItem());
    }
    return order;
  }

  private parseOrderItem(): Order {
    const token = this.peek();
    if (!token || token.t !== "id") {
      throw new JqlError("Expected an order field.");
    }
    const field = token.v.toLowerCase();
    if (!ORDER_FIELDS.has(field)) {
      throw new JqlError(`Cannot order by ${token.v}.`);
    }
    this.index += 1;
    if (this.eatKeyword("desc")) {
      return { field, direction: "desc" };
    }
    this.eatKeyword("asc");
    return { field, direction: "asc" };
  }

  private expectField(): string {
    const token = this.peek();
    if (!token || token.t !== "id") {
      throw new JqlError("Expected a field.");
    }
    const field = token.v.toLowerCase();
    if (!FIELDS.has(field)) {
      throw new JqlError(`Unknown field ${token.v}.`);
    }
    this.index += 1;
    return field;
  }

  private expectOp(): CmpOp {
    const token = this.peek();
    if (!token || token.t !== "op") {
      throw new JqlError("Expected an operator.");
    }
    this.index += 1;
    return token.v;
  }

  private expectKeyword(word: string, message: string): void {
    if (!this.eatKeyword(word)) {
      throw new JqlError(message);
    }
  }

  private expectToken(kind: "lp" | "rp" | "comma", message: string): void {
    if (!this.eatToken(kind)) {
      throw new JqlError(message);
    }
  }

  private eatKeyword(word: string): boolean {
    if (!this.isKeyword(word)) {
      return false;
    }
    this.index += 1;
    return true;
  }

  private eatToken(kind: Tok["t"]): boolean {
    if (this.peek()?.t !== kind) {
      return false;
    }
    this.index += 1;
    return true;
  }

  private isKeyword(word: string): boolean {
    const token = this.peek();
    return token?.t === "id" && token.v.toLowerCase() === word;
  }

  private peek(): Tok | undefined {
    return this.tokens[this.index];
  }
}

function resolve(value: Value, actorId: string): string | number {
  return typeof value === "object" ? actorId : value;
}

function same(left: string, right: string): boolean {
  return left.toLowerCase() === right.toLowerCase();
}

function texts(issue: Issue, field: string, data: TrackerData): string[] {
  const names = (personId: string) => {
    const person = data.people.find((item) => item.id === personId);
    return person ? [person.id, person.name] : [personId];
  };
  switch (field) {
    case "project":
      return [issue.projectKey];
    case "key":
      return [issue.key];
    case "summary":
      return [issue.summary];
    case "description":
      return [issue.description];
    case "text":
      return [issue.summary, issue.description, ...issue.comments.map((comment) => comment.body)];
    case "status": {
      const names = data.workflows.flatMap((workflow) =>
        workflow.statuses.filter((status) => status.id === issue.status).map((status) => status.name)
      );
      return isIssueStatus(issue.status) ? [issue.status, statusLabel(issue.status), ...names] : [issue.status, ...names];
    }
    case "type":
      return isIssueType(issue.type) ? [issue.type, typeLabel(issue.type)] : [issue.type];
    case "priority":
      return isPriority(issue.priority) ? [issue.priority, priorityLabel(issue.priority)] : [issue.priority];
    case "assignee":
      return names(issue.assigneeId);
    case "reporter":
      return names(issue.reporterId);
    case "labels":
      return issue.labels;
    case "sprint": {
      if (issue.sprintId === null) {
        return [];
      }
      const sprint = data.sprints.find((item) => item.id === issue.sprintId);
      return sprint ? [sprint.id, sprint.name] : [issue.sprintId];
    }
    case "parent": {
      if (issue.parentId === null) {
        return [];
      }
      const parent = data.issues.find((item) => item.id === issue.parentId);
      return parent ? [parent.id, parent.key] : [issue.parentId];
    }
    case "storypoints":
      return [];
    default:
      return [];
  }
}

function isEmpty(issue: Issue, field: string, data: TrackerData): boolean {
  if (field === "storypoints") {
    return issue.storyPoints === null;
  }
  return texts(issue, field, data).length === 0;
}

function includes(issue: Issue, field: string, needle: string, data: TrackerData): boolean {
  const query = needle.toLowerCase();
  return texts(issue, field, data).some((value) => value.toLowerCase().includes(query));
}

function equals(issue: Issue, field: string, needle: string, data: TrackerData): boolean {
  return texts(issue, field, data).some((value) => same(value, needle));
}

function comparePoints(points: number | null, op: CmpOp, raw: string | number): boolean {
  if (points === null || op === "~" || op === "!~") {
    return false;
  }
  const needle = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(needle)) {
    return false;
  }
  switch (op) {
    case "=":
      return points === needle;
    case "!=":
      return points !== needle;
    case ">":
      return points > needle;
    case ">=":
      return points >= needle;
    case "<":
      return points < needle;
    case "<=":
      return points <= needle;
    default: {
      const exhaustive: never = op;
      return exhaustive;
    }
  }
}

function compare(issue: Issue, expr: Extract<Expr, { kind: "cmp" }>, data: TrackerData, actorId: string): boolean {
  const raw = resolve(expr.value, actorId);
  if (expr.field === "storypoints") {
    return comparePoints(issue.storyPoints, expr.op, raw);
  }
  const text = String(raw);
  switch (expr.op) {
    case "=":
      return equals(issue, expr.field, text, data);
    case "!=":
      return !equals(issue, expr.field, text, data);
    case "~":
      return includes(issue, expr.field, text, data);
    case "!~":
      return !includes(issue, expr.field, text, data);
    case ">":
    case ">=":
    case "<":
    case "<=":
      return false;
    default: {
      const exhaustive: never = expr.op;
      return exhaustive;
    }
  }
}

function inList(issue: Issue, expr: Extract<Expr, { kind: "in" }>, data: TrackerData, actorId: string): boolean {
  const values = expr.values.map((value) => resolve(value, actorId));
  const hit =
    expr.field === "storypoints"
      ? issue.storyPoints !== null && values.some((value) => issue.storyPoints === Number(value))
      : values.some((value) => equals(issue, expr.field, String(value), data));
  return expr.negate ? !hit : hit;
}

function matches(issue: Issue, expr: Expr, data: TrackerData, actorId: string): boolean {
  switch (expr.kind) {
    case "and":
      return matches(issue, expr.left, data, actorId) && matches(issue, expr.right, data, actorId);
    case "or":
      return matches(issue, expr.left, data, actorId) || matches(issue, expr.right, data, actorId);
    case "not":
      return !matches(issue, expr.expr, data, actorId);
    case "empty":
      return isEmpty(issue, expr.field, data) !== expr.negate;
    case "cmp":
      return compare(issue, expr, data, actorId);
    case "in":
      return inList(issue, expr, data, actorId);
    default: {
      const exhaustive: never = expr;
      return exhaustive;
    }
  }
}

function orderValue(issue: Issue, field: string): string | number {
  switch (field) {
    case "updated":
      return issue.updatedAt;
    case "created":
      return issue.createdAt;
    case "key":
      return issue.key;
    case "summary":
      return issue.summary;
    case "priority":
      return PRIORITIES.indexOf(issue.priority);
    case "status":
      return isIssueStatus(issue.status) ? ISSUE_STATUSES.indexOf(issue.status) : ISSUE_STATUSES.length;
    case "storypoints":
      return issue.storyPoints ?? Number.POSITIVE_INFINITY;
    case "rank":
      return issue.rank;
    default:
      return issue.key;
  }
}

function compareOrder(left: Issue, right: Issue, order: Order[]): number {
  const keys = order.length > 0 ? order : [{ field: "updated", direction: "desc" as const }];
  for (const item of keys) {
    const a = orderValue(left, item.field);
    const b = orderValue(right, item.field);
    if (a === b) {
      continue;
    }
    const result = a < b ? -1 : 1;
    return item.direction === "asc" ? result : -result;
  }
  return right.number - left.number;
}

export function evaluateJql(
  data: TrackerData,
  source: string,
  actorId: string
): { issues: Issue[] } | { error: string } {
  try {
    const parsed = new Parser(tokenize(source.trim())).parse();
    const issues = data.issues.filter((issue) => (parsed.where ? matches(issue, parsed.where, data, actorId) : true));
    issues.sort((left, right) => compareOrder(left, right, parsed.order));
    return { issues };
  } catch (error) {
    if (error instanceof JqlError) {
      return { error: error.message };
    }
    throw error;
  }
}
