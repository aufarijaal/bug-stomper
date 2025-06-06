'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'

interface ProfileData {
  fullName: string
  username: string
  title: string
  bio: string
  linkedin: string
  github: string
  instagram: string
  avatarUrl: string
}

interface ValidationErrors {
  fullName?: string
  username?: string
  title?: string
  bio?: string
  linkedin?: string
  github?: string
  instagram?: string
  general?: string
}

export function ProfileForm() {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    username: '',
    title: '',
    bio: '',
    linkedin: '',
    github: '',
    instagram: '',
    avatarUrl: '',
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load profile data on component mount
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get('/api/profile')
      setProfileData(response.data)
    } catch (error) {
      console.error('Error loading profile:', error)
      setErrors({ general: 'Failed to load profile data' })
    } finally {
      setIsLoading(false)
    }
  }

  // Validation functions
  const validateField = (
    name: keyof ProfileData,
    value: string,
  ): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required'
        if (value.trim().length < 2)
          return 'Full name must be at least 2 characters'
        if (value.trim().length > 100)
          return 'Full name must not exceed 100 characters'
        break
      case 'username':
        if (!value.trim()) return 'Username is required'
        if (value.trim().length < 3)
          return 'Username must be at least 3 characters'
        // if (value.trim().length > 30) return 'Username must not exceed 30 characters'
        if (!/^[a-zA-Z0-9_-]+$/.test(value.trim()))
          return 'Username can only contain letters, numbers, underscores, and hyphens'
        break
      case 'title':
        if (value && value.trim().length > 100)
          return 'Title must not exceed 100 characters'
        break
      case 'bio':
        if (value && value.trim().length > 500)
          return 'Bio must not exceed 500 characters'
        break
      case 'linkedin':
        if (value && value.trim() && !isValidURL(value.trim()))
          return 'Please enter a valid LinkedIn URL'
        break
      case 'github':
        if (value && value.trim() && !isValidGitHubURL(value.trim()))
          return 'Please enter a valid GitHub URL (e.g., https://github.com/username)'
        break
      case 'instagram':
        if (value && value.trim() && !isValidInstagramURL(value.trim()))
          return 'Please enter a valid Instagram URL (e.g., https://instagram.com/username)'
        break
    }
    return undefined
  }

  const isValidURL = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const isValidGitHubURL = (string: string): boolean => {
    try {
      const url = new URL(string)
      return url.hostname === 'github.com' || url.hostname === 'www.github.com'
    } catch {
      return false
    }
  }

  const isValidInstagramURL = (string: string): boolean => {
    try {
      const url = new URL(string)
      return (
        url.hostname === 'instagram.com' ||
        url.hostname === 'www.instagram.com' ||
        url.hostname === 'instagr.am' ||
        url.hostname === 'www.instagr.am'
      )
    } catch {
      return false
    }
  }

  const handleInputChange = (name: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }))

    // Clear error if field is being corrected
    if (errors[name as keyof ValidationErrors]) {
      const error = validateField(name, value)
      if (!error) {
        setErrors((prev) => ({
          ...prev,
          [name as keyof ValidationErrors]: undefined,
        }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    Object.entries(profileData).forEach(([key, value]) => {
      if (key !== 'avatarUrl') {
        const error = validateField(key as keyof ProfileData, value)
        if (error) {
          newErrors[key as keyof ValidationErrors] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await axios.put('/api/profile', profileData)
      setErrors({ general: undefined })
      // Could add success message here
    } catch (error: any) {
      console.error('Error updating profile:', error)
      const errorMessage =
        error.response?.data?.error || 'Failed to update profile'
      setErrors({ general: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingAvatar(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await axios.post('/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setProfileData((prev) => ({
        ...prev,
        avatarUrl: response.data.avatarUrl,
      }))
    } catch (error: any) {
      console.error('Error uploading avatar:', error)
      const errorMessage =
        error.response?.data?.error || 'Failed to upload avatar'
      setErrors({ general: errorMessage })
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleAvatarRemove = async () => {
    setIsUploadingAvatar(true)

    try {
      await axios.delete('/api/profile/avatar')
      setProfileData((prev) => ({ ...prev, avatarUrl: '' }))
    } catch (error: any) {
      console.error('Error removing avatar:', error)
      const errorMessage =
        error.response?.data?.error || 'Failed to remove avatar'
      setErrors({ general: errorMessage })
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading profile...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div
          className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-600"
          onClick={() => setErrors({ ...errors, general: undefined })}
        >
          {errors.general}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Photo profile</h2>
        <div className="flex items-start gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-lg border">
            <Image
              src={profileData.avatarUrl || '/avatar-placeholder.png'}
              alt="Profile"
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? 'Uploading...' : 'Upload image'}
            </Button>
            {profileData.avatarUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAvatarRemove}
                disabled={isUploadingAvatar}
              >
                Remove image
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Enter your full name"
            value={profileData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className={
              errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''
            }
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={profileData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={
              errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''
            }
          />
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Software Engineer"
            value={profileData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={
              errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''
            }
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="Your LinkedIn profile URL"
            value={profileData.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            className={
              errors.linkedin ? 'border-red-500 focus-visible:ring-red-500' : ''
            }
          />
          {errors.linkedin && (
            <p className="text-sm text-red-600">{errors.linkedin}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            placeholder="https://github.com/yourusername"
            value={profileData.github}
            onChange={(e) => handleInputChange('github', e.target.value)}
            className={
              errors.github ? 'border-red-500 focus-visible:ring-red-500' : ''
            }
          />
          {errors.github && (
            <p className="text-sm text-red-600">{errors.github}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input
            id="instagram"
            placeholder="https://instagram.com/yourusername"
            value={profileData.instagram}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
            className={
              errors.instagram
                ? 'border-red-500 focus-visible:ring-red-500'
                : ''
            }
          />
          {errors.instagram && (
            <p className="text-sm text-red-600">{errors.instagram}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself"
            className={`min-h-[150px] ${
              errors.bio ? 'border-red-500 focus-visible:ring-red-500' : ''
            }`}
            value={profileData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
          />
          {errors.bio && <p className="text-sm text-red-600">{errors.bio}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
