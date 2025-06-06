"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Search, Plus, Check } from "lucide-react"

export interface User {
  id: number
  username: string
  handle: string
  avatar?: string
}

interface CreateGroupChatProps {
  onClose: () => void
  onCreateGroup: (groupName: string, members: User[]) => void
  availableUsers: User[]
}

export function CreateGroupChat({ onClose, onCreateGroup, availableUsers }: CreateGroupChatProps) {
  const [groupName, setGroupName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<User[]>([])

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !selectedMembers.some((member) => member.id === user.id)
  )

  const handleAddMember = (user: User) => {
    setSelectedMembers([...selectedMembers, user])
  }

  const handleRemoveMember = (userId: number) => {
    setSelectedMembers(selectedMembers.filter((user) => user.id !== userId))
  }

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedMembers.length > 0) {
      onCreateGroup(groupName, selectedMembers)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Create New Group Chat</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mb-4"
          />

          <div className="space-y-2">
            <div className="text-sm font-medium">Selected Members</div>
            {selectedMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No members selected yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    <span>{member.username}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1 p-0"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            <div className="text-sm font-medium mb-2">Users</div>
            {filteredUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found</p>
            ) : (
              <div className="space-y-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleAddMember(user)}
                    className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mr-2" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.handle}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateGroup}
              disabled={!groupName.trim() || selectedMembers.length === 0}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Create Group
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
