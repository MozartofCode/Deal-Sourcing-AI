import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMyProfile, updateMyProfile, getUserProfile } from '../services/api'
import { useAuth } from '../components/AuthContext'
import MessageModal from '../components/MessageModal'

function Profile() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    company_name: '',
    industry: '',
    location: '',
    website: '',
    linkedin_url: '',
    twitter_url: '',
    investment_focus: '',
    startup_stage: '',
    funding_goal: '',
    check_size_min: '',
    check_size_max: '',
    portfolio_size: '',
    profile_image_url: '',
    is_public: true,
  })

  const isOwnProfile = !userId || userId === user?.id

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = isOwnProfile ? await getMyProfile() : await getUserProfile(userId)
      setProfile(data)
      if (isOwnProfile) {
        setFormData({
          bio: data.bio || '',
          company_name: data.company_name || '',
          industry: data.industry || '',
          location: data.location || '',
          website: data.website || '',
          linkedin_url: data.linkedin_url || '',
          twitter_url: data.twitter_url || '',
          investment_focus: data.investment_focus || '',
          startup_stage: data.startup_stage || '',
          funding_goal: data.funding_goal?.toString() || '',
          check_size_min: data.check_size_min?.toString() || '',
          check_size_max: data.check_size_max?.toString() || '',
          portfolio_size: data.portfolio_size?.toString() || '',
          profile_image_url: data.profile_image_url || '',
          is_public: data.is_public ?? true,
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      if (!isOwnProfile) {
        navigate('/profile')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const updateData = {
        ...formData,
        funding_goal: formData.funding_goal ? parseFloat(formData.funding_goal) : null,
        check_size_min: formData.check_size_min ? parseFloat(formData.check_size_min) : null,
        check_size_max: formData.check_size_max ? parseFloat(formData.check_size_max) : null,
        portfolio_size: formData.portfolio_size ? parseInt(formData.portfolio_size) : null,
      }
      await updateMyProfile(updateData)
      setEditing(false)
      await loadProfile()
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {isOwnProfile ? 'My Profile' : 'Profile'}
              </h1>
              <p className="text-gray-600">
                {isOwnProfile ? 'Manage your public profile' : `Viewing ${profile.company_name || 'user'} profile`}
              </p>
            </div>
            {isOwnProfile && (
              <button
                onClick={() => editing ? handleSave() : setEditing(true)}
                disabled={saving}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {editing && isOwnProfile ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="e.g., Fintech, SaaS"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="City, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {user?.user_type === 'investor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Focus</label>
                    <textarea
                      value={formData.investment_focus}
                      onChange={(e) => setFormData({ ...formData, investment_focus: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder="What industries/stages do you invest in?"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Min Check Size ($)</label>
                      <input
                        type="number"
                        value={formData.check_size_min}
                        onChange={(e) => setFormData({ ...formData, check_size_min: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Check Size ($)</label>
                      <input
                        type="number"
                        value={formData.check_size_max}
                        onChange={(e) => setFormData({ ...formData, check_size_max: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio Size</label>
                      <input
                        type="number"
                        value={formData.portfolio_size}
                        onChange={(e) => setFormData({ ...formData, portfolio_size: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                        placeholder="Number of investments"
                      />
                    </div>
                  </div>
                </>
              )}

              {user?.user_type === 'entrepreneur' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Startup Stage</label>
                    <select
                      value={formData.startup_stage}
                      onChange={(e) => setFormData({ ...formData, startup_stage: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    >
                      <option value="">Select stage...</option>
                      <option value="Pre-Seed">Pre-Seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                      <option value="Series C+">Series C+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Funding Goal ($)</label>
                    <input
                      type="number"
                      value={formData.funding_goal}
                      onChange={(e) => setFormData({ ...formData, funding_goal: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                      placeholder="e.g., 500000"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="ml-2 text-sm text-gray-700">
                  Make profile public (visible to other users)
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {profile.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Bio</h3>
                  <p className="text-gray-900">{profile.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.company_name && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Company</h3>
                    <p className="text-gray-900">{profile.company_name}</p>
                  </div>
                )}
                {profile.industry && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Industry</h3>
                    <p className="text-gray-900">{profile.industry}</p>
                  </div>
                )}
                {profile.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                    <p className="text-gray-900">{profile.location}</p>
                  </div>
                )}
                {profile.website && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Website</h3>
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>

              {profile.user_type === 'investor' && profile.investment_focus && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Investment Focus</h3>
                  <p className="text-gray-900">{profile.investment_focus}</p>
                </div>
              )}

              {profile.user_type === 'entrepreneur' && profile.startup_stage && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Startup Stage</h3>
                  <p className="text-gray-900">{profile.startup_stage}</p>
                </div>
              )}
            </div>
          )}

          {/* Message button for viewing other users' profiles */}
          {!isOwnProfile && profile && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowMessageModal(true)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                💬 Send Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Message Modal */}
      {!isOwnProfile && profile && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          recipientId={userId}
          recipientName={profile.company_name || profile.user_id}
          subject={`Connection Request`}
        />
      )}
    </div>
  )
}

export default Profile

