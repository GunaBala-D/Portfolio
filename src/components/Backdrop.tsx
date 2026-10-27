/** Fixed ambient layer behind every page: drifting aurora light, a dot grid and fine grain. */
export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__blob backdrop__blob--a" />
      <div className="backdrop__blob backdrop__blob--b" />
      <div className="backdrop__blob backdrop__blob--c" />
      <div className="backdrop__grid" />
      <div className="backdrop__grain" />
    </div>
  );
}
