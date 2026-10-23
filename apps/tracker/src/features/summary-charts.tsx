import type { ReactNode } from "react";
import { Link } from "react-router";
import type { Priority } from "../domain/issue.types";
import { priorityLabel } from "../domain/labels";
import type { Share, StatusShare } from "../domain/space-summary";
import { Icon } from "../layout/icons";
import {
  artBrand,
  artBrandDark,
  artMark,
  artNeutral,
  axisTick,
  axisTickBottom,
  axisTickMid,
  axisTickTop,
  axisTicks,
  barChart,
  barFill,
  barLabel,
  barLabelOutside,
  barRect,
  barTrack,
  chartStroke,
  chartSwatch,
  donut,
  donutCenter,
  donutLabel,
  donutRow,
  donutTotal,
  empty,
  emptyArt,
  emptyText,
  emptyTitle,
  gridLine,
  legend,
  legendItem,
  legendSwatch,
  plot,
  priorityTone,
  shareBar,
  shareHead,
  shareName,
  shareNameText,
  shareRow,
  shareTable,
  xAxis,
  xLabel
} from "./summary.css";

const DONUT_SIZE = 210;
const DONUT_STROKE = 24;
const DONUT_RADIUS = (DONUT_SIZE - DONUT_STROKE) / 2;
const DONUT_LENGTH = 2 * Math.PI * DONUT_RADIUS;

type ChartTone = keyof typeof chartStroke;

function chartTone(index: number): ChartTone {
  const value = index % 6;
  switch (value) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
      return value;
    default:
      return 0;
  }
}

function listHref(projectKey: string, jql: string): string {
  return `/p/${projectKey}/list?jql=${encodeURIComponent(jql)}`;
}

type StatusDonutProps = {
  projectKey: string;
  total: number;
  statuses: StatusShare[];
};

export function StatusDonut({ projectKey, total, statuses }: StatusDonutProps) {
  const visible = statuses.map((status, index) => ({ status, tone: chartTone(index) })).filter((item) => item.status.count > 0);
  let offset = 0;

  return (
    <div className={donutRow}>
      <div className={donut}>
        <svg aria-hidden height={DONUT_SIZE} viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`} width={DONUT_SIZE}>
          <g transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}>
            {visible.map(({ status, tone }) => {
              const length = (status.count / total) * DONUT_LENGTH;
              const segment = (
                <circle
                  key={status.id}
                  className={chartStroke[tone]}
                  cx={DONUT_SIZE / 2}
                  cy={DONUT_SIZE / 2}
                  fill="none"
                  r={DONUT_RADIUS}
                  strokeDasharray={`${length} ${DONUT_LENGTH - length}`}
                  strokeDashoffset={-offset}
                  strokeWidth={DONUT_STROKE}
                />
              );
              offset += length;
              return segment;
            })}
          </g>
        </svg>
        <div className={donutCenter}>
          <span className={donutTotal}>{total}</span>
          <span className={donutLabel}>Total work items</span>
        </div>
      </div>
      <ul className={legend}>
        {visible.map(({ status, tone }) => (
          <li key={status.id}>
            <Link className={legendItem} to={listHref(projectKey, status.jql)}>
              <span className={`${legendSwatch} ${chartSwatch[tone]}`} />
              {status.name}: {status.count}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatTick(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

type PriorityBarsProps = {
  projectKey: string;
  priorities: Share<Priority>[];
  axis: [number, number, number];
};

export function PriorityBars({ projectKey, priorities, axis }: PriorityBarsProps) {
  const max = axis[2];
  const slot = 100 / priorities.length;
  const barWidth = slot * 0.58;

  return (
    <div className={barChart}>
      <div aria-hidden className={axisTicks}>
        <span className={`${axisTick} ${axisTickTop}`}>{formatTick(axis[2])}</span>
        <span className={`${axisTick} ${axisTickMid}`}>{formatTick(axis[1])}</span>
        <span className={`${axisTick} ${axisTickBottom}`}>{formatTick(axis[0])}</span>
      </div>
      <div className={plot}>
        <svg height="100%" preserveAspectRatio="none" role="img" viewBox="0 0 100 100" width="100%">
          <title>Work items by priority</title>
          <line className={gridLine} vectorEffect="non-scaling-stroke" x1="0" x2="100" y1="0" y2="0" />
          <line className={gridLine} vectorEffect="non-scaling-stroke" x1="0" x2="100" y1="50" y2="50" />
          {priorities.map((item, index) => {
            const height = (item.count / max) * 100;
            return (
              <rect
                key={item.id}
                className={barRect}
                height={height}
                width={barWidth}
                x={index * slot + (slot - barWidth) / 2}
                y={100 - height}
              >
                <title>
                  {priorityLabel(item.id)}: {item.count}
                </title>
              </rect>
            );
          })}
        </svg>
      </div>
      <div className={xAxis}>
        {priorities.map((item) => (
          <Link key={item.id} className={xLabel} to={listHref(projectKey, item.jql)}>
            <span className={priorityTone[item.id]}>
              <Icon name={item.id} />
            </span>
            {priorityLabel(item.id)}
          </Link>
        ))}
      </div>
    </div>
  );
}

type ShareTableProps<T extends string> = {
  projectKey: string;
  nameHeader: string;
  rows: Share<T>[];
  renderName: (row: Share<T>) => ReactNode;
};

export function ShareTable<T extends string>({ projectKey, nameHeader, rows, renderName }: ShareTableProps<T>) {
  return (
    <div className={shareTable} role="table">
      <div className={shareHead} role="columnheader">
        {nameHeader}
      </div>
      <div className={shareHead} role="columnheader">
        {nameHeader === "Assignee" ? "Work distribution" : "Distribution"}
      </div>
      {rows.map((row) => (
        <div key={row.id} className={shareRow} role="row">
          <Link className={shareName} role="cell" to={listHref(projectKey, row.jql)}>
            {renderName(row)}
          </Link>
          <div className={shareBar} role="cell">
            <svg aria-hidden height="24" width="100%">
              <rect className={barTrack} height="24" width="100%" />
              <rect className={barFill} height="24" width={`${row.percent}%`} />
            </svg>
            {row.percent > 0 ? (
              <span className={row.percent >= 12 ? barLabel : `${barLabel} ${barLabelOutside}`}>{row.percent}%</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ShareName({ children }: { children: ReactNode }) {
  return <span className={shareNameText}>{children}</span>;
}

type EmptyStateProps = {
  art: "activity" | "epic";
  title: string;
  children: ReactNode;
};

export function EmptyState({ art, title, children }: EmptyStateProps) {
  return (
    <div className={empty}>
      <svg aria-hidden className={emptyArt} height="56" viewBox="0 0 64 56" width="64">
        {art === "activity" ? (
          <>
            <rect className={artNeutral} height="20" rx="2" width="40" x="6" y="8" />
            <rect className={artBrand} height="22" rx="2" width="40" x="18" y="22" />
            <rect className={artBrandDark} height="6" width="40" x="18" y="22" />
            <path className={artMark} d="m42 35 4 4 7-8" fill="none" strokeLinecap="round" strokeWidth="3" />
          </>
        ) : (
          <>
            <rect className={artNeutral} height="20" rx="3" width="22" x="6" y="4" />
            <rect className={artNeutral} height="20" rx="3" width="22" x="32" y="4" />
            <rect className={artNeutral} height="20" rx="3" width="22" x="6" y="28" />
            <rect className={artBrand} height="24" rx="3" transform="rotate(-8 46 42)" width="24" x="34" y="30" />
            <path className={artMark} d="M46 36v12M40 42h12" fill="none" strokeLinecap="round" strokeWidth="3" />
          </>
        )}
      </svg>
      <h3 className={emptyTitle}>{title}</h3>
      <p className={emptyText}>{children}</p>
    </div>
  );
}
