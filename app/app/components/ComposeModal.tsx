import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Clock, Mail, MoreVertical, Trash2, UserPlus, Maximize2, Minimize2,
  Paperclip, Image as ImageIcon, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, ChevronDown, Folder, Mic, Minus, Check, X
} from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import clsx from "clsx";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { getMessageDetail } from "@/lib/api/message_viewer";
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { TranscriptDownloader } from "./TranscriptDownloader";
import { FontSize } from './FontSize';

import {
  getUserProfile as getUserProfileApi,
  getMailAccount,
  sendMessage as sendMessageApi,
  replyToMessage,
  replyAllToMessage,
  forwardMessage,
  createDraft as createDraftApi,
  updateDraft as updateDraftApi,
  deleteDraft as deleteDraftApi,
  getDraft as getDraftApi,
  uploadAttachment as uploadAttachmentApi
} from '@/lib/api/compose';
import { getUserProfile as getUserProfileAuth } from '@/lib/api/auth';
import { getAccessToken } from '@/lib/token_manager';

// Define ComposeDraftData interface locally since the import path is inconsistent
export interface ComposeDraftData {
  subject?: string;
  textBody?: string;
  htmlBody?: string;
  to?: Array<{ name?: string; email: string }>;
  cc?: Array<{ name?: string; email: string }>;
  bcc?: Array<{ name?: string; email: string }>;
  attachmentIds?: string[];
  replyToMessageId?: string;
}

export type ComposeAction = "new" | "reply" | "replyAll" | "forward" | "editAsNew" | "draft";

export function ComposeModal({ isOpen, onClose, action = "new", initialData }: { isOpen: boolean; onClose: () => void; action?: ComposeAction; initialData?: any }) {
  const dragControls = useDragControls();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(file => {
        handleFileUpload(file);
      });
    }
  };

  // formatting state
  const [font, setFont] = useState("Verdana");
  const [fontSize, setFontSize] = useState("10");
  const [alignment, setAlignment] = useState("left");
  const [expiry, setExpiry] = useState("1 week");
  const [expiryOpen, setExpiryOpen] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [fromAccount, setFromAccount] = useState<{ name: string; email: string } | null>(null);
  const [attachments, setAttachments] = useState<{ name: string, url: string, uploadId?: string, attachmentId?: string, size?: number, mimeType?: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [identities, setIdentities] = useState<{ id: string; email: string; displayName?: string; type: string; isDefault: boolean }[]>([]);
  const [identitiesLoading, setIdentitiesLoading] = useState(true);
  const [identitiesError, setIdentitiesError] = useState<string | null>(null);

  // State for storing the immutable quoted history
  const [quoteHTML, setQuoteHTML] = useState<string>('');
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    setSendError(null);
    setDraftId(null);
    setLastSaved(null);
    setIsLoadingDraft(false);
    setQuoteHTML('');

    // Fetch identities from backend and then initialize compose
    fetchIdentities().then((accountEmail) => {
      // Initialize compose state from backend for reply/forward modes
      if (action !== 'new' && action !== 'draft') {
        initializeCompose(accountEmail);
      }
    });

    if (initialData && action === 'draft') {
      // Handle draft restoration - always fetch full draft data from backend
      if (initialData.id) {
        setIsLoadingDraft(true);
        // Fetch full draft data from API using the backend draft ID
        fetchDraftData(initialData.id);
      } else {
        console.error('[Compose] Draft opened but no ID provided');
        setSendError('Cannot open draft: missing draft ID');
      }
    } else if (action === 'new') {
      // Clear state for new mail
      setToInput("");
      setCcInput("");
      setBccInput("");
      setSubjectInput("");

      if (initialData?.attachments) {
        setAttachments(initialData.attachments);
      } else {
        setAttachments([]);
      }
    }
  }, [isOpen, action, initialData]);

  // Real identities fetch using API
  const fetchIdentities = async () => {
    setIdentitiesLoading(true);
    setIdentitiesError(null);

    try {
      console.log('[Compose] Fetching identities...');

      const accessToken = getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      // Use the same getUserProfile API as in the header
      const profileResponse = await getUserProfileAuth(accessToken);
      console.log('[Compose] Profile response:', profileResponse);

      if (profileResponse) {
        // Extract name from email (first word before @)
        const emailName = profileResponse.email.split('@')[0];
        // Capitalize first letter for display name
        const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);

        console.log('[Compose] Profile data:', profileResponse);
        console.log('[Compose] Display name:', displayName);
        console.log('[Compose] Email:', profileResponse.email);

        const identity = {
          id: profileResponse.id,
          email: profileResponse.email,
          displayName: displayName,
          type: 'primary',
          isDefault: true
        };

        setIdentities([identity]);
        setFromAccount({ name: displayName, email: profileResponse.email });

        console.log('[Compose] From account set:', { name: displayName, email: profileResponse.email });
        return profileResponse.email;
      } else {
        console.error('[Compose] Profile response unsuccessful');
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('[Compose] Failed to fetch identities:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load identities';
      setIdentitiesError(errorMessage);
      setSendError(errorMessage);
    } finally {
      setIdentitiesLoading(false);
    }
  };

  // Fetch draft data from API
  const fetchDraftData = async (draftId: string) => {
    try {
      const response = await getDraftApi(draftId);
      if (response.success && response.data) {
        const draft = response.data;
        setToInput(draft.to?.map((t: any) => t.email).join(', ') || '');
        setCcInput(draft.cc?.map((c: any) => c.email).join(', ') || '');
        setBccInput(draft.bcc?.map((b: any) => b.email).join(', ') || '');
        setSubjectInput(draft.subject || '');
        setDraftId(draft.id);

        // Small delay to ensure editor is ready before setting content
        setTimeout(() => {
          if (draft.html_body && editor) {
            editor.commands.setContent(draft.html_body);
          } else if (draft.text_body && editor) {
            editor.commands.setContent(draft.text_body);
          }
        }, 100);

        // Handle attachments if present
        if (draft.attachment_ids && draft.attachment_ids.length > 0) {
          // Note: We might need to fetch attachment details separately
          // For now, we'll store the IDs
          setAttachments(draft.attachment_ids.map((id: string) => ({
            name: `Attachment-${id}`,
            url: '#',
            uploadId: id,
            attachmentId: id,
          })));
        }
      }
    } catch (error) {
      console.error('Failed to fetch draft data:', error);
      setSendError(error instanceof Error ? error.message : 'Failed to load draft');
    } finally {
      setIsLoadingDraft(false);
    }
  };

  // Real initialize compose using API
  const initializeCompose = async (accountEmail?: string) => {
    if (!isOpen || action === 'new') return;

    try {
      // Set basic compose state from initialData
      if (initialData) {
        // Handle different compose actions
        const dateStr = initialData.rawDate || initialData.received_at || initialData.sent_at || initialData.date || new Date().toISOString();

        if (action === 'reply' || action === 'replyAll') {
          // Check if we sent this email (if from matches our current account)
          const userEmail = accountEmail || fromAccount?.email;
          const fromArray = Array.isArray(initialData.from) ? initialData.from :
            (initialData.from ? [{ email: initialData.from, name: initialData.senderName }] : []);
          const isFromMe = userEmail && fromArray.some((f: any) => f?.email === userEmail);

          const toArray = Array.isArray(initialData.to) ? initialData.to :
            (initialData.to ? [{ email: initialData.to }] : []);
          const replyToArray = Array.isArray(initialData.reply_to) ? initialData.reply_to :
            (initialData.reply_to ? [{ email: initialData.reply_to }] : []);

          const getEmail = (obj: any) => typeof obj === 'string' ? obj : (obj?.email || obj?.address || '');

          // Reply to the sender, or if we sent it, reply to the original recipients
          const replyTo = isFromMe
            ? (toArray.map(getEmail).filter(Boolean).join(', ') || (typeof initialData.to === 'string' ? initialData.to : ''))
            : (replyToArray.map(getEmail).filter(Boolean).join(', ') ||
              fromArray.map(getEmail).filter(Boolean).join(', ') ||
              (typeof initialData.from === 'string' ? initialData.from : '') || initialData.senderEmail || '');

          if (action === 'replyAll') {
            const ccArray = Array.isArray(initialData.cc) ? initialData.cc :
              (initialData.cc ? [{ email: initialData.cc }] : []);
            const bccArray = Array.isArray(initialData.bcc) ? initialData.bcc :
              (initialData.bcc ? [{ email: initialData.bcc }] : []);

            // Include original recipients (excluding self ideally, but we'll include all for now)
            const allRecipients = toArray.map(getEmail).filter(Boolean).join(', ') || (typeof initialData.to === 'string' ? initialData.to : '');
            const senders = fromArray.map(getEmail).filter(Boolean).join(', ') || (typeof initialData.from === 'string' ? initialData.from : '') || initialData.senderEmail || '';
            setToInput([senders, allRecipients].filter(Boolean).join(', '));
            setCcInput(ccArray.map(getEmail).filter(Boolean).join(', ') || (typeof initialData.cc === 'string' ? initialData.cc : ''));
            setBccInput(bccArray.map(getEmail).filter(Boolean).join(', ') || (typeof initialData.bcc === 'string' ? initialData.bcc : ''));
          } else {
            setToInput(replyTo);
          }

          // Pre-fill subject with Re: prefix if not already present
          const replySubject = initialData.subject || '';
          setSubjectInput(replySubject.startsWith('Re:') ? replySubject : `Re: ${replySubject}`);

          // Fetch full message if needed
          let fullBody = initialData.html_body || initialData.text_body;
          if (!fullBody && initialData.id) {
            try {
              const detail = await getMessageDetail(initialData.id);
              if (detail) {
                fullBody = detail.html_body || detail.text_body;
              }
            } catch (e) {
              console.error("Failed to fetch full message for reply:", e);
            }
          }

          // Add quoted reply body
          const bodyContent = fullBody || initialData.preview || initialData.body || '';
          if (bodyContent) {
            const senderName = initialData.from?.[0]?.name || initialData.from?.[0]?.email || initialData.senderName || 'Unknown';
            let formattedDate = dateStr;
            const parsedDate = new Date(dateStr);
            if (!isNaN(parsedDate.getTime())) {
              formattedDate = parsedDate.toLocaleString();
            }

            const quotedBody = `
<br><br>
<hr style="border: none; border-top: 1px solid rgba(128, 128, 128, 0.2); margin: 24px 0;">
<div class="gmail_quote" style="border-left: 2px solid rgba(128, 128, 128, 0.2); padding-left: 16px; margin-left: 4px;">
  <div dir="ltr" class="gmail_attr" style="font-weight: 600; opacity: 1; margin-bottom: 12px;">On ${formattedDate}, ${senderName} wrote:</div>
  <div style="opacity: 0.7;">
    ${bodyContent}
  </div>
</div>
`;
            setQuoteHTML(quotedBody);
          }
        } else if (action === 'forward') {
          // Pre-fill subject with Fwd: prefix if not already present
          const forwardSubject = initialData.subject || '';
          setSubjectInput(forwardSubject.startsWith('Fwd:') ? forwardSubject : `Fwd: ${forwardSubject}`);

          // Fetch full message if needed
          let fullBody = initialData.html_body || initialData.text_body;
          if (!fullBody && initialData.id) {
            try {
              const detail = await getMessageDetail(initialData.id);
              if (detail) {
                fullBody = detail.html_body || detail.text_body;
              }
            } catch (e) {
              console.error("Failed to fetch full message for forward:", e);
            }
          }

          // Add forwarded message body
          const bodyContent = fullBody || initialData.preview || initialData.body || '';
          if (bodyContent) {
            const senderName = initialData.from?.[0]?.name || initialData.from?.[0]?.email || initialData.senderName || 'Unknown';
            const senderEmail = initialData.from?.[0]?.email || initialData.senderEmail || '';
            const recipients = Array.isArray(initialData.to) ? initialData.to.map((t: any) => t.email).join(', ') : (initialData.to || '');

            let formattedDate = dateStr;
            const parsedDate = new Date(dateStr);
            if (!isNaN(parsedDate.getTime())) {
              formattedDate = parsedDate.toLocaleString();
            }

            const forwardedBody = `
<br><br>
<div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px;">
  <p><strong>---------- Forwarded message ----------</strong></p>
  <p>From: ${senderName} ${senderEmail ? `&lt;${senderEmail}&gt;` : ''}</p>
  <p>Date: ${formattedDate}</p>
  <p>Subject: ${forwardSubject}</p>
  <p>To: ${recipients}</p>
  <br>
  ${bodyContent}
</div>
`;
            setQuoteHTML(forwardedBody);
          }

          // Copy attachments for forwarding
          if (initialData.attachments && Array.isArray(initialData.attachments)) {
            setAttachments(initialData.attachments.map((att: any) => ({
              name: att.name || att.filename,
              url: '#',
              uploadId: att.uploadId || att.blobId,
              attachmentId: att.uploadId || att.blobId,
              size: att.size,
              mimeType: att.mimeType || att.type
            })));
          }
        } else {
          // Default handling for other actions
          setToInput(initialData.to || '');
          setCcInput(initialData.cc || '');
          setBccInput(initialData.bcc || '');
          setSubjectInput(initialData.subject || '');

          if (initialData.body && editor) {
            editor.commands.setContent(initialData.body);
          }
        }
      }
    } catch (error) {
      console.error('Failed to initialize compose:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize compose';
      setSendError(errorMessage);
    }
  };

  const handleRecordSound = () => {
    setIsRecording(true);
    setActiveDropdown(null);
  };

  const handleStopRecording = () => {
    const mins = Math.floor(recordTime / 60).toString().padStart(2, '0');
    const secs = (recordTime % 60).toString().padStart(2, '0');
    setAttachments(prev => [...prev, { name: `Voice_Message_${mins}:${secs}.wav`, url: '#' }]);
    setIsRecording(false);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Type your message here...' }),
    ],
    content: '',
  });

  useEffect(() => {
    if (!editor || !isOpen) return;

    // Only set signature if fromAccount is available and we're not loading a draft
    if (fromAccount && !isLoadingDraft) {
      const signature = `<br><br><div class="signature">--<br><strong>${fromAccount.name}</strong><br>${fromAccount.email}</div>`;

      // Body is now set by backend initializeCompose for reply/forward modes
      // For new mail only, set signature
      if (action === 'new') {
        editor.commands.setContent(`<p></p>${signature}`);
      }
      // For drafts, don't set signature - it will be loaded from the draft data
      // For reply/forward, body is set by initializeCompose
    }

    editor.commands.focus('start');
  }, [isOpen, editor, action, fromAccount, isLoadingDraft]);

  const saveDraft = useCallback(async () => {
    if (!isOpen || !fromAccount || isLoadingDraft) return;

    // Only save if at least one recipient field is filled
    if (!toInput.trim() && !ccInput.trim() && !bccInput.trim()) {
      return;
    }

    try {
      const to = toInput.split(',').map(e => e.trim()).filter(Boolean);
      const cc = ccInput.split(',').map(e => e.trim()).filter(Boolean);
      const bcc = bccInput.split(',').map(e => e.trim()).filter(Boolean);
      const apiAttachments = attachments
        .filter(a => a.attachmentId)
        .map(a => ({
          blob_id: a.attachmentId!,
          type: a.mimeType || 'application/octet-stream',
          name: a.name || 'Unnamed file',
          size: a.size || 0
        }));

      const draftData = {
        to: to.map(email => ({ email })),
        cc: cc.length > 0 ? cc.map(email => ({ email })) : undefined,
        bcc: bcc.length > 0 ? bcc.map(email => ({ email })) : undefined,
        subject: subjectInput,
        text_body: editor?.getText() || '',
        html_body: (editor?.getHTML() || '') + quoteHTML,
        attachments: apiAttachments.length > 0 ? apiAttachments : undefined,
      };

      let response;
      if (draftId) {
        // Try to update existing draft
        response = await updateDraftApi(draftId, draftData);

        // If draft not found (e.g., after server reset), create a new draft instead
        if (!response.success && response.error?.includes('draft_not_found')) {
          console.log('[Draft] Draft not found, creating new draft instead');
          setDraftId(null); // Clear the invalid draft ID
          response = await createDraftApi(draftData);
          if (response.success && response.data) {
            setDraftId(response.data.id);
          }
        } else if (response.success && response.data) {
          // Update draft ID since backend creates new draft on update (JMAP immutability)
          console.log('[Draft] Draft updated, new ID:', response.data.id);
          setDraftId(response.data.id);
        }
      } else {
        // Create new draft
        response = await createDraftApi(draftData);
        if (response.success && response.data) {
          setDraftId(response.data.id);
        }
      }

      if (response.success) {
        setLastSaved(new Date());
      } else {
        throw new Error(response.error || 'Failed to save draft');
      }
    } catch (error) {
      console.error('[Draft] Save failed:', error);
      setSendError(error instanceof Error ? error.message : 'Failed to save draft');
    }
  }, [isOpen, fromAccount, isLoadingDraft, toInput, ccInput, bccInput, subjectInput, attachments, editor, draftId, quoteHTML]);

  // Debounced autosave
  const debouncedSaveDraft = useCallback(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 2000); // 2 second debounce
  }, [saveDraft]); // Dependency on saveDraft function

  // Trigger autosave on content changes
  useEffect(() => {
    // Don't autosave while loading a draft or if modal is not open
    if (isOpen && !isLoadingDraft) {
      // Only autosave if at least one recipient field is filled
      if (toInput.trim() || ccInput.trim() || bccInput.trim()) {
        debouncedSaveDraft();
      }
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [toInput, ccInput, bccInput, subjectInput, attachments, editor?.getHTML(), isOpen, isLoadingDraft, debouncedSaveDraft]);

  const sendMessage = async (scheduledTime?: string) => {
    if (!isOpen || !fromAccount) return;
    setIsSending(true);
    setSendError(null);

    try {
      const to = toInput.split(',').map(e => e.trim()).filter(Boolean);
      const cc = ccInput.split(',').map(e => e.trim()).filter(Boolean);
      const bcc = bccInput.split(',').map(e => e.trim()).filter(Boolean);

      if (to.length === 0) {
        throw new Error('At least one recipient is required');
      }

      if (!subjectInput.trim()) {
        throw new Error('Subject is required');
      }

      const apiAttachments = attachments
        .filter(a => a.attachmentId)
        .map(a => ({
          blob_id: a.attachmentId!,
          type: a.mimeType || 'application/octet-stream',
          name: a.name || 'Unnamed file',
          size: a.size || 0
        }));

      let response;

      // Handle different compose actions
      if (action === 'reply' && initialData?.messageId) {
        const replyData = {
          from: fromAccount.email,
          to: to.map(email => ({ email })),
          subject: subjectInput,
          text_body: editor?.getText() || '',
          html_body: (editor?.getHTML() || '') + quoteHTML,
          attachments: apiAttachments.length > 0 ? apiAttachments : undefined,
        };
        console.log('[Reply] Sending reply with data:', replyData);
        response = await replyToMessage(initialData.messageId, replyData);
      } else if (action === 'replyAll' && initialData?.messageId) {
        const replyAllData = {
          from: fromAccount.email,
          to: to.map(email => ({ email })),
          cc: cc.length > 0 ? cc.map(email => ({ email })) : undefined,
          subject: subjectInput,
          text_body: editor?.getText() || '',
          html_body: (editor?.getHTML() || '') + quoteHTML,
          attachments: apiAttachments.length > 0 ? apiAttachments : undefined,
        };
        console.log('[ReplyAll] Sending reply all with data:', replyAllData);
        response = await replyAllToMessage(initialData.messageId, replyAllData);
      } else if (action === 'forward' && initialData?.messageId) {
        const forwardData = {
          from: fromAccount.email,
          to: to.map(email => ({ email })),
          subject: subjectInput,
          text_body: editor?.getText() || '',
          html_body: (editor?.getHTML() || '') + quoteHTML,
          attachments: apiAttachments.length > 0 ? apiAttachments : undefined,
        };
        console.log('[Forward] Sending forward with data:', forwardData);
        response = await forwardMessage(initialData.messageId, forwardData);
      } else {
        // Regular send or new message
        const messageData = {
          to: to.map(email => ({ email })),
          cc: cc.length > 0 ? cc.map(email => ({ email })) : undefined,
          bcc: bcc.length > 0 ? bcc.map(email => ({ email })) : undefined,
          subject: subjectInput,
          text_body: editor?.getText() || '',
          html_body: (editor?.getHTML() || '') + quoteHTML,
          attachments: apiAttachments.length > 0 ? apiAttachments : undefined,
          reply_to_message_id: initialData?.messageId,
        };
        response = await sendMessageApi(messageData);
      }

      if (response.success) {
        console.log('[Send] Message submitted successfully:', response);

        // Delete draft if it was sent
        if (draftId) {
          try {
            await deleteDraftApi(draftId);
          } catch (err) {
            console.error('[Send] Failed to delete draft after sending:', err);
          }
        }

        // Show success toast
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);

        // Dispatch an event so the message list can refresh automatically
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('mail-sent'));
        }

        onClose();
      } else {
        throw new Error(response.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('[Send] Failed:', error);
      setSendError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const discardDraft = async () => {
    if (draftId) {
      try {
        await deleteDraftApi(draftId);
      } catch (error) {
        console.error('[Discard] Failed to delete draft:', error);
      }
    }
    onClose();
  };

  const handleFileUpload = async (file: File) => {
    // Standard email attachment limit
    const MAX_FILE_SIZE = 45 * 1024 * 1024; // 45MB
    const MAX_TOTAL_SIZE = 48 * 1024 * 1024; // 48MB total limit (leaving room for email body/headers)

    if (file.size > MAX_FILE_SIZE) {
      setAttachmentError(`File ${file.name} is too large. Maximum size per attachment is 45MB.`);
      return;
    }

    const totalSize = attachments.reduce((acc, curr) => acc + (curr.size || 0), 0) + file.size;
    if (totalSize > MAX_TOTAL_SIZE) {
      setAttachmentError(`Total attachments size cannot exceed 48MB.`);
      return;
    }

    setAttachmentError(null);

    try {
      const response = await uploadAttachmentApi(file);

      if (response.success && response.data) {
        const data = response.data;
        setAttachments(prev => {
          const total = [...prev, {
            name: file.name,
            url: '#',
            uploadId: data.blob_id,
            attachmentId: data.blob_id,
            size: file.size || data.size,
            mimeType: file.type || data.type
          }];
          return total;
        });
      } else {
        throw new Error(response.error || 'Failed to upload file');
      }
    } catch (error) {
      console.error('[Upload] Failed:', error);
      setAttachmentError(error instanceof Error ? error.message : 'Failed to upload file');
    }
  };

  const handleClose = async () => {
    if (!isSending && (toInput.trim() || ccInput.trim() || bccInput.trim())) {
      await saveDraft();
    }
    onClose();
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
    setActiveDropdown(null);
  };
  const handleImageAttach = () => {
    imageInputRef.current?.click();
    setActiveDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={`compose-modal-${action}-${initialData?.id || 'new'}`}
            drag={!isFullScreen}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={clsx(
              "bg-white dark:bg-[#1A1A1A] flex flex-col overflow-hidden font-sans text-gray-800 dark:text-gray-200 z-[100]",
              isFullScreen
                ? "fixed top-0 bottom-0 right-0 left-[280px] w-auto h-auto rounded-none border-l-2 border-black/5 dark:border-white/5 !transform-none"
                : "fixed bottom-6 right-6 w-full max-w-[850px] h-[600px] border-2 border-black/5 dark:border-white/5 rounded-lg shadow-2xl"
            )}
          >
            <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileChange} />
            <input type="file" ref={imageInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            {/* Top Header / Actions */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex items-center justify-between px-4 py-3 border-b-2 border-black/5 dark:border-white/5 cursor-move bg-white dark:bg-[#1A1A1A] shrink-0"
            >
              <div className="flex items-center gap-3 pointer-events-none">
                <div className="flex items-center border-2 border-black/5 dark:border-white/5 rounded bg-white dark:bg-[#1A1A1A] overflow-hidden pointer-events-auto">
                  <button
                    onClick={() => sendMessage()}
                    disabled={isSending}
                    className="flex items-center gap-1.5 px-3 py-1 text-white bg-blue-600 cursor-pointer dark:text-white font-medium text-[13px] hover:bg-blue-700 dark:hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} className="fill-white dark:fill-white" />
                    {isSending ? 'Sending...' : 'Send'}
                  </button>
                  <div className="w-[2px] h-5 bg-black/5 dark:bg-white/5"></div>
                  <button
                    onClick={() => {
                      const scheduledTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now
                      sendMessage(scheduledTime);
                    }}
                    disabled={isSending}
                    className="flex items-center gap-1.5 px-3 py-1 text-white bg-teal-600 cursor-pointer dark:text-white font-medium text-[13px] hover:bg-teal-700 dark:hover:bg-teal-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Clock size={14} />
                    {isSending ? 'Scheduling...' : 'Send Later'}
                  </button>
                </div>

                <div className="w-[2px] h-5 bg-black/5 dark:bg-white/5 mx-1"></div>

                <div className="relative">
                  <button onClick={() => toggleDropdown('remind')} className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 pointer-events-auto">
                    <Clock size={16} strokeWidth={3} />
                  </button>

                  {activeDropdown === 'remind' && (
                    <div className="absolute top-full left-[-20px] mt-2 w-72 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded-lg shadow-xl z-[200] p-4 pointer-events-auto text-left flex flex-col gap-4 text-[14px]">
                      <div className="font-medium text-gray-800 dark:text-gray-200 text-[15px]">Remind me</div>

                      <div className="flex flex-col gap-2.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="remindType" className="w-4 h-4 accent-blue-600 text-blue-600 focus:ring-blue-500 border-gray-300" defaultChecked />
                          <span className="text-gray-700 dark:text-gray-300">On a time</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="remindType" className="w-4 h-4 accent-blue-600 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="text-gray-700 dark:text-gray-300">On every reply</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="remindType" className="w-4 h-4 accent-blue-600 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="text-gray-700 dark:text-gray-300">If no replies until</span>
                        </label>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="text-gray-800 dark:text-gray-200 font-medium">When</div>
                        <select className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded px-2 py-2 text-gray-700 dark:text-gray-300 outline-none focus:border-blue-500">
                          <option>10 minutes</option>
                          <option>1 hour</option>
                          <option>Tomorrow</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2.5">
                        <div className="text-gray-800 dark:text-gray-200 font-medium">Send reminder as a</div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="sendAs" className="w-4 h-4 accent-blue-600 text-blue-600 focus:ring-blue-500 border-gray-300" defaultChecked />
                          <span className="text-gray-700 dark:text-gray-300">Notification</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="sendAs" className="w-4 h-4 accent-blue-600 text-blue-600 focus:ring-blue-500 border-gray-300" />
                          <span className="text-gray-700 dark:text-gray-300">Mail</span>
                        </label>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input type="checkbox" className="w-4 h-4 accent-blue-600 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                        <span className="text-gray-700 dark:text-gray-300">Remind Recipients also</span>
                      </label>

                      <div className="flex items-center gap-2 pt-2">
                        <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors">Add reminder</button>
                        <button onClick={() => toggleDropdown('remind')} className="px-4 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded font-medium transition-colors">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => toggleDropdown('secure')} className="cursor-pointer relative text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 pointer-events-auto">
                    <Mail size={16} strokeWidth={3} />
                    <span className="absolute top-1 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#121212]"></span>
                  </button>

                  {activeDropdown === 'secure' && (
                    <div className="absolute top-full left-[-20px] mt-2 w-80 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded-lg shadow-xl z-[200] p-5 pointer-events-auto text-left flex flex-col gap-4 text-[14px]">
                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-[16px]">Confidential Mail</div>

                      <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Recipient won't have the option to forward, copy, print, or download this mail.
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="text-gray-900 dark:text-gray-100 font-medium">Mail Expiry</div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 z-10">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          </div>

                          <div
                            onClick={() => setExpiryOpen(!expiryOpen)}
                            className={`w-full bg-white dark:bg-[#1A1A1A] border rounded-md pl-10 pr-3 py-2 text-gray-800 dark:text-gray-200 cursor-pointer flex items-center justify-between transition-colors ${expiryOpen ? 'border-blue-500 ring-1 ring-blue-500 rounded-b-none' : 'border-black/5 dark:border-white/10 hover:border-black/10 dark:hover:border-white/20'}`}
                          >
                            <span>{expiry}</span>
                            <ChevronDown size={14} className="text-gray-500" />
                          </div>

                          {expiryOpen && (
                            <div className="absolute top-full left-0 w-full bg-white dark:bg-[#1A1A1A] border border-blue-500 border-t-0 rounded-b-md shadow-lg z-[210] overflow-hidden">
                              {['1 week', '1 month', '1 year'].map(option => (
                                <div
                                  key={option}
                                  onClick={() => { setExpiry(option); setExpiryOpen(false); }}
                                  className={`pl-10 pr-3 py-2 cursor-pointer ${expiry === option ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200'}`}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-gray-600 dark:text-gray-400 text-[13px]">
                        This mail will expire by <span className="font-semibold text-gray-800 dark:text-gray-200">Sun, Aug 02, 2026</span>
                      </div>

                      <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        Recipient will receive OTP Passphrase to his/her mailbox.
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors cursor-pointer">Apply</button>
                        <button onClick={() => toggleDropdown('secure')} className="px-5 py-1.5 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-300 rounded font-medium transition-colors cursor-pointer">Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => toggleDropdown('more')} className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 pointer-events-auto">
                    <MoreVertical size={16} strokeWidth={3} />
                  </button>

                  {activeDropdown === 'more' && (
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded-lg shadow-xl z-[200] py-2 pointer-events-auto text-left text-[14px] text-gray-700 dark:text-gray-200">

                      {/* Priority Section */}
                      <div className="px-4 py-1 text-[13px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        Priority : <div className="flex-1 h-px bg-black/10 dark:bg-white/10"></div>
                      </div>
                      <div className="mx-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded cursor-pointer flex items-center gap-3">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><polygon points="12 2 22 20 2 20" /></svg> High
                      </div>
                      <div className="mx-2 px-2 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded cursor-pointer flex items-center gap-3">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-500"><polygon points="12 2 22 20 2 20" /></svg> Medium
                      </div>
                      <div className="mx-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded cursor-pointer flex items-center gap-3">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><polygon points="12 2 22 20 2 20" /></svg> Low
                      </div>

                      {/* Insert Section */}
                      <div className="px-4 py-1 mt-1 text-[13px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        Insert : <div className="flex-1 h-px bg-black/10 dark:bg-white/10"></div>
                      </div>
                      <div className="mx-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded cursor-pointer">
                        Template
                      </div>
                      <div className="mx-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded cursor-pointer">
                        Signature
                      </div>

                      {/* Send Options Section */}
                      <div className="px-4 py-1 mt-1 text-[13px] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        Send Options :
                      </div>

                      <div className="group/encoding relative">
                        <div className="mx-2 px-2 py-1.5 group-hover/encoding:bg-gray-100 dark:group-hover/encoding:bg-white/5 rounded cursor-pointer flex items-center justify-between">
                          Encoding <ChevronDown size={14} className="-rotate-90" />
                        </div>

                        {/* Submenu */}
                        <div className="hidden group-hover/encoding:block absolute top-0 left-full ml-1 w-52 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded-lg shadow-xl z-[210] py-2 max-h-[220px] overflow-y-auto">
                          {['UTF-8', 'Big5', 'EUC-JP', 'EUC-KR', 'GB2312', 'ISO-2022-JP', 'ISO-8859-1', 'KOI8-R', 'Shift_JIS', 'US-ASCII', 'WINDOWS-1250', 'WINDOWS-1251', 'X-WINDOWS-ISO2022JP'].map(enc => (
                            <div key={enc} className={`mx-2 px-2 py-1.5 rounded cursor-pointer text-[14px] ${enc === 'UTF-8' ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                              {enc}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mx-2 px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded cursor-pointer flex items-center justify-between">
                        Ask Receipt
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="group/tag relative">
                        <div className="mx-2 px-2 py-1.5 group-hover/tag:bg-gray-100 dark:group-hover/tag:bg-white/5 rounded cursor-pointer flex items-center justify-between">
                          Add Tag <ChevronDown size={14} className="-rotate-90" />
                        </div>

                        {/* Add Tag Submenu */}
                        <div className="hidden group-hover/tag:block absolute top-0 left-full ml-1 w-64 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded-lg shadow-xl z-[210] p-4">
                          <div className="flex items-center gap-2 border-b-2 border-black/20 dark:border-white/80 pb-2 mb-4">
                            <input
                              type="text"
                              value={tagInput}
                              disabled={tags.length >= 5}
                              maxLength={12}
                              placeholder={tags.length >= 5 ? "Max 5 tags" : ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val.includes(',')) {
                                  const newTags = val.split(',')
                                    .map(t => t.trim())
                                    .filter(t => t && t.length <= 12 && !tags.includes(t));

                                  const availableSlots = 5 - tags.length;
                                  const tagsToAdd = newTags.slice(0, availableSlots);

                                  if (tagsToAdd.length > 0) setTags([...tags, ...tagsToAdd]);
                                  setTagInput("");
                                } else {
                                  setTagInput(val);
                                }
                              }}
                              className="flex-1 bg-transparent outline-none text-[15px] text-gray-800 dark:text-gray-200 placeholder:text-gray-400 disabled:opacity-50"
                            />
                          </div>

                          {tags.length === 0 ? (
                            <div className="text-[15px] text-gray-800 dark:text-gray-200">
                              You do not have any entities yet.
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {tags.map(tag => (
                                <div key={tag} className="px-3 py-1 bg-gray-200 dark:bg-white/20 text-gray-800 dark:text-gray-200 rounded-full text-[13px] flex items-center gap-1.5 font-medium shadow-sm">
                                  {tag}
                                  <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[13px] text-gray-500 dark:text-gray-400 shrink-0 pointer-events-auto">
                {sendError && (
                  <span className="text-red-500 font-medium">{sendError}</span>
                )}
                <button onClick={discardDraft} className="cursor-pointer hover:text-red-500 font-medium transition-colors">Discard</button>
                <button onClick={saveDraft} className="cursor-pointer hover:text-gray-800 font-medium dark:hover:text-gray-200 transition-colors">
                  {lastSaved ? 'Auto saved' : 'Save draft'}
                </button>
                <button className="flex font-medium cursor-pointer items-center gap-1.5 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  <UserPlus size={14} strokeWidth={3} />
                  Share Draft
                </button>
                <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10 mx-1"></div>
                <button onClick={() => setIsFullScreen(!isFullScreen)} className="cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors p-1">
                  {isFullScreen ? <Minimize2 size={16} strokeWidth={2.5} /> : <Maximize2 size={16} strokeWidth={2.5} />}
                </button>
                <button onClick={handleClose} className="cursor-pointer hover:text-red-500 transition-colors p-1">
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Email Fields */}
            <div className="flex flex-col px-4 shrink-0">
              {/* From */}
              <div className="flex items-center py-2.5 border-b border-black/5 dark:border-white/5 relative">
                <div className="relative">
                  <div onClick={() => toggleDropdown('from')} className="flex items-center text-[13px] text-gray-500 font-bold w-16 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none">
                    From <ChevronDown size={14} className="ml-1" />
                  </div>

                  {activeDropdown === 'from' && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded-lg shadow-xl z-[200] py-1">
                      {identitiesLoading ? (
                        <div className="px-4 py-2 text-[13px] text-gray-500">Loading identities...</div>
                      ) : identitiesError ? (
                        <div className="px-4 py-2 text-[13px] text-red-500">{identitiesError}</div>
                      ) : identities.length === 0 ? (
                        <div className="px-4 py-2 text-[13px] text-gray-500">No identities available</div>
                      ) : (
                        identities.map((acc) => (
                          <div
                            key={acc.id}
                            onClick={() => {
                              setFromAccount({
                                name: acc.displayName || acc.email.split('@')[0],
                                email: acc.email
                              });
                              toggleDropdown('from');
                            }}
                            className={`px-4 py-2 text-[13px] cursor-pointer flex items-center ${fromAccount?.email === acc.email ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold' : 'hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200'}`}
                          >
                            <span className="w-20 shrink-0 truncate">{acc.displayName || acc.email.split('@')[0]}</span>
                            <span className={`px-2 py-0.5 rounded text-[12px] ${fromAccount?.email === acc.email ? 'bg-blue-100/50 dark:bg-blue-800/30' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>{acc.email}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-center">
                  <div className="w-px h-3.5 bg-black/5 dark:bg-white/5 mr-2"></div>
                  {fromAccount ? (
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => toggleDropdown('from')}>
                      <span className="text-[13px] font-semibold text-gray-700 dark:text-white">{fromAccount.name}</span>
                      <span className="font-medium bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-500 dark:text-white text-[12px]">{fromAccount.email}</span>
                    </div>
                  ) : (
                    <div className="text-[13px] text-gray-500">Loading...</div>
                  )}
                </div>
              </div>

              {/* To */}
              <div className="flex items-center py-2.5 border-b border-black/5 dark:border-white/5 relative group">
                <div className="relative">
                  <div onClick={() => toggleDropdown('to')} className="font-bold flex items-center text-[13px] text-gray-500 w-12 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none">
                    To <ChevronDown size={12} className="ml-0.5" />
                  </div>
                  {activeDropdown === 'to' && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 py-1">
                      <div className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">Select Contact...</div>
                      <div className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">Group: Team</div>
                    </div>
                  )}
                </div>
                <div className="flex-1 flex items-center">
                  <div className="w-px h-3.5 bg-black/5 dark:bg-white/5 mr-2"></div>
                  <input type="text" className="flex-1 outline-none bg-transparent text-[13px]" autoFocus value={toInput} onChange={(e) => setToInput(e.target.value)} />
                </div>
              </div>

              {/* Cc & Bcc */}
              <div className="flex items-center border-b border-black/5 dark:border-white/5">
                {/* Cc */}
                <div className="flex-1 flex items-center py-2.5 border-r border-black/5 dark:border-white/5 pr-4">
                  <div className="relative">
                    <div onClick={() => toggleDropdown('cc')} className="font-bold flex items-center text-[13px] text-gray-500 w-12 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none">
                      Cc <ChevronDown size={12} className="ml-0.5" />
                    </div>
                    {activeDropdown === 'cc' && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 py-1">
                        <div className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">Select Contact...</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="w-px h-3.5 bg-black/5 dark:bg-white/5 mr-2"></div>
                    <input type="text" className="flex-1 outline-none bg-transparent text-[13px]" value={ccInput} onChange={(e) => setCcInput(e.target.value)} />
                  </div>
                </div>

                {/* Bcc */}
                <div className="flex-1 flex items-center py-2.5 pl-4">
                  <div className="relative">
                    <div onClick={() => toggleDropdown('bcc')} className="font-bold flex items-center text-[13px] text-gray-500 w-12 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 select-none">
                      Bcc <ChevronDown size={12} className="ml-0.5" />
                    </div>
                    {activeDropdown === 'bcc' && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 py-1">
                        <div className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">Select Contact...</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center">
                    <div className="w-px h-3.5 bg-black/5 dark:bg-white/5 mr-2"></div>
                    <input type="text" className="flex-1 outline-none bg-transparent text-[13px]" value={bccInput} onChange={(e) => setBccInput(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="flex items-center py-2.5 border-b border-black/5 dark:border-white/5">
                <input type="text" placeholder="Subject" className="flex-1 outline-none bg-transparent text-[13px] placeholder:text-gray-400" value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} />
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50/50 dark:bg-[#1A1A1A] border-b border-black/5 dark:border-white/5 text-gray-600 dark:text-gray-400 flex-wrap shrink-0 relative z-[60]">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button onClick={() => toggleDropdown('attach')} className={clsx("hover:text-gray-900 dark:hover:text-gray-100 p-1 flex items-center gap-0.5 transition-colors rounded", activeDropdown === 'attach' && "bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10")}>
                    <Paperclip size={15} /> <ChevronDown size={12} />
                  </button>
                  {activeDropdown === 'attach' && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 py-1">
                      <div onClick={handleFileAttach} className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-2">
                        <Paperclip size={14} /> File
                      </div>
                      <div onClick={handleImageAttach} className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-2">
                        <ImageIcon size={14} /> Images
                      </div>
                      <div onClick={handleRecordSound} className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Mic size={14} /> Record Sound
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-px h-4 bg-black/5 dark:bg-white/5"></div>

              <div className="flex items-center gap-1">
                <button onClick={() => editor?.chain().focus().toggleBold().run()} className={clsx("hover:text-gray-900 dark:hover:text-gray-100 font-serif font-bold px-1.5 py-1 text-[13px] rounded", editor?.isActive('bold') && "bg-black/10 dark:bg-white/20 text-gray-900 dark:text-white")}>B</button>
                <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={clsx("hover:text-gray-900 dark:hover:text-gray-100 font-serif italic px-1.5 py-1 text-[13px] rounded", editor?.isActive('italic') && "bg-black/10 dark:bg-white/20 text-gray-900 dark:text-white")}>I</button>
                <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={clsx("hover:text-gray-900 dark:hover:text-gray-100 font-serif underline px-1.5 py-1 text-[13px] rounded", editor?.isActive('underline') && "bg-black/10 dark:bg-white/20 text-gray-900 dark:text-white")}>U</button>
                <button onClick={() => editor?.chain().focus().toggleStrike().run()} className={clsx("hover:text-gray-900 dark:hover:text-gray-100 font-serif line-through px-1.5 py-1 text-[13px] rounded", editor?.isActive('strike') && "bg-black/10 dark:bg-white/20 text-gray-900 dark:text-white")}>S</button>
              </div>

              <div className="w-px h-4 bg-black/5 dark:bg-white/5"></div>

              <div className="relative">
                <button onClick={() => toggleDropdown('font')} className={clsx("flex items-center gap-1 text-[13px] hover:text-gray-900 dark:hover:text-gray-100 px-1 py-0.5 rounded transition-colors", activeDropdown === 'font' && "bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10")}>
                  {font} <ChevronDown size={12} />
                </button>
                {activeDropdown === 'font' && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 py-1">
                    {['Arial', 'Verdana', 'Tahoma', 'Times New Roman'].map(f => (
                      <div key={f} onClick={() => { setFont(f); editor?.chain().focus().setFontFamily(f).run(); setActiveDropdown(null); }} className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">{f}</div>
                    ))}
                    <div className="px-2 py-1 border-t border-black/5 dark:border-white/5 mt-1">
                      <input
                        type="text"
                        placeholder="Custom Font..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-[12px] outline-none focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              setFont(val);
                              editor?.chain().focus().setFontFamily(val).run();
                              setActiveDropdown(null);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-4 bg-black/5 dark:bg-white/5"></div>

              <div className="relative">
                <button onClick={() => toggleDropdown('size')} className={clsx("flex items-center gap-1 text-[13px] hover:text-gray-900 dark:hover:text-gray-100 px-1 py-0.5 rounded transition-colors", activeDropdown === 'size' && "bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10")}>
                  {fontSize} <ChevronDown size={12} />
                </button>
                {activeDropdown === 'size' && (
                  <div className="absolute top-full left-0 mt-1 w-24 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 py-1 flex flex-col">
                    {['8', '10', '12', '14', '18'].map(s => (
                      <div key={s} onClick={() => { setFontSize(s); editor?.chain().focus().setFontSize(`${s}pt`).run(); setActiveDropdown(null); }} className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer text-center">{s}</div>
                    ))}
                    <div className="px-2 py-1 border-t border-black/5 dark:border-white/5 mt-1">
                      <input
                        type="number"
                        placeholder="Custom..."
                        className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded px-2 py-1 text-[12px] text-center outline-none focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = e.currentTarget.value;
                            if (val) {
                              setFontSize(val);
                              editor?.chain().focus().setFontSize(`${val}pt`).run();
                              setActiveDropdown(null);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="w-px h-4 bg-black/5 dark:bg-white/5"></div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button onClick={() => toggleDropdown('color')} className={clsx("flex items-center gap-0.5 hover:text-gray-900 dark:hover:text-gray-100 px-1 py-0.5 rounded transition-colors", activeDropdown === 'color' && "bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10")}>
                    <span className="font-bold border-b-2 border-red-500 text-[13px] leading-none pb-0.5">A</span> <ChevronDown size={12} />
                  </button>
                  {activeDropdown === 'color' && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 p-2 flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1">
                        {['#000', '#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#888'].map(c => (
                          <div key={c} onClick={() => { editor?.chain().focus().setColor(c).run(); setActiveDropdown(null); }} className="w-5 h-5 rounded cursor-pointer border-2 border-black/5 dark:border-white/5" style={{ backgroundColor: c }}></div>
                        ))}
                      </div>
                      <div onClick={() => { editor?.chain().focus().unsetColor().run(); setActiveDropdown(null); }} className="text-center text-[12px] font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer py-1 border border-black/5 dark:border-white/5 rounded bg-gray-50 dark:bg-white/5 transition-colors">
                        None
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button onClick={() => toggleDropdown('bgcolor')} className="flex items-center gap-0.5 hover:text-gray-900 dark:hover:text-gray-100 px-1">
                    <span className="bg-yellow-200 dark:bg-yellow-700 dark:text-white text-black px-0.5 font-bold text-[13px] leading-tight">A</span> <ChevronDown size={12} />
                  </button>
                  {activeDropdown === 'bgcolor' && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 p-2 flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1">
                        {['#fff', '#ffeb3b', '#4caf50', '#2196f3', '#f44336', '#9c27b0', '#00bcd4', '#e0e0e0'].map(c => (
                          <div key={c} onClick={() => { editor?.chain().focus().setHighlight({ color: c }).run(); setActiveDropdown(null); }} className="w-5 h-5 rounded cursor-pointer border-2 border-black/5 dark:border-white/5" style={{ backgroundColor: c }}></div>
                        ))}
                      </div>
                      <div onClick={() => { editor?.chain().focus().unsetHighlight().run(); setActiveDropdown(null); }} className="text-center text-[12px] font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer py-1 border border-black/5 dark:border-white/5 rounded bg-gray-50 dark:bg-white/5 transition-colors">
                        None
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-px h-4 bg-black/5 dark:bg-white/5"></div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <button onClick={() => toggleDropdown('align')} className={clsx("flex items-center gap-0.5 hover:text-gray-900 dark:hover:text-gray-100 p-1 rounded transition-colors", activeDropdown === 'align' && "bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10")}>
                    {alignment === 'left' ? <AlignLeft size={15} /> : alignment === 'center' ? <AlignCenter size={15} /> : alignment === 'right' ? <AlignRight size={15} /> : <AlignJustify size={15} />}
                    <ChevronDown size={12} />
                  </button>
                  {activeDropdown === 'align' && (
                    <div className="absolute top-full left-0 mt-1 w-32 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 py-1">
                      {['left', 'center', 'right', 'justify'].map(a => (
                        <div key={a} onClick={() => { setAlignment(a); editor?.chain().focus().setTextAlign(a).run(); setActiveDropdown(null); }} className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer capitalize flex items-center gap-2">
                          {a === 'left' ? <AlignLeft size={14} /> : a === 'center' ? <AlignCenter size={14} /> : a === 'right' ? <AlignRight size={14} /> : <AlignJustify size={14} />} {a}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button onClick={() => toggleDropdown('list')} className={clsx("flex items-center gap-0.5 hover:text-gray-900 dark:hover:text-gray-100 p-1 rounded transition-colors", activeDropdown === 'list' && "bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10")}>
                    <List size={15} /> <ChevronDown size={12} />
                  </button>
                  {activeDropdown === 'list' && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-[#1A1A1A] border-2 border-black/5 dark:border-white/5 rounded shadow-lg z-50 py-1">
                      <div onClick={() => { editor?.chain().focus().toggleBulletList().run(); setActiveDropdown(null); }} className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-2">
                        <List size={14} /> Bulleted List
                      </div>
                      <div onClick={() => { editor?.chain().focus().toggleOrderedList().run(); setActiveDropdown(null); }} className="px-3 py-1.5 text-[13px] hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer flex items-center gap-2">
                        <ListOrdered size={14} /> Numbered List
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-px h-4 bg-black/5 dark:bg-white/5 mx-1"></div>

                <button
                  onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                  className="hover:text-gray-900 dark:hover:text-gray-100 p-1 rounded transition-colors"
                  title="Insert Divider"
                >
                  <Minus size={15} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 p-6 bg-white dark:bg-[#1A1A1A] overflow-y-auto flex flex-col" onClick={() => setActiveDropdown(null)}>
              <EditorContent editor={editor} className="flex-1 w-full outline-none text-[14px] text-gray-800 dark:text-gray-200 focus:outline-none focus-visible:outline-none [&_.ProseMirror:focus]:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror]:[font-family:var(--editor-font)] [&_.ProseMirror]:[text-align:var(--editor-align)] [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5" style={{ '--editor-font': font, '--editor-align': alignment } as any} />

              {/* Immutable quoted history rendered completely outside the editor */}
              {quoteHTML && (
                <div className="mt-4 pt-4 opacity-80 pl-2">
                  <div className="text-[14px] leading-[1.6] text-text-primary email-content" dangerouslySetInnerHTML={{ __html: quoteHTML }} />
                </div>
              )}
            </div>

            {/* Attachments */}
            {(attachments.length > 0 || attachmentError) && (
              <div className="px-6 py-4 bg-gray-50/50 dark:bg-white/5 border-t-2 border-black/5 dark:border-white/5 shrink-0 max-h-[120px] overflow-y-auto">
                {attachmentError && (
                  <div className="text-black dark:text-white text-[13px] font-medium mb-2">{attachmentError}</div>
                )}
                {attachments.length > 0 && (
                  <>
                    <h4 className="text-[13px] font-semibold text-gray-500 mb-2">Attachments ({attachments.length})</h4>
                    <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                      {attachments.map((file, idx) => (
                        <div key={idx} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white dark:bg-black/20 rounded-lg border border-black/5 dark:border-white/10 shadow-sm">
                          {(file.name || '').endsWith('.png') || (file.name || '').endsWith('.jpg') ? (
                            <ImageIcon size={14} className="text-blue-500" />
                          ) : (
                            <Paperclip size={14} className="text-orange-500" />
                          )}
                          <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                            {file.name || 'Unnamed file'}
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); setAttachments(prev => prev.filter((_, i) => i !== idx)); }} className="text-gray-400 hover:text-red-500 p-0.5"><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Recording Overlay */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  key="recording-overlay"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-x-0 bottom-0 top-[140px] z-[80] flex items-center justify-center bg-white dark:bg-[#000] backdrop-blur-sm rounded-b-lg"
                >
                  <div className="flex flex-col items-center gap-4 p-8 bg-white dark:bg-[#000] rounded-3xl w-[300px]">
                    <div className="relative flex items-center justify-center w-24 h-24 mb-2">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute inset-0 bg-red-500 rounded-full"
                      />
                      <div className="relative z-10 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/40">
                        <Mic size={32} />
                      </div>
                    </div>

                    <div className="text-4xl font-light font-mono text-gray-800 dark:text-gray-100 tracking-wider mb-2">
                      {Math.floor(recordTime / 60).toString().padStart(2, '0')}:
                      {(recordTime % 60).toString().padStart(2, '0')}
                    </div>

                    <div className="flex items-center gap-3 w-full">
                      <button onClick={handleCancelRecording} className="flex-1 py-3 rounded-full cursor-pointer font-semibold text-[13px] bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleStopRecording} className="flex-1 py-3 rounded-full cursor-pointer font-semibold text-[13px] bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors">
                        Stop & Attach
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="success-toast"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[200] bg-blue-700 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3"
          >
            <Check size={20} className="flex-shrink-0" />
            <span className="font-medium text-[14px]">Message submitted</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
