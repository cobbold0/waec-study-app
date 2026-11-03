"use client";

import React from "react";
import { AdGatedDownloadModal } from "@/components/ads/AdGatedDownloadModal";
import { useAdGatedDownload } from "@/components/ads/useAdGatedDownload";

export function DownloadRevisionButton({ subjectTitle }: { subjectTitle?: string }) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const { clickCount, isModalOpen, setIsModalOpen, handleDownloadClick, handleModalConfirm } = useAdGatedDownload({
    onFinalDownload: handlePrint,
  });

  return (
    <>
      <button
        type="button"
        onClick={handleDownloadClick}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-[0.98] transition cursor-pointer"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {clickCount === 1
          ? "Click to Continue (2/3)"
          : clickCount === 2
            ? "Final Click to Open (3/3)"
            : "Download Revision & Questions Sheet (PDF)"}
      </button>

      <AdGatedDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleModalConfirm}
        fileName={subjectTitle ? `${subjectTitle.replace(/[^a-zA-Z0-9]/g, "-")}-Revision.pdf` : "WAEC-Revision-Sheet.pdf"}
      />
    </>
  );
}
