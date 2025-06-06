import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileForm } from '@/components/profile-form'
import { ActivityTab } from '@/components/activity-tab'
import { SavesTab } from '@/components/saves-tab'
import { SettingsTab } from '@/components/settings-tab'
import Navigation from '@/components/Navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'

export async function generateMetadata() {
  return {
    title: 'Account',
    description: 'Manage your account settings and preferences.',
  }
}

export default function AccountPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex min-h-screen w-full flex-col">
        <div className="container py-8">
          <h1 className="mb-6 text-3xl font-bold">Account</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="saves">Saves</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityTab />
            </TabsContent>

            <TabsContent value="saves">
              <SavesTab />
            </TabsContent>

            <TabsContent value="settings">
              <SettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
