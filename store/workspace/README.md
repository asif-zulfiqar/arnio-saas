# Workspace Store

This is the main state management store for the workspace-based chat application. It consolidates all functionality from the previous conversation and analytics stores into a unified workspace structure.

## Structure

### Workspace Information
- `currentWorkspace`: Contains workspace details, settings, and configuration
- `teamMembers`: Array of all team members in the workspace
- `currentUser`: Information about the currently logged-in user

### Conversations
All conversation-related functionality has been migrated from the previous `conversationStore`:
- `conversations`: Array of all conversations in the workspace
- `activeConversationId`: Currently selected conversation
- `searchTerm`: Current search term for filtering conversations

### Analytics
Analytics data and UI state migrated from `analyticsStore`:
- `analytics`: Contains all analytics data (metrics, charts, etc.)
- `ui`: UI state for analytics components (calendar, dropdowns, etc.)

## Key Features

### Team Management
- `getTeamMemberAvatars()`: Get avatar URLs for profile dropdown
- `getOnlineTeamMembers()`: Get currently online team members
- `updateTeamMemberStatus()`: Update member online/offline status
- `addTeamMember()`: Add new team member to workspace
- `removeTeamMember()`: Remove team member from workspace

### Conversation Management
All existing conversation methods are preserved:
- `addConversation()`, `sendMessage()`, `receiveMessage()`
- `setActiveConversation()`, `getActiveConversation()`
- `setDraftMessage()`, `generateAIInitialMessage()`
- `setSearchTerm()`, `getFilteredConversations()`

### Analytics
All analytics functionality is preserved:
- `toggleCalendar()`, `toggleExportDropdown()`
- `setHoveredPoint()`, `loadData()`
- `getWorkspaceAnalytics()`: Get workspace-specific analytics

### Workspace-Specific Features
- `updateWorkspaceSettings()`: Update workspace configuration
- `getMyConversations()`: Get conversations assigned to current user
- `assignConversation()`: Assign conversation to specific team member
- `getWorkspaceAnalytics()`: Get analytics with workspace context

## Migration Notes

All components have been updated to use `useWorkspaceStore` instead of the previous separate stores:
- `useConversationStore` → `useWorkspaceStore`
- `useAnalyticsStore` → `useWorkspaceStore`

The API remains the same for all existing functionality, ensuring backward compatibility.

## Usage

```javascript
import { useWorkspaceStore } from "@/store/workspace/workspaceStore";

const MyComponent = () => {
  const { 
    conversations, 
    teamMembers, 
    addConversation,
    getTeamMemberAvatars 
  } = useWorkspaceStore();
  
  // Use workspace functionality
};
```
