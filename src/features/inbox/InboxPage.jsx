import { useEffect, useRef, useState } from 'react';
import { Inbox as InboxIcon, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { cn } from '@/lib/utils';
import { timeAgo } from '@/lib/time';
import { useViewer } from '@/lib/viewer';
import { useMarkThreadRead, useSendMessage, useThreadsQuery } from './inboxQueries';

export default function InboxPage() {
  const { role, isAdmin } = useViewer();
  const { data: threads = [], isLoading } = useThreadsQuery();
  const markRead = useMarkThreadRead();
  const send = useSendMessage();
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef(null);

  // Keep a valid selection: the first thread by default, and a fresh one when switching roles.
  const selected = threads.find((t) => t.id === selectedId) ?? threads[0] ?? null;

  useEffect(() => {
    if (selected?.unread) markRead.mutate(selected.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, selected?.unread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [selected?.messages.length, selected?.id]);

  async function submit() {
    if (!selected || !draft.trim()) return;
    try {
      await send.mutateAsync({ id: selected.id, text: draft });
      setDraft('');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Inbox"
        title="Messages"
        description={
          isAdmin
            ? 'Conversations with ambassadors. Send a message and a simulated reply arrives a moment later.'
            : 'Conversations with your campaign team.'
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" className="text-slate-300" />
        </div>
      ) : threads.length === 0 ? (
        <EmptyState icon={InboxIcon} title="No conversations yet" />
      ) : (
        <Card className="grid h-[min(34rem,calc(100dvh-14rem))] min-h-[28rem] grid-rows-[auto_minmax(0,1fr)] overflow-hidden md:grid-cols-[300px_1fr] md:grid-rows-1">
          <ul className="max-h-44 overflow-y-auto border-b border-slate-200 md:max-h-none md:border-b-0 md:border-r" aria-label="Conversations">
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(thread.id)}
                  className={cn(
                    'flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50',
                    selected?.id === thread.id && 'bg-signal/5',
                  )}
                >
                  <span
                    className={cn('mt-1.5 size-2 shrink-0 rounded-full', thread.unread ? 'bg-signal' : 'bg-transparent')}
                    aria-label={thread.unread ? 'Unread' : undefined}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className={cn('truncate text-sm', thread.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700')}>
                        {isAdmin ? thread.ambassadorName : thread.subject}
                      </span>
                      <span className="shrink-0 text-[0.65rem] text-slate-400">{timeAgo(thread.last.at)}</span>
                    </span>
                    <span className="block truncate text-xs text-slate-500">{isAdmin ? thread.subject : thread.campaignName}</span>
                    <span className="block truncate text-xs text-slate-400">{thread.last.text}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <section className="flex min-h-0 flex-col" aria-label="Conversation">
              <header className="border-b border-slate-200 px-5 py-3">
                <h2 className="text-sm font-bold text-slate-900">{selected.subject}</h2>
                <p className="text-xs text-slate-500">
                  {selected.ambassadorName} · {selected.campaignName}
                </p>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 px-5 py-4">
                {selected.messages.map((message) => {
                  const mine = message.from === role;
                  return (
                    <div key={message.id} className={cn('flex', mine ? 'justify-end' : 'justify-start')}>
                      <div className="max-w-[80%]">
                        {!mine ? <p className="mb-0.5 text-[0.65rem] font-semibold text-slate-500">{message.author}</p> : null}
                        <p
                          className={cn(
                            'rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                            mine ? 'rounded-br-md bg-signal text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-800',
                          )}
                        >
                          {message.text}
                        </p>
                        <p className={cn('mt-0.5 text-[0.6rem] text-slate-400', mine && 'text-right')}>
                          {timeAgo(message.at)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="flex items-end gap-2 border-t border-slate-200 p-3">
                <Textarea
                  rows={2}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      submit();
                    }
                  }}
                  placeholder="Write a reply… (Enter to send)"
                  aria-label="Message"
                  className="min-h-0 resize-none"
                />
                <Button onClick={submit} disabled={send.isPending || !draft.trim()} size="icon" aria-label="Send">
                  <Send />
                </Button>
              </div>
            </section>
          ) : null}
        </Card>
      )}
    </div>
  );
}
