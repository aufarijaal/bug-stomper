'use client'

import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

export function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Account Settings</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Receive email notifications when someone answers your questions
            </p>
          </div>
          <Switch id="email-notifications" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Dark Mode</h3>
            <p className="text-sm text-muted-foreground">
              Toggle between light and dark mode
            </p>
          </div>
          <Switch id="dark-mode" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </div>
          <Button variant="outline" size="sm">
            Enable
          </Button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-2 font-medium text-red-600">Danger Zone</h3>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  )
}
