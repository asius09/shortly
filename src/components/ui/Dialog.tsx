"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Card } from "./Card";

interface DialogContextType {
  open: (options?: {
    title?: string;
    subTitle?: string;
    content?: ReactNode;
  }) => void;
  close: () => void;
  isOpen: boolean;
  title?: string;
  subTitle?: string;
  content?: ReactNode;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return ctx;
};

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [subTitle, setSubTitle] = useState<string | undefined>(undefined);
  const [content, setContent] = useState<ReactNode>(null);

  const open = (options?: {
    title?: string;
    subTitle?: string;
    content?: ReactNode;
  }) => {
    setTitle(options?.title);
    setSubTitle(options?.subTitle);
    setContent(options?.content ?? null);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setTitle(undefined);
    setSubTitle(undefined);
    setContent(null);
  };

  return (
    <DialogContext.Provider
      value={{ open, close, isOpen, title, subTitle, content }}
    >
      {children}
      {isOpen && (
        <div
          className="bg-background/20 fixed inset-0 z-50 flex h-full w-full items-center justify-center backdrop-blur-[4px]"
          onClick={close}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Card title={title ?? ""} subTitle={subTitle ?? ""}>
              {content}
            </Card>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

// Optional to use Raw
interface DialogProps {
  children: React.ReactNode;
  title: string;
  subTitle: string;
}

export const Dialog = ({ children, title, subTitle }: DialogProps) => {
  return (
    <div className="bg-background/20 fixed inset-0 z-50 flex h-full w-full items-center justify-center backdrop-blur-[4px]">
      <Card title={title} subTitle={subTitle}>
        {children}
      </Card>
    </div>
  );
};
