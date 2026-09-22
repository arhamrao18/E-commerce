import { Eyebrow, Button } from "../../components/ui/UI";

export default function Settings() {
  return (
    <div>
      <Eyebrow>Store</Eyebrow>
      <h1 className="mt-2 font-display text-4xl text-ink">Settings</h1>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl glass p-7 shadow-glass">
          <h2 className="font-display text-xl text-ink">Store details</h2>
          <div className="mt-5 space-y-4">
            <Field label="Store name" defaultValue="Lumen Goods Co." />
            <Field label="Support email" defaultValue="support@lumen.co" />
            <Field label="Currency" defaultValue="USD" />
          </div>
          <Button className="mt-6">Save changes</Button>
        </div>
        <div className="rounded-3xl glass p-7 shadow-glass">
          <h2 className="font-display text-xl text-ink">Shipping & tax</h2>
          <div className="mt-5 space-y-4">
            <Field label="Free shipping threshold ($)" defaultValue="75" />
            <Field label="Flat shipping rate ($)" defaultValue="8" />
            <Field label="Default tax rate (%)" defaultValue="8" />
          </div>
          <Button className="mt-6">Save changes</Button>
        </div>
      </div>
      <p className="mt-6 font-mono text-xs text-ink/40">
        This panel is UI-only for now — it'll write to the real store config once the backend is connected.
      </p>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/45">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-ink/15 bg-white/50 px-4 py-3 text-sm focus:border-emerald-600 focus:outline-none"
      />
    </label>
  );
}
