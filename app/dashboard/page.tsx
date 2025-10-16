"use client"

import { useState, useEffect } from "react"
import { AdminAuthProtect } from "@/components/auth-protect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Heart, Trash2, Image as ImageIcon, Globe, ArrowUpDown, Check, X, Settings } from "lucide-react"
import { getApprovedPosts, getAllPosts, deletePost } from "@/lib/actions/posts"
import { togglePostVisibility } from "@/lib/actions/visibility"
import { getFilteredPosts } from "@/lib/actions/visibility"
import { Post } from "@/lib/supabase/types"
import { useRealtimePosts } from "@/hooks/use-realtime-posts"
import { format } from "date-fns"
import { ToggleSwitch } from "@/components/ui/toggle-switch"

export default function AdminDashboard() {
  const realtimePosts = useRealtimePosts()
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<string>('all')

  const allPosts = realtimePosts
  const approvedPosts = realtimePosts.filter(post => post.status === 'approved')
  const pendingPosts = realtimePosts.filter(post => post.status === 'pending')

  // Filter posts by date
  const getFilteredData = (posts: any[]) => {
    if (dateFilter === 'all') return posts
    
    const today = new Date()
    let filterDate: Date
    
    switch (dateFilter) {
      case 'today':
        filterDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        break
      case 'week':
        filterDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        filterDate = new Date(today.getFullYear(), today.getMonth(), 1)
        break
      default:
        return posts
    }
    
    return posts.filter(post => new Date(post.created_at) >= filterDate)
  }

  const filteredAllPosts = getFilteredData(allPosts)
  const filteredApprovedPosts = getFilteredData(approvedPosts)
  const filteredPendingPosts = getFilteredData(pendingPosts)

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }
    
    try {
      setActionLoading(postId)
      await deletePost(postId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete post")
    } finally {
      setActionLoading(null)
    }
  }

  const handleToggleVisibility = async (postId: string, isVisible: boolean) => {
    try {
      setActionLoading(`visibility-${postId}`)
      await togglePostVisibility(postId, isVisible)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update visibility")
    } finally {
      setActionLoading(null)
    }
  }

  

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const PostCard = ({ post, showActions = false }: { post: Post, showActions?: boolean }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.image_url || undefined} />
              <AvatarFallback>
                {post.is_anonymous ? '👤' : post.name?.charAt(0)?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-sm">
                {post.is_anonymous ? 'Anonymous' : post.name || 'Anonymous'}
              </CardTitle>
              <CardDescription className="text-xs">
                {format(new Date(post.created_at), 'MMM d, yyyy at h:mm a')}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Visibility Status */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border">
              {post.is_visible ? (
                <>
                  <Globe className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Visible</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3 text-gray-500" />
                  <span className="text-gray-500">Hidden</span>
                </>
              )}
            </div>
            
            <Badge className={getStatusColor(post.status)}>
              {post.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-3">{post.content}</p>
        {post.image_url && (
          <div className="mb-3">
            <img
              src={post.image_url}
              alt="Memory image"
              className="rounded-lg max-w-full h-auto max-h-48 object-cover"
            />
          </div>
        )}
        {/* Stats Bar */}
        <div className="flex items-center justify-between py-2 border-t">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{post.likes_count || 0} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.is_visible ? 'Visible' : 'Hidden'}</span>
            </div>
          </div>
        </div>

        {/* Validation Controls */}
        {showActions && (
          <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border py-4 px-4 shadow-sm">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Validasi Tampil di Homepage:</span>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border">
                  {post.is_visible ? (
                    <>
                      <Globe className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">AKTIF</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 text-red-600" />
                      <span className="text-red-600">NONAKTIF</span>
                    </>
                  )}
                </div>
              </div>
              <ToggleSwitch
                checked={post.is_visible}
                onChange={(checked) => handleToggleVisibility(post.id, checked)}
                disabled={actionLoading === `validation-${post.id}`}
                size="sm"
              />
            </div>

            {/* Validation Status */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">Status Validasi:</span>
              </div>
              <div className="flex items-center gap-1">
                {post.is_visible ? (
                  <>
                    <Check className="h-3 w-3 text-green-600" />
                    <span className="text-green-600 font-medium">Disetujui</span>
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 text-red-600" />
                    <span className="text-red-600 font-medium">Disembunyikan</span>
                  </>
                )}
              </div>
            </div>

            {/* Delete Action */}
            <div className="flex justify-end pt-2 border-t">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(post.id)}
                disabled={actionLoading === post.id}
                className="gap-2"
              >
                {actionLoading === post.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Hapus Data
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  

  return (
    <AdminAuthProtect>
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Admin Instructions */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
              <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Panduan Validasi Data MAHWA 2006
              </h3>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <p>• <strong>AKTIF (ON)</strong> = Data akan tampil di homepage untuk semua pengunjung</p>
                <p>• <strong>NONAKTIF (OFF)</strong> = Data disembunyikan dari homepage (disimpan tetapi tidak tampil)</p>
                <p>• Toggle di setiap data untuk mengatur visibility secara real-time</p>
                <p>• Status validasi langsung update tanpa perlu reload halaman</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">MAHWA 2006 - Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all shared memories - auto-approved system
          </p>
        </div>
        
        {/* Filter & Validation Controls */}
        <div className="flex items-center gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-background"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Validation Stats */}
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <Globe className="h-3 w-3 text-green-600" />
              <span className="text-green-600 font-medium">
                {filteredAllPosts.filter(p => p.is_visible !== false).length} Aktif
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <EyeOff className="h-3 w-3 text-red-600" />
              <span className="text-red-600 font-medium">
                {filteredAllPosts.filter(p => p.is_visible === false).length} Nonaktif
              </span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="approved" className="w-full">
        <TabsList>
          <TabsTrigger value="approved">
            Published ({filteredApprovedPosts.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All Posts ({filteredAllPosts.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({filteredPendingPosts.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({filteredAllPosts.filter(p => p.status === 'rejected').length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          <div className="space-y-4">
            {filteredPendingPosts.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">
                    {dateFilter === 'all' ? 'No pending posts to review' : `No pending posts for ${dateFilter}`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredPendingPosts.map(post => (
                <PostCard key={post.id} post={post} showActions={true} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {filteredAllPosts.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">
                    {dateFilter === 'all' ? 'No posts found' : `No posts for ${dateFilter}`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAllPosts.map(post => (
                <PostCard key={post.id} post={post} showActions={true} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-4">
          <div className="space-y-4">
            {filteredApprovedPosts.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">
                    {dateFilter === 'all' ? 'No approved posts found' : `No approved posts for ${dateFilter}`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredApprovedPosts.map(post => (
                <PostCard key={post.id} post={post} showActions={false} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-4">
          <div className="space-y-4">
            {filteredAllPosts.filter(p => p.status === 'rejected').length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center h-32">
                  <p className="text-muted-foreground">
                    {dateFilter === 'all' ? 'No rejected posts found' : `No rejected posts for ${dateFilter}`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredAllPosts.filter(p => p.status === 'rejected').map(post => (
                <PostCard key={post.id} post={post} showActions={false} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </AdminAuthProtect>
  )
}