import React from "react";
import useSettingsStore from "../../../store/settings/settingsStore";
import TeamMemberRow from "./TeamMemberRow";
import AddTeamMemberModal from "./AddTeamMemberModal";
import EditTeamMemberModal from "./EditTeamMemberModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EmptyTeamState from "./EmptyTeamState";
import Modal from "@/components/global/Modal";

const TeamManagement = () => {
  const {
    teamMembers,
    showAddMemberModal,
    showEditMemberModal,
    showDeleteModal,
    toggleAddMemberModal,
    toggleEditMemberModal,
    toggleDeleteModal,
    getPaginatedMembers,
    currentPage,
    getTotalPages,
    setCurrentPage,
  } = useSettingsStore();

  const paginatedMembers = getPaginatedMembers();
  const totalPages = getTotalPages();

  // Check if we have team members
  const hasTeamMembers = teamMembers.length > 0;

  if (!hasTeamMembers) {
    return (
      <>
        <EmptyTeamState />
        {showAddMemberModal && (
          <Modal title="Add Team Member" onClose={toggleAddMemberModal}>
            <AddTeamMemberModal onClose={toggleAddMemberModal} />
          </Modal>
        )}
      </>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-4">
        {/* Header with Add Team Member button */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Team Management
          </h2>
          <button
            onClick={toggleAddMemberModal}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white font-inter font-medium text-[12px] rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-3.5 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={4}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Team Member
          </button>
        </div>

        {/* Table - WITHOUT overflow constraints */}
        <div className="bg-white -mx-4 relative">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-[16px] py-4 text-xs font-semibold text-[#6B7280] uppercase leading-[150%]">
                  USER
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase leading-[150%]">
                  EMAIL
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#6B7280] uppercase leading-[150%]">
                  USER ROLE
                </th>
                <th className="text-right px-8 py-4 pr-30 text-xs font-semibold text-[#6B7280] uppercase leading-[150%]">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMembers.map((member) => (
                <TeamMemberRow key={member.id} member={member} />
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-8 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-normal text-gray-500">
              Showing{" "}
              <span className="font-medium text-gray-900">
                {Math.min((currentPage - 1) * 5 + 1, teamMembers.length)}
              </span>
              <span className="font-medium text-gray-900"> -</span>
              <span className="font-medium text-gray-900">
                {Math.min(currentPage * 5, teamMembers.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-900">
                {teamMembers.length}
              </span>
            </div>

            {totalPages > 1 && (
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals - Now using Global Modal */}
      {showAddMemberModal && (
        <Modal title="Add Team Member" onClose={toggleAddMemberModal}>
          <AddTeamMemberModal onClose={toggleAddMemberModal} />
        </Modal>
      )}

      {showEditMemberModal && (
        <Modal title="Edit Team Member" onClose={toggleEditMemberModal}>
          <EditTeamMemberModal onClose={toggleEditMemberModal} />
        </Modal>
      )}

      {showDeleteModal && (
        <Modal onClose={toggleDeleteModal}>
          <DeleteConfirmationModal onClose={toggleDeleteModal} />
        </Modal>
      )}
    </div>
  );
};

export default TeamManagement;
