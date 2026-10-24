import React from "react";
import { Navbar } from "./components/Navbar.tsx";
import { Footer } from "./components/Footer.tsx";
import { LandingPage } from "./components/LandingPage.tsx";
import { WorkspaceLayout } from "./components/WorkspaceLayout.tsx";
import { EventBriefModal } from "./components/EventBriefModal.tsx";
import { GeneratingPlanModal } from "./components/GeneratingPlanModal.tsx";
import { ClientShareModal } from "./components/ClientShareModal.tsx";
import { AskFestiyaDrawer } from "./components/AskFestiyaDrawer.tsx";
import { BillingPortalModal } from "./components/BillingPortalModal.tsx";
import { AccountExportModal } from "./components/AccountExportModal.tsx";
import { SharedEventView } from "./components/SharedEventView.tsx";
import { useFestiyaState } from "./hooks/useFestiyaState.ts";

export const App: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeTab,
    setActiveTab,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    events,
    activeEvent,
    entitlements,
    activePlan,
    budgetItems,
    tasks,
    vendors,
    ideas,
    risks,
    runOfShow,
    activeShare,
    sharedData,
    isEventBriefOpen,
    setIsEventBriefOpen,
    briefInitialValues,
    setBriefInitialValues,
    isGenerating,
    generatingEventName,
    isShareModalOpen,
    setIsShareModalOpen,
    isAskFestiyaOpen,
    setIsAskFestiyaOpen,
    askFestiyaInitialPrompt,
    setAskFestiyaInitialPrompt,
    isBillingModalOpen,
    setIsBillingModalOpen,
    isExportModalOpen,
    setIsExportModalOpen,
    loadWorkspaceEvents,
    loadEntitlements,
    selectEvent,
    loadSharedEvent,
    handleCreateEvent,
    handleRegeneratePlan,
    handleRequestRevision,
    handleApplyProposedPlan,
    handleAddBudgetItem,
    handleUpdateBudgetItem,
    handleDeleteBudgetItem,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleAddVendor,
    handleUpdateVendor,
    handleDeleteVendor,
    handleAcceptIdea,
    handleToggleResolveRisk,
    handleAddRunOfShowItem,
    handleDeleteRunOfShowItem,
    handleCreateShare,
    handleRevokeShare,
    handleUpgradeTier,
    handleDownloadProposalMarkdown,
    handleDownloadGdprJson,
    handleExploreDemoEvent,
  } = useFestiyaState();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {currentView === "shared" && sharedData ? (
        <SharedEventView
          event={sharedData.event}
          plan={sharedData.plan}
          budgetItems={sharedData.budgetItems}
          tasks={sharedData.tasks}
          vendors={sharedData.vendors}
          ideas={sharedData.ideas}
          runOfShow={sharedData.runOfShow}
          allowedSections={sharedData.allowedSections}
          role={sharedData.role}
          onExitPreview={() => {
            setCurrentView("workspace");
            window.history.replaceState({}, "", "/");
          }}
        />
      ) : (
        <>
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            workspaces={workspaces}
            activeWorkspace={activeWorkspace}
            onSelectWorkspace={async (ws) => {
              setActiveWorkspace(ws);
              await loadWorkspaceEvents(ws.id);
              await loadEntitlements(ws.id);
            }}
            events={events}
            activeEvent={activeEvent}
            onSelectEvent={selectEvent}
            onOpenNewEventModal={() => {
              setBriefInitialValues(undefined);
              setIsEventBriefOpen(true);
            }}
            onOpenBillingModal={() => setIsBillingModalOpen(true)}
          />

          {currentView === "landing" && (
            <LandingPage
              onStartPlan={(brief) => {
                setBriefInitialValues(brief);
                setIsEventBriefOpen(true);
              }}
              onExploreDemoEvent={handleExploreDemoEvent}
              onGoToPricing={() => setIsBillingModalOpen(true)}
              availableEvents={events}
            />
          )}

          {currentView === "workspace" && activeEvent && (
            <WorkspaceLayout
              event={activeEvent}
              plan={activePlan}
              budgetItems={budgetItems}
              tasks={tasks}
              vendors={vendors}
              ideas={ideas}
              risks={risks}
              runOfShow={runOfShow}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onBackToLanding={() => setCurrentView("landing")}
              onOpenAskFestiya={(prompt) => {
                setAskFestiyaInitialPrompt(prompt || "");
                setIsAskFestiyaOpen(true);
              }}
              onOpenShareModal={() => setIsShareModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onRegeneratePlan={handleRegeneratePlan}
              isRegenerating={isGenerating}
              onAddBudgetItem={handleAddBudgetItem}
              onUpdateBudgetItem={handleUpdateBudgetItem}
              onDeleteBudgetItem={handleDeleteBudgetItem}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onAddVendor={handleAddVendor}
              onUpdateVendor={handleUpdateVendor}
              onDeleteVendor={handleDeleteVendor}
              onAcceptIdea={handleAcceptIdea}
              onToggleResolveRisk={handleToggleResolveRisk}
              onAddRunOfShowItem={handleAddRunOfShowItem}
              onDeleteRunOfShowItem={handleDeleteRunOfShowItem}
            />
          )}

          {currentView === "pricing" && (
            <div className="container" style={{ padding: "60px 20px" }}>
              <div style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1 className="serif-heading" style={{ fontSize: "36px", marginBottom: "12px" }}>
                  Workspace Plans & Entitlements
                </h1>
                <p style={{ color: "var(--ink-secondary)", fontSize: "16px" }}>
                  Scale from personal celebrations to multi-planner agencies with transparent limits.
                </p>
              </div>

              {activeWorkspace && (
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                  <button
                    aria-label="Open billing and subscription manager"
                    onClick={() => setIsBillingModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Open Billing & Subscription Manager
                  </button>
                </div>
              )}
            </div>
          )}

          <Footer
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenPricing={() => setIsBillingModalOpen(true)}
          />

          <EventBriefModal
            isOpen={isEventBriefOpen}
            onClose={() => setIsEventBriefOpen(false)}
            onSubmit={handleCreateEvent}
            initialValues={briefInitialValues as any}
          />

          <GeneratingPlanModal
            isOpen={isGenerating}
            eventName={generatingEventName}
          />

          {activeEvent && (
            <>
              <ClientShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                event={activeEvent}
                share={activeShare}
                onCreateShare={handleCreateShare}
                onRevokeShare={handleRevokeShare}
                onOpenPreview={(token) => {
                  setIsShareModalOpen(false);
                  loadSharedEvent(token);
                }}
              />

              <AskFestiyaDrawer
                isOpen={isAskFestiyaOpen}
                onClose={() => setIsAskFestiyaOpen(false)}
                event={activeEvent}
                initialPrompt={askFestiyaInitialPrompt}
                onRequestRevision={handleRequestRevision}
                onApplyPlan={handleApplyProposedPlan}
              />

              <AccountExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                event={activeEvent}
                onDownloadProposalMarkdown={handleDownloadProposalMarkdown}
                onDownloadGdprJson={handleDownloadGdprJson}
              />
            </>
          )}

          {activeWorkspace && (
            <BillingPortalModal
              isOpen={isBillingModalOpen}
              onClose={() => setIsBillingModalOpen(false)}
              workspace={activeWorkspace}
              entitlements={entitlements}
              onUpgradeTier={handleUpgradeTier}
            />
          )}
        </>
      )}
    </div>
  );
};
