import { AccountSettingsForm } from "@/components/settings/account-settings-form";

export default function SettingsPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="flex flex-col gap-2">
        <p className="text-sm font-bold text-muted-foreground">Account</p>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="font-semibold text-muted-foreground">
          Update your profile, email, and theme. Theme applies across the whole
          app on this device.
        </p>
      </header>

      <AccountSettingsForm />
    </div>
  );
}
