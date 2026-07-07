import { vars } from "@ve/tokens";

const swatchStyle = {
  width: "48px",
  height: "48px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb"
};

const sectionStyle = {
  display: "grid",
  gap: "12px",
  marginBottom: "32px"
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "12px"
};

const labelStyle = {
  fontSize: "12px",
  color: "#64748b",
  fontFamily: "ui-monospace, monospace"
};

const meta = {
  title: "Foundations/Tokens",
  parameters: {
    layout: "padded"
  }
};

export default meta;

export const Colors = {
  render: () => {
    const entries = Object.entries(vars.color);

    return (
      <section style={sectionStyle}>
        <h2 style={{ margin: 0, fontSize: "18px" }}>Color</h2>
        <div style={gridStyle}>
          {entries.map(([name, value]) => (
            <div key={name} style={{ display: "grid", gap: "6px" }}>
              <div style={{ ...swatchStyle, background: value }} />
              <code style={labelStyle}>{name}</code>
              <code style={labelStyle}>{value}</code>
            </div>
          ))}
        </div>
      </section>
    );
  }
};

export const Spacing = {
  render: () => {
    const entries = Object.entries(vars.space).filter(([name]) => name !== "x0");

    return (
      <section style={sectionStyle}>
        <h2 style={{ margin: 0, fontSize: "18px" }}>Space</h2>
        <div style={{ display: "grid", gap: "10px" }}>
          {entries.map(([name, value]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <code style={{ ...labelStyle, width: "40px" }}>{name}</code>
              <div
                style={{
                  width: value,
                  height: "16px",
                  background: vars.color.primary,
                  borderRadius: "2px"
                }}
              />
              <code style={labelStyle}>{value}</code>
            </div>
          ))}
        </div>
      </section>
    );
  }
};

export const Typography = {
  render: () => (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0, fontSize: "18px" }}>Typography</h2>
      <div style={{ display: "grid", gap: "12px" }}>
        {Object.entries(vars.font.size).map(([name, value]) => (
          <p key={name} style={{ margin: 0, fontSize: value, fontFamily: vars.font.body }}>
            font.size.{name} — {value}
          </p>
        ))}
        <p style={{ margin: 0, fontWeight: vars.font.weight.semibold, fontFamily: vars.font.body }}>
          font.weight.semibold — {vars.font.weight.semibold}
        </p>
      </div>
    </section>
  )
};

export const ButtonScale = {
  render: () => (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0, fontSize: "18px" }}>component.button</h2>
      <div style={{ display: "grid", gap: "10px" }}>
        {Object.entries(vars.component.button.height).map(([name, value]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <code style={{ ...labelStyle, width: "48px" }}>{name}</code>
            <div
              style={{
                height: value,
                minWidth: "120px",
                background: vars.color.primarySubtle,
                border: `1px solid ${vars.color.border}`,
                borderRadius: vars.radius.sm
              }}
            />
            <code style={labelStyle}>{value}</code>
          </div>
        ))}
      </div>
    </section>
  )
};

export const Motion = {
  render: () => (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0, fontSize: "18px" }}>Motion</h2>
      <div style={{ display: "grid", gap: "8px" }}>
        {Object.entries(vars.motion.duration).map(([name, value]) => (
          <code key={name} style={labelStyle}>
            motion.duration.{name} — {value}
          </code>
        ))}
        <code style={labelStyle}>motion.transition.button — {vars.motion.transition.button}</code>
      </div>
    </section>
  )
};
