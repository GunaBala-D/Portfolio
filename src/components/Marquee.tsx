/** Endless hairline band of labels. The second copy exists only to close the loop. */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  return (
    <div className="marquee" aria-label={label}>
      {[0, 1].map((dup) => (
        <ul role="list" key={dup} className="marquee__track hud-label" aria-hidden={dup === 1 ? true : undefined}>
          {items.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ))}
    </div>
  );
}
