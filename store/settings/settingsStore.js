import { create } from "zustand";

const useSettingsStore = create((set, get) => ({
  // Active tab
  activeTab: "team-management",

  // Team members data
  teamMembers: [
    {
      id: 1,
      name: "Lisa Taylor",
      email: "jese.leos92@gmail.com",
      role: "Admin",
      initials: "LT",
      avatar: "/images/user1.jpg",
    },
    {
      id: 2,
      name: "Jese Leos",
      email: "bonnie_g23@gmail.com",
      role: "User",
      initials: "JL",
      avatar: "/images/user2.jpg",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "l.livingston@gmail.com",
      role: "Manager",
      initials: "MC",
      avatar: null,
    },
    {
      id: 4,
      name: "Sophia Martinez",
      email: "micheal.g88@gmail.com",
      role: "User",
      initials: "SM",
      avatar: null,
    },
    {
      id: 5,
      name: "Carlos Rivera",
      email: "mcfall.joseph21@gmail.com",
      role: "Manager",
      initials: "CR",
      avatar: "/images/user3.jpg",
    },
  ],

  // UI states
  showAddMemberModal: false,
  showEditMemberModal: false,
  showDeleteModal: false,
  editingMember: null,
  deletingMember: null,
  selectedRole: "User",

  // Pagination
  currentPage: 1,
  itemsPerPage: 5,

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Team member actions
  addTeamMember: (member) =>
    set((state) => ({
      teamMembers: [...state.teamMembers, { ...member, id: Date.now() }],
      showAddMemberModal: false,
    })),

  updateTeamMember: (id, updates) =>
    set((state) => ({
      teamMembers: state.teamMembers.map((member) =>
        member.id === id ? { ...member, ...updates } : member
      ),
      showEditMemberModal: false,
      editingMember: null,
    })),

  deleteTeamMember: (id) =>
    set((state) => ({
      teamMembers: state.teamMembers.filter((member) => member.id !== id),
      showDeleteModal: false,
      deletingMember: null,
    })),

  // Modal actions
  toggleAddMemberModal: () =>
    set((state) => ({ showAddMemberModal: !state.showAddMemberModal })),

  toggleEditMemberModal: () =>
    set((state) => ({ showEditMemberModal: !state.showEditMemberModal })),

  toggleDeleteModal: () =>
    set((state) => ({ showDeleteModal: !state.showDeleteModal })),

  setEditingMember: (member) =>
    set({ editingMember: member, showEditMemberModal: true }),

  setDeletingMember: (member) => set({ deletingMember: member }),

  // Role selection
  setSelectedRole: (role) => set({ selectedRole: role }),

  // Get paginated members
  getPaginatedMembers: () => {
    const state = get();
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    return state.teamMembers.slice(startIndex, endIndex);
  },

  // Get total pages
  getTotalPages: () => {
    const state = get();
    return Math.ceil(state.teamMembers.length / state.itemsPerPage);
  },

  // Set current page
  setCurrentPage: (page) => set({ currentPage: page }),
}));

export default useSettingsStore;
